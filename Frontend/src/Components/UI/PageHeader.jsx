import React from 'react';
import { useScrollAnimation, useParallax } from '../../hooks/useScrollAnimation';

/**
 * PageHeader - Consistent page hero component with breadcrumb support
 * 
 * @param {string} title - Page title
 * @param {string} description - Page description
 * @param {string} backgroundImage - Optional background image URL
 * @param {boolean} centered - Center align content
 * @param {React.ReactNode} children - Optional additional content (breadcrumb, etc.)
 * @param {React.ReactNode} actions - Optional action buttons
 */
const PageHeader = ({ 
  title, 
  description, 
  backgroundImage,
  centered = true,
  children,
  actions,
  className = '',
}) => {
  const titleRef = useScrollAnimation('fadeUp');
  const descRef = useScrollAnimation('fadeUp', { delay: 0.1 });
  const imageRef = useParallax(-10);

  return (
    <section className={`page-header-section ${className}`}>
      {backgroundImage && (
        <div className="page-header-bg" ref={imageRef}>
          <img 
            src={backgroundImage} 
            alt="" 
            className="page-header-bg-image"
            loading="eager"
          />
          <div className="page-header-overlay" />
        </div>
      )}
      <div className="padding-global">
        <div className="container-large">
          <div className={`page-header-content ${centered ? 'is-centered' : ''}`}>
            {children}
            <h1 ref={titleRef} className="page-header-title heading-style-h1">
              {title}
            </h1>
            {description && (
              <p ref={descRef} className="page-header-description text-size-large text-color-secondary">
                {description}
              </p>
            )}
            {actions && (
              <div className="page-header-actions">
                {actions}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageHeader;
