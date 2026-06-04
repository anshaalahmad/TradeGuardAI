const axios = require('axios');
const crypto = require('crypto');
const NodeCache = require('node-cache');

// Price cache — 60 second TTL
const priceCache = new NodeCache({ stdTTL: 60 });

// Common symbol-to-CoinGecko ID mapping
const SYMBOL_TO_COINGECKO = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  BNB: 'binancecoin',
  USDT: 'tether',
  USDC: 'usd-coin',
  SOL: 'solana',
  XRP: 'ripple',
  ADA: 'cardano',
  DOGE: 'dogecoin',
  DOT: 'polkadot',
  MATIC: 'matic-network',
  SHIB: 'shiba-inu',
  AVAX: 'avalanche-2',
  LINK: 'chainlink',
  UNI: 'uniswap',
  LTC: 'litecoin',
  ATOM: 'cosmos',
  FIL: 'filecoin',
  APT: 'aptos',
  ARB: 'arbitrum',
  OP: 'optimism',
  NEAR: 'near',
  TRX: 'tron',
  PEPE: 'pepe',
  FDUSD: 'first-digital-usd',
  BUSD: 'binance-usd',
  DAI: 'dai',
  ICP: 'internet-computer',
  ETC: 'ethereum-classic',
  FTM: 'fantom',
  MANA: 'decentraland',
  SAND: 'the-sandbox',
  AAVE: 'aave',
  CRV: 'curve-dao-token',
  ALGO: 'algorand',
  XLM: 'stellar',
  VET: 'vechain',
  HBAR: 'hedera-hashgraph',
  SUI: 'sui',
  SEI: 'sei-network',
  INJ: 'injective-protocol',
  TIA: 'celestia',
  JUP: 'jupiter-exchange-solana',
  WIF: 'dogwifcoin',
  BONK: 'bonk',
  RENDER: 'render-token',
  FET: 'fetch-ai',
  THETA: 'theta-token',
  GRT: 'the-graph',
  FLOKI: 'floki',
  WLD: 'worldcoin-wld',
  PENDLE: 'pendle',
  ENS: 'ethereum-name-service',
  STX: 'stacks',
  IMX: 'immutable-x',
  MKR: 'maker',
  SNX: 'havven',
  COMP: 'compound-governance-token',
  LDO: 'lido-dao',
  RPL: 'rocket-pool',
  RUNE: 'thorchain',
  CAKE: 'pancakeswap-token',
  '1INCH': '1inch',
  EGLD: 'elrond-erd-2',
  FLOW: 'flow',
  KAVA: 'kava',
  ZEC: 'zcash',
  NEO: 'neo',
  IOTA: 'iota',
  MINA: 'mina-protocol',
  ROSE: 'oasis-network',
  ONE: 'harmony',
  CFX: 'conflux-token',
  GALA: 'gala',
};

/**
 * Fetch spot balances from Binance using API key + secret
 * Uses Binance server time to avoid clock sync issues
 * @param {string} apiKey - Binance API key (plaintext, already decrypted)
 * @param {string} apiSecret - Binance API secret (plaintext, already decrypted)
 * @returns {Array} Non-zero balances: [{ asset, free, locked, total }]
 */
const getBinanceBalances = async (apiKey, apiSecret) => {
  const baseUrl = 'https://api.binance.com';

  // Step 1: Fetch Binance server time to avoid clock drift errors
  let serverTime;
  try {
    const timeRes = await axios.get(`${baseUrl}/api/v3/time`, { timeout: 5000 });
    serverTime = timeRes.data.serverTime;
  } catch (err) {
    // Fallback to local time if server time fetch fails
    console.warn('Could not fetch Binance server time, using local time');
    serverTime = Date.now();
  }

  // Step 2: Build signed request with server timestamp + recvWindow for tolerance
  const endpoint = '/api/v3/account';
  const queryString = `timestamp=${serverTime}&recvWindow=10000`;

  const signature = crypto
    .createHmac('sha256', apiSecret)
    .update(queryString)
    .digest('hex');

  try {
    const response = await axios.get(
      `${baseUrl}${endpoint}?${queryString}&signature=${signature}`,
      {
        headers: {
          'X-MBX-APIKEY': apiKey,
        },
        timeout: 10000,
      }
    );

    // Filter to non-zero balances
    const balances = response.data.balances
      .filter((b) => {
        const free = parseFloat(b.free);
        const locked = parseFloat(b.locked);
        return free > 0 || locked > 0;
      })
      .map((b) => ({
        asset: b.asset,
        free: parseFloat(b.free),
        locked: parseFloat(b.locked),
        total: parseFloat(b.free) + parseFloat(b.locked),
      }));

    return balances;
  } catch (error) {
    if (error.response) {
      const msg = error.response.data?.msg || error.response.data?.message || 'Unknown Binance API error';
      const code = error.response.data?.code;
      console.error(`Binance API error (code ${code}): ${msg}`);
      throw new Error(`Binance API error: ${msg}`);
    }
    throw new Error('Failed to connect to Binance API');
  }
};

