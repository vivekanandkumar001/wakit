import React, { useId } from 'react';
import { Link } from 'react-router-dom';

interface LogoMarkProps {
  className?: string;
  /** Accessible label; omit to render as decorative art. */
  title?: string;
}

/**
 * WaKit brand mark — a geometric W ribbon on a deep emerald content tile,
 * finished with an amber creator spark. Drawn from scratch (no WhatsApp or
 * GitHub glyphs) so the identity is unique and safe to use at any size.
 */
export const LogoMark: React.FC<LogoMarkProps> = ({ className = 'h-9 w-9', title }) => {
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, '');
  const tileId = `wakit-tile-${uid}`;
  const glowId = `wakit-glow-${uid}`;
  const clipId = `wakit-clip-${uid}`;

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
        <linearGradient id={tileId} x1="4" y1="3" x2="61" y2="62" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#064e3b" />
          <stop offset="52%" stopColor="#047857" />
          <stop offset="100%" stopColor="#0f766e" />
        </linearGradient>
        <radialGradient id={glowId} cx="13" cy="9" r="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#6ee7b7" stopOpacity="0" />
        </radialGradient>
        <clipPath id={clipId}>
          <rect x="1.5" y="1.5" width="61" height="61" rx="17" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        <rect x="1.5" y="1.5" width="61" height="61" fill={`url(#${tileId})`} />
        <rect x="1.5" y="1.5" width="61" height="61" fill={`url(#${glowId})`} />
        <path d="M-12 58 50 -5" stroke="#a7f3d0" strokeOpacity="0.1" strokeWidth="14" />
      </g>

      {/* Precision inner rim keeps the icon crisp on light and dark chrome. */}
      <rect
        x="2.7"
        y="2.7"
        width="58.6"
        height="58.6"
        rx="15.8"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.16"
        strokeWidth="0.9"
      />

      {/* Continuous W ribbon */}
      <path
        d="M13.8 20.5 23.1 43.4 32 27.7 40.9 43.4 50.2 20.5"
        fill="none"
        stroke="#ffffff"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Creator spark: the "make something" accent */}
      <path
        d="M50.5 7.4c.73 3.03 2.17 4.47 5.2 5.2-3.03.73-4.47 2.17-5.2 5.2-.73-3.03-2.17-4.47-5.2-5.2 3.03-.73 4.47-2.17 5.2-5.2Z"
        fill="#fbbf24"
      />
    </svg>
  );
};

interface LogoProps {
  className?: string;
  /** Hide the "Private creator tools" strapline. */
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
            Private creator tools
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
