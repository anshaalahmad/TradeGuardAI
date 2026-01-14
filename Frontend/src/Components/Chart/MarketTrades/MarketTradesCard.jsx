import React, { useState, useEffect, useRef } from 'react';

const MarketTradesCard = ({ symbol = 'ETHUSDT', baseAsset = 'ETH', maxTrades = 13 }) => {
  const [trades, setTrades] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);
  const pendingTradesRef = useRef([]);
  const lastUpdateTimeRef = useRef(0);
  const UPDATE_THROTTLE = 250; // Update UI at most every 250ms

  useEffect(() => {
    // Fetch initial trades from REST API
    const fetchInitialTrades = async () => {
      try {
        const response = await fetch(`https://api.binance.com/api/v3/trades?symbol=${symbol}&limit=${maxTrades}`);
        const data = await response.json();
        
        const formattedTrades = data.map(trade => ({
          price: parseFloat(trade.price),
          amount: parseFloat(trade.qty),
          time: new Date(trade.time),
          isBuyerMaker: trade.isBuyerMaker
        }));
        
        setTrades(formattedTrades);
      } catch (error) {
        console.error('Error fetching initial trades:', error);
      }
    };

    fetchInitialTrades();
  }, [symbol, maxTrades]);

  useEffect(() => {
    // Connect to Binance WebSocket for real-time trades
    const wsUrl = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade`;
    
    // Clear pending trades from previous symbol
    pendingTradesRef.current = [];
    lastUpdateTimeRef.current = 0;
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;
    let isSubscribed = true;

    ws.onopen = () => {
      console.log('Market Trades WebSocket connected');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Create new trade object
        const newTrade = {
          price: parseFloat(data.p),
          amount: parseFloat(data.q),
          time: new Date(data.T),
          isBuyerMaker: data.m // true = sell (maker is buyer), false = buy (maker is seller)
        };

        // Add to pending trades buffer instead of immediate state update
        // Limit buffer size to prevent memory leak (max 2x maxTrades)
        pendingTradesRef.current = [newTrade, ...pendingTradesRef.current].slice(0, maxTrades * 2);
      } catch (error) {
        console.error('Error processing trade:', error);
      }
    };

    // Throttled update loop - applies trades at controlled intervals
    const updateInterval = setInterval(() => {
      if (pendingTradesRef.current.length === 0 || !isSubscribed) return;
      
      const now = Date.now();
      if (now - lastUpdateTimeRef.current < UPDATE_THROTTLE) return;
      
      lastUpdateTimeRef.current = now;
      
      setTrades(prevTrades => {
        // Merge pending trades with existing trades
        const merged = [...pendingTradesRef.current, ...prevTrades];
        pendingTradesRef.current = []; // Clear pending buffer
        return merged.slice(0, maxTrades);
      });
    }, 100); // Check every 100ms but only apply if throttle time has passed

    ws.onerror = (error) => {
      console.error('Market Trades WebSocket error:', error);
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log('Market Trades WebSocket disconnected');
      setIsConnected(false);
    };

    return () => {
      isSubscribed = false;
      clearInterval(updateInterval);
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [symbol, maxTrades]);

  const formatPrice = (price) => {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const formatAmount = (amount) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 5,
      maximumFractionDigits: 5
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="card_app_wrapper" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div className="card_app_header" style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color--border-primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="text-size-medium text-weight-medium">Market Trades</div>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isConnected ? 'var(--color-green)' : 'var(--text-color--text-tertiary)',
            transition: 'background-color 0.3s'
          }} />
        </div>
      </div>

      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Trades Table */}
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--background-grey)', borderBottom: '1px solid var(--border-color--border-primary)' }}>
                <th style={{ padding: '0.5rem 0.75rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-color--text-secondary)', width: '33%' }}>Price (USDT)</th>
                <th style={{ padding: '0.5rem 0.75rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-color--text-secondary)', width: '33%' }}>Amount ({baseAsset})</th>
                <th style={{ padding: '0.5rem 0.75rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-color--text-secondary)', width: '34%' }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade, index) => (
                <tr 
                  key={`${trade.time.getTime()}-${index}`}
                  style={{ height: '26px' }}
                >
                  <td style={{ 
                    padding: '0.25rem 0.75rem', 
                    textAlign: 'right',
                    fontSize: '0.875rem',
                    color: trade.isBuyerMaker ? 'var(--color-red)' : 'var(--color-green)',
                    fontWeight: 500,
                    transition: 'color 0.15s ease',
                    width: '33%'
                  }}>
                    {formatPrice(trade.price)}
                  </td>
                  <td style={{ 
                    padding: '0.25rem 0.75rem', 
                    textAlign: 'right',
                    fontSize: '0.875rem',
                    color: 'var(--text-color--text-primary)',
                    transition: 'color 0.15s ease',
                    width: '33%'
                  }}>
                    {formatAmount(trade.amount)}
                  </td>
                  <td style={{ 
                    padding: '0.25rem 0.75rem', 
                    textAlign: 'right',
                    fontSize: '0.875rem',
                    color: 'var(--text-color--text-secondary)',
                    transition: 'color 0.15s ease',
                    width: '34%'
                  }}>
                    {formatTime(trade.time)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {trades.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          color: 'var(--text-color--text-tertiary)',
          fontSize: '0.875rem'
        }}>
          Connecting to market trades...
        </div>
      )}
    </div>
  );
};

export default MarketTradesCard;
