import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEOHead - Dynamic meta tags component for SEO optimization
 * @param {string} title - Page title (will append " | TradeGuard AI")
 * @param {string} description - Meta description (max 160 chars recommended)
 * @param {string} canonical - Canonical URL path (e.g., "/about")
 * @param {string} ogImage - Open Graph image URL
 * @param {string} ogType - Open Graph type (default: "website")
 * @param {object} structuredData - JSON-LD structured data object
 * @param {boolean} noIndex - Whether to add noindex meta tag
 */
const SEOHead = ({
  title,
  description,
  canonical,
  ogImage = 'https://tradeguard.ai/images/og-default.png',
  ogType = 'website',
  structuredData,
  noIndex = false,
  keywords,
}) => {
  const siteName = 'TradeGuard AI';
  const siteUrl = 'https://tradeguard.ai';
  const twitterHandle = '@tradeguardai';
  
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} - AI-Powered Crypto Trading Platform`;
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;
  
  const defaultDescription = 'Trade smarter with AI-powered predictions, real-time market analysis, and intelligent alerts. Join 10,000+ traders using TradeGuard AI for cryptocurrency trading.';
  const metaDescription = description || defaultDescription;
  
  const defaultKeywords = 'crypto trading, AI trading, cryptocurrency, bitcoin, ethereum, trading platform, market analysis, trading predictions, crypto alerts';
  const metaKeywords = keywords || defaultKeywords;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      
      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      
      {/* Canonical */}
      <link rel="canonical" href={fullCanonical} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullCanonical} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      
      {/* Additional Meta */}
      <meta name="author" content="TradeGuard AI" />
      <meta name="publisher" content="TradeGuard AI" />
      <meta name="application-name" content={siteName} />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      <meta name="theme-color" content="#1e65fa" />
      <meta name="msapplication-TileColor" content="#1e65fa" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
