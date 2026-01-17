require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Import routes
const cryptoRoutes = require('./routes/crypto');
const marketRoutes = require('./routes/market');
const healthRoutes = require('./routes/health');

// CoinGecko Proxy Integration
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: {
    error: 'Too many requests, please try again later.',
    retryAfter: 60
  }
});
app.use('/api/', limiter);

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/crypto', cryptoRoutes);
app.use('/api/market', marketRoutes);

// Proxy /api/coingecko/* to CoinGecko API
app.use(
  '/api/coingecko',
  createProxyMiddleware({
    target: 'https://api.coingecko.com/api/v3',
    changeOrigin: true,
    pathRewrite: { '^/api/coingecko': '' },
    onProxyReq: (proxyReq, req, res) => {
      // Optionally add headers, API keys, etc.
    },
  })
);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'TradeGuardAI API',
    version: '1.0.0',
    status: 'running',
    documentation: '/api/health'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    availableEndpoints: [
      'GET /api/health',
      'GET /api/crypto/list',
      'GET /api/crypto/:symbol',
      'GET /api/crypto/logo/:symbol',
      'GET /api/market/summary',
      'GET /api/market/fear-greed'
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 TradeGuardAI Backend Server`);
  console.log(`http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;
