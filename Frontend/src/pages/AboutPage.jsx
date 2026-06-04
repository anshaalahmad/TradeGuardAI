import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Footer } from '../Components/Landing';
import { SEOHead } from '../Components/SEO';
import { PageHeader, Breadcrumb, BackToTop, PageTransition } from '../Components/UI';
import { useScrollAnimation, useStaggerAnimation, useCountUp } from '../hooks/useScrollAnimation';

const AboutPage = () => {
  const storyRef = useScrollAnimation('fadeUp');
  const valuesRef = useStaggerAnimation('.sp-value-card');
  const timelineRef = useStaggerAnimation('.sp-tl-item');

  const values = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      title: 'Security First',
      description: 'Your data and assets are protected with bank-level encryption and security protocols.',
      color: '#3b82f6',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
      title: 'Real-Time Insights',
      description: 'Instant market analysis and predictions powered by cutting-edge AI technology.',
      color: '#10b981',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
      title: 'Community Driven',
      description: 'Join a thriving community of traders sharing insights and strategies.',
      color: '#8b5cf6',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
      title: 'Continuous Innovation',
      description: 'We constantly improve our AI models and features based on market evolution.',
      color: '#f59e0b',
    },
  ];

  const timeline = [
    { year: '2024', title: 'Founded', description: 'TradeGuard AI was born with a vision to democratize crypto trading.' },
    { year: '2024', title: 'Beta Launch', description: 'Released beta version to 1,000 early adopters.' },
    { year: '2025', title: '10K Users', description: 'Reached 10,000 active traders milestone.' },
    { year: '2026', title: 'Global Expansion', description: 'Expanded to support 50+ countries and 25+ exchanges.' },
  ];

  return (
    <PageTransition>
      <div className="page-wrapper">
        <SEOHead
          title="About Us"
          description="Learn about TradeGuard AI's journey to democratize crypto trading with cutting-edge AI technology and real-time market intelligence."
          canonical="/about"
          keywords="about tradeguard, crypto trading company, AI trading platform, trading technology"
        />
        <Navbar />
        <main className="main-wrapper">
          <PageHeader
            title="About TradeGuard AI"
            description="Empowering traders with AI-driven insights for smarter cryptocurrency trading decisions."
          >
            <Breadcrumb items={[
              { name: 'Home', url: '/' },
              { name: 'About' }
            ]} />
          </PageHeader>

          {/* Our Story */}
          <section className="sp-section">
            <div className="padding-global">
              <div className="container-large">
                <div className="padding-section-medium">
                  <div className="sp-two-col" ref={storyRef}>
                    <div className="sp-two-col-text">
                      <div className="section-tag">Our Story</div>
                      <h2 className="heading-style-h2">Building the future of intelligent trading</h2>
                      <p className="text-size-medium text-color-secondary" style={{ lineHeight: 1.7 }}>
                        TradeGuard AI was founded by a team of traders, data scientists, and engineers
                        who believed that everyone deserves access to professional-grade trading tools.
                      </p>
                      <p className="text-size-medium text-color-secondary" style={{ lineHeight: 1.7 }}>
                        We saw how institutional traders had access to sophisticated AI tools while
                        retail traders were left with basic charting software. Our mission became clear:
                        level the playing field by bringing institutional-quality AI to every trader.
                      </p>
                      <p className="text-size-medium text-color-secondary" style={{ lineHeight: 1.7 }}>
                        Today, TradeGuard AI serves thousands of traders worldwide, processing millions
                        of data points every second to deliver actionable insights.
                      </p>
                    </div>
                    <div className="sp-two-col-media">
                      <img
                        src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
                        alt="Trading dashboard analytics"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="sp-section sp-section--alt">
            <div className="padding-global">
              <div className="container-large">
                <div className="sp-stats-row">
                  <StatCard value={10000} suffix="+" label="Active Traders" />
                  <StatCard value={500} suffix="M+" label="Trades Analyzed" />
                  <StatCard value={25} suffix="+" label="Exchanges Supported" />
                  <StatCard value={99.9} suffix="%" label="Uptime" />
                </div>
              </div>
            </div>
          </section>

          {/* Core Values */}
          <section className="sp-section">
            <div className="padding-global">
              <div className="container-large">
                <div className="padding-section-medium">
                  <div className="sp-section-header">
                    <div className="section-tag">Our Values</div>
                    <h2 className="heading-style-h2">What drives us forward</h2>
                    <p className="text-size-large text-color-secondary" style={{ maxWidth: '580px', margin: '0 auto' }}>
                      Our core values shape everything we do, from product development to customer support.
                    </p>
                  </div>
                  <div className="sp-card-grid sp-card-grid--2" ref={valuesRef}>
                    {values.map((value, index) => (
                      <div key={index} className="sp-value-card stagger-item">
                        <div className="sp-value-icon" style={{ background: `${value.color}12`, color: value.color }}>
                          {value.icon}
                        </div>
                        <h3 className="sp-card-title">{value.title}</h3>
                        <p className="sp-card-desc text-color-secondary">{value.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section className="sp-section sp-section--alt">
            <div className="padding-global">
              <div className="container-large">
                <div className="padding-section-medium">
                  <div className="sp-section-header">
                    <div className="section-tag">Our Journey</div>
                    <h2 className="heading-style-h2">Milestones along the way</h2>
                  </div>
                  <div className="sp-timeline" ref={timelineRef}>
                    {timeline.map((item, index) => (
                      <div key={index} className="sp-tl-item stagger-item">
                        <div className="sp-tl-marker">
                          <div className="sp-tl-dot" />
                          {index < timeline.length - 1 && <div className="sp-tl-line" />}
                        </div>
                        <div className="sp-tl-content">
                          <span className="sp-tl-year">{item.year}</span>
                          <h3 className="sp-card-title">{item.title}</h3>
                          <p className="text-color-secondary" style={{ fontSize: '0.9375rem', lineHeight: 1.6 }}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="sp-section">
            <div className="padding-global">
              <div className="container-large">
                <div className="sp-cta-block">
                  <h2 className="heading-style-h2">Ready to join our community?</h2>
                  <p className="text-size-large text-color-secondary" style={{ maxWidth: '520px', margin: '0 auto 2rem' }}>
                    Start your journey with TradeGuard AI today and trade smarter.
                  </p>
                  <div className="sp-cta-btns">
                    <Link to="/signup" className="button">Get Started Free</Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <Footer />
        </main>
        <BackToTop />
      </div>
    </PageTransition>
  );
};

const StatCard = ({ value, suffix, label }) => {
  const countRef = useCountUp(value, suffix);
  return (
    <div className="sp-stat-card">
      <div className="sp-stat-value" ref={countRef}>0{suffix}</div>
      <div className="sp-stat-label">{label}</div>
    </div>
  );
};

export default AboutPage;
