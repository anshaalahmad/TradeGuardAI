import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * PageTransition - Wrapper component for page enter animations
 * 
 * @param {React.ReactNode} children - Page content
 * @param {string} className - Additional classes
 */
const PageTransition = ({ children, className = '' }) => {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.set(wrapper, { opacity: 1 });
      return;
    }

    // Page enter animation
    gsap.fromTo(
      wrapper,
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.5, 
        ease: 'power2.out',
        delay: 0.1,
      }
    );

    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div ref={wrapperRef} className={`page-transition ${className}`} style={{ opacity: 0 }}>
      {children}
    </div>
  );
};

export default PageTransition;
