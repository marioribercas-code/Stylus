import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Check, Bookmark, MessageSquareText, Wand2, Shuffle } from 'lucide-react';
import { db, logWear } from './lib/db';
import { feedbackRows, outfitIds, slotsOf } from './lib/engine';
import { critiqueOutfit, tryOn } from './lib/ai';
import { useData, OutfitGrid, ScoreBlock, Btn, Sheet, ItemRefText } from './ui';
import ItemSheet from './ItemSheet';

export default function OutfitCard({ res, occasion, onNext, locks, onLock, title, savedId }) {
  const { profile, weather, notify } = useData();
  const [critique, setCritique] = useState('');
  const [busy, setBusy] = useState('');
  const [img, setImg] = useState(null);
  const [piece, setPiece] = useState(null);
  const o = res.items;

  const save = async (extra = {}) => {
    if (savedId) { await db.outfits.update(savedId, extra); return savedId; }
    return db.outfits.add({ slots: slotsOf(o), occasion, score: res.score, createdAt: Date.now(), ...extra });
  };
  const run = async (key, fn) => {
    setBusy(key);
    try { await fn(); } catch (e) { notify(e.message || 'Error', true); }
    setBusy('');
  };
  const rate = (v) => run(v > 0 ? 'up' : 'down', async () => {
    await db.feedback.bulkAdd(feedbackRows(o, v));
    notify(v > 0 ? 'Apuntado: combinaciones así tendrán prioridad' : 'Entendido, evitaré combinaciones así');
    if (v < 0) onNext?.();
  });

  return (
    <div className="card stack">
      {title && <div className="row between"><h3>{title}</h3></div>}
      <OutfitGrid outfit={o} locks={locks} onLock={onLock} onPiece={(k, it) => setPiece(it)} />
      <ScoreBlock r={res} />
      {critique && <div className="card" style={{ background: 'var(--bg2)' }}><span className="eyebrow">Estilista</span><p className="small mt-s" style={{ whiteSpace: 'pre-wrap' }}><ItemRefText text={critique} /></p></div>}
      {img && <img src={img} alt="Probador virtual" style={{ borderRadius: 14 }} />}
      <div className="row wrap">
        <Btn className="primary sm" busy={busy === 'wear'} onClick={() => run('wear', async () => {
          const id = await save({ worn: true });
          await logWear(outfitIds(o), id);
          notify('¡Registrado! Hoy vas así ✓');
        })}><Check size={16} />Me lo pongo</Btn>
        <Btn className="sm" busy={busy === 'up'} onClick={() => rate(1)}><ThumbsUp size={16} /></Btn>
        <Btn className="sm" busy={busy === 'down'} onClick={() => rate(-1)}><ThumbsDown size={16} /></Btn>
        {!savedId && <Btn className="sm" busy={busy === 'save'} onClick={() => run('save', async () => { await save(); notify('Outfit guardado'); })}><Bookmark size={16} /></Btn>}
        {onNext && <Btn className="sm" onClick={onNext}><Shuffle size={16} />Otro</Btn>}
      </div>
      <div className="row">
        <Btn className="sm grow" busy={busy === 'ai'} onClick={() => run('ai', async () => setCritique(await critiqueOutfit(o, { profile, weather, occasion, engine: res })))}><MessageSquareText size={16} />Opinión IA</Btn>
        <Btn className="sm grow" busy={busy === 'try'} onClick={() => run('try', async () => {
          if (!profile.bodyPhoto) throw new Error('Primero haz el escáner en Perfil (foto de cuerpo entero).');
          const im = await tryOn(profile.bodyPhoto, o);
          setImg(im);
          await save({ tryon: im });
        })}><Wand2 size={16} />Probármelo</Btn>
      </div>
      <p className="tiny">{busy === 'try' ? 'Generando la simulación… puede tardar 10-30 s.' : '«Probármelo» usa el modelo de imagen de Gemini, que normalmente solo funciona con facturación activada.'}</p>
      <Sheet open={!!piece} onClose={() => setPiece(null)}>
        {piece && <ItemSheet item={piece} onClose={() => setPiece(null)} />}
      </Sheet>
    </div>
  );
}
