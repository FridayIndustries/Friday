# Powershell script to decode a base64 PNG and generate a multi-resolution .ico using ImageMagick
# Usage:
# 1) Place base64 PNG content into electron/assets/icon.png.b64 (no data URI header, just base64)
# 2) Run PowerShell as Administrator (if required) and execute:
#    .\electron\generate_icon.ps1
# Requirements: ImageMagick `magick` must be installed and in PATH.

$base64File = "$(Split-Path -Parent $MyInvocation.MyCommand.Path)\assets\icon.png.b64"
$pngOut = "$(Split-Path -Parent $MyInvocation.MyCommand.Path)\assets\icon.png"
$icoOut = "$(Split-Path -Parent $MyInvocation.MyCommand.Path)\assets\icon.ico"

if (-Not (Test-Path $base64File)) {
    Write-Error "Base64 file not found: $base64File`nPlease create the file and paste the PNG base64 content into it (no data: URI header)."
    exit 1
}

try {
    $b64 = Get-Content -Raw -Path $base64File
    [IO.File]::WriteAllBytes($pngOut, [Convert]::FromBase64String($b64))
    Write-Output "Wrote PNG: $pngOut"
} catch {
    Write-Error "Failed to decode base64 to PNG: $_"
    exit 1
}

# Generate multi-resolution .ico using ImageMagick (create several sizes packed into one .ico)
$sizes = @(16,24,32,48,64,128,256)
$sizeArgs = $sizes | ForEach-Object { "$pngOut -resize ${_}x${_}" }

# Build temporary resized PNGs and then combine
$tmpDir = Join-Path (Split-Path $pngOut) "tmp_icon_sizes"
if (Test-Path $tmpDir) { Remove-Item -Recurse -Force $tmpDir }
New-Item -ItemType Directory -Path $tmpDir | Out-Null

$pngs = @()
foreach ($s in $sizes) {
    $out = Join-Path $tmpDir ("icon_${s}.png")
    magick convert $pngOut -resize ${s}x${s} $out
    if (Test-Path $out) { $pngs += $out }
}

if ($pngs.Count -eq 0) {
    Write-Error "ImageMagick convert failed to create resized PNGs. Ensure ImageMagick is installed and 'magick' is available in PATH."
    exit 1
}

# Combine into ICO
$pngsLine = $pngs -join ' '
magick convert $pngsLine $icoOut
if (Test-Path $icoOut) {
    Write-Output "Generated ICO: $icoOut"
    # cleanup
    Remove-Item -Recurse -Force $tmpDir
    exit 0
} else {
    Write-Error "Failed to generate ICO."
    exit 1
}
