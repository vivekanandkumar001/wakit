import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ArrowRight, ChevronDown, Lock, Sparkles } from 'lucide-react';
import { socialToolGroups, socialToolNavItems } from '../data/socialTools';

/**
 * Creator Studio entry in the desktop category strip. Opens a full-width
 * mega menu so all 12 tools are one click away instead of hidden behind a hub.
 */
export const CreatorStudioMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);
  const panelId = 'creator-studio-menu';
  const location = useLocation();
  // Hover-to-open only on devices with a precise pointer; on touch, a tap
  // would otherwise fire mouseenter and then toggle the panel straight closed.
  const supportsHover =
    typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const isActive =
    location.pathname === '/social-tools' ||
    socialToolNavItems.some((tool) => tool.to === location.pathname);

  const cancelClose = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openMenu = () => {
    cancelClose();
    setOpen(true);
  };

  const closeSoon = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpen(false), 140);
  };

  // Close on route change.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  useEffect(() => cancelClose, []);

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onMouseEnter={supportsHover ? openMenu : undefined}
      onMouseLeave={supportsHover ? closeSoon : undefined}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Creator Studio — 12 private social tools"
        title="12 browser-only tools for WhatsApp, Instagram and Facebook"
        className={`group relative flex h-11 items-center gap-1.5 whitespace-nowrap px-2.5 text-[12.5px] font-bold transition-colors duration-200 ${
          isActive || open ? 'text-emerald-700' : 'text-emerald-700/90 hover:text-emerald-900'
        }`}
      >
        <Sparkles className="h-4 w-4 text-amber-500" aria-hidden="true" />
        <span>Creator Studio</span>
        <span
          aria-hidden="true"
          className={`rounded-full px-1.5 py-0.5 text-[9px] font-extrabold ${
            isActive || open
              ? 'bg-emerald-600 text-white'
              : 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200'
          }`}
        >
          12
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
        <span
          aria-hidden="true"
          className={`absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-emerald-600 transition-opacity duration-200 ${
            isActive || open ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
          }`}
        />
      </button>

      {open && (
        <div
          id={panelId}
          // Viewport-fixed, pinned directly under the 64px brand bar + 45px category bar.
          className="fixed left-5 right-5 top-[6.8125rem] z-[55] max-h-[calc(100dvh-7.5rem)] overflow-y-auto overscroll-contain rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/20"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[linear-gradient(100deg,#022c22,#065f46)] px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 ring-1 ring-white/15">
                <Sparkles className="h-4 w-4 text-amber-300" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-bold">Creator Studio</p>
                <p className="text-[11px] text-emerald-100/85">
                  12 private tools for WhatsApp, Instagram and Facebook
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden items-center gap-1.5 text-[10px] font-semibold text-emerald-100/80 sm:inline-flex">
                <Lock className="h-3 w-3" aria-hidden="true" />
                Files stay on your device
              </span>
              <NavLink
                to="/social-tools"
                onClick={() => setOpen(false)}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-amber-400 px-3 py-1.5 text-[11px] font-extrabold text-emerald-950 transition-colors hover:bg-amber-300"
              >
                All 12 tools
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </NavLink>
            </div>
          </div>

          <div className="mt-1 grid gap-1 md:grid-cols-2 xl:grid-cols-4">
            {socialToolGroups.map((group) => (
              <div key={group.name} className="rounded-xl p-2 hover:bg-slate-50/70">
                <div className="px-2 pb-1.5">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
                    {group.name}
                  </p>
                  <p className="mt-0.5 truncate text-[10px] text-slate-400">{group.description}</p>
                </div>
                <ul className="space-y-0.5">
                  {group.tools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <li key={tool.to}>
                        <NavLink
                          to={tool.to}
                          onClick={() => setOpen(false)}
                          title={tool.description}
                          className={({ isActive: linkActive }) =>
                            `group flex items-center gap-2 rounded-lg px-2 py-2 transition-colors ${
                              linkActive
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'text-slate-700 hover:bg-white hover:text-emerald-700'
                            }`
                          }
                        >
                          {({ isActive: linkActive }) => (
                            <>
                              <span
                                className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ring-1 ${
                                  linkActive
                                    ? 'bg-white text-emerald-600 ring-emerald-200'
                                    : 'bg-slate-50 text-slate-400 ring-slate-200 group-hover:text-emerald-600'
                                }`}
                              >
                                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                              </span>
                              <span className="min-w-0 flex-1 truncate text-[12px] font-semibold">
                                {tool.label}
                              </span>
                              <ArrowRight
                                className="h-3 w-3 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-emerald-500"
                                aria-hidden="true"
                              />
                            </>
                          )}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-1 flex items-center justify-between gap-3 border-t border-slate-100 px-3 pb-1 pt-2 text-[10px] text-slate-500">
            <span>Every file is processed on your device — no uploads, no account, no watermark.</span>
            <span className="hidden shrink-0 items-center gap-1 font-semibold text-emerald-700 sm:inline-flex">
              <Lock className="h-3 w-3" aria-hidden="true" />
              0 uploads
            </span>
          </p>
        </div>
      )}
    </div>
  );
};
