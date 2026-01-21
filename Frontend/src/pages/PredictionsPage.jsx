import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../Components/Dashboard Pages/Navbar';
import Sidebar from '../Components/Dashboard Pages/Sidebar';

// Coin prediction data
const predictionCoins = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    icon: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    available: true,
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    icon: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    available: false,
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    icon: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
    available: false,
  },
];

// Placeholder prediction data for Bitcoin
const bitcoinPrediction = {
  currentPrice: '$104,532.18',
  aiConfidence: 87,
  recommendation: 'Open Long Position',
  recommendationType: 'long', // 'long' | 'short' | 'hold'
  steps: {
    orderType: 'Limit Order',
    buyPrice: '$103,850.00',
    takeProfit: '$108,200.00',
    stopLoss: '$101,500.00',
  },
  reason: 'High probability dip detected based on RSI divergence and volume analysis. Valid for next 1 hour.',
  nextScanAt: '14:30:00 UTC',
  lastUpdated: 'January 20, 2026 at 13:30 UTC',
};

export default function PredictionsPage() {
  const { member } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(null);

  // Initialize selected coin from URL parameter
  useEffect(() => {
    const coinId = params.coinId;
    if (coinId) {
      const coin = predictionCoins.find(c => c.id === coinId);
      if (coin && coin.available) {
        setSelectedCoin(coin);
      } else {
        // If coin not found or not available, redirect to predictions home
        navigate('/predictions', { replace: true });
      }
    } else {
      setSelectedCoin(null);
    }
  }, [params.coinId, navigate]);

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCoinSelect = (coin) => {
    if (coin.available) {
      navigate(`/predictions/${coin.id}`);
    }
  };

  const handleBackToSelection = () => {
    navigate('/predictions');
  };

  const handleSidebarNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="page-wrapper">
      <div className="main-wrapper is-dashboard">
        <Sidebar isOpen={isSidebarOpen} onNavigate={handleSidebarNavigate} activePage="predictions" />
        <div className="dashboard_main_wrapper">
          <Navbar onMenuToggle={handleMenuToggle} isSidebarOpen={isSidebarOpen} />
          <div className="dashboard_main_app">
            {/* Page Header */}
            <div>
              <h1 className="text-size-xlarge text-weight-semibold" style={{ marginBottom: '0.5rem' }}>
                AI Predictions
              </h1>
              <p className="text-size-regular text-color-secondary">
                AI-powered price predictions and trading recommendations
              </p>
            </div>

            {!selectedCoin ? (
              /* Coin Selection View */
              <>
                {/* Coin Selection Cards */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '1.25rem',
                  }}
                >
                  {predictionCoins.map((coin) => (
                    <div
                      key={coin.id}
                      onClick={() => handleCoinSelect(coin)}
                      className="card_app_wrapper"
                      style={{
                        padding: '1.5rem',
                        cursor: coin.available ? 'pointer' : 'not-allowed',
                        opacity: coin.available ? 1 : 0.5,
                        position: 'relative',
                        transition: 'all 0.2s ease',
                        border: coin.available 
                          ? '1px solid var(--border-color--border-primary)' 
                          : '1px solid var(--border-color--border-primary)',
                      }}
                      onMouseEnter={(e) => {
                        if (coin.available) {
                          e.currentTarget.style.borderColor = 'var(--base-color-brand--color-primary)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(30, 101, 250, 0.15)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-color--border-primary)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {/* Coming Soon Badge */}
                      {!coin.available && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '0.75rem',
                            right: '0.75rem',
                            backgroundColor: 'var(--text-color--text-secondary)',
                            color: 'white',
                            fontSize: '0.7rem',
                            fontWeight: '600',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}
                        >
                          Coming Soon
                        </div>
                      )}

                      {/* Coin Icon & Name */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          marginBottom: '1rem',
                        }}
                      >
                        <img
                          src={coin.icon}
                          alt={coin.name}
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                          }}
                        />
                        <div>
                          <div className="text-size-large text-weight-semibold">
                            {coin.name}
                          </div>
                          <div className="text-size-small text-color-secondary">
                            {coin.symbol}
                          </div>
                        </div>
                      </div>

                      {/* Status */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: coin.available 
                              ? 'var(--color-green)' 
                              : 'var(--text-color--text-secondary)',
                          }}
                        />
                        <span className="text-size-small text-color-secondary">
                          {coin.available ? 'AI Model Active' : 'Model Training'}
                        </span>
                      </div>

                      {/* Click to View */}
                      {coin.available && (
                        <div
                          style={{
                            marginTop: '1rem',
                            paddingTop: '1rem',
                            borderTop: '1px solid var(--border-color--border-primary)',
                          }}
                        >
                          <span 
                            className="text-size-small text-weight-medium"
                            style={{ color: 'var(--base-color-brand--color-primary)' }}
                          >
                            Click to view prediction →
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Info Card */}
                <div 
                  className="card_app_wrapper"
                  style={{ 
                    padding: '1.5rem',
                    backgroundColor: 'var(--background-grey)',
                    border: 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--base-color-brand--color-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-size-medium text-weight-semibold" style={{ marginBottom: '0.5rem' }}>
                        How AI Predictions Work
                      </div>
                      <p className="text-size-regular text-color-secondary" style={{ lineHeight: '1.6' }}>
                        Our AI model analyzes real-time market data, technical indicators, and historical patterns 
                        to generate trading recommendations. Predictions are updated every hour and include 
                        confidence levels, entry points, and risk management parameters.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Prediction Detail View */
              <>
                {/* Back Button */}
                <div>
                  <button
                    onClick={handleBackToSelection}
                    className="button is-small is-icon"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Back to Predictions
                  </button>
                </div>

                {/* Main Content Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1.25rem',
                  }}
                >
                  {/* Left Column - Price & Confidence */}
                  <div className="card_app_wrapper">
                    {/* Header */}
                    <div className="card_app_header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={selectedCoin.icon}
                          alt={selectedCoin.name}
                          style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                        />
                        <div>
                          <div className="text-size-medium text-weight-semibold">
                            {selectedCoin.name} Prediction
                          </div>
                          <div className="text-size-small text-color-secondary">
                            {selectedCoin.symbol}/USDT
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Body */}
                    <div style={{ padding: '1.25rem' }}>
                      {/* Current Price */}
                      <div style={{ marginBottom: '1.5rem' }}>
                        <div className="text-size-small text-color-secondary" style={{ marginBottom: '0.25rem' }}>
                          Current Price
                        </div>
                        <div 
                          className="text-weight-bold"
                          style={{ fontSize: '2.25rem', lineHeight: 1 }}
                        >
                          {bitcoinPrediction.currentPrice}
                        </div>
                      </div>

                      {/* AI Confidence */}
                      <div>
                        <div className="text-size-small text-color-secondary" style={{ marginBottom: '0.5rem' }}>
                          AI Confidence
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          {/* Progress Bar */}
                          <div
                            style={{
                              flex: 1,
                              height: '8px',
                              backgroundColor: '#e5e5e7',
                              borderRadius: '4px',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                width: `${bitcoinPrediction.aiConfidence}%`,
                                height: '100%',
                                backgroundColor: 'var(--color-green)',
                                borderRadius: '4px',
                                transition: 'width 0.3s ease',
                              }}
                            />
                          </div>
                          {/* Percentage */}
                          <span 
                            className="text-size-large text-weight-semibold"
                            style={{ color: 'var(--color-green)' }}
                          >
                            {bitcoinPrediction.aiConfidence}%
                          </span>
                        </div>
                      </div>

                      {/* Last Updated */}
                      <div 
                        style={{ 
                          marginTop: '1.5rem', 
                          paddingTop: '1rem', 
                          borderTop: '1px solid var(--border-color--border-primary)' 
                        }}
                      >
                        <div className="text-size-tiny text-color-secondary">
                          Last updated: {bitcoinPrediction.lastUpdated}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Recommendation */}
                  <div className="card_app_wrapper">
                    {/* Header */}
                    <div 
                      className="card_app_header"
                      style={{
                        backgroundColor: bitcoinPrediction.recommendationType === 'long' 
                          ? 'rgba(38, 166, 154, 0.08)' 
                          : bitcoinPrediction.recommendationType === 'short'
                          ? 'rgba(239, 83, 80, 0.08)'
                          : 'transparent',
                      }}
                    >
                      <div className="text-size-small text-color-secondary" style={{ marginBottom: '0.25rem' }}>
                        Recommendation
                      </div>
                      <div 
                        className="text-size-xlarge text-weight-bold"
                        style={{ 
                          color: bitcoinPrediction.recommendationType === 'long' 
                            ? 'var(--color-green)' 
                            : bitcoinPrediction.recommendationType === 'short'
                            ? 'var(--color-red)'
                            : 'var(--text-color--text-primary)',
                        }}
                      >
                        {bitcoinPrediction.recommendation}
                      </div>
                    </div>

                    {/* Body */}
                    <div style={{ padding: '1.25rem' }}>
                      {/* Steps */}
                      <div style={{ marginBottom: '1.5rem' }}>
                        <div 
                          className="text-size-small text-weight-semibold" 
                          style={{ 
                            marginBottom: '1rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            color: 'var(--text-color--text-secondary)',
                          }}
                        >
                          Trading Steps
                        </div>

                        {/* Step Items */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {/* Order Type */}
                          <div 
                            style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '0.75rem',
                              backgroundColor: 'var(--background-grey)',
                              borderRadius: '0.5rem',
                            }}
                          >
                            <span className="text-size-regular text-color-secondary">Select order type:</span>
                            <span className="text-size-regular text-weight-medium">
                              {bitcoinPrediction.steps.orderType}
                            </span>
                          </div>

                          {/* Buy Price */}
                          <div 
                            style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '0.75rem',
                              backgroundColor: 'var(--background-grey)',
                              borderRadius: '0.5rem',
                            }}
                          >
                            <span className="text-size-regular text-color-secondary">Set buy price:</span>
                            <span className="text-size-regular text-weight-medium" style={{ color: 'var(--color-green)' }}>
                              {bitcoinPrediction.steps.buyPrice}
                            </span>
                          </div>

                          {/* Take Profit */}
                          <div 
                            style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '0.75rem',
                              backgroundColor: 'var(--background-grey)',
                              borderRadius: '0.5rem',
                            }}
                          >
                            <span className="text-size-regular text-color-secondary">Set take profit:</span>
                            <span className="text-size-regular text-weight-medium" style={{ color: 'var(--color-green)' }}>
                              {bitcoinPrediction.steps.takeProfit}
                            </span>
                          </div>

                          {/* Stop Loss */}
                          <div 
                            style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '0.75rem',
                              backgroundColor: 'var(--background-grey)',
                              borderRadius: '0.5rem',
                            }}
                          >
                            <span className="text-size-regular text-color-secondary">Set stop loss:</span>
                            <span className="text-size-regular text-weight-medium" style={{ color: 'var(--color-red)' }}>
                              {bitcoinPrediction.steps.stopLoss}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Reason */}
                      <div 
                        style={{ 
                          padding: '1rem',
                          backgroundColor: 'rgba(30, 101, 250, 0.05)',
                          borderRadius: '0.5rem',
                          borderLeft: '3px solid var(--base-color-brand--color-primary)',
                        }}
                      >
                        <div 
                          className="text-size-small text-weight-semibold" 
                          style={{ marginBottom: '0.5rem' }}
                        >
                          Reason
                        </div>
                        <p className="text-size-regular text-color-secondary" style={{ lineHeight: 1.5 }}>
                          {bitcoinPrediction.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next Scan Card */}
                <div 
                  className="card_app_wrapper"
                  style={{ 
                    padding: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(30, 101, 250, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 6V12L16 14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="var(--base-color-brand--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-size-small text-color-secondary">
                        Next AI Scan
                      </div>
                      <div className="text-size-medium text-weight-semibold">
                        {bitcoinPrediction.nextScanAt}
                      </div>
                    </div>
                  </div>

                  <button className="button is-secondary is-small">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.5rem' }}>
                      <path d="M1 4V10H7M23 20V14H17M20.49 9C19.9828 7.56678 19.1209 6.28535 17.9845 5.27557C16.8482 4.26579 15.4745 3.56141 13.9917 3.22617C12.509 2.89093 10.9652 2.93574 9.50481 3.35651C8.04437 3.77728 6.71475 4.56074 5.64 5.64L1 10M23 14L18.36 18.36C17.2853 19.4393 15.9556 20.2227 14.4952 20.6435C13.0348 21.0643 11.491 21.1091 10.0083 20.7738C8.52547 20.4386 7.1518 19.7342 6.01547 18.7244C4.87913 17.7146 4.01717 16.4332 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Refresh Prediction
                  </button>
                </div>

                {/* Disclaimer */}
                <div 
                  style={{ 
                    padding: '1rem',
                    backgroundColor: 'rgba(239, 83, 80, 0.05)',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(239, 83, 80, 0.2)',
                  }}
                >
                  <p className="text-size-small text-color-secondary" style={{ lineHeight: 1.5 }}>
                    <strong>⚠️ Disclaimer:</strong> AI predictions are for informational purposes only and 
                    do not constitute financial advice. Always conduct your own research and consider your 
                    risk tolerance before making trading decisions. Past performance does not guarantee future results.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
