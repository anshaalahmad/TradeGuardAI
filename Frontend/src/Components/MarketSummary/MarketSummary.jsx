import React, { useState, useEffect } from 'react';
import MarketChange from './MarketChange';
import coinOverrides from './coinOverrides';
import { isBinanceSymbolSupported } from '../../utils/binanceSymbols';

const MarketSummary = ({ symbol = 'BTCUSDT', coinId = 'bitcoin', name = 'Bitcoin', priceChanges = {} }) => {
  const [marketData, setMarketData] = useState({
    marketCap: 0,
    fullyDilutedValuation: null,
    volume24h: 0,
    circulatingSupply: null,
    totalSupply: null,
    maxSupply: null,
    treasury: null,
    currentPrice: 0,
    high24h: 0,
    low24h: 0,
    high7d: 0,
    low7d: 0,
    ath: 0,
    athChangePercentage: 0,
    athDate: '',
    atl: 0,
    atlChangePercentage: 0,
    atlDate: '',
    links: {
      homepage: [],
      whitepaper: '',
      twitter: '',
      facebook: '',
      reddit: '',
      telegram: '',
    }
  });

  const [converter, setConverter] = useState({
    btc: 1,
    usdt: 0
  });

  const [logoUrl, setLogoUrl] = useState(null);

  useEffect(() => {
    // Always use base symbol for CoinGecko lookups (strip 'USDT', 'USD', etc.)
    const baseSymbol = symbol.replace(/(USDT|USD|BUSD|USDC)$/i, '');
    const fetchMarketData = async () => {
      try {
        // Check if symbol is supported on Binance
        const supported = await isBinanceSymbolSupported(symbol);
        console.log('[MarketSummary] Fetching data for:', { symbol, baseSymbol, coinId });
        if (!supported) {
          // Only use CoinGecko data
          // Resolve CoinGecko id if needed
          let resolvedCgId = coinId;
          try {
            const maybeSym = String(coinId || baseSymbol || '').toLowerCase();
            if (coinOverrides[maybeSym]) resolvedCgId = coinOverrides[maybeSym];
          } catch (e) {}
          if (!resolvedCgId || resolvedCgId.length <= 5) {
            try {
              const listRes = await fetch('http://localhost:4001/api/coingecko/coins/list');
              if (listRes.ok) {
                const list = await listRes.json();
                const match = list.find(it => it.symbol.toLowerCase() === String(coinId).toLowerCase() || it.id === coinId || it.symbol.toLowerCase() === baseSymbol.toLowerCase());
                if (match) resolvedCgId = match.id;
              }
            } catch (e) {}
          }
          let cgMarket = null;
          if (resolvedCgId) {
            try {
              const cgRes = await fetch(`http://localhost:4001/api/crypto/${resolvedCgId}`);
              if (cgRes.ok) {
                cgMarket = await cgRes.json();
                console.log('[MarketSummary] API response for', resolvedCgId, cgMarket);
              } else {
                console.error('[MarketSummary] API error for', resolvedCgId, cgRes.status);
              }
            } catch (e) { console.error('[MarketSummary] API fetch error', e); }
          }
          if (!cancelled) {
            console.log('[MarketSummary] Setting marketData for', resolvedCgId, cgMarket);
            setMarketData({
              marketCap: cgMarket?.marketCap ?? cgMarket?.market_data?.market_cap?.usd ?? 0,
              fullyDilutedValuation: cgMarket?.fullyDilutedValuation ?? cgMarket?.market_data?.fully_diluted_valuation?.usd ?? null,
              volume24h: cgMarket?.volume24h ?? cgMarket?.market_data?.total_volume?.usd ?? 0,
              circulatingSupply: cgMarket?.circulatingSupply ?? cgMarket?.market_data?.circulating_supply ?? null,
              totalSupply: cgMarket?.totalSupply ?? cgMarket?.market_data?.total_supply ?? null,
              maxSupply: cgMarket?.maxSupply ?? cgMarket?.market_data?.max_supply ?? null,
              treasury: cgMarket?.treasury ?? cgMarket?.treasury?.total_holdings ?? null,
              currentPrice: cgMarket?.currentPrice ?? cgMarket?.market_data?.current_price?.usd ?? 0,
              high24h: cgMarket?.high24h ?? cgMarket?.market_data?.high_24h?.usd ?? 0,
              low24h: cgMarket?.low24h ?? cgMarket?.market_data?.low_24h?.usd ?? 0,
              high7d: cgMarket?.high7d ?? cgMarket?.market_data?.high_24h?.usd ?? 0,
              low7d: cgMarket?.low7d ?? cgMarket?.market_data?.low_24h?.usd ?? 0,
              ath: cgMarket?.ath ?? cgMarket?.market_data?.ath?.usd ?? 0,
              athChangePercentage: cgMarket?.athChangePercentage ?? cgMarket?.market_data?.ath_change_percentage?.usd ?? 0,
              athDate: cgMarket?.athDate ?? cgMarket?.market_data?.ath_date?.usd ?? '',
              atl: cgMarket?.atl ?? cgMarket?.market_data?.atl?.usd ?? 0,
              atlChangePercentage: cgMarket?.atlChangePercentage ?? cgMarket?.market_data?.atl_change_percentage?.usd ?? 0,
              atlDate: cgMarket?.atlDate ?? cgMarket?.market_data?.atl_date?.usd ?? '',
              links: cgMarket?.links ?? cgMarket?.links ?? {},
            });
          }
          return;
        }
        // Use backend proxy for Binance data
        const binanceResponse = await fetch(`http://localhost:4001/api/crypto/ticker?symbol=${symbol}`);
        const binanceData = await binanceResponse.json();
        const klinesResponse = await fetch(`http://localhost:4001/api/crypto/klines?symbol=${symbol}&interval=1d&limit=7`);
        const klinesData = await klinesResponse.json();
        const high7d = klinesData.klines && klinesData.klines.length ? Math.max(...klinesData.klines.map(k => k.high)) : parseFloat(binanceData.highPrice) || null;
        const low7d = klinesData.klines && klinesData.klines.length ? Math.min(...klinesData.klines.map(k => k.low)) : parseFloat(binanceData.lowPrice) || null;
        const currentPrice = parseFloat(binanceData.lastPrice) || null;
        // CoinGecko fallback for supply, FDV, etc.
        let resolvedCgId = coinId;
        try {
          const maybeSym = String(coinId || symbol || '').toLowerCase();
          if (coinOverrides[maybeSym]) resolvedCgId = coinOverrides[maybeSym];
        } catch (e) {}
        if (!resolvedCgId || resolvedCgId.length <= 5) {
          try {
            const listRes = await fetch('http://localhost:4001/api/coingecko/coins/list');
            if (listRes.ok) {
              const list = await listRes.json();
              const match = list.find(it => it.symbol.toLowerCase() === String(coinId).toLowerCase() || it.id === coinId || it.symbol.toLowerCase() === String(symbol).toLowerCase());
              if (match) resolvedCgId = match.id;
            }
          } catch (e) {}
        }
        let cgMarket = null;
        if (resolvedCgId) {
          try {
            const cgRes = await fetch(`http://localhost:4001/api/crypto/${resolvedCgId}`);
            if (cgRes.ok) cgMarket = await cgRes.json();
          } catch (e) {}
        }
        const safe = (cg, bin, fallback = null) => {
          if (cg !== undefined && cg !== null && !isNaN(cg)) return cg;
          if (bin !== undefined && bin !== null && !isNaN(bin)) return bin;
          return fallback;
        };
        if (!cancelled) {
          console.log('[MarketSummary] Setting marketData (Binance fallback) for', symbol, cgMarket);
          setMarketData({
            marketCap: safe(cgMarket?.marketCap, parseFloat(binanceData.quoteVolume)),
            fullyDilutedValuation: safe(cgMarket?.fullyDilutedValuation, null),
            volume24h: safe(cgMarket?.volume24h, parseFloat(binanceData.quoteVolume)),
            circulatingSupply: safe(cgMarket?.circulatingSupply, null),
            totalSupply: safe(cgMarket?.totalSupply, null),
            maxSupply: safe(cgMarket?.maxSupply, null),
            treasury: safe(cgMarket?.treasury, null),
            currentPrice: safe(cgMarket?.currentPrice, currentPrice),
            high24h: safe(cgMarket?.high24h, parseFloat(binanceData.highPrice)),
            low24h: safe(cgMarket?.low24h, parseFloat(binanceData.lowPrice)),
            high7d: safe(cgMarket?.high7d, high7d),
            low7d: safe(cgMarket?.low7d, low7d),
            ath: safe(cgMarket?.ath, parseFloat(binanceData.highPrice)),
            athChangePercentage: safe(cgMarket?.athChangePercentage, parseFloat(binanceData.priceChangePercent), 0),
            athDate: cgMarket?.athDate || '',
            atl: safe(cgMarket?.atl, parseFloat(binanceData.lowPrice)),
            atlChangePercentage: safe(cgMarket?.atlChangePercentage, parseFloat(binanceData.priceChangePercent), 0),
            atlDate: cgMarket?.atlDate || '',
            links: cgMarket?.links || {},
          });
        }
      } catch (e) {
        setMarketData({});
      }
    };
    let cancelled = false;
    fetchMarketData();
    return () => { cancelled = true; };
  }, [symbol, coinId]);

  // Helper functions
  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '—';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  const formatNumber = (value) => {
    if (value === null || value === undefined) return '—';
    return new Intl.NumberFormat('en-US').format(value);
  };

  const formatPrice = (value) => {
    if (value === null || value === undefined) return '—';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(value);
  };

  const handleConverterChange = (type, value) => {
    const numValue = parseFloat(value) || 0;
    if (type === 'btc') {
      setConverter({ btc: numValue, usdt: numValue * marketData.currentPrice });
    } else {
      setConverter({ btc: numValue / marketData.currentPrice, usdt: numValue });
    }
  };

  const supplySymbol = symbol.replace('USDT', '');

  // Ensure all JSX is inside the return statement
  return (
    <div className='Market-summary_main_content'>
      {/* Price Changes */}
      <MarketChange priceChanges={priceChanges} />

      {/* Market Stats */}
      <div className="market-summary_main_table">
        <div className="market-summary_main_item">
          <div className="market-summary_main_left">
            <div>Market Cap</div>
            <div id="marketInfo" className="market-summary_main_info_wrapper">
              <div>i</div>
            </div>
          </div>
          <div className="market-summary_main_right">
            <div>{formatCurrency(marketData.marketCap)}</div>
          </div>
        </div>
        <div className="market-summary_main_item">
          <div className="market-summary_main_left">
            <div>Fully Diluted Valuation</div>
            <div id="marketInfo" className="market-summary_main_info_wrapper">
              <div>i</div>
            </div>
          </div>
          <div className="market-summary_main_right">
            <div>{formatCurrency(marketData.fullyDilutedValuation)}</div>
          </div>
        </div>
        <div className="market-summary_main_item">
          <div className="market-summary_main_left">
            <div>24 Hour Trading Vol</div>
            <div id="marketInfo" className="market-summary_main_info_wrapper">
              <div>i</div>
            </div>
          </div>
          <div className="market-summary_main_right">
            <div>{formatCurrency(marketData.volume24h)}</div>
          </div>
        </div>
        <div className="market-summary_main_item">
          <div className="market-summary_main_left">
            <div>Circulating Supply</div>
            <div id="marketInfo" className="market-summary_main_info_wrapper">
              <div>i</div>
            </div>
          </div>
          <div className="market-summary_main_right">
            <div>{formatNumber(marketData.circulatingSupply)} {supplySymbol}</div>
          </div>
        </div>
        <div className="market-summary_main_item">
          <div className="market-summary_main_left">
            <div>Total Supply</div>
            <div id="marketInfo" className="market-summary_main_info_wrapper">
              <div>i</div>
            </div>
          </div>
          <div className="market-summary_main_right">
            <div>{marketData.totalSupply ? formatNumber(marketData.totalSupply) : '—'} {supplySymbol}</div>
          </div>
        </div>
        <div className="market-summary_main_item">
          <div className="market-summary_main_left">
            <div>Max Supply</div>
            <div id="marketInfo" className="market-summary_main_info_wrapper">
              <div>i</div>
            </div>
          </div>
          <div className="market-summary_main_right">
            <div>{marketData.maxSupply ? formatNumber(marketData.maxSupply) : '—'} {supplySymbol}</div>
          </div>
        </div>
        <div className="market-summary_main_item">
          <div className="market-summary_main_left">
            <div>Total Treasury Holding</div>
            <div id="marketInfo" className="market-summary_main_info_wrapper">
              <div>i</div>
            </div>
          </div>
          <div className="market-summary_main_right">
            <div>{formatNumber(1729936)} {supplySymbol}</div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="text-size-medium text-weight-medium">Info</div>
      <div className="market-summary_main_table">
        <div className="market-summary_main_item">
          <div className="market-summary_main_left">
            <div>{formatNumber(1729936)} {supplySymbol}</div>
          </div>
          <div className="market-summary_main_right">
            {marketData.links?.whitepaper && (
              <a href={marketData.links.whitepaper} target="_blank" rel="noopener noreferrer" className="market-summary_main_link">
                Whitepaper
              </a>
            )}
            {Array.isArray(marketData.links?.homepage) && marketData.links.homepage[0] && (
              <a href={marketData.links.homepage[0]} target="_blank" rel="noopener noreferrer" className="market-summary_main_link">
                {name}.org
              </a>
            )}
          </div>
        </div>
        <div className="market-summary_main_item">
          <div className="market-summary_main_left">
            <div>Community</div>
          </div>
          <div className="market-summary_main_right">
            {marketData.links?.twitter && (
              <a href={`https://twitter.com/${marketData.links.twitter}`} target="_blank" rel="noopener noreferrer" className="market-summary_main_link">
                Twitter
              </a>
            )}
            {marketData.links?.facebook && (
              <a href={`https://facebook.com/${marketData.links.facebook}`} target="_blank" rel="noopener noreferrer" className="market-summary_main_link">
                Facebook
              </a>
            )}

            {marketData.links.reddit && (
              <a href={marketData.links.reddit} target="_blank" rel="noopener noreferrer" className="market-summary_main_link">
                Reddit
              </a>
            )}
            {marketData.links.telegram && (
              <a href={`https://t.me/${marketData.links.telegram}`} target="_blank" rel="noopener noreferrer" className="market-summary_main_link">
                Telegram
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Converter */}
      <div className="text-size-medium text-weight-medium">{name || supplySymbol} Converter</div>
      <div className="market-summary_main_converter">
        <div className="market-summary_main_converter_form w-form">
          <form className="market-summary_main_converter_wrapper" onSubmit={(e) => e.preventDefault()}>
            <input 
              className="market-summary_main_converter_input is-first w-input"
              name="Crypto"
              placeholder="BTC"
              type="number"
              value={converter.btc}
              onChange={(e) => handleConverterChange('btc', e.target.value)}
              step="0.00000001"
            />
            <input 
              className="market-summary_main_converter_input is-last w-input"
              name="Currency"
              placeholder="USDT"
              type="number"
              value={converter.usdt.toFixed(2)}
              onChange={(e) => handleConverterChange('usdt', e.target.value)}
              step="0.01"
            />
          </form>
        </div>
      </div>

      {/* Historical Price */}
      <div className="text-size-medium text-weight-medium">{name || supplySymbol} Historical Price</div>
      <div className="market-summary_main_table">
        <div className="market-summary_main_item">
          <div className="market-summary_main_left">
            <div>24h Range</div>
          </div>
          <div className="market-summary_main_right">
            <div>{formatPrice(marketData.low24h)} – {formatPrice(marketData.high24h)}</div>
          </div>
        </div>
        <div className="market-summary_main_item">
          <div className="market-summary_main_left">
            <div>7d Range</div>
          </div>
          <div className="market-summary_main_right">
            <div>{formatPrice(marketData.low7d)} – {formatPrice(marketData.high7d)}</div>
          </div>
        </div>
        {/* All-Time High */}
        <div className="market-summary_main_item">
          <div className="market-summary_main_left">
            <div>All-Time High</div>
          </div>
          <div className="market-summary_main_right">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 500 }}>{formatPrice(marketData.ath)}</span>
              <span style={{ color: '#ef5350', fontWeight: 500 }}>&#x25BC; {Math.abs(marketData.athChangePercentage).toFixed(2)}%</span>
            </div>
            <div style={{ color: '#888', fontSize: '0.95em', marginTop: '0.25rem' }}>
              {marketData.athDate ? new Date(marketData.athDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : ''}
              {marketData.athDate ? ` (${getTimeAgo(marketData.athDate)})` : ''}
            </div>
          </div>
        </div>
        {/* All-Time Low */}
        <div className="market-summary_main_item">
          <div className="market-summary_main_left">
            <div>All-Time Low</div>
          </div>
          <div className="market-summary_main_right">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 500 }}>{formatPrice(marketData.atl)}</span>
              <span style={{ color: '#26a69a', fontWeight: 500 }}>&#x25B2; {Math.abs(marketData.atlChangePercentage).toFixed(2)}%</span>
            </div>
            <div style={{ color: '#888', fontSize: '0.95em', marginTop: '0.25rem' }}>
              {marketData.atlDate ? new Date(marketData.atlDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : ''}
              {marketData.atlDate ? ` (${getTimeAgo(marketData.atlDate)})` : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketSummary;

// Helper function for time ago
function getTimeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = now - date;
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  if (years > 0) return `over ${years} year${years > 1 ? 's' : ''}`;
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
  if (months > 0) return `${months} month${months > 1 ? 's' : ''}`;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
  return 'recently';
}
