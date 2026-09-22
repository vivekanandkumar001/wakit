import React from 'react';
import { ShieldCheck, Lock, Cpu, CloudOff, UserX } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-8 pb-10 text-center">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[320px] bg-emerald-500/10 blur-[110px] rounded-full pointer-events-none -z-10 animate-pulse-emerald"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* 100% Private Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold mb-6 backdrop-blur-md shadow-lg shadow-emerald-500/10">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>100% Client-Side • Zero Server Uploads</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-5">
          Private WhatsApp Tools, <br className="hidden sm:block" />
          <span className="text-gradient-emerald">Right in Your Browser</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed mb-8">
          Split long videos into 30s status clips, chat with unsaved numbers, generate instant QR codes, and compress audio — completely client-side, zero app installation.
        </p>

        {/* Quick Trust Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-semibold text-slate-200">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
            <UserX className="w-4 h-4 text-emerald-400" />
            <span>Zero Logins</span>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
            <Cpu className="w-4 h-4 text-amber-400" />
            <span>WASM Powered</span>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
            <CloudOff className="w-4 h-4 text-emerald-400" />
            <span>No Cloud Storage</span>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Zero Data Collection</span>
          </div>
        </div>
      </div>
    </section>
  );
};
