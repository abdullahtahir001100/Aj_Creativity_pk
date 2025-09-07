// src/components/SEOMetadata.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOMetadata = ({ title, description, canonicalUrl, ogImage }) => {
  const siteUrl = "https://www.javehandmade.store";
  const fullCanonicalUrl = `${siteUrl}${canonicalUrl}`;
  
  return (
    <Helmet>
      {/* General tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Canonical Tag */}
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Open Graph (Facebook, etc.) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:image" content={ogImage || `${siteUrl}/default-og-image.png`} />
      <meta property="og:type" content="website" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage || `${siteUrl}/default-og-image.png`} />
    </Helmet>
  );
};

export default SEOMetadata;