import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Cpu, Heart, MessageSquare } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-auto border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md pt-10 pb-8 text-slate-600 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold">
                <MessageSquare className="w-4 h-4 fill-current stroke-emerald-600" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">WaKit</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
              A 100% serverless, zero-friction WhatsApp utility suite. All video slicing, audio compression, and link generation occur strictly inside your browser using WebAssembly & HTML5. No user data or uploaded media ever touches a remote server.
            </p>
            <div className="flex items-center gap-4 text-xs font-medium text-emerald-600 dark:text-emerald-400 pt-1">
              <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> 100% Private</span>
              <span className="flex items-center gap-1"><Cpu className="w-3.5 h-3.5" /> WASM Engine</span>
              <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> Zero Uploads</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Programmatic Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/split-video-for-whatsapp-status" className="hover:text-emerald-500 transition-colors">
                  WhatsApp Status Splitter
                </Link>
              </li>
              <li>
                <Link to="/send-whatsapp-without-saving-number" className="hover:text-emerald-500 transition-colors">
                  Direct Message (Click-to-Chat)
                </Link>
              </li>
              <li>
                <Link to="/whatsapp-qr-code-generator" className="hover:text-emerald-500 transition-colors">
                  WhatsApp QR & Link Generator
                </Link>
              </li>
              <li>
                <Link to="/compress-audio-for-whatsapp" className="hover:text-emerald-500 transition-colors">
                  Voice Note & Audio Compressor
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Legal & Support
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-emerald-500 transition-colors">
                  About WaKit Architecture
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-emerald-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-emerald-500 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-emerald-500 transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1 mb-6">
          <p>
            <strong>Disclaimer:</strong> WaKit is an independent open utility project and is not affiliated, associated, authorized, endorsed by, or in any way officially connected with WhatsApp LLC, Meta Platforms, Inc., or any of their subsidiaries or affiliates.
          </p>
          <p>
            The official WhatsApp website can be found at <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="underline hover:text-emerald-500">whatsapp.com</a>. "WhatsApp" as well as related names, marks, emblems and images are registered trademarks of their respective owners.
          </p>
        </div>

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 dark:text-slate-500 border-t border-slate-200/60 dark:border-slate-800/60 pt-6">
          <p>© {new Date().getFullYear()} WaKit Utility Suite. Built with WebAssembly, Vite, and React.</p>
          <p className="flex items-center gap-1">
            <span>Crafted for privacy & speed</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
          </p>
        </div>
      </div>
    </footer>
  );
};
