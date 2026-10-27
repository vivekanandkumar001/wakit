import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDown,
  ArrowRight,
  CloudOff,
  Cpu,
  Images,
  LayoutGrid,
  Lock,
  Megaphone,
  Scissors,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Square,
  Sticker,
  Type,
  UserX,
  type LucideIcon,
} from 'lucide-react';

const trustPoints = [
  { icon: UserX, label: 'No signup', tone: 'text-emerald-600' },
  { icon: Cpu, label: 'WASM powered', tone: 'text-teal-600' },
  { icon: CloudOff, label: 'No cloud uploads', tone: 'text-cyan-600' },
  { icon: ShieldCheck, label: 'Zero tracking', tone: 'text-emerald-600' },
];

const stats = [
  { value: '16', label: 'Browser tools' },
  { value: '0', label: 'Files uploaded' },
  { value: '100%', label: 'On-device' },
  { value: '₹0', label: 'Free forever' },
];

interface QuickTool {
  to: string;
  label: string;
  hint: string;
  icon: LucideIcon;
}

const quickTools: QuickTool[] = [
  { to: '/whatsapp-status-splitter', label: 'Split a status video', hint: 'Exact 30-second clips', icon: Scissors },
  { to: '/whatsapp-media-compressor', label: 'Compress chat media', hint: 'Photos · video · PDF/DOCX', icon: Images },
  { to: '/whatsapp-sticker-maker', label: 'Make a sticker pack', hint: '512px WebP export', icon: Sticker },
  { to: '/instagram-caption-studio', label: 'Write a caption', hint: 'Bold text + hashtags', icon: Type },
  { to: '/instagram-grid-planner', label: 'Plan your feed', hint: 'Nine-post preview', icon: LayoutGrid },
  { to: '/social-batch-resizer', label: 'Resize for every app', hint: '8 platform presets', icon: SlidersHorizontal },
  { to: '/facebook-ad-mockup', label: 'Preview a Facebook ad', hint: 'Feed, story, marketplace', icon: Megaphone },
  { to: '/facebook-cover-event-kit', label: 'Design a page cover', hint: 'Cover + QR invite', icon: Square },
];

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-6 pb-10 sm:pt-10 sm:pb-14">
      {/* Local glow + orbit rings */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[26rem] w-[42rem] -translate-x-1/2 rounded-full bg-emerald-200/40 blur-[110px]" />
        <div className="absolute left-1/2 top-10 h-[22rem] w-[22rem] -translate-x-1/2 rounded-full border border-emerald-300/40" />
        <div className="absolute left-1/2 top-0 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full border border-teal-300/25" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="grid items-stretch gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12">
          {/* Left: message and primary actions */}
          <div className="text-center lg:text-left">
            <div className="eyebrow animate-fade-up">
              <Lock className="h-3.5 w-3.5" aria-hidden="true" />
              Private by architecture
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
            </div>

            <h1
              className="animate-fade-up mt-5 text-[2.35rem] font-extrabold leading-[1.05] tracking-[-0.035em] text-slate-900 sm:text-6xl lg:text-[3.4rem] xl:text-[3.9rem]"
              style={{ animationDelay: '80ms' }}
            >
              Private social media tools,{' '}
              <span className="mt-1 block text-gradient-emerald">right in your browser</span>
            </h1>

            <p
              className="animate-fade-up mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg lg:mx-0"
              style={{ animationDelay: '160ms' }}
            >
              Split long videos into 30-second status clips, message unsaved numbers, build
              scan-to-chat QR codes, compress chat media and plan your next Instagram or Facebook
              post — all processed locally with Canvas and WebAssembly. No uploads, no accounts,
              no waiting.
            </p>

            <div
              className="animate-fade-up mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
              style={{ animationDelay: '240ms' }}
            >
              <a href="#tools" className="btn-primary group w-full px-6 py-3.5 text-sm sm:w-auto">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Explore the toolkit
                <ArrowDown className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" aria-hidden="true" />
              </a>
              <Link to="/social-tools" className="btn-secondary w-full px-6 py-3.5 text-sm sm:w-auto">
                <Sparkles className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                Open Creator Studio
              </Link>
            </div>

            {/* Trust points */}
            <div
              className="animate-fade-up mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 lg:justify-start"
              style={{ animationDelay: '320ms' }}
            >
              {trustPoints.map((point) => {
                const Icon = point.icon;
                return (
                  <span key={point.label} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                    <Icon className={`h-4 w-4 ${point.tone}`} aria-hidden="true" />
                    {point.label}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Right: quick-start shortcuts so the first screen has a clear next step */}
          <aside
            aria-label="Quick start tools"
            className="animate-fade-up mx-auto h-full w-full max-w-xl lg:max-w-none"
            style={{ animationDelay: '300ms' }}
          >
            <div className="glass-card flex h-full flex-col overflow-hidden p-4 shadow-lg shadow-emerald-900/5 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700">
                    Quick start
                  </p>
                  <h2 className="mt-1 text-lg font-extrabold tracking-tight text-slate-900">
                    Pick a task, skip the setup
                  </h2>
                </div>
                <span className="badge shrink-0">
                  <Sparkles className="h-3 w-3" aria-hidden="true" />{quickTools.length} shortcuts
                </span>
              </div>

              <div className="mt-4 grid flex-1 auto-rows-fr gap-2 sm:grid-cols-2">
                {quickTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.to}
                      to={tool.to}
                      className="group flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white/85 p-2.5 transition-all hover:border-emerald-300 hover:bg-emerald-50/60 hover:shadow-sm"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                          {tool.label}
                        </span>
                        <span className="mt-0.5 block truncate text-[10px] font-medium text-slate-500">
                          {tool.hint}
                        </span>
                      </span>
                      <ArrowRight
                        className="h-3.5 w-3.5 shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-emerald-600"
                        aria-hidden="true"
                      />
                    </Link>
                  );
                })}
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
                  <Lock className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                  Files never leave this tab
                </span>
                <Link
                  to="/social-tools"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 transition-colors hover:text-emerald-900"
                >
                  All 12 Creator tools
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Stats strip */}
        <dl
          className="animate-fade-up mx-auto mt-9 grid w-full max-w-5xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 shadow-sm sm:grid-cols-4"
          style={{ animationDelay: '400ms' }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white px-4 py-4 text-center sm:text-left">
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                  {stat.value}
                </span>
                <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
