import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Archive, Droplets, Sparkles, Heart } from 'lucide-react';
import { db } from './lib/db';
import { SUBTYPES, CATEGORIES, PATTERNS, MATERIALS, FITS, STYLES, deltaE, colorFamily, paletteFit, SEASONS } from './lib/fashion';
import { catOf, hexOf, fRange } from './lib/engine';
import { cleanPhoto } from './lib/ai';
import { useData, Btn, Swatch, Thumb, itemLabel } from './ui';

export function ItemForm({ value, onChange }) {
  const v = value;
  const set = (k, x) => onChange({ ...v, [k]: x });
  const colors = v.colors?.length ? v.colors : [{ hex: '#808080', name: '' }];
  return (
    <div className="stack">
      <label className="field"><span>Nombre</span><input value={v.name || ''} onChange={(e) => set('name', e.target.value)} /></label>
      <label className="field"><span>Tipo</span>
        <select value={v.sub || 'otro'} onChange={(e) => onChange({ ...v, sub: e.target.value, category: SUBTYPES[e.target.value].cat })}>
          {Object.entries(CATEGORIES).map(([c, cn]) => (
            <optgroup key={c} label={cn}>
              {Object.entries(SUBTYPES).filter(([, s]) => s.cat === c).map(([k, s]) => <option key={k} value={k}>{s.name}</option>)}
            </optgroup>
          ))}
        </select>
      </label>
      <div className="field"><span>Colores (el primero es el principal)</span>
        <div className="row wrap">
          {colors.map((c, i) => (
            <label key={i} className="chip" style={{ paddingLeft: 4 }}>
              <input type="color" value={c.hex} style={{ width: 26, height: 26, padding: 0, border: 0, borderRadius: 99, background: 'none' }}
                onChange={(e) => set('colors', colors.map((x, j) => (j === i ? { ...x, hex: e.target.value, name: colorFamily(e.target.value) } : x)))} />
              {c.name || colorFamily(c.hex)}
            </label>
          ))}
          {colors.length < 3 && <button className="chip" onClick={() => set('colors', [...colors, { hex: '#ffffff', name: 'blanco' }])}>+ color</button>}
          {colors.length > 1 && <button className="chip" onClick={() => set('colors', colors.slice(0, -1))}>− quitar</button>}
        </div>
      </div>
      <div className="grid2">
        <label className="field"><span>Estampado</span><select value={v.pattern || 'liso'} onChange={(e) => set('pattern', e.target.value)}>{Object.entries(PATTERNS).map(([k, n]) => <option key={k} value={k}>{n}</option>)}</select></label>
        <label className="field"><span>Tejido</span><select value={v.material || 'algodón'} onChange={(e) => set('material', e.target.value)}>{MATERIALS.map((m) => <option key={m}>{m}</option>)}</select></label>
        <label className="field"><span>Corte</span><select value={v.fit || 'regular'} onChange={(e) => set('fit', e.target.value)}>{Object.entries(FITS).map(([k, n]) => <option key={k} value={k}>{n}</option>)}</select></label>
        <label className="field"><span>Formalidad (1-5)</span><input type="number" min="1" max="5" step="0.5" value={v.formality || ''} onChange={(e) => set('formality', Number(e.target.value) || null)} /></label>
        <label className="field"><span>Abrigo (0-5)</span><input type="number" min="0" max="5" step="0.5" value={v.warmth ?? ''} onChange={(e) => set('warmth', e.target.value === '' ? null : Number(e.target.value))} /></label>
        <label className="field"><span>Precio (€)</span><input type="number" min="0" value={v.price || ''} onChange={(e) => set('price', Number(e.target.value) || null)} /></label>
      </div>
      <label className="field"><span>Marca</span><input value={v.brand || ''} onChange={(e) => set('brand', e.target.value)} /></label>
      <div className="field"><span>Estilo</span>
        <div className="row wrap">{Object.entries(STYLES).map(([k, n]) => {
          const on = (v.styles || []).includes(k);
          return <button key={k} className={`chip ${on ? 'on' : ''}`} onClick={() => set('styles', on ? v.styles.filter((s) => s !== k) : [...(v.styles || []), k])}>{n}</button>;
        })}</div>
      </div>
      {catOf(v) === 'outer' || catOf(v) === 'shoes' ? (
        <label className="row small"><input type="checkbox" style={{ width: 18 }} checked={!!v.waterproof} onChange={(e) => set('waterproof', e.target.checked)} />Apto para lluvia / impermeable</label>
      ) : null}
      <label className="field"><span>Notas</span><textarea value={v.notes || ''} onChange={(e) => set('notes', e.target.value)} /></label>
    </div>
  );
}

