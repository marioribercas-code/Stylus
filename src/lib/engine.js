import {
  SUBTYPES, OCCASIONS, SEASONS, ESSENTIALS, lch, deltaE, hueDiff, isNeutral, colorFamily, paletteFit, heightClass,
} from './fashion';

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const subOf = (it) => SUBTYPES[it?.sub] || SUBTYPES.otro;
export const catOf = (it) => it?.category || subOf(it).cat;
export const hexOf = (it) => it?.colors?.[0]?.hex || it?.hex || '#808080';

export function fRange(it) {
  const [lo, hi] = subOf(it).f;
  if (!it.formality) return [lo, hi];
  const f = Number(it.formality);
  return [Math.max(1, (lo + f - 0.75) / 2), Math.min(5, (hi + f + 0.75) / 2)];
}
const warmthOf = (it) => (it ? (it.warmth ?? subOf(it).warmth) : 0);
const PATTERNED = new Set(['rayas', 'cuadros', 'estampado', 'logo']);
const OPEN_LAYERS = new Set(['americana', 'blazer_casual', 'sobrecamisa', 'chore', 'cardigan', 'chaqueta_vaquera', 'harrington']);
const STRUCTURED = new Set(['americana', 'blazer_casual', 'chore', 'harrington', 'cazadora_piel', 'bomber', 'chaqueta_vaquera', 'abrigo', 'gabardina']);

export function warmthTarget(t) {
  const pts = [[30, 0.5], [26, 1], [22, 1.5], [18, 2.5], [14, 4], [10, 5.5], [5, 7], [0, 8.5], [-5, 9.5]];
  if (t >= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) {
    const [t1, w1] = pts[i - 1], [t2, w2] = pts[i];
    if (t >= t2) return w2 + ((t - t2) / (t1 - t2)) * (w1 - w2);
  }
  return 9.5;
}

export function seasonContrast(seasonKey) {
  if (!seasonKey) return 'medio';
  if (/winter|bright/.test(seasonKey)) return 'alto';
  if (/summer|soft|light/.test(seasonKey)) return 'bajo';
  return 'medio';
}

const pieces = (o) => ['top', 'mid', 'outer', 'bottom', 'shoes'].map((k) => o[k]).filter(Boolean);
const pairKey = (a, b) => (a < b ? `${a}-${b}` : `${b}-${a}`);

