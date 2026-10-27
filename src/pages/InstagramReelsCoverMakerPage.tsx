import React, { useEffect, useRef, useState } from 'react';
import { Download, Film, ImagePlus, Loader2, Trash2 } from 'lucide-react';
import { ClientToolPage } from '../components/ClientToolPage';
import { UploadZone } from '../components/UploadZone';
import type { FAQItem, HowToStep } from '../components/SEOHead';
import {
  canvasToBlob,
  downloadBlob,
  drawImageCover,
  drawTextLines,
  loadImage,
  safeFileName,
  wrapCanvasText,
} from '../lib/clientFiles';

type Position = 'top' | 'center' | 'bottom';

const faqs: FAQItem[] = [
  {
    question: 'What size is an Instagram Reels cover?',
    answer:
      'Use 1080 × 1920 px, the same 9:16 canvas as a Reel. Keep the title inside the central safe area because the profile grid crops the cover to a square and the Reels player overlays icons at the edges.',
  },
  {
    question: 'Can I use a normal photo as a Reels cover?',
    answer:
      'Yes. Upload a portrait photo and WaKit will fill the 1080 × 1920 canvas, add a readable gradient and place your title on top. A high-resolution photo with space at the top or bottom works best.',
  },
  {
    question: 'Does this upload my photo or create an Instagram post?',
    answer:
      'No. The cover is drawn on a local Canvas in your browser. WaKit does not connect to Instagram, schedule posts or upload the photo. Download the PNG and add it to your Reel in the Instagram app.',
  },
  {
    question: 'Why is part of my cover cropped in the profile grid?',
    answer:
      'Instagram shows a square crop of a Reel cover in some profile views. Keep important text and faces away from the outer edges. The safe-zone guide in the editor shows the area that is less likely to be obscured.',
  },
  {
    question: 'Which font should I use?',
    answer:
      'WaKit uses your device’s installed sans-serif font so the output never waits for an external font download. Bold, short titles work best. You can adjust the title size slider to fit two or three lines.',
  },
];

const steps: [HowToStep, HowToStep, HowToStep] = [
  {
    name: 'Add a background',
    text: 'Upload a portrait photo or start with the dark gradient background. The editor uses a 1080 × 1920 canvas.',
  },
  {
    name: 'Write the cover text',
    text: 'Add a short title, subtitle and handle, then choose top, center or bottom placement and a readable text size.',
  },
  {
    name: 'Download the PNG',
    text: 'Toggle the safe-zone guide to check the crop, then download a high-resolution cover for the Instagram app.',
  },
];

export const InstagramReelsCoverMakerPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [title, setTitle] = useState('5 tips for better Reels');
  const [subtitle, setSubtitle] = useState('Save this for your next shoot');
  const [handle, setHandle] = useState('@yourhandle');
  const [position, setPosition] = useState<Position>('bottom');
  const [fontSize, setFontSize] = useState(74);
  const [accent, setAccent] = useState('#34d399');
  const [safeZones, setSafeZones] = useState(true);
  const [loadingImage, setLoadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = 1080;
    const height = 1920;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#071713';
    ctx.fillRect(0, 0, width, height);

    if (image) {
      drawImageCover(ctx, image, width, height, image.naturalWidth, image.naturalHeight);
    } else {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#052e24');
      gradient.addColorStop(0.55, '#0f766e');
      gradient.addColorStop(1, '#020617');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      for (let x = -height; x < width; x += 130) {
        ctx.save();
        ctx.translate(x, 0);
        ctx.rotate(-0.45);
        ctx.fillRect(0, 0, 42, height * 1.6);
        ctx.restore();
      }
    }

    const overlay = ctx.createLinearGradient(0, 0, 0, height);
    if (position === 'top') {
      overlay.addColorStop(0, 'rgba(2,6,23,0.82)');
      overlay.addColorStop(0.58, 'rgba(2,6,23,0.25)');
      overlay.addColorStop(1, 'rgba(2,6,23,0.15)');
    } else if (position === 'center') {
      overlay.addColorStop(0, 'rgba(2,6,23,0.55)');
      overlay.addColorStop(0.45, 'rgba(2,6,23,0.72)');
      overlay.addColorStop(1, 'rgba(2,6,23,0.55)');
    } else {
      overlay.addColorStop(0, 'rgba(2,6,23,0.10)');
      overlay.addColorStop(0.45, 'rgba(2,6,23,0.30)');
      overlay.addColorStop(1, 'rgba(2,6,23,0.94)');
    }
    ctx.fillStyle = overlay;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.font = `800 ${fontSize}px 'Plus Jakarta Sans', Inter, sans-serif`;
    const titleLines = wrapCanvasText(ctx, title.trim() || 'Your Reel title', 880).slice(0, 4);
    ctx.font = "500 38px 'Plus Jakarta Sans', Inter, sans-serif";
    const subtitleLines = wrapCanvasText(ctx, subtitle.trim(), 850).slice(0, 3);
    ctx.font = "700 30px 'Plus Jakarta Sans', Inter, sans-serif";
    const handleLine = handle.trim();

    const titleHeight = titleLines.length * (fontSize * 1.08);
    const totalHeight = titleHeight + subtitleLines.length * 50 + (handleLine ? 58 : 0);
    let y = position === 'top' ? 250 : position === 'center' ? (height - totalHeight) / 2 : height - totalHeight - 420;

    ctx.fillStyle = accent;
    ctx.fillRect(82, y - 34, 92, 8);
    y += 20;

    ctx.fillStyle = '#ffffff';
    ctx.font = `800 ${fontSize}px 'Plus Jakarta Sans', Inter, sans-serif`;
    y = drawTextLines(ctx, titleLines, 82, y + fontSize, fontSize * 1.08, 'left');

    ctx.fillStyle = '#e2e8f0';
    ctx.font = "500 38px 'Plus Jakarta Sans', Inter, sans-serif";
    y += 12;
    y = drawTextLines(ctx, subtitleLines, 82, y + 38, 50, 'left');

    if (handleLine) {
      ctx.fillStyle = accent;
      ctx.font = "700 30px 'Plus Jakarta Sans', Inter, sans-serif";
      ctx.fillText(handleLine.slice(0, 48), 82, y + 44);
    }
    ctx.restore();

    if (safeZones) {
      ctx.save();
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.9)';
      ctx.lineWidth = 3;
      ctx.setLineDash([16, 12]);
      ctx.strokeRect(64, 150, width - 128, height - 500);
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(2,6,23,0.72)';
      ctx.fillRect(64, 150, 220, 44);
      ctx.fillStyle = '#a7f3d0';
      ctx.font = "700 22px 'Plus Jakarta Sans', Inter, sans-serif";
      ctx.fillText('REELS SAFE AREA', 82, 180);
      ctx.restore();
    }
  }, [image, title, subtitle, handle, position, fontSize, accent, safeZones]);

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

  const download = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const blob = await canvasToBlob(canvas, 'image/png');
      downloadBlob(blob, `${safeFileName(title || imageName || 'instagram-reel-cover', 'instagram-reel-cover')}.png`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not export the cover.');
    }
  };

  return (
    <ClientToolPage
      seo={{
        title: 'Instagram Reels Cover Maker — 1080×1920 Editor | WaKit',
        description:
          'Design a 1080×1920 Instagram Reels cover with a photo, title, subtitle and safe-zone guide. Download a PNG locally — no upload or login.',
        canonicalPath: '/instagram-reels-cover-maker',
        keywords:
          'instagram reels cover maker, reels cover size, 1080x1920 cover maker, instagram reels thumbnail, reels cover template',
      }}
      icon={Film}
      eyebrow="1080×1920 • safe-zone guide"
      title={
        <>
          Instagram <span className="text-gradient-emerald">Reels cover maker</span>
        </>
      }
      description="Create a readable cover that survives the profile-grid crop, with your title, accent colour and handle baked into a high-resolution PNG."
      breadcrumbs={[{ name: 'Reels Cover Maker' }]}
      toolName="Instagram Reels Cover Maker"
      currentPath="/instagram-reels-cover-maker"
      quickAnswer={{
        question: 'How do I make a cover for an Instagram Reel?',
        answer:
          'Upload a portrait image, add a short title and subtitle, choose a text position, then download the 1080×1920 PNG. WaKit draws the cover locally on Canvas and never uploads the image or connects to Instagram.',
        facts: [
          { label: 'Canvas', value: '1080×1920' },
          { label: 'Export', value: 'PNG' },
          { label: 'Safe zones', value: 'Included' },
          { label: 'Uploads', value: '0' },
        ],
      }}
      steps={steps}
      intro="Reels covers are seen in three places: the full-screen player, the profile grid crop and the Explore tab. A short, high-contrast title is more important than fitting every detail."
      faqs={faqs}
      securityHeading="A local cover editor with no Instagram account access"
      securityText="Your background photo and text are drawn on a local Canvas. WaKit does not request Instagram credentials, access tokens or cookies, and there is no upload endpoint. The downloaded PNG is generated from your own device’s canvas."
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="glass-card space-y-5 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Cover content</h2>
              <p className="mt-1 text-xs text-slate-600">Keep the title short enough to read on a phone.</p>
            </div>
            {image && (
              <button type="button" onClick={() => { setImage(null); setImageName(null); }} className="btn-secondary px-3 py-2 text-xs">
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                Remove photo
              </button>
            )}
          </div>

          <UploadZone
            accept="image/png,image/jpeg,image/webp"
            onFiles={handleFile}
            icon={ImagePlus}
            title="Add a portrait background"
            hint="JPG, PNG or WebP · 1080×1920 works best"
            files={[]}
            disabled={loadingImage}
          />

          {imageName && (
            <p className="truncate rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] font-semibold text-emerald-800">
              Background loaded: {imageName}
            </p>
          )}

          {loadingImage && (
            <p className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Reading the image locally…
            </p>
          )}

          <div>
            <label htmlFor="reel-title" className="field-label">Title</label>
            <textarea id="reel-title" value={title} onChange={(event) => setTitle(event.target.value)} rows={2} maxLength={110} className="field resize-none" />
            <p className="mt-1 text-right font-mono text-[10px] text-slate-500">{title.length}/110</p>
          </div>

          <div>
            <label htmlFor="reel-subtitle" className="field-label">Subtitle</label>
            <input id="reel-subtitle" value={subtitle} onChange={(event) => setSubtitle(event.target.value)} maxLength={90} className="field" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="reel-handle" className="field-label">Handle</label>
              <input id="reel-handle" value={handle} onChange={(event) => setHandle(event.target.value)} maxLength={42} className="field" />
            </div>
            <div>
              <label htmlFor="reel-accent" className="field-label">Accent colour</label>
              <div className="flex items-center gap-2">
                <input id="reel-accent" type="color" value={accent} onChange={(event) => setAccent(event.target.value)} className="h-11 w-14 cursor-pointer rounded-xl border border-slate-300 bg-white p-1" />
                <span className="font-mono text-xs text-slate-500">{accent}</span>
              </div>
            </div>
          </div>

          <div>
            <span className="field-label">Text position</span>
            <div className="grid grid-cols-3 gap-2">
              {(['top', 'center', 'bottom'] as const).map((value) => (
                <button key={value} type="button" onClick={() => setPosition(value)} className={`rounded-xl border py-2 text-xs font-bold capitalize ${position === value ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-600'}`}>
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <span className="field-label mb-0">Title size</span>
              <span className="font-mono text-xs font-bold text-emerald-700">{fontSize}px</span>
            </div>
            <input type="range" min="46" max="110" step="2" value={fontSize} onChange={(event) => setFontSize(Number(event.target.value))} className="mt-2 w-full accent-emerald-600" />
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-700">
            <input type="checkbox" checked={safeZones} onChange={(event) => setSafeZones(event.target.checked)} className="h-4 w-4 rounded border-slate-300 accent-emerald-600" />
            Show Reels safe-zone guide
          </label>

          {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">{error}</p>}

          <button type="button" onClick={download} className="btn-primary w-full py-3">
            <Download className="h-4 w-4" aria-hidden="true" />
            Download cover PNG
          </button>
        </section>

        <section className="glass-card space-y-4 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Live cover</h2>
              <p className="mt-1 text-xs text-slate-600">Green dashed line marks the safer central area.</p>
            </div>
            <Film className="h-5 w-5 text-emerald-600" aria-hidden="true" />
          </div>
          <div className="grid place-items-center rounded-2xl bg-slate-950 p-3">
            <canvas
              ref={canvasRef}
              aria-label="Instagram Reels cover preview"
              className="max-h-[36rem] w-auto max-w-full rounded-xl shadow-2xl"
            />
          </div>
          <p className="text-center text-[11px] leading-relaxed text-slate-500">
            The export is always 1080 × 1920 px. This preview is scaled down to fit the screen.
          </p>
        </section>
      </div>
    </ClientToolPage>
  );
};
