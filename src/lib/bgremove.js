import { compress } from './image';

const BG = '#EDEBE7';

function load(src) {
  return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
}

/** Quita el fondo en el propio móvil (modelo descargado una vez, luego offline). */
export async function removeBackgroundLocal(dataUrl, onProgress) {
  const { removeBackground } = await import('@imgly/background-removal');
  const input = await (await fetch(dataUrl)).blob();
  const out = await removeBackground(input, {
    model: 'isnet_quint8',
    device: 'cpu',
    output: { format: 'image/png' },
    progress: (key, cur, total) => {
      if (onProgress && /fetch/.test(key) && total) onProgress(Math.round((cur / total) * 100));
    },
  });
  const url = URL.createObjectURL(out);
  try {
    const img = await load(url);
    const c = document.createElement('canvas');
    c.width = img.width; c.height = img.height;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    const { data } = ctx.getImageData(0, 0, c.width, c.height);
    let x0 = c.width, y0 = c.height, x1 = 0, y1 = 0;
    for (let y = 0; y < c.height; y += 2) {
      for (let x = 0; x < c.width; x += 2) {
        if (data[(y * c.width + x) * 4 + 3] > 40) {
          if (x < x0) x0 = x; if (x > x1) x1 = x;
          if (y < y0) y0 = y; if (y > y1) y1 = y;
        }
      }
    }
    if (x1 - x0 < 20 || y1 - y0 < 20) throw new Error('No he encontrado la prenda en la foto');
    const w = x1 - x0, h = y1 - y0;
    const pad = Math.round(Math.max(w, h) * 0.06);
    const W = Math.max(w + pad * 2, Math.round((h + pad * 2) * 0.75));
    const H = Math.max(h + pad * 2, Math.round(W / 0.75));
    const o = document.createElement('canvas');
    o.width = W; o.height = H;
    const octx = o.getContext('2d');
    octx.fillStyle = BG;
    octx.fillRect(0, 0, W, H);
    octx.drawImage(img, x0, y0, w, h, Math.round((W - w) / 2), Math.round((H - h) / 2), w, h);
    return compress(o.toDataURL('image/jpeg', 0.92), 700);
  } finally {
    URL.revokeObjectURL(url);
  }
}
