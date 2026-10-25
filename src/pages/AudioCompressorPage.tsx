import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useFFmpeg, type CompressionResult } from '../hooks/useFFmpeg';
import { checkBrowserCapabilities } from '../utils/browserCapabilities';
import { COOPCheckBanner } from '../components/COOPCheckBanner';
import { AdBanner } from '../components/AdBanner';
import { SEOHead, type FAQItem } from '../components/SEOHead';
import { ToolSeoContent } from '../components/ToolSeoContent';
import { FAQAccordion } from '../components/FAQAccordion';
import { PageHeader } from '../components/PageHeader';
import { QuickAnswer } from '../components/QuickAnswer';
import { RelatedTools } from '../components/RelatedTools';
import {
  Mic,
  UploadCloud,
  Download,
  FileAudio,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Sliders,
  TrendingDown,
  ShieldAlert,
  Zap,
  Wifi,
  HardDrive,
} from 'lucide-react';

const audioCompressorFaqs: FAQItem[] = [
  {
    question: 'How do I compress heavy audio recordings for WhatsApp online?',
    answer: 'Drag and drop your MP3, WAV, M4A, or AAC file into the audio dropzone above, select a target bitrate (64 kbps is recommended for voice notes), choose MP3 or OPUS/OGG, and click "Compress & Transcode Audio".',
  },
  {
    question: 'Which bitrate is best for WhatsApp voice notes?',
    answer: '64 kbps is the gold standard for voice notes. It shrinks file size by up to 70% while maintaining clear vocal frequency response.',
  },
  {
    question: 'What is the maximum file size limit for WhatsApp voice notes?',
    answer: 'WhatsApp limits media attachments to 16MB. Compressing audio files to 64 kbps ensures large lectures or long voice recordings stay well below this limit.',
  },
  {
    question: 'What is the maximum audio file size WaKit can compress?',
    answer: 'The hard input limit is 3 GB. Large files are mounted directly from disk in FFmpeg\'s virtual filesystem instead of being copied into RAM first. Processing time and success still depend on your browser\'s available memory; for the smoothest experience on mobile, keep source files under 150 MB.',
  },
  {
    question: 'Does WaKit upload my audio recordings to a remote server?',
    answer: 'No! Transcoding occurs 100% locally inside your web browser using FFmpeg WebAssembly. Your audio files never leave your device.',
  },
  {
    question: 'What is the difference between MP3 and OPUS formats?',
    answer: 'OPUS (OGG) is WhatsApp\'s native voice note codec, offering superior quality at lower bitrates. MP3 provides universal playback compatibility across all devices and media players.',
  },
];

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const AudioCompressorPage: React.FC = () => {
  const { progress, statusText, compressAudio, revokeBlobUrl, isProcessing } = useFFmpeg();
  const cap = checkBrowserCapabilities();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalAudioUrl, setOriginalAudioUrl] = useState<string | null>(null);
  const [bitrate, setBitrate] = useState<'64k' | '96k' | '128k'>('64k');
  const [format, setFormat] = useState<'mp3' | 'opus'>('mp3');
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (originalAudioUrl) URL.revokeObjectURL(originalAudioUrl);
      if (result) revokeBlobUrl(result.url);
    };
  }, [originalAudioUrl, result, revokeBlobUrl]);

  const handleFileSelect = useCallback((file: File) => {
    setFileError(null);

    if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|wav|m4a|aac|ogg|flac)$/i)) {
      setFileError('Please select a valid audio file (MP3, WAV, M4A, AAC, OGG).');
      return;
    }

    const maxBytes = cap.maxAudioFileSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setFileError(
        `Audio size (${formatFileSize(file.size)}) exceeds the 3 GB maximum.`
      );
      return;
    }

    if (originalAudioUrl) {
      URL.revokeObjectURL(originalAudioUrl);
    }
    if (result) {
      revokeBlobUrl(result.url);
      setResult(null);
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setOriginalAudioUrl(url);
  }, [originalAudioUrl, result, revokeBlobUrl, cap]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleCompress = async () => {
    if (!selectedFile || !cap.isFullySupported) return;

    setFileError(null);

    try {
      const res = await compressAudio(selectedFile, bitrate, format);
      setResult(res);
    } catch (err: unknown) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : 'Compression error';
      setFileError(`Audio compression failed: ${errMsg}`);
    }
  };

  const resetAll = () => {
    if (originalAudioUrl) URL.revokeObjectURL(originalAudioUrl);
    if (result) revokeBlobUrl(result.url);
    setSelectedFile(null);
    setOriginalAudioUrl(null);
    setResult(null);
    setFileError(null);
  };

  const calculateReductionPct = () => {
    if (!result || !selectedFile) return 0;
    const diff = selectedFile.size - result.size;
    const pct = (diff / selectedFile.size) * 100;
    return Math.round(pct);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <SEOHead
        title="Compress Audio for WhatsApp (Up to 3GB) | WaKit"
        description="Compress MP3, WAV and M4A files up to 3GB under WhatsApp's 16MB limit. The 64 kbps voice mode shrinks audio locally in your browser, with no uploads or signup."
        canonicalPath="/whatsapp-audio-compressor"
        keywords="compress audio for whatsapp 16mb, compress 3gb audio, reduce voice note size, mp3 to 64kbps online, whatsapp audio compressor"
        faqs={audioCompressorFaqs}
        breadcrumbs={[{ name: 'Audio Compressor' }]}
        appCategory="MultimediaApplication"
        howToName="How to compress audio for WhatsApp"
        howToSteps={[
          { name: 'Drop in your audio', text: 'Upload any MP3, WAV, M4A, AAC, or OGG file up to 3GB. The file is mounted read-only from disk and never uploaded.' },
          { name: 'Pick bitrate and format', text: 'Choose 64k for voice notes, 96k for balanced quality, or 128k for music, in MP3 or WhatsApp-native OPUS/OGG.' },
          { name: 'Compress and download', text: 'Transcode locally with FFmpeg WebAssembly and download the smaller file, ready to send under the 16MB cap.' },
        ]}
      />

      <PageHeader
        icon={Mic}
        eyebrow="Voice note & audio transcoder"
        title="Compress Audio for WhatsApp"
        description="Reduce heavy audio files up to 3 GB for instant WhatsApp sharing while keeping vocals clear. Everything runs in a background Web Worker on your device."
        breadcrumbs={[{ name: 'Audio Compressor' }]}
      />

      <QuickAnswer
        question="How can I compress audio for WhatsApp without uploading it?"
        answer="Drop an MP3, WAV, M4A, AAC or OGG file up to 3 GB, pick 64 kbps for voice notes (or 96/128 kbps for music), choose MP3 or OPUS, and compress. FFmpeg WebAssembly transcodes the file inside your browser, so nothing is uploaded and you can download it under WhatsApp's 16 MB limit."
        facts={[
          { label: 'WhatsApp limit', value: '16 MB' },
          { label: 'Max input', value: '3 GB' },
          { label: 'Best for voice', value: '64 kbps' },
          { label: 'Uploads', value: '0 bytes' },
        ]}
      />

      <COOPCheckBanner maxLabel="Audio input up to 3 GB" />

      {/* Main compressor card */}
      <div className="glass-card space-y-6 p-5 sm:p-8">
        {!selectedFile ? (
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200 sm:p-12 ${
              dragActive
                ? 'scale-[1.01] border-emerald-500 bg-emerald-50'
                : 'border-slate-300 bg-slate-50/70 hover:border-emerald-400 hover:bg-emerald-50/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.flac"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
            />
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-200">
              <UploadCloud className="h-8 w-8" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-bold text-slate-900">
                Drop an audio recording here, or{' '}
                <span className="text-emerald-700 underline decoration-emerald-300 underline-offset-2">browse</span>
              </h2>
              <p className="text-xs text-slate-600">
                MP3, WAV, M4A, AAC, OGG • up to {formatFileSize(cap.maxAudioFileSizeMB * 1024 * 1024)} • processed locally
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
                  <FileAudio className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-bold text-slate-900">{selectedFile.name}</h2>
                  <p className="mt-0.5 font-mono text-xs text-slate-600">
                    Original size: {formatFileSize(selectedFile.size)}
                  </p>
                  {selectedFile.size > 512 * 1024 * 1024 && (
                    <p className="mt-1 text-[11px] font-medium leading-relaxed text-amber-700">
                      Large file: 3 GB is the hard cap. Processing can take a while and needs enough free browser memory — keep this tab open.
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={resetAll}
                disabled={isProcessing}
                className="flex items-center gap-1.5 self-end rounded-xl px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 sm:self-center"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Remove</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Sliders className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                  <span>Target bitrate</span>
                </span>
                <div className="grid grid-cols-3 gap-1.5" role="group" aria-label="Target bitrate">
                  {(['64k', '96k', '128k'] as const).map((b) => {
                    const active = bitrate === b;
                    return (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBitrate(b)}
                        aria-pressed={active}
                        className={`rounded-lg px-2 py-2 text-xs font-semibold transition-all ${
                          active
                            ? 'bg-emerald-700 text-white shadow-sm'
                            : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-900'
                        }`}
                      >
                        {b} {b === '64k' ? '(Voice)' : ''}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <FileAudio className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                  <span>Output format</span>
                </span>
                <div className="grid grid-cols-2 gap-1.5" role="group" aria-label="Output format">
                  {(['mp3', 'opus'] as const).map((fmt) => {
                    const active = format === fmt;
                    return (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => setFormat(fmt)}
                        aria-pressed={active}
                        className={`rounded-lg px-2 py-2 text-xs font-semibold uppercase transition-all ${
                          active
                            ? 'bg-emerald-700 text-white shadow-sm'
                            : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-900'
                        }`}
                      >
                        {fmt === 'mp3' ? 'MP3 Audio' : 'OPUS / OGG'}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {!cap.isFullySupported && (
              <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
                <ShieldAlert className="h-5 w-5 shrink-0 text-red-500" aria-hidden="true" />
                <span>
                  Your browser does not support high-speed WebAssembly. Please open this link in Google Chrome, Edge, or Safari.
                </span>
              </div>
            )}

            {!result && (
              <button
                type="button"
                onClick={handleCompress}
                disabled={isProcessing || !cap.isFullySupported}
                className="btn-primary w-full py-3.5 text-base"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                    <span>Compressing in worker ({progress}%)…</span>
                  </>
                ) : (
                  <>
                    <Mic className="h-5 w-5" aria-hidden="true" />
                    <span>Compress &amp; transcode audio</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {fileError && (
          <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{fileError}</span>
          </div>
        )}

        {isProcessing && (
          <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3 text-xs font-semibold">
              <span className="flex items-center gap-2 text-slate-700">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-600" aria-hidden="true" />
                <span className="truncate">{statusText || 'Compressing in the background worker…'}</span>
              </span>
              <span className="shrink-0 font-mono text-emerald-700">{progress}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-6 border-t border-slate-200 pt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                <span>Audio compression finished</span>
              </h2>
              <div className="flex w-fit items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{calculateReductionPct()}% smaller</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3 text-xs font-bold">
                  <span className="text-slate-700">Original audio</span>
                  <span className="font-mono text-slate-600">{formatFileSize(result.originalSize)}</span>
                </div>
                {originalAudioUrl && (
                  <audio src={originalAudioUrl} controls className="w-full rounded-lg" />
                )}
              </div>

              <div className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-center justify-between gap-3 text-xs font-bold">
                  <span className="text-emerald-800">Compressed ({bitrate})</span>
                  <span className="font-mono font-extrabold text-emerald-700">
                    {formatFileSize(result.size)}
                  </span>
                </div>
                <audio src={result.url} controls className="w-full rounded-lg" />
              </div>
            </div>

            <a
              href={result.url}
              download={result.filename}
              className="btn-primary w-full py-3.5"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>Download compressed audio</span>
            </a>
          </div>
        )}
      </div>

      {/* Tips */}
      <section className="my-10 space-y-6" aria-labelledby="audio-tips-heading">
        <h2 id="audio-tips-heading" className="text-center text-xl font-bold text-slate-900">
          Audio bandwidth &amp; voice note tips
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="glass-card space-y-3 p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
              <Zap className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-base font-bold text-slate-900">64 kbps voice codec</h3>
            <p className="text-xs leading-relaxed text-slate-600">
              64 kbps provides ideal compression for speech and podcasts, reducing file size by up to 70% without voice distortion.
            </p>
          </div>

          <div className="glass-card space-y-3 p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
              <Wifi className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Save mobile data</h3>
            <p className="text-xs leading-relaxed text-slate-600">
              Compress heavy voice notes before sending on 3G/4G networks in regions with limited cellular data bundles.
            </p>
          </div>

          <div className="glass-card space-y-3 p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
              <HardDrive className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Bypass the 16MB limit</h3>
            <p className="text-xs leading-relaxed text-slate-600">
              Source recordings up to 3GB are supported. Compressing to MP3/OPUS keeps the final file small enough for WhatsApp&apos;s 16MB attachment cap.
            </p>
          </div>
        </div>
      </section>

      <ToolSeoContent
        toolName="Audio Compressor for WhatsApp"
        intro="Shrink lectures, podcasts, and voice notes up to 3GB under WhatsApp's strict 16MB attachment cap — transcoded privately on your device in three steps."
        steps={[
          { name: 'Drop In Your Audio', text: 'Upload MP3, WAV, M4A, AAC, or OGG up to 3GB. Files are read locally from disk and are never sent to any server.' },
          { name: 'Pick Bitrate & Format', text: 'Choose 64k for speech, 96k for balanced audio, or 128k for music — in universal MP3 or native OPUS/OGG.' },
          { name: 'Compress & Send', text: 'Transcode with FFmpeg WebAssembly, compare before/after, and download the file ready for instant WhatsApp sharing.' },
        ]}
      />

      <RelatedTools currentPath="/whatsapp-audio-compressor" />

      <FAQAccordion items={audioCompressorFaqs} title="WhatsApp Audio Compressor FAQ" />

      <AdBanner type="leaderboard" />
    </div>
  );
};
