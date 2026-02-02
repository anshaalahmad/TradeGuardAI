#!/bin/bash
set -e

echo "=== SSL Certificate Setup ==="

# This script should be run manually after deployment with your domain name
# Usage: sudo ./setup_ssl.sh yourdomain.com [email]

if [ -z "$1" ]; then
    echo "Usage: sudo ./setup_ssl.sh yourdomain.com [email]"
    echo "Example: sudo ./setup_ssl.sh tradeguardai.com admin@tradeguardai.com"
    echo ""
    echo "Email is optional but recommended for:"
    echo "  - Certificate expiration notices"
    echo "  - Security notifications from Let's Encrypt"
    echo "  - Account recovery"
    exit 1
fi

DOMAIN=$1
EMAIL=$2

echo "Setting up SSL certificate for $DOMAIN..."

# Install Certbot if not already installed
if ! command -v certbot &> /dev/null; then
    echo "Installing Certbot..."
    sudo apt-get update
    sudo apt-get install -y certbot python3-certbot-nginx
fi

# Update Nginx configuration with domain name
sudo tee /etc/nginx/sites-available/tradeguard > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # Frontend - Static files
    location / {
        root /var/www/tradeguard/Frontend/dist;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Obtain SSL certificate
echo "Obtaining SSL certificate from Let's Encrypt..."
if [ -z "$EMAIL" ]; then
    echo "Note: No email provided - using --register-unsafely-without-email"
    echo "Consider providing an email to receive important security notifications"
    sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --register-unsafely-without-email
else
    sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email $EMAIL
fi

# Setup auto-renewal
echo "Setting up automatic renewal..."
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

echo "=== SSL Setup Complete ==="
echo "Your site is now secured with HTTPS!"
echo "Certificate will auto-renew before expiration."
