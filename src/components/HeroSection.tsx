import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDown,
  CloudOff,
  Cpu,
  Lock,
  ShieldCheck,
  Sparkles,
  UserX,
} from 'lucide-react';

const trustPoints = [
  { icon: UserX, label: 'No signup', tone: 'text-emerald-600' },
  { icon: Cpu, label: 'WASM powered', tone: 'text-teal-600' },
  { icon: CloudOff, label: 'No cloud uploads', tone: 'text-cyan-600' },
  { icon: ShieldCheck, label: 'Zero tracking', tone: 'text-emerald-600' },
];

const stats = [
  { value: '4', label: 'Browser tools' },
  { value: '0', label: 'Files uploaded' },
  { value: '100%', label: 'On-device' },
  { value: '₹0', label: 'Free forever' },
];

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 text-center sm:pt-12 sm:pb-16">
      {/* Local glow + orbit rings */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[26rem] w-[42rem] -translate-x-1/2 rounded-full bg-emerald-200/40 blur-[110px]" />
        <div className="absolute left-1/2 top-10 h-[22rem] w-[22rem] -translate-x-1/2 rounded-full border border-emerald-300/40" />
        <div className="absolute left-1/2 top-0 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full border border-teal-300/25" />
      </div>

      <div className="mx-auto max-w-4xl px-1 sm:px-4">
        <div className="eyebrow animate-fade-up">
          <Lock className="h-3.5 w-3.5" aria-hidden="true" />
          Private by architecture
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
        </div>

        <h1
          className="animate-fade-up mt-6 text-[2.5rem] font-extrabold leading-[1.05] tracking-[-0.035em] text-slate-900 sm:text-6xl lg:text-7xl"
          style={{ animationDelay: '80ms' }}
        >
          Private WhatsApp tools,{' '}
          <span className="mt-1 block text-gradient-emerald">right in your browser</span>
        </h1>

        <p
          className="animate-fade-up mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg"
          style={{ animationDelay: '160ms' }}
        >
          Split long videos into 30-second status clips, message unsaved numbers, build
          scan-to-chat QR codes and compress audio — all processed locally with WebAssembly.
          No uploads, no accounts, no waiting.
        </p>

        <div
          className="animate-fade-up mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          style={{ animationDelay: '240ms' }}
        >
          <a href="#tools" className="btn-primary group w-full px-6 py-3.5 text-sm sm:w-auto">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Explore the toolkit
            <ArrowDown className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" aria-hidden="true" />
          </a>
          <Link to="/about" className="btn-secondary w-full px-6 py-3.5 text-sm sm:w-auto">
            <ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            How privacy works
          </Link>
        </div>

        {/* Trust points */}
        <div
          className="animate-fade-up mt-9 flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5"
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

        {/* Stats strip */}
        <dl
          className="animate-fade-up mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 shadow-sm sm:grid-cols-4"
          style={{ animationDelay: '400ms' }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white px-4 py-4">
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
