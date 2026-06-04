import React, { useState, useEffect } from 'react';
import gsap from 'gsap';

/**
 * BackToTop - Smooth scroll back to top button
 * Appears after scrolling past threshold
 */
const BackToTop = ({ threshold = 400 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  useEffect(() => {
    const button = document.querySelector('.back-to-top');
    if (!button) return;

    if (isVisible) {
      gsap.to(button, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
        pointerEvents: 'auto',
      });
    } else {
      gsap.to(button, {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
        ease: 'power2.out',
        pointerEvents: 'none',
      });
    }
  }, [isVisible]);

  const scrollToTop = () => {
    gsap.to(window, {
      scrollTo: { y: 0, autoKill: false },
      duration: 0.8,
      ease: 'power2.inOut',
    });
    
    // Fallback for browsers without GSAP scrollTo
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      className="back-to-top"
      onClick={scrollToTop}
      aria-label="Back to top"
      style={{
        opacity: 0,
        pointerEvents: 'none',
      }}
    >
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  );
};

export default BackToTop;
