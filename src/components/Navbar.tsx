import React from 'react';
import { NavLink } from 'react-router-dom';
import { Scissors, Send, QrCode, Mic, Info, Shield, FileText, Mail } from 'lucide-react';

export const Navbar: React.FC = () => {
  const tools = [
    {
      to: '/split-video-for-whatsapp-status',
      label: 'Status Splitter',
      badge: 'Lossless 30s',
      icon: Scissors,
    },
    {
      to: '/send-whatsapp-without-saving-number',
      label: 'Direct Message',
      badge: 'Zero Save',
      icon: Send,
    },
    {
      to: '/whatsapp-qr-code-generator',
      label: 'QR Code Builder',
      badge: 'Custom PNG/SVG',
      icon: QrCode,
    },
    {
      to: '/compress-audio-for-whatsapp',
      label: 'Audio Compressor',
      badge: 'Voice Note Optim',
      icon: Mic,
    },
  ];

  const pages = [
    { to: '/about', label: 'About', icon: Info },
    { to: '/privacy-policy', label: 'Privacy Policy', icon: Shield },
    { to: '/terms', label: 'Terms', icon: FileText },
    { to: '/contact', label: 'Contact', icon: Mail },
  ];

  return (
    <div className="w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-900/50 overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 py-2 min-w-max">
          {/* Main Tools Nav Tabs */}
          <nav className="flex items-center gap-1.5 sm:gap-2">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <NavLink
                  key={tool.to}
                  to={tool.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                      <span>{tool.label}</span>
                      <span
                        className={`hidden lg:inline-block text-[10px] font-normal px-1.5 py-0.2 rounded-md ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {tool.badge}
                      </span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Secondary Links */}
          <div className="hidden md:flex items-center gap-1 border-l border-slate-300 dark:border-slate-800 pl-4">
            {pages.map((page) => {
              const Icon = page.icon;
              return (
                <NavLink
                  key={page.to}
                  to={page.to}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{page.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
