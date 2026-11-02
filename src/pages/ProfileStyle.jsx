import React, { useState } from 'react';
import { 
  Sparkles, Palette, User, MessageSquare, Calendar as CalendarIcon, 
  Send, Check, ChevronRight, Eye, ShieldAlert, Award, Compass 
} from 'lucide-react';
import { useWardrobeStore } from '../store/useWardrobeStore';
import { COLOR_SEASONS, BODY_SHAPES } from '../services/fashionEngine';

export default function ProfileStyle() {
  const { profile, updateProfile, items, calendarLogs, outfits } = useWardrobeStore();

  const [activeSubTab, setActiveSubTab] = useState('colorimetry'); // 'colorimetry', 'body', 'chat', 'calendar'

  // Estado del Draping
  const [drapingColor, setDrapingColor] = useState('#2D3A29');

  // Estado del Chat con Estilista IA
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'stylus',
      text: 'Saludos, Mario. Soy tu Estilista Personal de IA especializado en moda y sastrería masculina. ¿Para qué ocasión o evento necesitas asesoramiento hoy?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const currentSeasonKey = profile?.seasonColor?.includes('Autumn') || profile?.seasonColor?.includes('Otoño') 
    ? 'deep_autumn' 
    : 'deep_autumn';
  const currentSeasonData = COLOR_SEASONS[currentSeasonKey] || COLOR_SEASONS['deep_autumn'];

  const currentBodyShape = BODY_SHAPES[profile?.bodyType || 'Trapecio'] || BODY_SHAPES['Trapecio'];

  // Enviar mensaje al chat
  const handleSendMessage = (textToSend = inputMessage) => {
    if (!textToSend.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');

    // Respuesta inteligente basada en moda masculina
    setTimeout(() => {
      let aiReply = '';
      const lower = textToSend.toLowerCase();

      if (lower.includes('cita') || lower.includes('primera cita')) {
        aiReply = 'Para una primera cita casual elegante, la regla es proyectar que te importa pero sin parecer forzado. Te sugiero: camisa de lino azul claro o polo de punto verde oliva, pantalón chino beige arena con corte cónico y mocasines o zapatillas de piel blancas inmaculadas. Deja desabrochados los dos botones superiores y añade un reloj con correa de piel o brazalete de acero.';
      } else if (lower.includes('boda') || lower.includes('formal') || lower.includes('traje')) {
        aiReply = 'En eventos de etiqueta: traje azul tinta o gris marengo en lana fría. Combínalo con camisa blanca de popelín impecable, corbata de seda con estampado micro (verde bosque o burdeos), y zapatos Oxford en cuero negro o marrón oscuro con puntera pulida. El pañuelo de bolsillo en blanco liso con doblado recto.';
      } else if (lower.includes('lluvia') || lower.includes('llueve')) {
        aiReply = 'Con lluvia, descarta el ante inmediatamente. Apuesta por botas Chelsea de piel encerada con suela de goma Dainite, pantalón de sarga densa o vaquero selvedge, y remata con gabardina trench clásica o cazadora con membrana cortavientos sobre un jersey merino.';
      } else if (lower.includes('entrevista')) {
        aiReply = 'Para una entrevista en una tecnológica o empresa moderna: la fórmula "Broken Suit" (traje desparejado). Americana azul marino desestructurada sobre camisa blanca o azul hielo sin corbata, pantalón gris carbón y zapatos derbi o mocasines elegantes. Comunica competencia técnica y buen gusto.';
      } else {
        aiReply = `Teniendo en cuenta tu morfología (${profile?.bodyType || 'Trapecio'}) y tu colorimetría de ${currentSeasonData.name}, te recomiendo favorecer cortes que definan tus hombros y estructurar el look alrededor de tus colores estrella como ${currentSeasonData.powerColors[0]?.name} o ${currentSeasonData.powerColors[1]?.name}. ¿Quieres que analicemos alguna prenda en concreto?`;
      }

      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, sender: 'stylus', text: aiReply }
      ]);
    }, 600);
  };

  const quickPrompts = [
    'Look para primera cita elegante',
    'Cómo combinar blazer azul marino',
    'Qué ponerme si llueve y voy arreglado',
    'Entrevista en empresa moderna'
  ];

  return (
    <div className="profile-style-page animate-fade-in">
      {/* Header */}
      <div className="profile-header">
        <div>
          <span className="page-kicker">Centro de Inteligencia de Estilo</span>
          <h2 className="page-title">Morfología & Asesoría IA</h2>
        </div>

        <div className="profile-tabs-scroll">
          <button 
            className={`ptab ${activeSubTab === 'colorimetry' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('colorimetry')}
          >
            <Palette size={14} />
            <span>Colorimetría 12E</span>
          </button>
          <button 
            className={`ptab ${activeSubTab === 'body' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('body')}
          >
            <User size={14} />
            <span>Morfología</span>
          </button>
          <button 
            className={`ptab ${activeSubTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('chat')}
          >
            <MessageSquare size={14} />
            <span>Estilista IA</span>
          </button>
          <button 
            className={`ptab ${activeSubTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('calendar')}
          >
            <CalendarIcon size={14} />
            <span>Calendario</span>
          </button>
        </div>
      </div>

      {/* SUBPESTAÑA 1: COLORIMETRÍA 12 ESTACIONES */}
      {activeSubTab === 'colorimetry' && (
        <div className="subtab-content">
          <div className="season-hero-card glass-card">
            <div className="season-badge-row">
              <span className="badge badge-gold">Diagnóstico Personalizado</span>
              <span className="contrast-chip">Contraste {profile?.contrastLevel || 'Medio-Alto'}</span>
            </div>

            <h3 className="season-title gold-gradient-text">{currentSeasonData.name}</h3>
            <p className="season-desc">{currentSeasonData.descripcion}</p>

            <div className="season-pillars-grid">
              <div className="pillar-box">
                <span className="pillar-label">Temperatura</span>
                <span className="pillar-val">{currentSeasonData.temperatura}</span>
              </div>
              <div className="pillar-box">
                <span className="pillar-label">Valor Lumínico</span>
                <span className="pillar-val">{currentSeasonData.valor}</span>
              </div>
              <div className="pillar-box">
                <span className="pillar-label">Croma / Saturación</span>
                <span className="pillar-val">{currentSeasonData.croma}</span>
              </div>
            </div>

            {/* Simulador de Draping */}
            <div className="draping-simulator-area">
              <div className="draping-header">
                <Eye size={15} className="gold-icon" />
                <span className="draping-title">Simulador de Draping Digital</span>
              </div>
              
              <div className="draping-canvas" style={{ borderColor: drapingColor }}>
                <div className="avatar-silhouette" style={{ background: drapingColor }}>
                  <div className="face-oval">
                    <span className="face-label">Tez {profile?.skinTone || 'Dorado'}</span>
                  </div>
                  <div className="collar-v" style={{ borderBottomColor: drapingColor }} />
                </div>
                <div className="draping-color-info">
                  <span className="draping-test-text">Color en prueba:</span>
                  <span className="draping-color-name" style={{ color: drapingColor }}>{drapingColor}</span>
                </div>
              </div>

              <div className="draping-swatches-scroll">
                {currentSeasonData.powerColors.map((color, idx) => (
                  <button
                    key={idx}
                    className={`drape-swatch-btn ${drapingColor === color.hex ? 'active' : ''}`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => setDrapingColor(color.hex)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Colores Estrella */}
            <div className="palette-block">
              <h4 className="palette-title">Tus Colores Estrella (Power Colors)</h4>
              <div className="color-swatches-grid">
                {currentSeasonData.powerColors.map((c, i) => (
                  <div key={i} className="color-swatch-card" onClick={() => setDrapingColor(c.hex)}>
                    <div className="swatch-circle" style={{ backgroundColor: c.hex }} />
                    <span className="swatch-name">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Colores a evitar */}
            <div className="palette-block avoid-block">
              <div className="avoid-header">
                <ShieldAlert size={16} className="danger-icon" />
                <h4 className="palette-title">Colores Desfavorables a Evitar Cerca del Rostro</h4>
              </div>
              <div className="avoid-chips-row">
                {currentSeasonData.avoidColors.map((ac, i) => (
                  <span key={i} className="avoid-chip" style={{ borderLeftColor: ac.hex || '#f00' }}>
                    {typeof ac === 'string' ? ac : ac.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="rule-tip-box">
              <Award size={18} className="gold-icon" />
              <p><strong>Regla Satorial:</strong> {currentSeasonData.reglaEstilo}</p>
            </div>
          </div>
        </div>
      )}

      {/* SUBPESTAÑA 2: MORFOLOGÍA CORPORAL */}
      {activeSubTab === 'body' && (
        <div className="subtab-content">
          <div className="body-shape-card glass-card">
            <div className="shape-selector-row">
              <span className="spec-label">Tu Silueta Antropométrica:</span>
              <div className="shape-chips">
                {Object.keys(BODY_SHAPES).map((shape) => (
                  <button
                    key={shape}
                    className={`shape-chip ${profile?.bodyType === shape ? 'active' : ''}`}
                    onClick={() => updateProfile({ bodyType: shape })}
                  >
                    {shape}
                  </button>
                ))}
              </div>
            </div>

            <div className="shape-content-block">
              <h3 className="shape-title">{currentBodyShape.title}</h3>
              <p className="shape-desc">{currentBodyShape.caracteristicas}</p>

              <div className="shape-highlight">
                <Compass size={18} className="gold-icon" />
                <span><strong>Ventaja Clave:</strong> {currentBodyShape.ventajas}</span>
              </div>

              <div className="rules-section">
                <h4 className="sub-heading">Reglas de Oro de Sastrería</h4>
                <ul className="rules-list">
                  {currentBodyShape.reglasOro.map((r, i) => (
                    <li key={i}>
                      <span className="bullet">✦</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rules-section">
                <h4 className="sub-heading">Prendas Más Favorecedoras</h4>
                <div className="star-garments-row">
                  {currentBodyShape.prendasEstrella.map((p, i) => (
                    <span key={i} className="star-garment-badge">{p}</span>
                  ))}
                </div>
              </div>

              <div className="error-avoid-box">
                <span className="avoid-label">⚠️ Errores Típicos a Evitar:</span>
                <p>{currentBodyShape.erroresAEvitar?.[0]}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBPESTAÑA 3: CHAT ESTILISTA IA */}
      {activeSubTab === 'chat' && (
        <div className="subtab-content">
          <div className="chat-container glass-card">
            <div className="chat-header">
              <div className="chat-avatar">
                <Sparkles size={18} />
              </div>
              <div>
                <h4 className="chat-title">Stylus AI — Asesor Personal</h4>
                <span className="chat-subtitle">Especialista en Moda y Protocolo Masculino</span>
              </div>
            </div>

            {/* Historial de Mensajes */}
            <div className="chat-messages-area">
              {messages.map((msg) => (
                <div key={msg.id} className={`chat-bubble-wrap ${msg.sender}`}>
                  <div className={`chat-bubble ${msg.sender}`}>
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Presets Rápidos */}
            <div className="quick-prompts-scroll">
              {quickPrompts.map((prompt, i) => (
                <button 
                  key={i} 
                  className="prompt-chip"
                  onClick={() => handleSendMessage(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input de Mensaje */}
            <div className="chat-input-row">
              <input
                type="text"
                placeholder="Pregunta a tu estilista (ej: ¿Qué me pongo para cenar hoy?)..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button className="btn btn-primary send-btn" onClick={() => handleSendMessage()}>
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBPESTAÑA 4: CALENDARIO DE OUTFITS */}
      {activeSubTab === 'calendar' && (
        <div className="subtab-content">
          <div className="calendar-card glass-card">
            <div className="calendar-header-row">
              <CalendarIcon size={18} className="gold-icon" />
              <h4>Historial de Outfits Vestidos</h4>
            </div>

            <div className="calendar-logs-list">
              {calendarLogs.length === 0 ? (
                <p className="empty-calendar">No hay registros de outfits vestidos aún.</p>
              ) : (
                calendarLogs.map((log) => {
                  const outfit = outfits.find(o => o.id === log.outfitId);
                  return (
                    <div key={log.id} className="log-row glass-card">
                      <div className="log-date-badge">
                        <span className="log-day">{log.date?.split('-')[2] || 'Hoy'}</span>
                        <span className="log-month">Nov</span>
                      </div>
                      <div className="log-info">
                        <h5 className="log-title">{outfit?.name || 'Look Diario'}</h5>
                        <span className="log-occasion">{log.occasion} · {log.weatherTemp}°C {log.weatherCondition}</span>
                        {log.notes && <p className="log-notes">"{log.notes}"</p>}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .profile-style-page {
          padding: 16px 20px 40px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .profile-header {
          display: flex;
          flex-direction: column;
          gap: 12px;
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

        .profile-tabs-scroll {
          display: flex;
          gap: 6px;
          background: var(--bg-card);
          padding: 4px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-subtle);
          overflow-x: auto;
        }

        .ptab {
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

        .ptab.active {
          background: var(--accent-gradient);
          color: #0b0b0e;
        }

        .subtab-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Season Card */
        .season-hero-card {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .season-badge-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .contrast-chip {
          font-size: 11px;
          color: var(--text-secondary);
        }

        .season-title {
          font-size: 22px;
          font-weight: 800;
        }

        .season-desc {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .season-pillars-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .pillar-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px 4px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
          text-align: center;
        }

        .pillar-label {
          font-size: 9px;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        .pillar-val {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-primary);
          margin-top: 2px;
        }

        /* Draping Simulator */
        .draping-simulator-area {
          padding: 16px;
          background: rgba(0, 0, 0, 0.35);
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .draping-header {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .draping-title {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .draping-canvas {
          height: 140px;
          border-radius: var(--radius-md);
          border: 2px solid;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          background: #111116;
          transition: border-color 0.3s ease;
        }

        .avatar-silhouette {
          width: 90px;
          height: 100%;
          border-radius: var(--radius-sm);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.3s ease;
        }

        .face-oval {
          width: 50px;
          height: 65px;
          border-radius: 50%;
          background: #C68642; /* Tono de piel cálido */
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        }

        .face-label {
          font-size: 7px;
          font-weight: 800;
          color: #fff;
          text-align: center;
          text-transform: uppercase;
        }

        .draping-color-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .draping-test-text {
          font-size: 11px;
          color: var(--text-muted);
        }

        .draping-color-name {
          font-size: 16px;
          font-weight: 800;
        }

        .draping-swatches-scroll {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding: 4px 0;
        }

        .drape-swatch-btn {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          border: 2px solid rgba(255, 255, 255, 0.2);
          cursor: pointer;
          flex-shrink: 0;
          transition: transform 0.2s;
        }

        .drape-swatch-btn.active {
          transform: scale(1.15);
          border-color: #fff;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
        }

        .palette-block {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .palette-title {
          font-size: 13px;
          font-weight: 700;
        }

        .color-swatches-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        @media (min-width: 480px) {
          .color-swatches-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .color-swatch-card {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: var(--radius-sm);
          cursor: pointer;
        }

        .swatch-circle {
          width: 20px;
          height: 20px;
          border-radius: var(--radius-full);
          flex-shrink: 0;
        }

        .swatch-name {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .avoid-block {
          background: rgba(239, 68, 68, 0.05);
          padding: 12px;
          border-radius: var(--radius-sm);
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .avoid-header {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .danger-icon {
          color: #ef4444;
        }

        .avoid-chips-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 6px;
        }

        .avoid-chip {
          font-size: 11px;
          padding: 3px 8px;
          background: rgba(0, 0, 0, 0.4);
          border-radius: 4px;
          border-left: 3px solid;
          color: #fee2e2;
        }

        .rule-tip-box {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 12px;
          background: rgba(212, 175, 55, 0.1);
          border-radius: var(--radius-sm);
          border-left: 3px solid var(--accent-gold);
          font-size: 12px;
          line-height: 1.45;
          color: var(--text-gold);
        }

        /* Body Shape */
        .body-shape-card {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .shape-selector-row {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .shape-chips {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .shape-chip {
          padding: 6px 12px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-subtle);
          background: var(--bg-card);
          color: var(--text-secondary);
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
        }

        .shape-chip.active {
          background: var(--accent-gradient);
          color: #0b0b0e;
          border-color: transparent;
        }

        .shape-content-block {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .shape-title {
          font-size: 18px;
          font-weight: 800;
        }

        .shape-desc {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .shape-highlight {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: rgba(212, 175, 55, 0.08);
          border-radius: var(--radius-sm);
          font-size: 12px;
          color: var(--text-primary);
        }

        .rules-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .sub-heading {
          font-size: 13px;
          font-weight: 700;
        }

        .rules-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .rules-list li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 12px;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .bullet {
          color: var(--accent-gold);
        }

        .star-garments-row {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .star-garment-badge {
          font-size: 11px;
          padding: 4px 10px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
        }

        .error-avoid-box {
          padding: 10px 12px;
          background: rgba(239, 68, 68, 0.06);
          border-radius: var(--radius-sm);
          border: 1px solid rgba(239, 68, 68, 0.2);
          font-size: 12px;
          color: #fca5a5;
        }

        .avoid-label {
          font-weight: 700;
          display: block;
          margin-bottom: 2px;
        }

        /* Chat */
        .chat-container {
          padding: 16px;
          display: flex;
          flex-direction: column;
          height: 520px;
        }

        .chat-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-subtle);
        }

        .chat-avatar {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-full);
          background: var(--accent-gradient);
          color: #0b0b0e;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chat-title {
          font-size: 14px;
          font-weight: 700;
        }

        .chat-subtitle {
          font-size: 10px;
          color: var(--accent-gold);
        }

        .chat-messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 14px 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .chat-bubble-wrap {
          display: flex;
          width: 100%;
        }

        .chat-bubble-wrap.user {
          justify-content: flex-end;
        }

        .chat-bubble-wrap.stylus {
          justify-content: flex-start;
        }

        .chat-bubble {
          max-width: 82%;
          padding: 12px 14px;
          border-radius: var(--radius-md);
          font-size: 13px;
          line-height: 1.45;
        }

        .chat-bubble.stylus {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          color: var(--text-primary);
        }

        .chat-bubble.user {
          background: var(--accent-gradient);
          color: #0b0b0e;
          font-weight: 500;
        }

        .quick-prompts-scroll {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding: 6px 0;
        }

        .prompt-chip {
          padding: 4px 10px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          color: var(--text-secondary);
          font-size: 11px;
          white-space: nowrap;
          cursor: pointer;
        }

        .prompt-chip:hover {
          color: var(--accent-gold);
          border-color: var(--border-gold);
        }

        .chat-input-row {
          display: flex;
          gap: 8px;
          margin-top: 6px;
        }

        .chat-input-row input {
          flex: 1;
          padding: 10px 14px;
          border-radius: var(--radius-full);
          background: var(--bg-primary);
          border: 1px solid var(--border-subtle);
          color: var(--text-primary);
          font-size: 13px;
          outline: none;
        }

        .chat-input-row input:focus {
          border-color: var(--border-gold);
        }

        .send-btn {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-full);
          padding: 0;
        }

        /* Calendar */
        .calendar-card {
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .calendar-header-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .calendar-header-row h4 {
          font-size: 15px;
          font-weight: 700;
        }

        .calendar-logs-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .log-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px;
        }

        .log-date-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 6px 10px;
          border-radius: var(--radius-xs);
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid var(--border-gold);
        }

        .log-day {
          font-size: 16px;
          font-weight: 800;
          color: var(--accent-gold);
          line-height: 1;
        }

        .log-month {
          font-size: 9px;
          color: var(--text-secondary);
          text-transform: uppercase;
        }

        .log-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .log-title {
          font-size: 13px;
          font-weight: 600;
        }

        .log-occasion {
          font-size: 11px;
          color: var(--text-muted);
        }

        .log-notes {
          font-size: 11px;
          color: var(--text-secondary);
          font-style: italic;
        }

        .empty-calendar {
          font-size: 13px;
          color: var(--text-secondary);
          text-align: center;
          padding: 20px;
        }

        .gold-icon {
          color: var(--accent-gold);
        }
      `}</style>
    </div>
  );
}