export default function ItemSheet({ item, onClose }) {
  const { items, profile, notify } = useData();
  const nav = useNavigate();
  const [edit, setEdit] = useState(false);
  const [draft, setDraft] = useState(item);
  const [busy, setBusy] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const it = items.find((x) => x.id === item.id) || item;
  const hex = hexOf(it);
  const alts = items.filter((x) => x.id !== it.id && !x.archived && catOf(x) === catOf(it))
    .map((x) => ({ x, d: deltaE(hexOf(x), hex) + Math.abs(fRange(x)[0] - fRange(it)[0]) * 12 + (x.sub === it.sub ? 0 : 10) }))
    .sort((a, b) => a.d - b.d).slice(0, 6);
  const cpw = it.price ? (it.price / Math.max(1, it.wears || 0)).toFixed(2) : null;
  const pal = profile.season ? paletteFit(hex, profile.season) : null;

  const update = (patch) => db.items.update(it.id, patch);

  if (edit) {
    return (
      <div className="stack">
        <h2>Editar prenda</h2>
        <ItemForm value={draft} onChange={setDraft} />
        <div className="row">
          <Btn className="grow" onClick={() => setEdit(false)}>Cancelar</Btn>
          <Btn className="primary grow" onClick={async () => { const { id, ...rest } = draft; await db.items.update(id, rest); setEdit(false); notify('Prenda actualizada'); }}>Guardar</Btn>
        </div>
      </div>
    );
  }

  return (
    <div className="stack">
      <div className="row" style={{ alignItems: 'flex-start', gap: 14 }}>
        <div style={{ width: 120 }}><Thumb item={it} /></div>
        <div className="grow stack s">
          <h2>{itemLabel(it)}</h2>
          <div className="row wrap">{(it.colors || []).map((c, i) => <span key={i} className="row small"><Swatch hex={c.hex} />{c.name}</span>)}</div>
          <div className="row wrap">
            <span className="tag">{SUBTYPES[it.sub]?.name}</span>
            {it.material && <span className="tag">{it.material}</span>}
            {it.fit && <span className="tag">{FITS[it.fit]}</span>}
            {it.brand && <span className="tag">{it.brand}</span>}
          </div>
          <p className="small muted">Puesta {it.wears || 0} veces{cpw ? ` · ${cpw} €/uso` : ''}</p>
          {pal != null && ['top', 'mid', 'outer'].includes(catOf(it)) && (
            <span className={`tag ${pal > 0.8 ? 'ok' : pal < 0.45 ? 'bad' : 'warn'}`}>{pal > 0.8 ? 'Color ideal' : pal < 0.45 ? 'Color poco favorecedor' : 'Color aceptable'} para {SEASONS[profile.season].name}</span>
          )}
        </div>
      </div>
      {it.notes && <p className="small muted">{it.notes}</p>}
      <div className="grid2">
        <Btn className="primary" onClick={() => { onClose?.(); nav(`/outfits?lock=${it.id}`); }}><Sparkles size={16} />Combinar</Btn>
        <Btn onClick={() => { setDraft(it); setEdit(true); }}>Editar</Btn>
        <Btn onClick={() => update({ favorite: !it.favorite })}><Heart size={16} fill={it.favorite ? 'currentColor' : 'none'} />{it.favorite ? 'Favorita' : 'Favorita'}</Btn>
        <Btn onClick={() => { update({ laundry: !it.laundry }); notify(it.laundry ? 'Disponible de nuevo' : 'Marcada como en lavar: no se usará en outfits'); }}><Droplets size={16} />{it.laundry ? 'Ya está limpia' : 'A lavar'}</Btn>
        <Btn busy={busy} onClick={async () => {
          setBusy(true);
          try { const photo = await cleanPhoto(it.photo); await update({ photo, originalPhoto: it.originalPhoto || it.photo }); notify('Foto mejorada'); } catch (e) { notify(e.message, true); }
          setBusy(false);
        }}><Sparkles size={16} />Mejorar foto</Btn>
        <Btn onClick={() => { update({ archived: !it.archived }); notify(it.archived ? 'Recuperada' : 'Archivada'); onClose?.(); }}><Archive size={16} />{it.archived ? 'Recuperar' : 'Archivar'}</Btn>
      </div>
      {it.originalPhoto && <button className="tiny" onClick={() => update({ photo: it.originalPhoto, originalPhoto: null })}>Restaurar foto original</button>}
      {!!alts.length && (
        <>
          <h3 className="mt">Alternativas en tu armario</h3>
          <div className="grid3">{alts.map(({ x }) => <Thumb key={x.id} item={x} badge={itemLabel(x)} />)}</div>
        </>
      )}
      {confirmDel ? (
        <div className="row">
          <Btn className="grow" onClick={() => setConfirmDel(false)}>No</Btn>
          <Btn className="danger grow" onClick={async () => { await db.items.delete(it.id); notify('Prenda eliminada'); onClose?.(); }}>Sí, eliminar para siempre</Btn>
        </div>
      ) : (
        <Btn className="danger ghost" onClick={() => setConfirmDel(true)}><Trash2 size={16} />Eliminar</Btn>
      )}
    </div>
  );
}
