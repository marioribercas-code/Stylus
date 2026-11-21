import { useState } from 'react';
import { Plus, Search, Shirt, X, PenLine } from 'lucide-react';
import { db } from '../lib/db';
import { CATEGORIES, SUBTYPES, deltaE, colorFamily } from '../lib/fashion';
import { catOf } from '../lib/engine';
import { compress, cropBox, extractColors, applyMask } from '../lib/image';
import { recognizeGarments, describeFromText } from '../lib/ai';
import { useData, Page, Sheet, Thumb, PhotoPicker, Btn, Empty, itemLabel, useLocal } from '../ui';
import ItemSheet, { ItemForm } from '../ItemSheet';

const FILTERS = { all: 'Todo', ...CATEGORIES, laundry: 'A lavar', archived: 'Archivadas' };

function AddFlow({ onDone }) {
  const { notify } = useData();
  const [drafts, setDrafts] = useState([]);
  const [progress, setProgress] = useState('');
  const [open, setOpen] = useState(null);
  const [text, setText] = useState('');
  const [useAI, setUseAI] = useLocal('useAI', true);

  const manualDraft = async (photo) => {
    const small = await compress(photo, 700);
    const cols = [];
    for (const c of await extractColors(small)) if (!cols.some((x) => deltaE(x.hex, c.hex) < 14)) cols.push(c);
    return { sub: 'otro', category: 'accessory', name: '', photo: small, colors: (cols.length ? cols : [{ hex: '#808080' }]).slice(0, 3).map((c) => ({ ...c, name: colorFamily(c.hex) })), needsType: true };
  };

  const fromPhotos = async (files) => {
    const out = [];
    let aiOn = useAI;
    for (let i = 0; i < files.length; i++) {
      setProgress(`${aiOn ? 'Analizando' : 'Procesando'} foto ${i + 1} de ${files.length}…`);
      const photo = await compress(files[i], 1400, 0.88);
      if (!aiOn) { out.push(await manualDraft(photo)); continue; }
      try {
        const found = await recognizeGarments(photo);
        if (!found.length) throw new Error('No he detectado prendas en una foto');
        for (const f of found) {
          const { box_2d: box, mask, ...attrs } = f;
          const plain = found.length > 1 ? await cropBox(photo, box) : await compress(photo, 700);
          let cut = null;
          try { cut = await applyMask(photo, box, mask); } catch { /* sin máscara válida: foto normal */ }
          out.push({ ...attrs, category: SUBTYPES[attrs.sub].cat, photo: cut || plain, ...(cut ? { originalPhoto: plain } : {}) });
        }
      } catch (e) {
        notify(`${e.message}\nSigo sin IA: colores detectados en el móvil, elige tú el tipo.`, true);
        if (e.status === 429) aiOn = false;
        out.push(await manualDraft(photo));
      }
    }
    setProgress('');
    setDrafts((d) => [...d, ...out]);
  };

  const fromText = async () => {
    if (!text.trim()) return;
    setProgress('Interpretando…');
    try {
      const r = await describeFromText(text);
      setDrafts((d) => [...d, { ...r, category: SUBTYPES[r.sub].cat, photo: null }]);
      setText('');
    } catch (e) { notify(e.message, true); }
    setProgress('');
  };

  const saveAll = async () => {
    const now = Date.now();
    await db.items.bulkAdd(drafts.map(({ needsType: _n, ...d }, i) => ({ ...d, createdAt: now + i, wears: 0 })));
    notify(`${drafts.length} prenda${drafts.length > 1 ? 's' : ''} añadida${drafts.length > 1 ? 's' : ''}`);
    onDone();
  };

  if (open != null) {
    return (
      <div className="stack">
        <h2>Revisar prenda</h2>
        <ItemForm value={drafts[open]} onChange={(v) => setDrafts(drafts.map((d, i) => (i === open ? { ...v, needsType: v.sub === 'otro' } : d)))} />
        <Btn className="primary" onClick={() => setOpen(null)}>Hecho</Btn>
      </div>
    );
  }

  return (
    <div className="stack">
      <h2>Añadir prendas</h2>
      <div className="seg">
        <button className={useAI ? 'on' : ''} onClick={() => setUseAI(true)}>Con IA (1 consulta/foto)</button>
        <button className={!useAI ? 'on' : ''} onClick={() => setUseAI(false)}>Sin IA</button>
      </div>
      <p className="small muted">{useAI
        ? 'Fotografía una prenda o varias a la vez (extendidas en la cama o puestas). La IA las separa y etiqueta: tipo, colores exactos, tejido, formalidad y abrigo. Mejor con luz de día y fondo liso.'
        : 'Sin gastar IA: los colores se detectan en el móvil y tú eliges el tipo. Una prenda por foto, sobre fondo liso.'}</p>
      <PhotoPicker multiple onPick={fromPhotos} />
      {useAI && <div className="row">
        <input placeholder="…o descríbela: «chino beige slim de algodón»" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fromText()} />
        <button className="icon-btn" onClick={fromText}><PenLine size={18} /></button>
      </div>}
      {progress && <p className="row small gold"><span className="spin" />{progress}</p>}
      {!!drafts.length && (
        <>
          <h3>Detectadas ({drafts.length}) · toca para corregir</h3>
          <div className="grid3">
            {drafts.map((d, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <Thumb item={d} badge={d.needsType ? '⚠ elige tipo' : itemLabel(d)} onClick={() => setOpen(i)} />
                <button className="icon-btn" style={{ position: 'absolute', top: 4, right: 4, width: 26, height: 26 }} onClick={() => setDrafts(drafts.filter((_, j) => j !== i))}><X size={14} /></button>
              </div>
            ))}
          </div>
          <Btn className="primary block" onClick={saveAll}>Guardar {drafts.length} en el armario</Btn>
        </>
      )}
    </div>
  );
}

