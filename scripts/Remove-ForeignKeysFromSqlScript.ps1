<#
.SYNOPSIS
    Elimina todas las restricciones de llave foránea (FK) de un script SQL generado por EF Core.

.DESCRIPTION
    Lee un archivo .sql (salida de dotnet ef migrations script) y elimina:
    - ADD CONSTRAINT [FK_...] FOREIGN KEY ...
    - ALTER TABLE ... DROP CONSTRAINT [FK_...]
    Mantiene tablas, índices, datos y PKs.

.PARAMETER InputPath
    Ruta al archivo .sql de entrada.

.PARAMETER OutputPath
    Ruta del script sin FKs. Si no se indica, se usa el mismo archivo (se sobrescribe).

.EXAMPLE
    .\Remove-ForeignKeysFromSqlScript.ps1 -InputPath ".\script.sql" -OutputPath ".\script-no-fk.sql"

.EXAMPLE
    dotnet ef migrations script -o script.sql
    .\Remove-ForeignKeysFromSqlScript.ps1 -InputPath script.sql
#>

param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string] $InputPath,

    [Parameter(Mandatory = $false)]
    [string] $OutputPath
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $InputPath)) {
    Write-Error "No se encontró el archivo: $InputPath"
    exit 1
}

if (-not $OutputPath) {
    $OutputPath = $InputPath
}

$content = Get-Content -Path $InputPath -Raw -Encoding UTF8

# 1) Eliminar ALTER TABLE ... ADD CONSTRAINT [FK_...] FOREIGN KEY ... REFERENCES ... ; (una o varias líneas)
$content = [regex]::Replace($content,
    'ALTER\s+TABLE\s+\[[^\]]+\]\s+ADD\s+CONSTRAINT\s+\[FK_[^\]]+\]\s+FOREIGN\s+KEY\s+[^;]+;',
    '',
    [System.Text.RegularExpressions.RegexOptions]::IgnoreCase -bor [System.Text.RegularExpressions.RegexOptions]::Singleline)

# 2) Eliminar ALTER TABLE ... DROP CONSTRAINT [FK_...] ;
$content = [regex]::Replace($content,
    'ALTER\s+TABLE\s+\[[^\]]+\]\s+DROP\s+CONSTRAINT\s+\[FK_[^\]]+\]\s*;',
    '',
    [System.Text.RegularExpressions.RegexOptions]::IgnoreCase -bor [System.Text.RegularExpressions.RegexOptions]::Singleline)

# 3) Quitar bloques de líneas en blanco de más de 2 seguidas
$content = [regex]::Replace($content, '(\r?\n){3,}', "`n`n")

$content = $content.Trim()
$content | Set-Content -Path $OutputPath -Encoding UTF8 -NoNewline

Write-Host "Listo. Script sin FK escrito en: $OutputPath"
