# AWS CodeDeploy Deployment Guide for TradeGuardAI

This guide explains how to deploy TradeGuardAI to an AWS EC2 instance in the Mumbai (ap-south-1) region using AWS CodeDeploy.

## Prerequisites

### AWS Resources Required
- **EC2 Instance**: Ubuntu 22.04 LTS or newer (t2.medium or larger recommended)
- **Security Group**: Open ports 22 (SSH), 80 (HTTP), 443 (HTTPS)
- **IAM Role**: EC2 instance role with CodeDeploy agent permissions
- **CodeDeploy Application**: Created in AWS CodeDeploy console
- **CodeDeploy Deployment Group**: Associated with your EC2 instance
- **S3 Bucket**: For storing deployment artifacts (or use GitHub integration)

### Domain Configuration
- Domain name pointed to your EC2 instance's public IP
- DNS propagation completed (can take up to 48 hours)

## Step 1: Launch EC2 Instance

1. **Launch Instance** in Mumbai region (ap-south-1):
   - AMI: Ubuntu 22.04 LTS
   - Instance Type: t2.medium or larger
   - Storage: 20GB+ SSD
   - Key Pair: Create or use existing (e.g., `tradeguard-mumbai-key.pem`)

2. **Configure Security Group**:
   ```
   Type            Protocol    Port Range    Source
   SSH             TCP         22            Your IP / 0.0.0.0/0
   HTTP            TCP         80            0.0.0.0/0
   HTTPS           TCP         443           0.0.0.0/0
   Custom TCP      TCP         5000          127.0.0.1/32 (Backend - localhost only)
   ```

3. **Attach IAM Role**:
   - Create IAM role with `AWSCodeDeployRole` policy
   - Attach to EC2 instance

## Step 2: Initial Server Setup

### Connect to Server
```bash
ssh -i "tradeguard-mumbai-key.pem" ubuntu@ec2-XX-XXX-XXX-XXX.ap-south-1.compute.amazonaws.com
```

### Install System Dependencies
```bash
# Download the repository or copy the installation script
wget https://raw.githubusercontent.com/anshaalahmad/TradeGuardAI/main/scripts/install_dependencies.sh

# Make it executable
chmod +x install_dependencies.sh

# Run the installation
sudo ./install_dependencies.sh
```

This script installs:
- Node.js 20.x
- npm
- PM2 (process manager)
- Nginx (web server)
- AWS CodeDeploy agent

## Step 3: Configure Environment Variables

### Backend Environment File

Create `/home/ubuntu/.env.backend` with your production configuration:

```bash
nano /home/ubuntu/.env.backend
```

Paste the following (update with your actual values):

```env
# ===========================================
# SERVER CONFIGURATION
# ===========================================
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com

# ===========================================
# DATABASE
# ===========================================
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/tradeguardai?retryWrites=true&w=majority"

# ===========================================
# AUTHENTICATION
# ===========================================
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
JWT_REFRESH_SECRET=your-refresh-token-secret-at-least-32-characters-long
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Google OAuth 2.0
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# ===========================================
# EXTERNAL APIS
# ===========================================
# CoinGecko (optional - for enhanced rate limits)
COINGECKO_API_KEY=your-coingecko-api-key

# ===========================================
# PAYMENTS (Stripe)
# ===========================================
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
STRIPE_PRO_PRICE_ID=price_your-pro-plan-price-id
STRIPE_API_PRICE_ID=price_your-api-plan-price-id

# ===========================================
# EMAIL (Resend)
# ===========================================
RESEND_API_KEY=re_your-resend-api-key
EMAIL_FROM=noreply@yourdomain.com

# ===========================================
# CACHING (seconds)
# ===========================================
CACHE_TTL_CRYPTO_LIST=120
CACHE_TTL_MARKET_SUMMARY=30
CACHE_TTL_CRYPTO_DETAILS=60
```

Save the file (Ctrl+X, Y, Enter).

### Secure the Environment File
```bash
chmod 600 /home/ubuntu/.env.backend
```

## Step 4: AWS CodeDeploy Configuration

### Create CodeDeploy Application
1. Go to AWS CodeDeploy console
2. Click "Create application"
3. Application name: `TradeGuardAI`
4. Compute platform: `EC2/On-premises`

### Create Deployment Group
1. Click "Create deployment group"
2. Deployment group name: `TradeGuardAI-Production`
3. Service role: Select role with CodeDeploy permissions
4. Deployment type: `In-place`
5. Environment configuration: `Amazon EC2 instances`
6. Tag group: Add tags matching your EC2 instance (e.g., Name: TradeGuard-Mumbai)
7. Deployment settings: `CodeDeployDefault.AllAtOnce`
8. Load balancer: Disable (unless you have one)

### GitHub Integration (Recommended)
1. In CodeDeploy, go to your application
2. Click "Create deployment"
3. Deployment group: Select your group
4. Revision type: `My application is stored in GitHub`
5. Connect to GitHub and authorize
6. Repository: `anshaalahmad/TradeGuardAI`
7. Commit ID: Use latest commit hash or branch name

### Alternative: S3 Integration
1. Push code to S3 bucket:
   ```bash
   aws deploy push \
     --application-name TradeGuardAI \
     --s3-location s3://your-bucket/TradeGuardAI.zip \
     --source .
   ```

2. Create deployment:
   ```bash
   aws deploy create-deployment \
     --application-name TradeGuardAI \
     --deployment-group-name TradeGuardAI-Production \
     --s3-location bucket=your-bucket,key=TradeGuardAI.zip,bundleType=zip
   ```

## Step 5: Deploy Application

