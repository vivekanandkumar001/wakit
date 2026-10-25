import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, Megaphone } from 'lucide-react';

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
    console.warn('AdSense script error caught by boundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex w-full items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-center text-[11px] text-slate-500"
          style={{ minHeight: `${this.props.fallbackHeight || 90}px` }}
        >
          <span className="flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
            Advertisement space (blocked by your browser)
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
  adSlot?: string; // e.g. "9876543210"
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  type,
  adClient,
  adSlot,
  className = '',
}) => {
  const isBox = type === 'mobile' || type === 'rectangle';
  const minHeight = isBox ? 250 : 90;

  const label = (
    <span className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
      <Megaphone className="h-3 w-3 text-amber-500" aria-hidden="true" />
      Advertisement
    </span>
  );

  if (adClient && adSlot) {
    return (
      <aside aria-label="Advertisement" className={`my-6 flex w-full flex-col items-center ${className}`}>
        {label}
        <AdSenseErrorBoundary fallbackHeight={minHeight}>
          <div
            className="flex w-full items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
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
      </aside>
    );
  }

  return (
    <aside
      aria-label="Advertisement"
      className={`my-6 flex w-full flex-col items-center ${className}`}
    >
      {label}
      <div
        className={`flex items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 ${
          isBox ? 'w-[300px]' : 'w-full max-w-[728px]'
        }`}
        style={{ minHeight: `${minHeight}px` }}
      >
        <span className="text-[11px] font-medium text-slate-500">Ad space</span>
      </div>
    </aside>
  );
};
