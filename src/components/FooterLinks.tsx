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
    label: 'Compress Audio for WhatsApp (16MB)',
    hint: 'Shrink MP3/WAV/M4A under the 16MB limit',
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
      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
        WhatsApp Tools
      </h2>
      <ul className="space-y-2.5 text-xs mt-3">
        {TOOL_LINKS.map((tool) => (
          <li key={tool.to}>
            <Link
              to={tool.to}
              title={tool.hint}
              className="hover:text-emerald-400 transition-colors"
            >
              {tool.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
