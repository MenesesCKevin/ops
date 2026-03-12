<#
.SYNOPSIS
    Genera el script SQL de migraciones de EF Core y elimina las llaves foráneas.

.DESCRIPTION
    1. Ejecuta dotnet ef migrations script -o <salida.sql>
    2. Ejecuta Remove-ForeignKeysFromSqlScript.ps1 sobre ese archivo
    Uso típico en entornos donde la BD no permite FKs.

.PARAMETER OutputSql
    Nombre o ruta del archivo .sql generado (por defecto: script.sql en esta carpeta).

.PARAMETER ProjectPath
    Ruta al .csproj de la API (por defecto: ..\KYC_OPS.Api\KYC_OPS.Api.csproj).

.EXAMPLE
    .\Generate-MigrationScriptWithoutFK.ps1
    .\Generate-MigrationScriptWithoutFK.ps1 -OutputSql ".\release\migration.sql"
#>

param(
    [string] $OutputSql = "script.sql",
    [string] $ProjectPath = (Join-Path $PSScriptRoot "..\KYC_OPS.Api\KYC_OPS.Api.csproj")
)

$ErrorActionPreference = 'Stop'

$scriptDir = $PSScriptRoot
$fullSqlPath = [System.IO.Path]::GetFullPath((Join-Path $scriptDir $OutputSql))

# Generar script con EF
Push-Location (Split-Path $ProjectPath -Parent)
try {
    Write-Host "Generando script de migración..."
    dotnet ef migrations script -o $fullSqlPath --project $ProjectPath
    if ($LASTEXITCODE -ne 0) {
        Write-Error "dotnet ef migrations script falló."
        exit 1
    }
} finally {
    Pop-Location
}

# Quitar FKs (sobrescribe el mismo archivo)
$removeFkScript = Join-Path $scriptDir "Remove-ForeignKeysFromSqlScript.ps1"
& $removeFkScript -InputPath $fullSqlPath

Write-Host "Script final (sin FK): $fullSqlPath"
