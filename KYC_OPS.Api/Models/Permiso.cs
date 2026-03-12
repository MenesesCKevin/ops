using System.ComponentModel.DataAnnotations;

namespace KYC_OPS.Api.Models;

/// <summary>
/// Permiso (ruta o acción). Se asigna a roles mediante RolPermiso.
/// </summary>
public class Permiso
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Nombre { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Descripcion { get; set; } = string.Empty;

    /// <summary>Ruta o identificador usado por el frontend (ej. /usuarios, /roles-permisos).</summary>
    [Required]
    [MaxLength(200)]
    public string Ruta { get; set; } = string.Empty;

    public virtual ICollection<RolPermiso> RolPermisos { get; set; } = new List<RolPermiso>();
}
