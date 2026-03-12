using Microsoft.EntityFrameworkCore;
using KYC_OPS.Api.Data;
using KYC_OPS.Api.Data.DTOs.Rol;
using KYC_OPS.Api.Models;

namespace KYC_OPS.Api.Services;

/// <summary>Implementación del servicio de roles.</summary>
public class RolService : IRolService
{
    private readonly ApplicationDbContext _db;
    private readonly ILogger<RolService> _logger;

    public RolService(ApplicationDbContext db, ILogger<RolService> logger)
    {
        ArgumentNullException.ThrowIfNull(db);
        ArgumentNullException.ThrowIfNull(logger);
        _db = db;
        _logger = logger;
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<RolListDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _db.Roles
            .AsNoTracking()
            .Select(r => new RolListDto
            {
                Id = r.Id,
                Nombre = r.Nombre,
                PermisosCount = r.RolPermisos.Count
            })
            .OrderBy(r => r.Nombre)
            .ToListAsync(cancellationToken)
            .ConfigureAwait(false);
    }

    /// <inheritdoc />
    public async Task<RolResponseDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var rol = await _db.Roles
            .AsNoTracking()
            .Include(r => r.RolPermisos)
            .FirstOrDefaultAsync(r => r.Id == id, cancellationToken)
            .ConfigureAwait(false);

        if (rol is null) return null;

        return new RolResponseDto
        {
            Id = rol.Id,
            Nombre = rol.Nombre,
            PermisoIds = rol.RolPermisos.Select(rp => rp.PermisoId).ToList()
        };
    }

    /// <inheritdoc />
    public async Task<RolResponseDto> CreateAsync(RolCreateDto dto, CancellationToken cancellationToken = default)
    {
        var entity = new Rol { Nombre = dto.Nombre };
        _db.Roles.Add(entity);
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        if (dto.PermisoIds?.Count > 0)
        {
            var validIds = await _db.Permisos
                .Where(p => dto.PermisoIds.Contains(p.Id))
                .Select(p => p.Id)
                .ToListAsync(cancellationToken)
                .ConfigureAwait(false);
            foreach (var pid in validIds)
                _db.RolPermisos.Add(new RolPermiso { RolId = entity.Id, PermisoId = pid });
            await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
        }

        _logger.LogInformation("Rol creado: Id={Id}, Nombre={Nombre}", entity.Id, entity.Nombre);
        return (await GetByIdAsync(entity.Id, cancellationToken).ConfigureAwait(false))!;
    }

    /// <inheritdoc />
    public async Task<RolResponseDto?> UpdateAsync(int id, RolUpdateDto dto, CancellationToken cancellationToken = default)
    {
        var entity = await _db.Roles.FindAsync(new object[] { id }, cancellationToken).ConfigureAwait(false);
        if (entity is null) return null;

        entity.Nombre = dto.Nombre;
        var existing = await _db.RolPermisos.Where(rp => rp.RolId == id).ToListAsync(cancellationToken).ConfigureAwait(false);
        _db.RolPermisos.RemoveRange(existing);

        if (dto.PermisoIds?.Count > 0)
        {
            var validIds = await _db.Permisos
                .Where(p => dto.PermisoIds.Contains(p.Id))
                .Select(p => p.Id)
                .ToListAsync(cancellationToken)
                .ConfigureAwait(false);
            foreach (var pid in validIds)
                _db.RolPermisos.Add(new RolPermiso { RolId = id, PermisoId = pid });
        }

        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
        _logger.LogInformation("Rol actualizado: Id={Id}", id);
        return await GetByIdAsync(id, cancellationToken).ConfigureAwait(false);
    }

    /// <inheritdoc />
    public async Task<bool> SetPermisosAsync(int rolId, IReadOnlyList<int> permisoIds, CancellationToken cancellationToken = default)
    {
        var rol = await _db.Roles.FindAsync(new object[] { rolId }, cancellationToken).ConfigureAwait(false);
        if (rol is null) return false;

        var existing = await _db.RolPermisos.Where(rp => rp.RolId == rolId).ToListAsync(cancellationToken).ConfigureAwait(false);
        _db.RolPermisos.RemoveRange(existing);

        if (permisoIds.Count > 0)
        {
            var validIds = await _db.Permisos
                .Where(p => permisoIds.Contains(p.Id))
                .Select(p => p.Id)
                .ToListAsync(cancellationToken)
                .ConfigureAwait(false);
            foreach (var pid in validIds)
                _db.RolPermisos.Add(new RolPermiso { RolId = rolId, PermisoId = pid });
        }

        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
        return true;
    }
}
