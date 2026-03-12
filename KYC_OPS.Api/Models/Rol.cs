using System.ComponentModel.DataAnnotations;

namespace KYC_OPS.Api.Models;

/// <summary>
/// Rol de usuario. Los permisos se asignan al rol mediante RolPermiso.
/// </summary>
public class Rol
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Nombre { get; set; } = string.Empty;

    public virtual ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();

    public virtual ICollection<RolPermiso> RolPermisos { get; set; } = new List<RolPermiso>();
}
