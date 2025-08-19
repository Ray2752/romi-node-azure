# 🚀 ROMI Azure DevOps Challenge

## 📋 Descripción

Este proyecto implementa una **API REST completa** desplegada en **Azure App Service** usando **Infrastructure as Code (Terraform)** y **CI/CD con GitHub Actions**.

### 🎯 **API: ROMI Task Manager**
Una API REST para gestión de tareas que demuestra:
- ✅ CRUD completo (Create, Read, Update, Delete)
- ✅ Validaciones y manejo de errores
- ✅ Health checks
- ✅ Filtros y búsquedas
- ✅ Respuestas JSON estructuradas

## 🏗️ **Arquitectura**

### **Componentes:**
- **Frontend:** API REST (Node.js + Express)
- **Infrastructure:** Azure App Service (Linux Container)
- **CI/CD:** GitHub Actions
- **IaC:** Terraform
- **Security:** Azure Identity and Access Management

## 🚀 **Endpoints Disponibles**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/` | Información de la API |
| `GET` | `/api/health` | Health check |
| `GET` | `/api/tasks` | Obtener todas las tareas |
| `GET` | `/api/tasks?status=pending` | Filtrar tareas por status |
| `GET` | `/api/tasks/:id` | Obtener tarea específica |
| `POST` | `/api/tasks` | Crear nueva tarea |
| `PUT` | `/api/tasks/:id` | Actualizar tarea |
| `DELETE` | `/api/tasks/:id` | Eliminar tarea |

## �️ **Tecnologías Utilizadas**

- **Backend:** Node.js 18 + Express.js
- **Infrastructure:** Terraform + Azure Provider
- **CI/CD:** GitHub Actions
- **Cloud:** Azure App Service (Linux)
- **Security:** Azure RBAC, Publish Profiles

## 📦 **Estructura del Proyecto**

```
romi-node-azure/
├── 🏗️ Infrastructure (Terraform)
│   ├── main.tf              # Configuración principal
│   ├── variables.tf         # Variables de entrada
│   ├── output.tf           # Outputs de recursos
│   └── terraform.tfstate   # Estado de infraestructura
├── 📱 Application
│   ├── app/
│   │   ├── index.js        # API REST principal
│   │   ├── package.json    # Dependencias Node.js
│   │   ├── web.config      # Configuración IIS/Azure
│   │   └── startup.sh      # Script de inicio
├── ⚙️ CI/CD
│   └── .github/workflows/
│       └── deploy.yml      # Pipeline de deployment
└── 📚 Documentation
    ├── README.md           # Este archivo
    └── .gitignore         # Archivos excluidos
```

## 🚀 **Guía de Deployment**

## 🏗️ Infraestructura

- Azure Resource Group
- Azure App Service Plan (Linux)
- Azure Web App (Node.js)
- CI/CD con GitHub Actions

## 🚀 Despliegue

1. Clona el repositorio:
```bash
git clone https://github.com/tuusuario/romi-node-azure.git
cd romi-node-azure
