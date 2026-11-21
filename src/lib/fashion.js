// Conocimiento de moda masculina: taxonomía, color, estaciones, morfología, ocasiones.

export const CATEGORIES = {
  top: 'Parte de arriba',
  mid: 'Capa intermedia',
  outer: 'Chaqueta / abrigo',
  bottom: 'Pantalón',
  shoes: 'Calzado',
  accessory: 'Accesorio',
};

// subtipo: [categoría, nombre, formalidad min, formalidad max, abrigo 0-5, puede ir solo arriba]
const S = (cat, name, lo, hi, warmth, alone = true) => ({ cat, name, f: [lo, hi], warmth, alone });
export const SUBTYPES = {
  camiseta: S('top', 'Camiseta', 1, 3, 1),
  camiseta_ml: S('top', 'Camiseta manga larga', 1, 2, 2),
  camiseta_grafica: S('top', 'Camiseta gráfica/logo', 1, 1.5, 1),
  polo: S('top', 'Polo', 2, 3, 1),
  polo_punto: S('top', 'Polo de punto', 2, 4, 1.5),
  henley: S('top', 'Henley', 1, 2.5, 1.5),
  camisa_oxford: S('top', 'Camisa Oxford', 2, 4, 1.5),
  camisa_vestir: S('top', 'Camisa de vestir', 3.5, 5, 1.5),
  camisa_lino: S('top', 'Camisa de lino', 2, 3.5, 1),
  camisa_franela: S('top', 'Camisa de franela/cuadros', 1.5, 2.5, 2),
  camisa_vaquera: S('top', 'Camisa vaquera', 1.5, 3, 2),
  camisa_cubana: S('top', 'Camisa cuello cubano', 1.5, 3, 1),
  camiseta_tecnica: S('top', 'Camiseta deporte', 1, 1, 1),
  jersey_fino: S('mid', 'Jersey de punto fino', 2.5, 4.5, 2),
  jersey_grueso: S('mid', 'Jersey grueso', 1.5, 3, 3),
  cuello_alto: S('mid', 'Jersey cuello alto', 2.5, 4.5, 3),
  cardigan: S('mid', 'Cárdigan', 2, 3.5, 2, false),
  sudadera: S('mid', 'Sudadera', 1, 2, 2.5),
  sudadera_capucha: S('mid', 'Sudadera con capucha', 1, 1.5, 2.5),
  sobrecamisa: S('mid', 'Sobrecamisa', 1.5, 3, 2),
  chaleco_punto: S('mid', 'Chaleco de punto', 2.5, 4, 1, false),
  americana: S('outer', 'Americana/blazer', 3, 5, 2),
  blazer_casual: S('outer', 'Blazer desestructurado', 2.5, 4, 1.5),
  chaqueta_vaquera: S('outer', 'Chaqueta vaquera', 1, 2.5, 2),
  cazadora_piel: S('outer', 'Cazadora de piel', 1.5, 3, 3),
  bomber: S('outer', 'Bomber', 1, 2.5, 2.5),
  harrington: S('outer', 'Harrington', 2, 3, 2),
  chore: S('outer', 'Chaqueta worker/field', 1.5, 3, 2),
  chaleco_acolchado: S('outer', 'Chaleco acolchado', 1, 3, 2),
  abrigo: S('outer', 'Abrigo de lana', 2, 5, 4),
  gabardina: S('outer', 'Gabardina/trench', 2, 4.5, 3),
  parka: S('outer', 'Parka', 1, 2.5, 4.5),
  plumifero: S('outer', 'Plumífero', 1, 2.5, 5),
  cortavientos: S('outer', 'Cortavientos/técnica', 1, 2, 1.5),
  vaquero: S('bottom', 'Vaquero', 1.5, 3.5, 2),
  chino: S('bottom', 'Chino', 2, 4, 2),
  pantalon_vestir: S('bottom', 'Pantalón de vestir', 3.5, 5, 2),
  pantalon_lino: S('bottom', 'Pantalón de lino', 2, 3.5, 1),
  pana: S('bottom', 'Pantalón de pana', 2, 3.5, 3),
  cargo: S('bottom', 'Cargo', 1, 2, 2),
  jogger: S('bottom', 'Jogger/chándal', 1, 1.5, 2),
  bermuda: S('bottom', 'Bermuda/short', 1, 2.5, 0),
  zapatilla_minimal: S('shoes', 'Zapatilla blanca minimal', 1, 3.5, 0),
  zapatilla: S('shoes', 'Zapatilla casual', 1, 2.5, 0),
  zapatilla_deporte: S('shoes', 'Zapatilla deportiva/running', 1, 1.5, 0),
  mocasin: S('shoes', 'Mocasín', 2.5, 4.5, 0),
  derby_oxford: S('shoes', 'Zapato Oxford/Derby', 3.5, 5, 0),
  chelsea: S('shoes', 'Botín Chelsea', 2, 4, 0),
  bota: S('shoes', 'Bota (desert/worker)', 1.5, 3, 0),
  nautico: S('shoes', 'Náutico', 2, 3, 0),
  alpargata: S('shoes', 'Alpargata', 1, 2.5, 0),
  sandalia: S('shoes', 'Sandalia', 1, 1.5, 0),
  cinturon: S('accessory', 'Cinturón', 1, 5, 0),
  reloj: S('accessory', 'Reloj', 1, 5, 0),
  gorra: S('accessory', 'Gorra', 1, 1.5, 0),
  gorro: S('accessory', 'Gorro', 1, 2.5, 0.5),
  bufanda: S('accessory', 'Bufanda', 2, 4.5, 1),
  gafas: S('accessory', 'Gafas de sol', 1, 4, 0),
  corbata: S('accessory', 'Corbata', 4, 5, 0),
  otro: S('accessory', 'Otro', 1, 5, 0),
};

