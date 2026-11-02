import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, CheckCircle2, RefreshCw, Plus, Shirt, ShoppingBag, Flame, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { useWardrobeStore } from '../store/useWardrobeStore';
import { scoreOutfit } from '../services/fashionEngine';

export default function Home() {
  const navigate = useNavigate();
  const { weather, items, outfits, profile, logOutfitToCalendar } = useWardrobeStore();
  const [loggedToday, setLoggedToday] = useState(false);
  const [recommendationIndex, setRecommendationIndex] = useState(0);

  // Generar recomendaciones dinámicas basadas en el clima y el armario del usuario
  const tops = items.filter(i => i.category === 'superiores');
  const bottoms = items.filter(i => i.category === 'inferiores');
  const shoes = items.filter(i => i.category === 'calzado');
  const layers = items.filter(i => i.category === 'abrigos');
  const accessories = items.filter(i => i.category === 'accesorios');

  // Construir 3 sugerencias con estilo
  const recommendations = [
    {
      title: 'Smart Casual Sofisticado',
      description: 'Ideal para oficina o eventos de día. Equilibrio perfecto de tonos neutros y capas ligeras.',
      items: [
        layers.find(i => i.subcategory === 'blazers') || layers[0],
        tops.find(i => i.subcategory === 'camisas') || tops[0],
        bottoms.find(i => i.subcategory === 'chinos') || bottoms[0],
        shoes.find(i => i.subcategory === 'sneakers') || shoes[0],
        accessories[0]
      ].filter(Boolean)
    },
    {
      title: 'Monocromo Urbano Elegante',
      description: 'Silueta estilizada y moderna. Ideal para tardes frescas o cenas casuales.',
      items: [
        layers.find(i => i.subcategory === 'abrigos') || layers[1] || layers[0],
        tops.find(i => i.subcategory === 'jerseys') || tops[1] || tops[0],
        bottoms.find(i => i.subcategory === 'vaqueros') || bottoms[1] || bottoms[0],
        shoes.find(i => i.subcategory === 'botas') || shoes[1] || shoes[0],
        accessories[1] || accessories[0]
      ].filter(Boolean)
    },
    {
      title: 'Casual Relajado de Autor',
      description: 'Confort premium con textura de algodón pesado y sobrecamisa estructurada.',
      items: [
        layers.find(i => i.subcategory === 'sobrecamisas') || layers[0],
        tops.find(i => i.subcategory === 'camisetas') || tops[0],
        bottoms[0],
        shoes[0],
        accessories[0]
      ].filter(Boolean)
    }
  ];

  const currentLook = recommendations[recommendationIndex % recommendations.length];
  const outfitEvaluation = scoreOutfit(currentLook.items);

  const handleLogWear = async () => {
    // Si tenemos un outfit guardado similar o lo anotamos directamente
    const fakeOutfitId = outfits[0]?.id || 1;
    await logOutfitToCalendar(fakeOutfitId, new Date().toISOString().split('T')[0], 'Outfit Diario Recomendado');
    setLoggedToday(true);
  };

  const handleNextLook = () => {
    setRecommendationIndex(prev => prev + 1);
    setLoggedToday(false);
  };

  // Calcular valor total del armario y CPW medio
  const totalValue = items.reduce((acc, i) => acc + (i.price || 0), 0);
  const totalWears = items.reduce((acc, i) => acc + (i.wearCount || 0), 0);
  const averageCPW = totalWears > 0 ? (totalValue / totalWears).toFixed(2) : '0.00';

  return (
    <div className="home-page animate-fade-in">
      {/* Saludo y Clima */}
      <section className="hero-section">
        <div className="hero-header">
          <div>
            <span className="hero-badge">Estilo Personalizado</span>
            <h2 className="hero-greeting">
              Buenos días, <span className="gold-gradient-text">{profile?.name || 'Caballero'}</span>
            </h2>
          </div>
          <button className="avatar-btn" onClick={() => navigate('/estilo')} title="Ver Perfil de Estilo">
            <span>{profile?.bodyType?.[0] || 'T'}</span>
          </button>
        </div>

        {weather && (
          <div className="weather-card glass-card">
            <div className="weather-info-row">
              <div>
                <span className="weather-city">{weather.city}</span>
                <div className="weather-temp-large">
                  {weather.temp}°C
                  <span className="weather-condition-text"> · {weather.condition}</span>
                </div>
              </div>
              <div className="weather-tag">
                <Sparkles size={14} className="gold-icon" />
                <span>{weather.layerType}</span>
              </div>
            </div>
            <p className="weather-advice">{weather.advice}</p>
          </div>
        )}
      </section>

      {/* Outfit del Día */}
      <section className="recommendation-section">
        <div className="section-title-row">
          <div className="title-with-icon">
            <Sparkles size={18} className="gold-icon" />
            <h3>Look Recomendado para Hoy</h3>
          </div>
          <button className="refresh-btn" onClick={handleNextLook} title="Ver otra opción">
            <RefreshCw size={15} />
            <span>Rotar</span>
          </button>
        </div>

        <div className="outfit-spotlight-card glass-card">
          <div className="spotlight-header">
            <div>
              <h4 className="spotlight-title">{currentLook.title}</h4>
              <p className="spotlight-desc">{currentLook.description}</p>
            </div>
            <div className="harmony-score-badge">
              <span className="score-number">{outfitEvaluation.score}</span>
              <span className="score-label">PUNTOS</span>
            </div>
          </div>

          {/* Grid de las prendas del look */}
          <div className="outfit-items-row">
            {currentLook.items.map((item, idx) => (
              <div key={item.id || idx} className="outfit-item-card" onClick={() => navigate('/armario')}>
                <div className="item-thumb-wrap">
                  <img src={item.imageUrl} alt={item.name} className="item-img" />
                  <span className="item-category-tag">{item.category}</span>
                </div>
                <span className="item-name-micro">{item.name}</span>
                <span className="item-brand-micro">{item.brand}</span>
              </div>
            ))}
          </div>

          <div className="spotlight-reasons">
            {outfitEvaluation.reasons.map((r, i) => (
              <div key={i} className="reason-bullet">
                <span className="bullet-dot">✦</span>
                <span>{r}</span>
              </div>
            ))}
          </div>

          <div className="spotlight-actions">
            <button
              className={`btn btn-primary log-wear-btn ${loggedToday ? 'logged' : ''}`}
              onClick={handleLogWear}
              disabled={loggedToday}
            >
              <CheckCircle2 size={18} />
              <span>{loggedToday ? '¡Registrado en el Calendario!' : 'Me lo pongo hoy'}</span>
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/outfits')}>
              Personalizar Look
            </button>
          </div>
        </div>
      </section>

      {/* Accesos Rápidos de Poder */}
      <section className="quick-access-section">
        <h3 className="section-title">Herramientas de Inteligencia</h3>
        <div className="quick-grid">
          <div className="quick-card" onClick={() => navigate('/probador')}>
            <div className="quick-card-icon gold-bg">
              <Shirt size={20} />
            </div>
            <div className="quick-card-content">
              <h4>Probador Virtual de Silueta</h4>
              <p>Simulador de prendas y regla de los tercios en vivo</p>
            </div>
            <ArrowRight size={16} className="card-arrow" />
          </div>

          <div className="quick-card" onClick={() => navigate('/outfits')}>
            <div className="quick-card-icon gold-bg">
              <RefreshCw size={20} />
            </div>
            <div className="quick-card-content">
              <h4>Ruleta de Looks</h4>
              <p>Clueless shuffle con bloqueo inteligente de prendas</p>
            </div>
            <ArrowRight size={16} className="card-arrow" />
          </div>

          <div className="quick-card" onClick={() => navigate('/shopping')}>
            <div className="quick-card-icon blue-bg">
              <ShoppingBag size={20} />
            </div>
            <div className="quick-card-content">
              <h4>Evaluador "¿Me lo compro?"</h4>
              <p>Analiza compras futuras y huecos clave de tu armario</p>
            </div>
            <ArrowRight size={16} className="card-arrow" />
          </div>

          <div className="quick-card" onClick={() => navigate('/maleta')}>
            <div className="quick-card-icon purple-bg">
              <Calendar size={20} />
            </div>
            <div className="quick-card-content">
              <h4>Maleta Cápsula de Viaje</h4>
              <p>Genera la maleta mínima para N días según el clima</p>
            </div>
            <ArrowRight size={16} className="card-arrow" />
          </div>

          <div className="quick-card" onClick={() => navigate('/analiticas')}>
            <div className="quick-card-icon blue-bg">
              <TrendingUp size={20} />
            </div>
            <div className="quick-card-content">
              <h4>Analíticas & Prendas Olvidadas</h4>
              <p>Coste por uso, ROI de prendas y distribución de colores</p>
            </div>
            <ArrowRight size={16} className="card-arrow" />
          </div>
        </div>
      </section>

      {/* Métricas de Inversión y Rentabilidad */}
      <section className="metrics-section">
        <h3 className="section-title">Rentabilidad de tu Armario</h3>
        <div className="metrics-row">
          <div className="metric-box glass-card">
            <span className="metric-label">Valor Total</span>
            <span className="metric-val">{totalValue}€</span>
            <span className="metric-sub">en {items.length} prendas</span>
          </div>
          <div className="metric-box glass-card">
            <span className="metric-label">Coste Medio / Uso</span>
            <span className="metric-val gold-gradient-text">{averageCPW}€</span>
            <span className="metric-sub">alta amortización</span>
          </div>
          <div className="metric-box glass-card">
            <span className="metric-label">Looks Posibles</span>
            <span className="metric-val">+{tops.length * bottoms.length * (layers.length || 1)}</span>
            <span className="metric-sub">combinaciones únicas</span>
          </div>
        </div>
      </section>

      <style>{`
        .home-page {
          padding: 16px 20px 40px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .hero-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .hero-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .hero-badge {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--accent-gold);
        }

        .hero-greeting {
          font-size: 24px;
          font-weight: 700;
          margin-top: 2px;
        }

        .avatar-btn {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-full);
          background: var(--bg-card);
          border: 1px solid var(--border-gold);
          color: var(--accent-gold-light);
          font-weight: 700;
          font-size: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-sm);
        }

        .weather-card {
          padding: 16px 18px;
          background: linear-gradient(135deg, rgba(26, 26, 36, 0.7) 0%, rgba(18, 18, 24, 0.9) 100%);
          border-radius: var(--radius-md);
        }

        .weather-info-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
        }

        .weather-city {
          font-size: 12px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .weather-temp-large {
          font-size: 22px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .weather-condition-text {
          font-size: 14px;
          font-weight: 400;
          color: var(--text-secondary);
        }

        .weather-tag {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          background: rgba(212, 175, 55, 0.12);
          border: 1px solid rgba(212, 175, 55, 0.25);
          font-size: 11px;
          font-weight: 600;
          color: var(--text-gold);
        }

        .weather-advice {
          font-size: 13px;
          line-height: 1.45;
          color: var(--text-secondary);
        }

        .gold-icon {
          color: var(--accent-gold);
        }

        .section-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .title-with-icon {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .title-with-icon h3 {
          font-size: 17px;
          font-weight: 600;
        }

        .refresh-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          background: transparent;
          border: 1px solid var(--border-subtle);
          padding: 6px 12px;
          border-radius: var(--radius-full);
          color: var(--text-secondary);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .refresh-btn:hover {
          color: var(--text-primary);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .outfit-spotlight-card {
          padding: 20px;
          border-radius: var(--radius-lg);
          border: 1px solid rgba(212, 175, 55, 0.3);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .spotlight-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .spotlight-title {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .spotlight-desc {
          font-size: 13px;
          color: var(--text-secondary);
          margin-top: 2px;
        }

        .harmony-score-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          background: rgba(212, 175, 55, 0.15);
          border: 1px solid var(--border-gold);
        }

        .score-number {
          font-size: 20px;
          font-weight: 800;
          color: var(--accent-gold);
          line-height: 1;
        }

        .score-label {
          font-size: 8px;
          letter-spacing: 0.1em;
          color: var(--text-secondary);
        }

        .outfit-items-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 4px;
        }

        @media (max-width: 480px) {
          .outfit-items-row {
            grid-template-columns: repeat(4, minmax(80px, 1fr));
          }
        }

        .outfit-item-card {
          display: flex;
          flex-direction: column;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.02);
          padding: 8px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
          transition: transform var(--transition-fast);
        }

        .outfit-item-card:hover {
          transform: translateY(-2px);
          border-color: rgba(212, 175, 55, 0.3);
        }

        .item-thumb-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          border-radius: var(--radius-xs);
          overflow: hidden;
          background: #111116;
          margin-bottom: 6px;
        }

        .item-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .item-category-tag {
          position: absolute;
          bottom: 4px;
          left: 4px;
          font-size: 8px;
          padding: 2px 4px;
          background: rgba(0, 0, 0, 0.7);
          border-radius: 3px;
          color: #fff;
          text-transform: uppercase;
        }

        .item-name-micro {
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .item-brand-micro {
          font-size: 9px;
          color: var(--text-muted);
        }

        .spotlight-reasons {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 10px 12px;
          background: rgba(0, 0, 0, 0.25);
          border-radius: var(--radius-sm);
        }

        .reason-bullet {
          display: flex;
          align-items: flex-start;
          gap: 6px;
          font-size: 12px;
          color: var(--text-secondary);
        }

        .bullet-dot {
          color: var(--accent-gold);
          font-size: 10px;
        }

        .spotlight-actions {
          display: flex;
          gap: 10px;
          margin-top: 4px;
        }

        .log-wear-btn {
          flex: 1.3;
        }

        .log-wear-btn.logged {
          background: rgba(56, 189, 248, 0.2);
          color: #38bdf8;
          border: 1px solid #38bdf8;
          box-shadow: none;
        }

        .section-title {
          font-size: 17px;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .quick-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .quick-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .quick-card:hover {
          border-color: rgba(212, 175, 55, 0.35);
          transform: translateX(4px);
        }

        .quick-card-icon {
          width: 42px;
          height: 42px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .quick-card-icon.gold-bg {
          background: rgba(212, 175, 55, 0.15);
          color: var(--accent-gold);
        }

        .quick-card-icon.blue-bg {
          background: rgba(56, 189, 248, 0.15);
          color: #38bdf8;
        }

        .quick-card-icon.purple-bg {
          background: rgba(168, 85, 247, 0.15);
          color: #c084fc;
        }

        .quick-card-content {
          flex: 1;
        }

        .quick-card-content h4 {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .quick-card-content p {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .card-arrow {
          color: var(--text-muted);
        }

        .metrics-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .metric-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 14px 8px;
        }

        .metric-label {
          font-size: 10px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .metric-val {
          font-size: 19px;
          font-weight: 700;
          margin: 4px 0 2px;
        }

        .metric-sub {
          font-size: 10px;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
