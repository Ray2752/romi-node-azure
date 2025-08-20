variable "azure_subscription_id" {
  description = "Azure Subscription ID"
  type        = string
  default     = "ec085cf4-a78c-4188-86ce-310256fd74a1"
}

variable "location" {
  description = "Azure region for resources"
  type        = string
  default     = "West US 2"
}

variable "environment" {
  description = "Environment name (dev, staging, production)"
  type        = string
  default     = "production"
}

variable "app_name" {
  description = "Name of the Azure Web App"
  type        = string
  default     = "romi-task-manager"
}

variable "app_service_sku" {
  description = "SKU for App Service Plan"
  type        = string
  default     = "B1"
  
  validation {
    condition = contains(["B1", "B2", "B3", "S1", "S2", "S3", "P1v2", "P2v2", "P3v2"], var.app_service_sku)
    error_message = "App service SKU must be a valid Azure App Service SKU."
  }
}

variable "mongo_uri" {
  description = "MongoDB connection string"
  type        = string
  sensitive   = true
  default     = ""
}
