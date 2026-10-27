import React, { type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { AdBanner } from './AdBanner';
import { FAQAccordion } from './FAQAccordion';
import { PageHeader } from './PageHeader';
import { QuickAnswer } from './QuickAnswer';
import { RelatedTools } from './RelatedTools';
import { SEOHead, type Breadcrumb, type FAQItem, type HowToStep, type SEOHeadProps } from './SEOHead';
import { ToolSeoContent } from './ToolSeoContent';
import { socialToolNavItems } from '../data/socialTools';

interface ClientToolPageProps {
  seo: SEOHeadProps;
  icon: LucideIcon;
  eyebrow: string;
  title: ReactNode;
  description: string;
  breadcrumbs: Breadcrumb[];
  toolName: string;
  quickAnswer: {
    question: string;
    answer: string;
    facts?: Array<{ label: string; value: string }>;
  };
  steps: [HowToStep, HowToStep, HowToStep];
  intro: string;
  faqs: FAQItem[];
  currentPath: string;
  securityHeading?: string;
  securityText?: string;
  children: ReactNode;
}

/**
 * Shared layout for the Creator Studio tools. It keeps metadata, structured
 * data, privacy copy, FAQs and internal links consistent across all routes.
 */
export const ClientToolPage: React.FC<ClientToolPageProps> = ({
  seo,
  icon,
  eyebrow,
  title,
  description,
  breadcrumbs,
  toolName,
  quickAnswer,
  steps,
  intro,
  faqs,
  currentPath,
  securityHeading,
  securityText,
  children,
}) => {
  return (
    <div className="w-full space-y-8">
      <SEOHead
        {...seo}
        breadcrumbs={breadcrumbs}
        faqs={faqs}
        howToName={seo.howToName ?? `How to use the ${toolName}`}
        howToSteps={steps}
        appCategory={seo.appCategory ?? 'UtilitiesApplication'}
      />

      <PageHeader
        icon={icon}
        eyebrow={eyebrow}
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
      />

      <QuickAnswer {...quickAnswer} />

      <AdBanner type="leaderboard" className="my-0" />

      <div className="space-y-8">{children}</div>

      <ToolSeoContent
        toolName={toolName}
        steps={steps}
        intro={intro}
        securityHeading={securityHeading}
        securityText={securityText}
      />

      <FAQAccordion items={faqs} title={`${toolName} FAQs`} />

      <RelatedTools
        currentPath={currentPath}
        title="More Creator Studio tools"
        items={socialToolNavItems}
        limit={3}
      />
    </div>
  );
};
