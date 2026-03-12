namespace KYC_OPS.Api.Data.DTOs.Usuario;

/// <summary>
/// DTO de respuesta para consulta de usuario. Incluye rol y lista de permisos (rutas).
/// </summary>
public class UsuarioResponseDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Iniciales { get; set; } = string.Empty;
    public int Registro { get; set; }
    public string Correo { get; set; } = string.Empty;
    public int ResponsableId { get; set; }
    public int? Extension { get; set; }
    public bool Activo { get; set; }
    public DateTime FechaCreacion { get; set; }
    public DateTime? FechaModificacion { get; set; }
    public RolInfoDto? Rol { get; set; }
    public List<string> Permisos { get; set; } = new();
}

/// <summary>
/// Información básica del rol en respuestas de usuario.
/// </summary>
public class RolInfoDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
}
