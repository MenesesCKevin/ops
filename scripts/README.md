# Scripts de migración sin llaves foráneas

En entornos donde la base de datos **no permite llaves foráneas (FK)**, se pueden usar estos scripts para generar el SQL de EF Core sin restricciones FK.

## Uso rápido

Desde la carpeta `scripts`:

```powershell
# Generar script de migración y quitar todas las FK automáticamente
.\Generate-MigrationScriptWithoutFK.ps1
```

El archivo `script.sql` quedará en la misma carpeta, listo para ejecutar en la BD.

## Uso por partes

### 1. Generar el script con EF

```powershell
cd KYC_OPS.Api
dotnet ef migrations script -o ..\scripts\script.sql
```

### 2. Quitar las FK del script

```powershell
cd scripts
.\Remove-ForeignKeysFromSqlScript.ps1 -InputPath script.sql -OutputPath script-no-fk.sql
```

Si no pasas `-OutputPath`, se sobrescribe el archivo de entrada.

## Parámetros

**Remove-ForeignKeysFromSqlScript.ps1**
- `InputPath` (obligatorio): ruta al .sql generado por EF.
- `OutputPath` (opcional): dónde guardar el resultado. Por defecto = mismo que entrada.

**Generate-MigrationScriptWithoutFK.ps1**
- `OutputSql`: nombre del archivo .sql (por defecto: `script.sql`).
- `ProjectPath`: ruta al .csproj de la API (por defecto: `..\KYC_OPS.Api\KYC_OPS.Api.csproj`).

## Nota

El script elimina únicamente:
- `ALTER TABLE ... ADD CONSTRAINT [FK_...] FOREIGN KEY ... REFERENCES ... ;`
- `ALTER TABLE ... DROP CONSTRAINT [FK_...] ;`

Las columnas que EF usa como FK (por ejemplo `RolId` en `KYC_Usuarios`) se mantienen; solo se quitan las restricciones. La integridad referencial debe garantizarse en la aplicación (validaciones, soft delete, etc.).
