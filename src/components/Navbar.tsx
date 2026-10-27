import React from 'react';
import { NavLink } from 'react-router-dom';
import { toolNavItems } from './navItems';
import { CreatorStudioMenu } from './CreatorStudioMenu';

export const Navbar: React.FC = () => {
  return (
    <nav aria-label="Primary" className="hidden items-center gap-0.5 min-[960px]:flex">
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
                `group relative flex items-center gap-2 rounded-xl px-2.5 py-2 text-[12px] font-semibold transition-colors duration-200 min-[1150px]:px-3 min-[1150px]:text-[13px] ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    aria-hidden="true"
                    className={`hidden h-4 w-4 transition-colors min-[1150px]:block ${
                      isActive ? 'text-emerald-700' : 'text-slate-600 group-hover:text-emerald-700'
                    }`}
                  />
                  <span>{item.label}</span>
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent transition-opacity duration-200 ${
                      isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                    }`}
                  />
                </>
              )}
            </NavLink>
          );
        })}
      <CreatorStudioMenu />
    </nav>
  );
};

