import React, { useEffect, useRef, useState } from 'react';
import { Download, ImagePlus, Loader2, Megaphone, MousePointerClick, Trash2 } from 'lucide-react';
import { ClientToolPage } from '../components/ClientToolPage';
import { UploadZone } from '../components/UploadZone';
import type { FAQItem, HowToStep } from '../components/SEOHead';
import {
  canvasToBlob,
  downloadBlob,
  drawImageCover,
  drawRoundedRect,
  drawTextLines,
  loadImage,
  normalizeUrl,
  safeFileName,
  wrapCanvasText,
} from '../lib/clientFiles';

type AdFormat = 'feed' | 'story' | 'marketplace';

const formats: Record<AdFormat, { label: string; width: number; height: number; hint: string }> = {
  feed: { label: 'Feed post', width: 1080, height: 1080, hint: 'Square 1080 × 1080 px' },
  story: { label: 'Story / Reels', width: 1080, height: 1920, hint: 'Vertical 1080 × 1920 px' },
  marketplace: { label: 'Marketplace', width: 1200, height: 628, hint: 'Landscape 1200 × 628 px' },
};

const faqs: FAQItem[] = [
  {
    question: 'How do I make a Facebook ad mockup for free?',
    answer:
      'Add a product photo, brand name, headline, primary text and call to action, then choose Feed, Story or Marketplace. WaKit draws a realistic preview on Canvas and lets you download the mockup as a PNG.',
  },
  {
    question: 'Can I publish this mockup directly as a Facebook ad?',
    answer:
      'No. This is a creative preview, not connected to Meta Ads Manager. Download the PNG and upload it in your own campaign if the placement and text layout fit your strategy. WaKit does not create campaigns or spend money.',
  },
  {
    question: 'Are Facebook ad mockups allowed to include text?',
    answer:
      'Yes, but text-heavy images can be less effective and may be compressed differently across placements. Keep the headline short, make the product obvious, and check the actual ad preview inside Meta Ads Manager before launching.',
  },
  {
    question: 'Does the mockup include my destination URL?',
    answer:
      'The preview can display a shortened destination label, but the exported image is static. Links in an image are not clickable. Add the real destination URL inside Meta Ads Manager when you create the campaign.',
  },
  {
    question: 'Are my product photos uploaded?',
    answer:
      'No. The photo is decoded and drawn locally on Canvas. WaKit does not send the image, ad copy or URL to a server.',
  },
];

const steps: [HowToStep, HowToStep, HowToStep] = [
  {
    name: 'Add the creative',
    text: 'Upload a product photo and enter the brand name, headline, primary text and call to action.',
  },
  {
    name: 'Choose a placement',
    text: 'Switch between square Feed, vertical Story and landscape Marketplace to see how the same ad adapts.',
  },
  {
    name: 'Download the mockup',
    text: 'Export the selected placement as a high-resolution PNG for a client review or creative presentation.',
  },
];

