import { useEffect, useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Send, Check, X, ExternalLink, ShoppingBag, Trash2 } from 'lucide-react';
import { db, getKV, setKV } from '../lib/db';
import { SUBTYPES, SEASONS, colorFamily } from '../lib/fashion';
import { evaluateCandidate, gapAnalysis, missingPaletteColors } from '../lib/engine';
import { compress } from '../lib/image';
import { chat, recognizeGarments, describeFromText, verdictPurchase, shoppingIdeas } from '../lib/ai';
import { useData, Page, Btn, PhotoPicker, OutfitGrid, Swatch, Thumb, ItemRefText, itemLabel } from '../ui';

const TABS = { chat: 'Chat', comprar: '¿Lo compro?', ideas: 'Qué comprar' };
const QUICK = ['¿Qué me pongo para una boda de día?', '¿Qué prendas de mi armario me sobran o no me favorecen?', 'Hazme 3 looks distintos para una cita', '¿Qué corte de pantalón me favorece más?'];
const shopUrl = (q, site) => `https://www.google.com/search?${site ? '' : 'tbm=shop&'}q=${encodeURIComponent(`${q} hombre${site ? ` site:${site}` : ''}`)}`;

function Chat() {
  const { active, profile, weather, notify } = useData();
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const end = useRef();
  useEffect(() => { getKV('chat', []).then(setMsgs); }, []);
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, busy]);
  const send = async (t) => {
    const q = (t ?? text).trim();
    if (!q || busy) return;
    const next = [...msgs, { role: 'me', text: q }];
    setMsgs(next); setText(''); setBusy(true);
    try {
      const a = await chat(msgs, q, { items: active, profile, weather });
      const all = [...next, { role: 'ai', text: a }].slice(-30);
      setMsgs(all); setKV('chat', all);
    } catch (e) { notify(e.message, true); setMsgs(msgs); setText(q); }
    setBusy(false);
  };
  return (
    <div className="stack">
      {!msgs.length && <div className="stack s">{QUICK.map((q) => <button key={q} className="chip" style={{ whiteSpace: 'normal', textAlign: 'left' }} onClick={() => send(q)}>{q}</button>)}</div>}
      <div className="stack s">
        {msgs.map((m, i) => <div key={i} className={`msg ${m.role}`}>{m.role === 'ai' ? <ItemRefText text={m.text} /> : m.text}</div>)}
        {busy && <div className="msg ai"><span className="spin" style={{ display: 'inline-block' }} /></div>}
        <div ref={end} />
      </div>
      <div className="row" style={{ position: 'sticky', bottom: 'calc(80px + var(--safe-b))' }}>
        <input placeholder="Pregunta a tu estilista…" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} />
        <button className="icon-btn" style={{ background: 'var(--gold)', color: '#19150c' }} onClick={() => send()}><Send size={18} /></button>
      </div>
      {!!msgs.length && <button className="tiny" onClick={() => { setMsgs([]); setKV('chat', []); }}>Borrar conversación</button>}
    </div>
  );
}

