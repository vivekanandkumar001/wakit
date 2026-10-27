import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  CornerDownLeft,
  Search,
  Sparkles,
  TrendingUp,
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

const GROUP_ORDER = ['WhatsApp', 'Instagram', 'Facebook', 'Cross-platform', 'Creator Studio'];

const searchItems: SearchItem[] = [
  ...toolNavItems
    .filter((item) => item.to !== '/' && item.to !== '/social-tools')
    .map((item) => ({ ...item, group: 'WhatsApp' })),
  ...socialToolGroups.flatMap((group) =>
    group.tools.map((tool) => ({ ...tool, group: group.name })),
  ),
  {
    to: '/social-tools',
    label: 'Creator Studio hub',
    description: 'Browse every Creator Studio tool with guides and examples',
    badge: '12 tools',
    icon: Sparkles,
    group: 'Creator Studio',
  },
];

const popularTools = [
  '/whatsapp-status-splitter',
  '/whatsapp-sticker-maker',
  '/whatsapp-media-compressor',
  '/instagram-grid-planner',
]
  .map((path) => searchItems.find((item) => item.to === path))
  .filter((item): item is SearchItem => Boolean(item));

const trendingSearches = [
  { label: 'Status video', query: 'status' },
  { label: 'Sticker maker', query: 'sticker' },
  { label: 'Compress audio', query: 'compress audio' },
  { label: 'Instagram grid', query: 'grid' },
  { label: 'QR code', query: 'qr' },
  { label: 'Caption', query: 'caption' },
];

/** Sort the full catalogue so related tools stay together when nothing is typed. */
const sortByGroup = (items: SearchItem[]) =>
  [...items].sort((a, b) => {
    const groupDiff = GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group);
    return groupDiff !== 0 ? groupDiff : a.label.localeCompare(b.label);
  });

/** Cheap relevance score: label matches beat description matches. */
const scoreItem = (item: SearchItem, query: string) => {
  const label = item.label.toLowerCase();
  const words = label.split(/\s+/);
  let score = 100;

  if (label === query) score = 0;
  else if (label.startsWith(query)) score = 5;
  else if (words.some((word) => word.startsWith(query))) score = 10;
  else if (label.includes(query)) score = 20;
  else if (item.group.toLowerCase().includes(query)) score = 30;
  else if (item.badge.toLowerCase().includes(query)) score = 40;
  else if (item.description.toLowerCase().includes(query)) score = 50;

  return score + Math.max(0, GROUP_ORDER.indexOf(item.group)) * 0.1;
};

const highlightMatch = (text: string, query: string) => {
  if (!query) return text;
  const index = text.toLowerCase().indexOf(query);
  if (index === -1) return text;

  return (
    <>
      {text.slice(0, index)}
      <mark className="rounded bg-amber-100 px-0.5 text-emerald-950">
        {text.slice(index, index + query.length)}
      </mark>
      {text.slice(index + query.length)}
    </>
  );
};

interface ToolSearchProps {
  className?: string;
}

/**
 * Flipkart-style global search: an always-visible, full-width field in the
 * header with instant local suggestions, keyboard navigation and no overlay.
 */
