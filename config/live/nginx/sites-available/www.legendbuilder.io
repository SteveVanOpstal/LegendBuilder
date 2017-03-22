server {
  listen 443 ssl http2;
  listen [::]:443 ssl http2;
  server_name www.legendbuilder.io;

  # ssl configuration
  include snippets/ssl-params.conf;

  # certificates
  ssl_certificate /etc/letsencrypt/live/www.legendbuilder.io/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/www.legendbuilder.io/privkey.pem;
  ssl_trusted_certificate /etc/letsencrypt/live/www.legendbuilder.io/chain.pem;

  # locations
  include snippets/locations.conf;
}
