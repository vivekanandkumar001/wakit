import React from 'react';
import { FileText, ShieldAlert } from 'lucide-react';
import { AdBanner } from '../components/AdBanner';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
          <FileText className="w-3.5 h-3.5" />
          <span>Terms of Use</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Terms of Service
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
          Please read these terms before using the WaKit Web Utility Suite.
        </p>
      </div>

      <div className="glass-card p-6 sm:p-10 space-y-6 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing and using WaKit, you agree to be bound by these Terms of Service. If you do not agree, please discontinue use of the tools immediately.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <span>2. Trademark & Third-Party Disclaimer</span>
          </h2>
          <p>
            WaKit is an independent open utility application. <strong>WaKit is NOT affiliated, associated, authorized, endorsed by, or in any way officially connected with WhatsApp LLC, Meta Platforms, Inc., or any of their subsidiaries or affiliates.</strong>
          </p>
          <p>
            The official WhatsApp website can be found at <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="text-emerald-500 underline">whatsapp.com</a>. The name "WhatsApp" as well as related names, marks, emblems and images are registered trademarks of Meta Platforms, Inc.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            3. Disclaimer of Warranties
          </h2>
          <p>
            WaKit is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express or implied. Because all media slicing and audio processing occur 100% inside your device's browser, performance depends on your local hardware CPU and RAM resources.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            4. Permissible Use
          </h2>
          <p>
            You agree not to use WaKit to slice or distribute copyrighted videos without authorization or send unsolicited spam messages via WhatsApp direct links.
          </p>
        </section>
      </div>

      <AdBanner type="leaderboard" />
    </div>
  );
};
