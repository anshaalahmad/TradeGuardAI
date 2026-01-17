import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../Components/Dashboard Pages/Navbar';
import Sidebar from '../Components/Dashboard Pages/Sidebar';
import Navlinks from '../Components/Dashboard Pages/Navlinks';
import BinanceCandleChartCard from '../Components/Chart/CandleChart/BinanceCandleChartCard.jsx';
import OrderBookCard from '../Components/Chart/OrderBook/OrderBookCard.jsx';
import MarketTradesCard from '../Components/Chart/MarketTrades/MarketTradesCard.jsx';
import MarketSummary from '../Components/MarketSummary/MarketSummary.jsx';
import TopCryptoTable from '../Components/MarketSummary/TopCryptoTable';

export default function DashboardApp() {
  const { member } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState(null); // null = show table, otherwise show details
  const [tradingConfig, setTradingConfig] = useState({
    name: "Bitcoin",
    symbol: "BTC",
    chartSymbol: "BTCUSDT",
    interval: "1h",
    height: 400,
    maxOrders: 8,
    maxTrades: 10
  });
  const [priceChanges, setPriceChanges] = useState({});

  const userName = member?.customFields?.name || member?.auth?.email?.split('@')[0] || 'User';

  // When a crypto is selected from the table, update tradingConfig and selectedCrypto
  const handleCryptoSelect = (coin) => {
    console.log('Selected crypto:', coin);
    setSelectedCrypto(coin);
    setTradingConfig({
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      chartSymbol: (coin.symbol + 'USDT').toUpperCase(),
      interval: '1h',
      height: 400,
      maxOrders: 8,
      maxTrades: 10
    });
    // Update URL to reflect selected coin
    window.history.pushState({}, '', `/cryptocurrency/${coin.name.toLowerCase().replace(/\s+/g, '-')}`);
  };
  // Debug: log selectedCrypto on every render
  useEffect(() => {
    console.log('DashboardApp selectedCrypto:', selectedCrypto);
  }, [selectedCrypto]);

  // Handle navigation from sidebar
  const handleSidebarNavigate = (path, linkId) => {
    if (linkId === 'cryptocurrency') {
      setSelectedCrypto(null);
      window.history.pushState({}, '', '/cryptocurrency');
    } else {
      window.history.pushState({}, '', path);
    }
  };

  // Fetch price changes for selected crypto
  useEffect(() => {
    if (!selectedCrypto) return;
    const fetchPriceChanges = async () => {
      try {
        const symbol = (selectedCrypto.symbol + 'USDT').toUpperCase();
        const ticker24h = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
        const ticker24hData = await ticker24h.json();
        const now = Date.now();
        const intervals = {
          '1h': { interval: '1h', limit: 1, time: now - 60 * 60 * 1000 },
          '7d': { interval: '1d', limit: 7, time: now - 7 * 24 * 60 * 60 * 1000 },
          '14d': { interval: '1d', limit: 14, time: now - 14 * 24 * 60 * 60 * 1000 },
          '30d': { interval: '1d', limit: 30, time: now - 30 * 24 * 60 * 60 * 1000 },
          '1y': { interval: '1w', limit: 52, time: now - 365 * 24 * 60 * 60 * 1000 }
        };
        const currentPrice = parseFloat(ticker24hData.lastPrice);
        const priceChange24h = parseFloat(ticker24hData.priceChangePercent);
        const calculatePeriodChange = async (period, config) => {
          try {
            const response = await fetch(
              `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${config.interval}&limit=${config.limit}`
            );
            const klines = await response.json();
            if (klines && klines.length > 0) {
              const oldPrice = parseFloat(klines[0][1]);
              return ((currentPrice - oldPrice) / oldPrice) * 100;
            }
            return 0;
          } catch (error) {
            return 0;
          }
        };
        const [change1h, change7d, change14d, change30d, change1y] = await Promise.all([
          calculatePeriodChange('1h', intervals['1h']),
          calculatePeriodChange('7d', intervals['7d']),
          calculatePeriodChange('14d', intervals['14d']),
          calculatePeriodChange('30d', intervals['30d']),
          calculatePeriodChange('1y', intervals['1y'])
        ]);
        setPriceChanges({
          '1h': change1h,
          '24h': priceChange24h,
          '7d': change7d,
          '14d': change14d,
          '30d': change30d,
          '1y': change1y,
        });
      } catch (error) {
        setPriceChanges({
          '1h': 0,
          '24h': 0,
          '7d': 0,
          '14d': 0,
          '30d': 0,
          '1y': 0,
        });
      }
    };
    fetchPriceChanges();
    const interval = setInterval(fetchPriceChanges, 30000);
    return () => clearInterval(interval);
  }, [selectedCrypto]);

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className='page-wrapper'>
      <div className='main-wrapper is-dashboard'>
        <Sidebar userName={userName} isOpen={isSidebarOpen} onNavigate={handleSidebarNavigate} />
        <div className='dashboard_main_wrapper'>
          <Navbar onMenuToggle={handleMenuToggle} isSidebarOpen={isSidebarOpen} />
          <Navlinks />
          <div className='dashboard_main_app'>
            {!selectedCrypto ? (
                <TopCryptoTable onCryptoSelect={handleCryptoSelect} />
            ) : (
              <div className='dashboard_main_content'>
                <div className='dashboard_main_flex'>
                  <BinanceCandleChartCard
                    name={tradingConfig.name}
                    symbol={tradingConfig.symbol}
                    chartSymbol={tradingConfig.chartSymbol}
                    interval={tradingConfig.interval}
                    height={tradingConfig.height}
                  />
                  <div className='market-summary_main_wrapper'>
                    <MarketSummary 
                      symbol={tradingConfig.chartSymbol}
                      coinId={selectedCrypto?.id || 'bitcoin'}
                      name={tradingConfig.name}
                      priceChanges={priceChanges}
                    />
                  </div>
                </div>
                <div className='content_main_flex'>
                  <OrderBookCard 
                    symbol={tradingConfig.chartSymbol}
                    baseAsset={tradingConfig.symbol}
                    maxOrders={tradingConfig.maxOrders}
                  />
                  <MarketTradesCard 
                    symbol={tradingConfig.chartSymbol}
                    baseAsset={tradingConfig.symbol}
                    maxTrades={tradingConfig.maxTrades}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
