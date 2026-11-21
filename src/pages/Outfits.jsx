import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { Trash2, Plane, CalendarDays, RefreshCw } from 'lucide-react';
import { db } from '../lib/db';
import { OCCASIONS } from '../lib/fashion';
import { generate, hydrate, scoreOutfit, planDays, catOf, subOf } from '../lib/engine';
import { geocode, forecast } from '../lib/weather';
import { useData, Page, OutfitGrid, Thumb, Btn, Empty, useLocal, itemLabel } from '../ui';
import OutfitCard from '../OutfitCard';

const TABS = { crear: 'Crear', guardados: 'Guardados', semana: 'Semana', viaje: 'Viaje', historial: 'Historial' };
const fmtDay = (d) => new Date(`${d}T12:00`).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });

function slotFor(it) {
  const c = catOf(it);
  return c === 'mid' && subOf(it).alone ? 'top' : c;
}

function Create({ occasion }) {
  const { active, byId, profile, weather, fb } = useData();
  const [params] = useSearchParams();
  const initLock = byId[Number(params.get('lock'))];
  const [locks, setLocks] = useState(() => (initLock ? { [slotFor(initLock)]: initLock } : {}));
  const [seed, setSeed] = useState(0);
  const [idx, setIdx] = useState(0);
  const results = useMemo(() => generate(active, { profile, weather, occasion, fb }, { locked: locks, count: 8, noise: seed ? 8 : 0, diverse: 2 }), [active, profile, weather, occasion, fb, locks, seed]);
  const cur = results[idx];
  const toggle = (k) => {
    const n = { ...locks };
    if (n[k]) delete n[k]; else n[k] = cur.items[k];
    setLocks(n);
    setIdx(0);
  };
  if (!cur) return <Empty title="Sin combinaciones">Añade más prendas (arriba, abajo y calzado) para generar outfits.</Empty>;
  return (
    <div className="stack">
      <p className="small muted">Bloquea con el candado las prendas que quieras mantener y pulsa «Otro» para mezclar el resto.</p>
      <OutfitCard key={`${idx}-${seed}`} res={cur} occasion={occasion} locks={locks} onLock={toggle}
        title={`Combinación ${idx + 1}`} onNext={() => { if (idx + 1 < results.length) setIdx(idx + 1); else { setSeed(seed + 1); setIdx(0); } }} />
    </div>
  );
}

function Saved() {
  const { byId, profile, weather, fb } = useData();
  const list = useLiveQuery(() => db.outfits.orderBy('createdAt').reverse().toArray(), [], []);
  const [del, setDel] = useState(null);
  if (!list.length) return <Empty title="Sin outfits guardados">Guarda los que te gusten con el marcador o al pulsar «Me lo pongo».</Empty>;
  return (
    <div className="stack">
      {list.map((o) => {
        const items = hydrate(o, byId);
        if (!Object.keys(items).length) return null;
        const r = scoreOutfit(items, { profile, weather, occasion: o.occasion, fb });
        return (
          <div key={o.id} className="card stack s">
            <div className="row between">
              <span className="small muted">{OCCASIONS[o.occasion]?.name} · {new Date(o.createdAt).toLocaleDateString('es-ES')}</span>
              <span className="row"><span className="score" style={{ fontSize: 17 }}>{r.score}</span>
                {del === o.id
                  ? <Btn className="danger sm" onClick={() => db.outfits.delete(o.id)}>Borrar</Btn>
                  : <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={() => setDel(o.id)}><Trash2 size={14} /></button>}
              </span>
            </div>
            <OutfitGrid outfit={items} />
            {o.tryon && <img src={o.tryon} alt="Probador" style={{ borderRadius: 12 }} />}
          </div>
        );
      })}
    </div>
  );
}

function DayPlan({ plan, packing }) {
  const { byId } = useData();
  return (
    <div className="stack">
      {packing && (
        <div className="card gold">
          <h3>Maleta: {packing.length} prendas</h3>
          <div className="grid3 mt-s">{packing.map((id) => byId[id] && <Thumb key={id} item={byId[id]} badge={itemLabel(byId[id])} />)}</div>
        </div>
      )}
      {plan.map((d) => (
        <div key={d.date} className="card stack s">
          <div className="row between">
            <b style={{ textTransform: 'capitalize' }}>{fmtDay(d.date)}</b>
            <span className="small muted">{d.weather.min}°/{d.weather.max}° · {d.weather.label}{d.weather.rain ? ' ☔' : ''}</span>
          </div>
          {d.outfit ? <><OutfitGrid outfit={d.outfit.items} /><span className="tiny">Puntuación {d.outfit.score} · {d.outfit.good[0] || ''}</span></> : <span className="small muted">Sin combinación posible</span>}
        </div>
      ))}
    </div>
  );
}

