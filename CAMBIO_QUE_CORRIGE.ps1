$ErrorActionPreference='Stop'
$p=Join-Path $PSScriptRoot 'backend\src\validation.js'
$s=[IO.File]::ReadAllText($p)
$good="if (stock === 0) return 'Agotado';"
$bad="if (stock === 0) return 'Disponible';"
if (-not $s.Contains($bad)) { throw 'No encuentro el fallo esperado. Revisa que ejecutaste 02 primero.' }
[IO.File]::WriteAllText($p, $s.Replace($bad,$good))
Write-Host 'Correccion aplicada: stock cero retorna Agotado.'
