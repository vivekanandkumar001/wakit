import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ArrowUpRight, Lock, Menu, ShieldCheck, Sparkles, X } from 'lucide-react';
import { Navbar } from './Navbar';
import { secondaryNavItems, toolNavItems } from './navItems';
import { socialToolNavItems } from '../data/socialTools';
import { ToolSearch } from './ToolSearch';
import { Logo } from './Logo';

export const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Lock page scroll and support Escape while the drawer is open.
  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/85 shadow-[0_1px_0_rgba(15,23,42,0.02)] backdrop-blur-xl">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          <Logo />

          {/* Desktop navigation */}
          <Navbar />

          {/* Actions */}
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-[10px] font-bold text-emerald-700 2xl:inline-flex">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              100% client-side
            </span>

            <ToolSearch />

            <NavLink
              to="/social-tools"
              aria-label="Open Creator Studio — 12 private social tools"
              title="Creator Studio — 12 private social tools"
              className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white shadow-sm transition-colors hover:bg-emerald-700 min-[960px]:hidden"
            >
              <Sparkles className="h-5 w-5 text-amber-300" aria-hidden="true" />
              <span
                aria-hidden="true"
                className="absolute -right-1 -top-1 rounded-full bg-amber-400 px-1 text-[9px] font-extrabold leading-4 text-emerald-950 ring-2 ring-white"
              >
                12
              </span>
            </NavLink>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 min-[960px]:hidden"
              aria-label="Open tools menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-[60] min-[960px]:hidden ${menuOpen ? '' : 'pointer-events-none'}`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-slate-900/35 backdrop-blur-sm transition-opacity duration-300 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div
          role="dialog"
          aria-modal="true"
          aria-label="WaKit tools menu"
          className={`absolute inset-x-3 top-3 origin-top rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/20 transition-all duration-300 sm:inset-x-auto sm:right-4 sm:w-[24rem] max-h-[calc(100dvh-1.5rem)] overflow-y-auto overscroll-contain ${
            menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'
          }`}
        >
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 ring-1 ring-emerald-200">
                <Lock className="h-4 w-4 text-emerald-600" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900">WaKit toolkit</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Zero uploads
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
              aria-label="Close tools menu"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="space-y-1.5">
            {toolNavItems
              .filter((item) => item.to !== '/social-tools')
              .map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-2xl border px-3 py-2.5 transition-colors ${
                        isActive
                          ? 'border-emerald-200 bg-emerald-50'
                          : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ring-1 ${
                            isActive
                              ? 'bg-white text-emerald-600 ring-emerald-200'
                              : 'bg-slate-50 text-slate-500 ring-slate-200'
                          }`}
                        >
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-900">{item.label}</span>
                            <span className="badge">{item.badge}</span>
                          </span>
                          <span className="mt-0.5 block truncate text-[11px] text-slate-500">
                            {item.description}
                          </span>
                        </span>
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                      </>
                    )}
                  </NavLink>
                );
              })}
          </div>

          <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-2.5">
            <div className="flex items-center justify-between gap-2 px-1 pb-2">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-600 text-white">
                  <Sparkles className="h-4 w-4 text-amber-300" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-900">Creator Studio</p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
                    12 browser-only tools
                  </p>
                </div>
              </div>
              <NavLink
                to="/social-tools"
                onClick={() => setMenuOpen(false)}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-white px-2 py-1 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200"
              >
                Hub
                <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
              </NavLink>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {socialToolNavItems.map((tool) => {
                const Icon = tool.icon;
                return (
                  <NavLink
                    key={tool.to}
                    to={tool.to}
                    onClick={() => setMenuOpen(false)}
                    title={tool.description}
                    className={({ isActive }) =>
                      `flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-semibold ring-1 transition-colors ${
                        isActive
                          ? 'bg-white text-emerald-700 ring-emerald-300'
                          : 'bg-white/80 text-slate-700 ring-slate-200 hover:text-emerald-700 hover:ring-emerald-200'
                      }`
                    }
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                    <span className="truncate">{tool.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>

          <div className="mt-3 border-t border-slate-200 pt-3">
            <div className="grid grid-cols-3 gap-1.5">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex flex-col items-center gap-1.5 rounded-xl border px-1 py-2.5 text-[11px] font-semibold transition-colors ${
                        isActive
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`
                    }
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {item.label}
                  </NavLink>
                );
              })}
            </div>

            <p className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-slate-50 px-3 py-2.5 text-[11px] font-medium text-slate-500">
              <Lock className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
              Files never leave your device
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
