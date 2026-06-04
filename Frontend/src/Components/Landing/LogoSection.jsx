import React from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';
import '@splidejs/react-splide/css';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const LogoSection = () => {
  const titleRef = useScrollAnimation('fadeUp');

  const logos = [
    {
      name: 'Binance',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="#F0B90B">
          <path d="M12 2L6.5 7.5 8.36 9.36 12 5.72l3.64 3.64L17.5 7.5 12 2zm-7.5 10L2 14.5 4.5 17 7 14.5 4.5 12zm15 0L17 14.5 19.5 17 22 14.5 19.5 12zM12 8.28L7.5 12.78l1.86 1.86L12 12 14.64 14.64l1.86-1.86L12 8.28zM12 22l5.5-5.5-1.86-1.86L12 18.28l-3.64-3.64L6.5 16.5 12 22z"/>
        </svg>
      ),
    },
    {
      name: 'Coinbase',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="#0052FF">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
        </svg>
      ),
    },
    {
      name: 'Kraken',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="#5741D9">
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 3a2 2 0 110 4 2 2 0 010-4zm-3 7a2 2 0 110 4 2 2 0 010-4zm6 0a2 2 0 110 4 2 2 0 010-4z"/>
        </svg>
      ),
    },
    {
      name: 'KuCoin',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="#23AF91">
          <path d="M12 2L2 12l10 10 10-10L12 2zm0 4l6 6-6 6-6-6 6-6z"/>
        </svg>
      ),
    },
    {
      name: 'Bybit',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="#F7A600">
          <path d="M5 4h6v7H5V4zm8 0h6v16h-6V4zM5 13h6v7H5v-7z"/>
        </svg>
      ),
    },
    {
      name: 'OKX',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="#000000">
          <rect x="3" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/>
          <rect x="14" y="14" width="7" height="7" rx="1"/>
        </svg>
      ),
    },
    {
      name: 'Bitfinex',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="#16B157">
          <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 3.5L17 8.5v7L12 18.5 7 15.5v-7L12 5.5z"/>
        </svg>
      ),
    },
    {
      name: 'Gemini',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="#00DCFA">
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 4a6 6 0 016 6h-6V6zm0 12a6 6 0 01-6-6h6v6z"/>
        </svg>
      ),
    },
  ];

  return (
    <section className="logo-section">
      <div className="padding-global">
        <div className="container-large">
          <div className="logo-section-header" ref={titleRef}>
            <p className="text-size-medium text-color-secondary text-align-center">
              Trusted by <strong>10,000+</strong> traders · Supporting major exchanges
            </p>
          </div>
        </div>
      </div>
      <div className="logo-marquee-wrapper">
        <Splide
          options={{
            type: 'loop',
            drag: 'free',
            focus: 'center',
            perPage: 8,
            autoScroll: {
              speed: 0.8,
              pauseOnHover: true,
              pauseOnFocus: false,
            },
            arrows: false,
            pagination: false,
            gap: '1rem',
            breakpoints: {
              1400: { perPage: 6 },
              1200: { perPage: 5 },
              991: { perPage: 4 },
              767: { perPage: 3 },
              479: { perPage: 2 },
            },
          }}
          extensions={{ AutoScroll }}
        >
          {[...logos, ...logos, ...logos].map((logo, index) => (
            <SplideSlide key={index}>
              <div className="logo-item">
                <div className="logo-icon-wrapper">
                  {logo.icon}
                </div>
                <span className="logo-name">{logo.name}</span>
              </div>
            </SplideSlide>
          ))}
        </Splide>
      </div>
    </section>
  );
};

export default LogoSection;
