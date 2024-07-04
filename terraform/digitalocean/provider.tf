terraform {
  required_providers {
    digitalocean = {
      source = "digitalocean/digitalocean"
      version = "2.36.0"
    }
  }
}

variable "do_pat" {}
# variable "pvt_key" {}

provider "digitalocean" {
  token = var.do_pat
}

# data "digitalocean_ssh_key" "vutiendat3601" {
#   name = "vutiendat3601"
# }
