import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation, useStaggerAnimation, useCountUp } from '../../hooks/useScrollAnimation';

const HowItWorks = () => {
  const titleRef = useScrollAnimation('fadeUp');
  const stepsRef = useStaggerAnimation('.step-card');

  const steps = [
    {
      number: '01',
      title: 'Connect',
      description: 'Link your exchange accounts securely. We support Binance, Coinbase, Kraken, and 20+ major exchanges.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
        </svg>
      ),
    },
    {
      number: '02',
      title: 'Analyze',
      description: 'Our AI scans real-time market data, identifies patterns, and generates actionable trading insights.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      ),
    },
    {
      number: '03',
      title: 'Trade Smarter',
      description: 'Receive intelligent alerts, predictions, and recommendations to make informed trading decisions.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20V10"/>
          <path d="M18 20V4"/>
          <path d="M6 20v-4"/>
        </svg>
      ),
    },
  ];

  const stats = [
    { value: 10000, suffix: '+', label: 'Active Traders' },
    { value: 98, suffix: '%', label: 'Uptime' },
    { value: 500, suffix: 'M+', label: 'Trades Analyzed' },
    { value: 24, suffix: '/7', label: 'Support' },
  ];

  return (
    <section className="hiw-section">
      <div className="padding-global">
        <div className="container-large">
          <div className="padding-section-medium">
            {/* Header */}
            <div className="hiw-header" ref={titleRef}>
              <div className="section-tag">How It Works</div>
              <h2 className="heading-style-h2 text-align-center">
                Start trading in 3 simple steps
              </h2>
              <p className="text-size-large text-color-secondary text-align-center" style={{ maxWidth: '640px', margin: '0 auto' }}>
                Our platform makes it easy to leverage AI-powered insights for smarter cryptocurrency trading
              </p>
            </div>

            {/* Steps */}
            <div className="hiw-steps-grid" ref={stepsRef}>
              {/* Connector line behind the cards */}
              <div className="hiw-connector" aria-hidden="true"></div>

              {steps.map((step, index) => (
                <div key={index} className="step-card stagger-item">
                  <div className="step-card-head">
                    <div className="step-number-badge">{step.number}</div>
                    <div className="step-icon-circle">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="step-card-title">{step.title}</h3>
                  <p className="step-card-desc text-color-secondary">{step.description}</p>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="hiw-stats-row">
              {stats.map((stat, index) => (
                <StatItem key={index} {...stat} />
              ))}
            </div>

            {/* CTA */}
            <div className="hiw-cta">
              <Link to="/signup" className="button">
                Get Started Free
              </Link>
              <Link to="/pricing" className="button is-secondary">
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const StatItem = ({ value, suffix = '', label }) => {
  const countRef = useCountUp(value, suffix);

  return (
    <div className="hiw-stat-item">
      <div className="hiw-stat-value" ref={countRef}>0{suffix}</div>
      <div className="hiw-stat-label">{label}</div>
    </div>
  );
};

export default HowItWorks;
