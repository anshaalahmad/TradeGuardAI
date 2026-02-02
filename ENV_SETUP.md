# Environment Setup Quick Reference

This document provides a quick reference for setting up environment variables for TradeGuardAI.

## Development Setup

### Backend (.env)
Create `Backend/.env` from `Backend/.env.example`:
```bash
cp Backend/.env.example Backend/.env
```
Then update with your development credentials.

### Frontend (.env)
Create `Frontend/.env` from `Frontend/.env.example`:
```bash
cp Frontend/.env.example Frontend/.env
```

## Production Setup (AWS EC2)

### Server Location
Store production environment file at:
```
/home/ubuntu/.env.backend
```

### Required Environment Variables

#### Critical (Application won't start without these)
- `DATABASE_URL` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token signing
- `JWT_REFRESH_SECRET` - Secret key for refresh tokens
- `FRONTEND_URL` - Your production domain URL

#### Important (Features won't work without these)
- `GOOGLE_CLIENT_ID` - For Google OAuth login
- `GOOGLE_CLIENT_SECRET` - For Google OAuth login
- `STRIPE_SECRET_KEY` - For payment processing
- `STRIPE_WEBHOOK_SECRET` - For Stripe webhooks
- `RESEND_API_KEY` - For email notifications

#### Optional (Enhances functionality)
- `COINGECKO_API_KEY` - Better rate limits for CoinGecko API
- `STRIPE_PRO_PRICE_ID` - Pro subscription plan
- `STRIPE_API_PRICE_ID` - API subscription plan

## Generating Secure Secrets

### JWT Secrets
Generate random 32+ character strings:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### MongoDB Atlas Setup
1. Create account at https://www.mongodb.com/atlas
2. Create a free M0 cluster
3. Add IP whitelist (use 0.0.0.0/0 for testing)
4. Create database user
5. Get connection string from "Connect" button
6. Format: `mongodb+srv://username:password@cluster.mongodb.net/tradeguardai?retryWrites=true&w=majority`

### Google OAuth Setup
1. Go to https://console.cloud.google.com/
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - Development: `http://localhost:5000/api/auth/google/callback`
   - Production: `https://yourdomain.com/api/auth/google/callback`
6. Copy Client ID and Client Secret

### Stripe Setup
1. Create account at https://stripe.com/
2. Get API keys from Dashboard > Developers > API keys
3. Use test keys for development (`sk_test_...`)
4. Use live keys for production (`sk_live_...`)
5. Set up webhook endpoint for `/api/subscription/webhook`
6. Copy webhook signing secret

### Resend Email Setup
1. Create account at https://resend.com/
2. Get API key from dashboard
3. Verify your domain (or use test domain)

## Security Checklist

- [ ] All secrets are unique and randomly generated
- [ ] JWT secrets are at least 32 characters long
- [ ] Production uses different secrets than development
- [ ] `.env` files are not committed to Git (check `.gitignore`)
- [ ] Environment files on server have restricted permissions (600)
- [ ] MongoDB IP whitelist is properly configured
- [ ] Google OAuth redirect URIs match your domains
- [ ] Stripe webhook is secured with webhook secret
- [ ] All API keys are from production accounts (not test/dev)

## Troubleshooting

### "Cannot connect to database"
- Check `DATABASE_URL` format
- Verify MongoDB Atlas IP whitelist
- Test connection: `npx prisma db push` from Backend directory

### "JWT secret not configured"
- Ensure `JWT_SECRET` and `JWT_REFRESH_SECRET` are set
- Secrets must be at least 32 characters

### "Google OAuth not working"
- Verify redirect URI matches exactly
- Check Client ID and Secret are correct
- Ensure Google+ API is enabled in Google Cloud Console

### "Stripe payments failing"
- Check you're using correct keys (test vs live)
- Verify webhook endpoint is accessible
- Check webhook secret matches Stripe dashboard

## Environment Variables Reference

See `Backend/.env.example` for complete list with descriptions.

### Quick Copy Template (Development)

**Note**: The command substitutions below (`$(...)`) need to be executed first to generate actual values. Run each command separately:

```bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate JWT_REFRESH_SECRET  
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then create your `.env` file with the generated values:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
DATABASE_URL="mongodb+srv://user:pass@cluster.mongodb.net/tradeguardai?retryWrites=true&w=majority"
JWT_SECRET=your-generated-secret-here
JWT_REFRESH_SECRET=your-generated-refresh-secret-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### Production Differences
- `NODE_ENV=production`
- `FRONTEND_URL=https://yourdomain.com`
- Use production API keys for Stripe, Resend, etc.
- Different database (production MongoDB cluster)
- Unique JWT secrets (never reuse from development)
