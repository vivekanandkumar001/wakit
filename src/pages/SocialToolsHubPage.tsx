import React from 'react';
import { ArrowRight, Lock, MonitorSmartphone, Sparkles, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ClientToolPage } from '../components/ClientToolPage';
import type { FAQItem, HowToStep } from '../components/SEOHead';
import { socialToolGroups } from '../data/socialTools';
import { PlatformMark, type PlatformKey } from '../components/BrandIcons';

const groupPlatform: Record<string, PlatformKey> = {
  WhatsApp: 'whatsapp',
  Instagram: 'instagram',
  Facebook: 'facebook',
  'Cross-platform': 'multi',
};

const faqs: FAQItem[] = [
  {
    question: 'What is the WaKit Creator Studio?',
    answer:
      'It is a collection of 12 browser-only tools for WhatsApp, Instagram, Facebook and cross-platform campaigns. You can make stickers, analyse chats, build catalogs, compress media, plan feeds, split carousels, format captions, design covers and mockups, prepare Marketplace listings, resize image batches and create UTM QR links.',
  },
  {
    question: 'Are the Creator Studio tools free?',
    answer:
      'Yes. Every tool is free to use without an account, watermark, export credit or subscription. The site is supported by advertising, and there is no paid file-size unlock.',
  },
  {
    question: 'Do I need to upload my photos or chats?',
    answer:
      'No. Files are read with the browser File API and processed with local Canvas, JavaScript or WebAssembly. There is no upload endpoint for your media, chat export, caption or campaign link. The only network request some video tools make is downloading the open-source FFmpeg engine.',
  },
  {
    question: 'Can these tools post to Instagram or Facebook automatically?',
    answer:
      'No. WaKit prepares files and copy for you to review. It does not ask for social account passwords, cookies or access tokens and does not use unofficial automation. Publishing, scheduling and advertising stay inside the official platform apps.',
  },
  {
    question: 'Do the tools work on a phone?',
    answer:
      'The interface is responsive and most tools work in modern mobile browsers. Large video compression is best on desktop because it uses more memory. You can also use your browser’s Add to Home Screen option for quicker access.',
  },
];

const steps: [HowToStep, HowToStep, HowToStep] = [
  {
    name: 'Choose a workflow',
    text: 'Pick the WhatsApp, Instagram, Facebook or cross-platform group below and open the specific tool you need.',
  },
  {
    name: 'Work locally',
    text: 'Add files or type your content. The preview, analysis, canvas or compression runs inside this browser tab.',
  },
  {
    name: 'Download and review',
    text: 'Export the image, PDF, ZIP or text file, then review it before publishing through the official platform.',
  },
];

const benefits = [
  {
    icon: Lock,
    title: 'No media uploads',
    text: 'Photos, chats, videos and documents stay on your device. There is no file storage or account behind these tools.',
  },
  {
    icon: Zap,
    title: 'No signup or watermark',
    text: 'Open a tool and use it. Exports are not locked behind an email form or a paid upgrade.',
  },
  {
    icon: MonitorSmartphone,
    title: 'Made for real workflows',
    text: 'Batch outputs, safe-zone guides, exact platform dimensions and copy-ready text instead of decorative mockups.',
  },
];

