import React from 'react';
import { Shield, Lock, EyeOff } from 'lucide-react';
import { AdBanner } from '../components/AdBanner';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
          <Shield className="w-3.5 h-3.5" />
          <span>Last Updated: September 2026</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
          At WaKit, privacy is not a feature—it is our foundational technical architecture.
        </p>
      </div>

      <div className="glass-card p-6 sm:p-10 space-y-6 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-500" />
            <span>1. Zero Server-Side File Storage or Uploads</span>
          </h2>
          <p>
            When you use the <strong>Status Splitter</strong> or <strong>Audio Compressor</strong>, your media files (MP4, MOV, WebM, MP3, WAV) are loaded directly into your web browser's local memory (`Blob` and `ArrayBuffer`). All processing is performed strictly on your CPU using WebAssembly binaries (`@ffmpeg/ffmpeg`).
          </p>
          <p>
            <strong>No files or video data are ever transmitted to any remote server or third party.</strong>
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-emerald-500" />
            <span>2. Phone Numbers & Messages</span>
          </h2>
          <p>
            Phone numbers entered into the <strong>Direct Message (Click-to-Chat)</strong> tool are sanitized standard E.164 strings. They are converted into standard <code>https://wa.me/&lt;number&gt;</code> URLs directly in your browser. WaKit does not log, track, or transmit any phone numbers or pre-filled text messages.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            3. Local Storage & Theme Preferences
          </h2>
          <p>
            We use your browser's standard <code>localStorage</code> solely to save your preferred visual theme choice (Light Mode vs. Dark Mode). No personal identification tokens or tracking identifiers are saved.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            4. Third-Party Advertising & Cookies (Google AdSense)
          </h2>
          <p>
            WaKit may display third-party advertisements (such as Google AdSense) to keep this utility free for all users worldwide. Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites.
          </p>
          <p>
            Users may opt out of personalized advertising by visiting Google's Ads Settings at <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer" className="text-emerald-500 underline">google.com/settings/ads</a>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            5. Contact Us
          </h2>
          <p>
            If you have questions regarding this Privacy Policy or the technical security implementation of WaKit, please feel free to review our open source repository or open an inquiry.
          </p>
        </section>
      </div>

      <AdBanner type="leaderboard" />
    </div>
  );
};
