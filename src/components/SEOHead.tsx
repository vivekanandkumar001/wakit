import { useEffect } from 'react';
import type React from 'react';
import { SITE } from '../config/site';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface HowToStep {
  name: string;
  text: string;
}

export interface Breadcrumb {
  /** Visible label, e.g. "Status Splitter". */
  name: string;
  /** Route path, e.g. "/whatsapp-status-splitter". Omit for the current page. */
  path?: string;
}

export interface SEOHeadProps {
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
  /** Visible breadcrumb trail. Also emitted as BreadcrumbList schema. */
  breadcrumbs?: Breadcrumb[];
  /** schema.org applicationCategory. Set for interactive tool pages. */
  appCategory?: string;
  /** ISO date for schema freshness signals. */
  dateModified?: string;
  /** Keep utility/error pages out of the index. */
  noindex?: boolean;
}

export const SITE_ORIGIN = SITE.origin;
export const SITE_NAME = SITE.name;
export const SITE_UPDATED = SITE.updated;
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og-image.png`;

const absolute = (path: string) => `${SITE_ORIGIN}${path === '/' ? '/' : path.replace(/\/$/, '')}`;

let ssrSeo: SEOHeadProps | null = null;
export function getSsrSeo(): SEOHeadProps | null {
  const value = ssrSeo;
  ssrSeo = null;
  return value;
}

/**
 * Builds the complete per-route JSON-LD graph. Shared by the client-side
 * SEOHead component and the build-time prerenderer, so crawlers that do not
 * execute JavaScript still receive the exact same structured data.
 */
export function buildRouteGraph(props: SEOHeadProps): Record<string, unknown> {
  const canonicalUrl = absolute(props.canonicalPath ?? '/');
  const dateModified = props.dateModified ?? SITE_UPDATED;
  const breadcrumbId = `${canonicalUrl}#breadcrumb`;
  const webpageId = `${canonicalUrl}#webpage`;

  const graph: Record<string, unknown>[] = [];

  const breadcrumbList =
    props.breadcrumbs && props.breadcrumbs.length > 0
      ? {
          '@type': 'BreadcrumbList',
          '@id': breadcrumbId,
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: `${SITE_ORIGIN}/`,
            },
            ...props.breadcrumbs.map((crumb, index) => ({
              '@type': 'ListItem',
              position: index + 2,
              name: crumb.name,
              item: absolute(crumb.path ?? props.canonicalPath ?? '/'),
            })),
          ],
        }
      : null;

  if (breadcrumbList) graph.push(breadcrumbList);

  graph.push({
    '@type': 'WebPage',
    '@id': webpageId,
    url: canonicalUrl,
    name: props.title,
    description: props.description,
    inLanguage: 'en',
    dateModified,
    isAccessibleForFree: true,
    isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
    publisher: { '@id': `${SITE_ORIGIN}/#organization` },
    ...(breadcrumbList ? { breadcrumb: { '@id': breadcrumbId } } : {}),
    ...(props.faqs && props.faqs.length > 0
      ? { speakable: { '@type': 'SpeakableSpecification', cssSelector: ['#quick-answer'] } }
      : {}),
  });

  if (props.appCategory) {
    graph.push({
      '@type': 'WebApplication',
      '@id': `${canonicalUrl}#app`,
      name: `${SITE_NAME} ${props.breadcrumbs?.[0]?.name ?? 'Tool'}`.trim(),
      url: canonicalUrl,
      applicationCategory: props.appCategory,
      operatingSystem: 'Any',
      browserRequirements: 'Requires JavaScript, HTML5 and WebAssembly',
      inLanguage: 'en',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: props.description,
      publisher: { '@id': `${SITE_ORIGIN}/#organization` },
      isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
      mainEntityOfPage: { '@id': webpageId },
    });
  }

  if (props.faqs && props.faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${canonicalUrl}#faq`,
      url: canonicalUrl,
      mainEntity: props.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    });
  }

  if (props.howToName && props.howToSteps && props.howToSteps.length > 0) {
    graph.push({
      '@type': 'HowTo',
      '@id': `${canonicalUrl}#howto`,
      name: props.howToName,
      description: props.description,
      totalTime: 'PT2M',
      step: props.howToSteps.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.name,
        text: step.text,
        url: `${canonicalUrl}#howto`,
      })),
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

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
 * Sets title, description, canonical, OG/Twitter tags and injects a single
 * per-route JSON-LD @graph. The same graph is baked into static HTML by
 * scripts/prerender.mjs so non-JS crawlers (AI answer engines) get it too.
 */
export const SEOHead: React.FC<SEOHeadProps> = (props) => {
  const {
    title,
    description,
    canonicalPath = '/',
    ogImage = DEFAULT_OG_IMAGE,
    keywords,
    faqs = [],
    howToName,
    howToSteps = [],
    breadcrumbs,
    appCategory,
    dateModified = SITE_UPDATED,
    noindex = false,
  } = props;

  if (typeof document === 'undefined') {
    ssrSeo = props;
  }

  useEffect(() => {
    const canonicalUrl = absolute(canonicalPath);

    document.title = title;

    setMeta('meta[name="description"]', 'name', 'description', description);
    if (keywords) {
      setMeta('meta[name="keywords"]', 'name', 'keywords', keywords);
    }
    setMeta(
      'meta[name="robots"]',
      'name',
      'robots',
      noindex
        ? 'noindex, follow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    );
    setMeta('meta[name="author"]', 'name', 'author', SITE_NAME);
    setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', SITE_NAME);
    setMeta('meta[property="og:locale"]', 'property', 'og:locale', 'en_US');
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:image"]', 'property', 'og:image', ogImage);
    setMeta('meta[property="og:image:type"]', 'property', 'og:image:type', 'image/png');
    setMeta('meta[property="og:image:width"]', 'property', 'og:image:width', '1200');
    setMeta('meta[property="og:image:height"]', 'property', 'og:image:height', '630');
    setMeta('meta[property="og:image:alt"]', 'property', 'og:image:alt', title);
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage);
    setMeta('meta[name="twitter:image:alt"]', 'name', 'twitter:image:alt', title);
    setMeta('meta[name="twitter:url"]', 'name', 'twitter:url', canonicalUrl);

    let canonicalElement = document.querySelector('link[rel="canonical"]');
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.setAttribute('href', canonicalUrl);

    const schema = buildRouteGraph({ ...props, canonicalPath, dateModified });

    let script = document.getElementById('ws-jsonld-route') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'ws-jsonld-route';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);

    // The template ships a homepage graph; remove it on other routes so the
    // document never contains two conflicting route graphs.
    if (canonicalPath !== '/') {
      document.getElementById('ws-jsonld-home')?.remove();
    }
  }, [
    title,
    description,
    canonicalPath,
    ogImage,
    keywords,
    faqs,
    howToName,
    howToSteps,
    breadcrumbs,
    appCategory,
    dateModified,
    noindex,
    props,
  ]);

  return null;
};
