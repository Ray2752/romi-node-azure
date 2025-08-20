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

### Terraform
```bash
terraform init
terraform plan
terraform apply
```

### Azure
El proyecto se despliega automáticamente en Azure App Service con la configuración de Terraform.

## 📞 **Contacto**

**🏢 ROMI AI**  
**🌐 Website:** [https://romiai.com.mx/](https://romiai.com.mx/)  
**‍💻 Desarrollador:** [@Ray2752](https://github.com/Ray2752)