export const PATTERNS = { liso: 'Liso', textura: 'Textura sutil', rayas: 'Rayas', cuadros: 'Cuadros', estampado: 'Estampado', logo: 'Logo/gráfico' };
export const MATERIALS = ['algodón', 'lino', 'lana', 'cachemira', 'punto', 'denim', 'franela', 'pana', 'piel', 'ante', 'poliéster', 'técnico', 'seda', 'otro'];
export const FITS = { slim: 'Slim', regular: 'Regular', relaxed: 'Relaxed/oversize' };
export const STYLES = {
  clasico: 'Clásico/sartorial', minimal: 'Minimalista', smart: 'Smart casual', street: 'Streetwear',
  workwear: 'Workwear/rugged', mediterraneo: 'Mediterráneo', preppy: 'Preppy', deportivo: 'Deportivo/athleisure', vanguardia: 'Vanguardia/editorial',
};

export const OCCASIONS = {
  casual: { name: 'Casual', target: 2, range: [1, 3] },
  smart: { name: 'Smart casual', target: 3, range: [2, 4] },
  trabajo: { name: 'Oficina', target: 3.5, range: [3, 4.5] },
  cita: { name: 'Cita/cena', target: 3, range: [2.5, 4] },
  noche: { name: 'Salir de noche', target: 2.75, range: [2, 3.75] },
  formal: { name: 'Evento formal', target: 4.75, range: [4, 5] },
  deporte: { name: 'Deporte', target: 1, range: [1, 1.5] },
};

// ---------- Color ----------
export function hexToRgb(hex) {
  const h = (hex || '#888888').replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
export function toLab(hex) {
  const lin = (c) => { c /= 255; return c > 0.04045 ? ((c + 0.055) / 1.055) ** 2.4 : c / 12.92; };
  const [r, g, b] = hexToRgb(hex).map(lin);
  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const x = f((r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047);
  const y = f(r * 0.2126 + g * 0.7152 + b * 0.0722);
  const z = f((r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883);
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}
export function lch(hex) {
  const [L, a, b] = toLab(hex);
  return { L, C: Math.hypot(a, b), H: ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360, a, b };
}
export const deltaE = (h1, h2) => { const p = toLab(h1), q = toLab(h2); return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]); };
export const hueDiff = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };

