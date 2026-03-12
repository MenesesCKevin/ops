using System.ComponentModel.DataAnnotations;

namespace KYC_OPS.Api.Data.DTOs.Permiso;

/// <summary>DTO para actualizar permiso.</summary>
public class PermisoUpdateDto
{
    [Required, MaxLength(100)]
    public string Nombre { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Descripcion { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    public string Ruta { get; set; } = string.Empty;
}
