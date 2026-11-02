import React, { useState } from 'react';
import { 
  ShoppingBag, Sparkles, Plus, CheckCircle2, AlertTriangle, 
  TrendingUp, ArrowRight, Trash2, Camera, ExternalLink, Lightbulb, ShieldCheck 
} from 'lucide-react';
import { useWardrobeStore } from '../store/useWardrobeStore';
import { evaluatePurchaseCandidate } from '../services/shoppingAdvisor';

export default function ShoppingAdvisorView() {
  const { 
    items, 
    profile, 
    wishlist, 
    recommendedGaps, 
    evaluateAndAddWishlist, 
    deleteWishlistItem,
    addItem 
  } = useWardrobeStore();

  const [activeTab, setActiveTab] = useState('evaluator'); // 'evaluator', 'recommendations', 'wishlist'

  // Formulario evaluador
  const [candidate, setCandidate] = useState({
    name: '',
    category: 'superiores',
    price: 69,
    brand: '',
    color: 'Marrón Chocolate',
    colorHex: '#3B2219',
    fabric: 'Algodón / Lana',
    imageUrl: ''
  });

  const [currentEvaluation, setCurrentEvaluation] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleEvaluate = (e) => {
    e.preventDefault();
    if (!candidate.name) return;

    setIsEvaluating(true);
    setTimeout(() => {
      const result = evaluatePurchaseCandidate(candidate, items, profile);
      setCurrentEvaluation(result);
      setIsEvaluating(false);
    }, 400);
  };

  const handleSaveToWishlist = async () => {
    if (!currentEvaluation) return;
    await evaluateAndAddWishlist(candidate);
    setActiveTab('wishlist');
    setCurrentEvaluation(null);
  };

  const handleQuickAddRecommended = (rec) => {
    setCandidate({
      name: rec.name,
      category: rec.category,
      price: 85,
      brand: 'Marca Recomendada',
      color: 'Neutro Clásico',
      colorHex: rec.colorHex || '#D7C4A5',
      fabric: 'Calidad Premium',
      imageUrl: rec.imageUrl
    });
    setActiveTab('evaluator');
    const result = evaluatePurchaseCandidate({
      name: rec.name,
      category: rec.category,
      price: 85,
      brand: 'Marca Recomendada',
      color: 'Neutro Clásico',
      colorHex: rec.colorHex || '#D7C4A5',
      fabric: 'Calidad Premium',
      imageUrl: rec.imageUrl
    }, items, profile);
    setCurrentEvaluation(result);
  };

  return (
    <div className="shopping-view animate-fade-in">
      <div className="shopping-header">
        <div>
          <span className="page-kicker">Inteligencia de Compra (Fase 2)</span>
          <h2 className="page-title">Personal Shopper IA</h2>
        </div>

        <div className="shopping-tabs">
          <button 
            className={`shopping-tab ${activeTab === 'evaluator' ? 'active' : ''}`}
            onClick={() => setActiveTab('evaluator')}
          >
            <Sparkles size={14} />
            <span>¿Me lo compro?</span>
          </button>
          <button 
            className={`shopping-tab ${activeTab === 'recommendations' ? 'active' : ''}`}
            onClick={() => setActiveTab('recommendations')}
          >
            <Lightbulb size={14} />
            <span>Qué comprarte</span>
          </button>
          <button 
            className={`shopping-tab ${activeTab === 'wishlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('wishlist')}
          >
            <ShoppingBag size={14} />
            <span>Wishlist ({wishlist.length})</span>
          </button>
        </div>
      </div>

      {/* PESTAÑA 1: EVALUADOR "¿ME LO COMPRO?" */}
      {activeTab === 'evaluator' && (
        <div className="evaluator-container">
          <div className="evaluator-card glass-card">
            <div className="evaluator-header">
              <Sparkles size={18} className="gold-icon" />
              <div>
                <h3>Evaluador de Compras en Tienda</h3>
                <p>Introduce la prenda que has visto y la IA calculará si realmente merece tu dinero.</p>
              </div>
            </div>

            <form onSubmit={handleEvaluate} className="candidate-form">
              <div className="form-group">
                <label>¿Qué prenda quieres comprarte? *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Sobrecamisa de Pana Tabaco, Zapatillas Blancas..."
                  value={candidate.name}
                  onChange={(e) => setCandidate({ ...candidate, name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Categoría</label>
                  <select
                    value={candidate.category}
                    onChange={(e) => setCandidate({ ...candidate, category: e.target.value })}
                  >
                    <option value="superiores">Parte Superior (Camisa/Jersey/Polo)</option>
                    <option value="inferiores">Pantalón (Chino/Vaquero/Vestir)</option>
                    <option value="abrigos">Chaqueta / Capa Exterior</option>
                    <option value="calzado">Calzado (Sneakers/Mocasines/Botas)</option>
                    <option value="accesorios">Accesorio</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Precio Estimado (€)</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="79"
                    value={candidate.price}
                    onChange={(e) => setCandidate({ ...candidate, price: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Color Dominante</label>
                  <input
                    type="text"
                    placeholder="Ej: Azul Marino, Verde Oliva, Camel..."
                    value={candidate.color}
                    onChange={(e) => setCandidate({ ...candidate, color: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Tienda / Marca</label>
                  <input
                    type="text"
                    placeholder="Ej: Massimo Dutti, Scalpers, COS..."
                    value={candidate.brand}
                    onChange={(e) => setCandidate({ ...candidate, brand: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary evaluate-btn" disabled={isEvaluating}>
                <Sparkles size={17} />
                <span>{isEvaluating ? 'Analizando con tu Armario...' : 'Evaluar Compra con IA'}</span>
              </button>
            </form>
          </div>

          {/* Resultado de la Evaluación */}
          {currentEvaluation && (
            <div className="evaluation-result-card glass-card animate-fade-in">
              <div className="result-score-banner">
                <div className="result-left">
                  <span className="verdict-kicker">Veredicto Oficial STYLUS</span>
                  <h4 className="verdict-title">{currentEvaluation.verdict}</h4>
                </div>
                <div className="score-circle">
                  <span className="score-circle-num">{currentEvaluation.score}</span>
                  <span className="score-circle-sub">/ 100</span>
                </div>
              </div>

              {/* Métricas clave */}
              <div className="result-metrics-grid">
                <div className="metric-cell">
                  <span className="m-label">Outfits Nuevos</span>
                  <span className="m-val gold-gradient-text">+{currentEvaluation.unlockedOutfits}</span>
                  <span className="m-sub">con tu ropa actual</span>
                </div>
                <div className="metric-cell">
                  <span className="m-label">Coste Por Uso</span>
                  <span className="m-val">{currentEvaluation.projectedCPW}€</span>
                  <span className="m-sub">estimado 1er año</span>
                </div>
                <div className="metric-cell">
                  <span className="m-label">Colorimetría</span>
                  <span className="m-val">
                    {currentEvaluation.score >= 80 ? 'Compatible' : 'Revisar'}
                  </span>
                  <span className="m-sub">{profile?.seasonColor?.split(' ')[0] || 'Otoño'}</span>
                </div>
              </div>

              {/* Argumentos de Estilo */}
              <div className="arguments-section">
                <h5 className="arguments-title">Puntos Clave del Análisis</h5>
                <div className="arguments-list">
                  {currentEvaluation.pros.map((pro, idx) => (
                    <div key={idx} className="arg-item pro">
                      <CheckCircle2 size={16} className="pro-icon" />
                      <span>{pro}</span>
                    </div>
                  ))}
                  {currentEvaluation.cons.map((con, idx) => (
                    <div key={idx} className="arg-item con">
                      <AlertTriangle size={16} className="con-icon" />
                      <span>{con}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="result-actions">
                <button className="btn btn-primary" onClick={handleSaveToWishlist}>
                  <ShoppingBag size={16} />
                  <span>Guardar en Lista de Deseos</span>
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={async () => {
                    await addItem({
                      name: candidate.name,
                      category: candidate.category,
                      brand: candidate.brand,
                      price: candidate.price,
                      color: candidate.color,
                      colorHex: candidate.colorHex,
                      fabric: candidate.fabric,
                      imageUrl: candidate.imageUrl || 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&auto=format&fit=crop&q=80',
                      formality: 'Smart Casual'
                    });
                    alert('¡Prenda añadida a tu Armario!');
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>Ya me la he comprado (Añadir al Armario)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PESTAÑA 2: RECOMENDADOR PROACTIVO DE PRENDAS A COMPRAR */}
      {activeTab === 'recommendations' && (
        <div className="recommendations-container">
          <div className="recommendations-intro glass-card">
            <Lightbulb size={20} className="gold-icon" />
            <div>
              <h4>Piezas Faltantes en tu Armario Cápsula</h4>
              <p>
                Hemos analizado la distribución de tus prendas y colores. Comprar estas piezas clave 
                desbloqueará el mayor número de looks con la mínima inversión.
              </p>
            </div>
          </div>

          <div className="gaps-list">
            {recommendedGaps.map((gap, index) => (
              <div key={gap.key || index} className="gap-card glass-card">
                <div className="gap-img-wrap">
                  <img src={gap.imageUrl} alt={gap.name} />
                  <span className="gap-tag">{gap.category}</span>
                </div>

                <div className="gap-info">
                  <div className="gap-top-row">
                    <span className="gap-impact-badge">{gap.impact}</span>
                    <span className="gap-price-est">{gap.estimatedPrice}</span>
                  </div>

                  <h4 className="gap-name">{gap.name}</h4>
                  <p className="gap-reason">{gap.reason}</p>

                  <div className="gap-tags-row">
                    {gap.tags?.map((t, i) => (
                      <span key={i} className="gap-chip">{t}</span>
                    ))}
                  </div>

                  <div className="gap-actions">
                    <button 
                      className="btn btn-primary gap-eval-btn"
                      onClick={() => handleQuickAddRecommended(gap)}
                    >
                      <Sparkles size={14} />
                      <span>Evaluar esta Prenda</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PESTAÑA 3: WISHLIST EVALUADA */}
      {activeTab === 'wishlist' && (
        <div className="wishlist-container">
          {wishlist.length === 0 ? (
            <div className="empty-state glass-card">
              <ShoppingBag size={32} className="gold-icon" />
              <h4>Tu Wishlist está vacía</h4>
              <p>Usa la pestaña "¿Me lo compro?" para evaluar prendas y guardarlas aquí.</p>
              <button className="btn btn-primary" onClick={() => setActiveTab('evaluator')}>
                Evaluar mi primera prenda
              </button>
            </div>
          ) : (
            <div className="wishlist-grid">
              {wishlist.map((item) => (
                <div key={item.id} className="wishlist-item-card glass-card">
                  <div className="wishlist-card-top">
                    <span className="w-brand">{item.brand || 'Marca'}</span>
                    <button 
                      className="delete-w-btn" 
                      onClick={() => deleteWishlistItem(item.id)}
                      title="Eliminar de la wishlist"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <h4 className="w-name">{item.name}</h4>
                  
                  <div className="w-score-row">
                    <span className="w-score-badge gold-gradient-text">{item.aiScore || 90} pts</span>
                    <span className="w-verdict">{item.aiVerdict || 'Recomendada'}</span>
                  </div>

                  <p className="w-reason">{item.reason || item.pros?.[0] || 'Excelente versatilidad'}</p>

                  <div className="w-bottom-bar">
                    <span className="w-price">{item.price || item.estimatedPrice || 80}€</span>
                    <button 
                      className="btn btn-primary buy-btn-micro"
                      onClick={async () => {
                        await addItem({
                          name: item.name,
                          category: item.category || 'superiores',
                          brand: item.brand,
                          price: item.price || 80,
                          imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&auto=format&fit=crop&q=80',
                          formality: 'Smart Casual'
                        });
                        await deleteWishlistItem(item.id);
                        alert('¡Felicidades por la compra! Se ha añadido a tu Armario.');
                      }}
                    >
                      <CheckCircle2 size={13} />
                      <span>Comprado</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        .shopping-view {
          padding: 16px 20px 40px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .shopping-header {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        @media (min-width: 480px) {
          .shopping-header {
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

        .shopping-tabs {
          display: flex;
          gap: 6px;
          background: var(--bg-card);
          padding: 4px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-subtle);
          overflow-x: auto;
        }

        .shopping-tab {
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
          white-space: nowrap;
        }

        .shopping-tab.active {
          background: var(--accent-gradient);
          color: #0b0b0e;
        }

        .evaluator-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .evaluator-card {
          padding: 20px;
        }

        .evaluator-header {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 16px;
        }

        .evaluator-header h3 {
          font-size: 16px;
          font-weight: 700;
        }

        .evaluator-header p {
          font-size: 12px;
          color: var(--text-secondary);
          margin-top: 2px;
        }

        .candidate-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }

        .form-group label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .form-group input, .form-group select {
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          background: var(--bg-primary);
          border: 1px solid var(--border-subtle);
          color: var(--text-primary);
          font-size: 13px;
          outline: none;
        }

        .form-group input:focus, .form-group select:focus {
          border-color: var(--border-gold);
        }

        .form-row {
          display: flex;
          gap: 12px;
        }

        .evaluate-btn {
          margin-top: 8px;
          padding: 14px;
          font-size: 14px;
        }

        /* Result Card */
        .evaluation-result-card {
          padding: 20px;
          border-color: rgba(212, 175, 55, 0.4);
          box-shadow: 0 8px 32px rgba(212, 175, 55, 0.15);
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .result-score-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--border-subtle);
        }

        .verdict-kicker {
          font-size: 10px;
          text-transform: uppercase;
          color: var(--accent-gold);
          font-weight: 700;
          letter-spacing: 0.08em;
        }

        .verdict-title {
          font-size: 20px;
          font-weight: 800;
          color: var(--text-primary);
          margin-top: 2px;
        }

        .score-circle {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px 14px;
          border-radius: var(--radius-sm);
          background: rgba(212, 175, 55, 0.15);
          border: 1px solid var(--border-gold);
        }

        .score-circle-num {
          font-size: 26px;
          font-weight: 800;
          color: var(--accent-gold);
          line-height: 1;
        }

        .score-circle-sub {
          font-size: 9px;
          color: var(--text-muted);
        }

        .result-metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .metric-cell {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 12px 6px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
        }

        .m-label {
          font-size: 10px;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        .m-val {
          font-size: 18px;
          font-weight: 700;
          margin: 4px 0 2px;
        }

        .m-sub {
          font-size: 9px;
          color: var(--text-secondary);
        }

        .arguments-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .arguments-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .arguments-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .arg-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 13px;
          line-height: 1.4;
          padding: 8px 12px;
          border-radius: var(--radius-sm);
        }

        .arg-item.pro {
          background: rgba(56, 189, 248, 0.08);
          color: #e0f2fe;
          border-left: 3px solid #38bdf8;
        }

        .arg-item.con {
          background: rgba(239, 68, 68, 0.08);
          color: #fee2e2;
          border-left: 3px solid #ef4444;
        }

        .pro-icon {
          color: #38bdf8;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .con-icon {
          color: #ef4444;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .result-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 4px;
        }

        /* Recommendations */
        .recommendations-container {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .recommendations-intro {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
        }

        .recommendations-intro h4 {
          font-size: 14px;
          font-weight: 700;
        }

        .recommendations-intro p {
          font-size: 12px;
          color: var(--text-secondary);
          margin-top: 2px;
        }

        .gaps-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .gap-card {
          display: flex;
          flex-direction: column;
          padding: 14px;
          gap: 12px;
        }

        @media (min-width: 540px) {
          .gap-card {
            flex-direction: row;
          }
        }

        .gap-img-wrap {
          position: relative;
          width: 100%;
          height: 140px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          background: #111;
          flex-shrink: 0;
        }

        @media (min-width: 540px) {
          .gap-img-wrap {
            width: 130px;
            height: 130px;
          }
        }

        .gap-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .gap-tag {
          position: absolute;
          top: 6px;
          left: 6px;
          font-size: 8px;
          padding: 2px 6px;
          background: rgba(0,0,0,0.7);
          border-radius: 3px;
          text-transform: uppercase;
        }

        .gap-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }

        .gap-top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .gap-impact-badge {
          font-size: 11px;
          font-weight: 700;
          color: var(--accent-gold);
          background: rgba(212, 175, 55, 0.1);
          padding: 2px 8px;
          border-radius: var(--radius-full);
        }

        .gap-price-est {
          font-size: 11px;
          color: var(--text-muted);
        }

        .gap-name {
          font-size: 14px;
          font-weight: 700;
        }

        .gap-reason {
          font-size: 12px;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .gap-tags-row {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .gap-chip {
          font-size: 9px;
          padding: 2px 6px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
          color: var(--text-muted);
        }

        .gap-actions {
          margin-top: 6px;
        }

        .gap-eval-btn {
          padding: 8px 14px;
          font-size: 12px;
        }

        /* Wishlist */
        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 12px;
        }

        @media (min-width: 500px) {
          .wishlist-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .wishlist-item-card {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .wishlist-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .w-brand {
          font-size: 10px;
          text-transform: uppercase;
          color: var(--text-muted);
          font-weight: 700;
        }

        .delete-w-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }

        .delete-w-btn:hover {
          color: var(--danger);
        }

        .w-name {
          font-size: 14px;
          font-weight: 700;
        }

        .w-score-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .w-score-badge {
          font-size: 16px;
          font-weight: 800;
        }

        .w-verdict {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .w-reason {
          font-size: 12px;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .w-bottom-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 6px;
          padding-top: 8px;
          border-top: 1px solid var(--border-subtle);
        }

        .w-price {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .buy-btn-micro {
          padding: 6px 10px;
          font-size: 11px;
        }

        .empty-state {
          padding: 40px 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .empty-state h4 {
          font-size: 16px;
        }

        .empty-state p {
          font-size: 13px;
          color: var(--text-secondary);
          max-width: 280px;
        }

        .gold-icon {
          color: var(--accent-gold);
        }
      `}</style>
    </div>
  );
}
