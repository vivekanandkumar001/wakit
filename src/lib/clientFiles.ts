import JSZip from 'jszip';

const IMAGE_EXTENSIONS = /\.(png|jpe?g|webp|gif|bmp|avif)$/i;
const MAX_IMAGE_BYTES = 30 * 1024 * 1024;
const MAX_IMAGE_PIXELS = 64_000_000;

export const formatBytes = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 KB';
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
};

export const stripExtension = (name: string): string =>
  name.replace(/\.[^/.]+$/, '').trim() || 'file';

export const safeFileName = (name: string, fallback = 'wakit-file'): string => {
  const base = stripExtension(name)
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
    .slice(0, 80);
  return base || fallback;
};

/** Sanitizes a download name while keeping its file extension. */
export const sanitizeDownloadName = (name: string, fallback = 'wakit-file'): string => {
  const lastDot = name.lastIndexOf('.');
  const hasExtension = lastDot > 0 && lastDot < name.length - 1;
  const extension = hasExtension
    ? name.slice(lastDot + 1).toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8)
    : '';
  const base = safeFileName(hasExtension ? name.slice(0, lastDot) : name, fallback);
  return extension ? `${base}.${extension}` : base;
};

export const isImageFile = (file: File): boolean =>
  file.type.startsWith('image/') || IMAGE_EXTENSIONS.test(file.name);

export const assertImageFile = (file: File): void => {
  if (!isImageFile(file)) {
    throw new Error(`${file.name} is not a supported image file.`);
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error(`${file.name} is larger than 30 MB. Please use a smaller image.`);
  }
};

export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = sanitizeDownloadName(filename, 'download');
  anchor.rel = 'noopener';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
};

export const downloadText = (text: string, filename: string, type = 'text/plain;charset=utf-8'): void => {
  downloadBlob(new Blob([text], { type }), filename);
};

export const canvasToBlob = (
  canvas: HTMLCanvasElement,
  type = 'image/png',
  quality = 0.92,
): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Your browser could not create the image file.'));
      },
      type,
      quality,
    );
  });

export const createCanvas = (width: number, height: number): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width);
  canvas.height = Math.round(height);
  return canvas;
};

export const loadImage = async (file: File): Promise<HTMLImageElement> => {
  assertImageFile(file);
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.decoding = 'async';
    image.src = objectUrl;
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error(`${file.name} could not be decoded as an image.`));
    });
    if (
      !image.naturalWidth ||
      !image.naturalHeight ||
      image.naturalWidth * image.naturalHeight > MAX_IMAGE_PIXELS
    ) {
      throw new Error(`${file.name} is too large to process safely. Try an image under 64 megapixels.`);
    }
    return image;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

export const drawImageCover = (
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource,
  width: number,
  height: number,
  sourceWidth = 0,
  sourceHeight = 0,
): void => {
  const sw = sourceWidth || Number((image as HTMLImageElement).naturalWidth || width);
  const sh = sourceHeight || Number((image as HTMLImageElement).naturalHeight || height);
  const scale = Math.max(width / sw, height / sh);
  const dw = sw * scale;
  const dh = sh * scale;
  ctx.drawImage(image, (width - dw) / 2, (height - dh) / 2, dw, dh);
};

export const drawImageContain = (
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource,
  width: number,
  height: number,
  sourceWidth = 0,
  sourceHeight = 0,
): void => {
  const sw = sourceWidth || Number((image as HTMLImageElement).naturalWidth || width);
  const sh = sourceHeight || Number((image as HTMLImageElement).naturalHeight || height);
  const scale = Math.min(width / sw, height / sh);
  const dw = sw * scale;
  const dh = sh * scale;
  ctx.drawImage(image, (width - dw) / 2, (height - dh) / 2, dw, dh);
};

export const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void => {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
};

export const wrapCanvasText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] => {
  const paragraphs = text.replace(/\r\n/g, '\n').split('\n');
  const lines: string[] = [];
  paragraphs.forEach((paragraph) => {
    if (!paragraph.trim()) {
      lines.push('');
      return;
    }
    const words = paragraph.trim().split(/\s+/);
    let line = '';
    words.forEach((word) => {
      const candidate = line ? `${line} ${word}` : word;
      if (ctx.measureText(candidate).width <= maxWidth || !line) {
        line = candidate;
      } else {
        lines.push(line);
        line = word;
      }
    });
    if (line) lines.push(line);
  });
  return lines;
};

export const drawTextLines = (
  ctx: CanvasRenderingContext2D,
  lines: string[],
  x: number,
  y: number,
  lineHeight: number,
  align: CanvasTextAlign = 'left',
): number => {
  ctx.textAlign = align;
  lines.forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight);
  });
  return y + lines.length * lineHeight;
};

export const readTextFile = (file: File, maxBytes = 25 * 1024 * 1024): Promise<string> => {
  if (file.size > maxBytes) {
    return Promise.reject(new Error(`Text file is too large. Maximum size is ${formatBytes(maxBytes)}.`));
  }
  return file.text();
};

export const fileToDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read the selected file.'));
    reader.readAsDataURL(blob);
  });

export const copyText = async (text: string): Promise<void> => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  textarea.remove();
  if (!copied) throw new Error('Copy failed. Select the text and copy it manually.');
};

export const zipAndDownload = async (
  files: Array<{ name: string; blob: Blob }>,
  zipName: string,
  folderName?: string,
): Promise<void> => {
  if (files.length === 0) throw new Error('There are no files to download.');
  const zip = new JSZip();
  const folder = folderName ? zip.folder(folderName) : zip;
  files.forEach((file) => folder?.file(sanitizeDownloadName(file.name, 'file'), file.blob));
  const archive = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
  downloadBlob(archive, zipName);
};

export const normalizeUrl = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    return url.toString();
  } catch {
    return null;
  }
};

export const initials = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || 'W';
