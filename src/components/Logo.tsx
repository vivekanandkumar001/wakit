import React, { useId } from 'react';
import { Link } from 'react-router-dom';

interface LogoMarkProps {
  className?: string;
  /** Accessible label; omit to render as decorative art. */
  title?: string;
}

/**
 * WaKit brand mark — a geometric "W" cut from a squircle, with a mint signal
 * dot. Drawn from scratch (no WhatsApp or GitHub glyphs) so the identity is
 * unique and safe to use at any size.
 */
export const LogoMark: React.FC<LogoMarkProps> = ({ className = 'h-9 w-9', title }) => {
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, '');
  const tileId = `wakit-tile-${uid}`;
  const shineId = `wakit-shine-${uid}`;

  return (
    <svg
      viewBox="0 0 64 64"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={tileId} x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="52%" stopColor="#059669" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>
        <linearGradient id={shineId} x1="14" y1="6" x2="48" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect x="2" y="2" width="60" height="60" rx="18" fill={`url(#${tileId})`} />
      <path
        d="M12 14c8-6 24-7 34-2 4 2 6 6 6 11v10c0 6-5 10-11 10H27l-9 7v-8c-4-1-6-4-6-8V22c0-3 0-6 0-8Z"
        fill={`url(#${shineId})`}
        opacity="0.55"
      />

      {/* Continuous W ribbon */}
      <path
        d="M14 21.5 23.5 44 32 28.5 40.5 44 50 21.5"
        fill="none"
        stroke="#ffffff"
        strokeWidth="5.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Signal dot: the "live on your device" accent */}
      <circle cx="49.5" cy="15.5" r="4" fill="#a7f3d0" stroke="#ffffff" strokeWidth="1.8" />
    </svg>
  );
};

interface LogoProps {
  className?: string;
  /** Hide the "Private WhatsApp tools" strapline. */
  compact?: boolean;
  /** Render as a plain span instead of a link (e.g. inside another link). */
  asLink?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', compact = false, asLink = true }) => {
  const content = (
    <>
      <LogoMark className="h-9 w-9 shrink-0 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105" />
      <span className="flex flex-col leading-none">
        <span className="text-[1.15rem] font-extrabold tracking-[-0.03em] text-slate-900">
          Wa<span className="text-emerald-700">Kit</span>
        </span>
        {!compact && (
          <span className="mt-1 hidden text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500 sm:block">
            Private WhatsApp tools
          </span>
        )}
      </span>
    </>
  );

  const shared = `group inline-flex items-center gap-2.5 ${className}`;

  if (!asLink) {
    return <span className={shared}>{content}</span>;
  }

  return (
    <Link to="/" className={shared}>
      {content}
    </Link>
  );
};