function Week({ occasion }) {
  const { active, profile, weather, fb } = useData();
  const [seed, setSeed] = useState(0);
  const res = useMemo(() => {
    if (!weather?.daily) return null;
    const days = weather.daily.map((w) => ({ date: w.date, weather: w }));
    return planDays(active, days, { profile, fb, occasion });
  }, [active, profile, weather, fb, occasion, seed]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!res) return <Empty icon={CalendarDays} title="Sin previsión">Necesito tu ubicación o ciudad (Perfil → Ajustes).</Empty>;
  return (
    <div className="stack">
      <div className="row between"><p className="small muted">7 días sin repetir prendas, según la previsión.</p><button className="icon-btn" onClick={() => setSeed(seed + 1)}><RefreshCw size={16} /></button></div>
      <DayPlan plan={res.plan} />
    </div>
  );
}

function Trip() {
  const { active, profile, fb, notify } = useData();
  const [dest, setDest] = useState('');
  const [start, setStart] = useState(() => new Date().toISOString().slice(0, 10));
  const [days, setDays] = useState(4);
  const [occ, setOcc] = useState('casual');
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState(null);
  const go = async () => {
    setBusy(true);
    try {
      const g = await geocode(dest);
      if (!g) throw new Error('No encuentro ese destino');
      const f = await forecast(g, 16);
      const sel = f.daily.filter((d) => d.date >= start).slice(0, days);
      if (!sel.length) throw new Error('Solo hay previsión para los próximos 16 días');
      const r = planDays(active, sel.map((w) => ({ date: w.date, weather: w })), { profile, fb, occasion: occ }, { reuse: true });
      setRes({ ...r, place: g.name });
    } catch (e) { notify(e.message, true); }
    setBusy(false);
  };
  return (
    <div className="stack">
      <p className="small muted">Maleta mínima: reutiliza prendas que combinan entre sí según el tiempo del destino.</p>
      <input placeholder="Destino (ciudad)" value={dest} onChange={(e) => setDest(e.target.value)} />
      <div className="grid2">
        <label className="field"><span>Salida</span><input type="date" value={start} onChange={(e) => setStart(e.target.value)} /></label>
        <label className="field"><span>Días</span><input type="number" min="1" max="14" value={days} onChange={(e) => setDays(Math.max(1, Math.min(14, Number(e.target.value))))} /></label>
      </div>
      <select value={occ} onChange={(e) => setOcc(e.target.value)}>{Object.entries(OCCASIONS).map(([k, o]) => <option key={k} value={k}>{o.name}</option>)}</select>
      <Btn className="primary" busy={busy} disabled={!dest} onClick={go}><Plane size={16} />Preparar maleta</Btn>
      {res && <><h3>{res.place}</h3><DayPlan plan={res.plan} packing={res.packing} /></>}
    </div>
  );
}

function History() {
  const { byId } = useData();
  const wears = useLiveQuery(() => db.wears.orderBy('date').reverse().limit(60).toArray(), [], []);
  if (!wears.length) return <Empty icon={CalendarDays} title="Sin historial">Cuando pulses «Me lo pongo», quedará registrado aquí.</Empty>;
  return (
    <div className="stack">
      {wears.map((w) => (
        <div key={w.id} className="card stack s">
          <b style={{ textTransform: 'capitalize' }}>{fmtDay(w.date)}</b>
          <div className="outfit">{w.itemIds.map((id) => byId[id] && <Thumb key={id} item={byId[id]} />)}</div>
        </div>
      ))}
    </div>
  );
}

export default function Outfits() {
  const [params] = useSearchParams();
  const [tab, setTab] = useState(params.get('lock') ? 'crear' : 'crear');
  const [occasion, setOccasion] = useLocal('occasion', 'casual');
  return (
    <Page>
      <div className="head"><div><div className="eyebrow">Outfits</div><h1>{TABS[tab]}</h1></div></div>
      <div className="chips">{Object.entries(TABS).map(([k, n]) => <button key={k} className={`chip ${tab === k ? 'on' : ''}`} onClick={() => setTab(k)}>{n}</button>)}</div>
      {(tab === 'crear' || tab === 'semana') && (
        <select className="mt-s" value={occasion} onChange={(e) => setOccasion(e.target.value)}>{Object.entries(OCCASIONS).map(([k, o]) => <option key={k} value={k}>Ocasión: {o.name}</option>)}</select>
      )}
      <div className="mt">
        {tab === 'crear' && <Create occasion={occasion} />}
        {tab === 'guardados' && <Saved />}
        {tab === 'semana' && <Week occasion={occasion} />}
        {tab === 'viaje' && <Trip />}
        {tab === 'historial' && <History />}
      </div>
    </Page>
  );
}
