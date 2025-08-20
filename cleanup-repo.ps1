# Script de Limpieza Automatica para Repositorio ROMI Task Manager
# Ejecutar desde la raiz del proyecto

Write-Host "Iniciando limpieza del repositorio..." -ForegroundColor Green

# Verificar que estamos en la raiz del proyecto
if (-not (Test-Path "package.json")) {
    Write-Host "Error: Ejecuta este script desde la raiz del proyecto (donde esta package.json)" -ForegroundColor Red
    exit 1
}

Write-Host "Eliminando archivos y carpetas innecesarias..." -ForegroundColor Yellow

# Arrays de archivos y carpetas a eliminar
$foldersToDelete = @(
    "node_modules",
    "build", 
    "dist",
    ".terraform",
    "app/node_modules",
    "app/build",
    ".next",
    "coverage",
    ".nyc_output"
)

$filesToDelete = @(
    "terraform.tfstate",
    "terraform.tfstate.backup",
    "*.log",
    "*.tmp", 
    "*.cache",
    "Thumbs.db",
    ".DS_Store",
    "npm-debug.log*",
    "yarn-debug.log*",
    "yarn-error.log*",
    ".env.local",
    ".env.development.local",
    ".env.test.local", 
    ".env.production.local"
)

# Eliminar carpetas
foreach ($folder in $foldersToDelete) {
    if (Test-Path $folder) {
        Write-Host "Eliminando carpeta: $folder" -ForegroundColor Cyan
        Remove-Item -Recurse -Force $folder -ErrorAction SilentlyContinue
    }
}

# Eliminar archivos
foreach ($file in $filesToDelete) {
    $files = Get-ChildItem -Path . -Recurse -Name $file -ErrorAction SilentlyContinue
    foreach ($f in $files) {
        Write-Host "Eliminando archivo: $f" -ForegroundColor Cyan
        Remove-Item -Force $f -ErrorAction SilentlyContinue
    }
}

# Limpiar cache de npm/yarn
Write-Host "Limpiando cache de npm..." -ForegroundColor Yellow
if (Get-Command npm -ErrorAction SilentlyContinue) {
    npm cache clean --force
}

if (Get-Command yarn -ErrorAction SilentlyContinue) {
    yarn cache clean
}

# Mostrar estadisticas del repositorio
Write-Host "Estadisticas del repositorio:" -ForegroundColor Green
$fileCount = (Get-ChildItem -Recurse -File | Measure-Object).Count
$folderCount = (Get-ChildItem -Recurse -Directory | Measure-Object).Count
$totalSize = (Get-ChildItem -Recurse -File | Measure-Object -Property Length -Sum).Sum

Write-Host "   Archivos: $fileCount" -ForegroundColor White
Write-Host "   Carpetas: $folderCount" -ForegroundColor White
Write-Host "   Tamaño total: $([math]::Round($totalSize/1MB, 2)) MB" -ForegroundColor White

# Verificar estado de git
Write-Host "Estado de Git:" -ForegroundColor Green
git status --porcelain | Measure-Object | ForEach-Object { 
    Write-Host "   Archivos modificados: $($_.Count)" -ForegroundColor White 
}

Write-Host "Limpieza completada!" -ForegroundColor Green
Write-Host "Siguiente paso: Revisar cambios con 'git status' y hacer commit de la limpieza" -ForegroundColor Blue

# Opcional: Mostrar archivos grandes restantes
Write-Host "Archivos mas grandes restantes (top 10):" -ForegroundColor Yellow
Get-ChildItem -Recurse -File | 
    Sort-Object Length -Descending | 
    Select-Object -First 10 | 
    ForEach-Object { 
        $size = [math]::Round($_.Length/1KB, 2)
        Write-Host "   Archivo: $($_.Name): $size KB" -ForegroundColor Gray
    }
