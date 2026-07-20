<p align="center">
  <img src="https://img.shields.io/badge/TradeGuard-AI-1e65fa?style=for-the-badge&logoColor=white" alt="TradeGuard AI" />
</p>

<h1 align="center">TradeGuard AI</h1>

<p align="center">
  <strong>Professional Cryptocurrency Trading Intelligence Platform</strong>
</p>

<p align="center">
  Real-time market data • Chart pattern analysis • AI-powered predictions • Learning resources
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-7.2-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-4.21-000000?style=flat-square&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Prisma-5.22-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Tailwind-4.1-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Stripe-Payments-635BFF?style=flat-square&logo=stripe&logoColor=white" alt="Stripe" />
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-environment-setup">Environment</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-api-documentation">API Docs</a> •
  <a href="#-deployment">Deployment</a> •
  <a href="#-contributing">Contributing</a>
</p>

---

## ✨ Features

### 📊 Real-Time Market Data
- Live cryptocurrency prices from Binance API
- Market summary with Fear & Greed Index
- Interactive candlestick charts with TradingView-style UI
- Order book visualization

### 🤖 AI-Powered Predictions
- Machine learning price predictions
- Confidence scoring
- Historical accuracy tracking

### 📚 Learning Platform
- Educational articles and guides
- Trading strategy tutorials
- Bookmark favorite resources
- Track reading progress

### 👤 User Management
- Secure authentication (Email/Password + Google OAuth)
- User profiles and preferences
- Watchlist management

### 💳 Subscription Tiers
- **Free**: Basic market data access
- **Pro**: Advanced features + AI predictions

### 🛡️ Admin Dashboard
- User management
- Content management (Articles, Patterns)
- System analytics
- Resource moderation

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/TradeGuardAI.git
cd TradeGuardAI

# Install dependencies for both frontend and backend
cd Backend && npm install && cd ..
cd Frontend && npm install && cd ..

# Set up environment variables (see Environment Setup section)
cp Backend/.env.example Backend/.env
cp Frontend/.env.example Frontend/.env

# Start the development servers
# Terminal 1 - Backend
cd Backend && npm run dev

# Terminal 2 - Frontend
cd Frontend && npm run dev
```

**Frontend**: http://localhost:5173  
**Backend API**: http://localhost:5000

---

## 📦 Installation

### Prerequisites

| Requirement | Version | Description |
|-------------|---------|-------------|
| Node.js | 18.x+ | JavaScript runtime |
| npm | 9.x+ | Package manager |
| MongoDB | Atlas | Database (free tier available) |
| Git | Latest | Version control |

### Step-by-Step Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/TradeGuardAI.git
cd TradeGuardAI
```

#### 2. Backend Setup

```bash
cd Backend

# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Push schema to database (after configuring DATABASE_URL)
npm run db:push

# Start development server
npm run dev
```

#### 3. Frontend Setup

```bash
cd Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

#### 4. Production Build

```bash
# Frontend build
cd Frontend
npm run build

# Backend runs with
cd Backend
npm start
```

---

## ⚙️ Environment Setup

### Backend Environment Variables

Create a `.env` file in the `Backend/` directory:

```env
# ===========================================
# SERVER CONFIGURATION
# ===========================================
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# ===========================================
# DATABASE
# ===========================================
DATABASE_URL="mongodb+srv://<username>:<password>@cluster.mongodb.net/tradeguardai?retryWrites=true&w=majority"

# ===========================================
# AUTHENTICATION
# ===========================================
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-token-secret-min-32-chars
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
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
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

### Frontend Environment Variables

Create a `.env` file in the `Frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=TradeGuard AI
```

---

## 📁 Project Structure

