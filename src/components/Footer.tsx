import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Heart, Lock, Shield } from 'lucide-react';
import { FooterLinks } from './FooterLinks';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 mt-auto w-full border-t border-slate-200 bg-white/80 pt-12 pb-8 text-slate-600 backdrop-blur-xl">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

      <div className="mx-auto w-full max-w-[1200px] px-5">
        <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-4 lg:col-span-2">
            <Logo compact />
            <p className="max-w-md text-xs leading-relaxed text-slate-600">
              A 100% client-side, zero-upload social toolkit. Status video slicing, direct
              message links, QR tools, audio compression, sticker packs, feed planning and
              cover design all run locally in your browser using Canvas, WebAssembly and
              HTML5.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                <Lock className="h-3.5 w-3.5" aria-hidden="true" /> 100% private
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                <Cpu className="h-3.5 w-3.5 text-teal-600" aria-hidden="true" /> WASM engine
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                <Shield className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" /> Zero uploads
              </span>
            </div>
          </div>

          {/* Keyword-rich internal cross-linking (all 4 tool landing routes) */}
          <FooterLinks />

          {/* Legal & company */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-900">
              Legal &amp; company
            </h2>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/privacy-policy" className="transition-colors hover:text-emerald-700">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="transition-colors hover:text-emerald-700">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/about" className="transition-colors hover:text-emerald-700">
                  About WaKit
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition-colors hover:text-emerald-700">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-[11px] leading-relaxed text-slate-600">
          <p>
            <strong className="text-slate-800">Disclaimer:</strong> WaKit is an independent
            utility project and is not affiliated, associated, authorized, endorsed by, or in any
            way officially connected with WhatsApp LLC, Meta Platforms, Inc., or any of their
            subsidiaries or affiliates.
          </p>
        </div>

        {/* Copyright */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 text-[11px] text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} WaKit Utility Toolkit. 100% client-side WebAssembly.</p>
          <p className="flex items-center gap-1.5">
            Built for privacy &amp; browser performance
            <Heart className="h-3.5 w-3.5 fill-current text-emerald-500" aria-hidden="true" />
          </p>
        </div>
      </div>
    </footer>
  );
};
