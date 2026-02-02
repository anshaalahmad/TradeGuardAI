#!/bin/bash
set -e

echo "=== Before Install ==="

# Clean up old deployment (including hidden files)
if [ -d /var/www/tradeguard ]; then
    echo "Cleaning up existing deployment..."
    sudo rm -rf /var/www/tradeguard/* /var/www/tradeguard/.[!.]* /var/www/tradeguard/..?* 2>/dev/null || true
fi

# Create directories
sudo mkdir -p /var/www/tradeguard
sudo chown -R ubuntu:ubuntu /var/www/tradeguard

echo "=== Before Install Complete ==="
