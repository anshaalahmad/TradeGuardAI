import React, { useEffect, useState } from 'react';
import coinOverrides from './coinOverrides';

const PAGE_SIZE = 100;

const formatCurrency = (v) => {
  if (v === null || v === undefined || Number.isNaN(v)) return '—';
  return typeof v === 'number' ? `$${v.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : v;
};

const formatPercent = (v) => {
  if (v === null || v === undefined || Number.isNaN(v)) return '—';
  return `${Math.abs(Number(v)).toFixed(2)}%`;
};

const renderChange = (v) => {
  if (v === null || v === undefined || Number.isNaN(v)) return <div className="text-size-regular">—</div>;
  const num = Number(v);
  const isUp = num >= 0;
  const color = isUp ? '#16a34a' : '#dc2626';
  return (
    <div className="text-size-regular" style={{ color, display: 'flex', alignItems: 'center', gap: 4 }}>
      <span style={{ display: 'flex', alignItems: 'center' }}>
        {isUp ? (
          <svg width="12" height="12" viewBox="0 0 40 35" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M36.1013 26H3.46944C1.74124 26 0.826577 23.956 1.97812 22.6673L18.4906 4.18913C19.2921 3.29213 20.6983 3.30054 21.4891 4.20701L37.6084 22.6853C38.7371 23.9791 37.8182 26 36.1013 26Z" fill={color}></path></svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 40 35" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.89868 9H36.5306C38.2588 9 39.1734 11.044 38.0219 12.3327L21.5094 30.8109C20.7079 31.7079 19.3017 31.6995 18.5109 30.793L2.3916 12.3147C1.26289 11.0209 2.1818 9 3.89868 9Z" fill={color}></path></svg>
        )}
      </span>
      <span>{formatPercent(num)}</span>
    </div>
  );
};

const TopCryptoTable = ({ onCryptoSelect }) => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let mounted = true;
    const fetchCoins = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch top coins by market cap from backend (cached, avoids CoinGecko 429)
        const res = await fetch(`http://localhost:4001/api/crypto/list?page=${page}&limit=${PAGE_SIZE}`);
        if (!res.ok) throw new Error('Backend API error');
        const data = await res.json();
        const coinsWithImages = (data.cryptos || []).map(cg => ({
          id: cg.id,
          symbol: cg.symbol?.toUpperCase() || '',
          name: cg.name || cg.symbol?.toUpperCase() || '',
          image: cg.image || null,
          lastPrice: typeof cg.currentPrice === 'number' ? cg.currentPrice : null,
          priceChangePercent: typeof cg.priceChangePercent24h === 'number' ? cg.priceChangePercent24h : null,
          priceChange1h: typeof cg.priceChangePercent1h === 'number' ? cg.priceChangePercent1h : null,
          priceChange24h: typeof cg.priceChangePercent24h === 'number' ? cg.priceChangePercent24h : null,
          priceChange7d: typeof cg.priceChangePercent7d === 'number' ? cg.priceChangePercent7d : null,
          marketCap: typeof cg.marketCap === 'number' ? cg.marketCap : null,
          quoteVolume: typeof cg.volume24h === 'number' ? cg.volume24h : null,
          raw: cg,
        }));
        if (!mounted) return;
        setCoins(coinsWithImages);
        setTotal(data.count || 1000);
      } catch (err) {
        if (!mounted) return;
        setError('Failed to load data: ' + err.message);
        setCoins([]);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    fetchCoins();
    const interval = setInterval(fetchCoins, 30000);
    return () => { mounted = false; clearInterval(interval); };
  }, [page]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="card_app_wrapper">
      <div className="card_app_header">
        <div className="card_main_text_wrapper is-centered">
          <div className="text-size-large">Top Cryptocurrencies</div>
        </div>
      </div>
      <div className="card_app_crypto_wrapper">
        <div className="card_app_top_wrapper">
          <div className="card_app_top_row is-main">
            <div className="card_app_top_text_wrapper is-header">
              <div className="text-size-small text-weight-semibold">#</div>
            </div>
            <div className="card_app_top_text_wrapper is-header">
              <div className="text-size-small text-weight-semibold">Name</div>
            </div>
            <div className="card_app_top_text_wrapper align-left is-header">
              <div className="text-size-small text-weight-semibold">Price</div>
            </div>
            <div className="card_app_top_text_wrapper align-left is-header">
              <div className="text-size-small text-weight-semibold">1h</div>
            </div>
            <div className="card_app_top_text_wrapper align-left is-header">
              <div className="text-size-small text-weight-semibold">24h</div>
            </div>
            <div className="card_app_top_text_wrapper align-left is-header">
              <div className="text-size-small text-weight-semibold">7d</div>
            </div>
            <div className="card_app_top_text_wrapper align-left is-header">
              <div className="text-size-small text-weight-semibold">Market Cap</div>
            </div>
          </div>
          {loading ? (
            <div style={{ padding: 24, textAlign: 'center', width: '100%' }}>Loading...</div>
          ) : error ? (
            <div style={{ padding: 24, color: 'red', textAlign: 'center', width: '100%' }}>{error}</div>
          ) : (
            coins.map((coin, idx) => (
              <div
                className="card_app_top_row is-main"
                key={`${coin.id}-${coin.symbol}-${idx}`}
                style={{ cursor: 'pointer' }}
                onClick={() => onCryptoSelect && onCryptoSelect(coin)}
              >
                <div className="card_app_top_text_wrapper">
                  <div className="text-size-regular">{String((page - 1) * PAGE_SIZE + idx + 1).padStart(2, '0')}</div>
                </div>
                <div className="card_app_top_text_wrapper">
                  {coin.image && (
                    <img
                      src={coin.image}
                      alt={coin.name}
                      loading="lazy"
                      className="card_app_top_icon"
                      style={{ width: 32, height: 32, marginRight: 8, objectFit: 'contain', borderRadius: '50%' }}
                    />
                  )}
                  <div className="text-size-regular">{coin.name}</div>
                </div>
                <div className="card_app_top_text_wrapper align-left">
                  <div className="text-size-regular">{formatCurrency(coin.lastPrice)}</div>
                </div>
                {/* 1h change (not available) */}
                <div className="card_app_top_text_wrapper align-left">
                  {coin.priceChange1h !== null && coin.priceChange1h !== undefined ? renderChange(coin.priceChange1h) : <span className="text-size-regular">—</span>}
                </div>
                {/* 24h change */}
                <div className="card_app_top_text_wrapper align-left">
                  {coin.priceChange24h !== null && coin.priceChange24h !== undefined ? renderChange(coin.priceChange24h) : <span className="text-size-regular">—</span>}
                </div>
                {/* 7d change (not available) */}
                <div className="card_app_top_text_wrapper align-left">
                  {coin.priceChange7d !== null && coin.priceChange7d !== undefined ? renderChange(coin.priceChange7d) : <span className="text-size-regular">—</span>}
                </div>
                <div className="card_app_top_text_wrapper align-left">
                  <div className="text-size-regular">{coin.marketCap !== null && coin.marketCap !== undefined ? formatCurrency(coin.marketCap) : '—'}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="card_app_footer">
        <div className="card_app_pagination_wrapper">
          <div className="card_app_pagination_text">
            <div className="text-size-small text-color-secondary">Showing</div>
            <div className="text-size-small text-color-secondary">{total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}</div>
            <div className="text-size-small text-color-secondary">to</div>
            <div className="text-size-small text-color-secondary">{Math.min(page * PAGE_SIZE, total)}</div>
            <div className="text-size-small text-color-secondary">of</div>
            <div className="text-size-small text-color-secondary">{total}</div>
          </div>
          <div className="card_app_pagination">
            <button
              className="card_app_pagination_link w-inline-block"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{ background: 'none', border: 'none', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
            >
              <svg width="7" height="12" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.40482 10.75L0.994071 6.33926C0.668635 6.01382 0.668635 5.48618 0.994071 5.16074L5.40482 0.75" stroke="currentcolor" strokeWidth="1.5" strokeLinecap="round"></path></svg>
            </button>
            <div className="card_app_pagination_link_flex">
              {Array.from({ length: Math.min(totalPages, 6) }, (_, i) => {
                let pageNum = i + 1;
                if (page > 3 && totalPages > 6) {
                  if (i === 0) pageNum = 1;
                  else if (i === 1) pageNum = page - 1;
                  else if (i === 2) pageNum = page;
                  else if (i === 3) pageNum = page + 1;
                  else if (i === 4) pageNum = totalPages;
                  else pageNum = '...';
                }
                if (pageNum > totalPages) return null;
                if (pageNum === '...') {
                  return <span key={i} className="card_app_pagination_link w-inline-block">...</span>;
                }
                return (
                  <button
                    key={i}
                    className={`card_app_pagination_link w-inline-block${pageNum === page ? ' is-active' : ''}`}
                    onClick={() => setPage(pageNum)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <div>{pageNum}</div>
                  </button>
                );
              })}
            </div>
            <button
              className="card_app_pagination_link w-inline-block"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{ background: 'none', border: 'none', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
            >
              <svg width="7" height="12" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.75 0.75L5.16074 5.16074C5.48618 5.48618 5.48618 6.01382 5.16074 6.33926L0.75 10.75" stroke="currentcolor" strokeWidth="1.5" strokeLinecap="round"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopCryptoTable;