// Neutros de armario masculino: blanco, negro, grises, marino, beige/camel/caqui, marrón, oliva apagado, denim.
export function isNeutral(hex) {
  const { L, C, H } = lch(hex);
  if (C < 13) return true;
  if (L < 38 && C < 42 && H > 230 && H < 300) return true; // marino
  if (H >= 40 && H <= 105 && C < 38) return true; // beige, camel, caqui, marrón, oliva apagado
  if (H > 235 && H < 285 && C < 30) return true; // denim lavado
  return false;
}
export function colorFamily(hex) {
  const { L, C, H } = lch(hex);
  if (C < 10) return L > 85 ? 'blanco' : L < 22 ? 'negro' : 'gris';
  if (L < 38 && H > 230 && H < 300 && C < 42) return 'marino';
  if (H >= 40 && H <= 105 && C < 38) return L > 65 ? 'beige' : L > 40 ? 'camel' : 'marrón';
  if (H < 20 || H >= 345) return L < 35 ? 'burdeos' : 'rojo';
  if (H < 50) return 'naranja';
  if (H < 100) return 'amarillo';
  if (H < 160) return C < 40 ? 'oliva' : 'verde';
  if (H < 220) return 'turquesa';
  if (H < 300) return 'azul';
  return 'morado';
}

// ---------- 12 estaciones ----------
export const SEASONS = {
  light_spring: { name: 'Primavera clara', u: 'cálido', d: 'claro', c: 'brillante-suave', pal: ['#FFF5E1', '#F4C2A1', '#F7A493', '#F3D36B', '#C8DE8A', '#B6E3D4', '#9AD1E8', '#A7C7E7', '#D9B99B', '#B8AFA6', '#4A6A9A', '#7FA88A'], avoid: ['#000000', '#4B0F1E', '#36454F'] },
  warm_spring: { name: 'Primavera cálida', u: 'cálido', d: 'medio', c: 'brillante', pal: ['#FFF1D6', '#E3B778', '#F28C28', '#FF7F50', '#F6C445', '#7BB661', '#2E8B57', '#40B5AD', '#3F7CAC', '#8B5A2B', '#C04E2B', '#2C3E66'], avoid: ['#000000', '#A9A9B0', '#8E4585'] },
  bright_spring: { name: 'Primavera brillante', u: 'cálido-neutro', d: 'medio', c: 'muy brillante', pal: ['#FFFDF5', '#FF4F5E', '#FF8C42', '#FFD23F', '#00A86B', '#00B5CC', '#1E90FF', '#3949AB', '#2B2B2B', '#1B2A4A', '#C19A6B', '#E04E39'], avoid: ['#A39E93', '#8F9779', '#9C8AA5'] },
  light_summer: { name: 'Verano claro', u: 'frío', d: 'claro', c: 'suave', pal: ['#F5F5F0', '#C9D6E8', '#9DB4D3', '#A7C4BC', '#B5A8D1', '#E8B4C0', '#8E9AAF', '#5B7DB1', '#3E5C76', '#BDB5AA', '#9FB8AD', '#7A8CA8'], avoid: ['#000000', '#F28C28', '#C68E17'] },
  cool_summer: { name: 'Verano frío', u: 'frío', d: 'medio', c: 'suave', pal: ['#F2F3F4', '#A3B8D8', '#6A8EC1', '#3B5998', '#1F3A5F', '#7D8B99', '#4F7C82', '#B03A5B', '#8E7CC3', '#5E6B7A', '#3B4552', '#9AA8B5'], avoid: ['#F28C28', '#C68E17', '#8B4513'] },
  soft_summer: { name: 'Verano suave', u: 'neutro-frío', d: 'medio', c: 'apagado', pal: ['#E8E4DC', '#A9B4AE', '#8A9A9D', '#6E7F80', '#7B8FA6', '#4E5D6C', '#9C8AA5', '#B08A8E', '#6D7F6A', '#A39E93', '#5C6B73', '#3E4A57'], avoid: ['#000000', '#FFFFFF', '#FF4F5E', '#F28C28'] },
  soft_autumn: { name: 'Otoño suave', u: 'neutro-cálido', d: 'medio', c: 'apagado', pal: ['#F0E6D2', '#C8B497', '#A89F80', '#8F9779', '#6B7F5E', '#5E8C82', '#B5835A', '#9C6B4E', '#A0645F', '#7A6A58', '#546A76', '#4A4E3F'], avoid: ['#000000', '#FFFFFF', '#1E90FF', '#E0115F'] },
  warm_autumn: { name: 'Otoño cálido', u: 'cálido', d: 'medio-oscuro', c: 'suave-rico', pal: ['#F3E5C6', '#C19A6B', '#C1662D', '#D4A017', '#6B8E23', '#556B2F', '#1F6F78', '#7B3F00', '#8B4513', '#9E3D22', '#4A3B2A', '#6E5A3C'], avoid: ['#000000', '#FFFFFF', '#B0C4DE', '#E0115F', '#808080'] },
  deep_autumn: { name: 'Otoño profundo', u: 'cálido-neutro', d: 'oscuro', c: 'rico', pal: ['#EFE3C8', '#A0522D', '#8B2500', '#6B4226', '#3E2723', '#4B5320', '#2F4F2F', '#0F4C5C', '#800020', '#C68E17', '#36454F', '#1C1C1C'], avoid: ['#B0C4DE', '#E8B4C0', '#C9D6E8'] },
  deep_winter: { name: 'Invierno profundo', u: 'frío-neutro', d: 'oscuro', c: 'intenso', pal: ['#FFFFFF', '#000000', '#1C1C3C', '#36454F', '#722F37', '#006A4E', '#0F52BA', '#4B0082', '#C41E3A', '#2F4F4F', '#708090', '#1A2E40'], avoid: ['#C19A6B', '#F28C28', '#D4A017', '#F4C2A1'] },
  cool_winter: { name: 'Invierno frío', u: 'frío', d: 'medio-oscuro', c: 'intenso', pal: ['#FFFFFF', '#000000', '#0A1F44', '#4169E1', '#0047AB', '#00827F', '#009B77', '#DC143C', '#8E4585', '#B0C4DE', '#A9A9B0', '#2E2E3A'], avoid: ['#C19A6B', '#F28C28', '#D4A017', '#8B4513'] },
  bright_winter: { name: 'Invierno brillante', u: 'frío-neutro', d: 'medio', c: 'muy brillante', pal: ['#FFFFFF', '#000000', '#1F4FFF', '#00A3E0', '#00A86B', '#E0115F', '#E0002A', '#6A0DAD', '#FFF44F', '#1A1A40', '#808080', '#2B2B2B'], avoid: ['#A39E93', '#8F9779', '#C8B497', '#B5835A'] },
};

