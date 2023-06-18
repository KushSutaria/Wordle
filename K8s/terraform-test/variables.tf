variable "gcp_credentials" {
    type = string
  description = "location of service account"
}
  
variable "gcp_project_id" {
  type = string
    description = "gcp project id"
}
variable "gke_default_node_pool_name" {
  type = string
    description = "gke default node pool name"
}

variable "gcp_region" {
    type = string
    description = "gcp region"
}
variable "gke_cluster_name" {
    type = string
    description = "gke cluster name"
}


variable "gke_zones"{
    type= list(string)
    description = "list of gke zones"
}
variable "gke_network" {
  type = string
    description = "vpc network name"
}
variable "gke_subnetwork" {
  type = string
    description = "vpc subnetwork name"
}

variable "gke_node_pool_name" {
  type = string
    description = "gke node pool name"
}
variable "gke_service_account" {
  type = string
    description = "gke service account"
}
  