/** Puntúa un outfit 0-100 y devuelve motivos legibles. ctx: {profile, weather:{t,rain}, occasion, fb, rotation} */
export function scoreOutfit(o, ctx = {}) {
  const pro = ctx.profile || {};
  const occ = OCCASIONS[ctx.occasion || 'casual'];
  const t = ctx.weather?.t ?? 18;
  const rain = !!ctx.weather?.rain;
  const ps = pieces(o);
  const good = [], bad = [];
  const note = (arr, w, s) => arr.push([w, s]);

  // 1. Formalidad (20)
  const ranges = ps.map(fRange);
  const lo = Math.max(...ranges.map((r) => r[0])), hi = Math.min(...ranges.map((r) => r[1]));
  const gap = Math.max(0, lo - hi);
  const coh = gap === 0 ? 1 : clamp(1 - gap / 1.5);
  const level = gap === 0 ? clamp(occ.target, lo, hi) : (lo + hi) / 2;
  const occFit = clamp(1 - Math.abs(level - occ.target) / 1.5);
  if (gap > 0.5) note(bad, gap, 'Mezcla prendas de niveles de formalidad incompatibles');
  else if (coh === 1) note(good, 1, 'Nivel de formalidad coherente');
  if (occFit < 0.6) note(bad, 1 - occFit, `Demasiado ${level > occ.target ? 'arreglado' : 'informal'} para ${occ.name.toLowerCase()}`);
  else if (occFit > 0.9) note(good, 0.8, `Perfecto para ${occ.name.toLowerCase()}`);
  const centers = ps.filter((it) => catOf(it) !== 'outer' || ['americana', 'blazer_casual'].includes(it.sub)).map((it) => (it.formality ? Number(it.formality) : (subOf(it).f[0] + subOf(it).f[1]) / 2));
  const centerFit = clamp(1 - centers.reduce((s, c) => s + Math.abs(c - occ.target), 0) / centers.length / 2);
  let sForm = 20 * (0.35 * coh + 0.4 * occFit + 0.25 * centerFit) - (occFit < 0.6 ? 4 : 0) - Math.min(14, gap * 9);
  if (o.mid && ['polo', 'polo_punto', 'camisa_cubana', 'camiseta_grafica'].includes(o.top?.sub)) { sForm -= 4; note(bad, 0.5, 'Esa prenda no se lleva bajo un jersey o sudadera'); }
  if (o.bottom?.sub === 'bermuda' && ['bota', 'chelsea', 'derby_oxford'].includes(o.shoes?.sub)) { sForm -= 6; note(bad, 0.8, 'Botas o zapato de vestir con bermudas'); }
  if (ctx.occasion === 'deporte' && o.shoes && o.shoes.sub !== 'zapatilla_deporte') sForm -= 3;

  // 2. Color (25)
  const accents = [];
  ps.forEach((it) => {
    const h = hexOf(it);
    if (!isNeutral(h) && !accents.some((a) => deltaE(a, h) < 15)) accents.push(h);
  });
  let harm;
  const muted = (h) => lch(h).C < 40;
  if (accents.length === 0) { harm = 0.85; note(good, 0.5, 'Paleta neutra: elegante y segura'); }
  else if (accents.length === 1) { harm = 1; note(good, 0.9, 'Un solo color de acento sobre neutros: equilibrio ideal'); }
  else if (accents.length === 2) {
    const hd = hueDiff(lch(accents[0]).H, lch(accents[1]).H);
    if (hd < 35) { harm = 0.95; note(good, 0.7, 'Colores análogos que armonizan'); }
    else if (hd > 150) { harm = muted(accents[0]) || muted(accents[1]) ? 0.9 : 0.7; note(good, 0.5, 'Contraste complementario'); }
    else if (muted(accents[0]) && muted(accents[1])) harm = 0.75;
    else { harm = hd < 60 ? 0.6 : 0.5; note(bad, 0.7, 'Dos colores vivos que chocan entre sí'); }
  } else {
    harm = accents.every(muted) ? 0.6 : 0.35;
    note(bad, 1, `Demasiados colores (${accents.length}); limita a 1-2 acentos`);
  }
  const upper = o.outer || o.mid || o.top;
  let cFit = 0.7;
  if (upper && o.bottom) {
    const dL = Math.abs(lch(hexOf(upper)).L - lch(hexOf(o.bottom)).L);
    const pref = pro.contrast || seasonContrast(pro.season);
    cFit = pref === 'alto' ? clamp(0.4 + dL / 50) : pref === 'bajo' ? clamp(1.1 - dL / 60) : clamp(1 - Math.abs(dL - 30) / 45);
    if (cFit > 0.85) note(good, 0.4, 'El contraste arriba/abajo encaja con tu colorido');
    else if (cFit < 0.45) note(bad, 0.5, pref === 'bajo' ? 'Contraste demasiado fuerte para tu colorido suave' : 'Falta contraste para tu colorido');
  }
  let sColor = 25 * (0.7 * harm + 0.3 * cFit);
  const denims = ps.filter((it) => it.material === 'denim');
  if (denims.length >= 2 && deltaE(hexOf(denims[0]), hexOf(denims[1])) < 14) { sColor -= 6; note(bad, 0.8, 'Denim con denim del mismo tono'); }
  if (o.shoes && o.bottom && pro && occ.target >= 4) {
    const sf = colorFamily(hexOf(o.shoes)), bf = colorFamily(hexOf(o.bottom));
    if ((sf === 'marrón' || sf === 'camel') && bf === 'negro') { sColor -= 3; note(bad, 0.4, 'Zapato marrón con pantalón negro en contexto formal'); }
  }
  const patterned = ps.filter((it) => PATTERNED.has(it.pattern));
  if (patterned.length > 1) { sColor -= 7; note(bad, 0.9, 'Más de un estampado compitiendo'); }
  if (ps.some((it) => it.pattern === 'logo') && occ.target >= 3) { sColor -= 4; note(bad, 0.5, 'Logos o gráficos restan elegancia'); }

  // 3. Paleta personal (15)
  let sPal = 15 * 0.65;
  if (pro.season && SEASONS[pro.season]) {
    const face = [];
    if (o.outer) face.push([o.outer, 0.35]);
    if (o.mid) face.push([o.mid, 0.45]);
    if (o.top) face.push([o.top, o.mid ? 0.2 : 0.45]);
    const tw = face.reduce((s, [, w]) => s + w, 0) || 1;
    const fit = face.reduce((s, [it, w]) => s + paletteFit(hexOf(it), pro.season) * w, 0) / tw;
    sPal = 15 * fit;
    if (fit > 0.85) note(good, 0.8, `Colores junto a la cara ideales para ${SEASONS[pro.season].name}`);
    else if (fit < 0.45) note(bad, 0.8, `El color cerca de la cara no favorece a tu estación (${SEASONS[pro.season].name})`);
  }

  // 4. Clima (15)
  const W = warmthOf(o.top) + warmthOf(o.mid) + warmthOf(o.outer);
  const target = warmthTarget(t);
  const d = W - target;
  let wFit = clamp(1 - Math.abs(d) / (d < 0 ? 2.5 : 3.5));
  let extra = 0;
  if (d < -2) { note(bad, 1, `Vas a pasar frío (${Math.round(t)}°)`); extra -= Math.min(22, (-d - 2) * 5); }
  else if (d > 2.5) note(bad, 0.8, `Demasiado abrigo para ${Math.round(t)}°`);
  else note(good, 0.6, `Abrigo adecuado para ${Math.round(t)}°`);
  if (o.bottom?.sub === 'bermuda' && t < 20) { wFit -= 0.5; extra -= t < 16 ? 14 : 5; note(bad, 0.8, 'Bermudas con poca temperatura'); }
  if (o.bottom && o.bottom.sub !== 'bermuda' && t >= 30 && o.bottom.material !== 'lino') wFit -= 0.15;
  if (ps.some((it) => it.material === 'lino') && t < 16) wFit -= 0.2;
  if (ps.some((it) => ['lana', 'cachemira', 'pana', 'franela'].includes(it.material)) && t > 25) { wFit -= 0.3; note(bad, 0.5, 'Tejidos de invierno con calor'); }
  if (o.shoes && ['sandalia', 'alpargata'].includes(o.shoes.sub) && (rain || t < 18)) { wFit -= 0.5; note(bad, 0.7, 'Calzado abierto con frío o lluvia'); }
  if (rain) {
    if (o.shoes?.material === 'ante') { wFit -= 0.3; note(bad, 0.7, 'Ante con lluvia: se estropea'); }
    if (o.shoes && ['bota', 'chelsea'].includes(o.shoes.sub) && o.shoes.material !== 'ante') { wFit += 0.1; note(good, 0.5, 'Calzado apto para lluvia'); }
    if (o.outer?.waterproof) note(good, 0.6, 'Capa exterior impermeable');
    else if (t < 20) wFit -= 0.15;
  }
  const sWeather = 15 * clamp(wFit);

  // 5. Cuerpo (10)
  let b = 0.75;
  const bt = pro.bodyType;
  const upL = upper ? lch(hexOf(upper)).L : 50, lowL = o.bottom ? lch(hexOf(o.bottom)).L : 50;
  const topFit = (o.mid || o.top)?.fit;
  if (bt === 'oval') {
    if ([o.top, o.mid].some((it) => it?.pattern === 'rayas')) { b -= 0.3; note(bad, 0.6, 'Las rayas arriba ensanchan la zona media'); }
    if (upL - lowL > 40) { b -= 0.25; note(bad, 0.5, 'El corte de color claro/oscuro marca la cintura'); }
    if (topFit === 'slim') b -= 0.25;
    if (o.outer && OPEN_LAYERS.has(o.outer.sub)) { b += 0.2; note(good, 0.6, 'Capa abierta que crea línea vertical y estiliza'); }
    if (upL < 40) b += 0.1;
  } else if (bt === 'triangulo') {
    if (upL < 35 && lowL > 65) { b -= 0.35; note(bad, 0.6, 'Oscuro arriba y claro abajo acentúa la cadera'); }
    if (o.outer && STRUCTURED.has(o.outer.sub)) { b += 0.2; note(good, 0.6, 'Chaqueta estructurada que ensancha hombros'); }
    if (PATTERNED.has(o.bottom?.pattern)) b -= 0.2;
  } else if (bt === 'triangulo_invertido') {
    if (o.bottom?.fit === 'slim' && o.bottom?.sub === 'vaquero') { b -= 0.15; note(bad, 0.4, 'Pitillo desequilibra unos hombros anchos'); }
    if (['cuadros', 'estampado'].includes((o.mid || o.top)?.pattern)) b -= 0.1;
    if (lowL > upL + 10) { b += 0.1; note(good, 0.4, 'Más luz abajo equilibra tus hombros'); }
  } else if (bt === 'rectangulo') {
    if (o.outer || o.mid) { b += 0.2; note(good, 0.5, 'Las capas aportan estructura a tu silueta'); }
  } else if (bt === 'trapecio') b += 0.15;
  const hc = heightClass(pro.height);
  if (hc === 'bajo') {
    if (Math.abs(upL - lowL) < 22) { b += 0.15; note(good, 0.5, 'Columna de color que alarga la figura'); }
    if (topFit === 'relaxed') b -= 0.15;
    if (o.outer && ['abrigo', 'gabardina', 'parka'].includes(o.outer.sub) && o.outer.length === 'largo') b -= 0.1;
  } else if (hc === 'alto' && Math.abs(upL - lowL) > 30) b += 0.08;
  const sBody = 10 * clamp(b);

  // 6. Estilo (5)
  let sStyle = 3.5;
  if (pro.styles?.length) {
    const tagged = ps.filter((it) => it.styles?.length);
    if (tagged.length) {
      const m = tagged.filter((it) => it.styles.some((s) => pro.styles.includes(s))).length / tagged.length;
      sStyle = 5 * (0.4 + 0.6 * m);
      if (m > 0.7) note(good, 0.4, 'Fiel a tu estilo');
    }
  }

  let score = ((sForm + sColor + sPal + sWeather + sBody + sStyle) * 100) / 90 + extra;

  // Ajustes: aprendizaje y rotación
  if (ctx.fb) {
    let f = 0;
    for (let i = 0; i < ps.length; i++) for (let j = i + 1; j < ps.length; j++) f += ctx.fb[pairKey(ps[i].id, ps[j].id)] || 0;
    if (f) { score += clamp(f * 4, -15, 12); note(f > 0 ? good : bad, 0.7, f > 0 ? 'Combinación que te ha gustado antes' : 'Parecido a algo que descartaste'); }
  }
  if (ctx.rotation) {
    const now = ctx.now || Date.now();
    ps.forEach((it) => {
      const days = it.lastWorn ? (now - it.lastWorn) / 864e5 : 99;
      if (days < 2) score -= 6; else if (days < 4) score -= 3;
      if (!it.wears) score += 1.5;
    });
  }
  if (ctx.bonus) score += ps.reduce((s, it) => s + (ctx.bonus[it.id] || 0), 0);
  ps.forEach((it) => { if (it.favorite) score += 1; });

  const pick = (arr) => arr.sort((x, y) => y[0] - x[0]).slice(0, 3).map((x) => x[1]);
  return { score: Math.round(clamp(score, 0, 100)), good: pick(good), bad: pick(bad), parts: { forma: sForm / 20, color: sColor / 25, paleta: sPal / 15, clima: sWeather / 15, cuerpo: sBody / 10 } };
}

