import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Download, ShieldCheck, X } from 'lucide-react';
import { LogoMark } from './Logo';
import {
  dismissInstallBanner,
  isInstallBannerDismissed,
  useInstallPrompt,
} from '../hooks/useInstallPrompt';

/**
 * Floating mobile install nudge. Only appears when the browser can actually
 * install the app (Android/Chrome) or when iOS needs manual Add-to-Home-Screen
 * instructions. Desktop keeps the header pill + homepage promo instead.
 */
export const InstallAppBanner: React.FC = () => {
  const { canInstall, isInstalled, isBusy, isIos, promptInstall } = useInstallPrompt();
  const [dismissed, setDismissed] = useState<boolean>(() => isInstallBannerDismissed());
  const { pathname } = useLocation();

  // The install page already owns the primary call to action.
  if (pathname === '/app' || pathname === '/download') return null;
  if (dismissed || isInstalled) return null;
  if (!canInstall && !isIos) return null;

  const close = () => {
    dismissInstallBanner();
    setDismissed(true);
  };

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 px-3 min-[900px]:hidden"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <div className="mx-auto flex max-w-xl items-center gap-2.5 rounded-2xl border border-emerald-900/10 bg-white/95 p-2.5 shadow-[0_18px_45px_-18px_rgba(2,44,34,0.5)] backdrop-blur-xl">
        <LogoMark className="h-10 w-10 shrink-0" />

        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-[12.5px] font-extrabold leading-tight text-slate-900">
            Install WaKit
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
          </p>
          <p className="mt-0.5 truncate text-[11px] text-slate-500">
            Home-screen icon · works without a store
          </p>
        </div>

        {canInstall ? (
          <button
            type="button"
            onClick={() => {
              void promptInstall().then((result) => {
                if (result === 'accepted') close();
              });
            }}
            disabled={isBusy}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-emerald-700 px-3 py-2 text-[11.5px] font-bold text-white shadow-sm transition-colors hover:bg-emerald-800 disabled:opacity-60"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            {isBusy ? 'Adding…' : 'Install'}
          </button>
        ) : (
          <Link
            to="/app"
            onClick={close}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-emerald-700 px-3 py-2 text-[11.5px] font-bold text-white shadow-sm transition-colors hover:bg-emerald-800"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            Add
          </Link>
        )}

        <button
          type="button"
          onClick={close}
          aria-label="Dismiss install banner"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
