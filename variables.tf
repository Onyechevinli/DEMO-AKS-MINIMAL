variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
  default     = "rg-webapp"
}

variable "location" {
  description = "Azure region for resources"
  type        = string
  default     = "East US"
}

variable "environment" {
  description = "Environment name for tagging"
  type        = string
  default     = "Development"
}

variable "project_name" {
  description = "Project name for tagging"
  type        = string
  default     = "AKS WebApp"
}

# AKS Configuration
variable "aks_cluster_name" {
  description = "Name of the AKS cluster"
  type        = string
  default     = "aks-webapp-cluster"
}

variable "kubernetes_version" {
  description = "Kubernetes version for AKS cluster"
  type        = string
  default     = "1.33.4"
}

variable "node_count" {
  description = "Number of nodes in the default node pool"
  type        = number
  default     = 2

  validation {
    condition     = var.node_count >= 1 && var.node_count <= 10
    error_message = "Node count must be between 1 and 10."
  }
}

variable "node_vm_size" {
  description = "VM size for the AKS nodes"
  type        = string
  default     = "Standard_D2s_v3"
}

# ACR Configuration
variable "acr_name" {
  description = "Name of the Azure Container Registry (will have random suffix)"
  type        = string
  default     = "acrdemoapp"

  validation {
    condition     = can(regex("^[a-zA-Z0-9]*$", var.acr_name))
    error_message = "ACR name can only contain alphanumeric characters."
  }
}

variable "acr_sku" {
  description = "SKU for the Azure Container Registry"
  type        = string
  default     = "Basic"

  validation {
    condition     = contains(["Basic", "Standard", "Premium"], var.acr_sku)
    error_message = "ACR SKU must be Basic, Standard, or Premium."
  }
}

# Application Configuration
variable "app_name" {
  description = "Name of the application"
  type        = string
  default     = "webapp-demo"
}

variable "app_namespace" {
  description = "Kubernetes namespace for the application"
  type        = string
  default     = "default"
}