// Ajuste de un color a la paleta (0..1). Los neutros universales penalizan menos.
export function paletteFit(hex, seasonKey) {
  const s = SEASONS[seasonKey];
  if (!s || !hex) return 0.6;
  const best = Math.min(...s.pal.map((p) => deltaE(hex, p)));
  const worstHit = Math.min(...s.avoid.map((p) => deltaE(hex, p)));
  let fit = best < 12 ? 1 : best < 22 ? 0.85 : best < 32 ? 0.65 : best < 45 ? 0.45 : 0.3;
  if (worstHit < 10) fit = Math.min(fit, 0.2);
  else if (worstHit < 16) fit = Math.min(fit, 0.4);
  if (isNeutral(hex)) fit = Math.max(fit, 0.55);
  return fit;
}

// Cuestionario de respaldo si no hay selfie.
export function seasonFromQuiz({ undertone, depth, contrast }) {
  if (depth === 'oscuro') return undertone === 'frío' ? 'deep_winter' : 'deep_autumn';
  if (depth === 'claro') return undertone === 'frío' ? 'light_summer' : 'light_spring';
  if (contrast === 'alto') return undertone === 'frío' ? 'bright_winter' : undertone === 'cálido' ? 'bright_spring' : 'bright_winter';
  if (contrast === 'bajo') return undertone === 'frío' ? 'soft_summer' : undertone === 'cálido' ? 'soft_autumn' : 'soft_summer';
  if (undertone === 'cálido') return 'warm_autumn';
  if (undertone === 'frío') return 'cool_summer';
  return 'soft_autumn';
}

