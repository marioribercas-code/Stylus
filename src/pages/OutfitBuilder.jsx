import React, { useState } from 'react';
import { 
  Shuffle, Lock, Unlock, Sparkles, Heart, Check, 
  ChevronLeft, ChevronRight, Layers, BookmarkPlus, Sliders 
} from 'lucide-react';
import { useWardrobeStore } from '../store/useWardrobeStore';
import { scoreOutfit } from '../services/fashionEngine';

export default function OutfitBuilder() {
  const { items, outfits, saveOutfit, logOutfitToCalendar } = useWardrobeStore();

  const [activeMode, setActiveMode] = useState('shuffle'); // 'shuffle' o 'canvas'
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Separar prendas por categoría
  const layers = items.filter(i => i.category === 'abrigos');
  const tops = items.filter(i => i.category === 'superiores');
  const bottoms = items.filter(i => i.category === 'inferiores');
  const shoes = items.filter(i => i.category === 'calzado');

  // Índices actuales de los 4 rodillos de la ruleta
  const [layerIndex, setLayerIndex] = useState(0);
  const [topIndex, setTopIndex] = useState(0);
  const [bottomIndex, setBottomIndex] = useState(0);
  const [shoeIndex, setShoeIndex] = useState(0);

  // Estados de bloqueo (candado)
  const [lockedLayer, setLockedLayer] = useState(false);
  const [lockedTop, setLockedTop] = useState(false);
  const [lockedBottom, setLockedBottom] = useState(false);
  const [lockedShoe, setLockedShoe] = useState(false);

  // Prenda seleccionada en cada slot
  const currentLayer = layers[layerIndex % (layers.length || 1)];
  const currentTop = tops[topIndex % (tops.length || 1)];
  const currentBottom = bottoms[bottomIndex % (bottoms.length || 1)];
  const currentShoe = shoes[shoeIndex % (shoes.length || 1)];

  const selectedItems = [currentLayer, currentTop, currentBottom, currentShoe].filter(Boolean);
  const evaluation = scoreOutfit(selectedItems);

  // Animación de mezcla (Shuffle)
  const [isShuffling, setIsShuffling] = useState(false);

  const handleShuffle = () => {
    setIsShuffling(true);
    setSavedSuccess(false);

    let step = 0;
    const interval = setInterval(() => {
      if (!lockedLayer && layers.length > 0) setLayerIndex(Math.floor(Math.random() * layers.length));
      if (!lockedTop && tops.length > 0) setTopIndex(Math.floor(Math.random() * tops.length));
      if (!lockedBottom && bottoms.length > 0) setBottomIndex(Math.floor(Math.random() * bottoms.length));
      if (!lockedShoe && shoes.length > 0) setShoeIndex(Math.floor(Math.random() * shoes.length));

      step++;
      if (step >= 8) {
        clearInterval(interval);
        setIsShuffling(false);
      }
    }, 70);
  };

  const handleSaveOutfit = async () => {
    await saveOutfit({
      name: `Look ${evaluation.verdict.split(' ')[0]} ${new Date().toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}`,
      occasion: 'Casual / Diario',
      formality: currentLayer?.formality || 'Smart Casual',
      items: selectedItems.map(i => i.id),
      rating: 5,
      favorite: true,
      colorHarmonyScore: evaluation.score
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleLogToday = async () => {
    const outfitId = await saveOutfit({
      name: `Look Personalizado ${new Date().toLocaleDateString('es-ES')}`,
      items: selectedItems.map(i => i.id)
    });
    await logOutfitToCalendar(outfitId, new Date().toISOString().split('T')[0], 'Look de Ruleta');
    setSavedSuccess(true);
  };

  return (
    <div className="outfit-builder-page animate-fade-in">
      <div className="builder-header">
        <div>
          <span className="page-kicker">Estilismo Inteligente</span>
          <h2 className="page-title">Generador de Looks</h2>
        </div>

        <div className="mode-toggle-pills">
          <button 
            className={`mode-btn ${activeMode === 'shuffle' ? 'active' : ''}`}
            onClick={() => setActiveMode('shuffle')}
          >
            <Shuffle size={14} />
            <span>Ruleta Clueless</span>
          </button>
          <button 
            className={`mode-btn ${activeMode === 'canvas' ? 'active' : ''}`}
            onClick={() => setActiveMode('canvas')}
          >
            <Layers size={14} />
            <span>Galería</span>
          </button>
        </div>
      </div>

      {/* Puntuación de Armonía de Color en Vivo */}
      <div className="evaluation-bar glass-card">
        <div className="eval-score-wrap">
          <span className="score-val gold-gradient-text">{evaluation.score}</span>
          <div className="eval-labels">
            <span className="score-title">Armonía de Estilo</span>
            <span className="score-verdict">{evaluation.verdict}</span>
          </div>
        </div>

        <div className="eval-buttons">
          <button className="btn btn-secondary icon-btn-small" onClick={handleSaveOutfit} title="Guardar Look">
            <BookmarkPlus size={16} />
            <span>{savedSuccess ? '¡Guardado!' : 'Guardar'}</span>
          </button>
        </div>
      </div>

      {/* ROULETTE SHUFFLE SLOTS */}
      {activeMode === 'shuffle' ? (
        <div className="slots-container">
          {/* Rodillo 1: Capa Exterior */}
          <SlotReel
            title="Chaqueta / Capa Exterior"
            item={currentLayer}
            isLocked={lockedLayer}
            onToggleLock={() => setLockedLayer(!lockedLayer)}
            onPrev={() => setLayerIndex(prev => (prev > 0 ? prev - 1 : layers.length - 1))}
            onNext={() => setLayerIndex(prev => prev + 1)}
            totalItems={layers.length}
            isShuffling={isShuffling}
          />

          {/* Rodillo 2: Superior */}
          <SlotReel
            title="Parte Superior"
            item={currentTop}
            isLocked={lockedTop}
            onToggleLock={() => setLockedTop(!lockedTop)}
            onPrev={() => setTopIndex(prev => (prev > 0 ? prev - 1 : tops.length - 1))}
            onNext={() => setTopIndex(prev => prev + 1)}
            totalItems={tops.length}
            isShuffling={isShuffling}
          />

          {/* Rodillo 3: Inferior */}
          <SlotReel
            title="Pantalón / Inferior"
            item={currentBottom}
            isLocked={lockedBottom}
            onToggleLock={() => setLockedBottom(!lockedBottom)}
            onPrev={() => setBottomIndex(prev => (prev > 0 ? prev - 1 : bottoms.length - 1))}
            onNext={() => setBottomIndex(prev => prev + 1)}
            totalItems={bottoms.length}
            isShuffling={isShuffling}
          />

          {/* Rodillo 4: Calzado */}
          <SlotReel
            title="Calzado"
            item={currentShoe}
            isLocked={lockedShoe}
            onToggleLock={() => setLockedShoe(!lockedShoe)}
            onPrev={() => setShoeIndex(prev => (prev > 0 ? prev - 1 : shoes.length - 1))}
            onNext={() => setShoeIndex(prev => prev + 1)}
            totalItems={shoes.length}
            isShuffling={isShuffling}
          />

          {/* Botón Maestro Shuffle */}
          <div className="shuffle-action-area">
            <button 
              className={`btn btn-primary big-shuffle-btn ${isShuffling ? 'spinning' : ''}`}
              onClick={handleShuffle}
              disabled={isShuffling}
            >
              <Shuffle size={20} className={isShuffling ? 'rotate-anim' : ''} />
              <span>{isShuffling ? 'Mezclando Armario...' : '¡Mezclar Prendas Libres!'}</span>
            </button>
            <p className="shuffle-hint">
              💡 Bloquea con el candado las prendas que quieras conservar y pulsa mezclar.
            </p>
          </div>
        </div>
      ) : (
        /* Modo Galería de Looks Guardados */
        <div className="saved-outfits-grid">
          {outfits.length === 0 ? (
            <div className="empty-state glass-card">
              <p>Aún no has guardado looks personalizados.</p>
              <button className="btn btn-primary" onClick={() => setActiveMode('shuffle')}>
                Crear con la Ruleta
              </button>
            </div>
          ) : (
            outfits.map((outfit) => (
              <div key={outfit.id} className="saved-outfit-card glass-card">
                <div className="saved-outfit-header">
                  <h4 className="saved-outfit-title">{outfit.name}</h4>
                  <span className="saved-score-tag">{outfit.colorHarmonyScore || 90} pts</span>
                </div>
                <div className="saved-thumbnails-row">
                  {outfit.items?.map((id) => {
                    const found = items.find(i => i.id === id);
                    if (!found) return null;
                    return (
                      <div key={id} className="saved-thumb">
                        <img src={found.imageUrl} alt={found.name} />
                      </div>
                    );
                  })}
                </div>
                <button 
                  className="btn btn-secondary wear-saved-btn"
                  onClick={() => logOutfitToCalendar(outfit.id)}
                >
                  <Check size={14} />
                  <span>Vestir Hoy</span>
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Consejos del Motor de Estilo */}
      <div className="styling-rules-card glass-card">
        <div className="rules-header">
          <Sparkles size={16} className="gold-icon" />
          <h4>Análisis del Motor de Reglas</h4>
        </div>
        <div className="reasons-list">
          {evaluation.reasons.map((reason, idx) => (
            <div key={idx} className="rule-reason-item">
              <span className="rule-bullet">✦</span>
              <span>{reason}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .outfit-builder-page {
          padding: 16px 20px 40px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .builder-header {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        @media (min-width: 480px) {
          .builder-header {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }

        .page-kicker {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--accent-gold);
          letter-spacing: 0.1em;
        }

        .page-title {
          font-size: 22px;
          font-weight: 700;
        }

        .mode-toggle-pills {
          display: flex;
          gap: 6px;
          background: var(--bg-card);
          padding: 4px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-subtle);
        }

        .mode-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: var(--radius-full);
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .mode-btn.active {
          background: var(--accent-gradient);
          color: #0b0b0e;
        }

        .evaluation-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          border-color: rgba(212, 175, 55, 0.3);
        }

        .eval-score-wrap {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .score-val {
          font-size: 32px;
          font-weight: 800;
          line-height: 1;
        }

        .eval-labels {
          display: flex;
          flex-direction: column;
        }

        .score-title {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
        }

        .score-verdict {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .eval-buttons {
          display: flex;
          gap: 8px;
        }

        .icon-btn-small {
          padding: 8px 12px;
          font-size: 12px;
        }

        .slots-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .shuffle-action-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
        }

        .big-shuffle-btn {
          width: 100%;
          padding: 16px;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        .shuffle-hint {
          font-size: 11px;
          color: var(--text-muted);
          text-align: center;
        }

        .rotate-anim {
          animation: spin 0.5s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Saved Outfits */
        .saved-outfits-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .saved-outfit-card {
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .saved-outfit-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .saved-outfit-title {
          font-size: 14px;
          font-weight: 600;
        }

        .saved-score-tag {
          font-size: 11px;
          font-weight: 700;
          color: var(--accent-gold);
          background: rgba(212, 175, 55, 0.1);
          padding: 2px 8px;
          border-radius: var(--radius-full);
        }

        .saved-thumbnails-row {
          display: flex;
          gap: 8px;
          overflow-x: auto;
        }

        .saved-thumb {
          width: 60px;
          height: 60px;
          border-radius: var(--radius-xs);
          overflow: hidden;
          background: #111;
          flex-shrink: 0;
        }

        .saved-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .wear-saved-btn {
          padding: 8px;
          font-size: 12px;
        }

        .empty-state {
          padding: 30px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          color: var(--text-secondary);
        }

        .styling-rules-card {
          padding: 14px 18px;
        }

        .rules-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .rules-header h4 {
          font-size: 14px;
          font-weight: 600;
        }

        .gold-icon {
          color: var(--accent-gold);
        }

        .reasons-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .rule-reason-item {
          display: flex;
          align-items: flex-start;
          gap: 6px;
          font-size: 12px;
          color: var(--text-secondary);
        }

        .rule-bullet {
          color: var(--accent-gold);
          font-size: 10px;
        }
      `}</style>
    </div>
  );
}

// Subcomponente de Rodillo / Slot Reel
function SlotReel({ title, item, isLocked, onToggleLock, onPrev, onNext, totalItems, isShuffling }) {
  if (!item) {
    return (
      <div className="slot-reel-card glass-card empty">
        <span className="slot-title">{title}</span>
        <span className="no-item-hint">Sin prendas en esta categoría</span>
      </div>
    );
  }

  return (
    <div className={`slot-reel-card glass-card ${isLocked ? 'is-locked' : ''}`}>
      <div className="slot-header">
        <span className="slot-title">{title}</span>
        <button 
          className={`lock-toggle-btn ${isLocked ? 'locked' : ''}`}
          onClick={onToggleLock}
          title={isLocked ? 'Desbloquear prenda' : 'Bloquear prenda para no mezclar'}
        >
          {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
          <span>{isLocked ? 'Fijado' : 'Libre'}</span>
        </button>
      </div>

      <div className="slot-content-row">
        <button className="nav-arrow-btn" onClick={onPrev} disabled={isLocked || isShuffling}>
          <ChevronLeft size={20} />
        </button>

        <div className={`slot-item-view ${isShuffling && !isLocked ? 'shuffling-blur' : ''}`}>
          <div className="slot-img-wrap">
            <img src={item.imageUrl} alt={item.name} />
          </div>
          <div className="slot-text-info">
            <span className="slot-brand">{item.brand || 'Esencial'}</span>
            <h4 className="slot-name">{item.name}</h4>
            <div className="slot-meta-chips">
              <span className="meta-chip">{item.color}</span>
              <span className="meta-chip">{item.fabric || 'Tejido noble'}</span>
              <span className="meta-chip gold-chip">{item.price}€</span>
            </div>
          </div>
        </div>

        <button className="nav-arrow-btn" onClick={onNext} disabled={isLocked || isShuffling}>
          <ChevronRight size={20} />
        </button>
      </div>

      <style>{`
        .slot-reel-card {
          padding: 12px 14px;
          border-radius: var(--radius-md);
          transition: border-color var(--transition-fast);
        }

        .slot-reel-card.is-locked {
          border-color: rgba(212, 175, 55, 0.5);
          background: rgba(28, 26, 20, 0.85);
        }

        .slot-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .slot-title {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-muted);
        }

        .lock-toggle-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 3px 8px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-subtle);
          background: rgba(255, 255, 255, 0.04);
          color: var(--text-muted);
          font-size: 11px;
          cursor: pointer;
        }

        .lock-toggle-btn.locked {
          background: rgba(212, 175, 55, 0.15);
          border-color: var(--accent-gold);
          color: var(--accent-gold);
          font-weight: 600;
        }

        .slot-content-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-arrow-btn {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
        }

        .nav-arrow-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .slot-item-view {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(0, 0, 0, 0.25);
          padding: 6px 10px;
          border-radius: var(--radius-sm);
          overflow: hidden;
        }

        .shuffling-blur {
          filter: blur(2px);
          opacity: 0.6;
        }

        .slot-img-wrap {
          width: 58px;
          height: 58px;
          border-radius: var(--radius-xs);
          overflow: hidden;
          background: #111;
          flex-shrink: 0;
        }

        .slot-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .slot-text-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .slot-brand {
          font-size: 9px;
          text-transform: uppercase;
          color: var(--text-muted);
          font-weight: 600;
        }

        .slot-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .slot-meta-chips {
          display: flex;
          gap: 4px;
          margin-top: 2px;
          flex-wrap: wrap;
        }

        .meta-chip {
          font-size: 9px;
          padding: 1px 6px;
          border-radius: 3px;
          background: rgba(255, 255, 255, 0.06);
          color: var(--text-secondary);
        }

        .gold-chip {
          color: var(--accent-gold);
          background: rgba(212, 175, 55, 0.1);
        }
      `}</style>
    </div>
  );
}
