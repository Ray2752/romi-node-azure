terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }
  required_version = ">= 1.0"
}

provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
  }
  subscription_id = var.azure_subscription_id
}

resource "azurerm_resource_group" "romi_task_manager_rg" {
  name     = "rg-romi-task-manager"
  location = var.location

  tags = {
    Environment = var.environment
    Project     = "ROMI-Task-Manager"
    Purpose     = "Full-Stack-Web-App"
    CreatedBy   = "Terraform"
  }
}

resource "azurerm_service_plan" "romi_task_manager_plan" {
  name                = "plan-romi-task-manager"
  location            = azurerm_resource_group.romi_task_manager_rg.location
  resource_group_name = azurerm_resource_group.romi_task_manager_rg.name
  
  os_type  = "Linux"
  sku_name = var.app_service_sku

  tags = {
    Environment = var.environment
    Project     = "ROMI-Task-Manager"
    Purpose     = "App-Service-Plan"
    CreatedBy   = "Terraform"
  }
}

resource "azurerm_linux_web_app" "romi_task_manager_app" {
  name                = var.app_name
  location            = azurerm_resource_group.romi_task_manager_rg.location
  resource_group_name = azurerm_resource_group.romi_task_manager_rg.name
  service_plan_id     = azurerm_service_plan.romi_task_manager_plan.id

  site_config {
    always_on = false

    application_stack {
      node_version = "18-lts"
    }

    app_command_line = "npm start"
  }

  app_settings = {
    "WEBSITE_NODE_DEFAULT_VERSION" = "18.17.0"
    "NODE_ENV"                    = var.environment
    "MONGO_URI"                   = var.mongo_uri
    "PORT"                        = "8000"
    "WEBSITE_RUN_FROM_PACKAGE"    = "1"
  }

  connection_string {
    name  = "DefaultConnection"
    type  = "Custom"
    value = var.mongo_uri
  }

  tags = {
    Environment = var.environment
    Project     = "ROMI-Task-Manager"
    Purpose     = "Web-Application"
    CreatedBy   = "Terraform"
  }
}
