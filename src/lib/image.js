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

export const splitDataURL = (d) => {
  const [head, data] = d.split(',');
  return { mimeType: head.match(/data:(.*?);/)?.[1] || 'image/jpeg', data };
};
