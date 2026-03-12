namespace KYC_OPS.Api.Data.DTOs.Usuario;

/// <summary>DTO para listado de usuarios.</summary>
public class UsuarioListDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Iniciales { get; set; } = string.Empty;
    public int Registro { get; set; }
    public string Correo { get; set; } = string.Empty;
    public bool Activo { get; set; }
    public int RolId { get; set; }
    public string RolNombre { get; set; } = string.Empty;
}