export default function Wardrobe() {
  const { items } = useData();
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');
  const [adding, setAdding] = useState(false);
  const [sel, setSel] = useState(null);

  const list = items.filter((it) => {
    if (filter === 'archived') return it.archived;
    if (it.archived) return false;
    if (filter === 'laundry') return it.laundry;
    if (filter !== 'all' && catOf(it) !== filter) return false;
    if (q) {
      const s = `${itemLabel(it)} ${it.brand || ''} ${(it.colors || []).map((c) => c.name).join(' ')} ${it.material || ''}`.toLowerCase();
      return s.includes(q.toLowerCase());
    }
    return true;
  }).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  const count = items.filter((i) => !i.archived).length;
  return (
    <Page>
      <div className="head">
        <div><div className="eyebrow">Armario</div><h1>{count} prendas</h1></div>
      </div>
      <div className="row" style={{ position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: 12, color: 'var(--txt3)' }} />
        <input style={{ paddingLeft: 36 }} placeholder="Buscar por nombre, color, marca…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="chips mt-s">
        {Object.entries(FILTERS).map(([k, n]) => <button key={k} className={`chip ${filter === k ? 'on' : ''}`} onClick={() => setFilter(k)}>{n}</button>)}
      </div>
      <div className="mt">
        {list.length ? (
          <div className="grid3">{list.map((it) => <Thumb key={it.id} item={it} badge={it.laundry ? '🧺 lavar' : itemLabel(it)} onClick={() => setSel(it)} />)}</div>
        ) : (
          <Empty icon={Shirt} title={count ? 'Nada por aquí' : 'Empieza tu armario'}>{count ? 'Prueba otro filtro.' : 'Pulsa + y haz fotos de tu ropa. Puedes meter varias prendas en una misma foto.'}</Empty>
        )}
      </div>
      <button className="btn primary fab" onClick={() => setAdding(true)} aria-label="Añadir"><Plus size={26} /></button>
      <Sheet open={adding} onClose={() => setAdding(false)}><AddFlow onDone={() => setAdding(false)} /></Sheet>
      <Sheet open={!!sel} onClose={() => setSel(null)}>{sel && <ItemSheet item={sel} onClose={() => setSel(null)} />}</Sheet>
    </Page>
  );
}
