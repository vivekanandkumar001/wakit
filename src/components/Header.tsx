import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Code } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/favicon.svg"
              alt=""
              aria-hidden="true"
              className="w-10 h-10 rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105"
            />

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  Wa<span className="text-emerald-400">Kit</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  v2.0 Client
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium leading-none">
                Private WhatsApp Utilities
              </p>
            </div>
          </Link>

          {/* Active Badge & External Link */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Client-Side (Zero Server Uploads)</span>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>WASM Powered</span>
            </div>

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 transition-all"
              aria-label="View Source Code"
            >
              <Code className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
