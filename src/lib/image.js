export function fileToDataURL(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

function loadImg(src) {
  return new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = src;
  });
}

export async function compress(fileOrUrl, max = 900, q = 0.82) {
  const src = typeof fileOrUrl === 'string' ? fileOrUrl : await fileToDataURL(fileOrUrl);
  const img = await loadImg(src);
  const k = Math.min(1, max / Math.max(img.width, img.height));
  const c = document.createElement('canvas');
  c.width = Math.round(img.width * k);
  c.height = Math.round(img.height * k);
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', q);
}

export async function cropBox(dataUrl, box, pad = 0.04) {
  if (!box || box.length !== 4) return dataUrl;
  const img = await loadImg(dataUrl);
  let [y0, x0, y1, x1] = box.map((v) => v / 1000);
  y0 = Math.max(0, y0 - pad); x0 = Math.max(0, x0 - pad);
  y1 = Math.min(1, y1 + pad); x1 = Math.min(1, x1 + pad);
  const w = (x1 - x0) * img.width, h = (y1 - y0) * img.height;
  if (w < 40 || h < 40) return dataUrl;
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  c.getContext('2d').drawImage(img, x0 * img.width, y0 * img.height, w, h, 0, 0, w, h);
  return compress(c.toDataURL('image/jpeg', 0.9), 700);
}

const hex2 = (n) => Math.round(n).toString(16).padStart(2, '0');

/** Colores dominantes sin IA: descarta el fondo (estimado por los bordes) y agrupa con k-means. */
export async function extractColors(dataUrl, k = 3) {
  const img = await loadImg(dataUrl);
  const N = 72;
  const c = document.createElement('canvas');
  c.width = N; c.height = N;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, N, N);
  const d = ctx.getImageData(0, 0, N, N).data;
  const px = (x, y) => { const i = (y * N + x) * 4; return [d[i], d[i + 1], d[i + 2]]; };
  const border = [];
  for (let i = 0; i < N; i++) border.push(px(i, 0), px(i, N - 1), px(0, i), px(N - 1, i));
  const bg = border.reduce((s, p) => s.map((v, j) => v + p[j] / border.length), [0, 0, 0]);
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  let pts = [];
  for (let y = Math.floor(N * 0.12); y < N * 0.88; y++) {
    for (let x = Math.floor(N * 0.12); x < N * 0.88; x++) {
      const p = px(x, y);
      if (dist(p, bg) > 38) pts.push(p);
    }
  }
  if (pts.length < 60) pts = [];
  if (!pts.length) for (let y = N / 4; y < N * 0.75; y++) for (let x = N / 4; x < N * 0.75; x++) pts.push(px(x, y));
  let cents = Array.from({ length: k }, (_, i) => pts[Math.floor(((i + 0.5) / k) * pts.length)]);
  let groups = [];
  for (let it = 0; it < 10; it++) {
    groups = cents.map(() => []);
    for (const p of pts) {
      let bi = 0, bd = Infinity;
      cents.forEach((cc, j) => { const dd = dist(p, cc); if (dd < bd) { bd = dd; bi = j; } });
      groups[bi].push(p);
    }
    cents = groups.map((g, j) => (g.length ? g.reduce((s, p) => s.map((v, q) => v + p[q] / g.length), [0, 0, 0]) : cents[j]));
  }
  return groups
    .map((g, j) => ({ hex: `#${cents[j].map(hex2).join('')}`, pct: Math.round((g.length / pts.length) * 100) }))
    .filter((x) => x.pct >= 12)
    .sort((a, b) => b.pct - a.pct);
}

export const splitDataURL = (d) => {
  const [head, data] = d.split(',');
  return { mimeType: head.match(/data:(.*?);/)?.[1] || 'image/jpeg', data };
};
