namespace KYC_OPS.Api.Data.DTOs.Permiso;

/// <summary>DTO para listado de permisos.</summary>
public class PermisoListDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Ruta { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
}
