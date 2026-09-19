import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useFFmpeg, type CompressionResult } from '../hooks/useFFmpeg';
import { checkBrowserCapabilities } from '../utils/browserCapabilities';
import { COOPCheckBanner } from '../components/COOPCheckBanner';
import { AdBanner } from '../components/AdBanner';
import { SEOHead, type FAQItem } from '../components/SEOHead';
import { FAQAccordion } from '../components/FAQAccordion';
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
  HardDrive
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
    question: 'Does WaKit upload my audio recordings to a remote server?',
    answer: 'No! Transcoding occurs 100% locally inside your web browser using FFmpeg WebAssembly. Your audio files never leave your device.',
  },
  {
    question: 'What is the difference between MP3 and OPUS formats?',
    answer: 'OPUS (OGG) is WhatsApp\'s native voice note codec, offering superior quality at lower bitrates. MP3 provides universal playback compatibility across all devices and media players.',
  },
];

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

    const maxBytes = cap.maxFileSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      const fileMB = (file.size / (1024 * 1024)).toFixed(1);
      const limitType = cap.isMobile ? 'mobile' : 'desktop';
      setFileError(`Audio size (${fileMB}MB) exceeds maximum ${limitType} limit of ${cap.maxFileSizeMB}MB.`);
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const calculateReductionPct = () => {
    if (!result || !selectedFile) return 0;
    const diff = selectedFile.size - result.size;
    const pct = (diff / selectedFile.size) * 100;
    return Math.round(pct);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <SEOHead
        title="Compress Audio for WhatsApp | Reduce Voice Note Size Online - WaKit"
        description="Compress heavy MP3, WAV, M4A audio files to WhatsApp voice note sizes online. Choose 64k, 96k, or 128k bitrates with 100% browser-based WebAssembly."
        canonicalUrl="https://wakit.app/#/compress-audio-for-whatsapp"
        faqs={audioCompressorFaqs}
      />

      {/* Title Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
          <Mic className="w-3.5 h-3.5" />
          <span>Voice Note & Audio Transcoder • Up to 70% Size Savings</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Compress Audio for WhatsApp
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
          Reduce heavy audio file size for instant WhatsApp sharing while retaining vocal clarity. Executed in a background Web Worker.
        </p>
      </div>

      <COOPCheckBanner />

      {/* Main Container */}
      <div className="glass-card p-6 sm:p-8 space-y-6">
        {!selectedFile ? (
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-4 ${
              dragActive
                ? 'border-emerald-500 bg-emerald-500/10 scale-[1.01]'
                : 'border-slate-300 dark:border-slate-700 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 bg-slate-50/50 dark:bg-slate-900/50'
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
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shadow-inner">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
                Drag & Drop audio recording here, or <span className="text-emerald-500 underline">browse</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Supports MP3, WAV, M4A, AAC, OGG • Max Limit: {cap.maxFileSizeMB}MB
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                  <FileAudio className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                    {selectedFile.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    Original Size: {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>

              <button
                onClick={resetAll}
                disabled={isProcessing}
                className="self-end sm:self-center px-3 py-1.5 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-emerald-500" />
                  <span>Target Bitrate</span>
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['64k', '96k', '128k'] as const).map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBitrate(b)}
                      className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                        bitrate === b
                          ? 'bg-emerald-500 text-white shadow-sm'
                          : 'bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                      }`}
                    >
                      {b} {b === '64k' ? '(Voice)' : ''}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <FileAudio className="w-4 h-4 text-emerald-500" />
                  <span>Output Container Format</span>
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['mp3', 'opus'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setFormat(fmt)}
                      className={`py-2 px-2 rounded-lg text-xs font-semibold uppercase transition-all ${
                        format === fmt
                          ? 'bg-emerald-500 text-white shadow-sm'
                          : 'bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                      }`}
                    >
                      {fmt === 'mp3' ? 'MP3 Audio' : 'OPUS / OGG'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {!cap.isFullySupported && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-xs flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
                <span>
                  Your browser does not support high-speed WebAssembly. Please open this link in Google Chrome, Edge, or Safari.
                </span>
              </div>
            )}

            {!result && (
              <button
                onClick={handleCompress}
                disabled={isProcessing || !cap.isFullySupported}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-base shadow-lg shadow-emerald-500/25 transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Compressing in Worker ({progress}%)...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5" />
                    <span>Compress & Transcode Audio</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {fileError && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{fileError}</span>
          </div>
        )}

        {isProcessing && (
          <div className="space-y-2 p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                <span>{statusText || 'Executing WebAssembly compression in background worker...'}</span>
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono">{progress}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Audio Compression Finished</span>
              </h3>
              <div className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>{calculateReductionPct()}% Smaller</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">Original Audio</span>
                  <span className="text-slate-400 font-mono">{formatFileSize(result.originalSize)}</span>
                </div>
                {originalAudioUrl && (
                  <audio src={originalAudioUrl} controls className="w-full rounded-lg" />
                )}
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-emerald-700 dark:text-emerald-300">Compressed ({bitrate})</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-extrabold">
                    {formatFileSize(result.size)}
                  </span>
                </div>
                <audio src={result.url} controls className="w-full rounded-lg" />
              </div>
            </div>

            <a
              href={result.url}
              download={result.filename}
              className="w-full py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Compressed Audio ({result.filename})</span>
            </a>
          </div>
        )}
      </div>

      {/* Programmatic SEO Guides */}
      <section className="space-y-6 my-10">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white text-center">
          Audio Bandwidth & Voice Note Optimization Tips
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">64 kbps Voice Codec</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              64 kbps provides ideal audio compression for speech and podcasts, reducing file size by up to 70% without voice distortion.
            </p>
          </div>

          <div className="glass-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Wifi className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Save Mobile Data</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Compress heavy voice notes before sending on 3G/4G networks in regions with limited cellular data bundles.
            </p>
          </div>

          <div className="glass-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <HardDrive className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Bypass 16MB Attachment Limit</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Long lecture recordings easily exceed WhatsApp's 16MB attachment cap. Compressing to MP3/OPUS keeps recordings small.
            </p>
          </div>
        </div>
      </section>

      {/* Programmatic FAQ Section */}
      <FAQAccordion items={audioCompressorFaqs} title="WhatsApp Audio Compressor FAQ" />

      <AdBanner type="leaderboard" />
    </div>
  );
};
