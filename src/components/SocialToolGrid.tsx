import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { socialToolGroups } from '../data/socialTools';

/**
 * Compact homepage discovery block for the 12 Creator Studio tools.
 * The hub page carries the full descriptions; this section stays scannable.
 */
export const SocialToolGrid: React.FC = () => {
  return (
    <section id="creator-studio" className="relative scroll-mt-24 py-4 sm:py-6">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="eyebrow">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
            Creator Studio
          </span>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            12 social tools. <span className="text-gradient-emerald">Still zero uploads.</span>
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
            Stickers, chat insights, catalogs, media compression, feed planning, carousels, captions,
            covers, ad mockups, Marketplace listings and campaign links — all in your browser.
          </p>
        </div>
        <Link
          to="/social-tools"
          className="group inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-800 transition-colors hover:bg-emerald-100"
        >
          Open Creator Studio
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {socialToolGroups.map((group) => (
          <section key={group.name} className="glass-card flex flex-col overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-black text-slate-900">{group.name}</h3>
                <span className="rounded-full bg-white px-2 py-0.5 font-mono text-[9px] font-bold text-slate-500 ring-1 ring-slate-200">
                  {group.tools.length}
                </span>
              </div>
              <p className="mt-1 text-[10px] leading-relaxed text-slate-500">{group.description}</p>
            </div>
            <ul className="flex flex-1 flex-col divide-y divide-slate-100">
              {group.tools.map((tool) => (
                <li key={tool.to}>
                  <Link
                    to={tool.to}
                    className="group flex items-center gap-2.5 px-4 py-3 transition-colors hover:bg-emerald-50/50"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                      <tool.icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                        {tool.label}
                      </span>
                      <span className="mt-0.5 block truncate text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                        {tool.badge}
                      </span>
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-emerald-600" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
};
