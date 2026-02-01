#!/bin/bash
set -e

echo "=== Application Start ==="

# Start Backend with PM2
cd /var/www/tradeguard/Backend
pm2 delete tradeguard-api 2>/dev/null || true
pm2 start src/server.js --name tradeguard-api
pm2 save

# Configure Nginx to serve Frontend
sudo tee /etc/nginx/sites-available/tradeguard > /dev/null <<EOF
server {
    listen 80;
    server_name _;

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

# Enable the site
sudo ln -sf /etc/nginx/sites-available/tradeguard /etc/nginx/sites-enabled/tradeguard

# Remove default nginx config if exists
sudo rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true

# Test and reload Nginx
sudo nginx -t
sudo systemctl reload nginx

echo "=== Application Start Complete ==="
