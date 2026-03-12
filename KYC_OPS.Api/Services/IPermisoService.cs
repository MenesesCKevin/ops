using KYC_OPS.Api.Data.DTOs.Permiso;

namespace KYC_OPS.Api.Services;

/// <summary>Servicio de gestión de permisos.</summary>
public interface IPermisoService
{
    Task<IReadOnlyList<PermisoListDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<PermisoListDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<PermisoListDto> CreateAsync(PermisoCreateDto dto, CancellationToken cancellationToken = default);
    Task<PermisoListDto?> UpdateAsync(int id, PermisoUpdateDto dto, CancellationToken cancellationToken = default);
}
