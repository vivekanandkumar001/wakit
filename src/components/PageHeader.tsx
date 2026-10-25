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
    <header className="relative mx-auto max-w-2xl px-1 pb-1 pt-2 text-center sm:pt-6">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-8 -z-10 mx-auto h-52 max-w-xl rounded-full bg-emerald-200/40 blur-[90px]" />

      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="mb-4">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      )}

      <span className="eyebrow">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {eyebrow}
      </span>

      <h1 className="mt-5 text-3xl font-extrabold leading-[1.1] tracking-[-0.03em] text-slate-900 sm:text-4xl lg:text-[2.75rem]">
        {title}
      </h1>

      {description && (
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-[15px]">
          {description}
        </p>
      )}

      {updated && (
        <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
          Updated {updated}
        </p>
      )}
    </header>
  );
};