export function slots(items) {
  const usable = items.filter((it) => !it.archived && !it.laundry);
  return {
    top: usable.filter((it) => catOf(it) === 'top' || (catOf(it) === 'mid' && subOf(it).alone)),
    mid: usable.filter((it) => catOf(it) === 'mid'),
    outer: usable.filter((it) => catOf(it) === 'outer'),
    bottom: usable.filter((it) => catOf(it) === 'bottom'),
    shoes: usable.filter((it) => catOf(it) === 'shoes'),
  };
}

/** Genera combinaciones ordenadas. opts: {locked:{slot:item}, count, noise, diverse, all} */
export function generate(items, ctx = {}, opts = {}) {
  const { locked = {}, count = 5, noise = 0, diverse = 2, all = false } = opts;
  const pool = slots(items);
  const occ = OCCASIONS[ctx.occasion || 'casual'];
  const t = ctx.weather?.t ?? 18;
  const okF = (it) => { const [lo, hi] = fRange(it); return hi >= occ.range[0] - 0.6 && lo <= occ.range[1] + 0.6; };
  for (const k of Object.keys(pool)) {
    if (locked[k]) { pool[k] = [locked[k]]; continue; }
    const f = pool[k].filter(okF);
    if (f.length) pool[k] = f;
  }
  if (!pool.top.length || !pool.bottom.length) return [];
  const jitter = () => (noise ? (Math.random() - 0.5) * noise : 0);

  const sc = (o) => scoreOutfit(o, ctx).score + jitter();
  let stage = [];
  for (const top of pool.top) for (const bottom of pool.bottom) {
    if (top.id === bottom.id) continue;
    stage.push({ o: { top, bottom }, s: sc({ top, bottom }) });
  }
  stage = stage.sort((a, b) => b.s - a.s).slice(0, 30);
  if (pool.shoes.length) {
    const next = [];
    for (const { o } of stage) for (const shoes of pool.shoes) next.push({ o: { ...o, shoes }, s: sc({ ...o, shoes }) });
    stage = next.sort((a, b) => b.s - a.s).slice(0, 40);
  }
  const mids = locked.mid ? [locked.mid] : [null, ...(t < 21 ? pool.mid : [])];
  const outers = locked.outer ? [locked.outer] : [null, ...(t < 24 ? pool.outer : pool.outer.filter((x) => warmthOf(x) <= 1.5))];
  const out = [];
  for (const { o } of stage) for (const mid of mids) for (const outer of outers) {
    if (mid && (catOf(o.top) !== 'top' || mid.id === o.top.id)) continue;
    const full = { ...o, ...(mid ? { mid } : {}), ...(outer ? { outer } : {}) };
    const r = scoreOutfit(full, ctx);
    out.push({ items: full, ...r, rank: r.score + jitter() });
  }
  out.sort((a, b) => b.rank - a.rank);
  if (all) return out;
  const chosen = [];
  for (const c of out) {
    const ids = pieces(c.items).map((x) => x.id);
    if (chosen.every((p) => pieces(p.items).filter((x) => ids.includes(x.id)).length <= diverse)) chosen.push(c);
    if (chosen.length >= count) break;
  }
  return chosen;
}

