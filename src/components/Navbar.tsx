import React from 'react';
import { NavLink } from 'react-router-dom';
import { toolNavItems } from './navItems';
import { CreatorStudioMenu } from './CreatorStudioMenu';

/**
 * Desktop category strip below the brand/search bar. Text-first like a
 * marketplace header, so the row stays compact and scannable.
 */
export const Navbar: React.FC = () => {
  return (
    <nav aria-label="Primary" className="hidden min-w-0 items-center gap-0.5 min-[900px]:flex">
      {toolNavItems
        .filter((item) => item.to !== '/social-tools')
        .map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              title={item.description}
              className={({ isActive }) =>
                `group relative flex h-11 items-center gap-1.5 whitespace-nowrap px-2.5 text-[12.5px] font-semibold transition-colors duration-200 ${
                  isActive ? 'text-emerald-700' : 'text-slate-600 hover:text-emerald-700'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    aria-hidden="true"
                    className={`hidden h-4 w-4 min-[1200px]:block ${
                      isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-emerald-600'
                    }`}
                  />
                  <span>{item.label}</span>
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-emerald-600 transition-opacity duration-200 ${
                      isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
                    }`}
                  />
                </>
              )}
            </NavLink>
          );
        })}

      <span aria-hidden="true" className="mx-1.5 h-4 w-px bg-slate-200" />
      <CreatorStudioMenu />
    </nav>
  );
};
