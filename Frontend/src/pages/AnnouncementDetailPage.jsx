import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../Components/Landing';
import { SEOHead, generateArticleSchema } from '../Components/SEO';
import { Breadcrumb, BackToTop, PageTransition } from '../Components/UI';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const AnnouncementDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const contentRef = useScrollAnimation('fadeUp');

  // Mock data - in real app, fetch based on slug
  const announcementData = {
    'introducing-ai-predictions-v2': {
      title: 'Introducing AI Predictions v2.0',
      category: 'Feature',
      date: '2026-02-01',
      readTime: '3 min read',
      author: 'TradeGuard AI Team',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=80',
      content: `
        <p>We're thrilled to announce the launch of AI Predictions v2.0, our most advanced prediction engine yet. This update represents months of research, development, and testing to bring you the most accurate market insights possible.</p>
        
        <h2>What's New</h2>
        
        <h3>Enhanced Accuracy</h3>
        <p>Our new machine learning models have been trained on 50% more data points, resulting in a significant improvement in prediction accuracy. In backtesting, v2.0 shows an average improvement of 12% in prediction accuracy across all supported assets.</p>
        
        <h3>Expanded Asset Support</h3>
        <p>We've added support for 100+ new cryptocurrency pairs, including:</p>
        <ul>
          <li>Major DeFi tokens (UNI, AAVE, COMP, etc.)</li>
          <li>Layer 2 tokens (MATIC, ARB, OP)</li>
          <li>New trending assets based on community requests</li>
        </ul>
        
        <h3>Faster Processing</h3>
        <p>Infrastructure improvements mean predictions are now generated 3x faster. Real-time analysis updates more frequently, giving you the most current insights.</p>
        
        <h2>How to Access</h2>
        <p>AI Predictions v2.0 is automatically available to all PRO and API Plan subscribers. Simply navigate to the Predictions page to start using the enhanced features.</p>
        
        <p>Free tier users can upgrade to PRO to unlock AI Predictions and all other premium features.</p>
        
        <h2>What's Next</h2>
        <p>This is just the beginning. Our team is already working on:</p>
        <ul>
          <li>Multi-timeframe predictions</li>
          <li>Custom model training for API users</li>
          <li>Integration with more technical indicators</li>
        </ul>
        
        <p>Thank you for being part of the TradeGuard AI community. Your feedback drives our development, so please don't hesitate to share your thoughts.</p>
      `,
    },
  };

  const announcement = announcementData[slug] || {
    title: 'Announcement Not Found',
    category: 'News',
    date: new Date().toISOString().split('T')[0],
    readTime: '1 min read',
    author: 'TradeGuard AI Team',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=80',
    content: '<p>The requested announcement could not be found.</p>',
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `${announcement.title} - TradeGuard AI`;
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      copy: url,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const relatedAnnouncements = [
    { slug: 'api-v2-released', title: 'API v2.0 Released', date: '2026-01-10' },
    { slug: 'mobile-app-beta', title: 'Mobile App Beta Now Available', date: '2026-01-15' },
    { slug: 'new-exchanges-supported', title: '5 New Exchanges Now Supported', date: '2026-01-25' },
  ];

  const articleSchema = generateArticleSchema({
    title: announcement.title,
    excerpt: announcement.content.substring(0, 160).replace(/<[^>]*>/g, ''),
    date: announcement.date,
    image: announcement.image,
  });

  return (
    <PageTransition>
      <div className="page-wrapper">
        <SEOHead
          title={announcement.title}
          description={announcement.content.substring(0, 160).replace(/<[^>]*>/g, '')}
          canonical={`/announcements/${slug}`}
          ogImage={announcement.image}
          ogType="article"
          structuredData={articleSchema}
        />
        <Navbar />
        <main className="main-wrapper">
          {/* Article Header */}
          <section className="article-header-section">
            <div className="padding-global">
              <div className="container-medium">
                <Breadcrumb items={[
                  { name: 'Home', url: '/' },
                  { name: 'Announcements', url: '/announcements' },
                  { name: announcement.title }
                ]} />
                
                <div className="article-header-content" ref={contentRef}>
                  <span className="article-category-badge">{announcement.category}</span>
                  <h1 className="heading-style-h1 article-title">{announcement.title}</h1>
                  <div className="article-meta-row">
                    <span className="article-author">By {announcement.author}</span>
                    <span className="article-meta-divider">•</span>
                    <span className="article-date">{formatDate(announcement.date)}</span>
                    <span className="article-meta-divider">•</span>
                    <span className="article-read-time">{announcement.readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Image */}
          <section className="article-image-section">
            <div className="padding-global">
              <div className="container-large">
                <div className="article-featured-image">
                  <img src={announcement.image} alt={announcement.title} />
                </div>
              </div>
            </div>
          </section>

          {/* Article Content */}
          <section className="article-content-section">
            <div className="padding-global">
              <div className="container-small">
                <div className="article-body">
                  <div 
                    className="article-content prose"
                    dangerouslySetInnerHTML={{ __html: announcement.content }}
                  />
                  
                  {/* Share Buttons */}
                  <div className="article-share">
                    <span className="article-share-label">Share this article:</span>
                    <div className="article-share-buttons">
                      <button 
                        className="share-button share-button--twitter"
                        onClick={() => handleShare('twitter')}
                        aria-label="Share on Twitter"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      </button>
                      <button 
                        className="share-button share-button--linkedin"
                        onClick={() => handleShare('linkedin')}
                        aria-label="Share on LinkedIn"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </button>
                      <button 
                        className="share-button share-button--copy"
                        onClick={() => handleShare('copy')}
                        aria-label="Copy link"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Related Articles */}
          <section className="article-related-section">
            <div className="padding-global">
              <div className="container-medium">
                <div className="padding-section-small">
                  <h2 className="heading-style-h4">Related Announcements</h2>
                  <div className="related-articles-grid">
                    {relatedAnnouncements.map((related) => (
                      <Link 
                        key={related.slug} 
                        to={`/announcements/${related.slug}`}
                        className="related-article-card"
                      >
                        <h3 className="related-article-title">{related.title}</h3>
                        <span className="related-article-date text-color-secondary">
                          {formatDate(related.date)}
                        </span>
                      </Link>
                    ))}
                  </div>
                  <div className="article-back-link">
                    <Link to="/announcements" className="button is-secondary">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                      </svg>
                      Back to All Announcements
                    </Link>
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

export default AnnouncementDetailPage;
