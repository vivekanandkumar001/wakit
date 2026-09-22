import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { ToolGrid } from '../components/ToolGrid';
import { FAQAccordion, exactWhatsSwiftFaqs } from '../components/FAQAccordion';
import { SEOHead } from '../components/SEOHead';

export const HomePage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="WhatsSwift — Split WhatsApp Status Video (30s) & Direct Chat Without Saving"
        description="Free browser toolkit for WhatsApp. Split videos into 30-second status clips, message unsaved numbers directly, and generate instant QR codes. 100% private, zero app installation."
        canonicalUrl="https://whatsswift.app"
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
