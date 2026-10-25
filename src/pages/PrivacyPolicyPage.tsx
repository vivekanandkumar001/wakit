import React from 'react';
import { Shield, Lock, EyeOff } from 'lucide-react';
import { AdBanner } from '../components/AdBanner';
import { SEOHead } from '../components/SEOHead';
import { PageHeader } from '../components/PageHeader';
import { SITE } from '../config/site';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <SEOHead
        title="Privacy Policy — No File Uploads | WaKit"
        description="What WaKit stores and what it does not: media stays in browser memory, no account is required, and no files or phone numbers are ever sent to a server."
        canonicalPath="/privacy-policy"
        breadcrumbs={[{ name: 'Privacy Policy' }]}
      />

      <PageHeader
        icon={Shield}
        eyebrow="Legal"
        title="Privacy Policy"
        description="At WaKit, privacy is not a feature — it is the technical architecture."
        breadcrumbs={[{ name: 'Privacy Policy' }]}
      />

      <div className="glass-card space-y-6 p-6 text-sm leading-relaxed text-slate-700 sm:p-10">
        <section className="space-y-2">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <Lock className="h-5 w-5 text-emerald-600" aria-hidden="true" />
            <span>1. Zero server-side file storage or uploads</span>
          </h2>
          <p>
            When you use the <strong>Status Splitter</strong> or <strong>Audio Compressor</strong>,
            your media files (MP4, MOV, WebM, MP3, WAV) are loaded directly into your browser&apos;s
            local memory (<code className="rounded bg-slate-100 px-1 py-0.5 text-[0.8em]">Blob</code>{' '}
            and <code className="rounded bg-slate-100 px-1 py-0.5 text-[0.8em]">ArrayBuffer</code>).
            All processing happens on your CPU using WebAssembly binaries.
          </p>
          <p>
            <strong className="text-slate-900">
              No files or video data are ever transmitted to any remote server or third party.
            </strong>
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <EyeOff className="h-5 w-5 text-emerald-600" aria-hidden="true" />
            <span>2. Phone numbers &amp; messages</span>
          </h2>
          <p>
            Phone numbers entered into the <strong>Direct Chat</strong> tool are cleaned into
            standard E.164 strings and converted into{' '}
            <code className="rounded bg-slate-100 px-1 py-0.5 text-[0.8em]">
              https://wa.me/&lt;number&gt;
            </code>{' '}
            links directly in your browser. WaKit does not log, track, or transmit any phone
            numbers or prefilled text messages.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">3. Local browser storage</h2>
          <p>
            WaKit does not need an account, and the tools do not store your files, phone numbers,
            or messages in localStorage. Any browser storage is limited to anonymous interface
            preferences (for example, a dismissed notice) and never includes media or message
            contents.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">
            4. Third-party advertising &amp; cookies (Google AdSense)
          </h2>
          <p>
            WaKit may display third-party advertisements (such as Google AdSense) to keep this
            utility free for all users worldwide. Third-party vendors, including Google, use
            cookies to serve ads based on a user&apos;s prior visits to this website or other
            websites.
          </p>
          <p>
            You may opt out of personalized advertising by visiting Google&apos;s Ads Settings at{' '}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-emerald-700 underline decoration-emerald-300 underline-offset-2"
            >
              google.com/settings/ads
            </a>
            .
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">5. Contact us</h2>
          <p>
            If you have questions about this Privacy Policy or the technical security
            implementation of WaKit, email{' '}
            <a
              href={`mailto:${SITE.supportEmail}`}
              className="font-semibold text-emerald-700 underline decoration-emerald-300 underline-offset-2"
            >
              {SITE.supportEmail}
            </a>{' '}
            or use the contact page.
          </p>
        </section>
      </div>

      <AdBanner type="leaderboard" />
    </div>
  );
};
