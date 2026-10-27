import React, { useState } from 'react';
import {
  Download,
  FileArchive,
  FileText,
  Film,
  Images,
  Loader2,
  Package,
} from 'lucide-react';
import { ClientToolPage } from '../components/ClientToolPage';
import { UploadZone } from '../components/UploadZone';
import type { FAQItem, HowToStep } from '../components/SEOHead';
import { useFFmpeg, type CompressionResult } from '../hooks/useFFmpeg';
import { useObjectUrls } from '../hooks/useObjectUrls';
import { formatBytes, zipAndDownload } from '../lib/clientFiles';

type Tab = 'images' | 'video' | 'docs';

interface ImageResult {
  name: string;
  blob: Blob;
  url: string;
  before: number;
  after: number;
}

interface DocResult {
  name: string;
  blob: Blob;
  url: string;
  before: number;
  after: number;
}

const faqs: FAQItem[] = [
  {
    question: 'How do I compress photos and videos for WhatsApp?',
    answer:
      'Choose Photos, Video or Documents, add your files, and set the target size or resolution. WaKit compresses images with Canvas, videos with FFmpeg WebAssembly, and PDF/DOCX files with pdf-lib or JSZip. Everything runs in your browser.',
  },
  {
    question: 'What is WhatsApp’s actual file size limit?',
    answer:
      'WhatsApp currently caps most chat attachments at 16 MB. Photos are often recompressed by WhatsApp itself, but sending a smaller original gives you more control over quality and upload speed. The 16 MB target is a useful guideline, not a guarantee for every account or platform.',
  },
  {
    question: 'Can this tool compress PDF and DOCX documents?',
    answer:
      'PDF files are re-saved with object streams and fresh metadata, which can reduce size for some documents. DOCX files are re-zipped with maximum Deflate compression. Results vary: a PDF that is already optimized or mostly images may not shrink much.',
  },
  {
    question: 'Why is video limited to 150 MB?',
    answer:
      'FFmpeg WebAssembly needs working memory in your browser. A 150 MB source is the safe desktop ceiling in this build (60 MB on mobile). Larger videos may fail depending on available RAM. Keep the tab open while the worker processes the file.',
  },
  {
    question: 'Do my files get uploaded?',
    answer:
      'No. Image and document work happens in the page; video processing happens in a local Web Worker using FFmpeg compiled to WebAssembly. The FFmpeg engine is downloaded once, but your media is never sent to a WaKit server.',
  },
];

const steps: [HowToStep, HowToStep, HowToStep] = [
  {
    name: 'Choose a media type',
    text: 'Pick photos for batch resizing, video for FFmpeg compression, or documents for local PDF/DOCX optimization.',
  },
  {
    name: 'Set the target',
    text: 'Choose image dimensions and quality, a video resolution, or add multiple PDF/DOCX files for lossless re-packing.',
  },
  {
    name: 'Download the results',
    text: 'Preview the before/after sizes and download individual files or a single ZIP archive for WhatsApp sharing.',
  },
];

const imageAccept = 'image/png,image/jpeg,image/webp,image/avif,image/bmp';

export const WhatsAppMediaCompressorPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>('images');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageResults, setImageResults] = useState<ImageResult[]>([]);
  const [imageQuality, setImageQuality] = useState(0.76);
  const [imageMax, setImageMax] = useState(1600);
  const [imageFormat, setImageFormat] = useState<'image/jpeg' | 'image/webp'>('image/jpeg');
  const [imageBusy, setImageBusy] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoHeight, setVideoHeight] = useState<480 | 720 | 1080>(720);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [videoResult, setVideoResult] = useState<CompressionResult | null>(null);

  const [docFiles, setDocFiles] = useState<File[]>([]);
  const [docResults, setDocResults] = useState<DocResult[]>([]);
  const [docBusy, setDocBusy] = useState(false);
  const [docError, setDocError] = useState<string | null>(null);

  const { create } = useObjectUrls();
  const { compressVideo, progress, statusText, isProcessing, revokeBlobUrl, capabilities } = useFFmpeg();

  const revokeImageResults = (results: ImageResult[]) => {
    results.forEach((result) => URL.revokeObjectURL(result.url));
  };

  const revokeDocResults = (results: DocResult[]) => {
    results.forEach((result) => URL.revokeObjectURL(result.url));
  };

  const compressImages = async () => {
    if (imageFiles.length === 0) {
      setImageError('Add at least one photo first.');
      return;
    }
    setImageBusy(true);
    setImageError(null);
    revokeImageResults(imageResults);
    const next: ImageResult[] = [];

    try {
      for (const file of imageFiles) {
        const { loadImage, createCanvas } = await import('../lib/clientFiles');
        const image = await loadImage(file);
        const scale = Math.min(1, imageMax / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = createCanvas(image.naturalWidth * scale, image.naturalHeight * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas is not available in this browser.');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (value) => (value ? resolve(value) : reject(new Error('Image compression failed.'))),
            imageFormat,
            imageQuality,
          );
        });
        const extension = imageFormat === 'image/webp' ? 'webp' : 'jpg';
        const base = file.name.replace(/\.[^/.]+$/, '');
        next.push({
          name: `${base}-wakit.${extension}`,
          blob,
          url: create(blob),
          before: file.size,
          after: blob.size,
        });
      }
      setImageResults(next);
    } catch (err: unknown) {
      next.forEach((result) => URL.revokeObjectURL(result.url));
      setImageError(err instanceof Error ? err.message : 'Could not compress the images.');
    } finally {
      setImageBusy(false);
    }
  };

  const compressVideoFile = async () => {
    if (!videoFile) {
      setVideoError('Add a video first.');
      return;
    }
    setVideoError(null);
    try {
      const result = await compressVideo(videoFile, videoHeight, videoHeight === 480 ? 30 : 28);
      if (videoResult) revokeBlobUrl(videoResult.url);
      setVideoResult(result);
    } catch (err: unknown) {
      setVideoError(err instanceof Error ? err.message : 'Video compression failed.');
    }
  };

  const compressDocuments = async () => {
    if (docFiles.length === 0) {
      setDocError('Add at least one PDF or DOCX file first.');
      return;
    }
    setDocBusy(true);
    setDocError(null);
    revokeDocResults(docResults);
    const next: DocResult[] = [];

    try {
      for (const file of docFiles) {
        const buffer = await file.arrayBuffer();
        const isPdf = /\.pdf$/i.test(file.name) || file.type === 'application/pdf';
        const isDocx =
          /\.docx$/i.test(file.name) ||
          file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        let blob: Blob;
        if (isPdf) {
          const { PDFDocument } = await import('pdf-lib');
          const document = await PDFDocument.load(buffer, { updateMetadata: false });
          document.setCreator('WaKit local PDF optimizer');
          document.setProducer('WaKit');
          const bytes = await document.save({ useObjectStreams: true });
          blob = new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' });
        } else if (isDocx) {
          const JSZip = (await import('jszip')).default;
          const zip = await JSZip.loadAsync(buffer);
          blob = await zip.generateAsync({
            type: 'blob',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            compression: 'DEFLATE',
            compressionOptions: { level: 9 },
          });
        } else {
          throw new Error(`${file.name} is not a PDF or DOCX file.`);
        }
        next.push({
          name: `${file.name.replace(/\.[^/.]+$/, '')}-wakit.${isPdf ? 'pdf' : 'docx'}`,
          blob,
          url: create(blob),
          before: file.size,
          after: blob.size,
        });
      }
      setDocResults(next);
    } catch (err: unknown) {
      next.forEach((result) => URL.revokeObjectURL(result.url));
      setDocError(err instanceof Error ? err.message : 'Could not optimize the documents.');
    } finally {
      setDocBusy(false);
    }
  };

  const downloadImageZip = async () => {
    try {
      await zipAndDownload(imageResults.map((result) => ({ name: result.name, blob: result.blob })), 'wakit-compressed-photos.zip', 'compressed photos');
    } catch (err: unknown) {
      setImageError(err instanceof Error ? err.message : 'Could not create the ZIP.');
    }
  };

  const downloadDocZip = async () => {
    try {
      await zipAndDownload(docResults.map((result) => ({ name: result.name, blob: result.blob })), 'wakit-optimized-documents.zip', 'optimized documents');
    } catch (err: unknown) {
      setDocError(err instanceof Error ? err.message : 'Could not create the ZIP.');
    }
  };

  return (
    <ClientToolPage
      seo={{
        title: 'WhatsApp Photo, Video & Document Compressor | WaKit',
        description:
          'Compress photos in batches, shrink videos with FFmpeg WASM, and optimize PDF/DOCX files for WhatsApp — all locally with no uploads.',
        canonicalPath: '/whatsapp-media-compressor',
        keywords:
          'whatsapp video compressor, compress photos for whatsapp, reduce pdf size for whatsapp, batch image compressor, whatsapp document compressor',
      }}
      icon={Images}
      eyebrow="Photos · Video · Documents"
      title={
        <>
          WhatsApp <span className="text-gradient-emerald">media compressor</span>
        </>
      }
      description="A single private workbench for photos, short videos and documents that need to fit comfortably inside a WhatsApp chat."
      breadcrumbs={[{ name: 'Media Compressor' }]}
      toolName="WhatsApp Media Compressor"
      currentPath="/whatsapp-media-compressor"
      quickAnswer={{
        question: 'How can I compress files for WhatsApp without uploading them?',
        answer:
          'Choose a media type, add your files, and set a target. Photos are resized with Canvas, videos are transcoded by FFmpeg WebAssembly in a worker, and PDF/DOCX files are re-packed locally. Download individual outputs or one ZIP.',
        facts: [
          { label: 'Photos', value: 'Batch' },
          { label: 'Video', value: '≤150 MB' },
          { label: 'Docs', value: 'PDF + DOCX' },
          { label: 'Uploads', value: '0' },
        ],
      }}
      steps={steps}
      intro="WhatsApp’s 16 MB attachment ceiling is the practical target. Compression is always a quality trade-off, so compare the before/after size and preview each output before sending."
      faqs={faqs}
      securityHeading="Media processing happens in your browser, not on a converter server"
      securityText="Images are decoded and resized on a local Canvas. Documents are parsed with pdf-lib or JSZip in the page. Video runs inside a dedicated Web Worker with FFmpeg compiled to WebAssembly. Your files are never uploaded; only the FFmpeg engine itself is fetched from a public CDN."
    >
      <section className="glass-card overflow-hidden">
        <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50 p-2">
          {[
            { id: 'images' as const, label: 'Photos', icon: Images },
            { id: 'video' as const, label: 'Video', icon: Film },
            { id: 'docs' as const, label: 'Documents', icon: FileText },
          ].map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold transition-colors ${
                  active ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-200' : 'text-slate-600 hover:bg-white/60'
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </button>
            );
          })}
        </div>

        {tab === 'images' && (
          <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_1fr]">
            <div className="space-y-4">
              <UploadZone
                accept={imageAccept}
                multiple
                onFiles={(files) => {
                  const nextFiles = files.slice(0, 30);
                  setImageFiles(nextFiles);
                  setImageError(files.length > 30 ? 'Only the first 30 photos are included in one batch.' : null);
                  revokeImageResults(imageResults);
                  setImageResults([]);
                }}
                icon={Images}
                title="Drop WhatsApp photos or browse"
                hint="Up to 30 images · JPG, PNG, WebP, AVIF or BMP"
                files={imageFiles}
                disabled={imageBusy}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="image-max" className="field-label">Maximum dimension</label>
                  <select id="image-max" value={imageMax} onChange={(e) => setImageMax(Number(e.target.value))} className="field">
                    <option value={1080}>1080 px</option>
                    <option value={1600}>1600 px</option>
                    <option value={2048}>2048 px</option>
                    <option value={2560}>2560 px</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="image-format" className="field-label">Output format</label>
                  <select id="image-format" value={imageFormat} onChange={(e) => setImageFormat(e.target.value as 'image/jpeg' | 'image/webp')} className="field">
                    <option value="image/jpeg">JPG · universal</option>
                    <option value="image/webp">WebP · smaller</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="field-label mb-0">Quality</span>
                  <span className="font-mono text-xs font-bold text-emerald-700">{Math.round(imageQuality * 100)}%</span>
                </div>
                <input type="range" min="0.4" max="0.95" step="0.01" value={imageQuality} onChange={(e) => setImageQuality(Number(e.target.value))} className="mt-2 w-full accent-emerald-600" />
              </div>

              {imageError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">{imageError}</p>}

              <button type="button" onClick={compressImages} disabled={imageBusy || imageFiles.length === 0} className="btn-primary w-full py-3">
                {imageBusy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Images className="h-4 w-4" aria-hidden="true" />}
                {imageBusy ? 'Compressing…' : `Compress ${imageFiles.length || ''} photos`}
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-bold text-slate-900">Compressed photos</h2>
                {imageResults.length > 0 && (
                  <button type="button" onClick={downloadImageZip} className="btn-secondary px-3 py-2 text-xs">
                    <Package className="h-3.5 w-3.5" aria-hidden="true" />
                    ZIP
                  </button>
                )}
              </div>
              {imageResults.length === 0 ? (
                <div className="grid min-h-52 place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                  <p className="text-xs text-slate-500">Compressed photos will appear here with before/after sizes.</p>
                </div>
              ) : (
                <div className="max-h-[28rem] space-y-2 overflow-y-auto pr-1">
                  {imageResults.map((result) => (
                    <div key={result.name} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-2.5">
                      <img src={result.url} alt="" className="h-12 w-12 rounded-lg object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-slate-800">{result.name}</p>
                        <p className="mt-0.5 font-mono text-[10px] text-slate-500">
                          {formatBytes(result.before)} → <span className="font-bold text-emerald-700">{formatBytes(result.after)}</span>
                        </p>
                      </div>
                      <a href={result.url} download={result.name} className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-emerald-700" aria-label={`Download ${result.name}`}>
                        <Download className="h-4 w-4" aria-hidden="true" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'video' && (
          <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_1fr]">
            <div className="space-y-4">
              <UploadZone
                accept="video/mp4,video/quicktime,video/webm"
                onFiles={(files) => {
                  if (videoResult) revokeBlobUrl(videoResult.url);
                  setVideoResult(null);
                  setVideoFile(files[0] ?? null);
                  setVideoError(null);
                }}
                icon={Film}
                title="Drop a short video"
                hint={`MP4, MOV or WebM · up to ${capabilities.maxFileSizeMB} MB on this device`}
                files={videoFile ? [videoFile] : []}
                disabled={isProcessing}
              />

              <div>
                <span className="field-label">Target resolution</span>
                <div className="grid grid-cols-3 gap-2">
                  {([480, 720, 1080] as const).map((height) => (
                    <button key={height} type="button" onClick={() => setVideoHeight(height)} className={`rounded-xl border py-2 text-xs font-bold ${videoHeight === height ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-600'}`}>
                      {height}p
                    </button>
                  ))}
                </div>
              </div>

              <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-800">
                Video compression downloads FFmpeg once and can take a minute. Longer videos may exceed browser memory; start with a clip under 60 seconds.
              </p>

              {isProcessing && (
                <div className="space-y-2" role="status" aria-live="polite">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                    <span>{statusText || 'Compressing video…'}</span>
                    <span className="font-mono text-emerald-700">{progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-emerald-500 transition-[width]" style={{ width: `${Math.max(2, progress)}%` }} />
                  </div>
                </div>
              )}

              {videoError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">{videoError}</p>}

              <button type="button" onClick={compressVideoFile} disabled={!videoFile || isProcessing} className="btn-primary w-full py-3">
                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Film className="h-4 w-4" aria-hidden="true" />}
                {isProcessing ? 'Compressing video…' : `Compress to ${videoHeight}p`}
              </button>
            </div>

            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-900">Video result</h2>
              <VideoResultCard result={videoResult} />
            </div>
          </div>
        )}

        {tab === 'docs' && (
          <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_1fr]">
            <div className="space-y-4">
              <UploadZone
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                multiple
                onFiles={(files) => {
                  const nextFiles = files.slice(0, 10);
                  setDocFiles(nextFiles);
                  setDocError(files.length > 10 ? 'Only the first 10 documents are included in one batch.' : null);
                  revokeDocResults(docResults);
                  setDocResults([]);
                }}
                icon={FileArchive}
                title="Drop PDF or DOCX files"
                hint="Up to 10 documents · re-packed locally"
                files={docFiles}
                disabled={docBusy}
              />

              <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-[11px] leading-relaxed text-emerald-800">
                PDFs are re-saved with object streams and fresh metadata. DOCX files are re-zipped with maximum Deflate compression. Already-optimized files may change only slightly.
              </p>

              {docError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">{docError}</p>}

              <button type="button" onClick={compressDocuments} disabled={docBusy || docFiles.length === 0} className="btn-primary w-full py-3">
                {docBusy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <FileText className="h-4 w-4" aria-hidden="true" />}
                {docBusy ? 'Optimizing…' : `Optimize ${docFiles.length || ''} documents`}
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-bold text-slate-900">Optimized documents</h2>
                {docResults.length > 0 && (
                  <button type="button" onClick={downloadDocZip} className="btn-secondary px-3 py-2 text-xs">
                    <Package className="h-3.5 w-3.5" aria-hidden="true" />
                    ZIP
                  </button>
                )}
              </div>
              {docResults.length === 0 ? (
                <div className="grid min-h-52 place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                  <p className="text-xs text-slate-500">Optimized PDF/DOCX files will appear here.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {docResults.map((result) => (
                    <div key={result.name} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
                      <FileText className="h-8 w-8 shrink-0 text-emerald-600" aria-hidden="true" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-slate-800">{result.name}</p>
                        <p className="mt-0.5 font-mono text-[10px] text-slate-500">
                          {formatBytes(result.before)} → <span className="font-bold text-emerald-700">{formatBytes(result.after)}</span>
                        </p>
                      </div>
                      <a href={result.url} download={result.name} className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-emerald-700" aria-label={`Download ${result.name}`}>
                        <Download className="h-4 w-4" aria-hidden="true" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </ClientToolPage>
  );
};

const VideoResultCard: React.FC<{ result: CompressionResult | null }> = ({ result }) => {
  if (!result) {
    return (
      <div className="grid min-h-52 place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        <div>
          <Film className="mx-auto h-10 w-10 text-slate-300" aria-hidden="true" />
          <p className="mt-3 text-sm font-semibold text-slate-600">No compressed video yet</p>
          <p className="mt-1 max-w-xs text-xs text-slate-500">Add a short video and choose 480p, 720p or 1080p. The output MP4 will be ready to download here.</p>
        </div>
      </div>
    );
  }

  const saved = result.originalSize > 0 ? Math.max(0, Math.round((1 - result.size / result.originalSize) * 100)) : 0;

  return (
    <div className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-3">
      <video src={result.url} controls playsInline className="w-full rounded-xl bg-black" />
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-slate-800">{result.filename}</p>
          <p className="mt-0.5 font-mono text-[10px] text-slate-500">
            {formatBytes(result.originalSize)} → <span className="font-bold text-emerald-700">{formatBytes(result.size)}</span>
            {saved > 0 ? ` · ${saved}% smaller` : ''}
          </p>
        </div>
        <a href={result.url} download={result.filename} className="btn-primary shrink-0 px-3 py-2 text-xs">
          <Download className="h-3.5 w-3.5" aria-hidden="true" />
          Download
        </a>
      </div>
    </div>
  );
};
