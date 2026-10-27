import React, { useEffect, useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { CalendarDays, Download, ImagePlus, Loader2, Package, Square, Trash2 } from 'lucide-react';
import { ClientToolPage } from '../components/ClientToolPage';
import { UploadZone } from '../components/UploadZone';
import type { FAQItem, HowToStep } from '../components/SEOHead';
import {
  canvasToBlob,
  downloadBlob,
  drawImageCover,
  drawTextLines,
  loadImage,
  normalizeUrl,
  safeFileName,
  wrapCanvasText,
  zipAndDownload,
} from '../lib/clientFiles';

type FormatId = 'page' | 'group' | 'event';

const formats: Record<FormatId, { label: string; width: number; height: number; hint: string }> = {
  page: { label: 'Facebook Page cover', width: 820, height: 312, hint: 'Classic 820 × 312 px page cover' },
  group: { label: 'Facebook Group cover', width: 1640, height: 856, hint: 'High-resolution 1640 × 856 px group cover' },
  event: { label: 'Facebook Event cover', width: 1920, height: 1005, hint: '1920 × 1005 px event banner' },
};

const faqs: FAQItem[] = [
  {
    question: 'What is the correct Facebook cover photo size?',
    answer:
      'A Facebook Page cover is commonly exported at 820 × 312 px, while a Group cover can use 1640 × 856 px for sharper displays. Facebook may crop differently across desktop and mobile, so keep important text near the center.',
  },
  {
    question: 'How do I create a Facebook event cover with a QR code?',
    answer:
      'Choose the Event format, add the event title, date, venue and URL, then upload a background image. WaKit draws the banner and can include a QR code plus a details text file in the downloadable event kit ZIP.',
  },
  {
    question: 'Can I use the kit to invite people on WhatsApp?',
    answer:
      'Yes. Download the event poster and QR as a ZIP, then share the poster or print the QR on an invitation. The QR opens the event URL you provide. WaKit does not send invitations or post to Facebook.',
  },
  {
    question: 'Are my event details and photos uploaded?',
    answer:
      'No. The image, title, date, venue and URL are used only in your browser. Canvas creates the poster, qrcode.react renders the QR, and JSZip packages the files locally.',
  },
  {
    question: 'Why does my cover text look blurry?',
    answer:
      'Check that your source photo is at least as wide as the selected export format. WaKit scales the image with high-quality smoothing, but a small source cannot create more detail. Keep the title short and use the high-resolution Group or Event format for print.',
  },
];

const steps: [HowToStep, HowToStep, HowToStep] = [
  {
    name: 'Pick a format',
    text: 'Choose a Page cover, Group cover or Event banner. The canvas changes to the correct Facebook dimensions.',
  },
  {
    name: 'Add the event details',
    text: 'Upload a background photo and add the title, date, venue, handle and optional event URL for the QR code.',
  },
  {
    name: 'Download the kit',
    text: 'Export the poster as PNG, or download a ZIP with the poster, event details and a scannable QR invite.',
  },
];

export const FacebookCoverEventKitPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const qrRef = useRef<HTMLDivElement>(null);
  const [formatId, setFormatId] = useState<FormatId>('page');
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [title, setTitle] = useState('Your page, in one clear frame');
  const [subtitle, setSubtitle] = useState('A cover that tells people what you do.');
  const [date, setDate] = useState('Saturday, 12 December · 6 PM');
  const [venue, setVenue] = useState('Your city · venue name');
  const [handle, setHandle] = useState('@yourpage');
  const [eventUrl, setEventUrl] = useState('');
  const [accent, setAccent] = useState('#34d399');
  const [loadingImage, setLoadingImage] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const format = formats[formatId];
  const safeEventUrl = normalizeUrl(eventUrl);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = format.width;
    const height = format.height;
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);

    if (image) {
      drawImageCover(ctx, image, width, height, image.naturalWidth, image.naturalHeight);
    } else {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#062e26');
      gradient.addColorStop(0.55, '#0f766e');
      gradient.addColorStop(1, '#020617');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = 0.16;
      ctx.fillStyle = '#ffffff';
      const step = Math.max(70, Math.round(width / 12));
      for (let x = -height; x < width; x += step) {
        ctx.save();
        ctx.translate(x, 0);
        ctx.rotate(-0.42);
        ctx.fillRect(0, 0, Math.round(step * 0.26), height * 1.6);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    }

    const overlay = ctx.createLinearGradient(0, 0, 0, height);
    overlay.addColorStop(0, 'rgba(2,6,23,0.15)');
    overlay.addColorStop(0.45, 'rgba(2,6,23,0.25)');
    overlay.addColorStop(1, 'rgba(2,6,23,0.92)');
    ctx.fillStyle = overlay;
    ctx.fillRect(0, 0, width, height);

    const margin = Math.round(width * 0.055);
    const titleSize = Math.max(28, Math.min(96, Math.round(width * 0.061)));
    const subtitleSize = Math.max(16, Math.round(titleSize * 0.36));
    ctx.font = `800 ${titleSize}px 'Plus Jakarta Sans', Inter, sans-serif`;
    const titleLines = wrapCanvasText(ctx, title.trim() || 'Your event title', width - margin * 2 - 120).slice(0, 3);
    const titleHeight = titleLines.length * titleSize * 1.08;

    let y = height - margin - titleHeight - (formatId === 'page' ? 48 : 76);
    ctx.fillStyle = accent;
    ctx.fillRect(margin, y - Math.round(titleSize * 0.5), Math.round(titleSize * 1.2), 7);
    y += 2;
    ctx.fillStyle = '#ffffff';
    ctx.font = `800 ${titleSize}px 'Plus Jakarta Sans', Inter, sans-serif`;
    y = drawTextLines(ctx, titleLines, margin, y + titleSize, titleSize * 1.08, 'left');

    ctx.font = `500 ${subtitleSize}px 'Plus Jakarta Sans', Inter, sans-serif`;
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(subtitle.trim().slice(0, 110), margin, y + subtitleSize + 8);
    y += subtitleSize + 20;

    const detailSize = Math.max(12, Math.round(subtitleSize * 0.8));
    ctx.font = `600 ${detailSize}px 'Plus Jakarta Sans', Inter, sans-serif`;
    ctx.fillStyle = accent;
    const detail = [date, venue].filter(Boolean).join('  ·  ');
    if (detail) ctx.fillText(detail.slice(0, 130), margin, y + detailSize + 8);

    ctx.font = `700 ${Math.max(12, Math.round(detailSize * 0.9))}px 'Plus Jakarta Sans', Inter, sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'right';
    ctx.fillText(handle.trim().slice(0, 46), width - margin, margin + 18);
    ctx.textAlign = 'left';
  }, [format, formatId, image, title, subtitle, date, venue, handle, accent]);

  const handleFile = async (files: File[]) => {
    const next = files[0];
    if (!next) return;
    setLoadingImage(true);
    setError(null);
    try {
      const loaded = await loadImage(next);
      setImage(loaded);
      setImageName(next.name);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not read the image.');
    } finally {
      setLoadingImage(false);
    }
  };

  const makePosterBlob = async (): Promise<Blob> => {
    const canvas = canvasRef.current;
    if (!canvas) throw new Error('The cover preview is not ready.');
    return canvasToBlob(canvas, 'image/png');
  };

  const downloadPoster = async () => {
    setBusy(true);
    setError(null);
    try {
      const blob = await makePosterBlob();
      downloadBlob(blob, `${safeFileName(title, 'facebook-cover')}-${formatId}.png`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not export the cover.');
    } finally {
      setBusy(false);
    }
  };

  const downloadKit = async () => {
    setBusy(true);
    setError(null);
    try {
      const poster = await makePosterBlob();
      const detailText = [
        title,
        subtitle,
        '',
        `Date: ${date}`,
        `Venue: ${venue}`,
        `Page: ${handle}`,
        safeEventUrl ? `Event URL: ${safeEventUrl}` : 'Event URL: not set',
        '',
        'Created locally with WaKit. No files were uploaded.',
      ].join('\n');
      const files = [
        { name: `${safeFileName(title, 'facebook-event')}-poster.png`, blob: poster },
        { name: 'event-details.txt', blob: new Blob([detailText], { type: 'text/plain;charset=utf-8' }) },
      ];

      const qrCanvas = qrRef.current?.querySelector('canvas');
      if (safeEventUrl && qrCanvas) {
        const qrBlob = await canvasToBlob(qrCanvas, 'image/png');
        files.push({ name: 'event-qr.png', blob: qrBlob });
      }

      await zipAndDownload(files, `${safeFileName(title, 'facebook-event')}-kit.zip`, 'facebook event kit');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not create the event kit.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ClientToolPage
      seo={{
        title: 'Facebook Cover & Event Kit Maker with QR | WaKit',
        description:
          'Create a Facebook Page cover, Group cover or Event banner, then download a PNG or event kit with details and a QR invite. No uploads.',
        canonicalPath: '/facebook-cover-event-kit',
        keywords:
          'facebook cover maker, facebook event cover, facebook group cover, event banner maker, facebook cover with qr code',
      }}
      icon={Square}
      eyebrow="Page · Group · Event • kit ZIP"
      title={
        <>
          Facebook <span className="text-gradient-emerald">cover &amp; event kit</span>
        </>
      }
      description="Build a cover that works across Facebook surfaces, then download the poster, event details and a printable QR invite in one local kit."
      breadcrumbs={[{ name: 'Facebook Cover & Event Kit' }]}
      toolName="Facebook Cover & Event Kit"
      currentPath="/facebook-cover-event-kit"
      quickAnswer={{
        question: 'How can I make a Facebook cover and event invite for free?',
        answer:
          'Choose a Page, Group or Event format, upload a background and add the title, date, venue and URL. Download a PNG poster, or create a ZIP kit with the poster, event details and a QR code. Everything is generated in your browser.',
        facts: [
          { label: 'Formats', value: '3 sizes' },
          { label: 'Cover', value: '820×312' },
          { label: 'Kit', value: 'PNG + QR' },
          { label: 'Uploads', value: '0' },
        ],
      }}
      steps={steps}
      intro="A cover is not a poster. Keep the essential promise and one supporting detail visible, then let the photo carry the mood. The event kit adds a QR for invitations and a plain-text details sheet for sharing."
      faqs={faqs}
      securityHeading="No Facebook login or page permission required"
      securityText="WaKit does not connect to Facebook and cannot post, invite or access a page. Your image and event details are rendered locally with Canvas. The QR is generated in the page, and the kit is zipped on your device before download."
    >
      <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
        <section className="glass-card space-y-4 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Cover setup</h2>
              <p className="mt-1 text-xs text-slate-600">{format.hint}</p>
            </div>
            {image && (
              <button type="button" onClick={() => { setImage(null); setImageName(null); }} className="btn-secondary px-3 py-2 text-xs">
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                Remove
              </button>
            )}
          </div>

          <div>
            <span className="field-label">Format</span>
            <div className="grid gap-2 sm:grid-cols-3">
              {(Object.keys(formats) as FormatId[]).map((id) => (
                <button key={id} type="button" onClick={() => setFormatId(id)} className={`rounded-xl border px-2 py-2 text-[11px] font-bold capitalize ${formatId === id ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-600'}`}>
                  {id}
                </button>
              ))}
            </div>
          </div>

          <UploadZone
            accept="image/png,image/jpeg,image/webp"
            onFiles={handleFile}
            icon={ImagePlus}
            title="Add a background photo"
            hint={`${format.width} × ${format.height} px export · JPG, PNG or WebP`}
            files={[]}
            disabled={loadingImage}
          />
          {imageName && (
            <p className="truncate rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] font-semibold text-emerald-800">
              Background loaded: {imageName}
            </p>
          )}

          <div>
            <label htmlFor="fb-title" className="field-label">Title</label>
            <textarea id="fb-title" value={title} onChange={(event) => setTitle(event.target.value)} rows={2} maxLength={110} className="field resize-none" />
          </div>

          <div>
            <label htmlFor="fb-subtitle" className="field-label">Supporting line</label>
            <input id="fb-subtitle" value={subtitle} onChange={(event) => setSubtitle(event.target.value)} maxLength={110} className="field" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="fb-date" className="field-label">Date / time</label>
              <input id="fb-date" value={date} onChange={(event) => setDate(event.target.value)} maxLength={70} className="field" />
            </div>
            <div>
              <label htmlFor="fb-venue" className="field-label">Venue</label>
              <input id="fb-venue" value={venue} onChange={(event) => setVenue(event.target.value)} maxLength={70} className="field" />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="fb-handle" className="field-label">Page handle</label>
              <input id="fb-handle" value={handle} onChange={(event) => setHandle(event.target.value)} maxLength={46} className="field" />
            </div>
            <div>
              <label htmlFor="fb-accent" className="field-label">Accent</label>
              <div className="flex items-center gap-2">
                <input id="fb-accent" type="color" value={accent} onChange={(event) => setAccent(event.target.value)} className="h-11 w-14 cursor-pointer rounded-xl border border-slate-300 bg-white p-1" />
                <span className="font-mono text-xs text-slate-500">{accent}</span>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="fb-url" className="field-label">Event URL (for QR)</label>
            <input id="fb-url" value={eventUrl} onChange={(event) => setEventUrl(event.target.value)} className="field" placeholder="https://facebook.com/events/…" inputMode="url" />
            {eventUrl && !safeEventUrl && <p className="mt-1 text-[11px] font-semibold text-amber-700">Enter a complete http:// or https:// URL to generate a QR.</p>}
          </div>

          {loadingImage && <p className="flex items-center gap-2 text-xs font-semibold text-emerald-700"><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Reading image…</p>}
          {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">{error}</p>}

          <div className="grid gap-2 sm:grid-cols-2">
            <button type="button" onClick={downloadPoster} disabled={busy} className="btn-primary py-3">
              <Download className="h-4 w-4" aria-hidden="true" />
              Poster PNG
            </button>
            <button type="button" onClick={downloadKit} disabled={busy} className="btn-secondary py-3">
              <Package className="h-4 w-4" aria-hidden="true" />
              Event kit ZIP
            </button>
          </div>
          <p className="text-[10px] leading-relaxed text-slate-500">Kit includes the poster, event-details.txt and a QR PNG when a valid event URL is present.</p>
        </section>

        <section className="space-y-4">
          <div className="glass-card p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Cover preview</h2>
                <p className="mt-0.5 text-[11px] text-slate-500">{format.width} × {format.height} px · {format.label}</p>
              </div>
              <CalendarDays className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            </div>
            <div className="grid place-items-center overflow-hidden rounded-2xl bg-slate-950 p-2">
              <canvas ref={canvasRef} aria-label="Facebook cover preview" className="h-auto w-full rounded-xl" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="glass-card p-4">
              <h2 className="text-sm font-bold text-slate-900">Event QR</h2>
              <p className="mt-0.5 text-[11px] text-slate-500">Generated only after a valid URL.</p>
              <div ref={qrRef} className="mt-3 grid min-h-44 place-items-center rounded-xl border border-slate-200 bg-slate-50 p-3">
                {safeEventUrl ? (
                  <QRCodeCanvas value={safeEventUrl} size={150} fgColor="#065f46" bgColor="#ffffff" level="M" />
                ) : (
                  <p className="max-w-[12rem] text-center text-[11px] text-slate-500">Add an event URL to preview the QR.</p>
                )}
              </div>
            </div>
            <div className="glass-card p-4">
              <h2 className="text-sm font-bold text-slate-900">Kit contents</h2>
              <ul className="mt-3 space-y-2 text-[11px] leading-relaxed text-slate-600">
                <li className="flex items-center gap-2"><Package className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" /> Poster PNG</li>
                <li className="flex items-center gap-2"><FileTextIcon /> event-details.txt</li>
                <li className="flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" /> event-qr.png when URL is valid</li>
              </ul>
              <p className="mt-3 rounded-xl bg-emerald-50 p-2 text-[10px] leading-relaxed text-emerald-800">
                QR encodes: {safeEventUrl ? safeEventUrl.slice(0, 60) : 'not set'}
              </p>
            </div>
          </div>
        </section>
      </div>

      <p className="text-[10px] text-slate-500">
        Source image: {imageName || 'none selected'}. The exported cover uses the selected Facebook format.
      </p>
    </ClientToolPage>
  );
};

const FileTextIcon: React.FC = () => <span className="grid h-3.5 w-3.5 place-items-center rounded-sm border border-emerald-600 text-[7px] font-black text-emerald-700">T</span>;
