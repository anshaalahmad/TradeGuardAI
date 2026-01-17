import React, { useEffect, useRef, useState } from 'react'
import { initBinanceCandleChart } from './CandleChart'
import { isBinanceSymbolSupported } from '../../../utils/binanceSymbols';

function getCryptoLogoUrl(symbol) {
  const sym = String(symbol || '').toLowerCase()
  // Use proxied endpoint to hide API key
  return `/api/logo/${sym}`
}

function formatCurrency(value) {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value)
  } catch (_) {
    return value
  }
}

function getChangeClass(change) {
  if (typeof change !== 'number') return 'text-color-primary'
  if (change > 0) return 'text-color-green'
  if (change < 0) return 'text-color-red'
  return 'text-color-primary'
}

/**
 * BinanceCandleChartCard - Unified component for displaying Binance candlestick charts
 * - Displays crypto card with header (name, symbol, icon, price, change percentage)
 * - Initializes real-time candlestick chart via Binance WebSocket + REST API
 * - Auto-resizes chart with container using ResizeObserver
 * - Handles historical data loading and live price updates
 *
 * Props:
 * - name: string - Cryptocurrency name (e.g., 'Bitcoin')
 * - symbol: string - Ticker symbol (e.g., 'BTC')
 * - price: number - Initial price (gets updated by WebSocket)
 * - change: number - Price change percentage
 * - chartSymbol: string - Binance trading pair (e.g., 'BTCUSDT')
 * - interval: string - Candle interval ('1m', '5m', '1h', etc.)
 * - height: number - Chart height in pixels
 */
export default function BinanceCandleChartCard({
  name = 'Bitcoin',
  symbol = 'BTC',
  price = 86716,
  change,
  // chart props
  chartSymbol,
  interval = '1m',
  height = 400,
  data = [],
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notOnBinance, setNotOnBinance] = useState(false);
  const displayPrice = typeof price === 'number' ? formatCurrency(price) : (price || '$86,716')
  const changeNumber = typeof change === 'string' ? parseFloat(change) : change
  const changeClass = getChangeClass(changeNumber)
  const changeText = change == null ? null : (typeof change === 'number' ? `${change > 0 ? '+' : ''}${change}%` : String(change))
  const logoUrl = getCryptoLogoUrl(symbol)

  const containerRef = useRef(null)
  const priceRef = useRef(null)
  const instanceRef = useRef(null)

  // Force a re-render if containerRef is null on first mount
  const [containerReady, setContainerReady] = useState(false);
  useEffect(() => {
    setNotOnBinance(false);
    setLoading(true);
    setError(null);
    if (!containerRef.current) {
      setTimeout(() => setContainerReady(r => !r), 0);
      return;
    }
    // Check if symbol is supported on Binance before initializing chart
    isBinanceSymbolSupported(chartSymbol || `${symbol}USDT`).then((supported) => {
      if (!supported) {
        setNotOnBinance(true);
        setLoading(false);
        return;
      }
      try {
        const cfg = {
          symbol: chartSymbol || `${symbol}USDT`,
          interval,
          height,
          data,
        };
        console.log('[BinanceCandleChartCard] Initializing chart with config:', cfg);
        const instance = initBinanceCandleChart(containerRef.current, priceRef.current, cfg);
        instanceRef.current = instance;
        setLoading(false);
        return () => {
          try { instanceRef.current?.destroy(); } catch (e) { console.warn('[BinanceCandleChartCard] destroy error', e); }
          instanceRef.current = null;
        };
      } catch (err) {
        setError('Failed to load chart data. Please try again.');
        setLoading(false);
        console.error('[BinanceCandleChartCard] Chart init error:', err);
      }
    });
  }, [chartSymbol, symbol, interval, height, containerReady]);
  return (
    <div className="card_app_wrapper">
      <div className="card_app_header">
        <div className="card_main_text_wrapper is-centered">
          <img
            src={logoUrl}
            loading="lazy"
            alt={`${name} logo`}
            className="card_main_crypto_icon"
          />
          <div className="text-size-large text-weight-medium">{name}</div>
          <div className="text-size-large text-color-secondary">{symbol}</div>
        </div>
        <div className="card_main_text_wrapper is-centered">
          <div ref={priceRef} className="card_app_price" style={{ color: 'black' }}>{displayPrice}</div>
          {changeText ? (
            <div className={`text-size-regular ${changeClass}`}>{changeText}</div>
          ) : null}
        </div>
      </div>
      {notOnBinance ? (
        <div style={{ color: 'orange', textAlign: 'center', padding: 16 }}>
          This coin is not available on Binance. Candle chart is unavailable.
        </div>
      ) : (
        <>
          <div ref={containerRef} style={{ width: '100%', height }} />
          {loading && <div style={{ textAlign: 'center', padding: 16 }}>Loading chart...</div>}
          {error && <div style={{ color: 'red', textAlign: 'center', padding: 16 }}>{error}</div>}
        </>
      )}
    </div>
  );
}
