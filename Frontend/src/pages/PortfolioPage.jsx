import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../Components/Dashboard Pages/Navbar';
import Sidebar from '../Components/Dashboard Pages/Sidebar';
import walletApi from '../services/walletApi';

// Wallet type icons (inline SVG)
const WalletIcons = {
  METAMASK: () => (
    <svg width="24" height="24" viewBox="0 0 111 111" fill="none"><path d="M102.58 1H7.81L1 34.02L55.19 110L110.37 34.02L102.58 1Z" fill="#E2761B" /><path d="M55.19 110L110.37 34.02L87.43 32.73L55.19 110Z" fill="#D7C1B3" /><path d="M55.19 110L1 34.02L23.95 32.73L55.19 110Z" fill="#E48A1B" /></svg>
  ),
  BINANCE: () => (
    <svg width="24" height="24" viewBox="0 0 250 250" fill="none"><path d="M125 5L178.618 58.618L125 112.236L71.382 58.618L125 5Z" fill="#F3BA2F" /><path d="M49.382 80.618L103 134.236L49.382 187.854L-4.236 134.236L49.382 80.618Z" fill="#F3BA2F" /><path d="M200.618 80.618L254.236 134.236L200.618 187.854L147 134.236L200.618 80.618Z" fill="#F3BA2F" /></svg>
  ),
  OTHER: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 18V19C21 20.1 20.1 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.89 3 5 3H19C20.1 3 21 3.9 21 5V6H12C10.89 6 10 6.89 10 8V16C10 17.1 10.89 18 12 18H21ZM12 16H22V8H12V16ZM16 13.5C15.17 13.5 14.5 12.83 14.5 12C14.5 11.17 15.17 10.5 16 10.5C16.83 10.5 17.5 11.17 17.5 12C17.5 12.83 16.83 13.5 16 13.5Z" fill="#64748B" /></svg>
  ),
};

const WALLET_TYPES = [
  { value: 'BINANCE', label: 'Binance (Exchange)', isExchange: true },
  { value: 'METAMASK', label: 'MetaMask', isExchange: false }
];

const NETWORK_OPTIONS = [
  { value: 'ethereum', label: 'Ethereum' },
  { value: 'bsc', label: 'BNB Smart Chain' },
];

