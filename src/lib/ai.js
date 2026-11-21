import { ask, generateImage } from './gemini';
import { SUBTYPES, PATTERNS, MATERIALS, STYLES, SEASONS, BODY_TYPES, OCCASIONS } from './fashion';
import { describeItem, subOf } from './engine';
import { compress } from './image';

const SUB_KEYS = Object.keys(SUBTYPES).join('|');
const STYLE_KEYS = Object.keys(STYLES).join('|');
const SEASON_KEYS = Object.keys(SEASONS).join('|');

const STYLIST = `Eres STYLUS, estilista personal masculino experto (sastrería, colorimetría de 12 estaciones, morfología masculina, tejidos, dress codes y tendencias actuales). Respondes en español de España, directo y concreto, sin relleno. Justificas con criterios de moda reales (proporción, color, formalidad, tejido, clima). Nunca inventas prendas del armario: solo usas las que se te dan, referenciándolas como [#id].`;

const ITEM_SCHEMA = `{"sub":"${SUB_KEYS}","name":"nombre corto descriptivo en español (p.ej. 'Camisa Oxford azul cielo')","colors":[{"hex":"#RRGGBB","name":"nombre del color","pct":0-100}],"pattern":"${Object.keys(PATTERNS).join('|')}","material":"${MATERIALS.join('|')}","fit":"slim|regular|relaxed","formality":1-5,"warmth":0-5,"styles":["${STYLE_KEYS}"],"waterproof":bool,"length":"corto|normal|largo","brand":"si se ve, si no null","notes":"detalle clave (cuello, lavado, textura, calidad aparente)"}`;

/** Reconoce una o varias prendas en una foto. Devuelve lista con box_2d para recortar. */
export async function recognizeGarments(photo) {
  const small = await compress(photo, 1024, 0.85);
  const r = await ask([
    small,
    `Identifica TODAS las prendas o calzados de hombre visibles como artículos sueltos (si es una persona vestida, cada prenda por separado; ignora fondo). Para cada una devuelve box_2d [ymin,xmin,ymax,xmax] normalizado 0-1000 y los atributos. Colores: hex medido sobre el tejido real compensando la iluminación (no sombras ni reflejos), el principal primero. formality: 1 deporte,2 casual,3 smart casual,4 business,5 formal. warmth: abrigo que aporta 0-5. JSON: {"items":[{"box_2d":[..],...${ITEM_SCHEMA.slice(1)}]}`,
  ], { json: true, temperature: 0.1 });
  return (r.items || []).filter((x) => SUBTYPES[x.sub]);
}

export async function describeFromText(text) {
  const r = await ask(`Prenda de hombre descrita por el usuario: "${text}". Infiere sus atributos realistas. JSON: ${ITEM_SCHEMA}`, { json: true, temperature: 0.2 });
  return SUBTYPES[r.sub] ? r : { ...r, sub: 'otro' };
}

/** Escáner: foto de cuerpo entero + selfie + medidas opcionales. */
export async function analyzeBody({ bodyPhoto, selfie, height, weight, chest, waist, hips, extra }) {
  const parts = [];
  if (bodyPhoto) parts.push('FOTO 1 (cuerpo entero):', await compress(bodyPhoto, 1024));
  if (selfie) parts.push('FOTO 2 (rostro con luz natural):', await compress(selfie, 900));
  parts.push(`Analiza como asesor de imagen masculino profesional. Datos: altura ${height || '?'} cm, peso ${weight || '?'} kg, pecho ${chest || '?'} cm, cintura ${waist || '?'} cm, cadera ${hips || '?'} cm. ${extra || ''}
Determina: morfología (${Object.keys(BODY_TYPES).join('|')}), complexión, forma de cara (ovalada|redonda|cuadrada|rectangular|triangular|diamante|corazón), subtono de piel (cálido|frío|neutro) observando piel, venas, ojos, pelo y barba, profundidad (claro|medio|oscuro), contraste natural (bajo|medio|alto), y estación de color de 12. Compensa la temperatura de color de la luz de la foto. Si algo no se puede ver, dilo en confidence baja.
JSON: {"bodyType":"..","build":"delgado|atlético|medio|robusto","faceShape":"..","undertone":"..","depth":"..","contrast":"..","season":"${SEASON_KEYS}","seasonAlt":"segunda estación más probable","confidence":0-1,"hair":"..","eyes":"..","skin":"..","bestColors":[{"hex":"#..","name":".."}] (10),"avoidColors":[{"hex":"#..","name":".."}] (5),"neutrals":["mejores neutros"],"fits":"cortes y patrones que le favorecen","necklines":"cuellos","patterns":"estampados y escala","lengths":"largos de chaqueta/pantalón/bajo","avoid":"qué evitar","grooming":"pelo/barba/gafas que le favorecen","styles":["${STYLE_KEYS}"] (2-3 recomendados),"summary":"3-4 frases"}`);
  return ask(parts, { json: true, temperature: 0.2 });
}

