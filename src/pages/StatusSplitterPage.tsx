import React, { useState, useRef, useCallback, useEffect } from 'react';
import JSZip from 'jszip';
import { useFFmpeg, type VideoSegment } from '../hooks/useFFmpeg';
import { checkBrowserCapabilities } from '../utils/browserCapabilities';
import { COOPCheckBanner } from '../components/COOPCheckBanner';
import { AdBanner } from '../components/AdBanner';
import { SEOHead, type FAQItem } from '../components/SEOHead';
import { FAQAccordion } from '../components/FAQAccordion';
import { 
  Scissors, 
  UploadCloud, 
  Download, 
  Archive, 
  FileVideo, 
  Clock, 
  HardDrive, 
  Layers, 
  AlertCircle,
  Loader2,
  CheckCircle2,
  Trash2,
  Sparkles,
  ShieldAlert,
  Zap,
  Lock,
  Film
} from 'lucide-react';

const statusSplitterFaqs: FAQItem[] = [
  {
    question: 'How do I split a long video for WhatsApp Status into 30-second clips?',
    answer: 'Drag and drop your MP4, MOV, or WebM video into the WaKit Status Splitter zone above, then click "Split into 30s Status Clips". Our client-side WebAssembly engine instantly cuts your video into exact 30-second segments ready for download.',
  },
  {
    question: 'Does WaKit reduce the video quality during splitting?',
    answer: 'No! WaKit uses FFmpeg stream copy (`-c copy`). This cuts the video file at exact keyframe boundaries without re-encoding, preserving 100% of original HD video resolution, frame rate, and audio clarity.',
  },
  {
    question: 'Is it safe to upload personal family or business videos?',
    answer: 'Yes! Zero files are uploaded to any server. All processing runs 100% locally inside your browser memory using WebAssembly. Your media never leaves your device.',
  },
  {
    question: 'Why does WhatsApp limit status videos to 30 seconds?',
    answer: 'WhatsApp enforces a strict 30-second duration limit per status story clip to optimize bandwidth and media loading for users on mobile networks.',
  },
  {
    question: 'Can I download all split video parts in a single ZIP file?',
    answer: 'Yes! After splitting completes, click "Download All as ZIP" to get a clean archive containing all sequentially numbered clips (status_part_01.mp4, status_part_02.mp4, etc.).',
  },
];

