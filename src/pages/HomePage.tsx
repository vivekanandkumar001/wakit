import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { ToolGrid } from '../components/ToolGrid';
import { FAQAccordion, exactWhatsSwiftFaqs } from '../components/FAQAccordion';
import { SEOHead } from '../components/SEOHead';

export const HomePage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="WhatsSwift – Free Private WhatsApp Utilities (Status Splitter, Direct Chat, QR, Audio)"
        description="Free private WhatsApp tools in your browser: split 30s status videos, direct chat, QR codes & 16MB audio compression. Zero uploads, instant results."
        canonicalPath="/"
        keywords="whatsapp status video splitter online, send whatsapp message without saving number, whatsapp qr code generator, compress audio for whatsapp 16mb"
        faqs={exactWhatsSwiftFaqs}
      />

      <div className="space-y-6">
        {/* Ultra-Clean Hero Section */}
        <HeroSection />

        {/* Interactive Tool Cards (Grid of 4) */}
        <ToolGrid />

        {/* Collapsible SEO FAQ Accordion */}
        <FAQAccordion items={exactWhatsSwiftFaqs} />
      </div>
    </>
  );
};
