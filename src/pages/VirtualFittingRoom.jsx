import React, { useState } from 'react';
import { 
  User, Sparkles, Layers, Eye, RefreshCw, Check, 
  BookmarkPlus, Sliders, ArrowUpDown, ShieldCheck, Heart 
} from 'lucide-react';
import { useWardrobeStore } from '../store/useWardrobeStore';
import { scoreOutfit, BODY_SHAPES, COLOR_SEASONS } from '../services/fashionEngine';

export default function VirtualFittingRoom() {
  const { items, profile, saveOutfit, logOutfitToCalendar } = useWardrobeStore();

  // Categorías de armario
  const layers = items.filter(i => i.category === 'abrigos');
  const tops = items.filter(i => i.category === 'superiores');
  const bottoms = items.filter(i => i.category === 'inferiores');
  const shoes = items.filter(i => i.category === 'calzado');
  const accessories = items.filter(i => i.category === 'accesorios');

  // Selección activa en el maniquí
  const [selectedLayer, setSelectedLayer] = useState(layers[0] || null);
  const [selectedTop, setSelectedTop] = useState(tops[0] || null);
  const [selectedBottom, setSelectedBottom] = useState(bottoms[0] || null);
  const [selectedShoe, setSelectedShoe] = useState(shoes[0] || null);
  const [selectedAccessory, setSelectedAccessory] = useState(accessories[0] || null);

  // Modos del Probador
  const [showProportionGuides, setShowProportionGuides] = useState(true);
  const [bodySilhouette, setBodySilhouette] = useState(profile?.bodyType || 'Trapecio');
  const [activeCategoryTab, setActiveCategoryTab] = useState('abrigos');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const currentOutfitItems = [selectedLayer, selectedTop, selectedBottom, selectedShoe, selectedAccessory].filter(Boolean);
  const evaluation = scoreOutfit(currentOutfitItems);

  const handleSaveLook = async () => {
    await saveOutfit({
      name: `Look Probador ${new Date().toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}`,
      occasion: 'Probador Virtual',
      formality: selectedLayer?.formality || 'Smart Casual',
      items: currentOutfitItems.map(i => i.id),
      colorHarmonyScore: evaluation.score
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const getActiveCategoryList = () => {
    switch (activeCategoryTab) {
      case 'abrigos': return layers;
      case 'superiores': return tops;
      case 'inferiores': return bottoms;
      case 'calzado': return shoes;
      case 'accesorios': return accessories;
      default: return [];
    }
  };

  const handleSelectItem = (item) => {
    switch (activeCategoryTab) {
      case 'abrigos': setSelectedLayer(selectedLayer?.id === item.id ? null : item); break;
      case 'superiores': setSelectedTop(item); break;
      case 'inferiores': setSelectedBottom(item); break;
      case 'calzado': setSelectedShoe(item); break;
      case 'accesorios': setSelectedAccessory(selectedAccessory?.id === item.id ? null : item); break;
      default: break;
    }
  };

  return (
    <div className="virtual-fitting-page animate-fade-in">
      <div className="fitting-header">
        <div>
          <span className="page-kicker">Probador Virtual Inteligente</span>
          <h2 className="page-title">Simulador de Fit & Silueta</h2>
        </div>

        <div className="fitting-header-actions">
          <button 
            className={`btn btn-secondary proportion-toggle-btn ${showProportionGuides ? 'active' : ''}`}
            onClick={() => setShowProportionGuides(!showProportionGuides)}
          >
            <ArrowUpDown size={15} />
            <span>Regla de los Tercios</span>
          </button>
        </div>
      </div>

      <div className="fitting-workspace">
        {/* ÁREA DEL MANIQUÍ / AVATAR INTERACTIVO */}
        <div className="avatar-stage glass-card">
          <div className="stage-controls-top">
            <span className="stage-badge">Silueta: {bodySilhouette}</span>
            <span className="score-pill gold-gradient-text">{evaluation.score} pts</span>
          </div>

          <div className={`mannequin-container silhouette-${bodySilhouette.toLowerCase().replace(' ', '-')}`}>
            {/* Guías de Proporción Áurea (Regla de los Tercios) */}
            {showProportionGuides && (
              <div className="proportion-grid-overlay">
                <div className="prop-line prop-head"><span>1/3 Torso</span></div>
                <div className="prop-line prop-waist"><span>Cintura / Tiro</span></div>
                <div className="prop-line prop-knee"><span>2/3 Piernas</span></div>
              </div>
            )}

            {/* Cabeza / Rostro */}
            <div className="avatar-head">
              <div className="avatar-hair" />
              <div className="avatar-face" style={{ backgroundColor: '#D49D6A' }}>
                {selectedAccessory && selectedAccessory.subcategory === 'gafas' && (
                  <div className="avatar-sunglasses" />
                )}
              </div>
            </div>

            {/* Capa / Abrigo / Chaqueta */}
            <div className="avatar-torso-slot">
              {selectedLayer ? (
                <div className="garment-layer-slot active-layer">
                  <img src={selectedLayer.imageUrl} alt={selectedLayer.name} />
                  <span className="garment-floating-label">{selectedLayer.name}</span>
                </div>
              ) : null}

              {/* Prenda Superior (Camisa/Jersey/Camiseta) */}
              {selectedTop && (
                <div className="garment-top-slot">
                  <img src={selectedTop.imageUrl} alt={selectedTop.name} />
                  {!selectedLayer && <span className="garment-floating-label">{selectedTop.name}</span>}
                </div>
              )}
            </div>

            {/* Prenda Inferior (Pantalón) */}
            <div className="avatar-legs-slot">
              {selectedBottom ? (
                <div className="garment-bottom-slot">
                  <img src={selectedBottom.imageUrl} alt={selectedBottom.name} />
                  <span className="garment-floating-label">{selectedBottom.name}</span>
                </div>
              ) : (
                <div className="empty-slot-hint">Sin pantalón seleccionado</div>
              )}
            </div>

            {/* Calzado */}
            <div className="avatar-feet-slot">
              {selectedShoe ? (
                <div className="garment-shoe-slot">
                  <img src={selectedShoe.imageUrl} alt={selectedShoe.name} />
                  <span className="garment-floating-label">{selectedShoe.name}</span>
                </div>
              ) : (
                <div className="empty-slot-hint">Sin calzado</div>
              )}
            </div>
          </div>

          <div className="stage-actions-bottom">
            <button className="btn btn-primary" onClick={handleSaveLook}>
              <BookmarkPlus size={16} />
              <span>{savedSuccess ? '¡Look Guardado!' : 'Guardar Look'}</span>
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => logOutfitToCalendar(1, new Date().toISOString().split('T')[0], 'Look de Probador')}
            >
              <Check size={16} />
              <span>Vestir Hoy</span>
            </button>
          </div>
        </div>

        {/* SELECTOR DE PRENDAS POR CAPA */}
        <div className="fitting-closet-drawer glass-card">
          <div className="drawer-tabs-row">
            {[
              { id: 'abrigos', label: 'Capa / Chaqueta' },
              { id: 'superiores', label: 'Arriba' },
              { id: 'inferiores', label: 'Pantalón' },
              { id: 'calzado', label: 'Calzado' },
              { id: 'accesorios', label: 'Accesorios' }
            ].map(tab => (
              <button
                key={tab.id}
                className={`drawer-tab-btn ${activeCategoryTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveCategoryTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="drawer-garments-scroll">
            {getActiveCategoryList().map(item => {
              const isSelected = 
                selectedLayer?.id === item.id || 
                selectedTop?.id === item.id || 
                selectedBottom?.id === item.id || 
                selectedShoe?.id === item.id || 
                selectedAccessory?.id === item.id;

              return (
                <div
                  key={item.id}
                  className={`drawer-item-thumb ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelectItem(item)}
                >
                  <img src={item.imageUrl} alt={item.name} />
                  {isSelected && (
                    <div className="thumb-check-overlay">
                      <Check size={14} />
                    </div>
                  )}
                  <span className="thumb-item-name">{item.name}</span>
                </div>
              );
            })}
          </div>

          {/* Análisis de Fit en vivo */}
          <div className="fit-critique-box">
            <div className="critique-header">
              <Sparkles size={16} className="gold-icon" />
              <h4>Análisis de Fit Satorial</h4>
            </div>
            <p className="critique-verdict"><strong>{evaluation.verdict}</strong></p>
            <div className="critique-reasons">
              {evaluation.reasons.map((r, i) => (
                <div key={i} className="c-reason">
                  <span>✦</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .virtual-fitting-page {
          padding: 16px 20px 40px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .fitting-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
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

        .proportion-toggle-btn.active {
          border-color: var(--accent-gold);
          color: var(--accent-gold);
          background: rgba(212, 175, 55, 0.15);
        }

        .fitting-workspace {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        @media (min-width: 768px) {
          .fitting-workspace {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }
        }

        /* Avatar Stage */
        .avatar-stage {
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          background: #111116;
          border-radius: var(--radius-lg);
          border: 1px solid rgba(212, 175, 55, 0.25);
        }

        .stage-controls-top {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .stage-badge {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.05);
          padding: 4px 10px;
          border-radius: var(--radius-full);
        }

        .score-pill {
          font-size: 16px;
          font-weight: 800;
        }

        .mannequin-container {
          position: relative;
          width: 240px;
          min-height: 480px;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px 0;
        }

        /* Proportions Overlay */
        .proportion-grid-overlay {
          position: absolute;
          top: 0;
          left: -20px;
          right: -20px;
          bottom: 0;
          pointer-events: none;
          z-index: 10;
        }

        .prop-line {
          position: absolute;
          width: 100%;
          border-bottom: 1px dashed rgba(212, 175, 55, 0.4);
          display: flex;
          justify-content: flex-end;
          padding-right: 4px;
        }

        .prop-line span {
          font-size: 9px;
          color: var(--accent-gold);
          background: rgba(10, 10, 12, 0.8);
          padding: 1px 4px;
          border-radius: 2px;
        }

        .prop-head { top: 70px; }
        .prop-waist { top: 220px; border-bottom-color: rgba(56, 189, 248, 0.5); }
        .prop-waist span { color: #38bdf8; }
        .prop-knee { top: 380px; }

        /* Avatar Body Parts */
        .avatar-head {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 6px;
        }

        .avatar-hair {
          width: 44px;
          height: 16px;
          background: #271A12;
          border-radius: 20px 20px 0 0;
        }

        .avatar-face {
          width: 38px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .avatar-sunglasses {
          width: 30px;
          height: 10px;
          background: #111;
          border-radius: 2px;
        }

        .avatar-torso-slot {
          position: relative;
          width: 140px;
          height: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .garment-layer-slot {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 3;
          border-radius: var(--radius-sm);
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }

        .garment-layer-slot img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .garment-top-slot {
          width: 88%;
          height: 90%;
          z-index: 2;
          border-radius: var(--radius-sm);
          overflow: hidden;
        }

        .garment-top-slot img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-legs-slot {
          width: 110px;
          height: 190px;
          margin-top: -6px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          z-index: 1;
        }

        .garment-bottom-slot {
          width: 100%;
          height: 100%;
        }

        .garment-bottom-slot img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-feet-slot {
          width: 90px;
          height: 65px;
          margin-top: 2px;
          border-radius: var(--radius-xs);
          overflow: hidden;
        }

        .garment-shoe-slot {
          width: 100%;
          height: 100%;
        }

        .garment-shoe-slot img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .garment-floating-label {
          position: absolute;
          bottom: 4px;
          left: 4px;
          font-size: 8px;
          background: rgba(0, 0, 0, 0.75);
          color: #fff;
          padding: 1px 4px;
          border-radius: 3px;
          white-space: nowrap;
          max-width: 90%;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .stage-actions-bottom {
          display: flex;
          gap: 10px;
          width: 100%;
          margin-top: 16px;
        }

        /* Drawer */
        .fitting-closet-drawer {
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .drawer-tabs-row {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 4px;
        }

        .drawer-tab-btn {
          padding: 6px 12px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-subtle);
          background: var(--bg-card);
          color: var(--text-secondary);
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
          cursor: pointer;
        }

        .drawer-tab-btn.active {
          background: var(--accent-gradient);
          color: #0b0b0e;
        }

        .drawer-garments-scroll {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          max-height: 280px;
          overflow-y: auto;
          padding: 4px;
        }

        .drawer-item-thumb {
          position: relative;
          display: flex;
          flex-direction: column;
          border-radius: var(--radius-sm);
          overflow: hidden;
          background: #111;
          cursor: pointer;
          border: 2px solid transparent;
          transition: border-color 0.2s;
        }

        .drawer-item-thumb.selected {
          border-color: var(--accent-gold);
        }

        .drawer-item-thumb img {
          width: 100%;
          height: 80px;
          object-fit: cover;
        }

        .thumb-check-overlay {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 20px;
          height: 20px;
          border-radius: var(--radius-full);
          background: var(--accent-gold);
          color: #0b0b0e;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .thumb-item-name {
          font-size: 9px;
          padding: 4px 6px;
          background: var(--bg-card);
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .fit-critique-box {
          padding: 12px 14px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: var(--radius-sm);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .critique-header {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .critique-header h4 {
          font-size: 12px;
          font-weight: 700;
        }

        .critique-verdict {
          font-size: 13px;
          color: var(--accent-gold-light);
        }

        .critique-reasons {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .c-reason {
          display: flex;
          align-items: flex-start;
          gap: 6px;
          font-size: 11px;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
