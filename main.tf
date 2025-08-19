provider "azurerm" {
  features {}

  subscription_id = "ec085cf4-a78c-4188-86ce-310256fd74a1"
}


resource "azurerm_resource_group" "rg" {
  name     = "romi-node-rg"
  location = "East US"
}

resource "azurerm_app_service_plan" "plan" {
  name                = "romi-node-plan"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  kind                = "Linux"
  reserved            = true

  sku {
    tier = "Basic"
    size = "B1"
  }
}

resource "azurerm_app_service" "webapp" {
  name                = "romi-node-webapp-12345" # Cambia si ya existe en Azure
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  app_service_plan_id = azurerm_app_service_plan.plan.id

  site_config {
    linux_fx_version = "NODE|18-lts"
  }

  app_settings = {
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"
    "WEBSITES_PORT"                       = "3000"
  }
}
