import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animations, scrollTriggerDefaults, counterAnimation } from '../utils/animations';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * useScrollAnimation - Reusable hook for scroll-triggered animations
 * 
 * @param {string} type - Animation type: 'fadeUp', 'fadeIn', 'slideInLeft', 'slideInRight', 'scaleFadeIn', 'stagger', 'counter'
 * @param {object} options - Custom options to override defaults
 * @returns {ref} - Ref to attach to the animated element
 * 
 * @example
 * const ref = useScrollAnimation('fadeUp');
 * return <div ref={ref}>Animated content</div>
 */
export const useScrollAnimation = (type = 'fadeUp', options = {}) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      const animation = animations[type];
      
      if (!animation) {
        console.warn(`Animation type "${type}" not found`);
        return;
      }

      // Set initial state
      gsap.set(element, animation.from);

      // Create animation with ScrollTrigger
      gsap.to(element, {
        ...animation.to,
        scrollTrigger: {
          trigger: element,
          ...scrollTriggerDefaults,
          ...options.scrollTrigger,
        },
        ...options,
      });
    }, element);

    return () => ctx.revert();
  }, [type, options]);

  return elementRef;
};

/**
 * useStaggerAnimation - Animate multiple children with stagger effect
 * 
 * @param {string} childSelector - CSS selector for children to animate
 * @param {object} options - Custom options
 * @returns {ref} - Ref to attach to the parent container
 */
export const useStaggerAnimation = (childSelector = '.stagger-item', options = {}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const children = container.querySelectorAll(childSelector);
    if (!children.length) return;

    const ctx = gsap.context(() => {
      gsap.set(children, animations.fadeUp.from);

      gsap.to(children, {
        ...animations.fadeUp.to,
        stagger: options.stagger || animations.stagger.normal,
        scrollTrigger: {
          trigger: container,
          ...scrollTriggerDefaults,
          ...options.scrollTrigger,
        },
      });
    }, container);

    return () => ctx.revert();
  }, [childSelector, options]);

  return containerRef;
};

/**
 * useParallax - Create parallax effect on scroll
 * 
 * @param {number} intensity - Parallax intensity (default: -15)
 * @returns {ref} - Ref to attach to the parallax element
 */
export const useParallax = (intensity = -15) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to(element, {
        yPercent: intensity,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    }, element);

    return () => ctx.revert();
  }, [intensity]);

  return elementRef;
};

/**
 * useCountUp - Animate numbers counting up
 * 
 * @param {number} endValue - The target number
 * @param {string} suffix - Optional suffix (e.g., '+', '%', 'K')
 * @param {string} prefix - Optional prefix (e.g., '$')
 * @returns {ref} - Ref to attach to the number element
 */
export const useCountUp = (endValue, suffix = '', prefix = '') => {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      const obj = { value: 0 };
      
      gsap.to(obj, {
        value: endValue,
        ...counterAnimation,
        scrollTrigger: {
          trigger: element,
          start: 'top 90%',
          once: true,
        },
        onUpdate: () => {
          element.textContent = `${prefix}${Math.round(obj.value).toLocaleString()}${suffix}`;
        },
      });
    }, element);

    return () => ctx.revert();
  }, [endValue, suffix, prefix]);

  return elementRef;
};

/**
 * useReveal - Simple reveal animation on scroll
 * 
 * @param {string} direction - 'up', 'down', 'left', 'right'
 * @param {number} distance - Distance to animate from
 * @returns {ref} - Ref to attach to the element
 */
export const useReveal = (direction = 'up', distance = 40) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const directions = {
      up: { y: distance, x: 0 },
      down: { y: -distance, x: 0 },
      left: { x: distance, y: 0 },
      right: { x: -distance, y: 0 },
    };

    const ctx = gsap.context(() => {
      gsap.set(element, {
        opacity: 0,
        ...directions[direction],
      });

      gsap.to(element, {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          ...scrollTriggerDefaults,
        },
      });
    }, element);

    return () => ctx.revert();
  }, [direction, distance]);

  return elementRef;
};

/**
 * useMarquee - Create infinite scrolling marquee
 * 
 * @param {number} duration - Animation duration in seconds
 * @param {boolean} reverse - Reverse direction
 * @returns {ref} - Ref to attach to the marquee track
 */
export const useMarquee = (duration = 20, reverse = false) => {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        xPercent: reverse ? 100 : -100,
        repeat: -1,
        duration,
        ease: 'none',
      });
    }, track);

    return () => ctx.revert();
  }, [duration, reverse]);

  return trackRef;
};

export default useScrollAnimation;
