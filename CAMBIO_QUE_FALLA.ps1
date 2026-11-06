$ErrorActionPreference='Stop'
$p=Join-Path $PSScriptRoot 'backend\src\validation.js'
$s=[IO.File]::ReadAllText($p)
$good="if (stock === 0) return 'Agotado';"
$bad="if (stock === 0) return 'Disponible';"
if (-not $s.Contains($good)) { throw 'No encuentro la linea original. Comprueba que ya no se haya cambiado.' }
[IO.File]::WriteAllText($p, $s.Replace($good,$bad))
Write-Host 'Cambio aplicado: los 0 productos se clasifican mal; la prueba detectara el fallo.'
