import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck } from 'lucide-react';
import { type FAQItem } from './SEOHead';

export const exactWhatsSwiftFaqs: FAQItem[] = [
  {
    question: 'How to split a 2-minute video into 30-second clips for WhatsApp status?',
    answer: 'Simply drag and drop your 2-minute MP4 or MOV video into the 30s Status Video Splitter tool above. WhatsSwift uses WebAssembly (FFmpeg.wasm) inside your browser to cut the video into exact 30-second clips with zero re-encoding quality loss, ready to download as a .zip archive.'
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
    answer: 'WhatsApp enforces a strict 16MB file size limit for media attachments (audio voice notes, MP3, WAV). The WhatsSwift Audio Compressor transcodes heavy audio files down to < 16MB, 8MB, or 4MB targets so they send instantly as attachments.'
  },
  {
    question: 'How to create a scan-to-chat WhatsApp QR code for business?',
    answer: 'In the WhatsApp QR Builder card, type your business WhatsApp phone number with country code and add a custom greeting prompt (e.g., "Hi! Inquiring about your services"). WhatsSwift generates a dynamic SVG vector QR code with an embedded WhatsApp center badge for 1-click PNG download.'
  }
];

interface FAQAccordionProps {
  items?: FAQItem[];
  title?: string;
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({
  items = exactWhatsSwiftFaqs,
  title = 'Frequently Asked Questions & Search Index',
}) => {
  const [openIndexes, setOpenIndexes] = useState<number[]>([0, 1]);

  const toggleItem = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <section className="glass-card p-6 sm:p-8 space-y-6 my-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
            <p className="text-xs text-slate-400">Client-Side Architecture & Utility Information</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>100% Client-Side</span>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => {
          const isOpen = openIndexes.includes(index);
          return (
            <div
              key={index}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-slate-900/90 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleItem(index)}
                className="w-full p-4 sm:p-4.5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-slate-200 hover:text-emerald-400 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-emerald-400' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4.5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pl-8">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
