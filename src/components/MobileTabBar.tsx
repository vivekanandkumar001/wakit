import React from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Home, type LucideIcon } from 'lucide-react';
import { toolCategories } from '../data/toolCategories';
import { PlatformMark, type PlatformKey } from './BrandIcons';

interface TabItem {
  key: string;
  label: string;
  to: string;
  /** Home uses a Lucide glyph; platform tabs use their real brand mark. */
  icon?: LucideIcon;
  platform?: PlatformKey;
  /** Tool paths that belong to this tab, for the active state. */
  paths: string[];
}

const HOME_TAB: TabItem = {
  key: 'home',
  label: 'Home',
  to: '/',
  icon: Home,
  paths: ['/'],
};

const platformLabels: Record<string, string> = {
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  facebook: 'Facebook',
  multi: 'Multi',
};

const platformTabs: TabItem[] = toolCategories.map((category) => ({
  key: category.key,
  label: platformLabels[category.key] ?? category.label,
  to: `/?platform=${category.key}#tool-directory`,
  platform: category.key,
  paths: category.tools.map((tool) => tool.to),
}));

const tabs: TabItem[] = [HOME_TAB, ...platformTabs];

/**
 * App-style bottom navigation. Native apps keep their top-level destinations
 * inside thumb reach; on the web this also removes the need to open the
 * hamburger before reaching a platform. Hidden from 900px up, where the header
 * category strip already covers the same destinations.
 */
export const MobileTabBar: React.FC = () => {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const platformParam = (searchParams.get('platform') ?? '').toLowerCase();

  const isActive = (tab: TabItem) => {
    if (tab.key === 'home') return pathname === '/' && !platformParam;
    if (platformParam === tab.key) return true;
    return tab.paths.includes(pathname);
  };

  return (
    <nav
      aria-label="Primary tools"
      className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 shadow-[0_-10px_30px_-22px_rgba(15,23,42,0.45)] backdrop-blur-xl min-[900px]:hidden"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab);

          return (
            <li key={tab.key} className="min-w-0">
              <Link
                to={tab.to}
                aria-current={active ? 'page' : undefined}
                aria-label={tab.key === 'home' ? 'WaKit home' : `Show ${tab.label} tools`}
                className="press relative flex min-h-[3.25rem] flex-col items-center justify-center gap-1 px-0.5 pb-1.5 pt-2 transition-colors"
              >
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-3 top-0 h-0.5 rounded-full bg-emerald-600 transition-opacity ${
                    active ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                {Icon ? (
                  <span
                    className={`grid h-6 w-9 place-items-center rounded-lg transition-colors ${
                      active ? 'bg-emerald-600 text-white' : 'text-slate-500'
                    }`}
                  >
                    <Icon className="h-[17px] w-[17px]" aria-hidden="true" />
                  </span>
                ) : (
                  <span
                    className={`grid h-6 w-9 place-items-center transition-all duration-200 ${
                      active ? 'opacity-100' : 'opacity-70'
                    }`}
                  >
                    {tab.platform && (
                      <PlatformMark platform={tab.platform} className="h-[22px] w-[22px]" />
                    )}
                  </span>
                )}

                <span
                  className={`text-[9.5px] leading-none tracking-tight ${
                    active ? 'font-extrabold text-emerald-800' : 'font-bold text-slate-500'
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
