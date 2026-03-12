using Microsoft.EntityFrameworkCore;
using KYC_OPS.Api.Data;
using KYC_OPS.Api.Data.DTOs.Usuario;
using KYC_OPS.Api.Models;

namespace KYC_OPS.Api.Services;

/// <summary>
/// Implementación del servicio de usuarios. Consulta BD vía EF Core.
/// </summary>
public class UsuarioService : IUsuarioService
{
    private readonly ApplicationDbContext _db;
    private readonly ILogger<UsuarioService> _logger;

    public UsuarioService(ApplicationDbContext db, ILogger<UsuarioService> logger)
    {
        ArgumentNullException.ThrowIfNull(db);
        ArgumentNullException.ThrowIfNull(logger);
        _db = db;
        _logger = logger;
    }

    /// <inheritdoc />
    public async Task<UsuarioResponseDto?> GetByRegistroAsync(int registro, CancellationToken cancellationToken = default)
    {
        var usuario = await _db.Usuarios
            .AsNoTracking()
            .Include(u => u.Rol)
            .ThenInclude(r => r!.RolPermisos)
            .ThenInclude(rp => rp.Permiso)
            .FirstOrDefaultAsync(u => u.Registro == registro, cancellationToken)
            .ConfigureAwait(false);

        if (usuario is null)
        {
            _logger.LogDebug("Usuario no encontrado para registro {Registro}", registro);
            return null;
        }

        return MapToResponse(usuario);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<UsuarioListDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _db.Usuarios
            .AsNoTracking()
            .Include(u => u.Rol)
            .OrderBy(u => u.Nombre)
            .Select(u => new UsuarioListDto
            {
                Id = u.Id,
                Nombre = u.Nombre,
                Iniciales = u.Iniciales,
                Registro = u.Registro,
                Correo = u.Correo,
                Activo = u.Activo,
                RolId = u.RolId,
                RolNombre = u.Rol != null ? u.Rol.Nombre : ""
            })
            .ToListAsync(cancellationToken)
            .ConfigureAwait(false);
    }

    /// <inheritdoc />
    public async Task<UsuarioResponseDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var usuario = await _db.Usuarios
            .AsNoTracking()
            .Include(u => u.Rol)
            .ThenInclude(r => r!.RolPermisos)
            .ThenInclude(rp => rp.Permiso)
            .FirstOrDefaultAsync(u => u.Id == id, cancellationToken)
            .ConfigureAwait(false);

        return usuario is null ? null : MapToResponse(usuario);
    }

    /// <inheritdoc />
    public async Task<UsuarioResponseDto> CreateAsync(UsuarioCreateDto dto, CancellationToken cancellationToken = default)
    {
        var exists = await _db.Usuarios.AnyAsync(u => u.Registro == dto.Registro, cancellationToken).ConfigureAwait(false);
        if (exists)
            throw new InvalidOperationException($"Ya existe un usuario con registro {dto.Registro}.");

        var rolExists = await _db.Roles.AnyAsync(r => r.Id == dto.RolId, cancellationToken).ConfigureAwait(false);
        if (!rolExists)
            throw new InvalidOperationException("El rol indicado no existe.");

        var entity = new Usuario
        {
            Nombre = dto.Nombre,
            Iniciales = dto.Iniciales,
            Registro = dto.Registro,
            Correo = dto.Correo,
            ResponsableId = dto.ResponsableId,
            Extension = dto.Extension,
            RolId = dto.RolId,
            Activo = true,
            FechaCreacion = DateTime.UtcNow
        };
        _db.Usuarios.Add(entity);
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
        _logger.LogInformation("Usuario creado: Id={Id}, Registro={Registro}", entity.Id, entity.Registro);

        var created = await _db.Usuarios
            .AsNoTracking()
            .Include(u => u.Rol)
            .ThenInclude(r => r!.RolPermisos)
            .ThenInclude(rp => rp.Permiso)
            .FirstAsync(u => u.Id == entity.Id, cancellationToken)
            .ConfigureAwait(false);
        return MapToResponse(created);
    }

    /// <inheritdoc />
    public async Task<UsuarioResponseDto?> UpdateAsync(int id, UsuarioUpdateDto dto, CancellationToken cancellationToken = default)
    {
        var entity = await _db.Usuarios.FindAsync(new object[] { id }, cancellationToken).ConfigureAwait(false);
        if (entity is null) return null;

        var rolExists = await _db.Roles.AnyAsync(r => r.Id == dto.RolId, cancellationToken).ConfigureAwait(false);
        if (!rolExists)
            throw new InvalidOperationException("El rol indicado no existe.");

        entity.Nombre = dto.Nombre;
        entity.Iniciales = dto.Iniciales;
        entity.Correo = dto.Correo;
        entity.ResponsableId = dto.ResponsableId;
        entity.Extension = dto.Extension;
        entity.RolId = dto.RolId;
        entity.FechaModificacion = DateTime.UtcNow;
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
        _logger.LogInformation("Usuario actualizado: Id={Id}", id);

        var updated = await _db.Usuarios
            .AsNoTracking()
            .Include(u => u.Rol)
            .ThenInclude(r => r!.RolPermisos)
            .ThenInclude(rp => rp.Permiso)
            .FirstAsync(u => u.Id == id, cancellationToken)
            .ConfigureAwait(false);
        return MapToResponse(updated);
    }

    /// <inheritdoc />
    public async Task<bool> ActivateAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _db.Usuarios.FindAsync(new object[] { id }, cancellationToken).ConfigureAwait(false);
        if (entity is null) return false;
        entity.Activo = true;
        entity.FechaModificacion = DateTime.UtcNow;
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
        return true;
    }

    /// <inheritdoc />
    public async Task<bool> DeactivateAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _db.Usuarios.FindAsync(new object[] { id }, cancellationToken).ConfigureAwait(false);
        if (entity is null) return false;
        entity.Activo = false;
        entity.FechaModificacion = DateTime.UtcNow;
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
        return true;
    }

    private static UsuarioResponseDto MapToResponse(Usuario u)
    {
        var permisos = u.Rol?.RolPermisos?
            .Select(rp => rp.Permiso.Ruta)
            .ToList() ?? new List<string>();

        return new UsuarioResponseDto
        {
            Id = u.Id,
            Nombre = u.Nombre,
            Iniciales = u.Iniciales,
            Registro = u.Registro,
            Correo = u.Correo,
            ResponsableId = u.ResponsableId,
            Extension = u.Extension,
            Activo = u.Activo,
            FechaCreacion = u.FechaCreacion,
            FechaModificacion = u.FechaModificacion,
            Rol = u.Rol is null ? null : new RolInfoDto { Id = u.Rol.Id, Nombre = u.Rol.Nombre },
            Permisos = permisos
        };
    }
}
