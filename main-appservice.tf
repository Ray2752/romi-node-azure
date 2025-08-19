terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }
}

provider "azurerm" {
  features {}
  subscription_id = "ec085cf4-a78c-4188-86ce-310256fd74a1"
}

# Resource Group
resource "azurerm_resource_group" "romi_ai_rg" {
  name     = "rg-romi-ai-frontend"
  location = "West US 2"

  tags = {
    Environment = "Production"
    Project     = "ROMI-AI-Challenge"
    Purpose     = "Frontend-Only"
  }
}

# App Service Plan (Free tier)
resource "azurerm_service_plan" "romi_ai_plan" {
  name                = "plan-romi-ai-frontend"
  resource_group_name = azurerm_resource_group.romi_ai_rg.name
  location            = azurerm_resource_group.romi_ai_rg.location
  os_type             = "Linux"
  sku_name            = "F1"

  tags = {
    Environment = "Production"
    Project     = "ROMI-AI-Challenge"
    Purpose     = "Frontend-Hosting"
  }
}

# App Service
resource "azurerm_linux_web_app" "romi_ai_app" {
  name                = "romi-ai-frontend-demo"
  resource_group_name = azurerm_resource_group.romi_ai_rg.name
  location            = azurerm_service_plan.romi_ai_plan.location
  service_plan_id     = azurerm_service_plan.romi_ai_plan.id

  site_config {
    always_on = false
    
    application_stack {
      node_version = "18-lts"
    }
  }

  app_settings = {
    "WEBSITE_NODE_DEFAULT_VERSION" = "18.17.0"
    "SCM_DO_BUILD_DURING_DEPLOYMENT" = "true"
  }

  tags = {
    Environment = "Production"
    Project     = "ROMI-AI-Challenge"
    Purpose     = "Frontend-React-App"
  }
}
