import { useEffect } from 'react';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface HowToStep {
  name: string;
  text: string;
}

interface SEOHeadProps {
  title: string;
  description: string;
  /** Path only, e.g. "/whatsapp-status-splitter". Canonical is built as SITE_ORIGIN + path. */
  canonicalPath?: string;
  ogImage?: string;
  keywords?: string;
  faqs?: FAQItem[];
  /** When provided, a HowTo JSON-LD block is injected for this route. */
  howToName?: string;
  howToSteps?: HowToStep[];
}

export const SITE_ORIGIN = 'https://wakit.vercel.app';
const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/favicon.svg`;

function setMeta(selector: string, attrName: string, attrValue: string, content: string) {
  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/**
 * Lightweight document-head updater (no react-helmet dependency).
 * Sets title, description, canonical, OG/Twitter tags and injects
 * WebApplication + FAQPage + HowTo JSON-LD. Cleans up route-scoped
 * script tags on unmount so schemas never leak between routes.
 */
export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalPath = '/',
  ogImage = DEFAULT_OG_IMAGE,
  keywords,
  faqs = [],
  howToName,
  howToSteps = [],
}) => {
  useEffect(() => {
    const canonicalUrl = `${SITE_ORIGIN}${canonicalPath}`;

    document.title = title;

    setMeta('meta[name="description"]', 'name', 'description', description);
    if (keywords) {
      setMeta('meta[name="keywords"]', 'name', 'keywords', keywords);
    }
    setMeta(
      'meta[name="robots"]',
      'name',
      'robots',
      'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    );
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:image"]', 'property', 'og:image', ogImage);
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary');
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage);
    setMeta('meta[name="twitter:url"]', 'name', 'twitter:url', canonicalUrl);

    let canonicalElement = document.querySelector('link[rel="canonical"]');
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.setAttribute('href', canonicalUrl);

    const injectedIds: string[] = [];
    const injectSchema = (id: string, schema: object) => {
      let script = document.getElementById(id) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.id = id;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(schema);
      injectedIds.push(id);
    };

    injectSchema('ws-jsonld-webapp', {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'WhatsSwift - WhatsApp Utility Toolkit',
      url: canonicalUrl,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any',
      browserRequirements: 'Requires JavaScript, HTML5 and WebAssembly',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description,
    });

    if (faqs.length > 0) {
      injectSchema('ws-jsonld-faq', {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      });
    }

    if (howToName && howToSteps.length > 0) {
      injectSchema('ws-jsonld-howto', {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: howToName,
        step: howToSteps.map((step, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          name: step.name,
          text: step.text,
        })),
      });
    }

    return () => {
      // Remove route-scoped FAQ/HowTo schemas so they never leak across routes.
      // WebApplication block is re-written per route, so it stays.
      document.getElementById('ws-jsonld-faq')?.remove();
      document.getElementById('ws-jsonld-howto')?.remove();
    };
  }, [title, description, canonicalPath, ogImage, keywords, faqs, howToName, howToSteps]);

  return null;
};
