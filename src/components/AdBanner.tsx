import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { Sparkles, Megaphone, ShieldCheck, AlertCircle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackHeight?: number;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class AdSenseErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('AdSense Script Error caught by Boundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          className="w-full rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 flex items-center justify-center p-3 text-center text-xs text-slate-400"
          style={{ minHeight: `${this.props.fallbackHeight || 90}px` }}
        >
          <span className="flex items-center gap-1.5 text-[11px]">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Ad space reserved (Script prevented by browser extensions)</span>
          </span>
        </div>
      );
    }

    return this.props.children;
  }
}

interface AdBannerProps {
  type: 'leaderboard' | 'mobile' | 'rectangle' | 'banner';
  adClient?: string; // e.g. "ca-pub-1234567890"
  adSlot?: string;   // e.g. "9876543210"
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  type,
  adClient,
  adSlot,
  className = '',
}) => {
  const minHeight = type === 'mobile' || type === 'rectangle' ? 250 : 90;

  // If real AdSense credentials are passed, render Google AdSense ins tag wrapped in ErrorBoundary with CLS protection
  if (adClient && adSlot) {
    return (
      <div className={`w-full flex flex-col items-center my-6 ${className}`}>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase mb-1.5 bg-slate-200/80 text-slate-600 dark:bg-slate-800/80 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
          <Megaphone className="w-3 h-3 text-amber-500" />
          <span>Advertisement</span>
        </div>
        <AdSenseErrorBoundary fallbackHeight={minHeight}>
          <div
            className="w-full flex justify-center items-center overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
            style={{ minHeight: `${minHeight}px` }}
          >
            <ins
              className="adsbygoogle"
              style={{
                display: 'block',
                width: '100%',
                minHeight: `${minHeight}px`,
              }}
              data-ad-client={adClient}
              data-ad-slot={adSlot}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>
        </AdSenseErrorBoundary>
      </div>
    );
  }

  // Placeholder with CLS Reservation Style (min-height)
  if (type === 'leaderboard') {
    return (
      <div className={`w-full flex flex-col items-center my-6 ${className}`}>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase mb-1.5 bg-amber-500/15 text-amber-800 dark:bg-amber-400/10 dark:text-amber-300 border border-amber-500/30 dark:border-amber-400/20">
          <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span>Sponsored Advertisement</span>
        </div>
        <div
          style={{ minHeight: '90px' }}
          className="w-full max-w-[728px] rounded-2xl border-2 border-dashed border-emerald-500/30 dark:border-emerald-500/20 bg-gradient-to-r from-emerald-50/90 via-teal-50/50 to-slate-50/90 dark:from-slate-900/90 dark:via-slate-900/80 dark:to-slate-950/90 shadow-md shadow-emerald-500/5 dark:shadow-none flex items-center justify-between px-6 py-2 overflow-hidden transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Megaphone className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block">
                Google AdSense Responsive Leaderboard (728x90)
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                CLS Protected • Credentialless COEP Compatible
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-white/80 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-emerald-500/20 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AdSense Ready</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'mobile' || type === 'rectangle') {
    return (
      <div className={`w-full flex flex-col items-center my-6 ${className}`}>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase mb-1.5 bg-amber-500/15 text-amber-800 dark:bg-amber-400/10 dark:text-amber-300 border border-amber-500/30 dark:border-amber-400/20">
          <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span>Sponsored Advertisement</span>
        </div>
        <div
          style={{ minHeight: '250px' }}
          className="w-[300px] rounded-2xl border-2 border-dashed border-emerald-500/30 dark:border-emerald-500/20 bg-gradient-to-b from-white via-slate-50 to-emerald-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 shadow-md shadow-emerald-500/5 dark:shadow-none flex flex-col items-center justify-center p-5 text-center space-y-3 transition-colors"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
            <Megaphone className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block">
              Mobile Ad Slot (300x250)
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block leading-tight">
              Adaptive CLS Reservation Reserved
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-white/90 dark:bg-slate-800 px-3 py-1 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" />
            <span>Monetization Slot</span>
          </span>
        </div>
      </div>
    );
  }

  return null;
};
