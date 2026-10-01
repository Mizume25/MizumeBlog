# Mueve lo que el CLI de shadcn deja en la raiz a resources\js\ y borra las carpetas vacias.
# Colocar en la raiz del proyecto (junto a package.json).

$ErrorActionPreference = 'Stop'

$root = $PSScriptRoot
$dest = Join-Path $root 'resources\js'

# Carpetas de la raiz que se vuelcan en resources\js\<nombre>. Editable.
$folders = @('components', 'hooks')

if (-not (Test-Path -LiteralPath $dest)) {
    Write-Host "No existe $dest. Ejecuta el script desde la raiz del proyecto." -ForegroundColor Red
    exit 1
}

$moved = 0

foreach ($name in $folders) {
    $src = Join-Path $root $name
    if (-not (Test-Path -LiteralPath $src)) { continue }

    $target = Join-Path $dest $name

    Get-ChildItem -LiteralPath $src -Recurse -File -Force | ForEach-Object {
        $relative = $_.FullName.Substring($src.Length).TrimStart('\')
        $to = Join-Path $target $relative
        $toDir = Split-Path -Parent $to

        if (-not (Test-Path -LiteralPath $toDir)) {
            New-Item -ItemType Directory -Path $toDir -Force | Out-Null
        }

        $status = if (Test-Path -LiteralPath $to) { 'sobrescrito' } else { 'movido' }
        Move-Item -LiteralPath $_.FullName -Destination $to -Force
        Write-Host ("[{0}] {1}\{2}" -f $status, $name, $relative)
        $moved++
    }

    # Borra subcarpetas vacias (de la mas profunda a la mas superficial) y luego la carpeta raiz si queda vacia.
    Get-ChildItem -LiteralPath $src -Recurse -Directory -Force |
        Sort-Object { $_.FullName.Length } -Descending |
        ForEach-Object {
            if (-not (Get-ChildItem -LiteralPath $_.FullName -Force)) {
                Remove-Item -LiteralPath $_.FullName -Force
            }
        }

    if (-not (Get-ChildItem -LiteralPath $src -Force)) {
        Remove-Item -LiteralPath $src -Force
        Write-Host "[borrada] carpeta vacia: $name" -ForegroundColor DarkGray
    } else {
        Write-Host "[aviso] $name no esta vacia, no se borra." -ForegroundColor Yellow
    }
}

if ($moved -eq 0) {
    Write-Host 'Nada que mover.' -ForegroundColor Green
} else {
    Write-Host "Listo: $moved archivo(s) movido(s)." -ForegroundColor Green
}