```
TradeGuardAI/
├── 📂 Backend/                    # Express.js API Server
│   ├── 📂 prisma/
│   │   └── schema.prisma          # Database schema
│   ├── 📂 src/
│   │   ├── 📂 config/
│   │   │   └── passport.js        # Authentication strategies
│   │   ├── 📂 controllers/
│   │   │   └── authController.js  # Auth request handlers
│   │   ├── 📂 middleware/
│   │   │   ├── authMiddleware.js  # JWT verification
│   │   │   └── adminMiddleware.mjs # Admin role check
│   │   ├── 📂 routes/
│   │   │   ├── auth.js            # Authentication routes
│   │   │   ├── crypto.js          # Cryptocurrency data
│   │   │   ├── market.js          # Market summary
│   │   │   ├── subscription.js    # Stripe payments
│   │   │   ├── admin.mjs          # Admin operations
│   │   │   └── resources.mjs      # Articles & patterns
│   │   ├── 📂 services/
│   │   │   ├── binanceService.js  # Binance API integration
│   │   │   ├── coingeckoService.js# CoinGecko API
│   │   │   ├── stripeService.js   # Payment processing
│   │   │   └── emailService.js    # Email notifications
│   │   ├── 📂 utils/
│   │   │   ├── auth.js            # JWT helpers
│   │   │   └── cache.js           # In-memory caching
│   │   └── server.js              # Application entry point
│   ├── package.json
│   └── .env
│
├── 📂 Frontend/                   # React + Vite Application
│   ├── 📂 public/                 # Static assets
│   ├── 📂 src/
│   │   ├── 📂 Components/
│   │   │   ├── 📂 Admin/          # Admin dashboard components
│   │   │   ├── 📂 Auth/           # Login, signup forms
│   │   │   ├── 📂 Chart/          # TradingView-style charts
│   │   │   ├── 📂 Dashboard Pages/# Dashboard widgets
│   │   │   ├── 📂 Landing/        # Homepage components
│   │   │   └── 📂 MarketSummary/  # Market data display
│   │   ├── 📂 contexts/
│   │   │   └── AuthContext.jsx    # Authentication state
│   │   ├── 📂 pages/
│   │   │   ├── DashboardApp.jsx   # Main dashboard
│   │   │   ├── LoginPage.jsx      # User login
│   │   │   ├── SignUpPage.jsx     # User registration
│   │   │   ├── PricingPage.jsx    # Subscription plans
│   │   │   ├── ChartPatternsPage.jsx
│   │   │   ├── LearningPlatformPage.jsx
│   │   │   ├── PredictionsPage.jsx
│   │   │   └── 📂 admin/          # Admin pages
│   │   ├── 📂 services/
│   │   │   ├── api.js             # API client
│   │   │   ├── authApi.js         # Auth API calls
│   │   │   └── subscriptionApi.js # Stripe API calls
│   │   ├── 📂 css/
│   │   │   ├── normalize.css      # CSS reset
│   │   │   ├── webflow.css        # Base framework
│   │   │   └── tradeguard-ai.webflow.css
│   │   ├── App.jsx                # Root component
│   │   ├── main.jsx               # Application entry
│   │   └── index.css              # Global styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── CSS_DESIGN_SYSTEM.md           # Design system documentation
```

---

## 📡 API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production:  https://api.tradeguardai.com/api
```

### Authentication

All protected routes require a Bearer token:

```bash
Authorization: Bearer <access_token>
```

### Endpoints Overview

#### 🔐 Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Create new account |
| `POST` | `/auth/login` | Login with email/password |
| `POST` | `/auth/logout` | Logout (revoke tokens) |
| `POST` | `/auth/refresh` | Refresh access token |
| `GET` | `/auth/google` | Initiate Google OAuth |
| `GET` | `/auth/google/callback` | Google OAuth callback |
| `GET` | `/auth/me` | Get current user profile |
| `PUT` | `/auth/profile` | Update user profile |
| `POST` | `/auth/forgot-password` | Request password reset |
| `POST` | `/auth/reset-password` | Reset password |

#### 📊 Cryptocurrency Data

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/crypto/list` | List cryptocurrencies (paginated) |
| `GET` | `/crypto/trending` | Trending cryptocurrencies |
| `GET` | `/crypto/:symbol` | Get crypto details |
| `GET` | `/crypto/:symbol/history` | Price history (OHLCV) |
| `GET` | `/crypto/logo/:symbol` | Cryptocurrency logo |

#### 📈 Market Data

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/market/summary` | Market overview + Fear & Greed |
| `GET` | `/market/fear-greed` | Fear & Greed Index |
| `GET` | `/market/tickers` | Multiple ticker prices |

#### 💳 Subscriptions

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/subscription/status` | Current subscription status |
| `POST` | `/subscription/create-checkout` | Create Stripe checkout |
| `POST` | `/subscription/create-portal` | Stripe customer portal |
| `POST` | `/subscription/webhook` | Stripe webhook handler |

#### 📚 Resources (Articles & Patterns)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/resources/articles` | List articles |
| `GET` | `/resources/articles/:slug` | Get article by slug |
| `GET` | `/resources/patterns` | List chart patterns |
| `GET` | `/resources/patterns/:slug` | Get pattern by slug |
| `GET` | `/resources/bookmarks` | User's bookmarks |
| `POST` | `/resources/bookmarks` | Add bookmark |
| `DELETE` | `/resources/bookmarks/:id` | Remove bookmark |

