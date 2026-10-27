import React, { useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import {
  Check,
  Copy,
  Download,
  Image,
  Link2,
  Loader2,
  Package,
  QrCode,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react';
import { ClientToolPage } from '../components/ClientToolPage';
import { UploadZone } from '../components/UploadZone';
import type { FAQItem, HowToStep } from '../components/SEOHead';
import {
  canvasToBlob,
  copyText,
  createCanvas,
  downloadBlob,
  downloadText,
  drawImageContain,
  drawImageCover,
  formatBytes,
  loadImage,
  normalizeUrl,
  safeFileName,
  zipAndDownload,
} from '../lib/clientFiles';
import { useObjectUrls } from '../hooks/useObjectUrls';

type Tab = 'resize' | 'tracking';
type FitMode = 'cover' | 'contain';
type OutputFormat = 'image/jpeg' | 'image/png';

interface Preset {
  id: string;
  label: string;
  width: number;
  height: number;
  platform: string;
}

interface SourceImage {
  id: string;
  file: File;
  url: string;
}

interface ResizedImage {
  id: string;
  name: string;
  blob: Blob;
  url: string;
  width: number;
  height: number;
  preset: string;
}

const presets: Preset[] = [
  { id: 'ig-post', label: 'Instagram post', width: 1080, height: 1080, platform: 'Instagram' },
  { id: 'ig-portrait', label: 'Instagram portrait', width: 1080, height: 1350, platform: 'Instagram' },
  { id: 'ig-story', label: 'Instagram story / Reel', width: 1080, height: 1920, platform: 'Instagram' },
  { id: 'fb-post', label: 'Facebook post', width: 1200, height: 630, platform: 'Facebook' },
  { id: 'fb-cover', label: 'Facebook page cover', width: 820, height: 312, platform: 'Facebook' },
  { id: 'x-post', label: 'X post', width: 1600, height: 900, platform: 'X' },
  { id: 'linkedin-post', label: 'LinkedIn post', width: 1200, height: 627, platform: 'LinkedIn' },
  { id: 'whatsapp-dp', label: 'WhatsApp profile', width: 500, height: 500, platform: 'WhatsApp' },
];

const faqs: FAQItem[] = [
  {
    question: 'Can I resize several images for multiple platforms at once?',
    answer:
      'Yes. Upload up to 12 images, select any combination of eight common platform sizes, then generate every combination in one batch. Download individual files or the complete set as a ZIP.',
  },
  {
    question: 'Should I use cover or contain when resizing?',
    answer:
      'Cover fills the entire frame and may crop the edges, which is usually right for photos. Contain keeps the whole image visible and adds white space, which is safer for product shots and graphics with important details near the edge.',
  },
  {
    question: 'What does the UTM builder do?',
    answer:
      'It appends utm_source, utm_medium, utm_campaign, utm_term and utm_content to a destination URL so analytics tools can attribute visits to a specific campaign. It also turns the final URL into a downloadable QR code.',
  },
  {
    question: 'Will resized images look sharp?',
    answer:
      'WaKit starts from your original file and resizes down to the target dimensions with high-quality canvas smoothing. Enlarging a small image cannot create new detail, so upload the sharpest source you have, ideally at least as large as the biggest preset.',
  },
  {
    question: 'Are my images and campaign links uploaded?',
    answer:
      'No. Image resizing happens on local Canvases. UTM parameters are added with the browser URL API, and QR codes are rendered locally by qrcode.react. No source image, link or campaign value is sent to WaKit.',
  },
];

const steps: [HowToStep, HowToStep, HowToStep] = [
  {
    name: 'Add source images',
    text: 'Drop up to 12 JPG, PNG or WebP files. Check the total size before generating a large batch.',
  },
  {
    name: 'Choose sizes and fit',
    text: 'Select the platform presets you need, then pick cover for full-frame photos or contain for uncropped graphics.',
  },
  {
    name: 'Export or add tracking',
    text: 'Download the resized set as a ZIP, or switch to UTM Builder and create a trackable link with a QR code.',
  },
];

const makeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const SocialBatchResizerPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>('resize');
  const [sources, setSources] = useState<SourceImage[]>([]);
  const [selectedPresets, setSelectedPresets] = useState<string[]>(['ig-post', 'ig-story', 'fb-post']);
  const [fit, setFit] = useState<FitMode>('cover');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('image/jpeg');
  const [quality, setQuality] = useState(0.9);
  const [results, setResults] = useState<ResizedImage[]>([]);
  const [busy, setBusy] = useState(false);
  const [resizeError, setResizeError] = useState<string | null>(null);

  const [baseUrl, setBaseUrl] = useState('');
  const [source, setSource] = useState('instagram');
  const [medium, setMedium] = useState('social');
  const [campaign, setCampaign] = useState('');
  const [term, setTerm] = useState('');
  const [content, setContent] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [trackingError, setTrackingError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const { create } = useObjectUrls();

  const chosenPresets = presets.filter((preset) => selectedPresets.includes(preset.id));
  const totalSourceBytes = sources.reduce((sum, item) => sum + item.file.size, 0);
  const outputCount = sources.length * chosenPresets.length;
  const extension = outputFormat === 'image/png' ? 'png' : 'jpg';

  const revokeResults = (items = results) => {
    items.forEach((item) => URL.revokeObjectURL(item.url));
  };

  const clearResults = () => {
    revokeResults();
    setResults([]);
  };

  const addSources = (files: File[]) => {
    setResizeError(null);
    const remaining = 12 - sources.length;
    if (remaining <= 0) {
      setResizeError('You can batch up to 12 images. Remove one before adding more.');
      return;
    }
    const accepted = files.filter((file) => file.type.startsWith('image/')).slice(0, remaining);
    if (accepted.length < files.length) {
      setResizeError('Some files were ignored. Use up to 12 JPG, PNG or WebP images.');
    }
    const additions = accepted.map((file) => ({ id: makeId('source'), file, url: create(file) }));
    setSources((current) => [...current, ...additions]);
  };

  const removeSource = (id: string) => {
    setSources((current) => {
      const target = current.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return current.filter((item) => item.id !== id);
    });
  };

  const clearSources = () => {
    sources.forEach((item) => URL.revokeObjectURL(item.url));
    setSources([]);
    clearResults();
    setResizeError(null);
  };

  const togglePreset = (id: string) => {
    setSelectedPresets((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const resizeBatch = async () => {
    if (sources.length === 0) {
      setResizeError('Add at least one image first.');
      return;
    }
    if (chosenPresets.length === 0) {
      setResizeError('Select at least one platform size.');
      return;
    }
    setBusy(true);
    setResizeError(null);
    clearResults();
    const next: ResizedImage[] = [];

    try {
      for (const [sourceIndex, item] of sources.entries()) {
        const image = await loadImage(item.file);
        for (const preset of chosenPresets) {
          const canvas = createCanvas(preset.width, preset.height);
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Canvas is not available in this browser.');
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, preset.width, preset.height);
          if (fit === 'cover') {
            drawImageCover(ctx, image, preset.width, preset.height, image.naturalWidth, image.naturalHeight);
          } else {
            drawImageContain(ctx, image, preset.width, preset.height, image.naturalWidth, image.naturalHeight);
          }
          const blob = await canvasToBlob(canvas, outputFormat, quality);
          const name = `${safeFileName(item.file.name, `image-${sourceIndex + 1}`)}-${preset.id}.${extension}`;
          next.push({
            id: makeId('result'),
            name,
            blob,
            url: create(blob),
            width: preset.width,
            height: preset.height,
            preset: preset.label,
          });
        }
      }
      setResults(next);
    } catch (err: unknown) {
      next.forEach((item) => URL.revokeObjectURL(item.url));
      setResizeError(err instanceof Error ? err.message : 'Could not resize the batch.');
    } finally {
      setBusy(false);
    }
  };

  const downloadAll = async () => {
    if (results.length === 0) return;
    try {
      await zipAndDownload(
        results.map((item) => ({ name: item.name, blob: item.blob })),
        'wakit-social-image-pack.zip',
        'resized images',
      );
    } catch (err: unknown) {
      setResizeError(err instanceof Error ? err.message : 'Could not create the ZIP.');
    }
  };

  const buildTrackingUrl = () => {
    setTrackingError(null);
    setCopied(false);
    const normalized = normalizeUrl(baseUrl);
    if (!normalized) {
      setTrackingError('Enter a complete destination URL starting with https:// or http://.');
      setTrackingUrl('');
      return;
    }
    if (![source, medium, campaign, term, content].some((value) => value.trim())) {
      setTrackingError('Add at least one UTM value so the link is actually trackable.');
      setTrackingUrl('');
      return;
    }
    try {
      const url = new URL(normalized);
      const values: Array<[string, string]> = [
        ['utm_source', source],
        ['utm_medium', medium],
        ['utm_campaign', campaign],
        ['utm_term', term],
        ['utm_content', content],
      ];
      values.forEach(([key, value]) => {
        if (value.trim()) url.searchParams.set(key, value.trim());
        else url.searchParams.delete(key);
      });
      setTrackingUrl(url.toString());
    } catch {
      setTrackingError('The destination URL could not be parsed.');
      setTrackingUrl('');
    }
  };

  const copyTrackingUrl = async () => {
    if (!trackingUrl) return;
    try {
      await copyText(trackingUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (err: unknown) {
      setTrackingError(err instanceof Error ? err.message : 'Could not copy the link.');
    }
  };

  const downloadQr = async () => {
    const qrCanvas = qrRef.current?.querySelector('canvas');
    if (!qrCanvas || !trackingUrl) return;
    try {
      const blob = await canvasToBlob(qrCanvas, 'image/png');
      downloadBlob(blob, `${safeFileName(campaign || 'utm-link', 'utm-link')}-qr.png`);
    } catch (err: unknown) {
      setTrackingError(err instanceof Error ? err.message : 'Could not export the QR code.');
    }
  };

  return (
    <ClientToolPage
      seo={{
        title: 'Social Media Batch Resizer + UTM & QR Builder | WaKit',
        description:
          'Resize up to 12 images for Instagram, Facebook, X, LinkedIn and WhatsApp at once, then build trackable UTM links and QR codes locally.',
        canonicalPath: '/social-batch-resizer',
        keywords:
          'social media image resizer, batch image resizer, instagram post size, facebook cover size, utm link builder, utm qr code generator',
      }}
      icon={SlidersHorizontal}
      eyebrow="8 presets • batch ZIP • UTM + QR"
      title={
        <>
          Batch <span className="text-gradient-emerald">resizer + UTM builder</span>
        </>
      }
      description="One image set for every platform, plus a clean tracking link for the campaign that sends people there."
      breadcrumbs={[{ name: 'Batch Resizer + UTM' }]}
      toolName="Batch Resizer + UTM Builder"
      currentPath="/social-batch-resizer"
      quickAnswer={{
        question: 'How can I resize images for every social platform at once?',
        answer:
          'Upload up to 12 images, select the Instagram, Facebook, X, LinkedIn or WhatsApp presets you need, choose cover or contain, and generate the batch. Download files individually or as a ZIP. A built-in UTM builder also creates trackable links and QR codes.',
        facts: [
          { label: 'Presets', value: '8 sizes' },
          { label: 'Batch', value: '12 images' },
          { label: 'Export', value: 'JPG / PNG' },
          { label: 'Uploads', value: '0' },
        ],
      }}
      steps={steps}
      intro="Reusing the same crop everywhere usually cuts off the headline or flattens the composition. Start with the largest source, then export platform-specific variants from one batch."
      faqs={faqs}
      securityHeading="Local image processing and a browser-built campaign link"
      securityText="WaKit reads your images with the File API and draws each preset on a local Canvas. The UTM URL is assembled with the browser URL API, and the QR code is rendered in the page. No image, destination URL or campaign parameter is uploaded or stored."
    >
      <div className="flex gap-1 rounded-2xl border border-slate-200 bg-white p-1 shadow-sm" role="tablist" aria-label="Batch resizer modes">
        <button type="button" role="tab" aria-selected={tab === 'resize'} onClick={() => setTab('resize')} className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold ${tab === 'resize' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
          <Image className="h-4 w-4" aria-hidden="true" /> Batch resize
        </button>
        <button type="button" role="tab" aria-selected={tab === 'tracking'} onClick={() => setTab('tracking')} className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold ${tab === 'tracking' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
          <Link2 className="h-4 w-4" aria-hidden="true" /> UTM + QR
        </button>
      </div>

      {tab === 'resize' ? (
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="glass-card space-y-5 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">1. Images and sizes</h2>
                <p className="mt-1 text-xs text-slate-600">Up to 12 images × 8 presets in one run.</p>
              </div>
              {sources.length > 0 && (
                <button type="button" onClick={clearSources} className="btn-secondary px-3 py-2 text-xs">
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Clear
                </button>
              )}
            </div>

            <UploadZone
              accept="image/png,image/jpeg,image/webp"
              multiple
              onFiles={addSources}
              icon={Image}
              title="Drop up to 12 images"
              hint="JPG, PNG or WebP · resized locally"
              files={sources.map((item) => item.file)}
              disabled={busy}
            />

            {sources.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>{sources.length} source images</span>
                  <span>{formatBytes(totalSourceBytes)}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                  {sources.map((item, index) => (
                    <div key={item.id} className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                      <img src={item.url} alt={`Source ${index + 1}`} className="h-full w-full object-cover" />
                      <button type="button" onClick={() => removeSource(item.id)} className="absolute right-1 top-1 rounded bg-slate-950/70 p-1 text-white hover:bg-red-600" aria-label={`Remove source image ${index + 1}`}>
                        <Trash2 className="h-3 w-3" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="field-label mb-0">Platform presets</span>
                <button type="button" onClick={() => setSelectedPresets(presets.map((preset) => preset.id))} className="text-[10px] font-bold text-emerald-700 hover:underline">Select all</button>
              </div>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {presets.map((preset) => {
                  const active = selectedPresets.includes(preset.id);
                  return (
                    <button key={preset.id} type="button" onClick={() => togglePreset(preset.id)} aria-pressed={active} className={`flex items-start gap-2 rounded-xl border p-2.5 text-left ${active ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                      <span className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border ${active ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300 text-transparent'}`}>
                        <Check className="h-3 w-3" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[11px] font-bold text-slate-800">{preset.label}</span>
                        <span className="block font-mono text-[9px] text-slate-500">{preset.width}×{preset.height} · {preset.platform}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <span className="field-label">Fit mode</span>
                <div className="grid grid-cols-2 gap-2">
                  {(['cover', 'contain'] as const).map((value) => (
                    <button key={value} type="button" onClick={() => setFit(value)} className={`rounded-xl border py-2 text-xs font-bold capitalize ${fit === value ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-600'}`}>{value}</button>
                  ))}
                </div>
                <p className="mt-1.5 text-[10px] leading-relaxed text-slate-500">{fit === 'cover' ? 'Fills the frame; may crop edges.' : 'Keeps everything; adds white space.'}</p>
              </div>
              <div>
                <span className="field-label">Output format</span>
                <div className="grid grid-cols-2 gap-2">
                  {(['image/jpeg', 'image/png'] as const).map((value) => (
                    <button key={value} type="button" onClick={() => setOutputFormat(value)} className={`rounded-xl border py-2 text-xs font-bold ${outputFormat === value ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-600'}`}>{value === 'image/jpeg' ? 'JPG' : 'PNG'}</button>
                  ))}
                </div>
              </div>
            </div>

            {outputFormat === 'image/jpeg' && (
              <div>
                <div className="flex items-center justify-between">
                  <span className="field-label mb-0">JPG quality</span>
                  <span className="font-mono text-xs font-bold text-emerald-700">{Math.round(quality * 100)}%</span>
                </div>
                <input type="range" min="0.65" max="0.98" step="0.01" value={quality} onChange={(event) => setQuality(Number(event.target.value))} className="mt-2 w-full accent-emerald-600" />
              </div>
            )}

            {resizeError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">{resizeError}</p>}

            <button
              type="button"
              onClick={resizeBatch}
              disabled={busy || sources.length === 0 || chosenPresets.length === 0}
              className="btn-primary w-full py-3"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />}
              {busy
                ? 'Resizing batch…'
                : outputCount > 0
                  ? `Generate ${outputCount} resized images`
                  : 'Select at least one size'}
            </button>
          </section>

          <section className="glass-card space-y-4 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">2. Resized bundle</h2>
                <p className="mt-1 text-xs text-slate-600">{results.length > 0 ? `${results.length} files ready in ${extension.toUpperCase()}` : 'Results appear here after the batch runs.'}</p>
              </div>
              {results.length > 0 && (
                <button type="button" onClick={downloadAll} className="btn-secondary px-3 py-2 text-xs">
                  <Package className="h-3.5 w-3.5" aria-hidden="true" /> ZIP
                </button>
              )}
            </div>

            {results.length === 0 ? (
              <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                <div>
                  <SlidersHorizontal className="mx-auto h-10 w-10 text-slate-300" aria-hidden="true" />
                  <p className="mt-3 text-sm font-semibold text-slate-600">No resized images yet</p>
                  <p className="mx-auto mt-1 max-w-xs text-xs text-slate-500">Add images, choose the sizes and generate the batch. Every output keeps its platform dimensions.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {results.map((item) => (
                    <a key={item.id} href={item.url} download={item.name} className="group overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-1.5">
                      <div className="grid h-28 place-items-center overflow-hidden rounded-lg bg-white">
                        <img src={item.url} alt={item.preset} className="max-h-full w-full object-contain" />
                      </div>
                      <span className="mt-1.5 block truncate px-0.5 text-[10px] font-bold text-slate-700">{item.preset}</span>
                      <span className="block px-0.5 font-mono text-[9px] text-slate-500">{item.width}×{item.height}</span>
                    </a>
                  ))}
                </div>
                <button type="button" onClick={downloadAll} className="btn-primary w-full py-3">
                  <Download className="h-4 w-4" aria-hidden="true" /> Download all (.zip)
                </button>
              </>
            )}
          </section>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="glass-card space-y-4 p-5 sm:p-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Campaign destination</h2>
              <p className="mt-1 text-xs text-slate-600">Use the final page URL, not a shortened redirect if you can avoid it.</p>
            </div>

            <div>
              <label htmlFor="utm-base" className="field-label">Destination URL</label>
              <input id="utm-base" value={baseUrl} onChange={(event) => setBaseUrl(event.target.value)} className="field" placeholder="https://yourstore.com/new-collection" inputMode="url" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="utm-source" className="field-label">Source <span className="font-normal text-slate-400">utm_source</span></label>
                <input id="utm-source" value={source} onChange={(event) => setSource(event.target.value)} className="field" placeholder="instagram" />
              </div>
              <div>
                <label htmlFor="utm-medium" className="field-label">Medium <span className="font-normal text-slate-400">utm_medium</span></label>
                <input id="utm-medium" value={medium} onChange={(event) => setMedium(event.target.value)} className="field" placeholder="social" />
              </div>
              <div>
                <label htmlFor="utm-campaign" className="field-label">Campaign <span className="font-normal text-slate-400">utm_campaign</span></label>
                <input id="utm-campaign" value={campaign} onChange={(event) => setCampaign(event.target.value)} className="field" placeholder="diwali-launch" />
              </div>
              <div>
                <label htmlFor="utm-term" className="field-label">Term <span className="font-normal text-slate-400">utm_term</span></label>
                <input id="utm-term" value={term} onChange={(event) => setTerm(event.target.value)} className="field" placeholder="optional" />
              </div>
            </div>

            <div>
              <label htmlFor="utm-content" className="field-label">Content <span className="font-normal text-slate-400">utm_content</span></label>
              <input id="utm-content" value={content} onChange={(event) => setContent(event.target.value)} className="field" placeholder="story-1 or blue-creative" />
            </div>

            {trackingError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">{trackingError}</p>}

            <button type="button" onClick={buildTrackingUrl} className="btn-primary w-full py-3">
              <Link2 className="h-4 w-4" aria-hidden="true" /> Build tracking URL
            </button>

            <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-[10px] leading-relaxed text-slate-500">
              Lowercase values and keep one naming convention across the team. Changing a campaign name later splits the analytics history.
            </p>
          </section>

          <section className="space-y-4">
            <div className="glass-card space-y-3 p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Trackable link</h2>
                  <p className="mt-0.5 text-[11px] text-slate-500">Built with the browser URL API.</p>
                </div>
                <Link2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
              </div>
              <p className="min-h-20 break-all rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-[10px] leading-relaxed text-slate-700">
                {trackingUrl || 'Your URL with UTM parameters will appear here.'}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                <button type="button" onClick={copyTrackingUrl} disabled={!trackingUrl} className="btn-secondary py-2.5 text-xs">
                  {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
                  {copied ? 'Copied' : 'Copy link'}
                </button>
                <button type="button" onClick={() => trackingUrl && downloadText(trackingUrl, 'wakit-utm-link.txt')} disabled={!trackingUrl} className="btn-secondary py-2.5 text-xs">
                  <Download className="h-3.5 w-3.5" aria-hidden="true" /> Link .txt
                </button>
              </div>
            </div>

            <div className="glass-card space-y-3 p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Campaign QR</h2>
                  <p className="mt-0.5 text-[11px] text-slate-500">Scan opens the exact tracking URL.</p>
                </div>
                <QrCode className="h-4 w-4 text-emerald-600" aria-hidden="true" />
              </div>
              <div ref={qrRef} className="grid min-h-48 place-items-center rounded-xl border border-slate-200 bg-slate-50 p-4">
                {trackingUrl ? (
                  <QRCodeCanvas value={trackingUrl} size={168} fgColor="#065f46" bgColor="#ffffff" level="M" />
                ) : (
                  <p className="max-w-[13rem] text-center text-[11px] leading-relaxed text-slate-500">Build a tracking URL to generate a downloadable QR code.</p>
                )}
              </div>
              <button type="button" onClick={downloadQr} disabled={!trackingUrl} className="btn-primary w-full py-2.5 text-xs">
                <Download className="h-3.5 w-3.5" aria-hidden="true" /> Download QR PNG
              </button>
            </div>
          </section>
        </div>
      )}
    </ClientToolPage>
  );
};
