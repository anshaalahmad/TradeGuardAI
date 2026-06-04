import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { pageTransition } from '../utils/animations';

/**
 * usePageTransition - Hook for page enter/exit animations
 * 
 * @param {object} options - Custom animation options
 * @returns {ref} - Ref to attach to the page wrapper
 * 
 * @example
 * const pageRef = usePageTransition();
 * return <div ref={pageRef} className="page-content">...</div>
 */
export const usePageTransition = (options = {}) => {
  const pageRef = useRef(null);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        // Simple fade for reduced motion
        gsap.fromTo(
          page,
          { opacity: 0 },
          { opacity: 1, duration: 0.2 }
        );
      } else {
        // Full page transition animation
        gsap.fromTo(
          page,
          pageTransition.initial,
          {
            ...pageTransition.animate,
            ...options,
          }
        );
      }
    }, page);

    return () => ctx.revert();
  }, [options]);

  return pageRef;
};

/**
 * useExitAnimation - Trigger exit animation before navigation
 * 
 * @param {function} onComplete - Callback after animation completes
 * @returns {function} - Function to trigger exit animation
 */
export const useExitAnimation = (elementRef) => {
  const triggerExit = (onComplete) => {
    const element = elementRef.current;
    if (!element) {
      onComplete?.();
      return;
    }

    gsap.to(element, {
      ...pageTransition.exit,
      onComplete,
    });
  };

  return triggerExit;
};

export default usePageTransition;
