namespace KYC_OPS.Api.Data.DTOs.Rol;

/// <summary>DTO para listado de roles.</summary>
public class RolListDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public int PermisosCount { get; set; }
}
