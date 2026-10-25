import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { ToolGrid } from '../components/ToolGrid';
import { TrustSection } from '../components/TrustSection';
import { FAQAccordion, exactWaKitFaqs } from '../components/FAQAccordion';
import { SEOHead } from '../components/SEOHead';

export const HomePage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="WaKit — Free Private WhatsApp Tools (Status Splitter, Direct Chat, QR, Audio)"
        description="Free private WhatsApp tools in your browser: split 30s status videos, chat without saving numbers, QR codes and compress audio up to 3GB for WhatsApp's 16MB limit. No uploads, no signup."
        canonicalPath="/"
        keywords="whatsapp status video splitter online, send whatsapp message without saving number, whatsapp qr code generator, compress audio for whatsapp 16mb, compress 3gb audio"
        faqs={exactWaKitFaqs}
      />

      <div className="space-y-8 sm:space-y-10">
        <HeroSection />

        <ToolGrid />

        <TrustSection />

        <FAQAccordion items={exactWaKitFaqs} />
      </div>
    </>
  );
};
