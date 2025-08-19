# =============================================================================
# ROMI AI - AZURE INFRASTRUCTURE as CODE (IaC)
# =============================================================================
# Challenge Técnico - Infraestructura completa para aplicación web
# Incluye: Web App, Security, Monitoring, CI/CD, Resource Management
# =============================================================================

terraform {
  required_version = ">= 1.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
    azuread = {
      source  = "hashicorp/azuread"
      version = "~> 2.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

# =============================================================================
# PROVIDERS CONFIGURATION
# =============================================================================

provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
    key_vault {
      purge_soft_delete_on_destroy    = true
      recover_soft_deleted_key_vaults = true
    }
  }
  subscription_id = "ec085cf4-a78c-4188-86ce-310256fd74a1"
}

provider "azuread" {
  # Configuration options
}

provider "random" {
  # Configuration options
}

# =============================================================================
# DATA SOURCES
# =============================================================================

data "azurerm_client_config" "current" {}

data "azuread_client_config" "current" {}

# =============================================================================
# RANDOM SUFFIX for unique naming
# =============================================================================

resource "random_string" "suffix" {
  length  = 5
  special = false
  upper   = false
}

# =============================================================================
# RESOURCE GROUP
# =============================================================================

resource "azurerm_resource_group" "romi_rg" {
  name     = var.resource_group_name
  location = var.location

  tags = merge(var.common_tags, {
    Component = "Infrastructure"
    Purpose   = "Main Resource Group"
  })
}

# =============================================================================
# SECURITY - KEY VAULT
# =============================================================================

resource "azurerm_key_vault" "romi_kv" {
  name                = "${var.app_name}-kv-${random_string.suffix.result}"
  location            = azurerm_resource_group.romi_rg.location
  resource_group_name = azurerm_resource_group.romi_rg.name
  tenant_id           = data.azurerm_client_config.current.tenant_id
  sku_name            = "standard"

  soft_delete_retention_days = 7
  purge_protection_enabled   = false

  network_acls {
    default_action = "Allow"
    bypass         = "AzureServices"
  }

  tags = merge(var.common_tags, {
    Component = "Security"
    Purpose   = "Secret Management"
  })
}

# Key Vault Access Policy for current user
resource "azurerm_key_vault_access_policy" "current_user" {
  key_vault_id = azurerm_key_vault.romi_kv.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = data.azurerm_client_config.current.object_id

  secret_permissions = [
    "Get", "List", "Set", "Delete", "Purge", "Recover"
  ]

  certificate_permissions = [
    "Get", "List", "Create", "Import", "Delete", "Purge", "Recover"
  ]

  key_permissions = [
    "Get", "List", "Create", "Delete", "Purge", "Recover"
  ]
}

# Key Vault Access Policy for Web App
resource "azurerm_key_vault_access_policy" "webapp" {
  key_vault_id = azurerm_key_vault.romi_kv.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = azurerm_linux_web_app.romi_webapp.identity[0].principal_id

  secret_permissions = [
    "Get", "List"
  ]

  depends_on = [azurerm_linux_web_app.romi_webapp]
}

# =============================================================================
# SECURITY - MANAGED IDENTITY & RBAC
# =============================================================================

# User Assigned Managed Identity
resource "azurerm_user_assigned_identity" "romi_identity" {
  name                = "${var.app_name}-identity"
  location            = azurerm_resource_group.romi_rg.location
  resource_group_name = azurerm_resource_group.romi_rg.name

  tags = merge(var.common_tags, {
    Component = "Security"
    Purpose   = "Managed Identity"
  })
}

# Role Assignment - Contributor to Resource Group
resource "azurerm_role_assignment" "romi_contributor" {
  scope                = azurerm_resource_group.romi_rg.id
  role_definition_name = "Contributor"
  principal_id         = azurerm_user_assigned_identity.romi_identity.principal_id
}

# Role Assignment - Key Vault Secrets User
resource "azurerm_role_assignment" "romi_kv_secrets" {
  scope                = azurerm_key_vault.romi_kv.id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = azurerm_user_assigned_identity.romi_identity.principal_id
}

# =============================================================================
# APP SERVICE PLAN
# =============================================================================

resource "azurerm_service_plan" "romi_plan" {
  name                = "${var.app_name}-plan"
  location            = azurerm_resource_group.romi_rg.location
  resource_group_name = azurerm_resource_group.romi_rg.name
  os_type             = "Linux"
  sku_name            = var.app_service_sku

  tags = merge(var.common_tags, {
    Component = "Compute"
    Purpose   = "App Service Plan"
  })
}

# =============================================================================
# WEB APPLICATION
# =============================================================================

