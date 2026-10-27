import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  CloudOff,
  Download,
  Gauge,
  Info,
  Lock,
  Monitor,
  QrCode,
  Share,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Zap,
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { AdBanner } from '../components/AdBanner';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { FAQAccordion } from '../components/FAQAccordion';
import { SEOHead, type FAQItem } from '../components/SEOHead';
import { SITE } from '../config/site';
import { useInstallPrompt } from '../hooks/useInstallPrompt';

const APP_PATH = '/app';
const APP_URL = `${SITE.origin}${APP_PATH}`;

const appFaqs: FAQItem[] = [
  {
    question: 'Is WaKit a real app or just a website shortcut?',
    answer:
      'WaKit installs as a Progressive Web App (PWA). Your browser adds a real app icon, opens it full-screen without the address bar, and caches the app shell so it starts instantly. The tools still run 100% on your device — installing does not upload anything or create an account.',
  },
  {
    question: 'Do I need to download an APK file?',
    answer:
      'No. There is no APK to sideload and no store account required. On Android, Chrome installs the app directly from this page in one tap. On iPhone, Safari adds it to the home screen from the Share menu. On desktop, Chrome or Edge installs it like any other app.',
  },
  {
    question: 'Does the installed app work offline?',
    answer:
      'Yes for navigation and the app shell. After your first visit, the interface and previously used pages load without a network connection. Heavy media engines such as FFmpeg are fetched once on demand, and WhatsApp or Instagram still need internet access to share results.',
  },
  {
    question: 'Will my files be uploaded when I use the installed app?',
    answer:
      'No. Every tool keeps the same zero-upload architecture: videos, audio, images and chat exports are processed in your browser with Canvas, WebAssembly and local workers. Installing the app does not add tracking, accounts or server storage.',
  },
  {
    question: 'How do I uninstall WaKit later?',
    answer:
      'Uninstall it like any other app: long-press the home-screen icon on Android and choose Remove, or long-press and Delete Bookmark on iPhone. On desktop, click the app menu in Chrome or Edge and choose Uninstall WaKit. Your device files are untouched.',
  },
];

const installSteps = [
  {
    key: 'android' as const,
    icon: Smartphone,
    title: 'Android',
    subtitle: 'Chrome, Edge or Samsung Internet',
    steps: [
      'Open this page in Chrome on your Android phone.',
      'Tap the ⋮ menu and choose “Install app” or “Add to Home screen”.',
      'Confirm — WaKit opens full-screen with its own icon.',
    ],
    note: 'If the menu entry is missing, open the browser’s Share menu and pick “Add to Home screen”.',
  },
  {
    key: 'ios' as const,
    icon: Share,
    title: 'iPhone & iPad',
    subtitle: 'Safari only (iOS requirement)',
    steps: [
      'Open this page in Safari — not Chrome or an in-app browser.',
      'Tap the Share button in the toolbar.',
      'Scroll down, choose “Add to Home Screen”, then tap Add.',
    ],
    note: 'iOS does not allow one-tap install prompts, so the Share menu is the official route.',
  },
  {
    key: 'desktop' as const,
    icon: Monitor,
    title: 'Desktop',
    subtitle: 'Chrome, Edge or Brave',
    steps: [
      'Open WaKit in Chrome, Edge or Brave.',
      'Click the install icon in the address bar — or use the button above.',
      'Launch WaKit from your desktop, Start menu or taskbar.',
    ],
    note: 'Firefox and Safari on macOS do not support desktop PWA install; the website works normally there.',
  },
];

const benefits = [
  {
    icon: Gauge,
    title: 'Opens like an app',
    text: 'Own home-screen icon, no address bar, full-screen canvas on every tool page.',
  },
  {
    icon: CloudOff,
    title: 'Offline app shell',
    text: 'The interface is cached after the first visit, so it opens instantly on patchy mobile data.',
  },
  {
    icon: Lock,
    title: 'Still zero uploads',
    text: 'Installing adds no account and no tracking. Media is processed locally, exactly as before.',
  },
  {
    icon: Zap,
    title: 'Shortcuts built in',
    text: 'Long-press the icon on Android to jump straight to Status Splitter, Direct Chat, QR or Studio.',
  },
];

