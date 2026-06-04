import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Footer } from '../Components/Landing';
import { SEOHead } from '../Components/SEO';
import { PageHeader, Breadcrumb, BackToTop, PageTransition } from '../Components/UI';
import { useScrollAnimation, useStaggerAnimation } from '../hooks/useScrollAnimation';

const AnnouncementsPage = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const headerRef = useScrollAnimation('fadeUp');
  const gridRef = useStaggerAnimation('.announcement-card');

  const categories = ['All', 'Feature', 'Update', 'News', 'Security'];

  // Mock announcement data
  const announcements = [
    {
      id: 1,
      slug: 'introducing-ai-predictions-v2',
      category: 'Feature',
      title: 'Introducing AI Predictions v2.0',
      excerpt: 'Our most advanced prediction engine yet, featuring improved accuracy and new asset support.',
      date: '2026-02-01',
      readTime: '3 min read',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&q=80',
      featured: true,
    },
    {
      id: 2,
      slug: 'security-audit-complete',
      category: 'Security',
      title: 'Annual Security Audit Complete',
      excerpt: 'We\'ve completed our comprehensive security audit with zero critical findings.',
      date: '2026-01-28',
      readTime: '2 min read',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&q=80',
      featured: false,
    },
    {
      id: 3,
      slug: 'new-exchanges-supported',
      category: 'Update',
      title: '5 New Exchanges Now Supported',
      excerpt: 'Connect to Bybit, OKX, Gate.io, MEXC, and Bitget for expanded trading coverage.',
      date: '2026-01-25',
      readTime: '2 min read',
      image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=600&q=80',
      featured: false,
    },
    {
      id: 4,
      slug: 'market-outlook-q1-2026',
      category: 'News',
      title: 'Market Outlook: Q1 2026',
      excerpt: 'Our AI analysis of key trends and potential opportunities for the first quarter.',
      date: '2026-01-20',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80',
      featured: true,
    },
    {
      id: 5,
      slug: 'mobile-app-beta',
      category: 'Feature',
      title: 'Mobile App Beta Now Available',
      excerpt: 'Join our beta program to test the new iOS and Android apps before public launch.',
      date: '2026-01-15',
      readTime: '2 min read',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80',
      featured: false,
    },
    {
      id: 6,
      slug: 'api-v2-released',
      category: 'Update',
      title: 'API v2.0 Released',
      excerpt: 'New endpoints, improved rate limits, and WebSocket support for real-time data.',
      date: '2026-01-10',
      readTime: '4 min read',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80',
      featured: false,
    },
    {
      id: 7,
      slug: 'partnership-binance',
      category: 'News',
      title: 'Strategic Partnership with Binance',
      excerpt: 'We\'re excited to announce our new partnership bringing enhanced features to our users.',
      date: '2026-01-05',
      readTime: '3 min read',
      image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&q=80',
      featured: true,
    },
    {
      id: 8,
      slug: 'year-in-review-2025',
      category: 'News',
      title: '2025 Year in Review',
      excerpt: 'A look back at our achievements, milestones, and the amazing community growth.',
      date: '2025-12-31',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80',
      featured: false,
    },
  ];

  const filteredAnnouncements = activeFilter === 'All'
    ? announcements
    : announcements.filter(a => a.category === activeFilter);

  const featuredAnnouncement = filteredAnnouncements.find(a => a.featured);

  const categoryColors = {
    Feature: 'var(--base-color-brand--color-primary)',
    Update: 'var(--color-green)',
    News: '#7c3aed',
    Security: '#f59e0b',
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <PageTransition>
      <div className="page-wrapper">
        <SEOHead
          title="News & Announcements"
          description="Stay updated with the latest TradeGuard AI features, updates, and cryptocurrency market news."
          canonical="/announcements"
          keywords="tradeguard news, crypto trading updates, AI trading features, platform announcements"
        />
        <Navbar />
        <main className="main-wrapper">
          {/* Hero Section */}
          <PageHeader
            title="News & Announcements"
            description="Stay updated with the latest from TradeGuard AI"
          >
            <Breadcrumb items={[
              { name: 'Home', url: '/' },
              { name: 'Announcements' }
            ]} />
          </PageHeader>

          {/* Filters */}
          <section className="announcements-filter-section" ref={headerRef}>
            <div className="padding-global">
              <div className="container-large">
                <div className="announcements-filters">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`filter-chip ${activeFilter === category ? 'is-active' : ''}`}
                      onClick={() => setActiveFilter(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Featured Announcement */}
          {featuredAnnouncement && activeFilter === 'All' && (
            <section className="announcements-featured-section">
              <div className="padding-global">
                <div className="container-large">
                  <Link to={`/announcements/${featuredAnnouncement.slug}`} className="featured-announcement">
                    <div className="featured-announcement-image">
                      <img src={featuredAnnouncement.image} alt={featuredAnnouncement.title} loading="lazy" />
                      <span 
                        className="announcement-badge"
                        style={{ backgroundColor: categoryColors[featuredAnnouncement.category] }}
                      >
                        {featuredAnnouncement.category}
                      </span>
                    </div>
                    <div className="featured-announcement-content">
                      <span className="featured-label">Featured</span>
                      <h2 className="heading-style-h3">{featuredAnnouncement.title}</h2>
                      <p className="text-color-secondary text-size-medium">{featuredAnnouncement.excerpt}</p>
                      <div className="announcement-meta">
                        <span>{formatDate(featuredAnnouncement.date)}</span>
                        <span>•</span>
                        <span>{featuredAnnouncement.readTime}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* Announcements Grid */}
          <section className="announcements-grid-section">
            <div className="padding-global">
              <div className="container-large">
                <div className="padding-section-medium">
                  <div className="announcements-grid" ref={gridRef}>
                    {filteredAnnouncements.map((announcement) => (
                      <Link
                        key={announcement.id}
                        to={`/announcements/${announcement.slug}`}
                        className="announcement-card stagger-item"
                      >
                        <div className="announcement-card-image">
                          <img src={announcement.image} alt={announcement.title} loading="lazy" />
                          <span 
                            className="announcement-badge"
                            style={{ backgroundColor: categoryColors[announcement.category] }}
                          >
                            {announcement.category}
                          </span>
                        </div>
                        <div className="announcement-card-content">
                          <h3 className="announcement-card-title">{announcement.title}</h3>
                          <p className="announcement-card-excerpt text-color-secondary">{announcement.excerpt}</p>
                          <div className="announcement-card-meta">
                            <span>{formatDate(announcement.date)}</span>
                            <span>•</span>
                            <span>{announcement.readTime}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {filteredAnnouncements.length === 0 && (
                    <div className="announcements-empty text-align-center">
                      <p className="text-color-secondary">No announcements found in this category.</p>
                    </div>
                  )}

                  {/* Load More */}
                  <div className="announcements-load-more">
                    <button className="button is-secondary">Load More</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Newsletter CTA */}
          <section className="announcements-newsletter-section">
            <div className="padding-global">
              <div className="container-medium">
                <div className="newsletter-card">
                  <h3 className="heading-style-h4">Never miss an update</h3>
                  <p className="text-color-secondary">
                    Subscribe to our newsletter for the latest news and feature announcements.
                  </p>
                  <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="newsletter-input"
                    />
                    <button type="submit" className="button">Subscribe</button>
                  </form>
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

export default AnnouncementsPage;
