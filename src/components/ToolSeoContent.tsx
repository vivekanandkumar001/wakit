import React from 'react';
import { ShieldCheck } from 'lucide-react';
import type { HowToStep } from './SEOHead';

interface ToolSeoContentProps {
  /** e.g. "WhatsApp Status Video Splitter" */
  toolName: string;
  /** Exactly 3 steps; also fed to the HowTo schema via SEOHead. */
  steps: [HowToStep, HowToStep, HowToStep];
  /** 1–2 sentence keyword-rich intro shown above the steps. */
  intro: string;
  /** Optional privacy explainer heading for non-FFmpeg tools. */
  securityHeading?: string;
  /** Optional privacy explainer body for non-FFmpeg tools. */
  securityText?: string;
}

/**
 * Shared programmatic-SEO content block rendered on every dedicated tool route:
 * a How-To section (mirrors the HowTo JSON-LD injected by SEOHead) plus a
 * "why client-side WebAssembly beats cloud-upload converters" explainer.
 * Uses strict h2 -> h3 hierarchy (page h1 lives in the tool header above).
 */
export const ToolSeoContent: React.FC<ToolSeoContentProps> = ({
  toolName,
  steps,
  intro,
  securityHeading = 'Why Client-Side WebAssembly Is Safer Than Cloud-Upload Converters',
  securityText,
}) => {
  return (
    <>
      <section aria-labelledby="howto-heading" className="my-10 space-y-6">
        <h2 id="howto-heading" className="text-center text-xl font-bold text-slate-900">
          How to Use the {toolName} in 3 Steps
        </h2>
        <p className="mx-auto max-w-2xl text-center text-sm leading-relaxed text-slate-600">
          {intro}
        </p>
        <ol className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.name} className="glass-card space-y-3 p-6 text-center">
              <div
                aria-hidden="true"
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-lg font-bold text-emerald-700 ring-1 ring-emerald-200"
              >
                {index + 1}
              </div>
              <h3 className="text-base font-bold text-slate-900">{step.name}</h3>
              <p className="text-xs leading-relaxed text-slate-600">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="wasm-heading" className="glass-card space-y-3 p-6 sm:p-8">
        <h2
          id="wasm-heading"
          className="flex items-center gap-2 text-lg font-bold text-slate-900"
        >
          <ShieldCheck aria-hidden="true" className="h-5 w-5 text-emerald-600" />
          <span>{securityHeading}</span>
        </h2>
        <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
          {securityText ??
            `Cloud-upload converters make you send personal videos, voice notes, and phone numbers to a remote server — where files can be stored, scanned, or leaked long after you click “convert”. ${toolName} works differently: it runs inside your browser’s sandbox, so every byte is processed in your device’s local memory and nothing is ever transmitted, logged, or retained. No accounts, no queues, no waiting rooms — just instant, private results, even on slow networks.`}
        </p>
      </section>
    </>
  );
};
