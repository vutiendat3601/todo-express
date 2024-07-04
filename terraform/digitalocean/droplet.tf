resource "digitalocean_droplet" "backend" {
  image  = "ubuntu-22-04-x64"
  name   = "ndngroup"
  region = "sgp1"
  size   = "s-1vcpu-1gb"
}
