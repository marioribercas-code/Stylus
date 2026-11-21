import { useEffect, useState } from 'react';
import { ScanFace, KeyRound } from 'lucide-react';
import { db, setKV, getKV, exportAll, importAll } from '../lib/db';
import { SEASONS, BODY_TYPES, STYLES, CATEGORIES, bodyTypeFromMeasures, seasonFromQuiz, colorFamily } from '../lib/fashion';
import { catOf, hexOf } from '../lib/engine';
import { analyzeBody } from '../lib/ai';
import { ask, DEFAULT_MODELS } from '../lib/gemini';
import { compress } from '../lib/image';
import { useData, Page, Btn, PhotoPicker, Swatch, Thumb, itemLabel } from '../ui';

const TABS = { scan: 'Escáner', style: 'Mi estilo', stats: 'Estadísticas', settings: 'Ajustes' };
const saveProfile = async (patch) => setKV('profile', { ...(await getKV('profile', {})), ...patch });

function Scan() {
  const { profile, notify } = useData();
  const [body, setBody] = useState(profile.bodyPhoto || null);
  const [selfie, setSelfie] = useState(null);
  const [m, setM] = useState({ height: profile.height || '', weight: profile.weight || '', chest: profile.chest || '', waist: profile.waist || '', hips: profile.hips || '' });
  const [busy, setBusy] = useState(false);
  const a = profile.analysis;

  const run = async () => {
    setBusy(true);
    try {
      const nums = Object.fromEntries(Object.entries(m).map(([k, v]) => [k, Number(v) || null]));
      const r = await analyzeBody({ bodyPhoto: body, selfie, ...nums });
      const measured = bodyTypeFromMeasures(nums);
      await saveProfile({
        ...nums, bodyPhoto: body, analysis: r,
        bodyType: measured || (BODY_TYPES[r.bodyType] ? r.bodyType : profile.bodyType),
        season: SEASONS[r.season] ? r.season : profile.season,
        contrast: r.contrast || profile.contrast,
        faceShape: r.faceShape,
        styles: profile.styles?.length ? profile.styles : (r.styles || []).filter((s) => STYLES[s]),
        scannedAt: Date.now(),
      });
      notify('Análisis completado');
    } catch (e) { notify(e.message, true); }
    setBusy(false);
  };

  return (
    <div className="stack">
      <div className="card stack">
        <h3>1. Foto de cuerpo entero</h3>
        <p className="tiny">De frente, ropa ajustada o de deporte, brazos algo separados, cámara a la altura del pecho. También se usa para el probador virtual.</p>
        {body && <img src={body} alt="" style={{ maxHeight: 260, objectFit: 'contain', borderRadius: 12 }} />}
        <PhotoPicker onPick={async (f) => setBody(await compress(f, 1200))} />
      </div>
      <div className="card stack">
        <h3>2. Selfie para tu colorimetría</h3>
        <p className="tiny">Junto a una ventana con luz de día, sin filtros ni flash, sin gafas, cara despejada. Es lo que define tu estación de color.</p>
        {selfie && <img src={selfie} alt="" style={{ maxHeight: 200, objectFit: 'contain', borderRadius: 12 }} />}
        <PhotoPicker onPick={async (f) => setSelfie(await compress(f, 1000))} label="Selfie" />
      </div>
      <div className="card stack">
        <h3>3. Medidas (opcional, mejora la precisión)</h3>
        <p className="tiny">Con cinta métrica: pecho por la parte más ancha, cintura a la altura del ombligo, cadera por la parte más ancha de los glúteos.</p>
        <div className="grid2">
          {[['height', 'Altura (cm)'], ['weight', 'Peso (kg)'], ['chest', 'Pecho (cm)'], ['waist', 'Cintura (cm)'], ['hips', 'Cadera (cm)']].map(([k, l]) => (
            <label key={k} className="field"><span>{l}</span><input type="number" value={m[k]} onChange={(e) => setM({ ...m, [k]: e.target.value })} /></label>
          ))}
        </div>
      </div>
      <Btn className="primary" busy={busy} disabled={!body && !selfie} onClick={run}><ScanFace size={18} />Analizarme</Btn>
      {busy && <p className="tiny">Analizando morfología, rostro y colorimetría…</p>}

      {a && (
        <div className="stack">
          <div className="card gold stack s">
            <span className="eyebrow">Tu estación</span>
            <h2>{SEASONS[profile.season]?.name}</h2>
            <p className="tiny">Subtono {a.undertone} · profundidad {a.depth} · contraste {a.contrast}{a.seasonAlt && SEASONS[a.seasonAlt] ? ` · alternativa: ${SEASONS[a.seasonAlt].name}` : ''}{a.confidence ? ` · confianza ${Math.round(a.confidence * 100)}%` : ''}</p>
            <div className="row wrap mt-s">{(a.bestColors || []).map((c) => <span key={c.hex} className="row tiny"><Swatch hex={c.hex} size="l" /></span>)}</div>
            <span className="small">Evita cerca de la cara:</span>
            <div className="row wrap">{(a.avoidColors || []).map((c) => <span key={c.hex} className="row tiny"><Swatch hex={c.hex} />{c.name}</span>)}</div>
            {a.neutrals && <p className="small"><b>Tus neutros:</b> {[].concat(a.neutrals).join(', ')}</p>}
          </div>
          <div className="card stack s">
            <span className="eyebrow">Tu cuerpo</span>
            <h2>{BODY_TYPES[profile.bodyType]?.name} · {a.build}</h2>
            <p className="small muted">{BODY_TYPES[profile.bodyType]?.tip}</p>
            {[['Cortes', a.fits], ['Cuellos', a.necklines], ['Estampados', a.patterns], ['Largos', a.lengths], ['Evitar', a.avoid], ['Cara (' + (a.faceShape || '') + ')', a.grooming]].map(([k, v]) => v && <p key={k} className="small"><b className="gold">{k}:</b> {v}</p>)}
          </div>
          {a.summary && <p className="small muted">{a.summary}</p>}
        </div>
      )}
    </div>
  );
}

