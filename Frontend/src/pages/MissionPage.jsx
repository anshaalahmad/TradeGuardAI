import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Footer } from '../Components/Landing';
import { SEOHead } from '../Components/SEO';
import { PageHeader, Breadcrumb, BackToTop, PageTransition } from '../Components/UI';
import { useScrollAnimation, useStaggerAnimation, useCountUp } from '../hooks/useScrollAnimation';

const MissionPage = () => {
  const visionRef = useScrollAnimation('fadeUp');
  const pillarsRef = useStaggerAnimation('.sp-pillar-card');

  const pillars = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
      title: 'Security',
      description: 'We build trust through unwavering commitment to protecting our users\' data and assets.',
      points: ['End-to-end encryption', 'SOC 2 compliance', 'Regular security audits', 'No access to trading funds'],
      color: '#3b82f6',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ),
      title: 'Intelligence',
      description: 'Our AI models are trained on billions of data points for the most accurate analysis.',
      points: ['Real-time analysis', 'Pattern recognition', 'Sentiment analysis', 'Predictive modeling'],
      color: '#f59e0b',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
      title: 'Accessibility',
      description: 'Professional-grade trading tools should be available to everyone.',
      points: ['Free tier available', 'Intuitive interface', 'Educational resources', 'Multi-language support'],
      color: '#10b981',
    },
  ];

  const impactStats = [
    { value: 2, suffix: 'B+', label: 'Data Points Processed Daily' },
    { value: 85, suffix: '%', label: 'Prediction Accuracy' },
    { value: 50, suffix: '+', label: 'Countries Served' },
    { value: 1, suffix: 'M+', label: 'Alerts Sent Monthly' },
  ];

  const commitments = [
    { title: 'Transparency', desc: 'We\'re always upfront about our capabilities and limitations. AI is powerful, but it\'s not infallible.' },
    { title: 'Education', desc: 'We provide comprehensive resources to help you understand both our tools and the markets.' },
    { title: 'Support', desc: 'Our team is here to help you succeed, with 24/7 support and regular updates.' },
    { title: 'Innovation', desc: 'We continuously improve our AI models and features based on user feedback and market changes.' },
  ];

  return (
    <PageTransition>
      <div className="page-wrapper">
        <SEOHead
          title="Our Mission"
          description="Empowering traders worldwide with accessible AI-driven insights. Discover our vision for the future of intelligent cryptocurrency trading."
          canonical="/mission"
          keywords="tradeguard mission, crypto trading vision, AI trading goals, trading platform mission"
        />
        <Navbar />
        <main className="main-wrapper">
          <PageHeader
            title="Our Mission"
            description="Democratizing access to intelligent trading tools for every trader, everywhere."
          >
            <Breadcrumb items={[
              { name: 'Home', url: '/' },
              { name: 'Mission' }
            ]} />
          </PageHeader>

          {/* Vision Statement */}
          <section className="sp-section">
            <div className="padding-global">
              <div className="container-large">
                <div className="padding-section-medium">
                  <div className="sp-two-col" ref={visionRef}>
                    <div className="sp-two-col-text">
                      <div className="section-tag">Our Vision</div>
                      <h2 className="heading-style-h2">
                        A world where every trader has access to institutional-quality tools
                      </h2>
                      <p className="text-size-medium text-color-secondary" style={{ lineHeight: 1.7 }}>
                        We envision a future where sophisticated AI analysis isn't a privilege reserved for
                        hedge funds. At TradeGuard AI, we're building technology that empowers individuals
                        to make informed trading decisions with the same level of insight previously only
                        available to the financial elite.
                      </p>
                      <p className="text-size-medium text-color-secondary" style={{ lineHeight: 1.7 }}>
                        Our commitment goes beyond just providing tools—we're fostering a community of
                        educated, empowered traders who understand both the opportunities and risks.
                      </p>
                    </div>
                    <div className="sp-two-col-quote">
                      <blockquote className="sp-blockquote">
                        <p>"The future of trading is intelligent, accessible, and democratized. We're building that future today."</p>
                        <cite>— TradeGuard AI Team</cite>
                      </blockquote>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Three Pillars */}
          <section className="sp-section sp-section--alt">
            <div className="padding-global">
              <div className="container-large">
                <div className="padding-section-medium">
                  <div className="sp-section-header">
                    <div className="section-tag">Our Foundation</div>
                    <h2 className="heading-style-h2">The three pillars of TradeGuard AI</h2>
                    <p className="text-size-large text-color-secondary" style={{ maxWidth: '580px', margin: '0 auto' }}>
                      Everything we build is guided by these core principles
                    </p>
                  </div>
                  <div className="sp-card-grid sp-card-grid--3" ref={pillarsRef}>
                    {pillars.map((pillar, index) => (
                      <div key={index} className="sp-pillar-card stagger-item">
                        <div className="sp-pillar-icon" style={{ background: `${pillar.color}12`, color: pillar.color }}>
                          {pillar.icon}
                        </div>
                        <h3 className="sp-card-title">{pillar.title}</h3>
                        <p className="sp-card-desc text-color-secondary">{pillar.description}</p>
                        <ul className="sp-check-list">
                          {pillar.points.map((point, i) => (
                            <li key={i}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--base-color-brand--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6L9 17l-5-5" />
                              </svg>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Impact Stats */}
          <section className="sp-section">
            <div className="padding-global">
              <div className="container-large">
                <div className="padding-section-medium">
                  <div className="sp-section-header">
                    <div className="section-tag">Our Impact</div>
                    <h2 className="heading-style-h2">Making a difference, one trade at a time</h2>
                  </div>
                  <div className="sp-stats-row">
                    {impactStats.map((stat, index) => (
                      <ImpactStatCard key={index} {...stat} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Commitment */}
          <section className="sp-section sp-section--alt">
            <div className="padding-global">
              <div className="container-large">
                <div className="padding-section-medium">
                  <div className="sp-section-header">
                    <h2 className="heading-style-h2">Our Commitment to You</h2>
                  </div>
                  <div className="sp-card-grid sp-card-grid--2">
                    {commitments.map((item, index) => (
                      <div key={index} className="sp-commit-card">
                        <h4 className="sp-card-title">{item.title}</h4>
                        <p className="sp-card-desc text-color-secondary">{item.desc}</p>
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
                  <h2 className="heading-style-h2">Join us in shaping the future of trading</h2>
                  <p className="text-size-large text-color-secondary" style={{ maxWidth: '560px', margin: '0 auto 2rem' }}>
                    Whether you're a seasoned trader or just starting out, we're here to help you succeed.
                  </p>
                  <div className="sp-cta-btns">
                    <Link to="/signup" className="button">Start Trading Smarter</Link>
                    <Link to="/about" className="button is-secondary">Learn More About Us</Link>
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

const ImpactStatCard = ({ value, suffix, label }) => {
  const countRef = useCountUp(value, suffix);
  return (
    <div className="sp-stat-card">
      <div className="sp-stat-value" ref={countRef}>0{suffix}</div>
      <div className="sp-stat-label">{label}</div>
    </div>
  );
};

export default MissionPage;
