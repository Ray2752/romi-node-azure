# =============================================================================
# ROMI AI - TERRAFORM OUTPUTS
# =============================================================================
# Outputs importantes para la aplicación y monitoring
# =============================================================================

# Application URLs
output "webapp_url" {
  description = "URL of the deployed web application"
  value       = "https://${azurerm_linux_web_app.romi_webapp.default_hostname}"
}

output "webapp_staging_url" {
  description = "URL of the staging slot"
  value       = "https://${azurerm_linux_web_app_slot.romi_staging.default_hostname}"
}

# Resource Information
output "resource_group_name" {
  description = "Name of the resource group"
  value       = azurerm_resource_group.romi_rg.name
}

output "webapp_name" {
  description = "Name of the web app"
  value       = azurerm_linux_web_app.romi_webapp.name
}

# Security & Identity
output "key_vault_name" {
  description = "Name of the Key Vault"
  value       = azurerm_key_vault.romi_kv.name
}

output "key_vault_uri" {
  description = "URI of the Key Vault"
  value       = azurerm_key_vault.romi_kv.vault_uri
}

# Deployment Information
output "deployment_info" {
  description = "Summary of deployed resources"
  value = {
    webapp_url          = "https://${azurerm_linux_web_app.romi_webapp.default_hostname}"
    staging_url         = "https://${azurerm_linux_web_app_slot.romi_staging.default_hostname}"
    resource_group      = azurerm_resource_group.romi_rg.name
    location            = azurerm_resource_group.romi_rg.location
    environment         = var.environment
    node_version        = var.node_version
    app_service_sku     = var.app_service_sku
    key_vault_name      = azurerm_key_vault.romi_kv.name
    monitoring_enabled  = true
    https_only          = azurerm_linux_web_app.romi_webapp.https_only
  }
}
