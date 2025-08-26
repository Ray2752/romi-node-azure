# ROMI Task Manager - Azure Deployment

## Descripción

Aplicación web **Node.js** desplegada en **Azure** usando **Infrastructure as Code** con **Terraform**.

**App Desplegada:** romi-node-webapp-12345.azurewebsites.net

---

## **Cumplimiento del Reto**

### **Requisitos Implementados:**
- **Aplicación Web:** Node.js + React desplegada en Azure App Service
- **Infrastructure as Code:** Terraform para recursos Azure
- **CI/CD:** GitHub Actions pipeline automático
- **Seguridad:** Service Principal, Secrets, CORS, Helmet
- **Documentación:** README con pasos y arquitectura

---

## **Estructura del Proyecto**

```
romi-node-azure/
├── main.tf              # Recursos Azure (App Service, Resource Group)
├── variables.tf         # Variables de configuración
├── output.tf           # Outputs de recursos
├── .github/workflows/
│   └── deploy.yml      # Pipeline CI/CD
└── app/
    ├── server.js       # Backend Node.js
    ├── src/App.tsx     # Frontend React
    └── package.json    # Dependencias
```

---

## **Arquitectura**

```
GitHub Actions (CI/CD)
         ↓
Azure App Service (Linux + Node.js 18)
         ↓
Full Stack App (React + Express)
         ↓
MongoDB Atlas (Database)
```

**Recursos Azure:**
- Resource Group: `rg-romi-task-manager`
- App Service Plan: `plan-romi-task-manager` (Linux B1)
- Web App: `romi-task-manager`

---

## **Pasos de Deployment**

### **1. Clonar repositorio:**
```bash
git clone https://github.com/Ray2752/romi-node-azure.git
cd romi-node-azure
```

### **2. Configurar variables:**
```bash
# Crear terraform.tfvars
azure_subscription_id = "tu-subscription-id"
mongo_uri = "tu-mongodb-uri"
app_name = "tu-app-name"
```

### **3. Deploy con Terraform:**
```bash
terraform init
terraform plan
terraform apply
```

### **4. Configurar GitHub Secrets:**
- `AZURE_WEBAPP_PUBLISH_PROFILE` (descargar desde Azure Portal)

### **5. Deploy automático:**
```bash
git push origin main  # Activa el pipeline CI/CD
```

---

## **Seguridad Implementada**

- **Azure Service Principal** para acceso automatizado
- **GitHub Secrets** para credenciales
- **Variables sensibles** marcadas en Terraform
- **CORS + Helmet** en la aplicación
- **Resource tagging** para auditoría

---

## **API Endpoints**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/tasks` | Listar tareas |
| `POST` | `/api/tasks` | Crear tarea |
| `PUT` | `/api/tasks/:id` | Actualizar tarea |
| `DELETE` | `/api/tasks/:id` | Eliminar tarea |

---

## **CI/CD Pipeline**

**GitHub Actions:**
1. Build React app
2. Install dependencies
3. Deploy to Azure App Service
4. Verify deployment

**Trigger:** Push a branch `main`
**Desarrollador:** [@Ray2752](https://github.com/Ray2752)  
**Repositorio:** https://github.com/Ray2752/romi-node-azure
