import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck } from 'lucide-react';
import { type FAQItem } from './SEOHead';

export const exactWaKitFaqs: FAQItem[] = [
  {
    question: 'How to split a 2-minute video into 30-second clips for WhatsApp status?',
    answer: 'Simply drag and drop your 2-minute MP4 or MOV video into the 30s Status Video Splitter tool above. WaKit uses WebAssembly (FFmpeg.wasm) inside your browser to cut the video into exact 30-second clips with zero re-encoding quality loss, ready to download as a .zip archive.'
  },
  {
    question: 'How can I send a WhatsApp message without saving the phone number to my contacts?',
    answer: 'Use the Direct Chat tool above: select your country code (e.g., +91 India), enter the 10-digit mobile number, type an optional message or select a preset chip, and click "Open in WhatsApp". It immediately opens WhatsApp using official wa.me universal deep links without clogging your contacts list.'
  },
  {
    question: 'Are my photos, videos, or audio uploaded to any external server?',
    answer: 'No, absolutely zero server uploads! All file slicing, audio compression, and QR rendering occur 100% client-side inside your browser using WebAssembly and HTML5 Canvas APIs. Your files never touch any remote database or cloud server.'
  },
  {
    question: 'What is the maximum audio file size limit for WhatsApp attachments?',
    answer: 'WhatsApp enforces a strict 16MB file size limit for media attachments (audio voice notes, MP3, WAV). The WaKit Audio Compressor accepts source files up to 3GB and transcodes them to 64, 96, or 128 kbps MP3/OPUS so the final file fits under 16MB.'
  },
  {
    question: 'How to create a scan-to-chat WhatsApp QR code for business?',
    answer: 'In the WhatsApp QR Builder card, type your business WhatsApp phone number with country code and add a custom greeting prompt (e.g., "Hi! Inquiring about your services"). WaKit generates a dynamic SVG vector QR code with an embedded WhatsApp center badge for 1-click PNG download.'
  }
];

interface FAQAccordionProps {
  items?: FAQItem[];
  title?: string;
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({
  items = exactWaKitFaqs,
  title = 'Frequently asked questions',
}) => {
  const [openIndexes, setOpenIndexes] = useState<number[]>([0]);

  const toggleItem = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <section
      aria-labelledby="faq-heading"
      className="glass-card my-10 p-5 sm:p-8"
    >
      <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
            <HelpCircle className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 id="faq-heading" className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
              {title}
            </h2>
            <p className="mt-0.5 text-xs text-slate-600">
              Client-side architecture, limits and privacy answers
            </p>
          </div>
        </div>

        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          100% client-side
        </span>
      </div>

      <div className="mt-4 space-y-2.5">
        {items.map((item, index) => {
          const isOpen = openIndexes.includes(index);
          const panelId = `faq-panel-${index}`;
          const buttonId = `faq-button-${index}`;

          return (
            <div
              key={index}
              className={`overflow-hidden rounded-xl border transition-colors duration-200 ${
                isOpen
                  ? 'border-emerald-200 bg-emerald-50/60'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <h3>
                <button
                  type="button"
                  id={buttonId}
                  onClick={() => toggleItem(index)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-sm font-semibold text-slate-800 transition-colors hover:text-emerald-800"
                >
                  <span
                    aria-hidden="true"
                    className={`font-mono text-[10px] font-bold tracking-wider ${
                      isOpen ? 'text-emerald-700' : 'text-slate-600'
                    }`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1">{item.question}</span>
                  <ChevronDown
                    aria-hidden="true"
                    className={`h-4 w-4 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-emerald-600' : 'text-slate-500'
                    }`}
                  />
                </button>
              </h3>

              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="max-w-4xl px-4 pb-4 pl-10 text-xs leading-relaxed text-slate-600 sm:text-[13px]">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
