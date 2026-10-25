import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { toolNavItems } from './navItems';

interface RelatedToolsProps {
  /** Route of the current page, so it is not recommended to itself. */
  currentPath: string;
  title?: string;
}

/** Internal-link block: every tool page links to the other three. */
export const RelatedTools: React.FC<RelatedToolsProps> = ({
  currentPath,
  title = 'Related free tools',
}) => {
  const related = toolNavItems.filter((item) => item.to !== '/' && item.to !== currentPath);

  return (
    <section aria-labelledby="related-tools-heading" className="my-10 space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">
            Keep going
          </p>
          <h2 id="related-tools-heading" className="mt-1 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
            {title}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {related.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className="group glass-card flex items-start gap-3 p-4 transition-transform hover:-translate-y-0.5"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-900">{item.label}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-slate-400 transition-colors group-hover:text-emerald-600" aria-hidden="true" />
                </span>
                <span className="mt-0.5 block text-[11px] leading-snug text-slate-600">
                  {item.description}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
