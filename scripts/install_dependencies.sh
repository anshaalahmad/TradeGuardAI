#!/bin/bash
set -e

echo "=== Installing System Dependencies ==="

# This script installs all necessary system dependencies for the application
# Run this once on a new EC2 instance before deploying with CodeDeploy

# Update system packages
echo "Updating system packages..."
sudo apt-get update

# Install Node.js 20.x
echo "Installing Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install PM2 globally
echo "Installing PM2..."
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
fi

# Install Nginx
echo "Installing Nginx..."
if ! command -v nginx &> /dev/null; then
    sudo apt-get install -y nginx
fi

# Install CodeDeploy agent
echo "Installing CodeDeploy agent..."
if ! command -v codedeploy-agent &> /dev/null; then
    sudo apt-get install -y ruby-full wget
    cd /home/ubuntu
    wget https://aws-codedeploy-ap-south-1.s3.ap-south-1.amazonaws.com/latest/install
    chmod +x ./install
    sudo ./install auto
    sudo systemctl start codedeploy-agent
    sudo systemctl enable codedeploy-agent
fi

# Verify installations
echo ""
echo "=== Verification ==="
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"
echo "PM2 installed: $(pm2 --version)"
echo "Nginx version: $(nginx -v 2>&1)"
echo "CodeDeploy agent status:"
sudo systemctl status codedeploy-agent --no-pager | head -3

echo ""
echo "=== System Dependencies Installation Complete ==="
echo ""
echo "Next steps:"
echo "1. Create .env files at /home/ubuntu/.env.backend"
echo "2. Run a deployment from AWS CodeDeploy"
echo "3. After deployment, run: sudo ./scripts/setup_ssl.sh yourdomain.com"