const appHowToSteps = [
  {
    name: 'Open the install page',
    text: 'Visit wakit.progeni.live/app on the phone where you want the app.',
  },
  {
    name: 'Install from the browser',
    text: 'Android Chrome: tap Install app. iPhone Safari: Share, then Add to Home Screen.',
  },
  {
    name: 'Launch WaKit from the home screen',
    text: 'Open the new icon to use all 16 tools full-screen with zero uploads.',
  },
];

export const AppDownloadPage: React.FC = () => {
  const { canInstall, isInstalled, isBusy, platform, promptInstall } = useInstallPrompt();

  const platformLabel =
    platform === 'ios' ? 'iPhone / iPad' : platform === 'android' ? 'Android phone' : 'this device';

  const installCta = isInstalled ? (
    <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-left">
      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
      <div>
        <p className="text-sm font-extrabold text-emerald-900">WaKit is installed</p>
        <p className="text-[11px] font-medium text-emerald-700">
          Open it from your home screen or app list.
        </p>
      </div>
    </div>
  ) : canInstall ? (
    <button
      type="button"
      onClick={() => {
        void promptInstall();
      }}
      disabled={isBusy}
      className="btn-primary w-full px-5 py-3.5 text-sm"
    >
      <Download className="h-4 w-4" aria-hidden="true" />
      {isBusy ? 'Opening installer…' : `Install on ${platformLabel}`}
    </button>
  ) : (
    <a href="#install-steps" className="btn-primary w-full px-5 py-3.5 text-sm">
      <Download className="h-4 w-4" aria-hidden="true" />
      Show install steps
    </a>
  );

  return (
    <div className="w-full space-y-8">
      <SEOHead
        title="Download WaKit App — Install on Android, iPhone & Desktop"
        description="Install the free WaKit app in seconds: one-tap install on Android Chrome, Add to Home Screen on iPhone Safari, or install on desktop. Same 16 private tools, zero uploads and an offline app shell."
        canonicalPath={APP_PATH}
        keywords="wakit app download, install wakit app, whatsapp tools app, add wakit to home screen, wakit pwa, private social media tools app"
        faqs={appFaqs}
        breadcrumbs={[{ name: 'Install app' }]}
        appCategory="UtilitiesApplication"
        howToName="How to install the WaKit app on your phone"
        howToSteps={appHowToSteps}
      />

      <Breadcrumbs items={[{ name: 'Install app' }]} />

      {/* Hero + live install console */}
      <section className="relative overflow-hidden rounded-[1.75rem] border border-emerald-900/20 bg-[linear-gradient(120deg,#022c22_0%,#064e3b_52%,#0f766e_100%)] px-5 py-7 text-white shadow-[0_28px_70px_-40px_rgba(2,44,34,0.85)] sm:px-8 sm:py-10">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 -top-24 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-teal-300/15 blur-3xl" />
        </div>

        <div className="relative grid gap-6 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:items-center md:gap-10">
          <div className="text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-amber-300">
              <Smartphone className="h-3.5 w-3.5" aria-hidden="true" />
              Installable web app · 0 MB extra data plan
            </span>

            <h1 className="mt-3 text-[1.9rem] font-extrabold leading-[1.08] tracking-[-0.035em] sm:text-4xl">
              Keep WaKit one tap away.
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-[13.5px] leading-relaxed text-emerald-100/85 sm:text-[15px] md:mx-0">
              Download the WaKit app straight from your browser — no Play Store account, no APK
              sideload, no signup. You get the same 16 private tools, a real home-screen icon and
              a cached app shell that opens even when the signal drops.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 md:justify-start">
              {[
                { icon: ShieldCheck, label: '0 uploads' },
                { icon: BadgeCheck, label: 'No store fees' },
                { icon: Sparkles, label: 'All 16 tools' },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10.5px] font-bold text-emerald-50"
                >
                  <Icon className="h-3.5 w-3.5 text-emerald-300" aria-hidden="true" />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Install console */}
          <div className="rounded-2xl border border-white/20 bg-white p-4 text-slate-900 shadow-2xl shadow-emerald-950/30 sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-700">
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                Install on this device
              </p>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9.5px] font-bold text-slate-600">
                Free
              </span>
            </div>

            <p className="mt-2 text-[12px] leading-relaxed text-slate-600">
              {platform === 'ios'
                ? 'On iPhone and iPad, installation runs through Safari’s Share menu.'
                : platform === 'android'
                  ? 'On Android, Chrome can install WaKit in a single tap.'
                  : 'On desktop, Chrome and Edge install WaKit from the address bar.'}
            </p>

            <div className="mt-3">{installCta}</div>

            <div className="mt-4 flex items-center gap-3 border-t border-slate-200 pt-4">
              <div className="shrink-0 rounded-xl border border-slate-200 bg-white p-1.5">
                <QRCodeCanvas
                  value={APP_URL}
                  size={84}
                  level="M"
                  includeMargin={false}
                  fgColor="#064e3b"
                  bgColor="#ffffff"
                  aria-label={`QR code for ${APP_URL}`}
                />
              </div>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-[11px] font-extrabold text-slate-900">
                  <QrCode className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                  Open on your phone
                </p>
                <p className="mt-0.5 break-words text-[10.5px] leading-relaxed text-slate-500">
                  Scan this code with your camera, then install from the browser.
                </p>
                <p className="mt-1 truncate text-[10px] font-semibold text-emerald-700">
                  {APP_URL.replace(/^https?:\/\//, '')}
                </p>
              </div>
            </div>

            <p className="mt-3 flex items-start gap-1.5 rounded-lg bg-slate-50 px-2.5 py-2 text-[10px] leading-relaxed text-slate-500">
              <Info className="mt-0.5 h-3 w-3 shrink-0 text-slate-400" aria-hidden="true" />
              No APK file, no store review, no account. The browser installs directly from
              wakit.progeni.live.
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section id="install-steps" aria-labelledby="install-steps-heading" className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="install-steps-heading"
              className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl"
            >
              Install in three steps
            </h2>
            <p className="mt-1 text-xs text-slate-600 sm:text-sm">
              Pick your device. The highlighted card matches this browser.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Safe browser install
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {installSteps.map(({ key, icon: Icon, title, subtitle, steps, note }) => {
            const isCurrent = platform === key;
            return (
              <article
                key={key}
                className={`relative flex h-full flex-col rounded-2xl border p-5 transition-shadow ${
                  isCurrent
                    ? 'border-emerald-300 bg-emerald-50/50 shadow-[0_18px_40px_-30px_rgba(5,150,105,0.6)]'
                    : 'border-slate-200 bg-white'
                }`}
              >
                {isCurrent && (
                  <span className="absolute right-4 top-4 rounded-full bg-emerald-700 px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wide text-white">
                    Your device
                  </span>
                )}

                <span
                  className={`grid h-11 w-11 place-items-center rounded-xl ring-1 ${
                    isCurrent
                      ? 'bg-white text-emerald-600 ring-emerald-200'
                      : 'bg-slate-50 text-slate-500 ring-slate-200'
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>

                <h3 className="mt-3 text-base font-extrabold text-slate-900">{title}</h3>
                <p className="text-[11px] font-semibold text-slate-500">{subtitle}</p>

                <ol className="mt-4 space-y-2.5">
                  {steps.map((step, index) => (
                    <li key={step} className="flex gap-2.5">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-700 text-[10px] font-extrabold text-white">
                        {index + 1}
                      </span>
                      <span className="text-[12px] leading-relaxed text-slate-600">{step}</span>
                    </li>
                  ))}
                </ol>

                <p className="mt-4 flex items-start gap-1.5 rounded-lg bg-white/70 px-2.5 py-2 text-[10px] leading-relaxed text-slate-500 ring-1 ring-slate-200/70">
                  <Info className="mt-0.5 h-3 w-3 shrink-0 text-slate-400" aria-hidden="true" />
                  {note}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Benefits */}
      <section
        aria-labelledby="app-benefits-heading"
        className="rounded-[1.5rem] border border-slate-200 bg-white p-5 sm:p-8"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="app-benefits-heading"
              className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl"
            >
              What changes when you install
            </h2>
            <p className="mt-1 text-xs text-slate-600 sm:text-sm">
              Faster access and a full-screen canvas — the privacy model stays identical.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-bold text-emerald-200">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
            16 tools included
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {benefits.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-emerald-600 ring-1 ring-emerald-200">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{title}</h3>
                <p className="mt-0.5 text-[11.5px] leading-relaxed text-slate-600">{text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11.5px] leading-relaxed text-emerald-900">
            <strong className="font-extrabold">Unchanged:</strong> no account, no uploads, no
            watermark and no export limits. Your media still never leaves the device.
          </p>
          <Link
            to="/"
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-2 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200 transition-colors hover:bg-emerald-100"
          >
            Browse the tools
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <FAQAccordion items={appFaqs} title="App install questions" />

      <AdBanner type="leaderboard" />
    </div>
  );
};
