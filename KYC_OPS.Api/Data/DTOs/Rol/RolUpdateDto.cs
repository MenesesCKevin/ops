using System.ComponentModel.DataAnnotations;

namespace KYC_OPS.Api.Data.DTOs.Rol;

/// <summary>DTO para actualizar rol.</summary>
public class RolUpdateDto
{
    [Required, MaxLength(100)]
    public string Nombre { get; set; } = string.Empty;

    public List<int> PermisoIds { get; set; } = new();
}
