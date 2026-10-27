import React from 'react';
import { type LucideIcon } from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';
import { type Breadcrumb } from './SEOHead';
import { SITE } from '../config/site';

interface PageHeaderProps {
  icon: LucideIcon;
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  updated?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  icon: Icon,
  eyebrow,
  title,
  description,
  breadcrumbs,
  updated = SITE.updatedLabel,
}) => {
  return (
    <header className="relative mx-auto max-w-4xl px-1 pb-1 pt-2 text-center sm:pt-6">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-8 -z-10 mx-auto h-52 max-w-xl rounded-full bg-emerald-200/40 blur-[90px]" />

      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="mb-1.5 hidden sm:mb-4 sm:block">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      )}

      <span className="eyebrow hidden sm:inline-flex">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {eyebrow}
      </span>

      <h1 className="text-2xl font-extrabold leading-[1.15] tracking-[-0.03em] text-slate-900 sm:mt-5 sm:text-4xl sm:leading-[1.1] lg:text-[2.75rem]">
        {title}
      </h1>

      {description && (
        <p className="mx-auto mt-2 line-clamp-2 max-w-xl text-[13px] leading-relaxed text-slate-600 sm:mt-3 sm:line-clamp-none sm:text-[15px]">
          {description}
        </p>
      )}

      {updated && (
        <p className="mt-3 hidden text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 sm:block">
          Updated {updated}
        </p>
      )}
    </header>
  );
};
