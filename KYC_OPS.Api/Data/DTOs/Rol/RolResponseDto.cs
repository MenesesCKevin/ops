namespace KYC_OPS.Api.Data.DTOs.Rol;

/// <summary>DTO de respuesta de rol con permisos asignados.</summary>
public class RolResponseDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public List<int> PermisoIds { get; set; } = new();
}