#### 🛡️ Admin (Requires Admin Role)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/admin/users` | List all users |
| `GET` | `/admin/stats` | Dashboard statistics |
| `POST` | `/admin/articles` | Create article |
| `PUT` | `/admin/articles/:id` | Update article |
| `DELETE` | `/admin/articles/:id` | Delete article |
| `POST` | `/admin/patterns` | Create pattern |
| `PUT` | `/admin/patterns/:id` | Update pattern |
| `DELETE` | `/admin/patterns/:id` | Delete pattern |

### Example Requests

#### Get Market Summary
```bash
curl -X GET http://localhost:5000/api/market/summary
```

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "yourpassword"}'
```

#### Get Crypto History
```bash
curl -X GET "http://localhost:5000/api/crypto/BTC/history?interval=1h&limit=100"
```

---

## 🛠️ Available Scripts

### Backend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot-reload |
| `npm start` | Start production server |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run database migrations |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Prisma Studio GUI |

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 🔧 Tech Stack

### Frontend
- **React 19** - UI library with latest features
- **Vite 7** - Next-generation build tool
- **React Router 7** - Client-side routing
- **Tailwind CSS 4** - Utility-first CSS framework
- **Lightweight Charts** - TradingView charting library
- **TipTap** - Rich text editor for admin

### Backend
- **Node.js 18+** - JavaScript runtime
- **Express.js 4** - Web framework
- **Prisma 5** - Next-generation ORM
- **MongoDB Atlas** - Cloud database
- **Passport.js** - Authentication middleware
- **JWT** - Stateless authentication
- **Stripe** - Payment processing
- **Resend** - Transactional emails

### DevOps & Tools
- **ESLint** - Code linting
- **Nodemon** - Development hot-reload
- **Helmet** - Security headers
- **CORS** - Cross-origin configuration
- **Morgan** - HTTP request logging

---

## 🚀 Deployment

### Production Deployment with AWS

TradeGuardAI supports automated deployment to AWS EC2 using CodeDeploy, specifically configured for the Mumbai (ap-south-1) region to ensure Binance API compatibility.

#### Quick Deployment Guide

1. **Launch EC2 Instance** (Ubuntu 22.04) in Mumbai region
2. **Install dependencies** on the server:
   ```bash
   wget https://raw.githubusercontent.com/anshaalahmad/TradeGuardAI/main/scripts/install_dependencies.sh
   chmod +x install_dependencies.sh
   sudo ./install_dependencies.sh
   ```
3. **Configure environment** variables at `/home/ubuntu/.env.backend`
4. **Set up CodeDeploy** application and deployment group
5. **Deploy** via AWS CodeDeploy console or CLI
6. **Secure with SSL**:
   ```bash
   sudo /var/www/tradeguard/scripts/setup_ssl.sh yourdomain.com
   ```

#### Deployment Features
- ✅ Automated deployment with AWS CodeDeploy
- ✅ Zero-downtime updates with PM2
- ✅ Nginx reverse proxy configuration
- ✅ Automatic SSL/HTTPS setup with Let's Encrypt
- ✅ Health checks and deployment validation
- ✅ Production-ready security configuration

📖 **[Full Deployment Guide](DEPLOYMENT.md)** - Complete step-by-step instructions for AWS deployment

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
   
   Follow [Conventional Commits](https://www.conventionalcommits.org/) specification:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation
   - `style:` - Formatting
   - `refactor:` - Code refactoring
   - `test:` - Adding tests
   - `chore:` - Maintenance

4. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open a Pull Request**

### Code Style

- Use ESLint configuration provided
- Follow existing code patterns
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation as needed

---

## 📄 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Binance API](https://binance-docs.github.io/apidocs/) - Real-time market data
- [CoinGecko API](https://www.coingecko.com/en/api) - Cryptocurrency information
- [TradingView](https://www.tradingview.com/) - Charting inspiration
- [Stripe](https://stripe.com/) - Payment infrastructure
- [MongoDB Atlas](https://www.mongodb.com/atlas) - Cloud database

---

<p align="center">
  <strong>Built with ❤️ for traders worldwide</strong>
</p>

<p align="center">
  <a href="https://github.com/yourusername/TradeGuardAI/issues">Report Bug</a> •
  <a href="https://github.com/yourusername/TradeGuardAI/issues">Request Feature</a>
</p>
