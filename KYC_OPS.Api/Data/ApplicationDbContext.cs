using Microsoft.EntityFrameworkCore;
using KYC_OPS.Api.Models;

namespace KYC_OPS.Api.Data;

/// <summary>
/// Contexto de base de datos para KYC_OPS. Usuarios, roles y permisos.
/// </summary>
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Rol> Roles => Set<Rol>();
    public DbSet<Permiso> Permisos => Set<Permiso>();
    public DbSet<RolPermiso> RolPermisos => Set<RolPermiso>();

    /// <inheritdoc />
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.ToTable("KYC_Usuarios");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).UseIdentityColumn();
            entity.Property(e => e.Nombre).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Iniciales).HasMaxLength(5).IsRequired();
            entity.Property(e => e.Correo).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Activo).HasDefaultValue(true);

            entity.HasOne(e => e.Rol)
                .WithMany(r => r.Usuarios)
                .HasForeignKey(e => e.RolId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Rol>(entity =>
        {
            entity.ToTable("KYC_Roles");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).UseIdentityColumn();
            entity.Property(e => e.Nombre).HasMaxLength(100).IsRequired();
        });

        modelBuilder.Entity<Permiso>(entity =>
        {
            entity.ToTable("KYC_Permisos");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).UseIdentityColumn();
            entity.Property(e => e.Nombre).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Descripcion).HasMaxLength(500);
            entity.Property(e => e.Ruta).HasMaxLength(200).IsRequired();
        });

        modelBuilder.Entity<RolPermiso>(entity =>
        {
            entity.ToTable("KYC_RolPermisos");
            entity.HasKey(e => new { e.RolId, e.PermisoId });

            entity.HasOne(e => e.Rol)
                .WithMany(r => r.RolPermisos)
                .HasForeignKey(e => e.RolId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Permiso)
                .WithMany(p => p.RolPermisos)
                .HasForeignKey(e => e.PermisoId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Seed: rol Administrador, permisos básicos, usuario de desarrollo
        var rolAdmin = new Rol { Id = 1, Nombre = "Administrador" };
        var permisoInicio = new Permiso { Id = 1, Nombre = "Inicio", Descripcion = "Acceso al inicio", Ruta = "/" };
        var permisoUsuarios = new Permiso { Id = 2, Nombre = "Usuarios", Descripcion = "Gestión de usuarios", Ruta = "/usuarios" };
        var permisoRoles = new Permiso { Id = 3, Nombre = "Roles y permisos", Descripcion = "Roles y permisos", Ruta = "/roles-permisos" };

        modelBuilder.Entity<Rol>().HasData(rolAdmin);
        modelBuilder.Entity<Permiso>().HasData(permisoInicio, permisoUsuarios, permisoRoles);
        modelBuilder.Entity<RolPermiso>().HasData(
            new RolPermiso { RolId = 1, PermisoId = 1 },
            new RolPermiso { RolId = 1, PermisoId = 2 },
            new RolPermiso { RolId = 1, PermisoId = 3 });
        modelBuilder.Entity<Usuario>().HasData(new Usuario
        {
            Id = 1,
            Nombre = "Usuario Desarrollo KYC_OPS",
            Iniciales = "DEV",
            Registro = 45895623,
            Correo = "dev@kycops.local",
            ResponsableId = 0,
            RolId = 1,
            Activo = true,
            FechaCreacion = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
        });
    }
}
