import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, PieChart, DollarSign, AlertCircle, Sparkles, 
  CheckCircle2, ArrowRight, Flame, BarChart3, RefreshCw 
} from 'lucide-react';
import { useWardrobeStore } from '../store/useWardrobeStore';

export default function WardrobeAnalytics() {
  const navigate = useNavigate();
  const { items, outfits, calendarLogs } = useWardrobeStore();

  // Cálculos analíticos
  const totalValue = items.reduce((sum, item) => sum + (item.price || 0), 0);
  const totalWears = items.reduce((sum, item) => sum + (item.wearCount || 0), 0);
  const averageCPW = totalWears > 0 ? (totalValue / totalWears).toFixed(2) : '0.00';

  // Prendas más amortizadas vs menos amortizadas
  const sortedByWears = [...items].sort((a, b) => (b.wearCount || 0) - (a.wearCount || 0));
  const topWorn = sortedByWears.slice(0, 4);
  const leastWorn = sortedByWears.slice(-4).reverse();

  // Prendas fantasma / olvidadas (menos de 10 puestas o inactivas)
  const idleGarments = items.filter(item => (item.wearCount || 0) <= 6);

  // Tasa de utilización (prendas con al menos 10 puestas)
  const utilizedCount = items.filter(i => (i.wearCount || 0) >= 8).length;
  const utilizationPercentage = items.length > 0 ? Math.round((utilizedCount / items.length) * 100) : 0;

  // Desglose cromático aproximado
  const colorsMap = {};
  items.forEach(i => {
    const col = i.color || 'Neutro';
    colorsMap[col] = (colorsMap[col] || 0) + 1;
  });

  return (
    <div className="analytics-page animate-fade-in">
      <div className="analytics-header">
        <div>
          <span className="page-kicker">Inteligencia de Datos de Armario</span>
          <h2 className="page-title">Analíticas & Rentabilidad</h2>
        </div>
      </div>

      {/* METRICAS MAESTRAS DE ARMARIO */}
      <div className="metrics-hero-grid">
        <div className="analytics-card glass-card">
          <span className="a-label">Valoración Total</span>
          <h3 className="a-val">{totalValue}€</h3>
          <span className="a-sub">Inversión en {items.length} prendas</span>
        </div>

        <div className="analytics-card glass-card">
          <span className="a-label">Coste Por Uso Medio</span>
          <h3 className="a-val gold-gradient-text">{averageCPW}€</h3>
          <span className="a-sub">Amortización por puesta</span>
        </div>

        <div className="analytics-card glass-card">
          <span className="a-label">Tasa de Rotación</span>
          <h3 className="a-val">{utilizationPercentage}%</h3>
          <span className="a-sub">Armario activo</span>
        </div>

        <div className="analytics-card glass-card">
          <span className="a-label">Total de Puestas</span>
          <h3 className="a-val">{totalWears}</h3>
          <span className="a-sub">Usos registrados</span>
        </div>
      </div>

      {/* ALERTAS DE PRENDAS OLVIDADAS (IDLE ALERTS) */}
      <div className="idle-section glass-card">
        <div className="idle-header">
          <AlertCircle size={18} className="warning-icon" />
          <div>
            <h4>Prendas Olvidadas en el Armario ({idleGarments.length})</h4>
            <p>Piezas con bajo uso. Actívalas en nuevos looks o evalúa su rotación.</p>
          </div>
        </div>

        <div className="idle-scroll-row">
          {idleGarments.slice(0, 6).map(item => (
            <div key={item.id} className="idle-item-card" onClick={() => navigate('/outfits')}>
              <div className="idle-img-wrap">
                <img src={item.imageUrl} alt={item.name} />
                <span className="idle-wears-tag">{item.wearCount || 0} puestas</span>
              </div>
              <span className="idle-name">{item.name}</span>
              <button className="idle-action-btn">
                <Sparkles size={11} />
                <span>Crear Look</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* TOP INVERSIONES (MÁS USADAS) VS MENOS USADAS */}
      <div className="comparison-grid">
        {/* Top 4 Más Usadas */}
        <div className="comparison-card glass-card">
          <div className="comp-header">
            <Flame size={16} className="gold-icon" />
            <h4>Campeonas del Armario (Mayor ROI)</h4>
          </div>

          <div className="comp-list">
            {topWorn.map(item => {
              const cpw = item.wearCount > 0 ? (item.price / item.wearCount).toFixed(2) : item.price;
              return (
                <div key={item.id} className="comp-item">
                  <img src={item.imageUrl} alt={item.name} className="comp-thumb" />
                  <div className="comp-info">
                    <span className="comp-name">{item.name}</span>
                    <span className="comp-meta">{item.wearCount} usos · Coste actual: {cpw}€/uso</span>
                  </div>
                  <CheckCircle2 size={16} className="success-icon" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Top 4 Menos Usadas */}
        <div className="comparison-card glass-card">
          <div className="comp-header">
            <RefreshCw size={16} className="text-muted" />
            <h4>Mayor Coste Por Uso Pendiente</h4>
          </div>

          <div className="comp-list">
            {leastWorn.map(item => {
              const cpw = item.wearCount > 0 ? (item.price / item.wearCount).toFixed(2) : item.price;
              return (
                <div key={item.id} className="comp-item">
                  <img src={item.imageUrl} alt={item.name} className="comp-thumb" />
                  <div className="comp-info">
                    <span className="comp-name">{item.name}</span>
                    <span className="comp-meta">{item.wearCount} usos · {cpw}€/uso</span>
                  </div>
                  <span className="amort-pending-badge">Amortizar</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* DISTRIBUCIÓN CROMÁTICA */}
      <div className="color-balance-section glass-card">
        <div className="comp-header">
          <PieChart size={16} className="gold-icon" />
          <h4>Distribución de Colores de tu Armario</h4>
        </div>
        <p className="color-balance-desc">
          Un armario masculino óptimo mantiene al menos un 60% en neutros canónicos (marino, beige, blanco, gris, camel)
          para permitir combinaciones libres.
        </p>

        <div className="color-bars-list">
          {Object.entries(colorsMap).map(([color, count]) => {
            const pct = Math.round((count / items.length) * 100);
            return (
              <div key={color} className="color-stat-row">
                <span className="c-name">{color}</span>
                <div className="c-bar-wrap">
                  <div className="c-bar-fill" style={{ width: `${pct}%` }} />
                </div>
                <span className="c-count">{count} prendas ({pct}%)</span>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .analytics-page {
          padding: 16px 20px 40px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .analytics-header {
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

        .metrics-hero-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        @media (min-width: 600px) {
          .metrics-hero-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .analytics-card {
          padding: 16px 14px;
          display: flex;
          flex-direction: column;
        }

        .a-label {
          font-size: 10px;
          text-transform: uppercase;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        .a-val {
          font-size: 22px;
          font-weight: 800;
          margin: 6px 0 2px;
        }

        .a-sub {
          font-size: 10px;
          color: var(--text-secondary);
        }

        /* Idle Section */
        .idle-section {
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .idle-header {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .warning-icon {
          color: var(--warning);
        }

        .idle-header h4 {
          font-size: 14px;
          font-weight: 700;
        }

        .idle-header p {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .idle-scroll-row {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 4px;
        }

        .idle-item-card {
          width: 100px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex-shrink: 0;
          cursor: pointer;
        }

        .idle-img-wrap {
          position: relative;
          width: 100px;
          height: 100px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          background: #111;
        }

        .idle-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .idle-wears-tag {
          position: absolute;
          bottom: 4px;
          left: 4px;
          font-size: 8px;
          padding: 1px 4px;
          background: rgba(239, 68, 68, 0.85);
          color: #fff;
          border-radius: 2px;
          font-weight: 700;
        }

        .idle-name {
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .idle-action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 4px;
          border-radius: 4px;
          border: 1px solid var(--border-subtle);
          background: rgba(255, 255, 255, 0.04);
          color: var(--text-gold);
          font-size: 10px;
          cursor: pointer;
        }

        /* Comparison Grid */
        .comparison-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        @media (min-width: 600px) {
          .comparison-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }
        }

        .comparison-card {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .comp-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .comp-header h4 {
          font-size: 13px;
          font-weight: 700;
        }

        .comp-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .comp-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: var(--radius-sm);
        }

        .comp-thumb {
          width: 38px;
          height: 38px;
          border-radius: 4px;
          object-fit: cover;
        }

        .comp-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .comp-name {
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .comp-meta {
          font-size: 10px;
          color: var(--text-muted);
        }

        .success-icon {
          color: var(--success);
        }

        .amort-pending-badge {
          font-size: 9px;
          color: var(--warning);
          background: rgba(245, 158, 11, 0.1);
          padding: 2px 6px;
          border-radius: 3px;
        }

        /* Color Balance */
        .color-balance-section {
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .color-balance-desc {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .color-bars-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .color-stat-row {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
        }

        .c-name {
          width: 90px;
          font-weight: 500;
          color: var(--text-primary);
        }

        .c-bar-wrap {
          flex: 1;
          height: 8px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          overflow: hidden;
        }

        .c-bar-fill {
          height: 100%;
          background: var(--accent-gradient);
          border-radius: 4px;
        }

        .c-count {
          width: 100px;
          text-align: right;
          font-size: 10px;
          color: var(--text-muted);
        }

        .gold-icon {
          color: var(--accent-gold);
        }
      `}</style>
    </div>
  );
}
