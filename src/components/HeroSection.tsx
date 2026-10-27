import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  CloudOff,
  Cpu,
  Images,
  LayoutGrid,
  Lock,
  Scissors,
  Search,
  ShieldCheck,
  Sparkles,
  Sticker,
  UserX,
  type LucideIcon,
} from 'lucide-react';

const trustPoints = [
  { icon: UserX, label: 'No signup' },
  { icon: Cpu, label: 'WASM powered' },
  { icon: CloudOff, label: 'No cloud uploads' },
  { icon: ShieldCheck, label: 'Zero tracking' },
];

const stats = [
  { value: '16', label: 'Browser tools' },
  { value: '0', label: 'Files uploaded' },
  { value: '100%', label: 'On-device' },
  { value: '₹0', label: 'Free forever' },
];

interface StartTask {
  to: string;
  label: string;
  hint: string;
  icon: LucideIcon;
  tone: string;
}

const startTasks: StartTask[] = [
  {
    to: '/whatsapp-status-splitter',
    label: 'Split a status video',
    hint: 'Long MP4 → exact 30s clips',
    icon: Scissors,
    tone: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  },
  {
    to: '/whatsapp-sticker-maker',
    label: 'Make a sticker pack',
    hint: 'Photo → 512px WebP ZIP',
    icon: Sticker,
    tone: 'bg-amber-50 text-amber-700 ring-amber-100',
  },
  {
    to: '/whatsapp-media-compressor',
    label: 'Compress chat media',
    hint: 'Photos, video, PDF, DOCX',
    icon: Images,
    tone: 'bg-sky-50 text-sky-700 ring-sky-100',
  },
  {
    to: '/instagram-grid-planner',
    label: 'Plan your feed',
    hint: 'See nine posts before you post',
    icon: LayoutGrid,
    tone: 'bg-rose-50 text-rose-600 ring-rose-100',
  },
];

export const HeroSection: React.FC = () => {
  const focusSearch = () => {
    window.dispatchEvent(new CustomEvent('wakit:focus-search'));
  };

  return (
    <section className="relative overflow-hidden pb-8 pt-7 sm:pb-12 sm:pt-11">
      {/* Local glow + orbit rings */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[26rem] w-[46rem] -translate-x-1/2 rounded-full bg-emerald-200/35 blur-[120px]" />
        <div className="absolute left-1/2 top-8 h-[22rem] w-[22rem] -translate-x-1/2 rounded-full border border-emerald-300/30" />
        <div className="absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full border border-teal-300/20" />
      </div>

      <div className="w-full">
        <div className="grid items-stretch gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-10 xl:gap-12">
          {/* Left: message and primary actions */}
          <div className="flex flex-col justify-center text-center lg:text-left">
            <div className="eyebrow animate-fade-up">
              <Lock className="h-3.5 w-3.5" aria-hidden="true" />
              16 browser tools · zero uploads
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
            </div>

            <h1
              className="animate-fade-up mt-5 text-[2.45rem] font-extrabold leading-[1.02] tracking-[-0.04em] text-slate-900 sm:text-6xl xl:text-[4.05rem]"
              style={{ animationDelay: '80ms' }}
            >
              Every social tool you need.{' '}
              <span className="mt-1 block text-gradient-emerald">None of the uploads.</span>
            </h1>

            <p
              className="animate-fade-up mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg lg:mx-0"
              style={{ animationDelay: '160ms' }}
            >
              Split status videos, compress heavy chat media, build scan-to-chat QR codes and
              design posts for WhatsApp, Instagram and Facebook — with Canvas and WebAssembly
              running inside this tab.
            </p>

            <div
              className="animate-fade-up mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
              style={{ animationDelay: '240ms' }}
            >
              <a href="#tool-directory" className="btn-primary group w-full px-6 py-3.5 text-sm sm:w-auto">
                Browse all 16 tools
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
              </a>
              <Link to="/social-tools" className="btn-secondary w-full px-6 py-3.5 text-sm sm:w-auto">
                <Sparkles className="h-4 w-4 text-amber-500" aria-hidden="true" />
                Open Creator Studio
              </Link>
            </div>

            <div
              className="animate-fade-up mt-7 flex flex-wrap items-center justify-center gap-2 lg:justify-start"
              style={{ animationDelay: '320ms' }}
            >
              {trustPoints.map((point) => {
                const Icon = point.icon;
                return (
                  <span
                    key={point.label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-2.5 py-1.5 text-[11px] font-bold text-slate-600 shadow-sm"
                  >
                    <Icon className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                    {point.label}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Right: a task-first launchpad instead of a duplicate tool list */}
          <aside
            aria-label="Quick start tools"
            className="animate-fade-up mx-auto h-full w-full max-w-xl lg:max-w-none"
            style={{ animationDelay: '300ms' }}
          >
            <div className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_24px_65px_-32px_rgba(2,44,34,0.35)]">
              <div className="relative overflow-hidden bg-[linear-gradient(115deg,#022c22_0%,#065f46_58%,#0f766e_100%)] px-5 py-5 text-white">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                  <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-amber-300/15 blur-2xl" />
                  <div className="absolute bottom-0 right-16 h-20 w-20 rounded-full border border-white/10" />
                </div>
                <div className="relative flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-amber-300">
                      Start here
                    </p>
                    <h2 className="mt-1 text-xl font-extrabold tracking-tight sm:text-2xl">
                      Pick a task, not a template.
                    </h2>
                  </div>
                  <span className="shrink-0 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-bold text-emerald-50">
                    4 fast paths
                  </span>
                </div>
                <p className="relative mt-2 max-w-sm text-xs leading-relaxed text-emerald-100/80">
                  The jobs creators repeat most, pre-wired to the right export size.
                </p>
              </div>

              <div className="grid flex-1 grid-cols-2 gap-2 p-3 sm:gap-2.5 sm:p-4">
                {startTasks.map((task) => {
                  const Icon = task.icon;
                  return (
                    <Link
                      key={task.to}
                      to={task.to}
                      className="group flex min-w-0 flex-col gap-2.5 rounded-xl border border-slate-200 bg-white p-3 transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50/40 hover:shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ring-1 ${task.tone}`}
                        >
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <ArrowUpRight
                          className="h-3.5 w-3.5 shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-emerald-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12px] font-bold leading-snug text-slate-900 group-hover:text-emerald-800">
                          {task.label}
                        </p>
                        <p className="mt-0.5 truncate text-[10px] font-medium text-slate-500">
                          {task.hint}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/80 px-4 py-3">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
                  <Lock className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                  Files never leave this tab
                </span>
                <button
                  type="button"
                  onClick={focusSearch}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 transition-colors hover:text-emerald-900"
                >
                  <Search className="h-3 w-3" aria-hidden="true" />
                  Search all 16 tools
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* Stats strip */}
        <dl
          className="animate-fade-up mt-8 grid w-full grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 shadow-sm sm:mt-10 sm:grid-cols-4"
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
