import React from 'react';
import { NavLink } from 'react-router-dom';
import { Scissors, Send, QrCode, Mic, LayoutGrid } from 'lucide-react';

export const Navbar: React.FC = () => {
  const tools = [
    {
      to: '/',
      label: 'All Tools Dashboard',
      badge: 'Interactive',
      icon: LayoutGrid,
    },
    {
      to: '/split-video-for-whatsapp-status',
      label: '30s Status Splitter',
      badge: 'Lossless 30s',
      icon: Scissors,
    },
    {
      to: '/send-whatsapp-without-saving-number',
      label: 'Direct Chat',
      badge: 'Zero Contact',
      icon: Send,
    },
    {
      to: '/whatsapp-qr-code-generator',
      label: 'QR Builder',
      badge: 'Vector/PNG',
      icon: QrCode,
    },
    {
      to: '/compress-audio-for-whatsapp',
      label: 'Audio Compressor',
      badge: '< 16MB Target',
      icon: Mic,
    },
  ];

  return (
    <div className="w-full border-b border-slate-800 bg-slate-900/60 backdrop-blur-md overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 py-2.5 min-w-max">
          <nav className="flex items-center gap-1.5 sm:gap-2">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <NavLink
                  key={tool.to}
                  to={tool.to}
                  end={tool.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-lg shadow-emerald-500/20'
                        : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700 hover:bg-slate-800/80'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-emerald-400'}`} />
                      <span>{tool.label}</span>
                      <span
                        className={`hidden lg:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-slate-950/20 text-slate-950'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
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
        </div>
      </div>
    </div>
  );
};
