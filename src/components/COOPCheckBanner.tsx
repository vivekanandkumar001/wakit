import React from 'react';
import { ShieldAlert, CheckCircle2, Smartphone, Monitor } from 'lucide-react';
import { checkBrowserCapabilities } from '../utils/browserCapabilities';

interface COOPCheckBannerProps {
  maxLabel?: string;
}

export const COOPCheckBanner: React.FC<COOPCheckBannerProps> = ({ maxLabel }) => {
  const cap = checkBrowserCapabilities();

  if (cap.isFullySupported) {
    return (
      <div className="mb-6 flex flex-col items-start justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 px-4 text-xs text-emerald-800 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
          <span>
            <strong>WebAssembly ready:</strong> local processing is available.
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] font-semibold text-emerald-700">
          <span className="flex items-center gap-1 rounded border border-emerald-200 bg-white px-2 py-0.5">
            {cap.isMobile ? (
              <Smartphone className="h-3 w-3" aria-hidden="true" />
            ) : (
              <Monitor className="h-3 w-3" aria-hidden="true" />
            )}
            {maxLabel ?? (cap.isMobile ? 'Mobile RAM guard (60MB)' : 'Desktop RAM guard (150MB)')}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900 shadow-sm">
      <div className="flex items-start gap-3">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" aria-hidden="true" />
        <div className="space-y-1">
          <h2 className="text-sm font-bold text-amber-900">WebAssembly capability warning</h2>
          <p className="font-medium text-amber-800">
            Your browser does not support high-speed WebAssembly. Please open this link in Google
            Chrome, Edge, or Safari.
          </p>
          {cap.warningReason && (
            <p className="pt-1 font-mono text-[11px] text-amber-700">
              Details: {cap.warningReason}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
