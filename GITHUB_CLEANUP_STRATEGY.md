# 🧹 Estrategia de Limpieza del Repositorio GitHub

## 📊 Situación Actual
- Más de 10,000 archivos acumulados durante la integración del backend
- Muchos archivos basura y temporales que no se necesitan
- Repositorio pesado que afecta el performance del deployment

## 🎯 Objetivos
1. Reducir drasticamente el tamaño del repositorio
2. Eliminar archivos históricos innecesarios del git history
3. Mantener solo los archivos esenciales para producción
4. Optimizar para deployments rápidos

## 📝 Plan de Limpieza

### Fase 1: Preparación Local
```powershell
# 1. Hacer backup del repositorio actual
git clone --mirror https://github.com/tu-usuario/romi-node-azure.git backup-repo

# 2. Crear branch de limpieza
git checkout -b cleanup-repo

# 3. Verificar archivos grandes en el historial
git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | sed -n 's/^blob //p' | sort --numeric-sort --key=2 | tail -20
```

### Fase 2: Limpieza con BFG Repo-Cleaner (Recomendado)
```powershell
# Descargar BFG Repo-Cleaner
# https://rtyley.github.io/bfg-repo-cleaner/

# Eliminar archivos grandes del historial (>10MB)
java -jar bfg.jar --strip-blobs-bigger-than 10M repo.git

# Eliminar carpetas específicas del historial
java -jar bfg.jar --delete-folders "{node_modules,build,dist,.terraform}" repo.git

# Eliminar archivos específicos del historial
java -jar bfg.jar --delete-files "*.{log,tmp,cache,tfstate,tfstate.backup}" repo.git
```

### Fase 3: Limpieza Manual de Archivos Actuales
```powershell
# Eliminar archivos/carpetas localmente (estos se eliminarán del working directory)
Remove-Item -Recurse -Force node_modules, build, dist, .terraform -ErrorAction SilentlyContinue
Remove-Item -Force terraform.tfstate, terraform.tfstate.backup -ErrorAction SilentlyContinue
Remove-Item -Force *.log, *.tmp, *.cache -ErrorAction SilentlyContinue

# Limpiar archivos temporales de Visual Studio Code
Remove-Item -Recurse -Force .vscode/settings.json -ErrorAction SilentlyContinue

# Limpiar archivos de sistema
Remove-Item -Force Thumbs.db, .DS_Store -ErrorAction SilentlyContinue
```

### Fase 4: Aplicar Cambios
```powershell
# Aplicar la limpieza del BFG
git reflog expire --expire=now --all && git gc --prune=now --aggressive

# Forzar push de la limpieza (CUIDADO: Reescribe el historial)
git push --force-with-lease origin main
```

## 📁 Archivos a Mantener (Whitelist)
- `app/` (código fuente de la aplicación)
- `src/` (frontend React)
- `public/` (archivos públicos esenciales)
- `package.json` (dependencias)
- `README.md` (documentación)
- `main.tf`, `variables.tf`, `output.tf` (Terraform)
- `.github/workflows/deploy.yml` (GitHub Actions)
- `.gitignore` (configuración git)

## 🗑️ Archivos a Eliminar (Blacklist)
- `node_modules/` (dependencias - se instalan en build)
- `build/`, `dist/` (archivos compilados)
- `.terraform/` (cache de terraform)
- `terraform.tfstate*` (estado de terraform - usar remote state)
- `*.log`, `*.tmp`, `*.cache` (archivos temporales)
- `.vscode/settings.json` (configuración personal)
- `Thumbs.db`, `.DS_Store` (archivos de sistema)
- Archivos de backup antiguos
- Screenshots y archivos de documentación obsoletos

## ⚠️ Consideraciones Importantes
1. **Backup**: Siempre hacer backup antes de la limpieza
2. **Colaboradores**: Notificar al equipo sobre la reescritura del historial
3. **Branches**: Todos los colaboradores necesitarán hacer `git clone` fresh
4. **CI/CD**: Verificar que los workflows sigan funcionando después de la limpieza

## 🚀 Resultado Esperado
- Repositorio reducido de 10,000+ archivos a ~50-100 archivos esenciales
- Historial git limpio y optimizado
- Deployments más rápidos
- Mejor performance del repositorio
