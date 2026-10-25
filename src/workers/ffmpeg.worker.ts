import { FFmpeg, FFFSType } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

async function getFFmpeg(onProgress: (ratio: number, text: string) => void) {
  if (ffmpeg && ffmpeg.loaded) return ffmpeg;

  ffmpeg = new FFmpeg();

  ffmpeg.on('progress', ({ progress }) => {
    const ratio = Math.min(100, Math.max(0, Math.round(progress * 100)));
    onProgress(ratio, `Processing... (${ratio}%)`);
  });

  ffmpeg.on('log', ({ message }) => {
    if (message.includes('frame=') || message.includes('time=')) {
      onProgress(-1, message.slice(0, 60));
    }
  });

  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
  onProgress(0, 'Loading WebAssembly engine core...');

  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });

  onProgress(100, 'Engine ready.');
  return ffmpeg;
}

self.onmessage = async (e: MessageEvent) => {
  const { id, command, file, fileData, fileName, segmentTime, bitrate, format } = e.data;

  const postProgress = (ratio: number, statusText: string) => {
    self.postMessage({ id, type: 'PROGRESS', ratio, statusText });
  };

  try {
    const ff = await getFFmpeg(postProgress);
    const ext = fileName.split('.').pop() || 'tmp';
    const inputVirtualName = `input_${Date.now()}.${ext}`;

    if (command === 'SPLIT_VIDEO') {
      const filesToDelete: string[] = [inputVirtualName];

      try {
        postProgress(5, 'Writing video buffer to WASM RAM...');
        const fetchedFile = await fetchFile(new Blob([fileData]));
        await ff.writeFile(inputVirtualName, fetchedFile);

        postProgress(15, 'Slicing video using lossless stream-copy...');
        await ff.exec([
          '-i',
          inputVirtualName,
          '-c',
          'copy',
          '-f',
          'segment',
          '-segment_time',
          String(segmentTime || 30),
          '-reset_timestamps',
          '1',
          '-map',
          '0',
          'output_%03d.mp4',
        ]);

        postProgress(85, 'Reading segmented video clips...');
        const ffmpegAny = ff as unknown as {
          listDir?: (path: string) => Promise<Array<{ name: string; isDir: boolean }>>;
          readdir?: (path: string) => Promise<Array<{ name: string; isDir: boolean }>>;
        };

        const dirFiles = ffmpegAny.listDir
          ? await ffmpegAny.listDir('.')
          : ffmpegAny.readdir
          ? await ffmpegAny.readdir('.')
          : [];

        const outputFiles = (dirFiles || [])
          .map((f) => f.name)
          .filter((name: string) => name.startsWith('output_') && name.endsWith('.mp4'))
          .sort();

        const segments: Array<{
          index: number;
          filename: string;
          buffer: ArrayBuffer;
          size: number;
        }> = [];

        for (let i = 0; i < outputFiles.length; i++) {
          const outName = outputFiles[i];
          filesToDelete.push(outName);
          const data = (await ff.readFile(outName)) as Uint8Array;
          segments.push({
            index: i + 1,
            filename: `status_part_${String(i + 1).padStart(2, '0')}.mp4`,
            buffer: data.buffer as ArrayBuffer,
            size: data.byteLength,
          });
        }

        postProgress(100, 'Splitting complete!');
        const transferables = segments.map((s) => s.buffer);
        (self.postMessage as (message: any, transfer: Transferable[]) => void)(
          { id, type: 'SUCCESS_SPLIT', segments },
          transferables
        );
      } finally {
        // Strict cleanup inside finally block
        for (const f of filesToDelete) {
          try {
            await ff.deleteFile(f);
          } catch {
            // ignore deletion errors
          }
        }
      }
    } else if (command === 'COMPRESS_AUDIO') {
      const outputVirtualName = `output_${Date.now()}.${format || 'mp3'}`;
      const mountPoint = `/wakit_input_${Date.now()}`;
      const filesToDelete: string[] = [outputVirtualName];

      try {
        if (!(file instanceof Blob)) {
          throw new Error('Audio file was not transferred to the worker.');
        }

        postProgress(8, 'Mounting audio file directly from disk (no RAM copy)...');
        await ff.createDir(mountPoint);
        await ff.mount(
          FFFSType.WORKERFS,
          { blobs: [{ name: inputVirtualName, data: file }] },
          mountPoint
        );

        const inputPath = `${mountPoint}/${inputVirtualName}`;
        postProgress(20, `Transcoding audio to ${bitrate} (${format})...`);
        await ff.exec(['-i', inputPath, '-vn', '-b:a', bitrate || '64k', outputVirtualName]);

        postProgress(90, 'Reading compressed audio output...');
        const data = (await ff.readFile(outputVirtualName)) as Uint8Array;
        const mimeType = format === 'mp3' ? 'audio/mp3' : 'audio/ogg';
        const baseName = fileName.substring(0, fileName.lastIndexOf('.')) || 'audio';
        const outFilename = `${baseName}_wakit_${bitrate}.${format}`;

        postProgress(100, 'Audio compression finished!');
        (self.postMessage as (message: any, transfer: Transferable[]) => void)(
          {
            id,
            type: 'SUCCESS_COMPRESS',
            buffer: data.buffer as ArrayBuffer,
            size: data.byteLength,
            filename: outFilename,
            mimeType,
          },
          [data.buffer as ArrayBuffer]
        );
      } finally {
        // Unmount before deleting the mount point. Input data stays on disk.
        try {
          await ff.unmount(mountPoint);
        } catch {
          // ignore if mount never happened
        }
        try {
          await ff.deleteDir(mountPoint);
        } catch {
          // ignore if directory was never created
        }
        for (const f of filesToDelete) {
          try {
            await ff.deleteFile(f);
          } catch {
            // ignore deletion errors
          }
        }
      }
    }
  } catch (err: unknown) {
    let errorMsg = err instanceof Error ? err.message : 'Worker execution error';
    if (/out of memory|memory access out of bounds|allocation failed|cannot allocate|OOM|invalid array length/i.test(errorMsg)) {
      errorMsg = 'This file is too large for the available browser memory. Try a lower bitrate, close other tabs, or use a smaller source file.';
    }
    self.postMessage({ id, type: 'ERROR', error: errorMsg });
  }
};
