
const express = require('express');
const router = express.Router();
const binanceService = require('../services/binanceService');
const coingeckoService = require('../services/coingeckoService');
const cache = require('../utils/cache');

/**
 * @route   GET /api/crypto/binance-symbols
 * @desc    Get list of Binance USDT trading pairs (for frontend symbol support check)
 * @access  Public
 */
router.get('/binance-symbols', async (req, res, next) => {
  try {
    const cacheKey = 'binance_symbols';
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ symbols: cached, cached: true });
    }
    const info = await binanceService.getExchangeInfo();
    const symbols = info.symbols || [];
    cache.set(cacheKey, symbols, 300); // cache for 5 min
    res.json({ symbols, cached: false });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/crypto/list
 * @desc    Get list of top cryptocurrencies
 * @access  Public
 * @query   page (default: 1), limit (default: 100)
 */
router.get('/list', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 100, 250);
    
    const cacheKey = `crypto_list_${page}_${limit}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      return res.json({ ...cached, cached: true });
    }
    
    const data = await coingeckoService.getTopCryptos(page, limit);
    
    cache.set(cacheKey, data, process.env.CACHE_TTL_CRYPTO_LIST || 120);
    
    res.json({ ...data, cached: false });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/crypto/trending
 * @desc    Get trending cryptocurrencies
 * @access  Public
 */
router.get('/trending', async (req, res, next) => {
  try {
    const cacheKey = 'crypto_trending';
    const cached = cache.get(cacheKey);
    
    if (cached) {
      return res.json({ ...cached, cached: true });
    }
    
    const data = await coingeckoService.getTrending();
    
    cache.set(cacheKey, data, 300); // Cache for 5 minutes
    
    res.json({ ...data, cached: false });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/crypto/logo/:symbol
 * @desc    Proxy for cryptocurrency logos (hides API key)
 * @access  Public
 */
router.get('/logo/:symbol', async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const upperSymbol = symbol.toUpperCase();
    
    const cacheKey = `logo_${upperSymbol}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      return res.redirect(cached);
    }
    
    const logoUrl = await coingeckoService.getCryptoLogo(upperSymbol);
    
    if (logoUrl) {
      cache.set(cacheKey, logoUrl, 86400); // Cache for 24 hours
      return res.redirect(logoUrl);
    }
    
    // Fallback to placeholder
    res.redirect(`https://ui-avatars.com/api/?name=${upperSymbol}&background=random&size=64`);
  } catch (error) {
    // Return placeholder on error
    res.redirect(`https://ui-avatars.com/api/?name=${req.params.symbol}&background=random&size=64`);
  }
});

/**
 * @route   GET /api/crypto/:symbol
 * @desc    Get details for a specific cryptocurrency
 * @access  Public
 */
router.get('/:symbol', async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const upperSymbol = symbol.toUpperCase();
    
    const cacheKey = `crypto_${upperSymbol}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      return res.json({ ...cached, cached: true });
    }
    
    // Get data from both Binance and CoinGecko
    const [binanceData, geckoData] = await Promise.allSettled([
      binanceService.getSymbolPrice(`${upperSymbol}USDT`),
      coingeckoService.getCryptoDetails(upperSymbol)
    ]);
    
    // Flatten CoinGecko details for frontend compatibility
    let details = geckoData.status === 'fulfilled' ? geckoData.value : {};
    let market = details.marketData || {};
    let links = details.links || {};
    // Calculate 7d range if possible
    let high7d = null, low7d = null;
    if (Array.isArray(market.high7d) && market.high7d.length) high7d = Math.max(...market.high7d);
    if (Array.isArray(market.low7d) && market.low7d.length) low7d = Math.min(...market.low7d);
    // fallback: use high24h/low24h if 7d not available
    high7d = high7d || market.high24h;
    low7d = low7d || market.low24h;
    // Use new maxSupply and fullyDilutedValuation fields from CoinGecko marketData
    const data = {
      symbol: upperSymbol,
      name: details.name,
      image: details.image,
      description: details.description,
      marketCap: market.marketCap,
      fullyDilutedValuation: market.fullyDilutedValuation,
      volume24h: market.volume24h,
      circulatingSupply: market.circulatingSupply,
      totalSupply: market.totalSupply,
      maxSupply: market.maxSupply,
      currentPrice: market.currentPrice,
      high24h: market.high24h,
      low24h: market.low24h,
      high7d,
      low7d,
      ath: market.ath,
      athDate: market.athDate,
      athChangePercentage: market.athChangePercentage,
      atl: market.atl,
      atlDate: market.atlDate,
      atlChangePercentage: market.atlChangePercentage,
      priceChangePercent24h: market.priceChangePercent24h,
      priceChangePercent7d: market.priceChangePercent7d,
      priceChangePercent30d: market.priceChangePercent30d,
      marketCapRank: market.marketCapRank,
      links: {
        homepage: links.homepage ? [links.homepage] : [],
        whitepaper: links.whitepaper || '',
        twitter: links.twitter || '',
        facebook: links.facebook || '',
        reddit: links.reddit || '',
        telegram: links.telegram || ''
      },
      timestamp: new Date().toISOString()
    };
    cache.set(cacheKey, data, process.env.CACHE_TTL_CRYPTO_DETAILS || 60);
    res.json({ ...data, cached: false });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/crypto/:symbol/history
 * @desc    Get price history for a cryptocurrency
 * @access  Public
 * @query   interval (default: 1h), limit (default: 100)
 */
router.get('/:symbol/history', async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const interval = req.query.interval || '1h';
    const limit = Math.min(parseInt(req.query.limit) || 100, 1000);
    
    const upperSymbol = symbol.toUpperCase();
    const cacheKey = `history_${upperSymbol}_${interval}_${limit}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      return res.json({ ...cached, cached: true });
    }
    
    const data = await binanceService.getKlines(`${upperSymbol}USDT`, interval, limit);
    
    // Cache based on interval (shorter intervals = shorter cache)
    const cacheTTL = interval.includes('m') ? 30 : 120;
    cache.set(cacheKey, data, cacheTTL);
    
    res.json({ ...data, cached: false });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