/**
 * Fetch native balance for an on-chain EVM wallet using public RPC
 * @param {string} address - Wallet address (0x...)
 * @param {string} network - "ethereum" or "bsc"
 * @returns {Array}
 */
const getOnChainBalance = async (address, network = 'ethereum') => {
  const rpcUrls = {
    ethereum: 'https://ethereum-rpc.publicnode.com',
    bsc: 'https://bsc-dataseed.binance.org',
  };

  const rpcUrl = rpcUrls[network];
  if (!rpcUrl) {
    throw new Error(`Unsupported network: ${network}`);
  }

  try {
    const response = await axios.post(
      rpcUrl,
      {
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [address, 'latest'],
        id: 1,
      },
      { timeout: 10000 }
    );

    if (response.data.error) {
      throw new Error(`RPC Error: ${response.data.error.message}`);
    }

    if (response.data.result === undefined) {
      throw new Error('Invalid RPC response: missing result field');
    }

    const balanceWei = BigInt(response.data.result);
    const balanceEth = Number(balanceWei) / 1e18;

    const asset = network === 'bsc' ? 'BNB' : 'ETH';

    if (balanceEth > 0) {
      return [
        {
          asset,
          free: balanceEth,
          locked: 0,
          total: balanceEth,
        },
      ];
    }

    return [];
  } catch (error) {
    console.error(`On-chain balance error (${network}):`, error.message);
    throw new Error(`Failed to fetch on-chain balance for ${network}`);
  }
};

/**
 * Fetch USD prices from CoinGecko for a list of asset symbols
 * @param {string[]} symbols - e.g., ["BTC", "ETH", "BNB"]
 * @returns {Object} Map of symbol → { usd, usd_24h_change }
 */
const getPricesForSymbols = async (symbols) => {
  if (!symbols || symbols.length === 0) return {};

  // Check cache first
  const cacheKey = 'prices_' + symbols.sort().join(',');
  const cached = priceCache.get(cacheKey);
  if (cached) return cached;

  // Map symbols to CoinGecko IDs
  const ids = [];
  const idToSymbol = {};
  for (const sym of symbols) {
    const upperSym = sym.toUpperCase();
    const geckoId = SYMBOL_TO_COINGECKO[upperSym];
    if (geckoId) {
      ids.push(geckoId);
      idToSymbol[geckoId] = upperSym;
    }
  }

  if (ids.length === 0) return {};

  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price`,
      {
        params: {
          ids: ids.join(','),
          vs_currencies: 'usd',
          include_24hr_change: 'true',
        },
        timeout: 10000,
      }
    );

    const result = {};
    for (const [geckoId, data] of Object.entries(response.data)) {
      const symbol = idToSymbol[geckoId];
      if (symbol) {
        result[symbol] = {
          usd: data.usd || 0,
          usd_24h_change: data.usd_24h_change || 0,
        };
      }
    }

    // For stablecoins not in CoinGecko or not resolved, hard-code ~$1
    const stablecoins = ['USDT', 'USDC', 'FDUSD', 'BUSD', 'DAI', 'TUSD', 'UST'];
    for (const sym of symbols) {
      const upperSym = sym.toUpperCase();
      if (!result[upperSym] && stablecoins.includes(upperSym)) {
        result[upperSym] = { usd: 1.0, usd_24h_change: 0 };
      }
    }

    priceCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error('CoinGecko price fetch error:', error.message);
    // Return empty prices rather than crashing
    return {};
  }
};

/**
 * Build a full portfolio for a wallet — balances + prices
 * @param {Object} wallet - The wallet DB record (decrypted apiKey/apiSecret)
 * @returns {Object} { holdings: [...], totalValueUsd }
 */
const getWalletPortfolio = async (wallet, decryptedKey, decryptedSecret) => {
  let balances = [];

  if (wallet.walletType === 'BINANCE' && decryptedKey && decryptedSecret) {
    balances = await getBinanceBalances(decryptedKey, decryptedSecret);
  } else if (wallet.address && ['METAMASK', 'TRUST_WALLET', 'COINBASE', 'LEDGER'].includes(wallet.walletType)) {
    const network = wallet.network || 'ethereum';
    balances = await getOnChainBalance(wallet.address, network);
  }

  if (balances.length === 0) {
    return { holdings: [], totalValueUsd: 0 };
  }

  // Fetch USD prices
  const symbols = balances.map((b) => b.asset);
  const prices = await getPricesForSymbols(symbols);

  // Combine balances + prices
  const holdings = balances.map((b) => {
    const price = prices[b.asset] || { usd: 0, usd_24h_change: 0 };
    return {
      asset: b.asset,
      free: b.free,
      locked: b.locked,
      total: b.total,
      priceUsd: price.usd,
      valueUsd: b.total * price.usd,
      change24h: price.usd_24h_change,
    };
  });

  // Sort by USD value descending
  holdings.sort((a, b) => b.valueUsd - a.valueUsd);

  const totalValueUsd = holdings.reduce((sum, h) => sum + h.valueUsd, 0);

  return { holdings, totalValueUsd };
};

module.exports = {
  getBinanceBalances,
  getOnChainBalance,
  getPricesForSymbols,
  getWalletPortfolio,
};
