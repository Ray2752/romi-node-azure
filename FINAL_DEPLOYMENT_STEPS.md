# 🚀 Pasos Finales para Configurar el Deployment

## ✅ **Lo que ya tienes configurado:**
- App Service: `romi-node-webapp-12345` ✅
- MongoDB URI configurado ✅
- Publish Profile obtenido ✅

## 🔧 **Configuración Pendiente:**

### 1. Configurar Secret en GitHub (CRÍTICO)

Ve a GitHub y configura el secret:
1. https://github.com/Ray2752/romi-node-azure/settings/secrets/actions
2. New repository secret
3. Name: `AZURE_WEBAPP_PUBLISH_PROFILE`
4. Value: Copia este XML completo:

```xml
<publishData><publishProfile profileName="romi-node-webapp-12345 - Web Deploy" publishMethod="MSDeploy" publishUrl="romi-node-webapp-12345.scm.azurewebsites.net:443" msdeploySite="romi-node-webapp-12345" userName="$romi-node-webapp-12345" userPWD="CbihWB0jTWPPfPdCdsRQertq6eAfo7puanQTQhmciRqHEvcXfyy64K6ovbpk" destinationAppUrl="http://romi-node-webapp-12345.azurewebsites.net" SQLServerDBConnectionString="" mySQLDBConnectionString="" hostingProviderForumLink="" controlPanelLink="https://portal.azure.com" webSystem="WebSites"><databases /></publishProfile><publishProfile profileName="romi-node-webapp-12345 - FTP" publishMethod="FTP" publishUrl="ftps://waws-prod-blu-427.ftp.azurewebsites.windows.net/site/wwwroot" ftpPassiveMode="True" userName="romi-node-webapp-12345\$romi-node-webapp-12345" userPWD="CbihWB0jTWPPfPdCdsRQertq6eAfo7puanQTQhmciRqHEvcXfyy64K6ovbpk" destinationAppUrl="http://romi-node-webapp-12345.azurewebsites.net" SQLServerDBConnectionString="" mySQLDBConnectionString="" hostingProviderForumLink="" controlPanelLink="https://portal.azure.com" webSystem="WebSites"><databases /></publishProfile><publishProfile profileName="romi-node-webapp-12345 - Zip Deploy" publishMethod="ZipDeploy" publishUrl="romi-node-webapp-12345.scm.azurewebsites.net:443" userName="$romi-node-webapp-12345" userPWD="CbihWB0jTWPPfPdCdsRQertq6eAfo7puanQTQhmciRqHEvcXfyy64K6ovbpk" destinationAppUrl="http://romi-node-webapp-12345.azurewebsites.net" SQLServerDBConnectionString="" mySQLDBConnectionString="" hostingProviderForumLink="" controlPanelLink="https://portal.azure.com" webSystem="WebSites"><databases /></publishProfile></publishData>
```

### 2. Configurar Variables de Entorno en Azure Portal

Ve a Azure Portal:
1. Busca "romi-node-webapp-12345"
2. Configuration → Application settings
3. Agrega estas variables:

```
NODE_ENV = production
PORT = 8000
WEBSITE_RUN_FROM_PACKAGE = 1
```

### 3. Verificar MongoDB Atlas

Asegúrate de que MongoDB Atlas permita conexiones desde Azure:
1. Ve a MongoDB Atlas
2. Network Access
3. Add IP Address
4. Allow access from anywhere (0.0.0.0/0)

## 🎯 **Después de la configuración:**

1. Haz commit y push:
```bash
git add .
git commit -m "🚀 Final deployment configuration"
git push origin main
```

2. Ve a GitHub Actions para monitorear el deployment:
https://github.com/Ray2752/romi-node-azure/actions

3. Tu app estará disponible en:
https://romi-node-webapp-12345.azurewebsites.net

## 🔍 **Si hay problemas:**

### En Azure Portal → App Service → Log stream
Verás los logs en tiempo real del deployment

### Comandos útiles:
```bash
# Ver logs del App Service
az webapp log tail --name romi-node-webapp-12345 --resource-group romi-node-rg

# Reiniciar App Service
az webapp restart --name romi-node-webapp-12345 --resource-group romi-node-rg
```
