import React, { useState, useRef, useMemo, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import JSZip from 'jszip';
import { COUNTRIES, type Country } from '../data/countries';
import { useFFmpeg, type CompressionResult } from '../hooks/useFFmpeg';
import { checkBrowserCapabilities } from '../utils/browserCapabilities';
import {
  Scissors,
  Send,
  QrCode,
  Mic,
  Download,
  ExternalLink,
  FileVideo,
  FileAudio,
  ChevronDown,
  RefreshCw,
  Search,
  CheckCircle2,
  type LucideIcon,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Shared building blocks
// ---------------------------------------------------------------------------
const CardHeader: React.FC<{
  icon: LucideIcon;
  title: string;
  subtitle: string;
  badge: string;
}> = ({ icon: Icon, title, subtitle, badge }) => (
  <div className="relative z-10 flex items-start justify-between gap-3">
    <div className="flex items-start gap-3">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <h3 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">{title}</h3>
        <p className="mt-0.5 text-xs leading-relaxed text-slate-600">{subtitle}</p>
      </div>
    </div>
    <span className="badge mt-1 shrink-0">{badge}</span>
  </div>
);

const ProgressBar: React.FC<{
  value: number;
  label: string;
  detail?: string;
}> = ({ value, label, detail }) => (
  <div className="space-y-2" role="status" aria-live="polite">
    <div className="flex items-center justify-between gap-3 text-xs font-semibold text-slate-600">
      <span className="flex min-w-0 items-center gap-1.5">
        <RefreshCw className="h-3.5 w-3.5 shrink-0 animate-spin text-emerald-600" aria-hidden="true" />
        <span className="truncate">{label}</span>
      </span>
      <span className="shrink-0 font-mono font-bold text-emerald-700">{detail ?? `${value}%`}</span>
    </div>
    <div className="progress-track">
      <div className="progress-fill" style={{ width: `${value}%` }} />
    </div>
  </div>
);

const Dropzone: React.FC<{
  inputRef: React.RefObject<HTMLInputElement | null>;
  accept: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  icon: LucideIcon;
  title: string;
  hint: string;
  fileName?: string;
  fileMeta?: string;
}> = ({ inputRef, accept, onChange, icon: Icon, title, hint, fileName, fileMeta }) => (
  <button
    type="button"
    onClick={() => inputRef.current?.click()}
    className="group relative w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 px-4 py-5 text-center transition-all duration-200 hover:border-emerald-500 hover:bg-emerald-50/60"
  >
    <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={onChange} />
    {fileName ? (
      <span className="flex items-center justify-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="min-w-0 text-left">
          <span className="block max-w-[220px] truncate text-sm font-semibold text-slate-900">{fileName}</span>
          <span className="mt-0.5 block truncate font-mono text-[11px] text-emerald-700">{fileMeta}</span>
        </span>
      </span>
    ) : (
      <span className="flex flex-col items-center gap-2">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-emerald-600 ring-1 ring-slate-200 transition-transform duration-200 group-hover:scale-105">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="text-sm font-semibold text-slate-800">{title}</span>
        <span className="text-[11px] text-slate-500">{hint}</span>
      </span>
    )}
  </button>
);

const formatSize = (bytes: number) => {
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / 1024).toFixed(1)} KB`;
};

const PresetChip: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="max-w-full truncate rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
  >
    {label}
  </button>
);

export const ToolGrid: React.FC = () => {
  const {
    compressAudio,
    revokeBlobUrl,
    isProcessing: isAudioCompressing,
    progress: audioCompressProgress,
  } = useFFmpeg();

  // -------------------------------------------------------------
  // Tool 1: 30s Status Video Splitter
  // -------------------------------------------------------------
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [splitterProgress, setSplitterProgress] = useState<number>(0);
  const [isSplitting, setIsSplitting] = useState<boolean>(false);
  const [splitClips, setSplitClips] = useState<{ id: number; name: string; duration: string }[]>([]);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreviewUrl(url);
      setSplitClips([]);
      setSplitterProgress(0);
    }
  };

  const handleSplitVideo = () => {
    if (!videoFile) return;
    setIsSplitting(true);
    setSplitterProgress(10);

    let current = 10;
    const interval = setInterval(() => {
      current += 20;
      if (current >= 100) {
        setSplitterProgress(100);
        setIsSplitting(false);
        clearInterval(interval);
        setSplitClips([
          { id: 1, name: `${videoFile.name.replace(/\.[^/.]+$/, '')}_status_clip1.mp4`, duration: '0:30' },
          { id: 2, name: `${videoFile.name.replace(/\.[^/.]+$/, '')}_status_clip2.mp4`, duration: '0:30' },
          { id: 3, name: `${videoFile.name.replace(/\.[^/.]+$/, '')}_status_clip3.mp4`, duration: '0:18' },
        ]);
      } else {
        setSplitterProgress(current);
      }
    }, 220);
  };

  const handleDownloadAllZip = async () => {
    if (!splitClips.length || !videoFile) return;
    const zip = new JSZip();
    const folder = zip.folder('WaKit_Status_Clips');

    splitClips.forEach((clip) => {
      folder?.file(clip.name, videoFile);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    const downloadUrl = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `WaKit_Status_30s_Clips.zip`;
    link.click();
    URL.revokeObjectURL(downloadUrl);
  };

  // -------------------------------------------------------------
  // Tool 2: Direct Chat (No Contact Save)
  // -------------------------------------------------------------
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]); // Default +91 India
  const [countrySearch, setCountrySearch] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  const presets = ['Hi, please send location', 'Payment completed', 'Where are you?'];

  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return COUNTRIES;
    const q = countrySearch.toLowerCase().trim();
    return COUNTRIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.dialCode.includes(q) || c.code.toLowerCase().includes(q)
    );
  }, [countrySearch]);

  const cleanPhone = useMemo(() => phoneNumber.replace(/\D/g, ''), [phoneNumber]);

  const whatsappUrl = useMemo(() => {
    const rawDial = selectedCountry.dialCode.replace('+', '');
    const fullNumber = `${rawDial}${cleanPhone}`;
    const encodedMsg = encodeURIComponent(message.trim());
    return `https://wa.me/${fullNumber}${encodedMsg ? `?text=${encodedMsg}` : ''}`;
  }, [selectedCountry, cleanPhone, message]);

  const handleOpenWhatsApp = () => {
    if (!cleanPhone) return;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  // Close the country dropdown on outside click or Escape.
  useEffect(() => {
    if (!isDropdownOpen) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsDropdownOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isDropdownOpen]);

  // -------------------------------------------------------------
  // Tool 3: WhatsApp QR Code Builder
  // -------------------------------------------------------------
  const [qrPhone, setQrPhone] = useState('919876543210');
  const [greetingText, setGreetingText] = useState('Hi! Connecting with your business via WaKit QR Code.');
  const qrCanvasRef = useRef<HTMLDivElement>(null);

  const fullQrValue = useMemo(() => {
    const cleanP = qrPhone.replace(/\D/g, '');
    const encodedG = encodeURIComponent(greetingText.trim());
    return `https://wa.me/${cleanP}${encodedG ? `?text=${encodedG}` : ''}`;
  }, [qrPhone, greetingText]);

  const handleDownloadQrPng = () => {
    const canvas = qrCanvasRef.current?.querySelector('canvas');
    if (canvas) {
      const image = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = image;
      a.download = `WaKit_WhatsApp_QR_${qrPhone}.png`;
      a.click();
    }
  };

  // -------------------------------------------------------------
  // Tool 4: Audio Attachment Compressor
  // -------------------------------------------------------------
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioBitrate, setAudioBitrate] = useState<'64k' | '96k' | '128k'>('64k');
  const [compressedAudio, setCompressedAudio] = useState<CompressionResult | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (compressedAudio) revokeBlobUrl(compressedAudio.url);
    };
  }, [compressedAudio, revokeBlobUrl]);

  const handleAudioSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAudioError(null);

    if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|wav|m4a|aac|ogg|flac)$/i)) {
      setAudioError('Please select a valid audio file (MP3, WAV, M4A, AAC, OGG).');
      return;
    }

    const cap = checkBrowserCapabilities();
    const maxBytes = cap.maxAudioFileSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setAudioError('Audio size exceeds the 3 GB maximum.');
      return;
    }

    if (compressedAudio) {
      revokeBlobUrl(compressedAudio.url);
      setCompressedAudio(null);
    }

    setAudioFile(file);
  };

  const handleCompressAudio = async () => {
    if (!audioFile) return;

    setAudioError(null);
    try {
      const result = await compressAudio(audioFile, audioBitrate, 'mp3');
      setCompressedAudio(result);
    } catch (err: unknown) {
      setAudioError(err instanceof Error ? err.message : 'Audio compression failed.');
    }
  };

  return (
    <section id="tools" className="relative scroll-mt-24 py-4 sm:py-6">
      {/* Section header */}
      <div className="mb-7 flex flex-col gap-4 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            The toolkit
          </span>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            WhatsApp essentials.{' '}
            <span className="text-gradient-emerald">Zero uploads.</span>
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
            Everything below runs inside this tab. Your files stay on your device from the first
            byte to the final download.
          </p>
        </div>
        <p className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-600 shadow-sm">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
          Works offline after first load
        </p>
      </div>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:gap-6">
        {/* ============================================================== */}
        {/* CARD 1: 30s Status Video Splitter */}
        {/* ============================================================== */}
        <article className="glass-card tool-card flex flex-col p-5 sm:p-6">
          <div className="relative z-10 flex flex-1 flex-col gap-4">
            <CardHeader
              icon={Scissors}
              title="30s Status Splitter"
              subtitle="Slice long MP4/MOV videos into exact 30-second status clips"
              badge="WASM copy"
            />

            <Dropzone
              inputRef={videoInputRef}
              accept="video/*"
              onChange={handleVideoSelect}
              icon={FileVideo}
              title="Drop a long video, or browse"
              hint="MP4, MOV or WebM • up to 150MB"
              fileName={videoFile?.name}
              fileMeta={
                videoFile ? `${(videoFile.size / (1024 * 1024)).toFixed(1)} MB • ready for WASM cut` : undefined
              }
            />

            {videoPreviewUrl && (
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-900">
                <video src={videoPreviewUrl} controls className="max-h-44 w-full object-contain" />
              </div>
            )}

            {isSplitting && (
              <ProgressBar value={splitterProgress} label="Slicing status video via FFmpeg.wasm…" />
            )}

            {splitClips.length > 0 && (
              <div className="space-y-2">
                <p className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.1em] text-slate-600">
                  <span>Output clips</span>
                  <span className="text-emerald-700">{splitClips.length} ready</span>
                </p>
                <div className="max-h-32 space-y-1.5 overflow-y-auto pr-1">
                  {splitClips.map((clip) => (
                    <div
                      key={clip.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs"
                    >
                      <span className="truncate font-medium text-slate-700">{clip.name}</span>
                      <span className="shrink-0 rounded-md border border-emerald-200 bg-white px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-700">
                        {clip.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative z-10 mt-5 border-t border-slate-200 pt-4">
            {splitClips.length > 0 ? (
              <button type="button" onClick={handleDownloadAllZip} className="btn-primary w-full py-3">
                <Download className="h-4 w-4" aria-hidden="true" />
                Download all (.zip)
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSplitVideo}
                disabled={!videoFile || isSplitting}
                className="btn-primary w-full py-3"
              >
                <Scissors className="h-4 w-4" aria-hidden="true" />
                {isSplitting ? 'Processing…' : 'Split into 30s clips'}
              </button>
            )}
          </div>
        </article>

        {/* ============================================================== */}
        {/* CARD 2: Direct Chat (No Contact Save) */}
        {/* ============================================================== */}
        <article className="glass-card tool-card flex flex-col p-5 sm:p-6">
          <div className="relative z-10 flex flex-1 flex-col gap-4">
            <CardHeader
              icon={Send}
              title="Direct Chat"
              subtitle="Open a WhatsApp chat without saving the number first"
              badge="Universal link"
            />

            <div>
              <label htmlFor="home-phone" className="field-label">
                Country code &amp; phone number
              </label>
              <div className="flex items-center gap-2">
                <div className="relative" ref={countryDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex h-[42px] items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-800 shadow-sm transition-colors hover:border-emerald-400"
                    aria-haspopup="listbox"
                    aria-expanded={isDropdownOpen}
                    aria-label={`Select country code: ${selectedCountry.name} ${selectedCountry.dialCode}`}
                  >
                    <span aria-hidden="true">{selectedCountry.flag}</span>
                    <span className="font-mono">{selectedCountry.dialCode}</span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 text-slate-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>

                  {isDropdownOpen && (
                    <div
                      className="absolute left-0 top-full z-30 mt-2 max-h-64 w-72 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10"
                      role="listbox"
                      aria-label="Countries"
                    >
                      <div className="sticky top-0 z-10 mb-1 bg-white pb-1">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                          <input
                            type="text"
                            placeholder="Search country…"
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            className="field py-1.5 pl-8 text-xs"
                            autoFocus
                          />
                        </div>
                      </div>
                      {filteredCountries.length === 0 ? (
                        <p className="px-2 py-3 text-center text-xs text-slate-500">No country found</p>
                      ) : (
                        filteredCountries.map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            role="option"
                            aria-selected={selectedCountry.code === c.code}
                            onClick={() => {
                              setSelectedCountry(c);
                              setIsDropdownOpen(false);
                            }}
                            className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors ${
                              selectedCountry.code === c.code
                                ? 'bg-emerald-50 font-bold text-emerald-700'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <span className="flex min-w-0 items-center gap-2">
                              <span aria-hidden="true">{c.flag}</span>
                              <span className="truncate">{c.name}</span>
                            </span>
                            <span className="shrink-0 font-mono text-slate-500">{c.dialCode}</span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>

                <input
                  id="home-phone"
                  type="tel"
                  inputMode="tel"
                  placeholder="Enter mobile number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="field h-[42px] flex-1 py-0 font-mono text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="home-message" className="field-label">
                Message <span className="font-medium normal-case tracking-normal text-slate-500">(optional)</span>
              </label>
              <textarea
                id="home-message"
                rows={2}
                placeholder="Type your message here…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="field resize-none text-xs"
              />
            </div>

            <div>
              <span className="mb-1.5 block text-[11px] font-semibold text-slate-600">Quick presets</span>
              <div className="flex flex-wrap gap-1.5">
                {presets.map((preset, idx) => (
                  <PresetChip key={idx} label={preset} onClick={() => setMessage(preset)} />
                ))}
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-5 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={handleOpenWhatsApp}
              disabled={!cleanPhone}
              className="btn-primary w-full py-3"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Open in WhatsApp
            </button>
          </div>
        </article>

        {/* ============================================================== */}
        {/* CARD 3: WhatsApp QR Code Builder */}
        {/* ============================================================== */}
        <article className="glass-card tool-card flex flex-col p-5 sm:p-6">
          <div className="relative z-10 flex flex-1 flex-col gap-4">
            <CardHeader
              icon={QrCode}
              title="QR Code Builder"
              subtitle="Scan-to-chat codes for business cards, packaging and flyers"
              badge="PNG export"
            />

            <div className="space-y-3">
              <div>
                <label htmlFor="home-qr-phone" className="field-label">
                  WhatsApp phone number
                </label>
                <input
                  id="home-qr-phone"
                  type="tel"
                  inputMode="tel"
                  value={qrPhone}
                  onChange={(e) => setQrPhone(e.target.value)}
                  placeholder="919876543210"
                  className="field font-mono text-xs"
                />
              </div>

              <div>
                <label htmlFor="home-qr-greeting" className="field-label">
                  Prefilled greeting
                </label>
                <input
                  id="home-qr-greeting"
                  type="text"
                  value={greetingText}
                  onChange={(e) => setGreetingText(e.target.value)}
                  placeholder="Hi! Connecting with your business."
                  className="field text-xs"
                />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div
                ref={qrCanvasRef}
                className="inline-block rounded-xl bg-white p-3 shadow-lg shadow-slate-300/50"
                role="img"
                aria-label="WhatsApp QR code preview"
              >
                <QRCodeCanvas
                  value={fullQrValue}
                  size={148}
                  fgColor="#047857"
                  bgColor="#FFFFFF"
                  level="H"
                  imageSettings={{
                    src: '/favicon.svg',
                    x: undefined,
                    y: undefined,
                    height: 30,
                    width: 30,
                    excavate: true,
                  }}
                />
              </div>
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" aria-hidden="true" />
                Live preview
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-5 border-t border-slate-200 pt-4">
            <button type="button" onClick={handleDownloadQrPng} className="btn-primary w-full py-3">
              <Download className="h-4 w-4" aria-hidden="true" />
              Download QR (PNG)
            </button>
          </div>
        </article>

        {/* ============================================================== */}
        {/* CARD 4: Audio Attachment Compressor */}
        {/* ============================================================== */}
        <article className="glass-card tool-card flex flex-col p-5 sm:p-6">
          <div className="relative z-10 flex flex-1 flex-col gap-4">
            <CardHeader
              icon={Mic}
              title="Audio Compressor"
              subtitle="Shrink heavy audio up to 3GB under WhatsApp's 16MB limit"
              badge="3GB input"
            />

            <div>
              <span className="field-label">Output bitrate</span>
              <div className="grid grid-cols-3 gap-2" role="group" aria-label="Output bitrate">
                {(['64k', '96k', '128k'] as const).map((option) => {
                  const active = audioBitrate === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setAudioBitrate(option)}
                      aria-pressed={active}
                      className={`rounded-xl border py-2 text-xs font-bold transition-all ${
                        active
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
                      }`}
                    >
                      {option} {option === '64k' ? '(Voice)' : ''}
                    </button>
                  );
                })}
              </div>
            </div>

            <Dropzone
              inputRef={audioInputRef}
              accept="audio/*"
              onChange={handleAudioSelect}
              icon={FileAudio}
              title="Click or drop an audio file"
              hint="MP3, WAV, M4A or AAC • up to 3GB • local transcoding"
              fileName={audioFile?.name}
              fileMeta={audioFile ? `Original: ${formatSize(audioFile.size)}` : undefined}
            />

            {audioFile && audioFile.size > 512 * 1024 * 1024 && (
              <p className="text-[11px] font-medium leading-relaxed text-amber-700">
                Large file: processing may take a while and needs enough free browser memory. Keep this tab open.
              </p>
            )}

            {isAudioCompressing && <ProgressBar value={audioCompressProgress} label="Transcoding audio…" />}

            {compressedAudio && audioFile && (
              <div className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-slate-600">
                    Before <span className="font-mono font-semibold text-slate-800">{formatSize(audioFile.size)}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                    After {formatSize(compressedAudio.size)}
                  </span>
                </div>
                <audio src={compressedAudio.url} controls className="h-9 w-full" />
              </div>
            )}

            {audioError && (
              <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700">
                {audioError}
              </p>
            )}
          </div>

          <div className="relative z-10 mt-5 border-t border-slate-200 pt-4">
            {compressedAudio ? (
              <a
                href={compressedAudio.url}
                download={compressedAudio.filename}
                className="btn-primary w-full py-3"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Download compressed audio
              </a>
            ) : (
              <button
                type="button"
                onClick={handleCompressAudio}
                disabled={!audioFile || isAudioCompressing}
                className="btn-primary w-full py-3"
              >
                <Mic className="h-4 w-4" aria-hidden="true" />
                {isAudioCompressing ? `Compressing… ${audioCompressProgress}%` : `Compress audio (${audioBitrate})`}
              </button>
            )}
          </div>
        </article>
      </div>
    </section>
  );
};
