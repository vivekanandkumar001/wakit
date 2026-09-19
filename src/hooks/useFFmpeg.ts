import { useState, useRef, useCallback, useEffect } from 'react';
import { checkBrowserCapabilities, type BrowserCapabilityReport } from '../utils/browserCapabilities';

export interface VideoSegment {
  id: string;
  index: number;
  filename: string;
  size: number;
  url: string;
  blob: Blob;
  duration?: number;
}

export interface CompressionResult {
  url: string;
  blob: Blob;
  size: number;
  originalSize: number;
  filename: string;
}

export function useFFmpeg() {
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const workerRef = useRef<Worker | null>(null);
  const activeBlobUrlsRef = useRef<Set<string>>(new Set());
  const capabilityRef = useRef<BrowserCapabilityReport>(checkBrowserCapabilities());

  const registerBlobUrl = useCallback((url: string) => {
    activeBlobUrlsRef.current.add(url);
    return url;
  }, []);

  const revokeBlobUrl = useCallback((url: string) => {
    if (activeBlobUrlsRef.current.has(url)) {
      try {
        URL.revokeObjectURL(url);
      } catch {
        // ignore
      }
      activeBlobUrlsRef.current.delete(url);
    }
  }, []);

  // Initialize Web Worker instance
  const getWorker = useCallback(() => {
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL('../workers/ffmpeg.worker.ts', import.meta.url),
        { type: 'module' }
      );
    }
    return workerRef.current;
  }, []);

  // Cleanup worker & revoke object URLs on unmount
  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
      activeBlobUrlsRef.current.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // ignore
        }
      });
      activeBlobUrlsRef.current.clear();
    };
  }, []);

  // Split video in dedicated Web Worker
  const splitVideo = useCallback(
    async (file: File, segmentTime: number = 30): Promise<VideoSegment[]> => {
      const cap = checkBrowserCapabilities();
      capabilityRef.current = cap;

      // RAM Guardrail Check
      const maxBytes = cap.maxFileSizeMB * 1024 * 1024;
      if (file.size > maxBytes) {
        const fileMB = (file.size / (1024 * 1024)).toFixed(1);
        const limitType = cap.isMobile ? 'mobile' : 'desktop';
        const errorMsg = `File size (${fileMB}MB) exceeds maximum ${limitType} limit of ${cap.maxFileSizeMB}MB to protect browser memory.`;
        setError(errorMsg);
        throw new Error(errorMsg);
      }

      setIsProcessing(true);
      setProgress(0);
      setError(null);
      setStatusText('Transferring file buffer to dedicated Web Worker...');

      const worker = getWorker();
      const id = `task_split_${Date.now()}`;
      const fileData = await file.arrayBuffer();

      return new Promise<VideoSegment[]>((resolve, reject) => {
        const handleMessage = (e: MessageEvent) => {
          if (e.data.id !== id) return;

          if (e.data.type === 'PROGRESS') {
            if (e.data.ratio >= 0) {
              setProgress(e.data.ratio);
            }
            setStatusText(e.data.statusText || 'Processing FFmpeg streams...');
          } else if (e.data.type === 'SUCCESS_SPLIT') {
            worker.removeEventListener('message', handleMessage);
            setIsProcessing(false);
            setProgress(100);
            setStatusText('Video splitting completed!');

            const rawSegments: Array<{
              index: number;
              filename: string;
              buffer: ArrayBuffer;
              size: number;
            }> = e.data.segments;

            const videoSegments: VideoSegment[] = rawSegments.map((s) => {
              const blob = new Blob([s.buffer], { type: 'video/mp4' });
              const url = registerBlobUrl(URL.createObjectURL(blob));
              return {
                id: `seg-${s.index}-${Date.now()}`,
                index: s.index,
                filename: s.filename,
                size: s.size,
                url,
                blob,
              };
            });

            resolve(videoSegments);
          } else if (e.data.type === 'ERROR') {
            worker.removeEventListener('message', handleMessage);
            setIsProcessing(false);
            const errStr = e.data.error || 'Video splitting failed.';
            setError(errStr);
            reject(new Error(errStr));
          }
        };

        worker.addEventListener('message', handleMessage);
        worker.postMessage(
          {
            id,
            command: 'SPLIT_VIDEO',
            fileData,
            fileName: file.name,
            segmentTime,
          },
          [fileData]
        );
      });
    },
    [getWorker, registerBlobUrl]
  );

  // Compress audio in dedicated Web Worker
  const compressAudio = useCallback(
    async (
      file: File,
      bitrate: '64k' | '96k' | '128k' = '64k',
      format: 'mp3' | 'opus' = 'mp3'
    ): Promise<CompressionResult> => {
      const cap = checkBrowserCapabilities();
      capabilityRef.current = cap;

      const maxBytes = cap.maxFileSizeMB * 1024 * 1024;
      if (file.size > maxBytes) {
        const fileMB = (file.size / (1024 * 1024)).toFixed(1);
        const limitType = cap.isMobile ? 'mobile' : 'desktop';
        const errorMsg = `Audio size (${fileMB}MB) exceeds maximum ${limitType} limit of ${cap.maxFileSizeMB}MB.`;
        setError(errorMsg);
        throw new Error(errorMsg);
      }

      setIsProcessing(true);
      setProgress(0);
      setError(null);
      setStatusText('Transferring audio buffer to Web Worker...');

      const worker = getWorker();
      const id = `task_compress_${Date.now()}`;
      const fileData = await file.arrayBuffer();

      return new Promise<CompressionResult>((resolve, reject) => {
        const handleMessage = (e: MessageEvent) => {
          if (e.data.id !== id) return;

          if (e.data.type === 'PROGRESS') {
            if (e.data.ratio >= 0) {
              setProgress(e.data.ratio);
            }
            setStatusText(e.data.statusText || 'Compressing audio...');
          } else if (e.data.type === 'SUCCESS_COMPRESS') {
            worker.removeEventListener('message', handleMessage);
            setIsProcessing(false);
            setProgress(100);
            setStatusText('Audio compression completed!');

            const { buffer, size, filename, mimeType } = e.data;
            const blob = new Blob([buffer], { type: mimeType });
            const url = registerBlobUrl(URL.createObjectURL(blob));

            resolve({
              url,
              blob,
              size,
              originalSize: file.size,
              filename,
            });
          } else if (e.data.type === 'ERROR') {
            worker.removeEventListener('message', handleMessage);
            setIsProcessing(false);
            const errStr = e.data.error || 'Audio compression failed.';
            setError(errStr);
            reject(new Error(errStr));
          }
        };

        worker.addEventListener('message', handleMessage);
        worker.postMessage(
          {
            id,
            command: 'COMPRESS_AUDIO',
            fileData,
            fileName: file.name,
            bitrate,
            format,
          },
          [fileData]
        );
      });
    },
    [getWorker, registerBlobUrl]
  );

  return {
    capabilities: capabilityRef.current,
    isProcessing,
    progress,
    statusText,
    error,
    splitVideo,
    compressAudio,
    revokeBlobUrl,
  };
}