function StyleTab() {
  const { profile, notify } = useData();
  const [q, setQ] = useState({ undertone: 'neutro', depth: 'medio', contrast: 'medio' });
  const styles = profile.styles || [];
  return (
    <div className="stack">
      <div className="card stack">
        <h3>Estilos que te representan</h3>
        <p className="tiny">Elige 2-3. El motor prioriza combinaciones fieles a ellos.</p>
        <div className="row wrap">{Object.entries(STYLES).map(([k, n]) => {
          const on = styles.includes(k);
          return <button key={k} className={`chip ${on ? 'on' : ''}`} onClick={() => saveProfile({ styles: on ? styles.filter((s) => s !== k) : [...styles, k] })}>{n}</button>;
        })}</div>
      </div>
      <div className="card stack">
        <h3>Ajuste manual</h3>
        <label className="field"><span>Estación de color</span>
          <select value={profile.season || ''} onChange={(e) => saveProfile({ season: e.target.value || null })}><option value="">Sin definir</option>{Object.entries(SEASONS).map(([k, s]) => <option key={k} value={k}>{s.name}</option>)}</select>
        </label>
        <label className="field"><span>Morfología</span>
          <select value={profile.bodyType || ''} onChange={(e) => saveProfile({ bodyType: e.target.value || null })}><option value="">Sin definir</option>{Object.entries(BODY_TYPES).map(([k, s]) => <option key={k} value={k}>{s.name}</option>)}</select>
        </label>
        <label className="field"><span>Contraste natural (pelo/piel/ojos)</span>
          <select value={profile.contrast || ''} onChange={(e) => saveProfile({ contrast: e.target.value || null })}><option value="">Automático</option><option value="bajo">Bajo</option><option value="medio">Medio</option><option value="alto">Alto</option></select>
        </label>
        <label className="field"><span>Altura (cm)</span><input type="number" value={profile.height || ''} onChange={(e) => saveProfile({ height: Number(e.target.value) || null })} /></label>
      </div>
      <div className="card stack">
        <h3>Test rápido de color (sin selfie)</h3>
        <label className="field"><span>Venas de la muñeca / joyería que te favorece</span>
          <select value={q.undertone} onChange={(e) => setQ({ ...q, undertone: e.target.value })}><option value="cálido">Verdosas / oro</option><option value="frío">Azuladas-moradas / plata</option><option value="neutro">Mezcla / ambas</option></select>
        </label>
        <label className="field"><span>Profundidad (pelo y piel)</span>
          <select value={q.depth} onChange={(e) => setQ({ ...q, depth: e.target.value })}><option value="claro">Claro (rubio, piel clara)</option><option value="medio">Medio</option><option value="oscuro">Oscuro (pelo muy oscuro, piel morena/oscura)</option></select>
        </label>
        <label className="field"><span>Contraste pelo-piel-ojos</span>
          <select value={q.contrast} onChange={(e) => setQ({ ...q, contrast: e.target.value })}><option value="bajo">Bajo (todo en tonos parecidos)</option><option value="medio">Medio</option><option value="alto">Alto (pelo oscuro y piel clara, ojos muy claros…)</option></select>
        </label>
        <Btn onClick={() => { const s = seasonFromQuiz(q); saveProfile({ season: s, contrast: q.contrast }); notify(`Estación estimada: ${SEASONS[s].name}`); }}>Calcular estación</Btn>
      </div>
    </div>
  );
}