function Buy() {
  const { active, profile, weather, notify } = useData();
  const [cand, setCand] = useState(null);
  const [text, setText] = useState('');
  const [price, setPrice] = useState('');
  const [ev, setEv] = useState(null);
  const [verdict, setVerdict] = useState('');
  const [busy, setBusy] = useState('');

  const evaluate = async (c) => {
    const e = evaluateCandidate(active, c, { profile, weather, occasion: 'smart' });
    setCand(c); setEv(e); setVerdict(''); setBusy('ai');
    try { setVerdict(await verdictPurchase(c, e, { items: active, profile })); } catch (er) { notify(er.message, true); }
    setBusy('');
  };
  const fromPhoto = async (file) => {
    setBusy('scan');
    try {
      const photo = await compress(file, 1200);
      const [g] = await recognizeGarments(photo);
      if (!g) throw new Error('No reconozco ninguna prenda en la imagen');
      const { box_2d: _b, ...attrs } = g;
      await evaluate({ ...attrs, category: SUBTYPES[attrs.sub].cat, photo: await compress(photo, 700), price: Number(price) || null });
    } catch (e) { notify(e.message, true); setBusy(''); }
  };
  const fromText = async () => {
    setBusy('scan');
    try { const r = await describeFromText(text); await evaluate({ ...r, category: SUBTYPES[r.sub].cat, price: Number(price) || null }); } catch (e) { notify(e.message, true); setBusy(''); }
  };

  return (
    <div className="stack">
      <p className="small muted">Haz foto a la prenda en la tienda, sube una captura de la web o descríbela. Te digo si te favorece, con cuántas cosas tuyas combina y si ya tienes algo igual.</p>
      <PhotoPicker onPick={fromPhoto} label="Foto prenda" galleryLabel="Captura" />
      <div className="row">
        <input placeholder="o descríbela: «cárdigan verde botella de lana»" value={text} onChange={(e) => setText(e.target.value)} />
        <input style={{ width: 90 }} type="number" placeholder="€" value={price} onChange={(e) => setPrice(e.target.value)} />
      </div>
      <Btn busy={busy === 'scan'} disabled={!text} onClick={fromText}>Evaluar descripción</Btn>
      {busy === 'scan' && <p className="small gold">Analizando prenda…</p>}
      {cand && ev && (
        <div className="card gold stack">
          <div className="row" style={{ alignItems: 'flex-start' }}>
            <div style={{ width: 90 }}><Thumb item={cand} /></div>
            <div className="grow stack s">
              <b>{itemLabel(cand)}</b>
              <div className="row"><Swatch hex={cand.colors?.[0]?.hex} /><span className="small">{cand.colors?.[0]?.name || colorFamily(cand.colors?.[0]?.hex)}</span></div>
              <div className="score">{ev.score}<span className="tiny"> /100</span></div>
            </div>
          </div>
          <div className="grid2 small">
            <div className="card" style={{ padding: 10 }}><b>{ev.unlocks}</b> outfits nuevos</div>
            <div className="card" style={{ padding: 10 }}>{ev.paletteFit == null ? 'Haz el escáner' : <><b>{Math.round(ev.paletteFit * 100)}%</b> encaje con tu color</>}</div>
          </div>
          {!!ev.similar.length && <div className="tag warn">Ya tienes {ev.similar.length} prenda(s) casi igual(es): {ev.similar.map(itemLabel).join(', ')}</div>}
          {busy === 'ai' && <p className="row small gold"><span className="spin" />El estilista está valorándola…</p>}
          {verdict && <p className="small" style={{ whiteSpace: 'pre-wrap' }}><ItemRefText text={verdict} /></p>}
          {!!ev.best.length && <><h3>Así la combinarías</h3>{ev.best.map((b, i) => <OutfitGrid key={i} outfit={b.items} />)}</>}
          <div className="row">
            <Btn className="grow sm" onClick={async () => { await db.wishlist.add({ ...cand, eval: ev.score, createdAt: Date.now() }); notify('Añadida a tu lista de deseos'); }}><ShoppingBag size={16} />A deseos</Btn>
            <Btn className="primary grow sm" onClick={async () => { await db.items.add({ ...cand, createdAt: Date.now(), wears: 0 }); notify('¡Añadida a tu armario!'); setCand(null); }}><Check size={16} />La he comprado</Btn>
          </div>
        </div>
      )}
    </div>
  );
}

