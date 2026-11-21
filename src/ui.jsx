import { createContext, useContext, useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Image as ImageIcon, Lock, Unlock } from 'lucide-react';
import { db, getKV } from './lib/db';
import { feedbackMap, hexOf, subOf } from './lib/engine';
import { todayWeather } from './lib/weather';

const Ctx = createContext(null);

export function DataProvider({ children }) {
  const items = useLiveQuery(() => db.items.toArray(), [], null);
  const profile = useLiveQuery(() => getKV('profile', {}), [], null);
  const fbRows = useLiveQuery(() => db.feedback.toArray(), [], []);
  const [weather, setWeather] = useState(null);
  const [toast, setToast] = useState(null);
  const tRef = useRef();

  const refreshWeather = useCallback(async (force) => setWeather(await todayWeather(force)), []);
  useEffect(() => { refreshWeather(); }, [refreshWeather]);

  const notify = useCallback((msg, bad = false) => {
    setToast({ msg, bad });
    clearTimeout(tRef.current);
    tRef.current = setTimeout(() => setToast(null), bad ? 8000 : 2500);
  }, []);

  const value = useMemo(() => {
    const list = items || [];
    return {
      ready: items !== null && profile !== null,
      items: list,
      active: list.filter((i) => !i.archived),
      byId: Object.fromEntries(list.map((i) => [i.id, i])),
      profile: profile || {},
      fb: feedbackMap(fbRows || []),
      weather, refreshWeather, notify,
    };
  }, [items, profile, fbRows, weather, refreshWeather, notify]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <AnimatePresence>
        {toast && (
          <motion.div className={`toast ${toast.bad ? 'bad' : ''}`} initial={{ opacity: 0, y: 20, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 20, x: '-50%' }}>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  );
}
export const useData = () => useContext(Ctx);

export function Page({ children }) {
  return (
    <motion.div className="page" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
      {children}
    </motion.div>
  );
}

export function Sheet({ open, onClose, children }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="sheet-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div className="sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} onClick={(e) => e.stopPropagation()}>
            <div className="sheet-grip" />
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Btn({ busy, children, className = '', ...p }) {
  return (
    <button className={`btn ${className}`} disabled={busy || p.disabled} {...p}>
      {busy ? <span className="spin" /> : null}
      {children}
    </button>
  );
}

export function Swatch({ hex, size = '' }) {
  return <span className={`swatch ${size}`} style={{ background: hex }} />;
}

export function Thumb({ item, onClick, badge, locked, onLock }) {
  if (!item) return null;
  return (
    <div className="thumb" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      {item.photo ? <img src={item.photo} alt={item.name} loading="lazy" /> : <div style={{ width: '100%', height: '100%', background: hexOf(item) }} />}
      {badge && <span className="badge">{badge}</span>}
      {onLock && (
        <button className="icon-btn" style={{ position: 'absolute', top: 6, right: 6, width: 30, height: 30, background: locked ? 'var(--gold)' : 'rgba(0,0,0,.55)', color: locked ? '#19150c' : '#fff' }} onClick={(e) => { e.stopPropagation(); onLock(); }}>
          {locked ? <Lock size={14} /> : <Unlock size={14} />}
        </button>
      )}
    </div>
  );
}

export const SLOT_LABEL = { outer: 'Exterior', mid: 'Capa', top: 'Arriba', bottom: 'Abajo', shoes: 'Calzado' };
export const SLOT_ORDER = ['outer', 'mid', 'top', 'bottom', 'shoes'];

export function OutfitGrid({ outfit, onPiece, locks, onLock }) {
  return (
    <div className="outfit">
      {SLOT_ORDER.filter((k) => outfit[k]).map((k) => (
        <Thumb key={k} item={outfit[k]} badge={SLOT_LABEL[k]} onClick={onPiece ? () => onPiece(k, outfit[k]) : undefined}
          locked={locks?.[k]} onLock={onLock ? () => onLock(k) : undefined} />
      ))}
    </div>
  );
}

export function ScoreBlock({ r }) {
  return (
    <div className="stack s">
      <div className="row between">
        <span className="score">{r.score}<span className="tiny"> /100</span></span>
        <div className="row wrap" style={{ justifyContent: 'flex-end' }}>
          {Object.entries(r.parts).map(([k, v]) => (
            <span key={k} className={`tag ${v > 0.8 ? 'ok' : v < 0.5 ? 'bad' : ''}`}>{k}</span>
          ))}
        </div>
      </div>
      {!!r.good.length && <ul className="reasons">{r.good.map((g) => <li key={g}>{g}</li>)}</ul>}
      {!!r.bad.length && <ul className="reasons" style={{ color: 'var(--warn)' }}>{r.bad.map((g) => <li key={g}>{g}</li>)}</ul>}
    </div>
  );
}

export function PhotoPicker({ onPick, label = 'Hacer foto', galleryLabel = 'Galería', multiple = false }) {
  const cam = useRef(), gal = useRef();
  const handle = (e) => {
    const files = [...(e.target.files || [])];
    e.target.value = '';
    if (files.length) onPick(multiple ? files : files[0]);
  };
  return (
    <div className="row">
      <input ref={cam} type="file" accept="image/*" capture="environment" hidden onChange={handle} />
      <input ref={gal} type="file" accept="image/*" multiple={multiple} hidden onChange={handle} />
      <button className="btn primary grow" onClick={() => cam.current.click()}><Camera size={18} />{label}</button>
      <button className="btn grow" onClick={() => gal.current.click()}><ImageIcon size={18} />{galleryLabel}</button>
    </div>
  );
}

export function Empty({ icon: Icon, title, children }) {
  return (
    <div className="empty">
      {Icon && <Icon size={34} />}
      <h3>{title}</h3>
      <p className="small mt-s">{children}</p>
    </div>
  );
}

export const itemLabel = (it) => it?.name || subOf(it).name;

export function ItemRefText({ text }) {
  const { byId } = useData();
  const parts = String(text).split(/(\[#\d+\])/g);
  return (
    <span>
      {parts.map((p, i) => {
        const m = p.match(/\[#(\d+)\]/);
        const it = m && byId[Number(m[1])];
        if (!it) return <span key={i}>{p}</span>;
        return (
          <span key={i} className="chip" style={{ padding: '2px 8px 2px 2px', verticalAlign: 'middle', margin: '1px 2px' }}>
            {it.photo ? <img src={it.photo} alt="" style={{ width: 22, height: 22, borderRadius: 99, objectFit: 'cover' }} /> : <Swatch hex={hexOf(it)} />}
            {itemLabel(it)}
          </span>
        );
      })}
    </span>
  );
}

export function useLocal(key, def) {
  const [v, setV] = useState(() => {
    try { const s = localStorage.getItem(key); return s != null ? JSON.parse(s) : def; } catch { return def; }
  });
  const set = useCallback((x) => { setV(x); try { localStorage.setItem(key, JSON.stringify(x)); } catch { /* sin storage */ } }, [key]);
  return [v, set];
}
