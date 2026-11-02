import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Sparkles, Sun, CloudSun, CloudRain, Briefcase, 
  BarChart3, UserCheck, Shirt, Scan 
} from 'lucide-react';
import { useWardrobeStore } from '../../store/useWardrobeStore';
import BodyFaceScannerModal from '../scanner/BodyFaceScannerModal';

export default function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { weather, items } = useWardrobeStore();
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  return (
    <>
      <header className="topbar">
        <div className="topbar-brand" onClick={() => navigate('/')}>
          <div className="brand-logo">
            <span>S</span>
          </div>
          <div className="brand-text">
            <h1 className="brand-title">STYLUS</h1>
            <span className="brand-subtitle">MEN'S LUXURY AI</span>
          </div>
        </div>

        {/* Accesos directos a herramientas avanzadas */}
        <div className="topbar-tools">
          <button 
            className={`tool-icon-btn ${location.pathname === '/probador' ? 'active' : ''}`}
            onClick={() => navigate('/probador')} 
            title="Probador Virtual"
          >
            <Shirt size={16} />
          </button>

          <button 
            className={`tool-icon-btn ${location.pathname === '/maleta' ? 'active' : ''}`}
            onClick={() => navigate('/maleta')} 
            title="Maleta Cápsula de Viaje"
          >
            <Briefcase size={16} />
          </button>

          <button 
            className={`tool-icon-btn ${location.pathname === '/analiticas' ? 'active' : ''}`}
            onClick={() => navigate('/analiticas')} 
            title="Analíticas y Rentabilidad"
          >
            <BarChart3 size={16} />
          </button>

          <button 
            className="tool-icon-btn scanner-trigger-btn"
            onClick={() => setIsScannerOpen(true)} 
            title="Escanear Rostro y Cuerpo"
          >
            <Scan size={16} className="gold-icon" />
          </button>
        </div>

        <div className="topbar-actions">
          {weather && (
            <div className="weather-pill" title={weather.advice} onClick={() => navigate('/')}>
              {weather.isRain ? (
                <CloudRain size={15} className="weather-icon rain" />
              ) : (
                <CloudSun size={15} className="weather-icon sun" />
              )}
              <span className="weather-temp">{weather.temp}°</span>
            </div>
          )}
        </div>

        <style>{`
          .topbar {
            position: sticky;
            top: 0;
            z-index: 50;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 18px;
            background: rgba(10, 10, 12, 0.9);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-bottom: 1px solid var(--border-subtle);
          }

          .topbar-brand {
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
          }

          .brand-logo {
            width: 34px;
            height: 34px;
            border-radius: 9px;
            background: var(--accent-gradient);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 10px rgba(212, 175, 55, 0.3);
          }

          .brand-logo span {
            font-family: var(--font-heading);
            font-weight: 800;
            font-size: 19px;
            color: #0d0d0f;
          }

          .brand-text {
            display: flex;
            flex-direction: column;
          }

          .brand-title {
            font-size: 17px;
            font-weight: 700;
            letter-spacing: 0.08em;
            color: var(--text-primary);
            line-height: 1.1;
          }

          .brand-subtitle {
            font-size: 8px;
            letter-spacing: 0.16em;
            color: var(--accent-gold);
            font-weight: 600;
          }

          .topbar-tools {
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .tool-icon-btn {
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
            transition: all 0.2s;
          }

          .tool-icon-btn:hover {
            color: var(--accent-gold);
            border-color: rgba(212, 175, 55, 0.4);
          }

          .tool-icon-btn.active {
            background: rgba(212, 175, 55, 0.15);
            border-color: var(--accent-gold);
            color: var(--accent-gold);
          }

          .scanner-trigger-btn {
            background: rgba(212, 175, 55, 0.1);
            border-color: var(--border-gold);
          }

          .topbar-actions {
            display: flex;
            align-items: center;
          }

          .weather-pill {
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 5px 10px;
            border-radius: var(--radius-full);
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border-subtle);
            font-size: 12px;
            font-weight: 600;
            color: var(--text-primary);
            cursor: pointer;
          }

          .weather-icon.sun { color: #fbbf24; }
          .weather-icon.rain { color: #60a5fa; }
          .gold-icon { color: var(--accent-gold); }
        `}</style>
      </header>

      {/* Modal de Escáner Biométrico */}
      <BodyFaceScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
    </>
  );
}
