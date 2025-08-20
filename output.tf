output "resource_group_name" {
  description = "Name of the created resource group"
  value       = azurerm_resource_group.romi_task_manager_rg.name
}

output "app_service_name" {
  description = "Name of the Azure App Service"
  value       = azurerm_linux_web_app.romi_task_manager_app.name
}

output "app_service_url" {
  description = "URL of the deployed application"
  value       = "https://${azurerm_linux_web_app.romi_task_manager_app.default_hostname}"
}

output "app_service_plan_name" {
  description = "Name of the App Service Plan"
  value       = azurerm_service_plan.romi_task_manager_plan.name
}

output "location" {
  description = "Azure region where resources are deployed"
  value       = azurerm_resource_group.romi_task_manager_rg.location
}
