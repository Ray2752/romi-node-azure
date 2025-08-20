# 🛠️ Configuración Requerida en Azure Portal

## 1. Crear App Service (si no existe)

### Opción A: Usar Terraform (Recomendado)
```bash
# Desde la raíz del proyecto
terraform init
terraform plan -var="mongo_uri=TU_CADENA_CONEXION_MONGODB"
terraform apply -var="mongo_uri=TU_CADENA_CONEXION_MONGODB"
```

### Opción B: Manual en Azure Portal
1. Ve a Azure Portal (portal.azure.com)
2. Busca "App Services" → Crear
3. Configuración:
   - **Subscription**: Tu suscripción
   - **Resource Group**: `rg-romi-task-manager` (o crear nuevo)
   - **Name**: `romi-task-manager`
   - **Runtime Stack**: Node 18 LTS
   - **Operating System**: Linux
   - **Region**: West US 2
   - **Pricing Plan**: B1 (Basic)

## 2. Obtener Publish Profile

1. Ve a tu App Service en Azure Portal
2. En el menú izquierdo, busca "Deployment" → "Deployment Center"
3. O directamente: Clic en "Get publish profile" en la Overview
4. Se descargará un archivo `.publishsettings`
5. Abre el archivo y copia TODO el contenido XML

## 3. Configurar Secret en GitHub

1. Ve a tu repositorio en GitHub: https://github.com/Ray2752/romi-node-azure
2. Settings → Secrets and variables → Actions
3. Clic en "New repository secret"
4. Name: `AZURE_WEBAPP_PUBLISH_PROFILE`
5. Value: Pega todo el contenido XML del archivo .publishsettings
6. Clic "Add secret"

## 4. Variables de Entorno en App Service

En Azure Portal → Tu App Service → Configuration → Application settings:

Agregar estas variables:
- `MONGO_URI`: Tu cadena de conexión de MongoDB Atlas
- `NODE_ENV`: `production`
- `PORT`: `8000`
- `WEBSITE_RUN_FROM_PACKAGE`: `1`

## 5. Verificar Configuración

### Estructura esperada del App Service:
- **Runtime**: Node.js 18 LTS
- **OS**: Linux
- **Startup Command**: `npm start` (debería detectarse automáticamente)

### Variables de entorno requeridas:
```
MONGO_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/basededatos
NODE_ENV=production
PORT=8000
WEBSITE_RUN_FROM_PACKAGE=1
```

## 6. Deployment Test

Una vez configurado:
1. Haz un push a main branch
2. Ve a Actions tab en GitHub para ver el workflow
3. El deployment debería funcionar automáticamente

## 🚨 Posibles Problemas y Soluciones

### Error: "App Service not found"
- Verifica que el nombre del app service coincida: `romi-task-manager`
- Verifica que esté en la misma suscripción

### Error: "Authentication failed"
- Re-descarga el publish profile
- Asegúrate de copiar TODO el contenido XML
- Verifica que no haya espacios extra

### Error: "Build failed"
- Verifica que package.json tenga script "start"
- Verifica que todas las dependencias estén en package.json

### Error: "MongoDB connection failed"
- Verifica la cadena de conexión MONGO_URI
- Asegúrate de que MongoDB Atlas permita conexiones desde Azure
- En MongoDB Atlas → Network Access → Add IP Address → "Allow access from anywhere" (0.0.0.0/0)

## 📋 Checklist Final

- [ ] App Service creado en Azure
- [ ] Publish profile descargado
- [ ] Secret configurado en GitHub
- [ ] Variables de entorno configuradas en App Service
- [ ] MongoDB Atlas configurado para permitir conexiones
- [ ] Push a main branch para activar deployment
