import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Download,
  LayoutGrid,
  Loader2,
  Trash2,
} from 'lucide-react';
import { ClientToolPage } from '../components/ClientToolPage';
import { UploadZone } from '../components/UploadZone';
import type { FAQItem, HowToStep } from '../components/SEOHead';
import {
  canvasToBlob,
  createCanvas,
  downloadBlob,
  drawImageCover,
  loadImage,
  safeFileName,
} from '../lib/clientFiles';
import { useObjectUrls } from '../hooks/useObjectUrls';

interface GridImage {
  id: string;
  file: File;
  url: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How do I plan an Instagram grid before posting?',
    answer:
      'Upload the images you plan to publish, arrange them in the order they will appear, and check the 3-column preview. Instagram shows the newest post first, so upload or schedule your images in reverse order if you want the preview to match the final profile.',
  },
  {
    question: 'Does this tool post to Instagram automatically?',
    answer:
      'No. WaKit does not connect to Instagram or use unofficial automation. It only creates a local planning preview and an exported PNG mockup. You still upload or schedule posts through the official Instagram app or Meta tools.',
  },
  {
    question: 'Are my photos uploaded to a server?',
    answer:
      'No. Every image is read with the browser File API and drawn to a local Canvas. The grid is assembled in this tab, and the exported PNG is generated from a temporary local object URL. WaKit never receives your photos.',
  },
  {
    question: 'What image sizes work best for an Instagram grid?',
    answer:
      'A square 1080×1080 image is the safest format for a consistent grid. Portrait 1080×1350 posts also work but are cropped in the profile grid. Keep important text away from the edges, and use a consistent color or border system if you want a seamless look.',
  },
  {
    question: 'Can I reorder or remove photos?',
    answer:
      'Yes. Use the left and right arrow buttons to move a photo in the sequence, or the trash button to remove it. The live preview and exported PNG update to match the current order.',
  },
];

const steps: [HowToStep, HowToStep, HowToStep] = [
  {
    name: 'Add your planned posts',
    text: 'Drop up to 30 square or portrait images. They stay on your device and appear in a three-column feed preview.',
  },
  {
    name: 'Arrange the sequence',
    text: 'Move images left or right until the grid tells the story you want. Remove anything that does not fit.',
  },
  {
    name: 'Export the plan',
    text: 'Download a clean PNG mockup for your client, content calendar or team review before publishing.',
  },
];