function Ideas() {
  const { active, profile, weather, notify } = useData();
  const wish = useLiveQuery(() => db.wishlist.toArray(), [], []);
  const [ideas, setIdeas] = useState(null);
  const [busy, setBusy] = useState(false);
  const [budget, setBudget] = useState('medio');
  const [focus, setFocus] = useState('');
  const gaps = gapAnalysis(active);
  const missing = missingPaletteColors(active, profile.season);
  useEffect(() => { getKV('ideas').then((x) => x && setIdeas(x)); }, []);
  const run = async () => {
    setBusy(true);
    try {
      const r = await shoppingIdeas({ items: active, profile, gaps, budget, focus });
      const scored = (r.ideas || []).map((x) => {
        const c = { sub: SUBTYPES[x.sub] ? x.sub : 'otro', colors: [{ hex: x.hex || '#808080', name: '' }], name: x.name };
        return { ...x, unlocks: evaluateCandidate(active, c, { profile, weather, occasion: 'smart' }).unlocks };
      }).sort((a, b) => b.unlocks - a.unlocks);
      setIdeas(scored); setKV('ideas', scored);
    } catch (e) { notify(e.message, true); }
    setBusy(false);
  };
  const ok = gaps.filter((g) => g.has).length;
  return (
    <div className="stack">
      <div className="card">
        <div className="row between"><h3>Básicos del armario cápsula</h3><span className="gold small">{ok}/{gaps.length}</span></div>
        <div className="bar mt-s"><i style={{ width: `${(ok / gaps.length) * 100}%` }} /></div>
        <ul className="stack s mt" style={{ listStyle: 'none' }}>
          {gaps.map((g) => <li key={g.label} className="row small">{g.has ? <Check size={15} color="var(--ok)" /> : <X size={15} color="var(--txt3)" />}<span className={g.has ? 'muted' : ''}>{g.label}</span></li>)}
        </ul>
      </div>
      {!!missing.length && (
        <div className="card">
          <h3>Colores de tu paleta que no tienes</h3>
          <p className="tiny">{SEASONS[profile.season].name} · ideales para prendas de arriba</p>
          <div className="row wrap mt-s">{missing.map((h) => <Swatch key={h} hex={h} size="l" />)}</div>
        </div>
      )}
      <div className="card stack">
        <h3>Recomendaciones de compra con IA</h3>
        <input placeholder="Opcional: qué buscas (p.ej. «algo para bodas», «zapatillas»)" value={focus} onChange={(e) => setFocus(e.target.value)} />
        <div className="seg">{['bajo', 'medio', 'alto'].map((b) => <button key={b} className={budget === b ? 'on' : ''} onClick={() => setBudget(b)}>Presupuesto {b}</button>)}</div>
        <Btn className="primary" busy={busy} onClick={run}>Recomiéndame qué comprar</Btn>
      </div>
      {ideas?.map((x, i) => (
        <div key={i} className="card stack s">
          <div className="row"><Swatch hex={x.hex} size="l" /><div className="grow"><b>{x.name}</b><div className="tiny">{x.price} · desbloquea {x.unlocks} outfits</div></div></div>
          <p className="small muted"><ItemRefText text={x.why} /></p>
          <div className="row wrap">
            <a className="chip" href={shopUrl(x.search)} target="_blank" rel="noreferrer"><ExternalLink size={13} />Google Shopping</a>
            <a className="chip" href={shopUrl(x.search, 'zara.com')} target="_blank" rel="noreferrer">Zara</a>
            <a className="chip" href={shopUrl(x.search, 'massimodutti.com')} target="_blank" rel="noreferrer">Massimo Dutti</a>
            <a className="chip" href={shopUrl(x.search, 'uniqlo.com')} target="_blank" rel="noreferrer">Uniqlo</a>
          </div>
        </div>
      ))}
      {!!wish.length && (
        <div className="card stack s">
          <h3>Lista de deseos</h3>
          {wish.map((w) => (
            <div key={w.id} className="row">
              <div style={{ width: 54 }}><Thumb item={w} /></div>
              <div className="grow small"><b>{itemLabel(w)}</b><div className="tiny">Nota {w.eval}/100{w.price ? ` · ${w.price} €` : ''}</div></div>
              <button className="icon-btn" onClick={async () => { const { id, eval: _e, ...rest } = w; await db.items.add({ ...rest, createdAt: Date.now(), wears: 0 }); await db.wishlist.delete(id); notify('Movida al armario'); }}><Check size={16} /></button>
              <button className="icon-btn" onClick={() => db.wishlist.delete(w.id)}><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Stylist() {
  const [tab, setTab] = useState('chat');
  return (
    <Page>
      <div className="head"><div><div className="eyebrow">Estilista IA</div><h1>{TABS[tab]}</h1></div></div>
      <div className="seg">{Object.entries(TABS).map(([k, n]) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{n}</button>)}</div>
      <div className="mt">
        {tab === 'chat' && <Chat />}
        {tab === 'comprar' && <Buy />}
        {tab === 'ideas' && <Ideas />}
      </div>
    </Page>
  );
}