function Stats() {
  const { items, active } = useData();
  if (!active.length) return <p className="muted small">Añade prendas para ver estadísticas.</p>;
  const now = Date.now();
  const total = active.reduce((s, i) => s + (i.price || 0), 0);
  const recent = active.filter((i) => i.lastWorn && now - i.lastWorn < 30 * 864e5).length;
  const idle = active.filter((i) => !i.lastWorn || now - i.lastWorn > 60 * 864e5).sort((a, b) => (a.lastWorn || 0) - (b.lastWorn || 0));
  const top = [...active].sort((a, b) => (b.wears || 0) - (a.wears || 0)).slice(0, 6).filter((i) => i.wears);
  const byCat = Object.entries(CATEGORIES).map(([k, n]) => [n, active.filter((i) => catOf(i) === k).length]);
  const fams = {};
  active.forEach((i) => { const f = colorFamily(hexOf(i)); fams[f] = fams[f] || { n: 0, hex: hexOf(i) }; fams[f].n++; });
  const priced = active.filter((i) => i.price);
  const cpw = priced.length ? priced.reduce((s, i) => s + i.price / Math.max(1, i.wears || 0), 0) / priced.length : null;
  return (
    <div className="stack">
      <div className="grid2">
        <div className="card"><div className="score">{active.length}</div><div className="tiny">prendas activas ({items.length - active.length} archivadas)</div></div>
        <div className="card"><div className="score">{Math.round((recent / active.length) * 100)}%</div><div className="tiny">usado en los últimos 30 días</div></div>
        <div className="card"><div className="score">{total ? `${Math.round(total)}€` : '—'}</div><div className="tiny">valor del armario</div></div>
        <div className="card"><div className="score">{cpw ? `${cpw.toFixed(1)}€` : '—'}</div><div className="tiny">coste medio por uso</div></div>
      </div>
      <div className="card stack s">
        <h3>Por categoría</h3>
        {byCat.map(([n, c]) => <div key={n} className="stack s"><div className="row between small"><span>{n}</span><span className="muted">{c}</span></div><div className="bar"><i style={{ width: `${(c / active.length) * 100}%` }} /></div></div>)}
      </div>
      <div className="card stack s">
        <h3>Colores</h3>
        <div className="row wrap">{Object.entries(fams).sort((a, b) => b[1].n - a[1].n).map(([f, v]) => <span key={f} className="chip"><Swatch hex={v.hex} />{f} · {v.n}</span>)}</div>
      </div>
      {!!top.length && <div className="card stack s"><h3>Las que más usas</h3><div className="grid3">{top.map((i) => <Thumb key={i.id} item={i} badge={`${i.wears}×`} />)}</div></div>}
      {!!idle.length && <div className="card stack s"><h3>Olvidadas (+60 días)</h3><p className="tiny">Úsalas, véndelas o dónalas.</p><div className="grid3">{idle.slice(0, 9).map((i) => <Thumb key={i.id} item={i} badge={itemLabel(i)} />)}</div></div>}
    </div>
  );
}

