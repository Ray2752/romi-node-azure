# =============================================================================
# ROMI AI - TERRAFORM VARIABLES
# =============================================================================
# Variables para la infraestructura completa de Azure
# =============================================================================

# Basic Configuration
variable "location" {
  description = "The Azure location where all resources will be created"
  type        = string
  default     = "West US 2"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "prod"
  
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

# Resource Naming
variable "app_name" {
  description = "Name of the application (used for resource naming)"
  type        = string
  default     = "romi-ai"
}

variable "resource_group_name" {
  description = "Name of the Azure Resource Group"
  type        = string
  default     = "rg-romi-ai-challenge"
}

variable "webapp_name" {
  description = "Name of the Azure Web App"
  type        = string
  default     = "romi-node-webapp-12345"
}

# Application Configuration
variable "node_version" {
  description = "Node.js version for the web app"
  type        = string
  default     = "18-lts"
}

variable "app_service_sku" {
  description = "SKU for the App Service Plan"
  type        = string
  default     = "B1"
  
  validation {
    condition     = contains(["F1", "D1", "B1", "B2", "B3", "S1", "S2", "S3", "P1", "P2", "P3"], var.app_service_sku)
    error_message = "App Service SKU must be a valid Azure App Service plan SKU."
  }
}

# Security Configuration
variable "key_vault_sku" {
  description = "SKU for Azure Key Vault"
  type        = string
  default     = "standard"
  
  validation {
    condition     = contains(["standard", "premium"], var.key_vault_sku)
    error_message = "Key Vault SKU must be standard or premium."
  }
}

# Monitoring Configuration
variable "log_retention_days" {
  description = "Number of days to retain logs in Log Analytics"
  type        = number
  default     = 30
  
  validation {
    condition     = var.log_retention_days >= 30 && var.log_retention_days <= 730
    error_message = "Log retention days must be between 30 and 730."
  }
}

# Common Tags
variable "common_tags" {
  description = "Common tags to be applied to all resources"
  type        = map(string)
  default = {
    Project     = "ROMI-AI-Challenge"
    Environment = "Production"
    Owner       = "ROMI-AI-Team"
    CostCenter  = "Engineering"
    Terraform   = "true"
    Repository  = "romi-node-azure"
  }
}

# CI/CD Configuration
variable "enable_staging_slot" {
  description = "Enable staging slot for blue-green deployments"
  type        = bool
  default     = true
}

variable "enable_app_insights" {
  description = "Enable Application Insights monitoring"
  type        = bool
  default     = true
}

variable "enable_key_vault" {
  description = "Enable Azure Key Vault for secret management"
  type        = bool
  default     = true
}

# Network Security
variable "enable_https_only" {
  description = "Force HTTPS only access"
  type        = bool
  default     = true
}
