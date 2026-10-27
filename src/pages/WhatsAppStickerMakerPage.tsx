import React, { useMemo, useRef, useState } from 'react';
import { Download, Loader2, Package, Sticker, Trash2 } from 'lucide-react';
import { ClientToolPage } from '../components/ClientToolPage';
import { UploadZone } from '../components/UploadZone';
import type { FAQItem, HowToStep } from '../components/SEOHead';
import {
  canvasToBlob,
  createCanvas,
  drawImageContain,
  drawImageCover,
  formatBytes,
  loadImage,
  safeFileName,
  zipAndDownload,
} from '../lib/clientFiles';
import { useObjectUrls } from '../hooks/useObjectUrls';

interface StickerResult {
  name: string;
  blob: Blob;
  url: string;
  size: number;
}

const MAX_FILES = 30;
const MAX_STICKER_BYTES = 100 * 1024;

const faqs: FAQItem[] = [
  {
    question: 'How do I make WhatsApp stickers from my photos?',
    answer:
      'Select up to 30 photos, choose fit or fill, and WaKit centers each image on a 512×512 transparent canvas. It then compresses every sticker to WebP under 100 KB and lets you download them individually or as one sticker-pack ZIP.',
  },
  {
    question: 'Is this sticker maker really upload-free?',
    answer:
      'Yes. Images are decoded, resized, compressed and packed entirely in your browser using Canvas and JSZip. No photo, title, author name or phone number is sent to a server.',
  },
  {
    question: 'Can I import the ZIP into WhatsApp?',
    answer:
      'The ZIP follows the common .wastickers pack layout: numbered .webp files plus title.txt, author.txt and emoji.txt. Some Android sticker apps accept it directly; if your app asks for .wastickers, rename the downloaded .zip extension. WhatsApp itself does not provide a desktop pack importer.',
  },
  {
    question: 'Why is my sticker still larger than 100 KB?',
    answer:
      'WaKit lowers WebP quality automatically until the file fits under 100 KB. Very detailed or noisy images may become softer. Try a simpler image, crop tightly around the subject, or use the Fill option instead of Fit.',
  },
  {
    question: 'Which image formats can I use?',
    answer:
      'PNG, JPG, WebP, GIF (first frame), BMP and AVIF images up to 30 MB each are supported by modern browsers. Transparent PNGs work best for stickers.',
  },
];

const steps: [HowToStep, HowToStep, HowToStep] = [
  {
    name: 'Select your images',
    text: 'Drop up to 30 photos into the local upload area. Nothing is transmitted; the files are read directly from your device.',
  },
  {
    name: 'Choose fit or fill',
    text: 'Fit keeps the whole subject with transparent edges. Fill crops the image edge-to-edge to cover the full square sticker.',
  },
  {
    name: 'Download the pack',
    text: 'Preview every 512×512 sticker, download individual WebP files, or export a ZIP pack with title, author and emoji metadata.',
  },
];

