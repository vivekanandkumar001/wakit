import React from 'react';
import { ShieldCheck, Cpu, Lock, Zap, ServerOff, Layers } from 'lucide-react';
import { AdBanner } from '../components/AdBanner';
import { SEOHead } from '../components/SEOHead';
import { PageHeader } from '../components/PageHeader';

const principles = [
  {
    icon: ServerOff,
    title: '100% serverless execution',
    text: 'Zero backend APIs, zero database storage, zero file uploads. All operations remain entirely in RAM.',
  },
  {
    icon: Zap,
    title: 'FFmpeg WebAssembly core',
    text: '@ffmpeg/ffmpeg runs in a Web Worker, enabling lossless stream copying and fast local audio transcoding.',
  },
  {
    icon: ShieldCheck,
    title: 'Strict memory safety',
    text: 'Blob URLs are revoked after use and files are dropped when you clear a tool, so old media does not linger.',
  },
  {
    icon: Layers,
    title: 'Static, edge-friendly build',
    text: 'A static site with COOP and COEP headers so the WebAssembly worker can run safely in your browser.',
  },
];

export const AboutPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <SEOHead
        title="About WaKit — How Our Browser-Based WhatsApp Tools Work"
        description="How WaKit runs WhatsApp video splitting, QR generation and audio compression entirely in your browser with FFmpeg WebAssembly, plus what the tools cannot do."
        canonicalPath="/about"
        breadcrumbs={[{ name: 'About' }]}
      />

      <PageHeader
        icon={Cpu}
        eyebrow="About WaKit"
        title="Built for privacy, not data collection"
        description="Discover the zero-server architecture that powers every WaKit utility."
        breadcrumbs={[{ name: 'About' }]}
      />

      <div className="glass-card space-y-8 p-6 sm:p-10">
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
            <Lock className="h-5 w-5 text-emerald-600" aria-hidden="true" />
            <span>The zero-server philosophy</span>
          </h2>
          <p className="text-sm leading-relaxed text-slate-600">
            Traditional web converters upload your personal videos, photos, and voice notes to
            remote cloud servers to process them. That creates serious privacy risks, bandwidth
            usage, and data-leakage possibilities.
          </p>
          <p className="text-sm leading-relaxed text-slate-600">
            <strong className="text-slate-900">WaKit</strong> was built to solve this. Using modern{' '}
            <strong className="text-slate-900">WebAssembly (WASM)</strong> and HTML5 APIs, your
            browser runs the same FFmpeg media-processing binary locally on your computer or phone.
            The file never has to travel anywhere.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {principles.map(({ icon: Icon, title, text }) => (
            <div key={title} className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 ring-1 ring-emerald-200">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">{title}</h3>
              <p className="text-xs leading-relaxed text-slate-600">{text}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs leading-relaxed text-emerald-900">
          <strong>Independent utility:</strong> WaKit is free to use with no account and no
          subscription. Files you open are never sent to us or sold to anyone.
        </div>
      </div>

      <AdBanner type="leaderboard" />
    </div>
  );
};
