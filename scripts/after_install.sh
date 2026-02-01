#!/bin/bash
set -e

echo "=== After Install ==="

cd /var/www/tradeguard

# Set permissions
sudo chown -R ubuntu:ubuntu /var/www/tradeguard

# Navigate to Backend and install production dependencies if node_modules missing
cd /var/www/tradeguard/Backend
if [ ! -d "node_modules" ]; then
    npm ci --production
fi

# Copy environment file if exists in secure location
if [ -f /home/ubuntu/.env.backend ]; then
    cp /home/ubuntu/.env.backend /var/www/tradeguard/Backend/.env
fi

echo "=== After Install Complete ==="
