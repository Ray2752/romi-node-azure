# 🚀 ROMI AI Task Manager

## 📋 Descripción

Aplicación **Full Stack MERN** (MongoDB, Express, React, Node.js) desplegada en **Azure** con **Infrastructure as Code**.

### 🎯 Sistema de gestión de tareas

**🏢 Empresa:** [ROMI AI](https://romiai.com.mx/) - Soluciones de Inteligencia Artificial

## �️ **Stack Tecnológico**

### **Frontend**
- React 18 con TypeScript
- Material-UI para diseño
- API REST integrada

### **Backend**
- Node.js + Express
- MongoDB con Mongoose
- Seguridad con Helmet y CORS

### **Infrastructure**
- Azure App Service
- Azure Cosmos DB
- Terraform para IaC

## 📦 **Estructura del Proyecto**

```
romi-node-azure/
├── main.tf              # Configuración Terraform
├── variables.tf         # Variables de infraestructura
├── output.tf           # Outputs de recursos
├── package.json        # Dependencias del proyecto
└── app/
    ├── server.js       # Servidor Express
    ├── package.json    # Dependencias backend
    ├── src/            # Código React
    ├── build/          # Build de producción
    └── public/         # Archivos estáticos
```

## 🚀 **API Endpoints**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/health` | Health Check |
| `GET` | `/api/tasks` | Obtener todas las tareas |
| `GET` | `/api/tasks/:id` | Obtener tarea específica |
| `POST` | `/api/tasks` | Crear nueva tarea |
| `PUT` | `/api/tasks/:id` | Actualizar tarea |
| `DELETE` | `/api/tasks/:id` | Eliminar tarea |

## 🚀 **Desarrollo Local**

### Backend
```bash
cd app
npm install
npm start
```

### Frontend (React)
El frontend se sirve desde el build estático en `/app/build/`

## 🌐 **Deployment**

### **🔧 Configuración Inicial**

1. **Clonar el repositorio:**
```bash
git clone https://github.com/Ray2752/romi-node-azure.git
cd romi-node-azure
```

2. **Configurar variables de entorno:**
```bash
# Crear terraform.tfvars
azure_subscription_id = "tu-subscription-id"
mongo_uri = "tu-mongodb-connection-string"
app_name = "tu-app-name"
```

### **🏗️ Infrastructure as Code (Terraform)**

```bash
# Inicializar Terraform
terraform init

# Revisar plan de deployment
terraform plan

# Aplicar infraestructura
terraform apply
```

### **⚙️ Recursos Creados en Azure:**
- **Resource Group:** `rg-romi-task-manager`
- **App Service Plan:** `plan-romi-task-manager` (Linux B1)
- **Web App:** `romi-task-manager` (Node.js 18 LTS)

### **🚀 CI/CD Pipeline**

El proyecto incluye **GitHub Actions** para deployment automático:

- **Trigger:** Push a branch `main`
- **Build:** React app + Node.js backend
- **Deploy:** Azure App Service via publish profile
- **URL:** https://romi-task-manager.azurewebsites.net

### **📊 Arquitectura del Sistema**

```
Frontend (React) → Backend (Express) → MongoDB Atlas
     ↓                    ↓                ↓
 Material-UI        REST APIs       Task Collections
 TypeScript         CORS/Helmet     User Data
 Search/CRUD        Health Checks   Persistence
```

## 📞 **Contacto**

**🏢 ROMI AI**  
**🌐 Website:** [https://romiai.com.mx/](https://romiai.com.mx/)  
**‍💻 Desarrollador:** [@Ray2752](https://github.com/Ray2752)