export const WhatsAppStickerMakerPage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [stickers, setStickers] = useState<StickerResult[]>([]);
  const [fit, setFit] = useState<'fit' | 'fill'>('fit');
  const [packTitle, setPackTitle] = useState('My WaKit Stickers');
  const [author, setAuthor] = useState('Made with WaKit');
  const [emoji, setEmoji] = useState('😀');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { create } = useObjectUrls();
  const resultsRef = useRef<StickerResult[]>([]);

  const totalInputSize = useMemo(() => files.reduce((sum, file) => sum + file.size, 0), [files]);

  const replaceStickers = (next: StickerResult[]) => {
    resultsRef.current.forEach((item) => URL.revokeObjectURL(item.url));
    resultsRef.current = next;
    setStickers(next);
  };

  const buildStickers = async () => {
    if (files.length === 0) {
      setError('Choose at least one image first.');
      return;
    }
    if (files.length > MAX_FILES) {
      setError(`Please select no more than ${MAX_FILES} images at a time.`);
      return;
    }

    setProcessing(true);
    setError(null);
    const next: StickerResult[] = [];

    try {
      for (const [index, file] of files.entries()) {
        const image = await loadImage(file);
        const canvas = createCanvas(512, 512);
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas is not available in this browser.');
        ctx.clearRect(0, 0, 512, 512);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        if (fit === 'fit') {
          drawImageContain(ctx, image, 512, 512, image.naturalWidth, image.naturalHeight);
        } else {
          drawImageCover(ctx, image, 512, 512, image.naturalWidth, image.naturalHeight);
        }

        let quality = 0.92;
        let blob = await canvasToBlob(canvas, 'image/webp', quality);
        while (blob.size > MAX_STICKER_BYTES && quality > 0.28) {
          quality -= 0.08;
          blob = await canvasToBlob(canvas, 'image/webp', quality);
        }

        const extension = blob.type === 'image/webp' ? 'webp' : 'png';
        const name = `${String(index + 1).padStart(2, '0')}-${safeFileName(file.name, 'sticker')}.${extension}`;
        next.push({
          name,
          blob,
          url: create(blob),
          size: blob.size,
        });
      }

      replaceStickers(next);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not create the stickers.');
    } finally {
      setProcessing(false);
    }
  };

  const downloadPack = async () => {
    if (stickers.length === 0) {
      setError('Create at least one sticker before downloading the pack.');
      return;
    }
    try {
      const packFiles = [
        ...stickers.map((sticker) => ({ name: sticker.name, blob: sticker.blob })),
        { name: 'title.txt', blob: new Blob([packTitle.trim() || 'WaKit Stickers'], { type: 'text/plain' }) },
        { name: 'author.txt', blob: new Blob([author.trim() || 'WaKit'], { type: 'text/plain' }) },
        { name: 'emoji.txt', blob: new Blob([emoji.trim() || '😀'], { type: 'text/plain' }) },
      ];
      await zipAndDownload(packFiles, `${safeFileName(packTitle, 'wakit-sticker-pack')}.zip`, 'WaKit stickers');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not create the sticker pack.');
    }
  };

  return (
    <ClientToolPage
      seo={{
        title: 'WhatsApp Sticker Maker & Pack Exporter | WaKit',
        description:
          'Create 512×512 WhatsApp stickers from photos and export a .wastickers-style pack. Canvas compression under 100 KB, no uploads or signup.',
        canonicalPath: '/whatsapp-sticker-maker',
        keywords:
          'whatsapp sticker maker, make whatsapp stickers from photos, sticker pack exporter, 512x512 sticker maker, webp sticker pack',
      }}
      icon={Sticker}
      eyebrow="512×512 WebP • pack export"
      title={
        <>
          WhatsApp <span className="text-gradient-emerald">sticker maker</span>
        </>
      }
      description="Turn photos into clean 512×512 stickers, then export an organized pack with title, author and emoji metadata — all on your device."
      breadcrumbs={[{ name: 'Sticker Maker' }]}
      toolName="WhatsApp Sticker Maker"
      currentPath="/whatsapp-sticker-maker"
      quickAnswer={{
        question: 'How do I make WhatsApp stickers for free?',
        answer:
          'Drop photos into WaKit, choose Fit or Fill, and generate 512×512 WebP stickers under 100 KB. Preview them, then download individual files or a ZIP pack. Processing and compression happen locally in your browser.',
        facts: [
          { label: 'Canvas', value: '512 × 512' },
          { label: 'Format', value: 'WebP' },
          { label: 'Pack', value: 'ZIP' },
          { label: 'Uploads', value: '0' },
        ],
      }}
      steps={steps}
      intro="This tool is designed for creators and small businesses that need a quick sticker workflow without a design app, account, or cloud upload."
      faqs={faqs}
      securityHeading="Why your photos never leave this browser tab"
      securityText="WaKit decodes your image locally, draws it onto an in-memory Canvas, and uses the browser’s own WebP encoder. The generated files are packed with JSZip in the same tab and downloaded from a temporary local object URL. There is no upload endpoint, account, analytics payload, or stored copy on a server."
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <section className="glass-card space-y-5 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">1. Add images</h2>
              <p className="mt-1 text-xs text-slate-600">Up to 30 photos. Each source can be up to 30 MB.</p>
            </div>
            {files.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setFiles([]);
                  replaceStickers([]);
                }}
                className="btn-secondary px-3 py-2 text-xs"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                Clear
              </button>
            )}
          </div>

          <UploadZone
            accept="image/png,image/jpeg,image/webp,image/gif,image/avif,image/bmp"
            multiple
            onFiles={(next) => {
              setFiles(next.slice(0, MAX_FILES));
              setError(null);
              replaceStickers([]);
            }}
            icon={Sticker}
            title="Drop photos or browse"
            hint="PNG, JPG, WebP, GIF, BMP or AVIF · transparent PNG works best"
            files={files}
            disabled={processing}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <span className="field-label">Image placement</span>
              <div className="grid grid-cols-2 gap-2">
                {(['fit', 'fill'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setFit(mode)}
                    className={`rounded-xl border px-3 py-2 text-xs font-bold capitalize ${
                      fit === mode
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    {mode === 'fit' ? 'Fit (transparent)' : 'Fill (crop)'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="sticker-emoji" className="field-label">
                Pack emoji
              </label>
              <input
                id="sticker-emoji"
                value={emoji}
                onChange={(event) => setEmoji(event.target.value.slice(0, 8))}
                className="field"
                placeholder="😀"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="sticker-title" className="field-label">
                Pack title
              </label>
              <input
                id="sticker-title"
                value={packTitle}
                onChange={(event) => setPackTitle(event.target.value)}
                maxLength={80}
                className="field"
              />
            </div>
            <div>
              <label htmlFor="sticker-author" className="field-label">
                Author
              </label>
              <input
                id="sticker-author"
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
                maxLength={80}
                className="field"
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={buildStickers}
            disabled={processing || files.length === 0}
            className="btn-primary w-full py-3"
          >
            {processing ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Sticker className="h-4 w-4" aria-hidden="true" />
            )}
            {processing ? 'Creating stickers…' : `Create ${files.length || ''} stickers`}
          </button>

          <p className="text-[11px] leading-relaxed text-slate-500">
            Source total: <span className="font-mono font-semibold text-slate-700">{formatBytes(totalInputSize)}</span>
            {' '}· every output is checked against WhatsApp&apos;s 100 KB sticker guideline.
          </p>
        </section>

        <section className="glass-card space-y-4 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">2. Preview &amp; export</h2>
              <p className="mt-1 text-xs text-slate-600">
                {stickers.length > 0
                  ? `${stickers.length} ${stickers.length === 1 ? 'sticker' : 'stickers'} ready`
                  : 'Your generated stickers appear here.'}
              </p>
            </div>
            <Package className="h-5 w-5 text-emerald-600" aria-hidden="true" />
          </div>

          {stickers.length === 0 ? (
            <div className="grid min-h-56 place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <div>
                <Sticker className="mx-auto h-10 w-10 text-slate-300" aria-hidden="true" />
                <p className="mt-3 text-sm font-semibold text-slate-600">No stickers yet</p>
                <p className="mt-1 max-w-xs text-xs text-slate-500">
                  Add images and click “Create stickers”. You will see exact output sizes before downloading.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {stickers.map((sticker) => (
                <a
                  key={sticker.name}
                  href={sticker.url}
                  download={sticker.name}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-2 transition-colors hover:border-emerald-300 hover:bg-emerald-50/40"
                  title={`Download ${sticker.name}`}
                >
                  <span className="checkerboard grid aspect-square place-items-center overflow-hidden rounded-xl">
                    <img src={sticker.url} alt={sticker.name} className="h-full w-full object-contain" />
                  </span>
                  <span className="mt-2 flex items-center justify-between gap-1 text-[10px] font-semibold text-slate-600">
                    <span className="truncate">{sticker.name}</span>
                    <Download className="h-3 w-3 shrink-0 text-emerald-600" aria-hidden="true" />
                  </span>
                  <span className="mt-0.5 block font-mono text-[10px] text-emerald-700">{formatBytes(sticker.size)}</span>
                </a>
              ))}
            </div>
          )}

          {stickers.length > 0 && (
            <button type="button" onClick={downloadPack} className="btn-primary w-full py-3">
              <Download className="h-4 w-4" aria-hidden="true" />
              Download sticker pack (.zip)
            </button>
          )}
        </section>
      </div>
    </ClientToolPage>
  );
};
