import { getKV } from './db';
import { splitDataURL } from './image';

export const DEFAULT_MODELS = { text: 'gemini-2.5-flash', image: 'gemini-2.5-flash-image' };
const FALLBACK_TEXT = ['gemini-2.5-flash-lite', 'gemini-flash-lite-latest', 'gemini-flash-latest', 'gemini-2.5-flash'];
const BASE = 'https://generativelanguage.googleapis.com/v1beta/models/';

// Modelos agotados en esta sesión (se reintentan pasada una hora).
const exhausted = {};
const isExhausted = (m) => exhausted[m] && Date.now() - exhausted[m] < 3600e3;

export async function getAIConfig() {
  return {
    key: await getKV('apiKey', ''),
    text: (await getKV('modelText', '')) || DEFAULT_MODELS.text,
    image: (await getKV('modelImage', '')) || DEFAULT_MODELS.image,
  };
}

export class AIError extends Error {
  constructor(msg, { status, quota, model } = {}) {
    super(msg);
    this.status = status;
    this.quota = quota;
    this.model = model;
  }
}

function toParts(parts) {
  return parts.map((p) => (typeof p === 'string'
    ? (p.startsWith('data:') ? { inlineData: splitDataURL(p) } : { text: p })
    : p));
}

function explain(status, json, model) {
  const err = json?.error || {};
  const raw = err.message || '';
  const det = (err.details || []);
  const qv = det.find((d) => d['@type']?.includes('QuotaFailure'))?.violations?.[0];
  const retry = det.find((d) => d['@type']?.includes('RetryInfo'))?.retryDelay;
  if (status === 429) {
    const metric = qv?.quotaMetric || '';
    const perDay = /PerDay|per_day/i.test(metric + (qv?.quotaId || ''));
    const zero = /limit: 0\b/.test(raw);
    let m = `Límite de Gemini alcanzado en ${model}`;
    if (zero) m += ': este modelo no tiene cuota gratuita en tu proyecto (requiere facturación)';
    else if (perDay) m += ': cuota DIARIA agotada (se renueva a las 9:00 hora española)';
    else m += `: límite por minuto${retry ? `, reintenta en ${retry}` : ''}`;
    return new AIError(`${m}.\nGoogle: ${raw.slice(0, 220)}`, { status, quota: zero ? 'zero' : perDay ? 'day' : 'minute', model });
  }
  if (status === 400 && /API key/i.test(raw)) return new AIError('La clave de Gemini no es válida.', { status, model });
  if (status === 404) return new AIError(`El modelo ${model} no existe o ya no está disponible.`, { status, model });
  if (status === 403) return new AIError(`Acceso denegado a ${model}: ${raw.slice(0, 200)}`, { status, model });
  return new AIError(`Gemini (${status}) en ${model}: ${raw.slice(0, 220)}`, { status, model });
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
  if (!res.ok) throw explain(res.status, json, model);
  return json;
}

const textOf = (json) => (json?.candidates?.[0]?.content?.parts || []).filter((p) => !p.thought).map((p) => p.text || '').join('');

// Sin razonamiento interno: gasta muchos menos tokens y es más rápido.
function thinkingOff(model) {
  if (/2\.5-flash/.test(model)) return { thinkingConfig: { thinkingBudget: 0 } };
  if (/gemini-3/.test(model)) return { thinkingConfig: { thinkingLevel: 'low' } };
  return {};
}

export let lastModelUsed = null;

export async function ask(parts, { system, json = false, temperature = 0.4, history } = {}) {
  const { text } = await getAIConfig();
  const chain = [text, ...FALLBACK_TEXT].filter((m, i, a) => a.indexOf(m) === i);
  const ordered = [...chain.filter((m) => !isExhausted(m)), ...chain.filter(isExhausted)];
  const contents = [...(history || []), { role: 'user', parts: toParts(Array.isArray(parts) ? parts : [parts]) }];
  let lastErr;
  for (const model of ordered) {
    const body = {
      contents,
      generationConfig: { temperature, ...thinkingOff(model), ...(json ? { responseMimeType: 'application/json' } : {}) },
    };
    if (system) body.systemInstruction = { parts: [{ text: system }] };
    try {
      const out = textOf(await call(model, body));
      lastModelUsed = model;
      if (!json) return out.trim();
      try {
        return JSON.parse(out.replace(/^```(json)?|```$/g, '').trim());
      } catch {
        throw new AIError('La IA devolvió una respuesta ilegible. Reintenta.');
      }
    } catch (e) {
      lastErr = e;
      if (e.status === 429 || e.status === 404) { exhausted[model] = Date.now(); continue; }
      throw e;
    }
  }
  throw lastErr;
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
