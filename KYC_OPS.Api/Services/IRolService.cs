using KYC_OPS.Api.Data.DTOs.Rol;

namespace KYC_OPS.Api.Services;

/// <summary>Servicio de gestión de roles.</summary>
public interface IRolService
{
    Task<IReadOnlyList<RolListDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<RolResponseDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<RolResponseDto> CreateAsync(RolCreateDto dto, CancellationToken cancellationToken = default);
    Task<RolResponseDto?> UpdateAsync(int id, RolUpdateDto dto, CancellationToken cancellationToken = default);
    Task<bool> SetPermisosAsync(int rolId, IReadOnlyList<int> permisoIds, CancellationToken cancellationToken = default);
}
