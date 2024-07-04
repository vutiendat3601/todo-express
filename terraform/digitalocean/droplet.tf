# Create a new Web Droplet in the nyc2 region
resource "digitalocean_droplet" "backend" {
  image  = "ubuntu-22-04-x64"
  name   = "ndngroup"
  region = "nyc2"
  size   = "s-1vcpu-1gb"
}
