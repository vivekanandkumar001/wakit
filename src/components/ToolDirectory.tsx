import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  LayoutGrid,
  Search,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { toolNavItems, type NavItem } from './navItems';
import {
  crossPlatformToolItems,
  facebookToolItems,
  instagramToolItems,
  whatsappToolItems,
} from '../data/socialTools';

type Platform = 'WhatsApp' | 'Instagram' | 'Facebook' | 'Cross-platform';
type Filter = 'All' | Platform;

interface DirectoryTool extends NavItem {
  platform: Platform;
  popular?: boolean;
}

interface PlatformStyle {
  dot: string;
  icon: string;
  chip: string;
}

const platformStyles: Record<Platform, PlatformStyle> = {
  WhatsApp: {
    dot: 'bg-emerald-500',
    icon: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    chip: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  },
  Instagram: {
    dot: 'bg-rose-500',
    icon: 'bg-rose-50 text-rose-600 ring-rose-100',
    chip: 'bg-rose-50 text-rose-700 ring-rose-200',
  },
  Facebook: {
    dot: 'bg-sky-500',
    icon: 'bg-sky-50 text-sky-700 ring-sky-100',
    chip: 'bg-sky-50 text-sky-700 ring-sky-200',
  },
  'Cross-platform': {
    dot: 'bg-amber-500',
    icon: 'bg-amber-50 text-amber-700 ring-amber-100',
    chip: 'bg-amber-50 text-amber-800 ring-amber-200',
  },
};

const essentials = toolNavItems.filter(
  (item) => item.to !== '/' && item.to !== '/social-tools',
);

const popularPaths = new Set([
  '/whatsapp-status-splitter',
  '/whatsapp-sticker-maker',
  '/whatsapp-audio-compressor',
  '/instagram-grid-planner',
]);

const directoryTools: DirectoryTool[] = [
  ...essentials.map((tool) => ({
    ...tool,
    platform: 'WhatsApp' as const,
    popular: popularPaths.has(tool.to),
  })),
  ...whatsappToolItems.map((tool) => ({
    ...tool,
    platform: 'WhatsApp' as const,
    popular: popularPaths.has(tool.to),
  })),
  ...instagramToolItems.map((tool) => ({
    ...tool,
    platform: 'Instagram' as const,
    popular: popularPaths.has(tool.to),
  })),
  ...facebookToolItems.map((tool) => ({
    ...tool,
    platform: 'Facebook' as const,
  })),
  ...crossPlatformToolItems.map((tool) => ({
    ...tool,
    platform: 'Cross-platform' as const,
  })),
];

const filterCounts: Record<Filter, number> = {
  All: directoryTools.length,
  WhatsApp: directoryTools.filter((tool) => tool.platform === 'WhatsApp').length,
  Instagram: directoryTools.filter((tool) => tool.platform === 'Instagram').length,
  Facebook: directoryTools.filter((tool) => tool.platform === 'Facebook').length,
  'Cross-platform': directoryTools.filter((tool) => tool.platform === 'Cross-platform').length,
};

const filters: Filter[] = ['All', 'WhatsApp', 'Instagram', 'Facebook', 'Cross-platform'];

interface ToolCardProps {
  tool: DirectoryTool;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const Icon: LucideIcon = tool.icon;
  const style = platformStyles[tool.platform];

  return (
    <Link
      to={tool.to}
      className="group relative flex h-full min-h-[11.5rem] flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-[0_18px_36px_-24px_rgba(5,150,105,0.32)]"
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ring-1 ${style.icon}`}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="rounded-full bg-slate-50 px-2 py-1 text-[8px] font-extrabold uppercase tracking-[0.1em] text-slate-500 ring-1 ring-slate-200">
          {tool.badge}
        </span>
      </div>

      <div className="mt-3 min-w-0 flex-1">
        <h3 className="text-[15px] font-bold leading-snug tracking-tight text-slate-900 group-hover:text-emerald-800">
          {tool.label}
        </h3>
        <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-600">
          {tool.description}
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-2.5">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.1em] ring-1 ${style.chip}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
          {tool.platform}
        </span>

        {tool.popular ? (
          <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-amber-700">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Popular
          </span>
        ) : (
          <ArrowUpRight
            className="h-3.5 w-3.5 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-emerald-600"
            aria-hidden="true"
          />
        )}
      </div>
    </Link>
  );
};

/**
 * Search-first homepage directory. One scannable card per tool, with platform
 * filters, so visitors can find a job without opening the mega menu first.
 */
export const ToolDirectory: React.FC = () => {
  const [filter, setFilter] = useState<Filter>('All');

  const visibleTools = useMemo(
    () =>
      filter === 'All'
        ? directoryTools
        : directoryTools.filter((tool) => tool.platform === filter),
    [filter],
  );

  const focusSearch = () => {
    window.dispatchEvent(new CustomEvent('wakit:focus-search'));
  };

  return (
    <section id="tool-directory" aria-labelledby="tool-directory-heading" className="scroll-mt-32 py-4 sm:py-6">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-4xl">
          <span className="eyebrow">
            <LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />
            Tool directory
          </span>
          <h2
            id="tool-directory-heading"
            className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
          >
            All 16 tools.{' '}
            <span className="text-gradient-emerald">One private tab.</span>
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
            Filter by the platform you are posting to, or open a tool and follow its short guide.
            Nothing is installed, uploaded or locked behind an account.
          </p>
        </div>

        <button
          type="button"
          onClick={focusSearch}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
        >
          <Search className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
          Search all 16 tools
          <kbd className="ml-1 hidden rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-slate-500 sm:inline">
            Ctrl K
          </kbd>
        </button>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="group"
          aria-label="Filter tools by platform"
          className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1"
        >
          {filters.map((option) => {
            const active = filter === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                aria-pressed={active}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold transition-colors ${
                  active
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-700'
                }`}
              >
                {option === 'All' ? 'All tools' : option}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[9px] font-extrabold ${
                    active ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {filterCounts[option]}
                </span>
              </button>
            );
          })}
        </div>

        <p className="shrink-0 text-[11px] font-semibold text-slate-500" aria-live="polite">
          Showing <strong className="text-slate-900">{visibleTools.length}</strong> of{' '}
          {directoryTools.length} tools
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {visibleTools.map((tool) => (
          <ToolCard key={tool.to} tool={tool} />
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-[linear-gradient(100deg,#ecfdf5,#ffffff_58%,#f0fdfa)] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-700 text-white shadow-sm">
            <Sparkles className="h-4 w-4 text-amber-300" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Want the full Creator Studio workflow?</h3>
            <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600">
              All 12 creator tools, grouped by platform, with safe-zone guides and export sizes.
            </p>
          </div>
        </div>
        <Link
          to="/social-tools"
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-[11px] font-extrabold text-emerald-800 ring-1 ring-emerald-200 transition-colors hover:bg-emerald-700 hover:text-white hover:ring-emerald-700"
        >
          Open Creator Studio
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
};
