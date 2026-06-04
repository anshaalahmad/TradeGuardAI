import React from 'react';
import { Link } from 'react-router-dom';
import { generateBreadcrumbSchema } from '../SEO/StructuredData';
import { Helmet } from 'react-helmet-async';

/**
 * Breadcrumb - Accessible breadcrumb navigation with schema markup
 * 
 * @param {Array} items - Array of {name, url} objects
 * 
 * @example
 * <Breadcrumb items={[
 *   { name: 'Home', url: '/' },
 *   { name: 'About', url: '/about' },
 *   { name: 'Mission' }
 * ]} />
 */
const Breadcrumb = ({ items = [] }) => {
  if (!items.length) return null;

  const schema = generateBreadcrumbSchema(items);

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      </Helmet>
      <nav aria-label="Breadcrumb" className="breadcrumb-nav">
        <ol className="breadcrumb">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            
            return (
              <li key={index} className="breadcrumb-item">
                {!isLast && item.url ? (
                  <>
                    <Link to={item.url} className="breadcrumb-link">
                      {item.name}
                    </Link>
                    <span className="breadcrumb-separator" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </span>
                  </>
                ) : (
                  <span className="breadcrumb-current" aria-current="page">
                    {item.name}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumb;
