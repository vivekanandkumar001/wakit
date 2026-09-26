import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Cpu, Heart, MessageSquare, Code } from 'lucide-react';
import { FooterLinks } from './FooterLinks';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-auto border-t border-slate-800 bg-slate-950/90 backdrop-blur-xl pt-12 pb-8 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/20">
                <MessageSquare className="w-5 h-5 fill-slate-950 stroke-none" />
              </div>
              <span className="font-extrabold text-xl text-white">
                Whats<span className="text-emerald-400">Swift</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              A 100% client-side, zero-upload WhatsApp utility toolkit. All status video slicing, direct messaging links, vector QR codes, and audio compression run locally in your browser using WebAssembly & HTML5.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-emerald-400 pt-1">
              <span className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                <Lock className="w-3.5 h-3.5" /> 100% Private
              </span>
              <span className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                <Cpu className="w-3.5 h-3.5" /> WASM Engine
              </span>
              <span className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                <Shield className="w-3.5 h-3.5" /> Zero Uploads
              </span>
            </div>
          </div>

          {/* Keyword-rich internal cross-linking (all 4 tool landing routes) */}
          <FooterLinks />

          {/* Legal & GitHub */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Legal & Open Source
            </h2>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/privacy-policy" className="hover:text-emerald-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-emerald-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors">
                  About WhatsSwift
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>GitHub Repository</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 space-y-1 mb-6">
          <p>
            <strong>Disclaimer:</strong> WhatsSwift is an independent open-source utility project and is not affiliated, associated, authorized, endorsed by, or in any way officially connected with WhatsApp LLC, Meta Platforms, Inc., or any of their subsidiaries or affiliates.
          </p>
        </div>

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 border-t border-slate-800/80 pt-6">
          <p>© {new Date().getFullYear()} WhatsSwift Utility Toolkit. 100% Client-Side WebAssembly.</p>
          <p className="flex items-center gap-1">
            <span>Built for privacy & browser performance</span>
            <Heart className="w-3.5 h-3.5 text-emerald-400 fill-current" />
          </p>
        </div>
      </div>
    </footer>
  );
};
