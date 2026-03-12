using System.ComponentModel.DataAnnotations;

namespace KYC_OPS.Api.Models;

/// <summary>
/// Entidad de usuario del sistema. Relacionada con un rol que define sus permisos.
/// </summary>
public class Usuario
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Nombre { get; set; } = string.Empty;

    [Required]
    [MaxLength(5)]
    public string Iniciales { get; set; } = string.Empty;

    /// <summary>Número de registro (SSO / empleado).</summary>
    public int Registro { get; set; }

    [Required]
    [MaxLength(100)]
    public string Correo { get; set; } = string.Empty;

    public int ResponsableId { get; set; }

    public int? Extension { get; set; }

    public int RolId { get; set; }

    public bool Activo { get; set; } = true;

    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

    public DateTime? FechaModificacion { get; set; }

    public virtual Rol Rol { get; set; } = null!;
}
