import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ArrowUpRight, Download, Lock, Menu, ShieldCheck, Smartphone, Sparkles, X } from 'lucide-react';
import { Navbar } from './Navbar';
import { secondaryNavItems } from './navItems';
import { toolCategories, totalToolCount } from '../data/toolCategories';
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
    <header className="sticky top-0 z-50 w-full">
      {/* Brand bar: logo, Flipkart-style always-visible search, actions */}
      <div className="relative bg-[linear-gradient(100deg,#022c22_0%,#064e3b_46%,#065f46_100%)]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-emerald-400/15 blur-3xl" />
          <div className="absolute right-0 top-0 h-40 w-96 translate-x-1/3 rounded-full bg-teal-300/10 blur-3xl" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />
        </div>

        <div className="relative mx-auto flex w-full max-w-[1200px] flex-col gap-2.5 px-5 py-2.5 md:h-16 md:flex-row md:items-center md:gap-3 md:py-0">
          <div className="flex items-center justify-between gap-3 md:contents">
            <Logo tone="light" />

            <div className="flex items-center gap-2 md:order-3 md:ml-auto">
              <span className="hidden items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1.5 text-[10px] font-bold text-emerald-50 min-[900px]:inline-flex">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" aria-hidden="true" />
                100% on-device
              </span>

              <NavLink
                to="/app"
                aria-label="Get app — install WaKit on your phone"
                title="Install WaKit on your phone — no app store needed"
                className="hidden items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-[11.5px] font-bold text-white transition-colors hover:border-white/40 hover:bg-white/20 min-[900px]:inline-flex"
              >
                <Smartphone className="h-4 w-4 text-emerald-200" aria-hidden="true" />
                Get app
              </NavLink>

              <NavLink
                to="/app"
                aria-label="Install the WaKit app"
                title="Install WaKit on your phone"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/20 bg-white/10 text-white transition-colors hover:border-white/40 hover:bg-white/20 min-[900px]:hidden"
              >
                <Download className="h-5 w-5" aria-hidden="true" />
              </NavLink>

              <NavLink
                to="/social-tools"
                aria-label="Open Creator Studio — 12 private social tools"
                title="Creator Studio — 12 private social tools"
                className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-400 text-emerald-950 shadow-sm transition-colors hover:bg-amber-300 min-[900px]:hidden"
              >
                <Sparkles className="h-5 w-5" aria-hidden="true" />
                <span
                  aria-hidden="true"
                  className="absolute -right-1 -top-1 rounded-full bg-emerald-950 px-1 text-[9px] font-extrabold leading-4 text-amber-300 ring-2 ring-emerald-800"
                >
                  12
                </span>
              </NavLink>

              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="grid h-10 w-10 place-items-center rounded-xl border border-white/20 bg-white/10 text-white transition-colors hover:border-white/40 hover:bg-white/20 min-[900px]:hidden"
                aria-label="Open tools menu"
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <ToolSearch className="md:order-2 md:min-w-0 md:max-w-[80rem] md:flex-1" />
        </div>
      </div>

      {/* Category bar: keeps every primary destination visible on desktop */}
      <div className="hidden border-b border-slate-200 bg-white/95 shadow-[0_1px_0_rgba(15,23,42,0.03)] min-[900px]:block">
        <div className="mx-auto flex h-11 w-full max-w-[1200px] items-center justify-between gap-4 px-5">
          <Navbar />

          <div className="flex shrink-0 items-center gap-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200">
              <Lock className="h-3 w-3" aria-hidden="true" />
              0 uploads
            </span>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-[60] min-[900px]:hidden ${menuOpen ? '' : 'pointer-events-none'}`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div
          role="dialog"
          aria-modal="true"
          aria-label="WaKit tools menu"
          className={`absolute inset-x-3 top-3 max-h-[calc(100dvh-1.5rem)] origin-top overflow-y-auto overscroll-contain rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/20 transition-all duration-300 sm:inset-x-auto sm:right-4 sm:w-[24rem] ${
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
                  {totalToolCount} tools · zero uploads
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

          <div className="space-y-3">
            {toolCategories.map((category) => {
              const CategoryIcon = category.icon;
              return (
                <section key={category.key} aria-labelledby={`drawer-${category.key}`}>
                  <div className="flex items-center gap-2 px-1 pb-1.5">
                    <span
                      className={`grid h-6 w-6 shrink-0 place-items-center rounded-md ring-1 ${category.tone.tile}`}
                    >
                      <CategoryIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <h3
                      id={`drawer-${category.key}`}
                      className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-500"
                    >
                      {category.label}
                    </h3>
                    <span className="ml-auto text-[10px] font-semibold text-slate-400">
                      {category.tools.length} tools
                    </span>
                  </div>

                  <div className={category.tools.length === 1 ? 'grid gap-1' : 'grid grid-cols-2 gap-1'}>
                    {category.tools.map((tool) => {
                      const ToolIcon = tool.icon;
                      return (
                        <NavLink
                          key={tool.to}
                          to={tool.to}
                          onClick={() => setMenuOpen(false)}
                          title={tool.description}
                          className={({ isActive }) =>
                            `flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-semibold ring-1 transition-colors ${
                              isActive
                                ? 'bg-emerald-50 text-emerald-700 ring-emerald-300'
                                : 'bg-slate-50/80 text-slate-700 ring-slate-200 hover:bg-white hover:text-emerald-700 hover:ring-emerald-200'
                            }`
                          }
                        >
                          <ToolIcon className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                          <span className="truncate">{tool.label}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>

          <NavLink
            to="/social-tools"
            onClick={() => setMenuOpen(false)}
            className="mt-3 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[11.5px] font-bold text-amber-900 transition-colors hover:bg-amber-100"
          >
            <Sparkles className="h-4 w-4 text-amber-600" aria-hidden="true" />
            Creator Studio hub
            <span className="ml-auto text-[10px] font-semibold text-amber-700">12 social tools</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-amber-700" aria-hidden="true" />
          </NavLink>

          <NavLink
            to="/app"
            onClick={() => setMenuOpen(false)}
            className="mt-3 flex items-center gap-3 rounded-2xl bg-[linear-gradient(115deg,#022c22_0%,#065f46_100%)] px-3 py-3 text-white shadow-sm"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/15 ring-1 ring-white/20">
              <Download className="h-4 w-4 text-amber-300" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold">Install the WaKit app</span>
              <span className="mt-0.5 block text-[10.5px] font-medium text-emerald-100/80">
                Home-screen icon · offline shell · still 0 uploads
              </span>
            </span>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-emerald-200" aria-hidden="true" />
          </NavLink>

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
