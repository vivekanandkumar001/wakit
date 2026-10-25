import React from 'react';
import { FileText, ShieldAlert } from 'lucide-react';
import { AdBanner } from '../components/AdBanner';
import { SEOHead } from '../components/SEOHead';
import { PageHeader } from '../components/PageHeader';

export const TermsPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <SEOHead
        title="Terms of Service | WaKit"
        description="The terms that apply when you use WaKit's free browser-based WhatsApp utilities, including acceptable use, liability limits and trademark attribution."
        canonicalPath="/terms"
        breadcrumbs={[{ name: 'Terms of Service' }]}
      />

      <PageHeader
        icon={FileText}
        eyebrow="Legal"
        title="Terms of Service"
        description="Please read these terms before using the WaKit utility suite."
        breadcrumbs={[{ name: 'Terms of Service' }]}
      />

      <div className="glass-card space-y-6 p-6 text-sm leading-relaxed text-slate-700 sm:p-10">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">1. Acceptance of terms</h2>
          <p>
            By accessing and using WaKit, you agree to be bound by these Terms of Service. If you
            do not agree, please discontinue use of the tools immediately.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <ShieldAlert className="h-5 w-5 text-amber-500" aria-hidden="true" />
            <span>2. Trademark &amp; third-party disclaimer</span>
          </h2>
          <p>
            WaKit is an independent utility application.{' '}
            <strong className="text-slate-900">
              WaKit is NOT affiliated, associated, authorized, endorsed by, or in any way
              officially connected with WhatsApp LLC, Meta Platforms, Inc., or any of their
              subsidiaries or affiliates.
            </strong>
          </p>
          <p>
            The official WhatsApp website can be found at{' '}
            <a
              href="https://whatsapp.com"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-emerald-700 underline decoration-emerald-300 underline-offset-2"
            >
              whatsapp.com
            </a>
            . The name &quot;WhatsApp&quot; as well as related names, marks, emblems and images are
            registered trademarks of Meta Platforms, Inc.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">3. Disclaimer of warranties</h2>
          <p>
            WaKit is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without
            warranties of any kind, whether express or implied. Because all media slicing and
            audio processing happen 100% inside your device&apos;s browser, performance depends on
            your local hardware CPU and RAM resources.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">4. Permissible use</h2>
          <p>
            You agree not to use WaKit to slice or distribute copyrighted videos without
            authorization or to send unsolicited spam messages via WhatsApp direct links.
          </p>
        </section>
      </div>

      <AdBanner type="leaderboard" />
    </div>
  );
};
