namespace KYC_OPS.Api.Models;

/// <summary>
/// Relación muchos a muchos entre Rol y Permiso.
/// </summary>
public class RolPermiso
{
    public int RolId { get; set; }
    public int PermisoId { get; set; }

    public virtual Rol Rol { get; set; } = null!;
    public virtual Permiso Permiso { get; set; } = null!;
}
