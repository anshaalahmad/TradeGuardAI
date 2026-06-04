import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation, useStaggerAnimation } from '../../hooks/useScrollAnimation';

const Features = () => {
  const titleRef = useScrollAnimation('fadeUp');
  const gridRef = useStaggerAnimation('.feature-card');

  const features = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a8 8 0 018 8c0 5.33-8 12-8 12S4 15.33 4 10a8 8 0 018-8z"/>
          <circle cx="12" cy="10" r="3"/>
          <path d="M7 20h10"/>
        </svg>
      ),
      title: 'AI-Powered Predictions',
      description: 'Advanced deep learning models analyze market patterns and deliver instant Bullish or Bearish signals with confidence scores.',
      color: '#3b82f6',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      ),
      title: 'Real-Time Market Data',
      description: 'Live price updates, order books, and market trades from Binance. Track thousands of cryptos with lightning-fast data feeds.',
      color: '#10b981',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
          <line x1="8" y1="21" x2="16" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
          <polyline points="6 10 10 7 14 12 18 8"/>
        </svg>
      ),
      title: 'Advanced Charting',
      description: 'Professional-grade candlestick charts, technical indicators, and customizable timeframes for comprehensive analysis.',
      color: '#8b5cf6',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 01-3.46 0"/>
          <path d="M2 8c0-3.31 2.69-6 6-6"/>
          <path d="M22 8c0-3.31-2.69-6-6-6"/>
        </svg>
      ),
      title: 'Smart Alerts',
      description: 'Get notified instantly when the market moves. Custom price alerts, pattern detection triggers, and AI-driven notifications.',
      color: '#f59e0b',
    },
  ];

  return (
    <section className="features-section">
      <div className="padding-global">
        <div className="container-large">
          <div className="padding-section-medium">
            {/* Header */}
            <div className="features-header" ref={titleRef}>
              <div className="section-tag">Features</div>
              <h2 className="heading-style-h2 text-align-center">
                Why Traders Choose TradeGuard AI
              </h2>
              <p className="text-size-large text-color-secondary text-align-center" style={{ maxWidth: '640px', margin: '0 auto' }}>
                Powered by cutting-edge deep learning models, we deliver the competitive edge you need in cryptocurrency trading.
              </p>
            </div>

            {/* Grid */}
            <div className="features-grid" ref={gridRef}>
              {features.map((feature, index) => (
                <div key={index} className="feature-card stagger-item">
                  <div
                    className="feature-icon-box"
                    style={{ background: `${feature.color}12`, color: feature.color }}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="feature-card-title">{feature.title}</h3>
                  <p className="feature-card-desc text-color-secondary">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="features-cta">
              <Link to="/features" className="button w-button">
                See all features
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
