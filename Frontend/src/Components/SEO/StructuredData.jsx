import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Organization Schema for TradeGuard AI
 */
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TradeGuard AI',
  alternateName: 'TradeGuardAI',
  url: 'https://tradeguard.ai',
  logo: 'https://tradeguard.ai/images/logo.png',
  description: 'AI-powered cryptocurrency trading platform providing real-time market analysis, intelligent predictions, and automated trading alerts.',
  foundingDate: '2024',
  sameAs: [
    'https://twitter.com/tradeguardai',
    'https://linkedin.com/company/tradeguardai',
    'https://github.com/tradeguardai',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-XXX-XXX-XXXX',
    contactType: 'customer service',
    email: 'support@tradeguard.ai',
    availableLanguage: ['English'],
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'US',
  },
};

/**
 * Website Schema
 */
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'TradeGuard AI',
  url: 'https://tradeguard.ai',
  description: 'AI-powered cryptocurrency trading platform',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://tradeguard.ai/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

/**
 * SoftwareApplication Schema
 */
export const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'TradeGuard AI',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free tier available',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '1250',
    bestRating: '5',
    worstRating: '1',
  },
};

/**
 * FAQ Page Schema Generator
 */
export const generateFAQSchema = (faqItems) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
});

/**
 * Breadcrumb Schema Generator
 */
export const generateBreadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url ? `https://tradeguard.ai${item.url}` : undefined,
  })),
});

/**
 * Article Schema Generator (for announcements)
 */
export const generateArticleSchema = (article) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: article.title,
  description: article.excerpt,
  image: article.image || 'https://tradeguard.ai/images/og-default.png',
  author: {
    '@type': 'Organization',
    name: 'TradeGuard AI',
  },
  publisher: {
    '@type': 'Organization',
    name: 'TradeGuard AI',
    logo: {
      '@type': 'ImageObject',
      url: 'https://tradeguard.ai/images/logo.png',
    },
  },
  datePublished: article.date,
  dateModified: article.dateModified || article.date,
});

/**
 * Global Structured Data Component
 * Include on all pages for organization and website schemas
 */
const GlobalStructuredData = () => {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
    </Helmet>
  );
};

export default GlobalStructuredData;