const profileLine = (p) => p ? `Perfil: ${p.height || '?'}cm, ${p.weight || '?'}kg, morfología ${BODY_TYPES[p.bodyType]?.name || '?'}, estación ${SEASONS[p.season]?.name || '?'}, contraste ${p.contrast || '?'}, estilos ${(p.styles || []).map((s) => STYLES[s]).join(', ') || '?'}.${p.analysis?.avoid ? ` Evitar: ${p.analysis.avoid}.` : ''}` : 'Perfil: sin escanear.';
const wardrobeLines = (items) => items.filter((i) => !i.archived).map((i) => `#${i.id} ${subOf(i).name}: ${describeItem(i)} F${i.formality || '?'}`).join('\n');

export async function critiqueOutfit(outfit, { profile, weather, occasion, engine }) {
  const ps = Object.entries(outfit).filter(([, v]) => v);
  const parts = [];
  for (const [slot, it] of ps) parts.push(`${slot}: [#${it.id}] ${describeItem(it)}`, await compress(it.photo, 384, 0.7));
  parts.push(`${profileLine(profile)} Ocasión: ${OCCASIONS[occasion]?.name}. Tiempo: ${weather ? `${Math.round(weather.t)}°C${weather.rain ? ', lluvia' : ''}` : '?'}.
Puntuación del motor: ${engine.score}/100. A favor: ${engine.good.join('; ')}. En contra: ${engine.bad.join('; ') || 'nada'}.
Da tu veredicto como estilista en máximo 90 palabras: nota del 1 al 10, qué funciona, y UNA mejora concreta (cambiar una prenda por otra del armario si procede, o cómo llevarlo: remangar, meter la camisa, cinturón, accesorio).`);
  return ask(parts, { system: STYLIST, temperature: 0.5 });
}

export async function chat(history, text, { items, profile, weather }) {
  const system = `${STYLIST}\n${profileLine(profile)}\nTiempo hoy: ${weather ? `${Math.round(weather.t)}°C, ${weather.label}` : 'desconocido'}.\nARMARIO:\n${wardrobeLines(items) || '(vacío)'}`;
  const h = history.slice(-10).map((m) => ({ role: m.role === 'me' ? 'user' : 'model', parts: [{ text: m.text }] }));
  return ask(text, { system, history: h, temperature: 0.7 });
}

export async function verdictPurchase(cand, ev, { items, profile }) {
  return ask(`${profileLine(profile)}
Quiere comprar: ${describeItem(cand)} (${subOf(cand).name})${cand.price ? `, ${cand.price}€` : ''}.
Datos del motor: combina bien con su armario en ${ev.unlocks} outfits nuevos; encaje con su paleta ${ev.paletteFit == null ? 'desconocido' : `${Math.round(ev.paletteFit * 100)}%`}; prendas casi iguales que ya tiene: ${ev.similar.map((s) => `[#${s.id}] ${s.name}`).join(', ') || 'ninguna'}; puntuación ${ev.score}/100.
Armario resumido:\n${wardrobeLines(items).slice(0, 3500)}
Responde en máximo 110 palabras: veredicto en la primera línea ("✅ Cómpralo", "🤔 Piénsalo" o "❌ No lo compres"), por qué, con qué prendas suyas [#id] combinarla, y si no conviene, qué versión (color/corte/tejido) sería mejor para él.`, { system: STYLIST, temperature: 0.4 });
}

export async function shoppingIdeas({ items, profile, gaps, budget, focus }) {
  return ask(`${profileLine(profile)}
Huecos detectados en su armario: ${gaps.filter((g) => !g.has).map((g) => g.label).join('; ') || 'ninguno básico'}.
Armario:\n${wardrobeLines(items).slice(0, 3500)}
${focus ? `Busca específicamente: ${focus}.` : ''} Presupuesto orientativo: ${budget || 'medio'}.
Recomienda las 6 compras de MAYOR impacto (las que más combinaciones nuevas desbloquean y mejor le favorecen). JSON: {"ideas":[{"name":"prenda concreta con color, corte y tejido","sub":"${SUB_KEYS}","hex":"#RRGGBB","why":"por qué y con qué [#id] combina","search":"términos de búsqueda en tienda","price":"rango €"}]}`, { system: STYLIST, json: true, temperature: 0.6 });
}

export async function tryOn(bodyPhoto, outfit) {
  const ps = Object.values(outfit).filter(Boolean);
  const parts = [await compress(bodyPhoto, 1024), 'Persona (imagen 1). Prendas a ponerle:'];
  for (const it of ps) parts.push(`${subOf(it).name} – ${describeItem(it)}:`, await compress(it.photo, 640));
  parts.push('Genera una fotografía realista de cuerpo entero de LA MISMA persona de la imagen 1 (misma cara, cuerpo, proporciones, pose aproximada y fondo neutro) vistiendo exactamente estas prendas, con su color, textura y corte reales, con caída y arrugas naturales y bien ajustadas a su talla. Sin texto ni marcas de agua.');
  return generateImage(parts);
}

export async function cleanPhoto(photo) {
  return generateImage([await compress(photo, 900), 'Recorta esta prenda y preséntala como foto de producto de e-commerce: prenda sola, centrada, plana o en maniquí invisible, fondo gris claro uniforme #EDEBE7, misma prenda exacta (color, textura, detalles), sin persona ni sombras duras.']);
}
