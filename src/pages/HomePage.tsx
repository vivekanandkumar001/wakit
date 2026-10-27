import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { AppPromo } from '../components/AppPromo';
import { ToolDirectory } from '../components/ToolDirectory';
import { ToolGrid } from '../components/ToolGrid';
import { TrustSection } from '../components/TrustSection';
import { FAQAccordion, exactWaKitFaqs } from '../components/FAQAccordion';
import { SEOHead } from '../components/SEOHead';

export const HomePage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="WaKit — 16 Free Private Social Media Tools for WhatsApp, Instagram & Facebook"
        description="Free browser-only tools for WhatsApp, Instagram and Facebook: split status videos, compress audio and media, make sticker packs, plan grids, split carousels, design covers, resize image batches and build UTM QR links. No uploads or signup."
        canonicalPath="/"
        keywords="free social media tools, whatsapp status video splitter online, send whatsapp message without saving number, whatsapp qr code generator, compress audio for whatsapp 16mb, instagram grid planner, instagram carousel splitter, facebook cover maker, social media image resizer"
        faqs={exactWaKitFaqs}
      />

      <div className="space-y-8 sm:space-y-10">
        <HeroSection />

        <ToolDirectory />

        <AppPromo />

        <ToolGrid />

        <TrustSection />

        <FAQAccordion items={exactWaKitFaqs} />
      </div>
    </>
  );
};
