/**
 * GSAP Animation Configurations
 * Centralized animation presets for consistent animations across the app
 */

// Easing presets
export const easings = {
  smooth: 'power2.out',
  smoothInOut: 'power2.inOut',
  bounce: 'back.out(1.7)',
  elastic: 'elastic.out(1, 0.3)',
  snap: 'power4.out',
};

// Duration presets (in seconds)
export const durations = {
  fast: 0.3,
  normal: 0.5,
  slow: 0.7,
  slower: 1,
};

// Animation presets
export const animations = {
  // Fade up animation - most common for section content
  fadeUp: {
    from: {
      opacity: 0,
      y: 40,
    },
    to: {
      opacity: 1,
      y: 0,
      duration: durations.slow,
      ease: easings.smooth,
    },
  },

  // Fade in animation - simple opacity
  fadeIn: {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
      duration: durations.normal,
      ease: easings.smooth,
    },
  },

  // Slide in from left
  slideInLeft: {
    from: {
      opacity: 0,
      x: -50,
    },
    to: {
      opacity: 1,
      x: 0,
      duration: durations.slow,
      ease: easings.smooth,
    },
  },

  // Slide in from right
  slideInRight: {
    from: {
      opacity: 0,
      x: 50,
    },
    to: {
      opacity: 1,
      x: 0,
      duration: durations.slow,
      ease: easings.smooth,
    },
  },

  // Scale fade in
  scaleFadeIn: {
    from: {
      opacity: 0,
      scale: 0.95,
    },
    to: {
      opacity: 1,
      scale: 1,
      duration: durations.normal,
      ease: easings.smooth,
    },
  },

  // Parallax settings
  parallax: {
    yPercent: -15,
    ease: 'none',
  },

  // Stagger presets
  stagger: {
    fast: 0.08,
    normal: 0.12,
    slow: 0.2,
  },
};

// ScrollTrigger default settings
export const scrollTriggerDefaults = {
  start: 'top 85%',
  end: 'bottom 15%',
  toggleActions: 'play none none none',
  once: true,
};

// Page transition animation
export const pageTransition = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    duration: 0.4,
    ease: easings.smooth,
  },
  exit: {
    opacity: 0,
    y: -20,
    duration: 0.3,
    ease: easings.smoothInOut,
  },
};

// Counter animation for statistics
export const counterAnimation = {
  duration: 2,
  ease: 'power1.inOut',
  snap: { textContent: 1 },
};

// Hover animation presets
export const hoverAnimations = {
  lift: {
    y: -4,
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    duration: 0.3,
    ease: easings.smooth,
  },
  scale: {
    scale: 1.02,
    duration: 0.3,
    ease: easings.smooth,
  },
  glow: {
    boxShadow: '0 0 20px rgba(30, 101, 250, 0.3)',
    duration: 0.3,
    ease: easings.smooth,
  },
};

// Marquee/infinite scroll settings
export const marqueeAnimation = {
  x: '-100%',
  repeat: -1,
  duration: 20,
  ease: 'none',
};

export default {
  easings,
  durations,
  animations,
  scrollTriggerDefaults,
  pageTransition,
  counterAnimation,
  hoverAnimations,
  marqueeAnimation,
};
