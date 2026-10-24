import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { ToolGrid } from '../components/ToolGrid';
import { FAQAccordion, exactWaKitFaqs } from '../components/FAQAccordion';
import { SEOHead } from '../components/SEOHead';

export const HomePage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="WaKit — Free Private WhatsApp Tools (Status Splitter, Direct Chat, QR, Audio)"
        description="Free private WhatsApp tools in your browser: split 30s status videos, chat without saving numbers, QR codes and compress audio to 16MB. No uploads, no signup."
        canonicalPath="/"
        keywords="whatsapp status video splitter online, send whatsapp message without saving number, whatsapp qr code generator, compress audio for whatsapp 16mb"
        faqs={exactWaKitFaqs}
      />

      <div className="space-y-6">
        {/* Ultra-Clean Hero Section */}
        <HeroSection />

        {/* Interactive Tool Cards (Grid of 4) */}
        <ToolGrid />

        {/* Collapsible SEO FAQ Accordion */}
        <FAQAccordion items={exactWaKitFaqs} />
      </div>
    </>
  );
};
