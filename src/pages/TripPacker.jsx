import React, { useState } from 'react';
import { 
  Briefcase, Compass, Calendar, CheckSquare, Square, 
  Sparkles, Check, ArrowRight, CloudSun, Plane, Scale 
} from 'lucide-react';
import { useWardrobeStore } from '../store/useWardrobeStore';

export default function TripPacker() {
  const { items } = useWardrobeStore();

  const [destination, setDestination] = useState('Roma / Escapada');
  const [days, setDays] = useState(4);
  const [climate, setClimate] = useState('templado'); // 'frio', 'templado', 'calido'
  const [vibe, setVibe] = useState('smart_casual');

  // Checklist de equipaje empacado
  const [packedItems, setPackedItems] = useState({});

  const togglePacked = (id) => {
    setPackedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Generar maleta cápsula óptima desde el armario
  const tops = items.filter(i => i.category === 'superiores');
  const bottoms = items.filter(i => i.category === 'inferiores');
  const shoes = items.filter(i => i.category === 'calzado');
  const layers = items.filter(i => i.category === 'abrigos');
  const accessories = items.filter(i => i.category === 'accesorios');

  // Selección matemática de cápsula minimalista
  const capsuleItems = [
    layers[0], // Blazer o cazadora versátil
    layers[1] || layers[0], // Capa alternativa
    tops[0], // Camisa Oxford
    tops[1] || tops[0], // Camiseta o polo
    tops[2] || tops[0], // Jersey fino
    bottoms[0], // Chino beige o pantalón vestir
    bottoms[1] || bottoms[0], // Vaquero índigo
    shoes[0], // Sneakers blancas
    shoes[1] || shoes[0], // Loafers o botas
    accessories[0], // Reloj
    accessories[1] || accessories[0] // Gafas
  ].filter(Boolean);

  // Generar looks diarios para cada día del viaje
  const dailyOutfits = Array.from({ length: days }).map((_, index) => {
    const dayTop = tops[index % tops.length] || tops[0];
    const dayBottom = bottoms[index % bottoms.length] || bottoms[0];
    const dayLayer = layers[index % layers.length] || layers[0];
    const dayShoe = shoes[index % shoes.length] || shoes[0];

    return {
      day: index + 1,
      title: `Look Día ${index + 1} (${index === 0 ? 'Viaje y Llegada' : index === days - 1 ? 'Regreso' : 'Exploración y Cena'})`,
      items: [dayLayer, dayTop, dayBottom, dayShoe].filter(Boolean)
    };
  });

  const totalCapsuleWeightKg = (capsuleItems.length * 0.45 + 1.2).toFixed(1);

  return (
    <div className="trip-packer-page animate-fade-in">
      <div className="packer-header">
        <div>
          <span className="page-kicker">Planificador de Viajes Satorial</span>
          <h2 className="page-title">Maleta Cápsula Inteligente</h2>
        </div>
        <div className="luggage-type-badge">
          <Plane size={15} />
          <span>Equipaje de Cabina</span>
        </div>
      </div>

      {/* Configuración del Viaje */}
      <div className="trip-config-card glass-card">
        <div className="config-grid">
          <div className="config-group">
            <label>Destino</label>
            <input 
              type="text" 
              value={destination} 
              onChange={(e) => setDestination(e.target.value)} 
              placeholder="Ej: Milán, París, Tokio..." 
            />
          </div>

          <div className="config-group">
            <label>Duración ({days} días)</label>
            <div className="days-selector">
              {[3, 4, 5, 7, 10].map(d => (
                <button 
                  key={d} 
                  className={`day-btn ${days === d ? 'active' : ''}`}
                  onClick={() => setDays(d)}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>

          <div className="config-group">
            <label>Clima Previsto</label>
            <select value={climate} onChange={(e) => setClimate(e.target.value)}>
              <option value="templado">Templado / Entretiempo (15°C - 22°C)</option>
              <option value="frio">Frío / Lluvioso (5°C - 14°C)</option>
              <option value="calido">Cálido / Verano (23°C - 32°C)</option>
            </select>
          </div>
        </div>

        <div className="capsule-summary-row">
          <div className="summary-stat">
            <span className="stat-label">Prendas Necesarias</span>
            <span className="stat-val gold-gradient-text">{capsuleItems.length} piezas</span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Outfits Generados</span>
            <span className="stat-val">+{days * 2} combinaciones</span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Peso Estimado</span>
            <span className="stat-val">{totalCapsuleWeightKg} kg</span>
          </div>
        </div>
      </div>

      {/* ITINERARIO VISUAL DE LOOKS DÍA A DÍA */}
      <div className="itinerary-section">
        <h3 className="section-title">Itinerario de Estilo por Días</h3>
        <div className="itinerary-grid">
          {dailyOutfits.map(dayLook => (
            <div key={dayLook.day} className="day-look-card glass-card">
              <div className="day-card-header">
                <span className="day-number-pill">Día {dayLook.day}</span>
                <h4 className="day-look-title">{dayLook.title}</h4>
              </div>

              <div className="day-garments-row">
                {dayLook.items.map((item, idx) => (
                  <div key={idx} className="day-garment-thumb">
                    <img src={item.imageUrl} alt={item.name} />
                    <span className="thumb-cap-tag">{item.category}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CHECKLIST INTERACTIVO DE EMPAQUE */}
      <div className="checklist-section glass-card">
        <div className="checklist-header">
          <CheckSquare size={18} className="gold-icon" />
          <div>
            <h4>Checklist de la Maleta</h4>
            <p>Marca cada prenda al meterla en tu equipaje.</p>
          </div>
        </div>

        <div className="checklist-items">
          {capsuleItems.map((item, i) => {
            const isPacked = !!packedItems[item.id || i];
            return (
              <div 
                key={item.id || i} 
                className={`check-row ${isPacked ? 'packed' : ''}`}
                onClick={() => togglePacked(item.id || i)}
              >
                <div className="check-box">
                  {isPacked ? <CheckSquare size={18} className="gold-icon" /> : <Square size={18} />}
                </div>
                <div className="check-thumb">
                  <img src={item.imageUrl} alt={item.name} />
                </div>
                <div className="check-info">
                  <span className="check-name">{item.name}</span>
                  <span className="check-meta">{item.brand} · {item.color} · {item.fabric}</span>
                </div>
                <span className="check-status-tag">{isPacked ? 'Empacado' : 'Pendiente'}</span>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .trip-packer-page {
          padding: 16px 20px 40px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .packer-header {
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

        .luggage-type-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: rgba(212, 175, 55, 0.12);
          border: 1px solid var(--border-gold);
          border-radius: var(--radius-full);
          font-size: 11px;
          color: var(--text-gold);
          font-weight: 600;
        }

        .trip-config-card {
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .config-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        @media (min-width: 500px) {
          .config-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .config-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .config-group label {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .config-group input, .config-group select {
          padding: 10px 12px;
          background: var(--bg-primary);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          font-size: 13px;
          outline: none;
        }

        .days-selector {
          display: flex;
          gap: 4px;
        }

        .day-btn {
          flex: 1;
          padding: 8px 4px;
          border-radius: var(--radius-xs);
          border: 1px solid var(--border-subtle);
          background: var(--bg-primary);
          color: var(--text-secondary);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .day-btn.active {
          background: var(--accent-gradient);
          color: #0b0b0e;
        }

        .capsule-summary-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          padding-top: 12px;
          border-top: 1px solid var(--border-subtle);
        }

        .summary-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .stat-label {
          font-size: 9px;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        .stat-val {
          font-size: 15px;
          font-weight: 700;
          margin-top: 2px;
        }

        .section-title {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .itinerary-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .day-look-card {
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .day-card-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .day-number-pill {
          font-size: 10px;
          font-weight: 700;
          background: rgba(212, 175, 55, 0.15);
          color: var(--accent-gold);
          padding: 2px 8px;
          border-radius: 4px;
        }

        .day-look-title {
          font-size: 13px;
          font-weight: 600;
        }

        .day-garments-row {
          display: flex;
          gap: 8px;
          overflow-x: auto;
        }

        .day-garment-thumb {
          position: relative;
          width: 65px;
          height: 65px;
          border-radius: var(--radius-xs);
          overflow: hidden;
          background: #111;
          flex-shrink: 0;
        }

        .day-garment-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .thumb-cap-tag {
          position: absolute;
          bottom: 2px;
          left: 2px;
          font-size: 7px;
          padding: 1px 3px;
          background: rgba(0, 0, 0, 0.8);
          color: #fff;
          border-radius: 2px;
          text-transform: uppercase;
        }

        /* Checklist */
        .checklist-section {
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .checklist-header {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .checklist-header h4 {
          font-size: 15px;
          font-weight: 700;
        }

        .checklist-header p {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .checklist-items {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .check-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
          cursor: pointer;
          transition: all 0.2s;
        }

        .check-row.packed {
          background: rgba(212, 175, 55, 0.08);
          border-color: rgba(212, 175, 55, 0.3);
        }

        .check-row.packed .check-name {
          text-decoration: line-through;
          color: var(--text-secondary);
        }

        .check-thumb {
          width: 36px;
          height: 36px;
          border-radius: 4px;
          overflow: hidden;
          background: #111;
        }

        .check-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .check-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .check-name {
          font-size: 13px;
          font-weight: 600;
        }

        .check-meta {
          font-size: 10px;
          color: var(--text-muted);
        }

        .check-status-tag {
          font-size: 10px;
          color: var(--text-secondary);
        }

        .gold-icon {
          color: var(--accent-gold);
        }
      `}</style>
    </div>
  );
}
