using System.ComponentModel.DataAnnotations;

namespace KYC_OPS.Api.Data.DTOs.Usuario;

/// <summary>DTO para actualizar usuario.</summary>
public class UsuarioUpdateDto
{
    [Required, MaxLength(100)]
    public string Nombre { get; set; } = string.Empty;

    [Required, MaxLength(5)]
    public string Iniciales { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string Correo { get; set; } = string.Empty;

    public int ResponsableId { get; set; }
    public int? Extension { get; set; }
    public int RolId { get; set; }
}
