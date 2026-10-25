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

/**
 * Keyword-rich internal cross-linking block.
 * Rendered site-wide from Footer so every route links to all 4
 * dedicated tool landing pages with descriptive anchor text.
 */
export const FooterLinks: React.FC = () => {
  return (
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
  );
};