function Settings() {
  const { notify, refreshWeather } = useData();
  const [key, setKey] = useState('');
  const [cfg, setCfg] = useState(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    Promise.all([getKV('apiKey', ''), getKV('modelText', ''), getKV('modelImage', ''), getKV('city', '')]).then(([k, t, i, c]) => { setKey(k); setCfg({ t, i, c }); });
  }, []);
  if (!cfg) return null;
  const doExport = async () => {
    const blob = new Blob([JSON.stringify(await exportAll())], { type: 'application/json' });
    const file = new File([blob], `stylus-copia-${new Date().toISOString().slice(0, 10)}.json`, { type: 'application/json' });
    if (navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file], title: 'Copia STYLUS' }).catch(() => {}); return; }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = file.name; a.click();
  };
  return (
    <div className="stack">
      <div className="card stack">
        <h3 className="row"><KeyRound size={17} className="gold" />Clave de Gemini</h3>
        <p className="tiny">Gratis en aistudio.google.com/apikey. Se guarda solo en este móvil.</p>
        <input type="password" placeholder="AIza…" value={key} onChange={(e) => setKey(e.target.value.trim())} />
        <div className="grid2">
          <label className="field"><span>Modelo texto/visión</span><input placeholder={DEFAULT_MODELS.text} value={cfg.t} onChange={(e) => setCfg({ ...cfg, t: e.target.value.trim() })} /></label>
          <label className="field"><span>Modelo imagen</span><input placeholder={DEFAULT_MODELS.image} value={cfg.i} onChange={(e) => setCfg({ ...cfg, i: e.target.value.trim() })} /></label>
        </div>
        <Btn className="primary" busy={busy} onClick={async () => {
          setBusy(true);
          await setKV('apiKey', key); await setKV('modelText', cfg.t); await setKV('modelImage', cfg.i);
          try { await ask('Responde solo: OK'); notify('Clave guardada y verificada ✓'); } catch (e) { notify(e.message, true); }
          setBusy(false);
        }}>Guardar y probar</Btn>
      </div>
      <div className="card stack">
        <h3>Ciudad (si no das ubicación)</h3>
        <div className="row"><input placeholder="Madrid" value={cfg.c} onChange={(e) => setCfg({ ...cfg, c: e.target.value })} />
          <Btn onClick={async () => { await setKV('city', cfg.c); await setKV('wx', null); refreshWeather(true); notify('Ciudad guardada'); }}>Guardar</Btn></div>
      </div>
      <div className="card stack">
        <h3>Copia de seguridad</h3>
        <p className="tiny">Tus datos viven solo en el móvil. Exporta de vez en cuando.</p>
        <div className="row">
          <Btn className="grow" onClick={doExport}>Exportar</Btn>
          <label className="btn grow">Importar<input type="file" accept="application/json" hidden onChange={async (e) => {
            const f = e.target.files?.[0]; if (!f) return;
            try { await importAll(JSON.parse(await f.text())); notify('Copia restaurada'); } catch { notify('Archivo no válido', true); }
          }} /></label>
        </div>
      </div>
      <Btn className="danger ghost" onClick={async () => { await db.feedback.clear(); notify('Preferencias aprendidas reiniciadas'); }}>Reiniciar lo aprendido de tus 👍/👎</Btn>
    </div>
  );
}

export default function Profile() {
  const { profile } = useData();
  const [tab, setTab] = useState(profile.season ? 'style' : 'scan');
  return (
    <Page>
      <div className="head"><div><div className="eyebrow">Perfil</div><h1>{TABS[tab]}</h1></div></div>
      <div className="chips">{Object.entries(TABS).map(([k, n]) => <button key={k} className={`chip ${tab === k ? 'on' : ''}`} onClick={() => setTab(k)}>{n}</button>)}</div>
      <div className="mt">
        {tab === 'scan' && <Scan />}
        {tab === 'style' && <StyleTab />}
        {tab === 'stats' && <Stats />}
        {tab === 'settings' && <Settings />}
      </div>
    </Page>
  );
}
