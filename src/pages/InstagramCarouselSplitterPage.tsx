import React, { useState } from 'react';
import { Download, Image, Loader2, Package, Scissors, Trash2 } from 'lucide-react';
import { ClientToolPage } from '../components/ClientToolPage';
import { UploadZone } from '../components/UploadZone';
import type { FAQItem, HowToStep } from '../components/SEOHead';
import {
  canvasToBlob,
  createCanvas,
  loadImage,
  safeFileName,
  zipAndDownload,
} from '../lib/clientFiles';
import { useObjectUrls } from '../hooks/useObjectUrls';

interface SlideResult {
  name: string;
  blob: Blob;
  url: string;
  width: number;
  height: number;
}

const faqs: FAQItem[] = [
  {
    question: 'How do I split one image into Instagram carousel slides?',
    answer:
      'Upload one tall graphic, choose 2–10 slides and an export format, then click Split into slides. WaKit divides the image into equal horizontal bands and creates one high-resolution file per slide. Download them individually or as a ZIP.',
  },
  {
    question: 'What size should the source image be?',
    answer:
      'For 4:5 portrait slides, start with a graphic that is 1080 px wide and 1350 px tall for every slide. For example, a 5-slide carousel should be 1080 × 6750 px. A 1:1 carousel should be 1080 × 1080 px per slide.',
  },
  {
    question: 'Will the slides line up perfectly in Instagram?',
    answer:
      'The split is mathematically seamless, but Instagram may crop previews on different screen sizes. Keep faces and text away from the very edges, and preview the result in the Instagram app before publishing. Exporting as PNG avoids JPEG artifacts at the seams.',
  },
  {
    question: 'Are my images uploaded anywhere?',
    answer:
      'No. The source image is decoded and split on a local Canvas. The slide files are created in your browser and packed with JSZip only when you click download.',
  },
  {
    question: 'What is the difference between PNG and JPG output?',
    answer:
      'PNG is lossless and best for graphics, text and flat colors. JPG produces smaller files for photo-heavy designs but can show compression artifacts. WaKit uses a high JPG quality setting when you choose JPG.',
  },
];

const steps: [HowToStep, HowToStep, HowToStep] = [
  {
    name: 'Upload the tall design',
    text: 'Choose the full carousel graphic. For 4:5 slides, use 1080 × (1350 × number of slides) pixels.',
  },
  {
    name: 'Choose the slide count',
    text: 'Pick 2–10 slides and select PNG for crisp text or JPG for smaller photo files.',
  },
  {
    name: 'Download the set',
    text: 'Preview each seamless strip, download individual slides, or export the full carousel as a ZIP.',
  },
];

export const InstagramCarouselSplitterPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [slides, setSlides] = useState(5);
  const [format, setFormat] = useState<'png' | 'jpg'>('png');
  const [results, setResults] = useState<SlideResult[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { create } = useObjectUrls();

  const clearResults = () => {
    results.forEach((result) => URL.revokeObjectURL(result.url));
    setResults([]);
  };

  const handleFile = (nextFiles: File[]) => {
    const next = nextFiles[0];
    if (!next) return;
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    clearResults();
    setFile(next);
    setSourceUrl(create(next));
    setError(null);
  };

  const reset = () => {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    setSourceUrl(null);
    setFile(null);
    clearResults();
    setError(null);
  };

  const splitImage = async () => {
    if (!file) {
      setError('Choose a tall image first.');
      return;
    }
    setBusy(true);
    setError(null);
    clearResults();
    const next: SlideResult[] = [];

    try {
      const image = await loadImage(file);
      const width = 1080;
      const scale = width / image.naturalWidth;
      const sliceHeight = image.naturalHeight / slides;
      const outputHeight = Math.max(1, Math.round(sliceHeight * scale));

      for (let index = 0; index < slides; index += 1) {
        const sourceY = index * sliceHeight;
        const canvas = createCanvas(width, outputHeight);
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas is not available in this browser.');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(image, 0, sourceY, image.naturalWidth, sliceHeight, 0, 0, width, outputHeight);
        const mime = format === 'png' ? 'image/png' : 'image/jpeg';
        const blob = await canvasToBlob(canvas, mime, 0.94);
        const name = `${safeFileName(file.name, 'carousel')}-slide-${String(index + 1).padStart(2, '0')}.${format}`;
        next.push({ name, blob, url: create(blob), width, height: outputHeight });
      }

      setResults(next);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not split the image.');
    } finally {
      setBusy(false);
    }
  };

  const downloadZip = async () => {
    try {
      await zipAndDownload(
        results.map((result) => ({ name: result.name, blob: result.blob })),
        'wakit-instagram-carousel.zip',
        'carousel slides',
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not create the ZIP.');
    }
  };

  const expectedHeight = file ? Math.round(1350 * slides) : 0;

  return (
    <ClientToolPage
      seo={{
        title: 'Instagram Carousel Splitter — Seamless Slide Maker | WaKit',
        description:
          'Split a tall Instagram carousel graphic into 2–10 seamless slides. Export high-resolution PNG or JPG files and a ZIP — all locally in your browser.',
        canonicalPath: '/instagram-carousel-splitter',
        keywords:
          'instagram carousel splitter, split image for instagram carousel, seamless carousel maker, instagram slide splitter, carousel png export',
      }}
      icon={Scissors}
      eyebrow="2–10 seamless slides • local Canvas"
      title={
        <>
          Instagram <span className="text-gradient-emerald">carousel splitter</span>
        </>
      }
      description="Turn one tall design into a ready-to-upload carousel without manually measuring, cropping or re-exporting every slide."
      breadcrumbs={[{ name: 'Carousel Splitter' }]}
      toolName="Instagram Carousel Splitter"
      currentPath="/instagram-carousel-splitter"
      quickAnswer={{
        question: 'How do I split a graphic into Instagram carousel slides?',
        answer:
          'Upload one tall image, choose the number of slides and click Split. WaKit divides the image into equal horizontal strips at 1080 px wide, creates PNG or JPG files, and lets you download the complete set as a ZIP.',
        facts: [
          { label: 'Slides', value: '2–10' },
          { label: 'Width', value: '1080 px' },
          { label: 'Formats', value: 'PNG / JPG' },
          { label: 'Uploads', value: '0' },
        ],
      }}
      steps={steps}
      intro="A seamless carousel starts with the right source canvas. Build the entire story as one tall graphic, then split it only at the final export step for perfectly aligned edges."
      faqs={faqs}
      securityHeading="Your carousel is cut on-device, not on a cloud canvas"
      securityText="The source image is loaded from your device, divided with exact floating-point coordinates and drawn onto local canvases. Slide files are generated by the browser and downloaded from temporary object URLs. No image, slide count or file name is sent to a server."
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="glass-card space-y-5 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">1. Source design</h2>
              <p className="mt-1 text-xs text-slate-600">Use a tall graphic with equal visual bands.</p>
            </div>
            {file && (
              <button type="button" onClick={reset} className="btn-secondary px-3 py-2 text-xs">
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                Clear
              </button>
            )}
          </div>

          <UploadZone
            accept="image/png,image/jpeg,image/webp"
            onFiles={handleFile}
            icon={Image}
            title="Drop one tall carousel image"
            hint="For 4:5 slides, use 1080 × (1350 × slides) px"
            files={file ? [file] : []}
            disabled={busy}
          />

          {sourceUrl && (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 p-2">
              <img src={sourceUrl} alt="Carousel source preview" className="mx-auto max-h-72 w-auto rounded-xl object-contain" />
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="carousel-slides" className="field-label">
                Number of slides
              </label>
              <select id="carousel-slides" value={slides} onChange={(event) => setSlides(Number(event.target.value))} className="field">
                {Array.from({ length: 9 }, (_, index) => index + 2).map((value) => (
                  <option key={value} value={value}>
                    {value} slides
                  </option>
                ))}
              </select>
            </div>
            <div>
              <span className="field-label">Output format</span>
              <div className="grid grid-cols-2 gap-2">
                {(['png', 'jpg'] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFormat(value)}
                    className={`rounded-xl border py-2 text-xs font-bold uppercase ${
                      format === value
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    {value === 'png' ? 'PNG · crisp' : 'JPG · small'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {file && file.type !== 'image/png' && file.type !== 'image/webp' && (
            <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-800">
              JPG sources can show a faint seam. Exporting as PNG keeps text and flat colors cleaner.
            </p>
          )}

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-600">
            <p className="font-bold text-slate-800">Recommended source</p>
            <p className="mt-1">
              1080 × {expectedHeight || '1350 × slides'} px for 4:5 portrait. The generated slides are 1080 px wide and
              each output is one equal band tall.
            </p>
          </div>

          {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">{error}</p>}

          <button type="button" onClick={splitImage} disabled={!file || busy} className="btn-primary w-full py-3">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Scissors className="h-4 w-4" aria-hidden="true" />}
            {busy ? 'Splitting image…' : `Split into ${slides} slides`}
          </button>
        </section>

        <section className="glass-card space-y-4 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">2. Slide set</h2>
              <p className="mt-1 text-xs text-slate-600">
                {results.length > 0 ? `${results.length} slides ready · ${results[0]?.width}×${results[0]?.height}px` : 'Your seamless slides appear here.'}
              </p>
            </div>
            {results.length > 0 && (
              <button type="button" onClick={downloadZip} className="btn-secondary px-3 py-2 text-xs">
                <Package className="h-3.5 w-3.5" aria-hidden="true" />
                ZIP
              </button>
            )}
          </div>

          {results.length === 0 ? (
            <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <div>
                <Scissors className="mx-auto h-10 w-10 text-slate-300" aria-hidden="true" />
                <p className="mt-3 text-sm font-semibold text-slate-600">No slides yet</p>
                <p className="mx-auto mt-1 max-w-xs text-xs text-slate-500">
                  Upload a design and split it. Every slide stays in the correct order and can be downloaded separately.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {results.map((result, index) => (
                <a key={result.name} href={result.url} download={result.name} className="group overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-1.5">
                  <img src={result.url} alt={`Carousel slide ${index + 1}`} className="w-full rounded-lg object-cover" />
                  <span className="mt-1.5 flex items-center justify-between gap-1 px-0.5 pb-0.5 text-[10px] font-semibold text-slate-600">
                    Slide {index + 1}
                    <Download className="h-3 w-3 text-emerald-600" aria-hidden="true" />
                  </span>
                </a>
              ))}
            </div>
          )}

          {results.length > 0 && (
            <button type="button" onClick={downloadZip} className="btn-primary w-full py-3">
              <Download className="h-4 w-4" aria-hidden="true" />
              Download all slides (.zip)
            </button>
          )}
        </section>
      </div>
    </ClientToolPage>
  );
};