export const outfitIds = (o) => pieces(o).map((x) => x.id);
export function hydrate(saved, byId) {
  const o = {};
  for (const [k, id] of Object.entries(saved.slots || {})) if (byId[id]) o[k] = byId[id];
  return o;
}
export const slotsOf = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v).map(([k, v]) => [k, v.id]));

export function feedbackMap(rows) {
  const m = {};
  rows.forEach((r) => { m[r.key] = (m[r.key] || 0) + r.v; });
  return m;
}
export function feedbackRows(o, v) {
  const ps = pieces(o), rows = [];
  for (let i = 0; i < ps.length; i++) for (let j = i + 1; j < ps.length; j++) rows.push({ key: pairKey(ps[i].id, ps[j].id), v });
  return rows;
}

/** Planifica varios días evitando repetir prendas. reuse=true para maleta (prima repetir). */
export function planDays(items, days, ctxBase, { reuse = false } = {}) {
  const used = {}, plan = [];
  const cat = Object.fromEntries(items.map((it) => [it.id, catOf(it)]));
  days.forEach((day, i) => {
    const bonus = {};
    Object.entries(used).forEach(([id, n]) => {
      const light = ['outer', 'shoes'].includes(cat[id]);
      bonus[id] = reuse ? 4 : light ? -0.5 * n : -5 * n;
    });
    const ctx = { ...ctxBase, weather: day.weather, occasion: day.occasion || ctxBase.occasion, bonus, rotation: !reuse && i === 0 };
    const best = generate(items, ctx, { count: 1, noise: 2 })[0];
    if (best) outfitIds(best.items).forEach((id) => { used[id] = (used[id] || 0) + 1; });
    plan.push({ ...day, outfit: best || null });
  });
  return { plan, packing: Object.keys(used).map(Number) };
}