// ---------- Morfología ----------
export const BODY_TYPES = {
  trapecio: { name: 'Trapecio', tip: 'Proporciones equilibradas: casi todo te sienta bien. Prioriza cortes slim/regular que marquen la V natural.' },
  triangulo_invertido: { name: 'Triángulo invertido', tip: 'Hombros y pecho anchos. Evita hombreras y estampados en hombros; equilibra con pantalón recto (no pitillo) y tonos algo más claros abajo.' },
  rectangulo: { name: 'Rectángulo', tip: 'Hombros, cintura y cadera similares. Crea estructura con capas, americanas, sobrecamisas y contraste arriba/abajo.' },
  triangulo: { name: 'Triángulo', tip: 'Cadera/cintura más anchas que hombros. Ensancha hombros con chaquetas estructuradas y colores claros o estampados arriba; oscuro y liso abajo.' },
  oval: { name: 'Oval', tip: 'Volumen en la zona media. Colores oscuros y lisos arriba, líneas verticales, capas abiertas, corte regular (ni ceñido ni enorme) y poco contraste en la cintura.' },
};

export function bodyTypeFromMeasures({ chest, waist, hips }) {
  if (!chest || !waist) return null;
  hips = hips || waist;
  if (waist >= chest) return 'oval';
  if (hips > chest + 2) return 'triangulo';
  const drop = chest - waist;
  if (drop >= 16) return 'triangulo_invertido';
  if (drop >= 7) return 'trapecio';
  return 'rectangulo';
}

export const heightClass = (cm) => (!cm ? 'medio' : cm < 170 ? 'bajo' : cm > 184 ? 'alto' : 'medio');

// Prendas esenciales de un armario cápsula masculino (para análisis de huecos).
export const ESSENTIALS = [
  { sub: 'camiseta', fam: ['blanco'], label: 'Camiseta blanca lisa de calidad' },
  { sub: 'camiseta', fam: ['marino', 'negro', 'gris'], label: 'Camiseta lisa oscura' },
  { sub: 'camisa_oxford', fam: ['blanco', 'azul'], label: 'Camisa Oxford blanca o azul claro' },
  { sub: 'polo_punto|polo', fam: ['marino', 'blanco', 'beige'], label: 'Polo (mejor de punto) neutro' },
  { sub: 'jersey_fino|cuello_alto', fam: ['marino', 'gris', 'negro', 'camel'], label: 'Jersey de punto fino neutro' },
  { sub: 'sudadera|sobrecamisa|jersey_grueso', fam: ['gris', 'marino', 'oliva', 'beige'], label: 'Capa casual (sudadera gris o sobrecamisa)' },
  { sub: 'vaquero', fam: ['marino', 'azul', 'negro'], label: 'Vaquero oscuro corte recto/slim' },
  { sub: 'chino', fam: ['beige', 'camel', 'marino', 'oliva', 'gris'], label: 'Chino beige o marino' },
  { sub: 'pantalon_vestir', fam: ['gris', 'marino', 'negro'], label: 'Pantalón de vestir gris o marino' },
  { sub: 'americana|blazer_casual', fam: ['marino', 'gris', 'camel', 'marrón'], label: 'Americana marino desestructurada' },
  { sub: 'abrigo|gabardina', fam: ['camel', 'marino', 'gris', 'negro', 'beige'], label: 'Abrigo de lana o gabardina' },
  { sub: 'chaqueta_vaquera|bomber|harrington|chore|cazadora_piel', fam: null, label: 'Chaqueta casual de entretiempo' },
  { sub: 'zapatilla_minimal', fam: ['blanco'], label: 'Zapatilla blanca minimalista de piel' },
  { sub: 'chelsea|bota', fam: ['marrón', 'negro', 'camel'], label: 'Botín Chelsea o bota de ante/piel' },
  { sub: 'mocasin|derby_oxford', fam: ['marrón', 'negro', 'burdeos'], label: 'Zapato de vestir o mocasín marrón' },
];

export const tempLabel = (t) => (t >= 26 ? 'calor' : t >= 20 ? 'templado' : t >= 15 ? 'fresco' : t >= 9 ? 'frío' : 'mucho frío');
