import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CornerDownLeft,
  Search,
  Sparkles,
  X,
  type LucideIcon,
} from 'lucide-react';
import { toolNavItems } from './navItems';
import { socialToolGroups } from '../data/socialTools';

interface SearchItem {
  to: string;
  label: string;
  description: string;
  badge: string;
  icon: LucideIcon;
  group: string;
}

const GROUP_ORDER = ['Quick access', 'WhatsApp', 'Instagram', 'Facebook', 'Cross-platform'];

const searchItems: SearchItem[] = [
  ...toolNavItems
    .filter((item) => item.to !== '/' && item.to !== '/social-tools')
    .map((item) => ({ ...item, group: 'Quick access' })),
  ...socialToolGroups.flatMap((group) =>
    group.tools.map((tool) => ({ ...tool, group: group.name })),
  ),
  {
    to: '/social-tools',
    label: 'Creator Studio hub',
    description: 'Browse every Creator Studio tool with guides and examples',
    badge: '12 tools',
    icon: Sparkles,
    group: 'Quick access',
  },
];

const sortByGroup = (items: SearchItem[]) =>
  [...items].sort((a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group));

/**
 * Global tool finder for the header. Opens from the search button, Ctrl/Cmd+K
 * or "/", filters the full catalogue locally and supports arrow-key navigation.
 */
export const ToolSearch: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sortByGroup(searchItems);
    const matched = searchItems.filter((item) =>
      [item.label, item.description, item.badge, item.group]
        .join(' ')
        .toLowerCase()
        .includes(q),
    );
    return sortByGroup(matched);
  }, [query]);

  const close = () => {
    setOpen(false);
    setQuery('');
    setActive(0);
    triggerRef.current?.focus();
  };

  const openSearch = () => {
    setQuery('');
    setActive(0);
    setOpen(true);
  };

  // Global keyboard shortcuts: Ctrl/Cmd+K and "/" (outside form fields).
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        !!target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      if ((event.key === 'k' || event.key === 'K') && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen(true);
      } else if (event.key === '/' && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Lock scroll, focus the input and close on Escape while open.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    const el = document.getElementById(`tool-search-item-${active}`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const go = (item: SearchItem) => {
    navigate(item.to);
    close();
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((index) => (results.length === 0 ? 0 : (index + 1) % results.length));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((index) => (results.length === 0 ? 0 : (index - 1 + results.length) % results.length));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const item = results[active];
      if (item) go(item);
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openSearch}
        aria-label="Search all WaKit tools"
        aria-keyshortcuts="Control+K Meta+K"
        title="Search tools — Ctrl K"
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 xl:w-auto xl:px-3"
      >
        <Search className="h-4 w-4" aria-hidden="true" />
        <span className="hidden text-[12px] font-bold xl:inline">Search</span>
        <kbd className="hidden rounded border border-slate-200 bg-slate-50 px-1 py-0.5 font-mono text-[9px] font-semibold text-slate-500 2xl:inline">
          Ctrl K
        </kbd>
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-start justify-center px-3 pt-[10vh] sm:px-4 sm:pt-[12vh]"
            onMouseDown={close}
          >
            <div aria-hidden="true" className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm" />

            <div
              role="dialog"
              aria-modal="true"
              aria-label="Search WaKit tools"
              className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/25"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3">
                <Search className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                <input
                  ref={inputRef}
                  type="text"
                  role="combobox"
                  aria-expanded="true"
                  aria-controls="tool-search-results"
                  aria-autocomplete="list"
                  aria-activedescendant={results[active] ? `tool-search-item-${active}` : undefined}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={onInputKeyDown}
                  placeholder="Search 17 tools — sticker, caption, QR, compress…"
                  className="h-7 w-full min-w-0 bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close search"
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>

              <div
                id="tool-search-results"
                role="listbox"
                aria-label="Tools"
                className="max-h-[min(58vh,26rem)] overflow-y-auto p-2"
              >
                {results.length === 0 ? (
                  <p className="px-3 py-8 text-center text-sm text-slate-500">
                    No tool matches “{query.trim()}”. Try “sticker”, “caption” or “compress”.
                  </p>
                ) : (
                  results.map((item, index) => {
                    const Icon = item.icon;
                    const selected = index === active;
                    return (
                      <button
                        key={`${item.to}-${item.label}`}
                        type="button"
                        id={`tool-search-item-${index}`}
                        role="option"
                        aria-selected={selected}
                        onMouseMove={() => setActive(index)}
                        onClick={() => go(item)}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                          selected ? 'bg-emerald-50' : 'hover:bg-slate-50'
                        }`}
                      >
                        <span
                          className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ring-1 ${
                            selected
                              ? 'bg-white text-emerald-700 ring-emerald-200'
                              : 'bg-slate-50 text-slate-500 ring-slate-200'
                          }`}
                        >
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="truncate text-sm font-bold text-slate-900">{item.label}</span>
                            <span className="shrink-0 rounded-full bg-white px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-500 ring-1 ring-slate-200">
                              {item.group}
                            </span>
                          </span>
                          <span className="mt-0.5 block truncate text-[11px] text-slate-500">
                            {item.description}
                          </span>
                        </span>
                        <span className="hidden shrink-0 items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:flex">
                          {item.badge}
                        </span>
                        <ArrowRight
                          className={`h-3.5 w-3.5 shrink-0 ${selected ? 'text-emerald-600' : 'text-slate-300'}`}
                          aria-hidden="true"
                        />
                      </button>
                    );
                  })
                )}
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/80 px-4 py-2.5 text-[10px] font-semibold text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <kbd className="rounded border border-slate-300 bg-white px-1.5 py-0.5 font-mono text-[10px] text-slate-600">↑↓</kbd>
                  navigate
                  <kbd className="rounded border border-slate-300 bg-white px-1.5 py-0.5 font-mono text-[10px] text-slate-600">
                    <CornerDownLeft className="inline h-2.5 w-2.5" aria-hidden="true" />
                  </kbd>
                  open
                </span>
                <span>
                  {results.length} {results.length === 1 ? 'tool' : 'tools'} · Ctrl K
                </span>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};
