output "static_web_app_url" {
  description = "The URL of the deployed Static Web App"
  value       = azurerm_static_web_app.romi_ai_static_app.default_host_name
}

output "static_web_app_api_key" {
  description = "The API key for the Static Web App (sensitive)"
  value       = azurerm_static_web_app.romi_ai_static_app.api_key
  sensitive   = true
}

output "resource_group_name" {
  description = "The name of the resource group"
  value       = azurerm_resource_group.romi_ai_rg.name
}
