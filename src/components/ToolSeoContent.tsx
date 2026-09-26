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
}

/**
 * Shared programmatic-SEO content block rendered on every dedicated tool route:
 * a How-To section (mirrors the HowTo JSON-LD injected by SEOHead) plus a
 * "why client-side WebAssembly beats cloud-upload converters" explainer.
 * Uses strict h2 -> h3 hierarchy (page h1 lives in the tool header above).
 */
export const ToolSeoContent: React.FC<ToolSeoContentProps> = ({ toolName, steps, intro }) => {
  return (
    <>
      <section aria-labelledby="howto-heading" className="space-y-6 my-10">
        <h2 id="howto-heading" className="text-xl font-bold text-slate-900 dark:text-white text-center">
          How to Use the {toolName} in 3 Steps
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-center leading-relaxed">
          {intro}
        </p>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 list-none p-0 m-0">
          {steps.map((step, index) => (
            <li key={step.name} className="glass-card p-6 space-y-3 text-center">
              <div
                aria-hidden="true"
                className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto font-bold text-lg"
              >
                {index + 1}
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">{step.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="wasm-heading" className="glass-card p-6 sm:p-8 space-y-3">
        <h2
          id="wasm-heading"
          className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"
        >
          <ShieldCheck aria-hidden="true" className="w-5 h-5 text-emerald-500" />
          <span>Why Client-Side WebAssembly Is Safer Than Cloud-Upload Converters</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Cloud-upload converters make you send personal videos, voice notes, and phone numbers to
          a remote server — where files can be stored, scanned, or leaked long after you click
          “convert”. {toolName} works differently: it runs FFmpeg compiled to WebAssembly inside
          your browser’s sandbox, so every byte is processed in your device’s local memory and
          nothing is ever transmitted, logged, or retained. No accounts, no queues, no waiting
          rooms — just instant, private results, even on slow networks.
        </p>
      </section>
    </>
  );
};
