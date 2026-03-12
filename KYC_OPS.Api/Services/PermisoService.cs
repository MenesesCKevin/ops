using Microsoft.EntityFrameworkCore;
using KYC_OPS.Api.Data;
using KYC_OPS.Api.Data.DTOs.Permiso;
using KYC_OPS.Api.Models;

namespace KYC_OPS.Api.Services;

/// <summary>Implementación del servicio de permisos.</summary>
public class PermisoService : IPermisoService
{
    private readonly ApplicationDbContext _db;
    private readonly ILogger<PermisoService> _logger;

    public PermisoService(ApplicationDbContext db, ILogger<PermisoService> logger)
    {
        ArgumentNullException.ThrowIfNull(db);
        ArgumentNullException.ThrowIfNull(logger);
        _db = db;
        _logger = logger;
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<PermisoListDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _db.Permisos
            .AsNoTracking()
            .OrderBy(p => p.Ruta)
            .Select(p => new PermisoListDto
            {
                Id = p.Id,
                Nombre = p.Nombre,
                Ruta = p.Ruta,
                Descripcion = p.Descripcion
            })
            .ToListAsync(cancellationToken)
            .ConfigureAwait(false);
    }

    /// <inheritdoc />
    public async Task<PermisoListDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _db.Permisos
            .AsNoTracking()
            .Where(p => p.Id == id)
            .Select(p => new PermisoListDto
            {
                Id = p.Id,
                Nombre = p.Nombre,
                Ruta = p.Ruta,
                Descripcion = p.Descripcion
            })
            .FirstOrDefaultAsync(cancellationToken)
            .ConfigureAwait(false);
    }

    /// <inheritdoc />
    public async Task<PermisoListDto> CreateAsync(PermisoCreateDto dto, CancellationToken cancellationToken = default)
    {
        var exists = await _db.Permisos.AnyAsync(p => p.Ruta == dto.Ruta, cancellationToken).ConfigureAwait(false);
        if (exists)
            throw new InvalidOperationException($"Ya existe un permiso con la ruta '{dto.Ruta}'.");

        var entity = new Permiso
        {
            Nombre = dto.Nombre,
            Descripcion = dto.Descripcion ?? "",
            Ruta = dto.Ruta
        };
        _db.Permisos.Add(entity);
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
        _logger.LogInformation("Permiso creado: Id={Id}, Ruta={Ruta}", entity.Id, entity.Ruta);
        return new PermisoListDto { Id = entity.Id, Nombre = entity.Nombre, Ruta = entity.Ruta, Descripcion = entity.Descripcion };
    }

    /// <inheritdoc />
    public async Task<PermisoListDto?> UpdateAsync(int id, PermisoUpdateDto dto, CancellationToken cancellationToken = default)
    {
        var entity = await _db.Permisos.FindAsync(new object[] { id }, cancellationToken).ConfigureAwait(false);
        if (entity is null) return null;

        var duplicate = await _db.Permisos
            .AnyAsync(p => p.Ruta == dto.Ruta && p.Id != id, cancellationToken)
            .ConfigureAwait(false);
        if (duplicate)
            throw new InvalidOperationException($"Ya existe otro permiso con la ruta '{dto.Ruta}'.");

        entity.Nombre = dto.Nombre;
        entity.Descripcion = dto.Descripcion ?? "";
        entity.Ruta = dto.Ruta;
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
        _logger.LogInformation("Permiso actualizado: Id={Id}", id);
        return new PermisoListDto { Id = entity.Id, Nombre = entity.Nombre, Ruta = entity.Ruta, Descripcion = entity.Descripcion };
    }
}
