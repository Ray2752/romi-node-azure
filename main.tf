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

# Static Web App
resource "azurerm_static_web_app" "romi_ai_static_app" {
  name                = "swa-romi-ai-frontend"
  resource_group_name = azurerm_resource_group.romi_ai_rg.name
  location            = azurerm_resource_group.romi_ai_rg.location
  sku_tier            = "Free"
  sku_size            = "Free"

  tags = {
    Environment = "Production"
    Project     = "ROMI-AI-Challenge"
    Purpose     = "Frontend-Static-Site"
  }
}
