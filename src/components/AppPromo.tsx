import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  CloudOff,
  Download,
  LayoutGrid,
  QrCode,
  Scissors,
  Smartphone,
  Sparkles,
  Sticker,
  Zap,
} from 'lucide-react';
import { LogoMark } from './Logo';
import { useInstallPrompt } from '../hooks/useInstallPrompt';

const appPerks = [
  { icon: Zap, label: 'One-tap launch' },
  { icon: CloudOff, label: 'Offline app shell' },
  { icon: Smartphone, label: 'Home-screen icon' },
];

const mockTiles = [
  { icon: Scissors, label: 'Status split', tone: 'bg-emerald-50 text-emerald-700' },
  { icon: Sticker, label: 'Stickers', tone: 'bg-amber-50 text-amber-700' },
  { icon: QrCode, label: 'QR codes', tone: 'bg-sky-50 text-sky-700' },
  { icon: LayoutGrid, label: 'Grid plan', tone: 'bg-rose-50 text-rose-600' },
];

/**
 * Homepage install pitch: a dark emerald band with a CSS phone mockup and a
 * real install action (native prompt where available, /app guide otherwise).
 */
export const AppPromo: React.FC = () => {
  const { canInstall, isInstalled, isBusy, promptInstall } = useInstallPrompt();

  return (
    <section
      aria-labelledby="app-promo-heading"
      className="relative overflow-hidden rounded-[1.75rem] border border-emerald-900/20 bg-[linear-gradient(120deg,#022c22_0%,#064e3b_52%,#0f766e_100%)] px-5 py-7 text-white shadow-[0_28px_70px_-40px_rgba(2,44,34,0.85)] sm:px-8 sm:py-9"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -bottom-24 left-1/4 h-56 w-56 rounded-full bg-teal-300/15 blur-3xl" />
        <div className="absolute right-24 top-8 h-40 w-40 rounded-full border border-white/10" />
      </div>

      <div className="relative grid gap-7 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:items-center md:gap-8">
        <div className="text-center md:text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-amber-300">
            <Smartphone className="h-3.5 w-3.5" aria-hidden="true" />
            WaKit app
          </span>

          <h2
            id="app-promo-heading"
            className="mt-3 text-2xl font-extrabold leading-tight tracking-[-0.03em] sm:text-3xl"
          >
            Install WaKit on your phone.
          </h2>

          <p className="mx-auto mt-3 max-w-lg text-[13px] leading-relaxed text-emerald-100/85 sm:text-sm md:mx-0">
            Add WaKit to your home screen and open any tool full-screen — no Play Store, no APK
            file, no signup. The app shell stays cached, so your toolkit is one tap away even on
            a weak connection.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 md:justify-start">
            {appPerks.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/10 px-2.5 py-1 text-[10.5px] font-bold text-emerald-50"
              >
                <Icon className="h-3.5 w-3.5 text-emerald-300" aria-hidden="true" />
                {label}
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:justify-start">
            {isInstalled ? (
              <span className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/12 px-5 py-3 text-sm font-bold text-emerald-50 ring-1 ring-white/20 sm:w-auto">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" aria-hidden="true" />
                Installed on this device
              </span>
            ) : canInstall ? (
              <button
                type="button"
                onClick={() => {
                  void promptInstall();
                }}
                disabled={isBusy}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-extrabold text-emerald-950 shadow-lg shadow-emerald-950/30 transition-colors hover:bg-amber-300 disabled:opacity-70 sm:w-auto"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                {isBusy ? 'Opening installer…' : 'Install the app'}
              </button>
            ) : (
              <Link
                to="/app"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-extrabold text-emerald-950 shadow-lg shadow-emerald-950/30 transition-colors hover:bg-amber-300 sm:w-auto"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Install the app
              </Link>
            )}

            <Link
              to="/app"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/15 sm:w-auto"
            >
              See install steps
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-[10.5px] font-medium text-emerald-100/70 md:justify-start">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
            Works on Android Chrome, iPhone Safari and desktop Chrome/Edge.
          </p>
        </div>

        {/* Phone mockup, pure CSS so there is no extra image to download */}
        <div aria-hidden="true" className="relative mx-auto w-full max-w-[230px]">
          <div className="relative rounded-[2.3rem] border-[6px] border-slate-950/80 bg-slate-950 p-1 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.6)]">
            <div className="overflow-hidden rounded-[1.85rem] bg-white">
              <div className="relative bg-[linear-gradient(115deg,#022c22,#065f46)] px-3 pb-3 pt-2.5 text-white">
                <div className="flex items-center justify-between text-[8px] font-semibold text-emerald-100/80">
                  <span>9:41</span>
                  <span className="tracking-[0.2em]">•••</span>
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <LogoMark className="h-5 w-5" />
                  <span className="text-[11px] font-extrabold tracking-tight">
                    Wa<span className="text-amber-300">Kit</span>
                  </span>
                  <span className="ml-auto rounded-full bg-emerald-400/20 px-1.5 py-0.5 text-[6.5px] font-bold text-emerald-100">
                    installed
                  </span>
                </div>
                <div className="mt-2 flex h-6 items-center gap-1 rounded-lg bg-white/15 px-2 text-[7px] text-emerald-50/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  Search 16 private tools…
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5 p-2">
                {mockTiles.map(({ icon: Icon, label, tone }) => (
                  <div key={label} className="rounded-xl border border-slate-200 bg-white p-1.5">
                    <span className={`grid h-5 w-5 place-items-center rounded-md ${tone}`}>
                      <Icon className="h-3 w-3" aria-hidden="true" />
                    </span>
                    <p className="mt-1 truncate text-[7px] font-bold text-slate-800">{label}</p>
                    <p className="text-[6px] font-medium text-slate-600">0 uploads</p>
                  </div>
                ))}
              </div>

              <div className="mx-2 mb-2 flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1.5 text-[6.5px] font-bold text-emerald-800">
                <CloudOff className="h-2.5 w-2.5" aria-hidden="true" />
                App shell cached · private by default
              </div>

              <div className="flex items-center justify-around border-t border-slate-100 bg-slate-50 px-2 py-1.5 text-[6px] font-bold text-slate-600">
                <span className="text-emerald-700">Home</span>
                <span>Studio</span>
                <span>App</span>
              </div>
            </div>
          </div>

          <span className="absolute -left-3 top-16 inline-flex items-center gap-1 rounded-full border border-white/20 bg-white px-2 py-1 text-[8.5px] font-extrabold text-emerald-800 shadow-lg">
            <Zap className="h-2.5 w-2.5" aria-hidden="true" />
            Opens instantly
          </span>
          <span className="absolute -right-2 bottom-20 inline-flex items-center gap-1 rounded-full border border-white/20 bg-white px-2 py-1 text-[8.5px] font-extrabold text-emerald-800 shadow-lg">
            <Sparkles className="h-2.5 w-2.5 text-amber-500" aria-hidden="true" />
            No store
          </span>
        </div>
      </div>
    </section>
  );
};
