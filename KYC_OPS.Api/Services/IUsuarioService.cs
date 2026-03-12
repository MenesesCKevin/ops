using KYC_OPS.Api.Data.DTOs.Usuario;

namespace KYC_OPS.Api.Services;

/// <summary>
/// Servicio de gestión de usuarios.
/// </summary>
public interface IUsuarioService
{
    Task<UsuarioResponseDto?> GetByRegistroAsync(int registro, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<UsuarioListDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<UsuarioResponseDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<UsuarioResponseDto> CreateAsync(UsuarioCreateDto dto, CancellationToken cancellationToken = default);
    Task<UsuarioResponseDto?> UpdateAsync(int id, UsuarioUpdateDto dto, CancellationToken cancellationToken = default);
    Task<bool> ActivateAsync(int id, CancellationToken cancellationToken = default);
    Task<bool> DeactivateAsync(int id, CancellationToken cancellationToken = default);
}