export const StatusSplitterPage: React.FC = () => {
  const { progress, statusText, splitVideo, revokeBlobUrl, isProcessing } = useFFmpeg();
  const cap = checkBrowserCapabilities();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoMetadata, setVideoMetadata] = useState<{
    duration: number;
    width: number;
    height: number;
    estimatedClips: number;
  } | null>(null);
  const [segments, setSegments] = useState<VideoSegment[]>([]);
  const [isZipping, setIsZipping] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      segments.forEach((seg) => revokeBlobUrl(seg.url));
    };
  }, [segments, revokeBlobUrl]);

  const handleFileSelect = useCallback((file: File) => {
    setFileError(null);

    if (!file.type.startsWith('video/')) {
      setFileError('Please select a valid video file (MP4, MOV, WebM, etc.).');
      return;
    }

    const maxBytes = cap.maxFileSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      const fileMB = (file.size / (1024 * 1024)).toFixed(1);
      const limitType = cap.isMobile ? 'mobile' : 'desktop';
      setFileError(`File size (${fileMB}MB) exceeds maximum ${limitType} limit of ${cap.maxFileSizeMB}MB to protect browser memory.`);
      return;
    }

    segments.forEach((seg) => revokeBlobUrl(seg.url));
    setSegments([]);

    setSelectedFile(file);

    const video = document.createElement('video');
    video.preload = 'metadata';
    const videoUrl = URL.createObjectURL(file);
    video.src = videoUrl;

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(videoUrl);
      const duration = video.duration || 0;
      const estimatedClips = Math.ceil(duration / 30);
      setVideoMetadata({
        duration,
        width: video.videoWidth,
        height: video.videoHeight,
        estimatedClips: estimatedClips > 0 ? estimatedClips : 1,
      });
    };

    video.onerror = () => {
      URL.revokeObjectURL(videoUrl);
      setFileError('Failed to parse video metadata. File might be corrupted.');
    };
  }, [segments, revokeBlobUrl, cap]);

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

  const handleProcessSplit = async () => {
    if (!selectedFile || !cap.isFullySupported) return;
    setFileError(null);

    try {
      const resultSegments = await splitVideo(selectedFile, 30);
      setSegments(resultSegments);
    } catch (err: unknown) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : 'Error processing video split';
      setFileError(`Splitting failed: ${errMsg}`);
    }
  };

  const handleDownloadZip = async () => {
    if (segments.length === 0) return;
    setIsZipping(true);

    try {
      const zip = new JSZip();
      const folder = zip.folder('wakit_status_clips');

      segments.forEach((seg) => {
        folder?.file(seg.filename, seg.blob);
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `wakit_status_30s_clips_${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('ZIP creation failed', err);
    } finally {
      setIsZipping(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const resetAll = () => {
    segments.forEach((seg) => revokeBlobUrl(seg.url));
    setSegments([]);
    setSelectedFile(null);
    setVideoMetadata(null);
    setFileError(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <SEOHead
        title="Split Video for WhatsApp Status 30 Seconds Online | WaKit"
        description="Split long MP4, MOV, WebM videos into exact 30-second clips for WhatsApp Status online. 100% Lossless, zero quality degradation, zero server uploads."
        canonicalUrl="https://wakit.app/#/split-video-for-whatsapp-status"
        faqs={statusSplitterFaqs}
      />

      {/* Title Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
          <Scissors className="w-3.5 h-3.5" />
          <span>Lossless Stream Copy • Web Worker Off-Thread Processing</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          WhatsApp Status Splitter (Lossless 30s Slicer)
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
          Split long videos into exact 30-second clips for WhatsApp Status online without losing video quality. Processed 100% in your browser using WebAssembly.
        </p>
      </div>

      <COOPCheckBanner />

      {/* Main Tool Card */}
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
              accept="video/mp4,video/quicktime,video/webm,video/*"
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
                Drag & Drop video file here, or <span className="text-emerald-500 underline">browse</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Supports MP4, MOV, WebM • Max Limit: {cap.maxFileSizeMB}MB ({cap.isMobile ? 'Mobile RAM Guard' : 'Desktop'})
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-amber-500" /> Dedicated Web Worker</span>
              <span>•</span>
              <span>60 FPS UI</span>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                  <FileVideo className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                    {selectedFile.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {formatFileSize(selectedFile.size)}
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

            {videoMetadata && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-center">
                  <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Duration</span>
                  </div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    {formatTime(videoMetadata.duration)}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-center">
                  <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
                    <Layers className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Est. Clips</span>
                  </div>
                  <div className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                    {videoMetadata.estimatedClips} Clips (30s)
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-center">
                  <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
                    <FileVideo className="w-3.5 h-3.5" />
                    <span>Resolution</span>
                  </div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    {videoMetadata.width && videoMetadata.height ? `${videoMetadata.width}x${videoMetadata.height}` : 'Standard'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-center">
                  <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
                    <HardDrive className="w-3.5 h-3.5" />
                    <span>File Size</span>
                  </div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    {formatFileSize(selectedFile.size)}
                  </div>
                </div>
              </div>
            )}

            {!cap.isFullySupported && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-xs flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
                <span>
                  Your browser does not support high-speed WebAssembly. Please open this link in Google Chrome, Edge, or Safari.
                </span>
              </div>
            )}

            {segments.length === 0 && (
              <button
                onClick={handleProcessSplit}
                disabled={isProcessing || !cap.isFullySupported}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-base shadow-lg shadow-emerald-500/25 transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Splitting in Worker ({progress}%)...</span>
                  </>
                ) : (
                  <>
                    <Scissors className="w-5 h-5" />
                    <span>Split into 30s Status Clips</span>
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
                <span>{statusText || 'Executing FFmpeg in background worker...'}</span>
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

        {segments.length > 0 && (
          <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span>Split Completed ({segments.length} Clips)</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ready to download and upload directly to WhatsApp Status.
                </p>
              </div>

              <button
                onClick={handleDownloadZip}
                disabled={isZipping}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {isZipping ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Archive className="w-4 h-4" />
                )}
                <span>Download All as ZIP</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {segments.map((seg) => (
                <div
                  key={seg.id}
                  className="rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-black flex items-center justify-center group">
                      <video
                        src={seg.url}
                        controls
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs px-1">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        Part {seg.index}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        {formatFileSize(seg.size)}
                      </span>
                    </div>
                  </div>

                  <a
                    href={seg.url}
                    download={seg.filename}
                    className="w-full py-2 px-3 rounded-lg bg-slate-200/80 hover:bg-emerald-500 hover:text-white dark:bg-slate-800 dark:hover:bg-emerald-500 text-slate-700 dark:text-slate-300 font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Part {seg.index}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Programmatic SEO Visual Guide Section */}
      <section className="space-y-6 my-10">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white text-center">
          How to Split Video for WhatsApp Status in 3 Simple Steps
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto font-bold text-lg">
              1
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Upload Your Video</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Drag and drop any long MP4, MOV, or WebM video file. WaKit automatically reads file metadata and estimates total 30-second clips.
            </p>
          </div>

          <div className="glass-card p-6 space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto font-bold text-lg">
              2
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Lossless WASM Stream Copy</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Click "Split into 30s Status Clips". FFmpeg WebAssembly runs stream copying (`-c copy`) in a dedicated Web Worker thread without re-encoding.
            </p>
          </div>

          <div className="glass-card p-6 space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto font-bold text-lg">
              3
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Download & Upload</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Preview each clip individually or download all parts sequentially in a ZIP archive. Post to WhatsApp Status effortlessly!
            </p>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="glass-card p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-emerald-500" />
          <span>Why Choose WaKit WhatsApp Status Splitter?</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
              <Film className="w-4 h-4 text-emerald-500" />
              <span>100% Lossless Quality</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Zero video re-encoding means 100% original HD resolution and audio clarity are retained.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-500" />
              <span>Zero Server Uploads</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              All files are processed strictly inside your device's browser memory. Zero privacy leakage.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>Instant ZIP Download</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Download all split video parts in a single ZIP package for organized sharing.
            </p>
          </div>
        </div>
      </section>

      {/* Programmatic FAQ Section */}
      <FAQAccordion items={statusSplitterFaqs} title="WhatsApp Status Splitter FAQ" />

      <AdBanner type="leaderboard" />
    </div>
  );
};
