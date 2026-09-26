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
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20 group-hover:scale-105 group-hover:shadow-emerald-500/35 transition-all duration-300">
              <svg
                aria-hidden="true"
                focusable="false"
                className="w-6 h-6 fill-slate-950"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                <path
                  d="M13 5L8.5 12H12l-1 6 5.5-7H13l1-6z"
                  fill="#25D366"
                />
              </svg>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 animate-ping opacity-75"></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950"></div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  Whats<span className="text-emerald-400">Swift</span>
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