export const ToolSearch: React.FC<ToolSearchProps> = ({ className = '' }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const trimmedQuery = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!trimmedQuery) return sortByGroup(searchItems);

    return searchItems
      .map((item) => ({ item, score: scoreItem(item, trimmedQuery) }))
      .filter((entry) => entry.score < 100)
      .sort((a, b) => a.score - b.score || a.item.label.localeCompare(b.item.label))
      .map((entry) => entry.item);
  }, [trimmedQuery]);

  const focusSearch = () => {
    setOpen(true);
    window.requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const close = () => {
    setOpen(false);
    setQuery('');
    setActive(0);
  };

  const go = (item: SearchItem) => {
    navigate(item.to);
    close();
  };

  // Shortcuts: Ctrl/Cmd+K and "/" focus the real search field. The directory
  // section also dispatches this event so its "Search" button works from afar.
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
        focusSearch();
      } else if (
        event.key === '/' &&
        !typing &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey
      ) {
        event.preventDefault();
        focusSearch();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('wakit:focus-search', focusSearch);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('wakit:focus-search', focusSearch);
    };
  }, []);

  // Close when the route changes, and on outside click or Escape.
  useEffect(() => {
    close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [trimmedQuery]);

  useEffect(() => {
    const el = document.getElementById(`tool-search-item-${active}`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!trimmedQuery) {
      const hub = searchItems.find((item) => item.to === '/social-tools');
      if (hub) go(hub);
      return;
    }

    const item = results[active] ?? results[0];
    if (item) go(item);
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!trimmedQuery) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((index) => (results.length === 0 ? 0 : (index + 1) % results.length));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((index) =>
        results.length === 0 ? 0 : (index - 1 + results.length) % results.length,
      );
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActive(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setActive(Math.max(0, results.length - 1));
    }
  };

  return (
    <div
      ref={wrapperRef}
      onBlur={(event) => {
        const next = event.relatedTarget as Node | null;
        if (!next || !wrapperRef.current?.contains(next)) {
          window.setTimeout(() => {
            if (!wrapperRef.current?.contains(document.activeElement)) setOpen(false);
          }, 0);
        }
      }}
      className={`relative ${className}`}
    >
      <form
        role="search"
        onSubmit={handleSubmit}
        className="flex h-11 items-center gap-1 rounded-xl bg-white pr-1 shadow-[0_8px_24px_-12px_rgba(2,44,34,0.55)] ring-1 ring-white/60 transition-shadow focus-within:ring-2 focus-within:ring-amber-300 sm:h-12 sm:rounded-xl"
      >
        <span className="grid h-full w-11 shrink-0 place-items-center text-emerald-700">
          <Search className="h-[18px] w-[18px]" aria-hidden="true" />
        </span>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onInputKeyDown}
          role="combobox"
          aria-label="Search all 16 WaKit tools"
          aria-expanded={open}
          aria-controls={trimmedQuery ? 'tool-search-results' : 'tool-search-panel'}
          aria-autocomplete="list"
          aria-activedescendant={
            open && trimmedQuery && results[active] ? `tool-search-item-${active}` : undefined
          }
          placeholder="Search 16 tools — sticker, caption, QR, compress…"
          className="h-full min-w-0 flex-1 bg-transparent text-[13px] font-medium text-slate-900 outline-none placeholder:text-slate-500 sm:text-sm"
          autoComplete="off"
          spellCheck={false}
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setActive(0);
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}

        <button
          type="submit"
          aria-label="Search"
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-amber-400 px-2.5 text-xs font-extrabold text-emerald-950 transition-colors hover:bg-amber-300 sm:px-3.5"
        >
          <Search className="h-3.5 w-3.5 sm:hidden" aria-hidden="true" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </form>

      {open && (
        <div
          id="tool-search-panel"
          className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-[70] max-h-[calc(100dvh-8rem)] overflow-y-auto overscroll-contain rounded-2xl border border-slate-200 bg-white text-left shadow-[0_28px_70px_-18px_rgba(2,44,34,0.45)]"
        >
          {!trimmedQuery ? (
            <>
              <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                    Trending searches
                  </p>
                  <span className="text-[10px] font-semibold text-slate-400">16 tools · 0 uploads</span>
                </div>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {trendingSearches.map((trend) => (
                    <button
                      key={trend.label}
                      type="button"
                      onClick={() => {
                        setQuery(trend.query);
                        inputRef.current?.focus();
                      }}
                      className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      {trend.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-2">
                <p className="px-2 pb-1 pt-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                  Popular tools
                </p>
                <div className="grid gap-1 sm:grid-cols-2">
                  {popularTools.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.to}
                        type="button"
                        onClick={() => go(item)}
                        className="group flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-emerald-50"
                      >
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[12px] font-bold text-slate-900 group-hover:text-emerald-800">
                            {item.label}
                          </span>
                          <span className="mt-0.5 block truncate text-[10px] text-slate-500">
                            {item.description}
                          </span>
                        </span>
                        <ArrowUpRight
                          className="h-3.5 w-3.5 shrink-0 text-slate-300 transition-colors group-hover:text-emerald-600"
                          aria-hidden="true"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/80 px-4 py-2.5">
                <span className="hidden items-center gap-2 text-[10px] font-semibold text-slate-500 sm:inline-flex">
                  <kbd className="rounded border border-slate-300 bg-white px-1.5 py-0.5 font-mono text-[10px] text-slate-600">
                    Ctrl
                  </kbd>
                  <kbd className="rounded border border-slate-300 bg-white px-1.5 py-0.5 font-mono text-[10px] text-slate-600">
                    K
                  </kbd>
                  to search anywhere
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const hub = searchItems.find((item) => item.to === '/social-tools');
                    if (hub) go(hub);
                  }}
                  className="ml-auto inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 transition-colors hover:text-emerald-900"
                >
                  Browse all 16 tools
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </button>
              </div>
            </>
          ) : (
            <>
              <div
                id="tool-search-results"
                role="listbox"
                aria-label="Tools"
                className="max-h-[min(58vh,24rem)] overflow-y-auto p-2"
              >
                {results.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <span className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-400">
                      <Search className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <p className="mt-2 text-sm font-bold text-slate-900">
                      No tool matches “{query.trim()}”
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Try “sticker”, “compress”, “grid”, “caption” or “QR”.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setQuery('');
                        inputRef.current?.focus();
                      }}
                      className="mt-3 text-[11px] font-bold text-emerald-700 hover:text-emerald-900"
                    >
                      Show trending searches
                    </button>
                  </div>
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
                        className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors ${
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
                          <span className="flex flex-wrap items-center gap-1.5">
                            <span className="truncate text-[13px] font-bold text-slate-900">
                              {highlightMatch(item.label, trimmedQuery)}
                            </span>
                            <span className="shrink-0 rounded-full bg-white px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-[0.1em] text-slate-500 ring-1 ring-slate-200">
                              {item.group}
                            </span>
                          </span>
                          <span className="mt-0.5 block truncate text-[11px] text-slate-500">
                            {item.description}
                          </span>
                        </span>
                        <span className="hidden shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-500 sm:block">
                          {item.badge}
                        </span>
                        <ArrowRight
                          className={`h-3.5 w-3.5 shrink-0 ${
                            selected ? 'text-emerald-600' : 'text-slate-300'
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                    );
                  })
                )}
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/80 px-4 py-2.5 text-[10px] font-semibold text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <kbd className="rounded border border-slate-300 bg-white px-1.5 py-0.5 font-mono text-[10px] text-slate-600">
                    ↑↓
                  </kbd>
                  navigate
                  <kbd className="rounded border border-slate-300 bg-white px-1.5 py-0.5 font-mono text-[10px] text-slate-600">
                    <CornerDownLeft className="inline h-2.5 w-2.5" aria-hidden="true" />
                  </kbd>
                  open
                </span>
                <span>
                  {results.length} {results.length === 1 ? 'match' : 'matches'} · Esc to close
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
