using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace KYC_OPS.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "KYC_Permisos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Ruta = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KYC_Permisos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "KYC_Roles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KYC_Roles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "KYC_RolPermisos",
                columns: table => new
                {
                    RolId = table.Column<int>(type: "int", nullable: false),
                    PermisoId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KYC_RolPermisos", x => new { x.RolId, x.PermisoId });
                    table.ForeignKey(
                        name: "FK_KYC_RolPermisos_KYC_Permisos_PermisoId",
                        column: x => x.PermisoId,
                        principalTable: "KYC_Permisos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_KYC_RolPermisos_KYC_Roles_RolId",
                        column: x => x.RolId,
                        principalTable: "KYC_Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "KYC_Usuarios",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Iniciales = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: false),
                    Registro = table.Column<int>(type: "int", nullable: false),
                    Correo = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ResponsableId = table.Column<int>(type: "int", nullable: false),
                    Extension = table.Column<int>(type: "int", nullable: true),
                    RolId = table.Column<int>(type: "int", nullable: false),
                    Activo = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaModificacion = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KYC_Usuarios", x => x.Id);
                    table.ForeignKey(
                        name: "FK_KYC_Usuarios_KYC_Roles_RolId",
                        column: x => x.RolId,
                        principalTable: "KYC_Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "KYC_Permisos",
                columns: new[] { "Id", "Descripcion", "Nombre", "Ruta" },
                values: new object[,]
                {
                    { 1, "Acceso al inicio", "Inicio", "/" },
                    { 2, "Gestión de usuarios", "Usuarios", "/usuarios" },
                    { 3, "Roles y permisos", "Roles y permisos", "/roles-permisos" }
                });

            migrationBuilder.InsertData(
                table: "KYC_Roles",
                columns: new[] { "Id", "Nombre" },
                values: new object[] { 1, "Administrador" });

            migrationBuilder.InsertData(
                table: "KYC_RolPermisos",
                columns: new[] { "PermisoId", "RolId" },
                values: new object[,]
                {
                    { 1, 1 },
                    { 2, 1 },
                    { 3, 1 }
                });

            migrationBuilder.InsertData(
                table: "KYC_Usuarios",
                columns: new[] { "Id", "Activo", "Correo", "Extension", "FechaCreacion", "FechaModificacion", "Iniciales", "Nombre", "Registro", "ResponsableId", "RolId" },
                values: new object[] { 1, true, "dev@kycops.local", null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "DEV", "Usuario Desarrollo KYC_OPS", 45895623, 0, 1 });

            migrationBuilder.CreateIndex(
                name: "IX_KYC_RolPermisos_PermisoId",
                table: "KYC_RolPermisos",
                column: "PermisoId");

            migrationBuilder.CreateIndex(
                name: "IX_KYC_Usuarios_RolId",
                table: "KYC_Usuarios",
                column: "RolId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "KYC_RolPermisos");

            migrationBuilder.DropTable(
                name: "KYC_Usuarios");

            migrationBuilder.DropTable(
                name: "KYC_Permisos");

            migrationBuilder.DropTable(
                name: "KYC_Roles");
        }
    }
}
