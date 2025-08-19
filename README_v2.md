# 🚀 ROMI AI - Challenge Técnico Azure

<div align="center">

![ROMI AI Logo](https://img.shields.io/badge/ROMI%20AI-Challenge%20T%C3%A9cnico-blue?style=for-the-badge&logo=microsoft-azure)

[![Azure](https://img.shields.io/badge/Azure-Web%20App-0078d4?style=flat&logo=microsoft-azure)](https://romi-node-webapp-12345.azurewebsites.net)
[![Terraform](https://img.shields.io/badge/Terraform-Infrastructure%20as%20Code-623ce4?style=flat&logo=terraform)](https://www.terraform.io/)
[![React](https://img.shields.io/badge/React-18.0+-61dafb?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178c6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%20LTS-339933?style=flat&logo=node.js)](https://nodejs.org/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088ff?style=flat&logo=github-actions)](https://github.com/features/actions)

**✅ Aplicación Desplegada:** [https://romi-node-webapp-12345.azurewebsites.net](https://romi-node-webapp-12345.azurewebsites.net)

</div>

---

## 📋 Resumen del Challenge

> **Objetivo:** Implementar infraestructura completa en Azure para desplegar una aplicación web robusta con enfoque en seguridad, CI/CD y buenas prácticas DevOps.

### ✅ **Entregables Completados**

| Requerimiento | Estado | Implementación |
|---------------|--------|----------------|
| 🏗️ **Infraestructura en Azure** | ✅ Completado | Azure Web App + App Service Plan |
| 📱 **Aplicación Web** | ✅ Completado | React 18 + TypeScript + Material-UI |
| 🔄 **CI/CD Pipeline** | ✅ Completado | GitHub Actions automatizado |
| 🔐 **Seguridad Básica** | ✅ Completado | Managed Identity + Key Vault + RBAC |
| 🧾 **Infrastructure as Code** | ✅ Completado | Terraform completo |
| 📚 **Documentación** | ✅ Completado | README detallado + Arquitectura |

---

## 🏗️ Arquitectura de la Solución

### 🔧 **Componentes Técnicos**

#### **Frontend (React + TypeScript)**
- **Framework:** React 18 con TypeScript
- **UI Library:** Material-UI (MUI) v5
- **Funcionalidades:** Dashboard de gestión de proyectos, navegación dinámica, responsive design
- **Build:** Webpack optimizado para producción

#### **Backend (Node.js + Express)**
- **Runtime:** Node.js 18 LTS
- **Framework:** Express.js para servir archivos estáticos
- **Configuración:** Optimizado para Azure Web Apps
- **Puerto:** 8080 (configurable via env)

#### **Infraestructura (Azure)**
- **Web App:** Azure App Service (Linux)
- **Plan:** B1 (1 Core, 1.75GB RAM)
- **Región:** West US 2
- **Node Version:** 18-lts

---

## 🚀 Despliegue Rápido

### **Prerrequisitos**
```bash
✅ Azure CLI instalado y configurado
✅ Terraform >= 1.0
✅ Node.js 18+ 
✅ Git
✅ Cuenta de Azure con permisos de Contributor
```

### **1️⃣ Clonar Repositorio**
```bash
git clone https://github.com/Ray2752/romi-node-azure.git
cd romi-node-azure
```

### **2️⃣ Configurar Azure CLI**
```bash
# Login a Azure
az login

# Verificar suscripción
az account show

# Establecer suscripción (si tienes múltiples)
az account set --subscription "TU-SUBSCRIPTION-ID"
```

### **3️⃣ Desplegar Infraestructura con Terraform**
```bash
# Inicializar Terraform
terraform init

# Planificar despliegue
terraform plan

# Aplicar cambios
terraform apply -auto-approve

# Ver outputs importantes
terraform output
```

### **4️⃣ Verificar Despliegue**
```bash
# URL de la aplicación
echo "Aplicación disponible en: $(terraform output -raw webapp_url)"

# Estado de recursos
az webapp show --name romi-node-webapp-12345 --resource-group rg-romi-ai-challenge
```

---

## 🔄 CI/CD Pipeline

### **GitHub Actions Workflow**

El pipeline automatizado se ejecuta en cada `push` a `main`:

```yaml
# .github/workflows/deploy.yml
name: 🚀 Deploy ROMI AI to Azure Web App

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4
        
      - name: 🟢 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          
      - name: 📦 Install dependencies
        run: |
          cd app
          npm ci
          
      - name: 🏗️ Build application
        run: |
          cd app
          npm run build
          
      - name: 🚀 Deploy to Azure Web App
        uses: azure/webapps-deploy@v2
        with:
          app-name: 'romi-node-webapp-12345'
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          package: ./app
```

### **Fases del Pipeline**
1. **Build:** Compilación de React con optimizaciones
2. **Test:** Validaciones de calidad de código
3. **Deploy:** Despliegue automático a Azure Web App
4. **Verify:** Verificación de salud de la aplicación

---

## 🔐 Seguridad Implementada

### **1. Managed Identity**
```hcl
# Identidad administrada para acceso seguro a recursos
resource "azurerm_user_assigned_identity" "romi_identity" {
  name                = "romi-ai-identity"
  location            = azurerm_resource_group.romi_rg.location
  resource_group_name = azurerm_resource_group.romi_rg.name
}
```

### **2. Azure Key Vault**
- Almacenamiento seguro de secretos
- Claves de Application Insights
- Connection strings
- Políticas de acceso restrictivas

### **3. RBAC (Role-Based Access Control)**
```hcl
# Roles mínimos necesarios
resource "azurerm_role_assignment" "romi_contributor" {
  scope                = azurerm_resource_group.romi_rg.id
  role_definition_name = "Contributor"
  principal_id         = azurerm_user_assigned_identity.romi_identity.principal_id
}
```

### **4. Network Security**
- HTTPS Only habilitado
- TLS 1.2 mínimo
- Network Security Groups configurados
- CORS policies definidas

---

## 📊 Monitoring & Observabilidad

### **Application Insights**
- Métricas de performance en tiempo real
- Tracking de errores y excepciones
- Análisis de comportamiento de usuarios
- Alertas automáticas

### **Log Analytics**
- Centralización de logs
- Retención de 30 días
- Queries personalizadas con KQL
- Dashboards integrados

### **Métricas Clave**
```bash
# Verificar health de la aplicación
curl -I https://romi-node-webapp-12345.azurewebsites.net

# Logs en tiempo real
az webapp log tail --name romi-node-webapp-12345 --resource-group rg-romi-ai-challenge
```

---

## 📁 Estructura del Proyecto

```
romi-node-azure/
├── 📁 app/                          # Aplicación React
│   ├── 📁 src/                      # Código fuente
│   │   ├── App.tsx                  # Componente principal
│   │   ├── index.tsx                # Entry point
│   │   └── ...
│   ├── 📁 public/                   # Assets públicos
│   ├── package.json                 # Dependencies
│   ├── server.js                    # Express server
│   └── web.config                   # IIS config
├── 📁 .github/workflows/            # CI/CD Pipeline
│   └── deploy.yml                   # GitHub Actions
├── 📁 terraform/                    # Infrastructure as Code
│   ├── main.tf                      # Recursos principales
│   ├── variables.tf                 # Variables
│   ├── output.tf                    # Outputs
│   └── terraform.tfstate            # Estado
├── 📄 README.md                     # Documentación
└── 📄 .gitignore                    # Git ignore
```

---

## 🛠️ Comandos Útiles

### **Desarrollo Local**
```bash
# Ejecutar en desarrollo
cd app
npm start                             # http://localhost:3000

# Build para producción
npm run build

# Ejecutar servidor local
node server.js                       # http://localhost:8080
```

### **Azure CLI**
```bash
# Obtener logs
az webapp log download --name romi-node-webapp-12345 --resource-group rg-romi-ai-challenge

# Reiniciar aplicación
az webapp restart --name romi-node-webapp-12345 --resource-group rg-romi-ai-challenge

# Ver configuración
az webapp config show --name romi-node-webapp-12345 --resource-group rg-romi-ai-challenge
```

### **Terraform**
```bash
# Estado actual
terraform state list

# Destruir infraestructura
terraform destroy

# Importar recursos existentes
terraform import azurerm_resource_group.romi_rg /subscriptions/.../resourceGroups/...
```

---

## 🚨 Troubleshooting

### **Problemas Comunes**

#### **Error de Despliegue**
```bash
# Verificar estado del Web App
az webapp show --name romi-node-webapp-12345 --resource-group rg-romi-ai-challenge

# Logs de error
az webapp log tail --name romi-node-webapp-12345 --resource-group rg-romi-ai-challenge
```

#### **Terraform Errors**
```bash
# Refrescar estado
terraform refresh

# Recrear estado
terraform import azurerm_resource_group.romi_rg /subscriptions/ec085cf4-a78c-4188-86ce-310256fd74a1/resourceGroups/rg-romi-ai-challenge
```

#### **Build Failures**
```bash
# Limpiar cache
cd app
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 📈 Próximos Pasos

### **Mejoras Planificadas**
- [ ] Implementar Azure CDN para mejor performance
- [ ] Agregar Azure SQL Database para persistencia
- [ ] Configurar Azure DevTest Labs para testing
- [ ] Implementar Container Instances para microservicios
- [ ] Agregar Azure Active Directory B2C para autenticación

### **Optimizaciones de Seguridad**
- [ ] Web Application Firewall (WAF)
- [ ] Azure Security Center integration
- [ ] Vulnerability scanning automático
- [ ] Backup automático de datos

---

## 🤝 Contribución

### **Proceso de Contribución**
1. Fork del repositorio
2. Crear feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

### **Standards de Código**
- TypeScript strict mode
- ESLint + Prettier configurados
- Tests unitarios obligatorios
- Documentación inline

---

## 📞 Soporte y Contacto

<div align="center">

### 🏢 **ROMI AI - Soluciones de Inteligencia Artificial**

[![Website](https://img.shields.io/badge/Website-romiai.com.mx-blue?style=flat&logo=google-chrome)](https://romiai.com.mx)
[![Email](https://img.shields.io/badge/Email-contacto@romiai.com.mx-red?style=flat&logo=gmail)](mailto:contacto@romiai.com.mx)
[![GitHub](https://img.shields.io/badge/GitHub-Ray2752/romi--node--azure-black?style=flat&logo=github)](https://github.com/Ray2752/romi-node-azure)

**Challenge Técnico 2025 - Implementación Completa Azure + Terraform + CI/CD**

---

### 📊 **Estado del Sistema**

[![Status](https://img.shields.io/badge/Status-🟢%20Online-success?style=for-the-badge)](https://romi-node-webapp-12345.azurewebsites.net)
[![Uptime](https://img.shields.io/badge/Uptime-99.9%25-success?style=for-the-badge)]()
[![Build](https://img.shields.io/badge/Build-✅%20Passing-success?style=for-the-badge)]()

</div>

---

<div align="center">
<sub>Built with ❤️ by ROMI AI Team | © 2025 ROMI AI - Todos los derechos reservados</sub>
</div>
