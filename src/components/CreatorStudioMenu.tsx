import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react';
import { socialToolGroups, socialToolNavItems } from '../data/socialTools';

/**
 * Desktop Creator Studio entry for the primary navigation.
 * The 12 tools are grouped by platform so visitors can jump straight to a
 * specific tool instead of landing on the hub and searching again.
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
        className={`group relative flex items-center gap-1.5 rounded-xl border px-2.5 py-2 text-[12px] font-bold transition-colors duration-200 min-[1150px]:gap-2 min-[1150px]:px-3 min-[1150px]:text-[13px] ${
          isActive || open
            ? 'border-emerald-300 bg-emerald-600 text-white shadow-sm'
            : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100/70'
        }`}
      >
        <Sparkles
          aria-hidden="true"
          className={`h-4 w-4 ${isActive || open ? 'text-amber-300' : 'text-amber-500'}`}
        />
        <span>Creator Studio</span>
        <span
          aria-hidden="true"
          className={`hidden rounded-full px-1.5 py-0.5 text-[10px] font-bold min-[1150px]:inline ${
            isActive || open ? 'bg-white/15 text-white' : 'bg-white text-emerald-700 ring-1 ring-emerald-200'
          }`}
        >
          12
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          id={panelId}
          className="absolute right-0 top-full z-50 mt-2 w-[44rem] overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/15 xl:w-[56rem]"
        >
          <div className="flex items-center justify-between gap-3 rounded-xl bg-emerald-50/80 px-3 py-2.5">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white">
                <Sparkles className="h-4 w-4 text-amber-300" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900">Creator Studio</p>
                <p className="text-[11px] text-slate-600">
                  12 private tools for WhatsApp, Instagram and Facebook
                </p>
              </div>
            </div>
            <NavLink
              to="/social-tools"
              onClick={() => setOpen(false)}
              className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200 transition-colors hover:bg-emerald-600 hover:text-white hover:ring-emerald-600"
            >
              All 12 tools
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </NavLink>
          </div>

          <div className="mt-1 grid grid-cols-2 gap-1 xl:grid-cols-4">
            {socialToolGroups.map((group) => (
              <div key={group.name} className="p-2">
                <p className="px-1.5 pb-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                  {group.name}
                </p>
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
                            `flex items-center gap-2 rounded-lg px-1.5 py-1.5 transition-colors ${
                              linkActive
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-700'
                            }`
                          }
                        >
                          {({ isActive: linkActive }) => (
                            <>
                              <Icon
                                aria-hidden="true"
                                className={`h-3.5 w-3.5 shrink-0 ${
                                  linkActive ? 'text-emerald-600' : 'text-slate-400'
                                }`}
                              />
                              <span className="min-w-0 flex-1 truncate text-[12px] font-semibold">
                                {tool.label}
                              </span>
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

          <p className="mt-1 border-t border-slate-100 px-3 pb-1 pt-2 text-[10px] text-slate-500">
            Every file is processed on your device — no uploads, no account, no watermark.
          </p>
        </div>
      )}
    </div>
  );
};
