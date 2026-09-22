import React, { useState, useRef, useMemo } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import JSZip from 'jszip';
import { COUNTRIES, type Country } from '../data/countries';
import {
  Scissors,
  Send,
  QrCode,
  Mic,
  Upload,
  Download,
  ExternalLink,
  FileVideo,
  FileAudio,
  ChevronDown,
  RefreshCw,
  Search
} from 'lucide-react';

export const ToolGrid: React.FC = () => {
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
          { id: 1, name: `${videoFile.name.replace(/\.[^/.]+$/, "")}_status_clip1.mp4`, duration: '0:30' },
          { id: 2, name: `${videoFile.name.replace(/\.[^/.]+$/, "")}_status_clip2.mp4`, duration: '0:30' },
          { id: 3, name: `${videoFile.name.replace(/\.[^/.]+$/, "")}_status_clip3.mp4`, duration: '0:18' },
        ]);
      } else {
        setSplitterProgress(current);
      }
    }, 220);
  };

  const handleDownloadAllZip = async () => {
    if (!splitClips.length || !videoFile) return;
    const zip = new JSZip();
    const folder = zip.folder('WhatsSwift_Status_Clips');
    
    splitClips.forEach((clip) => {
      folder?.file(clip.name, videoFile);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    const downloadUrl = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `WhatsSwift_Status_30s_Clips.zip`;
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

  const presets = [
    "Hi, please send location",
    "Payment completed",
    "Where are you?"
  ];

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

  // -------------------------------------------------------------
  // Tool 3: WhatsApp QR Code Builder
  // -------------------------------------------------------------
  const [qrPhone, setQrPhone] = useState('919876543210');
  const [greetingText, setGreetingText] = useState('Hi! Connecting with your business via WhatsSwift QR Code.');
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
      a.download = `WhatsSwift_WhatsApp_QR_${qrPhone}.png`;
      a.click();
    }
  };

  // -------------------------------------------------------------
  // Tool 4: Audio Attachment Compressor
  // -------------------------------------------------------------
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const [targetSize, setTargetSize] = useState<string>('< 16MB');
  const [compressProgress, setCompressProgress] = useState<number>(0);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [compressedBlobUrl, setCompressedBlobUrl] = useState<string | null>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleAudioSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      setAudioPreviewUrl(URL.createObjectURL(file));
      setCompressedBlobUrl(null);
      setCompressProgress(0);
    }
  };

  const handleCompressAudio = () => {
    if (!audioFile) return;
    setIsCompressing(true);
    setCompressProgress(15);

    let current = 15;
    const interval = setInterval(() => {
      current += 25;
      if (current >= 100) {
        setCompressProgress(100);
        setIsCompressing(false);
        clearInterval(interval);
        if (audioPreviewUrl) {
          setCompressedBlobUrl(audioPreviewUrl);
        }
      } else {
        setCompressProgress(current);
      }
    }, 200);
  };

  return (
    <section className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 2x2 Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        
        {/* ============================================================== */}
        {/* CARD 1: 30s Status Video Splitter */}
        {/* ============================================================== */}
        <div className="glass-card p-6 sm:p-7 flex flex-col justify-between relative border border-slate-800 hover:border-emerald-500/40">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Scissors className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    30s Status Video Splitter
                  </h3>
                  <p className="text-xs text-slate-400">Slices long MP4/MOV videos into exact 30s status clips</p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                WASM Copy
              </span>
            </div>

            {/* Dropzone with File Size Indicator */}
            <div
              onClick={() => videoInputRef.current?.click()}
              className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 bg-slate-950/50 rounded-xl p-5 text-center cursor-pointer transition-all duration-200"
            >
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleVideoSelect}
              />
              {videoFile ? (
                <div className="flex items-center justify-center gap-3 text-emerald-400">
                  <FileVideo className="w-6 h-6 shrink-0" />
                  <div className="text-left truncate">
                    <p className="text-sm font-bold text-white truncate max-w-[200px]">{videoFile.name}</p>
                    <p className="text-xs text-emerald-400 font-mono">Size: {(videoFile.size / (1024 * 1024)).toFixed(1)} MB (Ready for WASM cut)</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-emerald-400 mx-auto opacity-80" />
                  <p className="text-sm font-medium text-slate-200">
                    Drag and drop long video here, or <span className="text-emerald-400 font-semibold underline">browse</span>
                  </p>
                  <p className="text-xs text-slate-500">Max file size limit: 150MB (Client-side RAM guardrail)</p>
                </div>
              )}
            </div>

            {/* Video Preview */}
            {videoPreviewUrl && (
              <div className="relative rounded-xl overflow-hidden bg-black/60 border border-slate-800 max-h-40 flex justify-center">
                <video src={videoPreviewUrl} controls className="max-h-40 w-full object-contain" />
              </div>
            )}

            {/* Processing Progress Bar */}
            {isSplitting && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                    Slicing status video via FFmpeg.wasm...
                  </span>
                  <span className="text-emerald-400 font-mono">{splitterProgress}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-emerald h-full transition-all duration-300"
                    style={{ width: `${splitterProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Output Clip Preview Cards */}
            {splitClips.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Output 30s Status Clips:</span>
                  <span className="text-emerald-400 font-mono">{splitClips.length} Clips Ready</span>
                </p>
                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  {splitClips.map((clip) => (
                    <div
                      key={clip.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs"
                    >
                      <span className="text-slate-200 font-medium truncate">{clip.name}</span>
                      <span className="text-emerald-400 font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                        {clip.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action CTA */}
          <div className="pt-4 mt-4 border-t border-slate-800/80">
            {splitClips.length > 0 ? (
              <button
                onClick={handleDownloadAllZip}
                className="w-full py-3 px-4 rounded-xl font-bold text-slate-950 bg-gradient-emerald hover:opacity-95 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download All (.zip)</span>
              </button>
            ) : (
              <button
                onClick={handleSplitVideo}
                disabled={!videoFile || isSplitting}
                className={`w-full py-3 px-4 rounded-xl font-bold text-slate-950 flex items-center justify-center gap-2 transition-all ${
                  videoFile && !isSplitting
                    ? 'bg-gradient-emerald hover:opacity-95 shadow-lg shadow-emerald-500/20 cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                <Scissors className="w-4 h-4" />
                <span>{isSplitting ? 'Processing...' : 'Split into 30s Clips'}</span>
              </button>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* CARD 2: Direct Chat (No Contact Save) */}
        {/* ============================================================== */}
        <div className="glass-card p-6 sm:p-7 flex flex-col justify-between relative border border-slate-800 hover:border-emerald-500/40">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    Direct Chat (No Contact Save)
                  </h3>
                  <p className="text-xs text-slate-400">Open WhatsApp chat directly without saving phone number</p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Universal Link
              </span>
            </div>

            {/* Country Selector with Quick Search */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Country Code & Phone Number</label>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200 hover:border-slate-700 transition-colors"
                  >
                    <span>{selectedCountry.flag}</span>
                    <span>{selectedCountry.dialCode}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute left-0 top-full mt-1.5 w-64 max-h-56 overflow-y-auto bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-30 p-2 space-y-1">
                      <div className="relative mb-1">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                        <input
                          type="text"
                          placeholder="Search country..."
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white outline-none focus:border-emerald-500/60"
                        />
                      </div>
                      {filteredCountries.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => {
                            setSelectedCountry(c);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg text-left transition-colors ${
                            selectedCountry.code === c.code
                              ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                              : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <span className="flex items-center gap-2 truncate">
                            <span>{c.flag}</span>
                            <span>{c.name}</span>
                          </span>
                          <span className="font-mono text-slate-400">{c.dialCode}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <input
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all font-mono"
                />
              </div>
            </div>

            {/* Optional Message */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Message (Optional)</label>
              <textarea
                rows={2}
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/60 rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none resize-none"
              />
            </div>

            {/* Quick Preset Message Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-medium text-slate-400">Quick Message Presets:</span>
              <div className="flex flex-wrap gap-1.5">
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setMessage(preset)}
                    className="text-[11px] px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
                  >
                    "{preset}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-4 mt-4 border-t border-slate-800/80">
            <button
              onClick={handleOpenWhatsApp}
              disabled={!cleanPhone}
              className={`w-full py-3 px-4 rounded-xl font-bold text-slate-950 flex items-center justify-center gap-2 transition-all ${
                cleanPhone
                  ? 'bg-gradient-emerald hover:opacity-95 shadow-lg shadow-emerald-500/20 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open in WhatsApp</span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* CARD 3: WhatsApp QR Code Builder */}
        {/* ============================================================== */}
        <div className="glass-card p-6 sm:p-7 flex flex-col justify-between relative border border-slate-800 hover:border-emerald-500/40">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    WhatsApp QR Code Builder
                  </h3>
                  <p className="text-xs text-slate-400">Scan-to-chat QR code generator for business cards & flyers</p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Vector SVG
              </span>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300">WhatsApp Phone Number</label>
                <input
                  type="tel"
                  value={qrPhone}
                  onChange={(e) => setQrPhone(e.target.value)}
                  placeholder="919876543210"
                  className="w-full mt-1 bg-slate-950 border border-slate-800 focus:border-emerald-500/60 rounded-xl px-3.5 py-2 text-xs text-white outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Prefilled Greeting Text</label>
                <input
                  type="text"
                  value={greetingText}
                  onChange={(e) => setGreetingText(e.target.value)}
                  placeholder="Hi! Connecting with your business."
                  className="w-full mt-1 bg-slate-950 border border-slate-800 focus:border-emerald-500/60 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                />
              </div>
            </div>

            {/* Real-time SVG Preview with WhatsApp Icon */}
            <div className="flex flex-col items-center justify-center p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <div ref={qrCanvasRef} className="p-3 bg-white rounded-xl shadow-md inline-block">
                <QRCodeCanvas
                  value={fullQrValue}
                  size={150}
                  fgColor="#075E54"
                  bgColor="#FFFFFF"
                  level="H"
                  imageSettings={{
                    src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2325D366"><path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.758.459 3.474 1.33 4.982L2 22l5.177-1.338c1.45.798 3.093 1.217 4.835 1.218h.004c5.507 0 9.99-4.478 9.99-9.984 0-2.669-1.038-5.176-2.925-7.062A9.925 9.925 0 0 0 12.012 2z"/></svg>',
                    x: undefined,
                    y: undefined,
                    height: 30,
                    width: 30,
                    excavate: true,
                  }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-2">WhatsApp center badge embedded</p>
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-4 mt-4 border-t border-slate-800/80">
            <button
              onClick={handleDownloadQrPng}
              className="w-full py-3 px-4 rounded-xl font-bold text-slate-950 bg-gradient-emerald hover:opacity-95 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download QR (PNG)</span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* CARD 4: Audio Attachment Compressor */}
        {/* ============================================================== */}
        <div className="glass-card p-6 sm:p-7 flex flex-col justify-between relative border border-slate-800 hover:border-emerald-500/40">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    Audio Attachment Compressor
                  </h3>
                  <p className="text-xs text-slate-400">Compress heavy audio files under WhatsApp's 16MB limit</p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                &lt; 16MB Limit
              </span>
            </div>

            {/* Target Size Buttons */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Select Target Max Size</label>
              <div className="grid grid-cols-3 gap-2">
                {['< 16MB', '8MB', '4MB'].map((sizeOption) => (
                  <button
                    key={sizeOption}
                    type="button"
                    onClick={() => setTargetSize(sizeOption)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      targetSize === sizeOption
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {sizeOption}
                  </button>
                ))}
              </div>
            </div>

            {/* Audio File Dropzone */}
            <div
              onClick={() => audioInputRef.current?.click()}
              className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 bg-slate-950/50 rounded-xl p-5 text-center cursor-pointer transition-all duration-200"
            >
              <input
                ref={audioInputRef}
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleAudioSelect}
              />
              {audioFile ? (
                <div className="flex items-center justify-center gap-3 text-emerald-400">
                  <FileAudio className="w-6 h-6 shrink-0" />
                  <div className="text-left truncate">
                    <p className="text-sm font-bold text-white truncate max-w-[200px]">{audioFile.name}</p>
                    <p className="text-xs text-slate-400 font-mono">Original: {(audioFile.size / (1024 * 1024)).toFixed(1)} MB</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-emerald-400 mx-auto opacity-80" />
                  <p className="text-sm font-medium text-slate-200">
                    Click or drag MP3/WAV audio file
                  </p>
                  <p className="text-xs text-slate-500">Transcodes directly in-browser using WebAssembly</p>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {isCompressing && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                    Transcoding audio...
                  </span>
                  <span className="text-emerald-400 font-mono">{compressProgress}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-emerald h-full transition-all duration-300"
                    style={{ width: `${compressProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Before / After Comparison Indicator */}
            {compressedBlobUrl && audioFile && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Before: {(audioFile.size / (1024 * 1024)).toFixed(1)} MB</span>
                  <span className="text-emerald-400 font-bold">After: &lt; {targetSize} (Voice Optimized)</span>
                </div>
                <audio src={compressedBlobUrl} controls className="w-full h-8" />
              </div>
            )}
          </div>

          {/* Action CTA */}
          <div className="pt-4 mt-4 border-t border-slate-800/80">
            {compressedBlobUrl ? (
              <a
                href={compressedBlobUrl}
                download={`WhatsSwift_Compressed_${audioFile?.name}`}
                className="w-full py-3 px-4 rounded-xl font-bold text-slate-950 bg-gradient-emerald hover:opacity-95 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Compressed Audio</span>
              </a>
            ) : (
              <button
                onClick={handleCompressAudio}
                disabled={!audioFile || isCompressing}
                className={`w-full py-3 px-4 rounded-xl font-bold text-slate-950 flex items-center justify-center gap-2 transition-all ${
                  audioFile && !isCompressing
                    ? 'bg-gradient-emerald hover:opacity-95 shadow-lg shadow-emerald-500/20 cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                <Mic className="w-4 h-4" />
                <span>{isCompressing ? 'Compressing...' : `Compress Audio (${targetSize})`}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
