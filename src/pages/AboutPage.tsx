import React from 'react';
import { ShieldCheck, Cpu, Lock, Zap, ServerOff, Code2 } from 'lucide-react';
import { AdBanner } from '../components/AdBanner';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
          <Cpu className="w-3.5 h-3.5" />
          <span>WebAssembly & Client-Side Media Processing</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          About WaKit Suite
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
          Discover the zero-server privacy architecture powering WaKit.
        </p>
      </div>

      <div className="glass-card p-6 sm:p-10 space-y-8">
        {/* Core Principles */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-500" />
            <span>The Zero-Server Philosophy</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            Traditional web converters upload your personal videos, photos, and voice notes to remote cloud servers to process them. This creates serious privacy risks, bandwidth usage, and data leakage possibilities.
          </p>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            <strong>WaKit</strong> was built from the ground up to solve this. Using modern <strong>WebAssembly (WASM)</strong> and HTML5 APIs, your browser compiles and executes the exact same FFmpeg media processing binary locally on your computer or mobile device.
          </p>
        </div>

        {/* Technical Architecture Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
              <ServerOff className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">100% Serverless Execution</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Zero backend APIs, zero database storage, zero file uploads. All operations remain entirely in RAM.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">FFmpeg WebAssembly Core</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Empowered by `@ffmpeg/ffmpeg` running in a Web Worker thread, offering lossless stream copying and rapid audio transcoding.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Strict Memory Safety</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Automatic Blob object URL revocation (`URL.revokeObjectURL`) guarantees zero memory leaks or browser slowdowns.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Static Export Architecture</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Hosted on static global edge networks (Cloudflare Pages / Vercel) with full COOP and COEP cross-origin security headers.
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-300 leading-relaxed">
          <strong>Open Web Utility:</strong> WaKit is free to use forever with zero login or subscription. We believe privacy is a fundamental human right.
        </div>
      </div>

      <AdBanner type="leaderboard" />
    </div>
  );
};