resource "azurerm_linux_web_app" "romi_webapp" {
  name                = var.webapp_name
  location            = azurerm_resource_group.romi_rg.location
  resource_group_name = azurerm_resource_group.romi_rg.name
  service_plan_id     = azurerm_service_plan.romi_plan.id

  # Managed Identity
  identity {
    type         = "SystemAssigned, UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.romi_identity.id]
  }

  # Application Configuration
  site_config {
    application_stack {
      node_version = var.node_version
    }

    # Security Headers
    app_command_line = "node server.js"
    
    # CORS
    cors {
      allowed_origins = ["*"]
    }

    # Performance & Security
    use_32_bit_worker = false
    always_on         = true
    http2_enabled     = true
  }

  # Application Settings
  app_settings = {
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"
    "WEBSITES_PORT"                       = "8080"
    "NODE_ENV"                           = var.environment
    "APP_VERSION"                        = "2.0"
    "AZURE_KEY_VAULT_URL"               = azurerm_key_vault.romi_kv.vault_uri
    "APPINSIGHTS_INSTRUMENTATIONKEY"     = azurerm_application_insights.romi_insights.instrumentation_key
    "APPLICATIONINSIGHTS_CONNECTION_STRING" = azurerm_application_insights.romi_insights.connection_string
  }

  # HTTPS Only
  https_only = true

  tags = merge(var.common_tags, {
    Component = "Application"
    Purpose   = "Web Application"
  })
}

# =============================================================================
# MONITORING - APPLICATION INSIGHTS
# =============================================================================

resource "azurerm_log_analytics_workspace" "romi_logs" {
  name                = "${var.app_name}-logs"
  location            = azurerm_resource_group.romi_rg.location
  resource_group_name = azurerm_resource_group.romi_rg.name
  sku                 = "PerGB2018"
  retention_in_days   = 30

  tags = merge(var.common_tags, {
    Component = "Monitoring"
    Purpose   = "Log Analytics"
  })
}

resource "azurerm_application_insights" "romi_insights" {
  name                = "${var.app_name}-insights"
  location            = azurerm_resource_group.romi_rg.location
  resource_group_name = azurerm_resource_group.romi_rg.name
  workspace_id        = azurerm_log_analytics_workspace.romi_logs.id
  application_type    = "Node.JS"

  tags = merge(var.common_tags, {
    Component = "Monitoring"
    Purpose   = "Application Insights"
  })
}

# Staging Slot for deployments
resource "azurerm_linux_web_app_slot" "romi_staging" {
  name           = "staging"
  app_service_id = azurerm_linux_web_app.romi_webapp.id

  site_config {
    application_stack {
      node_version = var.node_version
    }
    always_on = false
  }

  app_settings = {
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"
    "WEBSITES_PORT"                       = "8080"
    "NODE_ENV"                           = "staging"
    "APP_VERSION"                        = "2.0-staging"
    "APPINSIGHTS_INSTRUMENTATIONKEY"     = azurerm_application_insights.romi_insights.instrumentation_key
    "APPLICATIONINSIGHTS_CONNECTION_STRING" = azurerm_application_insights.romi_insights.connection_string
  }

  tags = merge(var.common_tags, {
    Component = "Application"
    Purpose   = "Staging Slot"
  })
}

# =============================================================================
# STORAGE ACCOUNT (for static files, logs, backups)
# =============================================================================

resource "azurerm_storage_account" "romi_storage" {
  name                     = "${var.app_name}storage${random_string.suffix.result}"
  resource_group_name      = azurerm_resource_group.romi_rg.name
  location                 = azurerm_resource_group.romi_rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  
  # Security
  min_tls_version                = "TLS1_2"
  allow_nested_items_to_be_public = false
  
  # Network Rules
  network_rules {
    default_action = "Allow"
  }

  tags = merge(var.common_tags, {
    Component = "Storage"
    Purpose   = "Application Storage"
  })
}

# Storage Container for application files
resource "azurerm_storage_container" "romi_app_files" {
  name                  = "app-files"
  storage_account_name  = azurerm_storage_account.romi_storage.name
  container_access_type = "private"
}

# Storage Container for logs and backups
resource "azurerm_storage_container" "romi_logs" {
  name                  = "logs"
  storage_account_name  = azurerm_storage_account.romi_storage.name
  container_access_type = "private"
}

# =============================================================================
# SECURITY - SECRETS
# =============================================================================

# Store important secrets in Key Vault
resource "azurerm_key_vault_secret" "app_insights_key" {
  name         = "ApplicationInsights-InstrumentationKey"
  value        = azurerm_application_insights.romi_insights.instrumentation_key
  key_vault_id = azurerm_key_vault.romi_kv.id

  depends_on = [azurerm_key_vault_access_policy.current_user]

  tags = merge(var.common_tags, {
    Component = "Security"
    Purpose   = "Application Secret"
  })
}

resource "azurerm_key_vault_secret" "storage_connection" {
  name         = "StorageAccount-ConnectionString"
  value        = azurerm_storage_account.romi_storage.primary_connection_string
  key_vault_id = azurerm_key_vault.romi_kv.id

  depends_on = [azurerm_key_vault_access_policy.current_user]

  tags = merge(var.common_tags, {
    Component = "Security"
    Purpose   = "Storage Secret"
  })
}

# =============================================================================
# NETWORK SECURITY GROUP (Optional - for enhanced security)
# =============================================================================

resource "azurerm_network_security_group" "romi_nsg" {
  name                = "${var.app_name}-nsg"
  location            = azurerm_resource_group.romi_rg.location
  resource_group_name = azurerm_resource_group.romi_rg.name

  # Allow HTTPS
  security_rule {
    name                       = "HTTPS"
    priority                   = 1001
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "443"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  # Allow HTTP (for redirects)
  security_rule {
    name                       = "HTTP"
    priority                   = 1002
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "80"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  tags = merge(var.common_tags, {
    Component = "Security"
    Purpose   = "Network Security"
  })
}
