import React from 'react';
import { useScrollAnimation, useStaggerAnimation } from '../../hooks/useScrollAnimation';

const Testimonials = () => {
  const titleRef = useScrollAnimation('fadeUp');
  const gridRef = useStaggerAnimation('.testi-card');

  const testimonials = [
    {
      id: 1,
      name: 'Marcus Chen',
      role: 'Day Trader',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      quote: 'TradeGuard AI has completely transformed my trading strategy. The AI predictions are incredibly accurate, and I\'ve seen a 40% improvement in my win rate.',
      rating: 5,
    },
    {
      id: 2,
      name: 'Sarah Mitchell',
      role: 'Crypto Investor',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
      quote: 'The real-time alerts have saved me countless times. I can finally sleep without worrying about missing important market moves.',
      rating: 5,
    },
    {
      id: 3,
      name: 'David Rodriguez',
      role: 'Portfolio Manager',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      quote: 'As someone managing multiple portfolios, the analytics dashboard gives me everything I need at a glance. Worth every penny.',
      rating: 5,
    },
    {
      id: 4,
      name: 'Emily Thompson',
      role: 'Swing Trader',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      quote: 'I was skeptical about AI trading tools, but TradeGuard proved me wrong. The pattern recognition is spot-on and has boosted my confidence.',
      rating: 5,
    },
    {
      id: 5,
      name: 'James Wilson',
      role: 'Technical Analyst',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      quote: 'The chart patterns detection feature alone is worth the subscription. It catches things I would have missed.',
      rating: 5,
    },
    {
      id: 6,
      name: 'Lisa Park',
      role: 'Crypto Enthusiast',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      quote: 'Finally, a platform that makes crypto trading accessible for beginners while still being powerful enough for pros.',
      rating: 5,
    },
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill={i < rating ? '#f59e0b' : 'none'}
        stroke={i < rating ? '#f59e0b' : '#d1d5db'}
        strokeWidth="2"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ));
  };

  return (
    <section className="testi-section">
      <div className="testi-bg-glow" aria-hidden="true"></div>
      <div className="padding-global">
        <div className="container-large">
          <div className="padding-section-medium">
            {/* Header */}
            <div className="testi-header" ref={titleRef}>
              <div className="section-tag">Testimonials</div>
              <h2 className="heading-style-h2 text-align-center">
                Loved by traders worldwide
              </h2>
              <p className="text-size-large text-color-secondary text-align-center" style={{ maxWidth: '580px', margin: '0 auto' }}>
                See what our community says about TradeGuard AI
              </p>
            </div>

            {/* Masonry Grid */}
            <div className="testi-masonry" ref={gridRef}>
              {testimonials.map((t) => (
                <div key={t.id} className="testi-card stagger-item">
                  <div className="testi-card-quote-mark" aria-hidden="true">"</div>
                  <div className="testi-stars">
                    {renderStars(t.rating)}
                  </div>
                  <blockquote className="testi-quote">
                    {t.quote}
                  </blockquote>
                  <div className="testi-author">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="testi-avatar"
                      loading="lazy"
                    />
                    <div>
                      <div className="testi-name">{t.name}</div>
                      <div className="testi-role">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