export const FacebookAdMockupPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [formatId, setFormatId] = useState<AdFormat>('feed');
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [brand, setBrand] = useState('Your Brand');
  const [headline, setHeadline] = useState('A product people actually want');
  const [primary, setPrimary] = useState('Made for everyday use. Free delivery this week.');
  const [cta, setCta] = useState('Shop now');
  const [destination, setDestination] = useState('yourstore.com');
  const [accent, setAccent] = useState('#047857');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const format = formats[formatId];
  const safeDestination = normalizeUrl(destination) ?? '';

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

    if (formatId === 'story') {
      if (image) {
        drawImageCover(ctx, image, width, height, image.naturalWidth, image.naturalHeight);
      } else {
        const bg = ctx.createLinearGradient(0, 0, width, height);
        bg.addColorStop(0, '#064e3b');
        bg.addColorStop(1, '#020617');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);
      }
      const shade = ctx.createLinearGradient(0, 0, 0, height);
      shade.addColorStop(0, 'rgba(2,6,23,0.28)');
      shade.addColorStop(0.5, 'rgba(2,6,23,0.18)');
      shade.addColorStop(1, 'rgba(2,6,23,0.94)');
      ctx.fillStyle = shade;
      ctx.fillRect(0, 0, width, height);

      const margin = 76;
      ctx.fillStyle = '#ffffff';
      ctx.font = "800 34px 'Plus Jakarta Sans', Inter, sans-serif";
      ctx.fillText(brand.slice(0, 32), margin, 110);
      ctx.fillStyle = accent;
      ctx.fillRect(margin, 128, 84, 6);

      ctx.fillStyle = '#ffffff';
      ctx.font = "800 86px 'Plus Jakarta Sans', Inter, sans-serif";
      const headlineLines = wrapCanvasText(ctx, headline, width - margin * 2).slice(0, 3);
      const headlineTop = height - 780;
      const afterHeadline = drawTextLines(ctx, headlineLines, margin, headlineTop, 94, 'left');
      ctx.font = "500 38px 'Plus Jakarta Sans', Inter, sans-serif";
      ctx.fillStyle = '#e2e8f0';
      drawTextLines(ctx, wrapCanvasText(ctx, primary, width - margin * 2).slice(0, 3), margin, afterHeadline + 16, 48, 'left');

      ctx.fillStyle = accent;
      drawRoundedRect(ctx, margin, height - 250, 330, 86, 43);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = "800 30px 'Plus Jakarta Sans', Inter, sans-serif";
      ctx.textAlign = 'center';
      ctx.fillText(cta.slice(0, 24), margin + 165, height - 196);
      ctx.textAlign = 'left';
      return;
    }

    if (formatId === 'marketplace') {
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#ffffff';
      drawRoundedRect(ctx, 30, 30, width - 60, height - 60, 28);
      ctx.fill();
      const imageWidth = Math.round(width * 0.5);
      ctx.save();
      drawRoundedRect(ctx, 30, 30, imageWidth, height - 60, 28);
      ctx.clip();
      if (image) drawImageCover(ctx, image, imageWidth, height - 60, image.naturalWidth, image.naturalHeight);
      else {
        const bg = ctx.createLinearGradient(0, 0, imageWidth, height);
        bg.addColorStop(0, '#0f766e');
        bg.addColorStop(1, '#020617');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, imageWidth, height);
      }
      ctx.restore();

      const x = imageWidth + 64;
      const maxWidth = width - x - 60;
      ctx.fillStyle = '#047857';
      ctx.font = "800 24px 'Plus Jakarta Sans', Inter, sans-serif";
      ctx.fillText(brand.slice(0, 30).toUpperCase(), x, 104);
      ctx.fillStyle = '#0f172a';
      ctx.font = "800 48px 'Plus Jakarta Sans', Inter, sans-serif";
      const lines = wrapCanvasText(ctx, headline, maxWidth).slice(0, 3);
      let y = drawTextLines(ctx, lines, x, 162, 56, 'left');
      ctx.fillStyle = '#64748b';
      ctx.font = "500 28px 'Plus Jakarta Sans', Inter, sans-serif";
      y = drawTextLines(ctx, wrapCanvasText(ctx, primary, maxWidth).slice(0, 3), x, y + 16, 36, 'left');
      ctx.fillStyle = accent;
      drawRoundedRect(ctx, x, Math.max(y + 26, height - 126), 250, 64, 32);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = "800 24px 'Plus Jakarta Sans', Inter, sans-serif";
      ctx.textAlign = 'center';
      ctx.fillText(cta.slice(0, 24), x + 125, height - 86);
      ctx.textAlign = 'left';
      return;
    }

    // Feed: a clean sponsored post card.
    ctx.fillStyle = '#eef2f7';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    drawRoundedRect(ctx, 54, 54, width - 108, height - 108, 34);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.font = "800 34px 'Plus Jakarta Sans', Inter, sans-serif";
    ctx.fillText(brand.slice(0, 32), 92, 124);
    ctx.fillStyle = '#64748b';
    ctx.font = "500 24px 'Plus Jakarta Sans', Inter, sans-serif";
    ctx.fillText('Sponsored · Suggested for you', 92, 160);

    const imageTop = 184;
    const imageHeight = Math.round((height - 108) * 0.56);
    ctx.save();
    ctx.beginPath();
    ctx.rect(54, imageTop, width - 108, imageHeight);
    ctx.clip();
    if (image) drawImageCover(ctx, image, width - 108, imageHeight, image.naturalWidth, image.naturalHeight);
    else {
      const bg = ctx.createLinearGradient(0, 0, width, imageHeight);
      bg.addColorStop(0, '#0f766e');
      bg.addColorStop(1, '#020617');
      ctx.fillStyle = bg;
      ctx.fillRect(54, imageTop, width - 108, imageHeight);
    }
    ctx.restore();

    const textX = 92;
    const textWidth = width - 184;
    let y = imageTop + imageHeight + 50;
    ctx.fillStyle = '#64748b';
    ctx.font = "600 25px 'Plus Jakarta Sans', Inter, sans-serif";
    ctx.fillText(primary.slice(0, 92), textX, y);
    y += 48;
    ctx.fillStyle = '#0f172a';
    ctx.font = "800 42px 'Plus Jakarta Sans', Inter, sans-serif";
    drawTextLines(ctx, wrapCanvasText(ctx, headline, textWidth).slice(0, 2), textX, y, 50, 'left');

    ctx.fillStyle = accent;
    drawRoundedRect(ctx, textX, height - 166, 300, 70, 35);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = "800 26px 'Plus Jakarta Sans', Inter, sans-serif";
    ctx.textAlign = 'center';
    ctx.fillText(cta.slice(0, 24), textX + 150, height - 122);
    ctx.textAlign = 'left';

    if (safeDestination) {
      ctx.fillStyle = '#64748b';
      ctx.font = "500 21px 'Plus Jakarta Sans', Inter, sans-serif";
      ctx.fillText(safeDestination.replace(/^https?:\/\//, '').slice(0, 40), textX + 330, height - 122);
    }
  }, [format, formatId, image, brand, headline, primary, cta, accent, safeDestination]);

  const handleFile = async (files: File[]) => {
    const next = files[0];
    if (!next) return;
    setLoading(true);
    setError(null);
    try {
      setImage(await loadImage(next));
      setImageName(next.name);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not read the image.');
    } finally {
      setLoading(false);
    }
  };

  const download = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const blob = await canvasToBlob(canvas, 'image/png');
      downloadBlob(blob, `${safeFileName(`${brand}-${formatId}-ad`, 'facebook-ad-mockup')}.png`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not export the mockup.');
    }
  };

  return (
    <ClientToolPage
      seo={{
        title: 'Facebook Ad Mockup Maker — Feed, Story & Marketplace | WaKit',
        description:
          'Create a realistic Facebook ad mockup for Feed, Story or Marketplace. Add a product photo, headline and CTA, then download a PNG locally.',
        canonicalPath: '/facebook-ad-mockup',
        keywords:
          'facebook ad mockup, facebook feed ad preview, instagram story ad mockup, marketplace ad mockup, free ad creative generator',
      }}
      icon={Megaphone}
      eyebrow="Feed · Story · Marketplace"
      title={
        <>
          Facebook <span className="text-gradient-emerald">ad mockup maker</span>
        </>
      }
      description="Turn a product photo and a short message into a presentation-ready ad mockup for the three placements clients ask about most."
      breadcrumbs={[{ name: 'Facebook Ad Mockup' }]}
      toolName="Facebook Ad Mockup"
      currentPath="/facebook-ad-mockup"
      quickAnswer={{
        question: 'How do I create a Facebook ad mockup online?',
        answer:
          'Add your product image, brand, headline, primary text and CTA, then choose Feed, Story or Marketplace. WaKit draws the mockup on a local Canvas and exports a PNG. It is a creative preview and does not launch or spend on ads.',
        facts: [
          { label: 'Placements', value: '3' },
          { label: 'Feed', value: '1080²' },
          { label: 'Story', value: '1080×1920' },
          { label: 'Uploads', value: '0' },
        ],
      }}
      steps={steps}
      intro="Use a real product photo and a specific headline. A mockup is for reviewing composition and message hierarchy; always confirm the final text and crop inside Meta Ads Manager."
      faqs={faqs}
      securityHeading="A local creative preview, not a Meta Ads integration"
      securityText="WaKit does not connect to Meta, request ad account access or create campaigns. The image and copy are rendered locally and downloaded from a temporary object URL. Your product photo and ad text are never uploaded."
    >
      <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
        <section className="glass-card space-y-4 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Ad creative</h2>
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
            <span className="field-label">Placement</span>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(formats) as AdFormat[]).map((id) => (
                <button key={id} type="button" onClick={() => setFormatId(id)} className={`rounded-xl border px-2 py-2 text-[11px] font-bold ${formatId === id ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-600'}`}>
                  {formats[id].label}
                </button>
              ))}
            </div>
          </div>

          <UploadZone
            accept="image/png,image/jpeg,image/webp"
            onFiles={handleFile}
            icon={ImagePlus}
            title="Add a product photo"
            hint="JPG, PNG or WebP · landscape or square works best"
            files={[]}
            disabled={loading}
          />
          {imageName && <p className="truncate rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] font-semibold text-emerald-800">Image loaded: {imageName}</p>}

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="ad-brand" className="field-label">Brand</label>
              <input id="ad-brand" value={brand} onChange={(event) => setBrand(event.target.value)} maxLength={32} className="field" />
            </div>
            <div>
              <label htmlFor="ad-cta" className="field-label">Call to action</label>
              <input id="ad-cta" value={cta} onChange={(event) => setCta(event.target.value)} maxLength={24} className="field" />
            </div>
          </div>

          <div>
            <label htmlFor="ad-headline" className="field-label">Headline</label>
            <input id="ad-headline" value={headline} onChange={(event) => setHeadline(event.target.value)} maxLength={80} className="field" />
          </div>

          <div>
            <label htmlFor="ad-primary" className="field-label">Primary text</label>
            <textarea id="ad-primary" value={primary} onChange={(event) => setPrimary(event.target.value)} rows={3} maxLength={180} className="field resize-none" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="ad-destination" className="field-label">Destination label</label>
              <input id="ad-destination" value={destination} onChange={(event) => setDestination(event.target.value)} maxLength={80} className="field" placeholder="yourstore.com" />
            </div>
            <div>
              <label htmlFor="ad-accent" className="field-label">CTA colour</label>
              <div className="flex items-center gap-2">
                <input id="ad-accent" type="color" value={accent} onChange={(event) => setAccent(event.target.value)} className="h-11 w-14 cursor-pointer rounded-xl border border-slate-300 bg-white p-1" />
                <span className="font-mono text-xs text-slate-500">{accent}</span>
              </div>
            </div>
          </div>

          {loading && <p className="flex items-center gap-2 text-xs font-semibold text-emerald-700"><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Reading image…</p>}
          {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">{error}</p>}

          <button type="button" onClick={download} className="btn-primary w-full py-3">
            <Download className="h-4 w-4" aria-hidden="true" />
            Download mockup PNG
          </button>
        </section>

        <section className="glass-card space-y-3 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Placement preview</h2>
              <p className="mt-0.5 text-[11px] text-slate-500">{format.width} × {format.height} px</p>
            </div>
            <MousePointerClick className="h-4 w-4 text-emerald-600" aria-hidden="true" />
          </div>
          <div className="grid place-items-center overflow-hidden rounded-2xl bg-slate-100 p-3">
            <canvas ref={canvasRef} aria-label="Facebook ad mockup preview" className={`h-auto w-full rounded-xl bg-white ${formatId === 'story' ? 'max-h-[38rem] max-w-[22rem]' : ''}`} />
          </div>
          <p className="text-center text-[10px] leading-relaxed text-slate-500">
            Mockups are static images. Links are not clickable and no ad will be published.
          </p>
        </section>
      </div>
    </ClientToolPage>
  );
};
