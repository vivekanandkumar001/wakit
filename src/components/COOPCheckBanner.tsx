import React from 'react';
import { ShieldAlert, CheckCircle2, Smartphone, Monitor } from 'lucide-react';
import { checkBrowserCapabilities } from '../utils/browserCapabilities';

export const COOPCheckBanner: React.FC = () => {
  const cap = checkBrowserCapabilities();

  if (cap.isFullySupported) {
    return (
      <div className="mb-6 p-3 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>
            <strong>Hardware Acceleration Active:</strong> WebAssembly engine is ready.
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded">
            {cap.isMobile ? <Smartphone className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
            {cap.isMobile ? 'Mobile RAM Guard (60MB Limit)' : 'Desktop RAM Guard (150MB Limit)'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs leading-relaxed shadow-sm">
      <div className="flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-sm text-amber-900 dark:text-amber-200">
            WebAssembly Capability Warning
          </h4>
          <p className="font-medium text-amber-800 dark:text-amber-300">
            Your browser does not support high-speed WebAssembly. Please open this link in Google Chrome, Edge, or Safari.
          </p>
          {cap.warningReason && (
            <p className="text-[11px] text-amber-700 dark:text-amber-400 font-mono pt-1">
              Details: {cap.warningReason}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
