import React from 'react';
import { Link } from 'react-router-dom';

const TOOL_LINKS = [
  {
    to: '/whatsapp-status-splitter',
    label: 'WhatsApp Status Video Splitter Online',
    hint: 'Cut videos into exact 30-second status clips',
  },
  {
    to: '/direct-chat-without-saving-number',
    label: 'Send WhatsApp Message Without Saving Number',
    hint: 'Direct chat via official wa.me links',
  },
  {
    to: '/whatsapp-qr-code-generator',
    label: 'WhatsApp Link & QR Code Generator',
    hint: 'Scan-to-chat, Wi-Fi & payment QR codes',
  },
  {
    to: '/whatsapp-audio-compressor',
    label: 'Compress Audio for WhatsApp (up to 3GB)',
    hint: 'Shrink MP3/WAV/M4A up to 3GB under the 16MB limit',
  },
];

const CREATOR_LINKS = [
  {
    to: '/social-tools',
    label: 'Creator Studio — All 12 Social Tools',
    hint: 'WhatsApp, Instagram, Facebook and cross-platform utilities',
  },
  {
    to: '/whatsapp-sticker-maker',
    label: 'WhatsApp Sticker Maker & Pack Export',
    hint: 'Turn photos into 512px stickers with a local ZIP pack',
  },
  {
    to: '/instagram-grid-planner',
    label: 'Instagram Grid Planner & Feed Preview',
    hint: 'Arrange a 3-column feed and export a PNG mockup',
  },
  {
    to: '/social-batch-resizer',
    label: 'Social Image Batch Resizer + UTM QR',
    hint: 'Resize for every platform and build trackable links',
  },
];

/**
 * Keyword-rich internal cross-linking block.
 * Rendered site-wide from Footer so every route links to the core WhatsApp
 * tools and the broader Creator Studio workflows.
 */
export const FooterLinks: React.FC = () => {
  return (
    <div className="space-y-5">
      <nav aria-label="WhatsApp tools">
        <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-900">
          WhatsApp tools
        </h2>
        <ul className="mt-3 space-y-2.5 text-xs text-slate-600">
          {TOOL_LINKS.map((tool) => (
            <li key={tool.to}>
              <Link
                to={tool.to}
                title={tool.hint}
                className="transition-colors hover:text-emerald-700"
              >
                {tool.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <nav aria-label="Creator Studio tools">
        <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-900">
          Creator Studio
        </h2>
        <ul className="mt-3 space-y-2.5 text-xs text-slate-600">
          {CREATOR_LINKS.map((tool) => (
            <li key={tool.to}>
              <Link
                to={tool.to}
                title={tool.hint}
                className="transition-colors hover:text-emerald-700"
              >
                {tool.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
