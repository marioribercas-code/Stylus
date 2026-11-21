import { getKV } from './db';
import { splitDataURL } from './image';

export const DEFAULT_MODELS = { text: 'gemini-2.5-flash', image: 'gemini-2.5-flash-image' };
const BASE = 'https://generativelanguage.googleapis.com/v1beta/models/';

export async function getAIConfig() {
  return {
    key: await getKV('apiKey', ''),
    text: (await getKV('modelText', '')) || DEFAULT_MODELS.text,
    image: (await getKV('modelImage', '')) || DEFAULT_MODELS.image,
  };
}

export class AIError extends Error {}

function toParts(parts) {
  return parts.map((p) => (typeof p === 'string'
    ? (p.startsWith('data:') ? { inlineData: splitDataURL(p) } : { text: p })
    : p));
}

async function call(model, body) {
  const { key } = await getAIConfig();
  if (!key) throw new AIError('Falta la clave de Gemini. Añádela en Perfil → Ajustes.');
  let res;
  try {
    res = await fetch(`${BASE}${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify(body),
    });
  } catch {
    throw new AIError('Sin conexión con Gemini. Revisa internet.');
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const m = json?.error?.message || res.statusText;
    if (res.status === 429) throw new AIError('Límite de uso de Gemini alcanzado. Espera un minuto.');
    if (res.status === 400 && /API key/i.test(m)) throw new AIError('La clave de Gemini no es válida.');
    throw new AIError(`Gemini: ${m}`);
  }
  return json;
}

const textOf = (json) => (json?.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('');

export async function ask(parts, { system, json = false, temperature = 0.4, history } = {}) {
  const { text } = await getAIConfig();
  const contents = [...(history || []), { role: 'user', parts: toParts(Array.isArray(parts) ? parts : [parts]) }];
  const body = {
    contents,
    generationConfig: { temperature, ...(json ? { responseMimeType: 'application/json' } : {}) },
  };
  if (system) body.systemInstruction = { parts: [{ text: system }] };
  const out = textOf(await call(text, body));
  if (!json) return out.trim();
  try {
    return JSON.parse(out.replace(/^```(json)?|```$/g, '').trim());
  } catch {
    throw new AIError('La IA devolvió una respuesta ilegible. Reintenta.');
  }
}

export async function generateImage(parts) {
  const { image } = await getAIConfig();
  const json = await call(image, {
    contents: [{ role: 'user', parts: toParts(parts) }],
    generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
  });
  const p = (json?.candidates?.[0]?.content?.parts || []).find((x) => x.inlineData);
  if (!p) throw new AIError(textOf(json) || 'El modelo no devolvió imagen.');
  return `data:${p.inlineData.mimeType};base64,${p.inlineData.data}`;
}
