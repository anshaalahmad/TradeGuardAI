import React, { useState } from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const CTABanner = () => {
  const [email, setEmail] = useState('');
  const sectionRef = useScrollAnimation('scaleFadeIn');

  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.href = `/signup?email=${encodeURIComponent(email)}`;
  };

  return (
    <section className="cta-section" ref={sectionRef}>
      {/* Animated background orbs */}
      <div className="cta-bg" aria-hidden="true">
        <div className="cta-orb cta-orb-1"></div>
        <div className="cta-orb cta-orb-2"></div>
      </div>

      <div className="padding-global">
        <div className="container-large">
          <div className="cta-content">
            <h2 className="cta-title">
              Start Trading Smarter Today
            </h2>
            <p className="cta-desc">
              Join thousands of traders using AI-powered insights to make better decisions.
              Get started for free — no credit card required.
            </p>

            <form className="cta-pill-form" onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="cta-pill-input"
                required
              />
              <button type="submit" className="cta-pill-btn">
                Get Started
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </form>

            <div className="cta-trust-row">
              <div className="cta-trust-chip">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
                Bank-level security
              </div>
              <div className="cta-trust-chip">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                24/7 Support
              </div>
              <div className="cta-trust-chip">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                </svg>
                10K+ Active Users
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