### Trigger Deployment
From AWS CodeDeploy console:
1. Go to your application
2. Click "Create deployment"
3. Select deployment group
4. Choose revision source (GitHub or S3)
5. Click "Create deployment"

### Monitor Deployment
- Watch the deployment progress in the CodeDeploy console
- Check deployment events and logs
- If deployment fails, check logs on the EC2 instance:
  ```bash
  sudo tail -100 /var/log/aws/codedeploy-agent/codedeploy-agent.log
  ```

## Step 6: SSL Certificate Setup

After successful deployment, secure your site with HTTPS:

```bash
cd /var/www/tradeguard/scripts
sudo ./setup_ssl.sh yourdomain.com
```

This will:
- Install Certbot
- Obtain SSL certificate from Let's Encrypt
- Configure Nginx for HTTPS
- Set up automatic certificate renewal

**Note**: Ensure your domain DNS is pointing to your EC2 instance's public IP before running this command.

## Step 7: Verify Deployment

### Check Application Status
```bash
# Check PM2 status
pm2 status

# View backend logs
pm2 logs tradeguard-api --lines 50

# Check Nginx status
sudo systemctl status nginx

# Test backend health
curl http://localhost:5000/api/health/ping
```

### Access Your Application
- Frontend: `https://yourdomain.com`
- Backend API: `https://yourdomain.com/api/health`

## Deployment Scripts

The deployment uses the following scripts (located in `scripts/` directory):

1. **before_install.sh**: Cleans up old deployment files (including hidden files)
2. **after_install.sh**: Installs dependencies, generates Prisma client, copies env file
3. **application_start.sh**: Starts backend with PM2, configures Nginx
4. **application_stop.sh**: Stops running application
5. **validate_deployment.sh**: Verifies application is running correctly

## Troubleshooting

### Deployment Fails with "File already exists"
This is fixed in the updated `before_install.sh` script which properly removes hidden files. If you still encounter this:

```bash
# SSH into server
ssh -i "tradeguard-mumbai-key.pem" ubuntu@your-instance

# Manually clean directory
sudo rm -rf /var/www/tradeguard/* /var/www/tradeguard/.[!.]* /var/www/tradeguard/..?*
sudo chown -R ubuntu:ubuntu /var/www/tradeguard

# Retry deployment
```

### Backend Not Starting
Check PM2 logs:
```bash
pm2 logs tradeguard-api --lines 100
```

Common issues:
- Missing or invalid `.env` file at `/home/ubuntu/.env.backend`
- Database connection issues (check `DATABASE_URL`)
- Port 5000 already in use
- Missing Node.js dependencies

### Database Connection Issues
Verify MongoDB Atlas configuration:
1. Check IP whitelist includes your EC2 instance's public IP or use `0.0.0.0/0` for testing
2. Verify database credentials in `.env.backend`
3. Test connection: `npx prisma db push` from Backend directory

### SSL Certificate Issues
If Let's Encrypt fails:
1. Verify domain DNS points to server IP: `dig yourdomain.com`
2. Ensure ports 80 and 443 are open in security group
3. Check Nginx is running: `sudo systemctl status nginx`
4. View Certbot logs: `sudo cat /var/log/letsencrypt/letsencrypt.log`

### CodeDeploy Agent Not Running
```bash
# Check status
sudo systemctl status codedeploy-agent

# Restart agent
sudo systemctl restart codedeploy-agent

# View logs
sudo tail -100 /var/log/aws/codedeploy-agent/codedeploy-agent.log
```

## Maintenance

### Updating Application
Simply trigger a new deployment from CodeDeploy with the latest code revision.

### SSL Certificate Renewal
Certificates auto-renew. Check renewal status:
```bash
sudo certbot renew --dry-run
```

### View Application Logs
```bash
# PM2 logs
pm2 logs tradeguard-api

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### Restart Application
```bash
pm2 restart tradeguard-api
```

### Restart Nginx
```bash
sudo systemctl restart nginx
```

## Security Best Practices

1. **Keep secrets secure**: Never commit `.env` files to Git
2. **Use HTTPS**: Always run SSL setup after deployment
3. **Regular updates**: Keep system packages updated
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```
4. **Monitor logs**: Regularly check application and system logs
5. **Backup database**: Set up MongoDB Atlas automated backups
6. **Firewall rules**: Restrict SSH access to known IPs
7. **IAM permissions**: Use least-privilege IAM roles

## Rollback Procedure

If deployment causes issues:

1. In CodeDeploy console, go to deployment history
2. Find last successful deployment
3. Click "Redeploy" to rollback

Or manually:
```bash
# Stop current application
pm2 stop tradeguard-api

# Restore from previous deployment
# (CodeDeploy keeps previous revisions)

# Restart application
pm2 restart tradeguard-api
```

## Cost Considerations

### Mumbai Region (ap-south-1) Pricing (approximate)
- **EC2 t2.medium**: ~$0.0464/hour (~$34/month)
- **MongoDB Atlas M0**: Free tier (512MB storage)
- **Data Transfer**: First 1GB free, then $0.09/GB
- **CodeDeploy**: Free for EC2 deployments

**Total estimated cost**: $35-50/month (depending on traffic)

## Support

For issues or questions:
- GitHub Issues: https://github.com/anshaalahmad/TradeGuardAI/issues
- Documentation: Check README.md for API documentation

## Legal Compliance

This deployment uses the Mumbai (ap-south-1) region to comply with Binance API usage restrictions. Ensure your application complies with:
- Indian data protection laws
- Cryptocurrency trading regulations in your jurisdiction
- API terms of service for all third-party services used