const makeId = () => `grid-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const InstagramGridPlannerPage: React.FC = () => {
  const [images, setImages] = useState<GridImage[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { create } = useObjectUrls();

  const clearImages = () => {
    images.forEach((image) => URL.revokeObjectURL(image.url));
    setImages([]);
    setError(null);
  };

  const addImages = (files: File[]) => {
    setError(null);
    images.forEach((image) => URL.revokeObjectURL(image.url));
    const next = files
      .filter((file) => file.type.startsWith('image/'))
      .slice(0, 30)
      .map((file) => ({ id: makeId(), file, url: create(file) }));
    setImages(next);
  };

  const move = (index: number, direction: -1 | 1) => {
    setImages((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return next;
    });
  };

  const remove = (index: number) => {
    setImages((current) => {
      const item = current[index];
      if (item) URL.revokeObjectURL(item.url);
      return current.filter((_, itemIndex) => itemIndex !== index);
    });
  };

  const exportPreview = async () => {
    if (images.length === 0) {
      setError('Add at least one image first.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const tile = 456;
      const gap = 18;
      const padding = 18;
      const rows = Math.ceil(images.length / 3);
      const width = padding * 2 + tile * 3 + gap * 2;
      const height = padding * 2 + rows * tile + Math.max(0, rows - 1) * gap;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas is not available in this browser.');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      for (const [index, item] of images.entries()) {
        const image = await loadImage(item.file);
        const col = index % 3;
        const row = Math.floor(index / 3);
        const x = padding + col * (tile + gap);
        const y = padding + row * (tile + gap);
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, tile, tile);
        ctx.clip();
        ctx.translate(x, y);
        drawImageCover(ctx, image, tile, tile, image.naturalWidth, image.naturalHeight);
        ctx.restore();
      }

      const blob = await canvasToBlob(canvas, 'image/png');
      downloadBlob(blob, `${safeFileName('instagram-grid-plan', 'instagram-grid-plan')}.png`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not export the grid preview.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ClientToolPage
      seo={{
        title: 'Instagram Grid Planner — Free Feed Preview & Layout Tool | WaKit',
        description:
          'Plan your Instagram feed in a 3-column grid, reorder photos and download a clean preview PNG. No login, upload or Instagram connection.',
        canonicalPath: '/instagram-grid-planner',
        keywords:
          'instagram grid planner, instagram feed preview, 3 column grid maker, instagram layout planner, free instagram grid template',
      }}
      icon={LayoutGrid}
      eyebrow="3-column feed preview • PNG export"
      title={
        <>
          Instagram <span className="text-gradient-emerald">grid planner</span>
        </>
      }
      description="Arrange your next posts in a realistic profile grid, catch colour clashes early and export a clean preview for your content calendar."
      breadcrumbs={[{ name: 'Instagram Grid Planner' }]}
      toolName="Instagram Grid Planner"
      currentPath="/instagram-grid-planner"
      quickAnswer={{
        question: 'How can I preview an Instagram grid before posting?',
        answer:
          'Upload the photos you plan to publish, drag the order with arrow controls, and review the three-column preview. WaKit renders the grid locally and exports a PNG mockup. Instagram itself is not connected or automated.',
        facts: [
          { label: 'Layout', value: '3 columns' },
          { label: 'Limit', value: '30 photos' },
          { label: 'Export', value: 'PNG' },
          { label: 'Uploads', value: '0' },
        ],
      }}
      steps={steps}
      intro="The profile grid is usually the first thing a visitor sees. Planning the sequence before publishing makes a new account look intentional and keeps an existing feed visually consistent."
      faqs={faqs}
      securityHeading="A visual plan, not an Instagram connection"
      securityText="WaKit never asks for your Instagram password, cookies or access token. Images are decoded and arranged on a local Canvas, and the exported preview is generated in your browser. There is no server upload and no automatic posting."
    >
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="glass-card space-y-5 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Add planned posts</h2>
              <p className="mt-1 text-xs text-slate-600">Square photos give the most predictable grid crop.</p>
            </div>
            {images.length > 0 && (
              <button type="button" onClick={clearImages} className="btn-secondary px-3 py-2 text-xs">
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                Clear
              </button>
            )}
          </div>

          <UploadZone
            accept="image/png,image/jpeg,image/webp,image/avif"
            multiple
            onFiles={addImages}
            icon={LayoutGrid}
            title="Drop 3–30 images"
            hint="JPG, PNG, WebP or AVIF · everything stays local"
            files={images.map((image) => image.file)}
            disabled={busy}
          />

          {error && (
            <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              {error}
            </p>
          )}

          <button type="button" onClick={exportPreview} disabled={busy || images.length === 0} className="btn-primary w-full py-3">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Download className="h-4 w-4" aria-hidden="true" />}
            {busy ? 'Rendering grid…' : 'Export preview PNG'}
          </button>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-[11px] leading-relaxed text-emerald-800">
            <p className="font-bold">Instagram order tip</p>
            <p className="mt-1">
              New posts appear first in the profile. If you are uploading in bulk, place the oldest image at the
              start of your planned sequence and the newest at the end.
            </p>
          </div>
        </section>

        <section className="glass-card space-y-4 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Live feed preview</h2>
              <p className="mt-1 text-xs text-slate-600">
                {images.length > 0 ? `${images.length} posts in this plan` : 'Your grid will appear here.'}
              </p>
            </div>
            <LayoutGrid className="h-5 w-5 text-emerald-600" aria-hidden="true" />
          </div>

          {images.length === 0 ? (
            <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <div>
                <LayoutGrid className="mx-auto h-10 w-10 text-slate-300" aria-hidden="true" />
                <p className="mt-3 text-sm font-semibold text-slate-600">No posts added</p>
                <p className="mx-auto mt-1 max-w-xs text-xs text-slate-500">
                  Add images to see the 3-column profile preview and arrange the story order.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="mx-auto grid max-w-md grid-cols-3 gap-1.5 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                {images.map((image, index) => (
                  <div key={image.id} className="group relative aspect-square overflow-hidden rounded-lg bg-slate-100">
                    <img src={image.url} alt={`Planned post ${index + 1}`} className="h-full w-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-slate-950/70 p-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => move(index, -1)}
                        disabled={index === 0}
                        className="rounded p-1 text-white disabled:opacity-30"
                        aria-label={`Move post ${index + 1} earlier`}
                      >
                        <ArrowLeft className="h-3 w-3" aria-hidden="true" />
                      </button>
                      <span className="font-mono text-[9px] font-bold text-white">{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => move(index, 1)}
                        disabled={index === images.length - 1}
                        className="rounded p-1 text-white disabled:opacity-30"
                        aria-label={`Move post ${index + 1} later`}
                      >
                        <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="absolute right-1 top-1 rounded-md bg-slate-950/60 p-1 text-white opacity-100 transition-opacity hover:bg-red-600 sm:opacity-0 sm:group-hover:opacity-100"
                      aria-label={`Remove post ${index + 1}`}
                    >
                      <Trash2 className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-center text-[11px] text-slate-500">
                Hover a tile to move or remove it. The numbered order matches the exported PNG.
              </p>
            </>
          )}
        </section>
      </div>
    </ClientToolPage>
  );
};
