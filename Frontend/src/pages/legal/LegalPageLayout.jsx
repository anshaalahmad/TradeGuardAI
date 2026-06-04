import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Footer } from '../../Components/Landing';
import { SEOHead } from '../../Components/SEO';
import { Breadcrumb, BackToTop, PageTransition } from '../../Components/UI';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const LegalPageLayout = ({
  title,
  description,
  lastUpdated,
  canonical,
  children,
  tableOfContents = [],
}) => {
  const contentRef = useScrollAnimation('fadeUp');

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <PageTransition>
      <div className="page-wrapper">
        <SEOHead
          title={title}
          description={description}
          canonical={canonical}
        />
        <Navbar />
        <main className="main-wrapper">
          <section className="sp-section" style={{ paddingTop: '8rem', paddingBottom: '2rem' }}>
            <div className="padding-global">
              <div className="container-large">
                <div style={{ textAlign: 'center' }}>
                  <Breadcrumb items={[
                    { name: 'Home', url: '/' },
                    { name: title }
                  ]} />
                  <h1 className="heading-style-h1">{title}</h1>
                  <p className="text-color-secondary" style={{ marginTop: '0.5rem' }}>
                    Last updated: {lastUpdated}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="sp-section">
            <div className="padding-global">
              <div className="container-large">
                <div className="sp-legal-grid">
                  {/* Sidebar */}
                  <aside className="sp-legal-sidebar">
                    {tableOfContents.length > 0 && (
                      <div className="sp-legal-sidebar-block">
                        <h3 className="sp-legal-sidebar-title">Table of Contents</h3>
                        <nav className="sp-legal-toc">
                          {tableOfContents.map((item, index) => (
                            <button
                              key={index}
                              className="sp-legal-toc-link"
                              onClick={() => scrollToSection(item.id)}
                            >
                              {item.title}
                            </button>
                          ))}
                        </nav>
                      </div>
                    )}
                    
                    <div className="sp-legal-sidebar-block">
                      <h3 className="sp-legal-sidebar-title">Related Policies</h3>
                      <div className="sp-legal-links">
                        <Link to="/privacy" className="sp-legal-link">Privacy Policy</Link>
                        <Link to="/terms" className="sp-legal-link">Terms of Service</Link>
                        <Link to="/cookies" className="sp-legal-link">Cookie Policy</Link>
                        <Link to="/disclaimer" className="sp-legal-link">Disclaimer</Link>
                      </div>
                    </div>
                  </aside>

                  {/* Main Content */}
                  <div className="sp-legal-content" ref={contentRef}>
                    {children}
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

export default LegalPageLayout;
