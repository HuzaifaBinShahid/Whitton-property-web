const LONG_EDGE = 1600;
const QUALITY = 0.8;
const SKIP_BYTES = 500_000;

export type PreparedUpload = {
  blob: Blob;
  contentType: string;
  extension: string;
};

export async function prepareUpload(file: File): Promise<PreparedUpload> {
  const isHeic =
    /heic|heif/i.test(file.type) || /\.(heic|heif)$/i.test(file.name);

  if (file.size < SKIP_BYTES || isHeic) {
    return {
      blob: file,
      contentType: file.type || 'application/octet-stream',
      extension: extFromMime(file.type) ?? extFromName(file.name) ?? 'jpg',
    };
  }

  try {
    const bitmap = await createImageBitmap(file);
    const { width, height } = scaleDown(bitmap.width, bitmap.height, LONG_EDGE);
    const canvas = makeCanvas(width, height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No 2D canvas context');
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const blob = await canvasToBlob(canvas, 'image/jpeg', QUALITY);
    return { blob, contentType: 'image/jpeg', extension: 'jpg' };
  } catch {
    return {
      blob: file,
      contentType: file.type || 'application/octet-stream',
      extension: extFromMime(file.type) ?? extFromName(file.name) ?? 'jpg',
    };
  }
}

function scaleDown(w: number, h: number, longEdge: number) {
  if (Math.max(w, h) <= longEdge) return { width: w, height: h };
  const ratio = longEdge / Math.max(w, h);
  return { width: Math.round(w * ratio), height: Math.round(h * ratio) };
}

function makeCanvas(w: number, h: number): HTMLCanvasElement | OffscreenCanvas {
  if (typeof OffscreenCanvas !== 'undefined') {
    return new OffscreenCanvas(w, h);
  }
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

async function canvasToBlob(
  canvas: HTMLCanvasElement | OffscreenCanvas,
  type: string,
  quality: number,
): Promise<Blob> {
  if ('convertToBlob' in canvas) {
    return canvas.convertToBlob({ type, quality });
  }
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('toBlob failed'))),
      type,
      quality,
    );
  });
}

function extFromMime(mime: string | undefined): string | null {
  if (!mime) return null;
  if (mime === 'image/jpeg') return 'jpg';
  if (mime === 'image/png') return 'png';
  if (mime === 'image/webp') return 'webp';
  if (mime === 'image/heic' || mime === 'image/heif') return 'heic';
  return null;
}

function extFromName(name: string): string | null {
  const m = name.match(/\.([a-z0-9]+)$/i);
  return m ? m[1].toLowerCase() : null;
}
