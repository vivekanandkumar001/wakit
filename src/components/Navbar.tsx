import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ArrowRight, ChevronDown, LayoutGrid } from 'lucide-react';
import { toolCategories } from '../data/toolCategories';
import { PlatformMark } from './BrandIcons';

const PANEL_ID = 'header-category-panel';

/**
 * Desktop category strip. Each platform category opens a panel listing its
 * child tools, so all 16 tools are reachable from the header without a
 * separate "all tools" mega menu.
 */
export const Navbar: React.FC = () => {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const closeTimer = useRef<number | null>(null);
  const { pathname } = useLocation();

  const openCategory = toolCategories.find((category) => category.key === openKey) ?? null;

  // Route changes close the panel.
  useEffect(() => {
    setOpenKey(null);
  }, [pathname]);

  useEffect(() => {
    if (!openCategory) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpenKey(null);
      // Return focus to the trigger so keyboard users keep their place.
      triggerRefs.current[openCategory.key]?.focus({ preventScroll: true });
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpenKey(null);
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [openCategory]);

  useEffect(
    () => () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    },
    [],
  );

  const cancelClose = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpenKey(null), 160);
  };

  return (
    <nav
      ref={navRef}
      aria-label="Tool categories"
      onMouseLeave={scheduleClose}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpenKey(null);
      }}
      className="hidden min-w-0 items-center gap-0.5 min-[900px]:flex"
    >
      <NavLink
        to="/"
        end
        onMouseEnter={() => {
          cancelClose();
          setOpenKey(null);
        }}
        className={({ isActive }) =>
          `group relative flex h-11 items-center gap-1.5 whitespace-nowrap px-2.5 text-[12.5px] font-semibold transition-colors duration-200 ${
            isActive ? 'text-emerald-700' : 'text-slate-600 hover:text-emerald-700'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <LayoutGrid
              className={`h-4 w-4 ${isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-emerald-600'}`}
              aria-hidden="true"
            />
            <span>All tools</span>
            <span
              aria-hidden="true"
              className={`absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-emerald-600 transition-opacity duration-200 ${
                isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
              }`}
            />
          </>
        )}
      </NavLink>

      {toolCategories.map((category) => {
        const isOpen = openKey === category.key;
        const isActive = category.tools.some((tool) => tool.to === pathname);

        return (
          <div
            key={category.key}
            className="relative"
            onMouseEnter={() => {
              cancelClose();
              setOpenKey(category.key);
            }}
          >
            <button
              ref={(node) => {
                triggerRefs.current[category.key] = node;
              }}
              type="button"
              aria-expanded={isOpen}
              aria-controls={isOpen ? PANEL_ID : undefined}
              onClick={() => setOpenKey(category.key)}
              onFocus={cancelClose}
              className={`group relative flex h-11 items-center gap-1.5 whitespace-nowrap px-2.5 text-[12.5px] font-semibold transition-colors duration-200 ${
                isOpen || isActive ? 'text-emerald-700' : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              <PlatformMark platform={category.key} className="h-5 w-5" />
              <span>{category.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[9.5px] font-bold transition-colors ${
                  isOpen || isActive
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-700'
                }`}
                aria-hidden="true"
              >
                {category.tools.length}
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
              <span
                aria-hidden="true"
                className={`absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-emerald-600 transition-opacity duration-200 ${
                  isOpen || isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
                }`}
              />
            </button>
          </div>
        );
      })}

      {openCategory && (
        <div
          id={PANEL_ID}
          role="group"
          aria-label={`${openCategory.label} tools`}
          style={{ maxHeight: 'calc(100dvh - 8.5rem)' }}
          className="menu-in fixed left-1/2 top-[6.8125rem] z-[55] w-[min(920px,calc(100vw-2.5rem))] -translate-x-1/2 overflow-y-auto overscroll-contain rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/20"
        >
          <div
            className={`flex flex-wrap items-center justify-between gap-3 rounded-xl bg-gradient-to-r px-4 py-3 text-white ${openCategory.tone.panel}`}
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <PlatformMark platform={openCategory.key} className="h-9 w-9" />
              <div className="min-w-0">
                <p className="text-sm font-extrabold">{openCategory.label}</p>
                <p className="truncate text-[11px] font-medium text-white/75">
                  {openCategory.description}
                </p>
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold text-white">
              {openCategory.tools.length} tools
            </span>
          </div>

          <div className="mt-2 grid gap-1 sm:grid-cols-2">
            {openCategory.tools.map((tool) => {
              const ToolIcon = tool.icon;
              return (
                <NavLink
                  key={tool.to}
                  to={tool.to}
                  title={tool.description}
                  className="group/item flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-slate-50"
                >
                  <span
                    className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg ring-1 ${openCategory.tone.tile}`}
                  >
                    <ToolIcon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className="text-[12.5px] font-bold text-slate-900 transition-colors group-hover/item:text-emerald-700">
                        {tool.label}
                      </span>
                      <span className="shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-600">
                        {tool.badge}
                      </span>
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-snug text-slate-500">
                      {tool.description}
                    </span>
                  </span>
                  <ArrowRight
                    className="mt-2 h-3.5 w-3.5 shrink-0 text-slate-300 transition-transform group-hover/item:translate-x-0.5 group-hover/item:text-emerald-600"
                    aria-hidden="true"
                  />
                </NavLink>
              );
            })}
          </div>

          <div className="mt-1 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 px-2 pb-1 pt-2">
            <span className="text-[10.5px] font-medium text-slate-500">
              Runs on your device · 0 uploads
            </span>
            <NavLink
              to={openCategory.hubTo}
              className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-2.5 py-1.5 text-[10.5px] font-bold text-white transition-colors hover:bg-slate-800"
            >
              {openCategory.hubLabel}
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};
