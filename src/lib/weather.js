import { getKV, setKV } from './db';

const WMO = (c) => (c === 0 ? 'Despejado' : c <= 3 ? 'Nubes y claros' : c <= 48 ? 'Niebla' : c <= 57 ? 'Llovizna' : c <= 67 ? 'Lluvia' : c <= 77 ? 'Nieve' : c <= 82 ? 'Chubascos' : c <= 86 ? 'Nieve' : 'Tormenta');
const RAINY = (c) => (c >= 51 && c <= 67) || (c >= 80 && c <= 99);

function position() {
  return new Promise((res) => {
    if (!navigator.geolocation) return res(null);
    navigator.geolocation.getCurrentPosition(
      (p) => res({ lat: p.coords.latitude, lon: p.coords.longitude }),
      () => res(null),
      { timeout: 8000, maximumAge: 3600e3 },
    );
  });
}

export async function geocode(name) {
  const r = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=es`);
  const j = await r.json();
  const g = j.results?.[0];
  return g ? { lat: g.latitude, lon: g.longitude, name: `${g.name}${g.country ? `, ${g.country}` : ''}` } : null;
}

export async function forecast(loc, days = 7) {
  const u = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=temperature_2m,apparent_temperature,weather_code,precipitation&daily=apparent_temperature_max,apparent_temperature_min,temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code&timezone=auto&forecast_days=${days}`;
  const j = await (await fetch(u)).json();
  const daily = j.daily.time.map((date, i) => {
    const hi = j.daily.apparent_temperature_max[i], lo = j.daily.apparent_temperature_min[i];
    const code = j.daily.weather_code[i];
    return {
      date, code, label: WMO(code), max: Math.round(j.daily.temperature_2m_max[i]), min: Math.round(j.daily.temperature_2m_min[i]),
      t: lo + (hi - lo) * 0.6, rain: RAINY(code) || j.daily.precipitation_probability_max[i] >= 55, pop: j.daily.precipitation_probability_max[i],
    };
  });
  return { daily, current: j.current };
}

/** Tiempo de hoy con caché de 30 min. Usa GPS y, si falla, la ciudad guardada. */
export async function todayWeather(force = false) {
  const cached = await getKV('wx');
  if (!force && cached && Date.now() - cached.at < 30 * 60e3) return cached;
  let loc = await position();
  let place = null;
  if (!loc) {
    const city = await getKV('city', 'Madrid');
    const g = await geocode(city);
    if (g) { loc = g; place = g.name; }
  }
  if (!loc) return cached || null;
  try {
    const f = await forecast(loc);
    const today = f.daily[0];
    const cur = f.current;
    const wx = {
      at: Date.now(), loc, place, daily: f.daily,
      t: Math.round(Math.min(cur.apparent_temperature, today.t + 2) * 10) / 10,
      now: Math.round(cur.temperature_2m), rain: today.rain || cur.precipitation > 0.2, label: WMO(cur.weather_code), max: today.max, min: today.min, pop: today.pop,
    };
    await setKV('wx', wx);
    return wx;
  } catch {
    return cached || null;
  }
}
