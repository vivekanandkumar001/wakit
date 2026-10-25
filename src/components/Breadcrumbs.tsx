import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { type Breadcrumb } from './SEOHead';

interface BreadcrumbsProps {
  items: Breadcrumb[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-1.5 px-2 text-[11px] font-semibold text-slate-600">
      <Link to="/" className="inline-flex items-center gap-1 transition-colors hover:text-emerald-700">
        <Home className="h-3 w-3" aria-hidden="true" />
        Home
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={`${item.name}-${index}`}>
            <ChevronRight className="h-3 w-3 shrink-0 text-slate-400" aria-hidden="true" />
            {isLast || !item.path ? (
              <span aria-current="page" className="text-slate-900">
                {item.name}
              </span>
            ) : (
              <Link to={item.path} className="transition-colors hover:text-emerald-700">
                {item.name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
