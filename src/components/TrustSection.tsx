import React from 'react';
import { ArrowUpRight, Cpu, Download, FileUp, HardDrive, LockKeyhole, ShieldCheck, WifiOff } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  {
    step: '01',
    icon: FileUp,
    title: 'Pick a tool and add your file',
    text: 'Choose a splitter, QR builder or compressor. Drop the file straight into the card — no account, no email.',
  },
  {
    step: '02',
    icon: Cpu,
    title: 'Your browser does the work',
    text: 'FFmpeg compiled to WebAssembly runs in a web worker. Media is processed in local memory, never sent anywhere.',
  },
  {
    step: '03',
    icon: Download,
    title: 'Download and post',
    text: 'Save clips, QR codes or compressed audio directly to your device. Close the tab and everything is gone.',
  },
];

const guarantees = [
  { icon: WifiOff, title: 'No server uploads', text: 'Files are read from disk into browser memory only.' },
  { icon: HardDrive, title: 'No stored data', text: 'No database, no logs, no media retention of any kind.' },
  { icon: LockKeyhole, title: 'No accounts', text: 'No signup, no tracking cookies, nothing to unsubscribe from.' },
];

export const TrustSection: React.FC = () => {
  return (
    <section className="relative my-12 sm:my-16" aria-labelledby="privacy-heading">
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-0 h-64 w-64 rounded-full bg-emerald-100/70 blur-[80px]" />
          <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-teal-100/60 blur-[80px]" />
        </div>

        <div className="relative mx-auto max-w-2xl text-center">
          <span className="eyebrow">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Privacy architecture
          </span>
          <h2 id="privacy-heading" className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Built to keep your media <span className="text-gradient-emerald">off the internet</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Cloud converters ask you to upload private videos and voice notes. WaKit flips that
            model: the tool comes to your device, and your files never leave it.
          </p>
        </div>

        <ol className="relative mt-9 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {steps.map(({ step, icon: Icon, title, text }, index) => (
            <li key={step} className="relative">
              {index < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-[calc(100%+0.5rem)] top-9 hidden h-px w-[calc(1rem-1px)] bg-gradient-to-r from-emerald-300 to-transparent sm:block"
                />
              )}
              <div className="h-full rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/40">
                <div className="flex items-center justify-between">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-emerald-600 ring-1 ring-emerald-200">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="font-mono text-[11px] font-bold tracking-widest text-slate-600">{step}</span>
                </div>
                <h3 className="mt-3 text-sm font-bold text-slate-900">{title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="relative mt-4 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-3">
          {guarantees.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-2.5 bg-white px-4 py-3.5">
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
              <p className="text-xs leading-snug text-slate-600">
                <span className="block font-bold text-slate-900">{title}</span>
                {text}
              </p>
            </div>
          ))}
        </div>

        <div className="relative mt-6 flex justify-center">
          <Link
            to="/privacy-policy"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 transition-colors hover:text-emerald-800"
          >
            Read the full privacy policy
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};