export default function PortfolioPage() {
  const { member } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Data
  const [wallets, setWallets] = useState([]);
  const [portfolio, setPortfolio] = useState(null);
  const [loadingWallets, setLoadingWallets] = useState(true);
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);
  const [error, setError] = useState(null);

  // Active tab
  const [activeTab, setActiveTab] = useState('holdings'); // 'holdings' | 'wallets'

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Add wallet form
  const [formData, setFormData] = useState({
    name: 'Binance',
    walletType: 'BINANCE',
    address: '',
    label: '',
    isDefault: false,
    apiKey: '',
    apiSecret: '',
    network: 'ethereum',
  });

  const isExchangeType = WALLET_TYPES.find((t) => t.value === formData.walletType)?.isExchange;

  // Ref to prevent re-fetching on every re-render / tab switch
  const hasFetchedRef = useRef(false);

  const fetchWallets = useCallback(async () => {
    try {
      setLoadingWallets(true);
      const res = await walletApi.getWallets();
      if (res.success) setWallets(res.wallets);
      return res.wallets || [];
    } catch (err) {
      setError('Failed to load wallets');
      return [];
    } finally {
      setLoadingWallets(false);
    }
  }, []);

  const fetchPortfolio = useCallback(async () => {
    try {
      setLoadingPortfolio(true);
      setError(null);
      const res = await walletApi.getPortfolioSummary();
      if (res.success) setPortfolio(res);
    } catch (err) {
      setError('Failed to load portfolio balances');
    } finally {
      setLoadingPortfolio(false);
    }
  }, []);

  // Only fetch on first mount — not on tab switches or re-renders
  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const init = async () => {
      const w = await fetchWallets();
      if (w.length > 0) {
        await fetchPortfolio();
      }
    };
    init();
  }, [fetchWallets, fetchPortfolio]);


  const handleMenuToggle = () => setIsSidebarOpen(!isSidebarOpen);
  const handleSidebarNavigate = (path) => navigate(path);

  const formatUsd = (value) => {
    if (value === undefined || value === null) return '$0.00';
    if (value >= 1) return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (value >= 0.01) return `$${value.toFixed(4)}`;
    return `$${value.toFixed(6)}`;
  };

  const formatCrypto = (value) => {
    if (value === undefined || value === null) return '0';
    if (value >= 1) return value.toLocaleString('en-US', { maximumFractionDigits: 4 });
    if (value >= 0.0001) return value.toFixed(6);
    return value.toFixed(8);
  };

  const formatAddress = (address) => {
    if (!address) return '';
    if (address.length < 12) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const openAddModal = () => {
    setFormData({
      name: 'Binance',
      walletType: 'BINANCE',
      address: '',
      label: '',
      isDefault: wallets.length === 0,
      apiKey: '',
      apiSecret: '',
      network: 'ethereum',
    });
    setIsAddModalOpen(true);
  };

  const openDeleteModal = (wallet) => {
    setSelectedWallet(wallet);
    setIsDeleteModalOpen(true);
  };



  const handleAddWallet = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const data = { ...formData };
      // Clean up — don't send empty strings for optional fields
      if (!data.address) delete data.address;
      if (!data.apiKey) delete data.apiKey;
      if (!data.apiSecret) delete data.apiSecret;
      if (!data.label) delete data.label;
      if (!isExchangeType) delete data.network; // only for on-chain

      await walletApi.addWallet(data);
      await fetchWallets();
      await fetchPortfolio();
      setIsAddModalOpen(false);
    } catch (err) {
      alert(err.error || err.message || 'Failed to add wallet');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteWallet = async () => {
    try {
      setSubmitting(true);
      await walletApi.deleteWallet(selectedWallet.id);
      await fetchWallets();
      await fetchPortfolio();
      setIsDeleteModalOpen(false);
    } catch (err) {
      alert(err.error || err.message || 'Failed to delete wallet');
    } finally {
      setSubmitting(false);
    }
  };

  const getWalletIcon = (type) => {
    const Icon = WalletIcons[type] || WalletIcons.OTHER;
    return <Icon />;
  };

  const totalValue = portfolio?.totalValueUsd || 0;
  const holdings = portfolio?.holdings || [];
  const walletSummaries = portfolio?.wallets || [];

  return (
    <div className="page-wrapper">
      <div className="main-wrapper is-dashboard">
        <Sidebar isOpen={isSidebarOpen} onNavigate={handleSidebarNavigate} activePage="portfolio" />
        <div className="dashboard_main_wrapper">
          <Navbar onMenuToggle={handleMenuToggle} isSidebarOpen={isSidebarOpen} />

          <div className="dashboard_main_app">
            <div className="dashboard_main_flex column">

              {/* Page Header */}
              <div className="portfolio-page-header">
                <div>
                  <h1 className="text-size-xlarge text-weight-semibold" style={{ marginBottom: '0.5rem' }}>My Portfolio</h1>
                  <p className="text-size-regular text-color-secondary">Track your crypto holdings across all connected wallets.</p>
                </div>
                <button className="button" onClick={openAddModal} style={{ background: '#2563eb', color: 'white', border: 'none', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>+</span> Add Wallet
                </button>
              </div>

              {/* Portfolio Summary Card */}
              <div className="card_app_wrapper portfolio-summary-card">
                <div className="portfolio-summary-inner">
                  <div className="portfolio-summary-label text-size-small text-color-secondary">Total Portfolio Value</div>
                  <div className="portfolio-summary-value">
                    {loadingPortfolio ? (
                      <span>Syncing...</span>
                    ) : (
                      formatUsd(totalValue)
                    )}
                  </div>
                  <div className="portfolio-summary-meta">
                    <span className="text-size-small text-color-secondary">
                      {wallets.length} wallet{wallets.length !== 1 ? 's' : ''} connected
                    </span>
                    {wallets.length > 0 && (
                      <button className="portfolio-refresh-btn" onClick={fetchPortfolio} disabled={loadingPortfolio} title="Refresh balances">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={loadingPortfolio ? 'spinning' : ''}>
                          <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
                          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Tabs */}
              {wallets.length > 0 && (
                <div className="portfolio-tabs">
                  <button className={`portfolio-tab ${activeTab === 'holdings' ? 'active' : ''}`} onClick={() => setActiveTab('holdings')}>
                    Holdings
                  </button>
                  <button className={`portfolio-tab ${activeTab === 'wallets' ? 'active' : ''}`} onClick={() => setActiveTab('wallets')}>
                    Wallets ({wallets.length})
                  </button>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="card_app_wrapper" style={{ padding: '1rem', borderLeft: '3px solid #ef5350' }}>
                  <span className="text-size-small" style={{ color: '#ef5350' }}>{error}</span>
                </div>
              )}

              {/* Holdings Tab */}
              {activeTab === 'holdings' && (
                <>
                  {loadingWallets ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }} className="text-color-secondary">Loading wallets...</div>
                  ) : wallets.length === 0 ? (
                    /* Empty State */
                    <div className="portfolio-empty-state" onClick={openAddModal}>
                      <div className="add-wallet-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                      </div>
                      <h3 className="text-weight-semibold" style={{ marginTop: '1rem' }}>No wallets connected</h3>
                      <p className="text-size-small text-color-secondary" style={{ marginTop: '0.5rem', maxWidth: '320px', textAlign: 'center' }}>
                        Connect your Binance account or add a wallet address to see your crypto holdings and portfolio value.
                      </p>
                      <button className="button" style={{ marginTop: '1.5rem' }}>Connect Wallet</button>
                    </div>
                  ) : loadingPortfolio ? (
                    <div className="card_app_wrapper" style={{ padding: '2rem', textAlign: 'center' }}>
                      <div style={{ width: '32px', height: '32px', border: '3px solid var(--border-primary, #e5e5e7)', borderTopColor: 'var(--color-brand, #1e65fa)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
                      <span className="text-color-secondary">Fetching live balances...</span>
                    </div>
                  ) : holdings.length === 0 && wallets.length > 0 ? (
                    <div className="card_app_wrapper" style={{ padding: '2rem', textAlign: 'center' }}>
                      <p className="text-color-secondary">No holdings found. Your wallets may have zero balance, or the API key may need read permissions enabled.</p>
                    </div>
                  ) : (
                    /* Holdings Table */
                    <div className="card_app_wrapper holdings-table-wrapper">
                      <div className="holdings-table-header">
                        <div className="holdings-col holdings-col-asset">Asset</div>
                        <div className="holdings-col holdings-col-price">Price</div>
                        <div className="holdings-col holdings-col-amount">Amount</div>
                        <div className="holdings-col holdings-col-value">Value</div>
                        <div className="holdings-col holdings-col-change">24h Change</div>
                      </div>
                      {holdings.map((holding, i) => (
                        <div key={holding.asset + i} className="holdings-row">
                          <div className="holdings-col holdings-col-asset">
                            <div className="holdings-asset-icon">
                              <img
                                src={`/api/logo/${holding.asset.toLowerCase()}`}
                                alt={holding.asset}
                                width="32"
                                height="32"
                                style={{ borderRadius: '50%' }}
                                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${holding.asset}&background=1e65fa&color=fff&size=32`; }}
                              />
                            </div>
                            <div>
                              <div className="text-weight-semibold">{holding.asset}</div>
                            </div>
                          </div>
                          <div className="holdings-col holdings-col-price">
                            <span>{formatUsd(holding.priceUsd)}</span>
                          </div>
                          <div className="holdings-col holdings-col-amount">
                            <span>{formatCrypto(holding.total)} {holding.asset}</span>
                          </div>
                          <div className="holdings-col holdings-col-value">
                            <span className="text-weight-semibold">{formatUsd(holding.valueUsd)}</span>
                          </div>
                          <div className="holdings-col holdings-col-change">
                            <span className={holding.change24h >= 0 ? 'price-change-positive' : 'price-change-negative'}>
                              {holding.change24h >= 0 ? '+' : ''}{(holding.change24h || 0).toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Wallets Tab */}
              {activeTab === 'wallets' && (
                <div className="portfolio-grid">
                  {wallets.map((wallet) => {
                    const summary = walletSummaries.find((w) => w.walletId === wallet.id);
                    return (
                      <div key={wallet.id} className="card_app_wrapper wallet-card">
                        <div className="wallet-card-header">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div className="wallet-icon-wrapper">{getWalletIcon(wallet.walletType)}</div>
                            <div>
                              <div className="text-weight-semibold">{wallet.label || wallet.name}</div>
                              <div className="wallet-type-badge">{wallet.walletType.replace('_', ' ')}</div>
                            </div>
                          </div>
                          {wallet.isDefault && (
                            <span className="wallet-default-badge">Default</span>
                          )}
                        </div>
                        <div className="wallet-card-body">
                          {wallet.address && (
                            <div style={{ marginBottom: '0.75rem' }}>
                              <div className="text-size-small text-color-secondary">Address</div>
                              <div className="wallet-address-row">
                                <span className="wallet-address">{formatAddress(wallet.address)}</span>
                                <button className="wallet-copy-btn" onClick={() => copyToClipboard(wallet.address)} title="Copy"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg></button>
                              </div>
                            </div>
                          )}
                          {wallet.hasApiKeys && (
                            <div className="text-size-small" style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                              API Connected
                            </div>
                          )}
                          {summary && (
                            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color--border-primary, #e5e5e7)' }}>
                              <div className="text-size-small text-color-secondary">Balance</div>
                              <div className="text-weight-semibold" style={{ fontSize: '1.125rem' }}>
                                {summary.error ? <span style={{ color: '#ef5350', fontSize: '0.8rem' }}>{summary.error}</span> : formatUsd(summary.totalValueUsd)}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="wallet-card-footer">
                          <button className="button is-secondary is-small" style={{ color: '#ef4444', borderColor: '#fecaca', background: '#fef2f2' }} onClick={() => openDeleteModal(wallet)}>
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  <div className="add-wallet-card" onClick={openAddModal}>
                    <div className="add-wallet-content">
                      <div className="add-wallet-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                      </div>
                      <div className="text-weight-semibold mt-2">Add Wallet</div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Add Wallet Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => !submitting && setIsAddModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="text-size-large text-weight-semibold">Connect Wallet</h3>
              <button className="modal-close" onClick={() => setIsAddModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleAddWallet} className="modal-body">
              <div className="form-group mb-4">
                <label className="text-size-small text-weight-medium mb-1 d-block">Wallet Type</label>
                <select
                  className="main_form_input w-input"
                  value={formData.walletType}
                  onChange={(e) => {
                    const type = e.target.value;
                    const obj = WALLET_TYPES.find((t) => t.value === type);
                    setFormData({ ...formData, walletType: type, name: obj.label, apiKey: '', apiSecret: '', address: '' });
                  }}
                  required
                >
                  {WALLET_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              {/* Exchange-specific fields */}
              {isExchangeType && (
                <>
                  <div className="portfolio-info-banner mb-4">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                    <span>Create a <b>read-only</b> API key on Binance → API Management. Never enable trading or withdrawals.</span>
                  </div>
                  <div className="form-group mb-4">
                    <label className="text-size-small text-weight-medium mb-1 d-block">API Key *</label>
                    <input
                      type="text"
                      className="main_form_input w-input"
                      placeholder="Paste your Binance API Key"
                      value={formData.apiKey}
                      onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                      required
                      autoComplete="off"
                    />
                  </div>
                  <div className="form-group mb-4">
                    <label className="text-size-small text-weight-medium mb-1 d-block">API Secret *</label>
                    <input
                      type="password"
                      className="main_form_input w-input"
                      placeholder="Paste your Binance API Secret"
                      value={formData.apiSecret}
                      onChange={(e) => setFormData({ ...formData, apiSecret: e.target.value })}
                      required
                      autoComplete="off"
                    />
                  </div>
                </>
              )}

              {/* On-chain wallet fields */}
              {!isExchangeType && (
                <>
                  <div className="form-group mb-4">
                    <label className="text-size-small text-weight-medium mb-1 d-block">Network</label>
                    <select
                      className="main_form_input w-input"
                      value={formData.network}
                      onChange={(e) => setFormData({ ...formData, network: e.target.value })}
                    >
                      {NETWORK_OPTIONS.map((n) => (
                        <option key={n.value} value={n.value}>{n.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group mb-4">
                    <label className="text-size-small text-weight-medium mb-1 d-block">Public Address *</label>
                    <input
                      type="text"
                      className="main_form_input w-input"
                      placeholder="0x..."
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                      autoComplete="off"
                    />
                  </div>
                </>
              )}

              <div className="form-group mb-4">
                <label className="text-size-small text-weight-medium mb-1 d-block">Label (Optional)</label>
                <input
                  type="text"
                  className="main_form_input w-input"
                  placeholder="e.g. My Trading Account"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                />
              </div>

              <div className="modal-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" className="button is-secondary" onClick={() => setIsAddModalOpen(false)} disabled={submitting}>Cancel</button>
                <button type="submit" className="button" disabled={submitting}>
                  {submitting ? 'Connecting...' : 'Connect Wallet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && selectedWallet && (
        <div className="modal-overlay" onClick={() => !submitting && setIsDeleteModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <div className="modal-header" style={{ borderBottom: 'none' }}>
              <h3 className="text-size-large text-weight-semibold" style={{ color: '#ef5350' }}>Remove Wallet</h3>
              <button className="modal-close" onClick={() => setIsDeleteModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p className="text-size-regular">Remove <b>{selectedWallet.label || selectedWallet.name}</b> from your portfolio?</p>
              <p className="text-size-small text-color-secondary mt-2">This will not affect your actual crypto funds. TradeGuardAI will stop tracking this wallet.</p>
              <div className="modal-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button type="button" className="button is-secondary" onClick={() => setIsDeleteModalOpen(false)} disabled={submitting}>Cancel</button>
                <button type="button" className="button" style={{ backgroundColor: '#ef5350' }} onClick={handleDeleteWallet} disabled={submitting}>
                  {submitting ? 'Removing...' : 'Remove Wallet'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