export const SocialToolsHubPage: React.FC = () => {
  return (
    <ClientToolPage
      seo={{
        title: 'Free Social Media Tools — 12 Browser-Only Creators | WaKit',
        description:
          'Explore 12 free social media tools for WhatsApp, Instagram and Facebook: stickers, chat analysis, catalogs, compression, grids, carousels, captions, covers, ad mockups, Marketplace listings, batch resizing and UTM QR links.',
        canonicalPath: '/social-tools',
        keywords:
          'free social media tools, whatsapp creator tools, instagram tools, facebook tools, browser only social media toolkit, private content creator tools',
      }}
      icon={Sparkles}
      eyebrow="12 tools • 4 workflows • zero uploads"
      title={
        <>
          The <span className="text-gradient-emerald">Creator Studio</span>
        </>
      }
      description="A practical toolkit for the posts, covers, listings and campaigns you make every week — all running locally in your browser."
      breadcrumbs={[{ name: 'Creator Studio' }]}
      toolName="WaKit Creator Studio"
      currentPath="/social-tools"
      quickAnswer={{
        question: 'What can I create with WaKit Creator Studio?',
        answer:
          'You can make WhatsApp sticker packs, analyse exported chats, build catalog PDFs, compress chat media, plan Instagram grids, split carousels, format captions, design Reels covers, create Facebook covers and ad mockups, prepare Marketplace listings, resize image batches and build UTM links with QR codes.',
        facts: [
          { label: 'Tools', value: '12' },
          { label: 'Workflows', value: '4' },
          { label: 'Uploads', value: '0' },
          { label: 'Price', value: 'Free' },
        ],
      }}
      steps={steps}
      intro="Creator Studio is intentionally not a generic image editor. Each page solves one repeated social-media task with the right export size, a real preview and an honest explanation of what happens on your device."
      faqs={faqs}
      securityHeading="Private by architecture, not by a promise checkbox"
      securityText="There is no server-side media pipeline for these tools. Images are decoded in the browser, PDFs and ZIPs are assembled locally, and generated files are downloaded from temporary object URLs. WaKit does not need your social passwords, chat backups or ad accounts."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {benefits.map((benefit) => (
          <div key={benefit.title} className="glass-card p-5">
            <benefit.icon className="h-5 w-5 text-emerald-600" aria-hidden="true" />
            <h2 className="mt-3 text-sm font-bold text-slate-900">{benefit.title}</h2>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{benefit.text}</p>
          </div>
        ))}
      </div>

      <div className="space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">All 12 tools</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Pick the workflow you need
            </h2>
          </div>
          <p className="max-w-md text-xs leading-relaxed text-slate-600">
            WhatsApp essentials, Instagram planning, Facebook publishing and one cross-platform batch tool.
          </p>
        </div>

        {socialToolGroups.map((group) => (
          <section key={group.name} className="glass-card overflow-hidden">
            <div className="flex flex-col gap-1 border-b border-slate-200 bg-slate-50/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2.5">
                <PlatformMark platform={groupPlatform[group.name] ?? 'multi'} className="h-7 w-7" />
                <div>
                  <h3 className="text-base font-black text-slate-900">{group.name}</h3>
                  <p className="mt-0.5 text-xs text-slate-600">{group.description}</p>
                </div>
              </div>
              <span className="w-fit rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 ring-1 ring-slate-200">
                {group.tools.length} {group.tools.length === 1 ? 'tool' : 'tools'}
              </span>
            </div>
            <div className="grid gap-px bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">
              {group.tools.map((tool) => (
                <Link
                  key={tool.to}
                  to={tool.to}
                  className="group flex min-h-32 flex-col justify-between gap-4 bg-white p-4 transition-colors hover:bg-emerald-50/60"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                      <tool.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-600">
                      {tool.badge}
                    </span>
                  </div>
                  <div>
                    <h4 className="flex items-center justify-between gap-2 text-sm font-bold text-slate-900">
                      {tool.label}
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-emerald-600" aria-hidden="true" />
                    </h4>
                    <p className="mt-1 text-[11px] leading-relaxed text-slate-600">{tool.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:p-6">
        <h2 className="text-lg font-black text-emerald-950">Start with the task, not the template</h2>
        <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-emerald-900">
          For a quick WhatsApp job, open the Sticker Maker or Media Compressor. For a planned campaign, start with the Grid Planner or UTM Builder.
          Every export is a normal file you can review, send to a client or upload through an official platform.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/whatsapp-media-compressor" className="btn-primary px-4 py-2.5 text-xs">
            Compress chat media <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
          <Link to="/social-batch-resizer" className="btn-secondary px-4 py-2.5 text-xs">
            Batch resize images
          </Link>
        </div>
      </div>
    </ClientToolPage>
  );
};