/** Evalúa una prenda candidata frente al armario. */
export function evaluateCandidate(items, cand, ctx) {
  const c = { ...cand, id: -1 };
  const cat = catOf(c);
  const slot = cat === 'mid' ? (subOf(c).alone ? 'top' : 'mid') : cat;
  const pal = ctx.profile?.season ? paletteFit(hexOf(c), ctx.profile.season) : null;
  const similar = items.filter((it) => it.sub === c.sub && deltaE(hexOf(it), hexOf(c)) < 16);
  const sameCat = items.filter((it) => catOf(it) === cat);
  let combos = [];
  if (['top', 'mid', 'outer', 'bottom', 'shoes'].includes(slot)) {
    combos = generate([...items, c], { ...ctx, rotation: false }, { locked: { [slot]: c }, all: true });
  }
  const goodCombos = combos.filter((x) => x.score >= 72);
  const uniq = new Set(goodCombos.map((x) => outfitIds(x.items).filter((id) => id !== -1).sort().join(','))).size;
  const neutral = isNeutral(hexOf(c));
  let v = 50;
  v += Math.min(uniq, 20) * (similar.length ? 0.5 : 1.2);
  if (pal != null) v += (pal - 0.6) * 40;
  v -= similar.length * 25;
  if (neutral) v += 5;
  if (!sameCat.length) v += 10;
  return {
    score: Math.round(clamp(v, 0, 100)),
    unlocks: uniq,
    best: goodCombos.slice(0, 3),
    similar,
    paletteFit: pal,
    neutral,
  };
}

export function gapAnalysis(items) {
  return ESSENTIALS.map((e) => {
    const re = new RegExp(`^(${e.sub})$`);
    const has = items.some((it) => !it.archived && re.test(it.sub) && (!e.fam || e.fam.includes(colorFamily(hexOf(it)))));
    return { ...e, has };
  });
}

export function missingPaletteColors(items, seasonKey) {
  const s = SEASONS[seasonKey];
  if (!s) return [];
  const upper = items.filter((it) => ['top', 'mid', 'outer'].includes(catOf(it)));
  return s.pal.filter((p) => !upper.some((it) => deltaE(hexOf(it), p) < 18));
}

export function describeItem(it) {
  const col = (it.colors || []).map((c) => c.name).filter(Boolean).join('/') || colorFamily(hexOf(it));
  return `${it.name || subOf(it).name} (${col}${it.pattern && it.pattern !== 'liso' ? `, ${it.pattern}` : ''}${it.material ? `, ${it.material}` : ''})`;
}
