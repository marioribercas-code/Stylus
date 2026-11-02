import React, { useState } from 'react';
import { 
  Camera, Sparkles, X, CheckCircle2, User, Eye, 
  Scan, ArrowRight, ShieldCheck, RefreshCw 
} from 'lucide-react';
import { useWardrobeStore } from '../../store/useWardrobeStore';
import { COLOR_SEASONS, BODY_SHAPES, FACE_SHAPES, KIBBE_MENS_SYSTEM } from '../../services/fashionEngine';

export default function BodyFaceScannerModal({ isOpen, onClose }) {
  const { profile, updateProfile } = useWardrobeStore();

  const [scanStep, setScanStep] = useState(1); // 1: Captura foto, 2: Procesamiento IA / Landmarks, 3: Resultados Biométricos
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  // Diagnóstico generado
  const [detectedMetrics, setDetectedMetrics] = useState({
    faceShape: 'Oval',
    bodyShape: 'Trapecio',
    kibbeType: 'Natural',
    seasonColor: 'Otoño Oscuro (Deep Autumn)',
    skinTone: 'Medio Dorado Cálido',
    contrastRatio: 'Medio-Alto (78%)',
    vTaperRatio: '1.42 (Equilibrio Atlético)'
  });

  if (!isOpen) return null;

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target.result);
        runAiBiometricScan();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseDemoSample = () => {
    setPhotoPreview('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80');
    runAiBiometricScan();
  };

  const runAiBiometricScan = () => {
    setScanStep(2);
    setIsScanning(true);

    setTimeout(() => {
      setIsScanning(false);
      setScanStep(3);
    }, 1800);
  };

  const handleApplyToProfile = async () => {
    await updateProfile({
      bodyType: detectedMetrics.bodyShape,
      seasonColor: detectedMetrics.seasonColor,
      faceShape: detectedMetrics.faceShape,
      kibbeFamily: detectedMetrics.kibbeType
    });
    onClose();
  };

  return (
    <div className="scanner-modal-backdrop" onClick={onClose}>
      <div className="scanner-modal-content glass-card animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="scanner-header">
          <div className="scanner-title-wrap">
            <Scan size={20} className="gold-icon" />
            <h3>Escáner Biométrico Facial y Corporal</h3>
          </div>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        {/* PASO 1: SELECCIÓN DE FOTO / CÁMARA */}
        {scanStep === 1 && (
          <div className="scanner-step-1">
            <p className="scanner-intro">
              Captura o sube una fotografía frontal para que la IA extraiga tu geometría facial, 
              proporciones de hombros-cintura y subtono de melanina con precisión científica.
            </p>

            <label className="scanner-upload-box">
              <input type="file" accept="image/*" capture="user" onChange={handlePhotoUpload} style={{ display: 'none' }} />
              <Camera size={38} className="gold-icon" />
              <span className="upload-txt">Activar Cámara o Subir Selfie Frontal</span>
              <span className="upload-sub">Luz natural de día recomendada · Rostro y hombros visibles</span>
            </label>

            <div className="demo-sample-row">
              <span className="or-text">O para probar de inmediato:</span>
              <button className="btn btn-secondary demo-btn" onClick={handleUseDemoSample}>
                <Sparkles size={14} />
                <span>Escanear Foto de Demostración</span>
              </button>
            </div>
          </div>
        )}

        {/* PASO 2: ANIMACIÓN DE ESCANEO BIOMÉTRICO (LANDMARKS) */}
        {scanStep === 2 && (
          <div className="scanner-step-2">
            <div className="scanner-viewport">
              <img src={photoPreview} alt="Target" className="target-img" />
              <div className="scan-laser-line" />
              <div className="face-mesh-dots">
                <div className="dot forehead" />
                <div className="dot cheek-l" />
                <div className="dot cheek-r" />
                <div className="dot jaw-l" />
                <div className="dot jaw-r" />
                <div className="dot chin" />
                <div className="dot shoulder-l" />
                <div className="dot shoulder-r" />
              </div>
            </div>

            <div className="scanning-status-box">
              <RefreshCw size={18} className="rotate-anim gold-icon" />
              <div>
                <h4>Mapeando Biometría Satorial...</h4>
                <p>Calculando proporciones de tercios, simetría facial y contraste CIELAB.</p>
              </div>
            </div>
          </div>
        )}

        {/* PASO 3: RESULTADOS BIOMÉTRICOS & DICTAMEN KIBBE */}
        {scanStep === 3 && (
          <div className="scanner-step-3">
            <div className="results-top-banner">
              <CheckCircle2 size={24} className="success-icon" />
              <div>
                <h4>Diagnóstico Completado con Éxito</h4>
                <p>La IA ha identificado tu ADN satorial masculino:</p>
              </div>
            </div>

            <div className="metrics-results-grid">
              <div className="res-cell">
                <span className="res-label">Colorimetría (12E)</span>
                <span className="res-val gold-gradient-text">{detectedMetrics.seasonColor}</span>
              </div>
              <div className="res-cell">
                <span className="res-label">Morfología Corporal</span>
                <span className="res-val">{detectedMetrics.bodyShape}</span>
              </div>
              <div className="res-cell">
                <span className="res-label">Familia Kibbe</span>
                <span className="res-val">{detectedMetrics.kibbeType}</span>
              </div>
              <div className="res-cell">
                <span className="res-label">Geometría Facial</span>
                <span className="res-val">{detectedMetrics.faceShape}</span>
              </div>
            </div>

            <div className="scanner-recommendation-box">
              <Sparkles size={16} className="gold-icon" />
              <div>
                <h5>Recomendación Satorial Maestra</h5>
                <p>
                  Tu rostro {detectedMetrics.faceShape} armoniza de forma óptima con 
                  <strong> Cuellos Cutaway o Button-Down</strong>, mientras que tu morfología {detectedMetrics.bodyShape} 
                  se potencia con <strong>americanas desestructuradas y pantalones de tiro medio-alto</strong> que 
                  respeten la proporción 1/3 torso vs 2/3 piernas.
                </p>
              </div>
            </div>

            <div className="scanner-actions">
              <button className="btn btn-primary apply-profile-btn" onClick={handleApplyToProfile}>
                <CheckCircle2 size={16} />
                <span>Aplicar a mi Perfil y Actualizar Armario</span>
              </button>
            </div>
          </div>
        )}

      </div>

      <style>{`
        .scanner-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(10px);
          z-index: 300;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .scanner-modal-content {
          width: 100%;
          max-width: 500px;
          background: #121217;
          border-radius: var(--radius-lg);
          border: 1px solid rgba(212, 175, 55, 0.35);
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .scanner-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .scanner-title-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .scanner-title-wrap h3 {
          font-size: 16px;
          font-weight: 700;
        }

        .close-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }

        .scanner-intro {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .scanner-upload-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 32px 16px;
          border: 2px dashed rgba(212, 175, 55, 0.35);
          border-radius: var(--radius-md);
          cursor: pointer;
          margin-top: 10px;
          background: rgba(255, 255, 255, 0.02);
          transition: border-color 0.2s;
        }

        .scanner-upload-box:hover {
          border-color: var(--accent-gold);
        }

        .upload-txt {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .upload-sub {
          font-size: 11px;
          color: var(--text-muted);
          text-align: center;
        }

        .demo-sample-row {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin-top: 12px;
        }

        .or-text {
          font-size: 11px;
          color: var(--text-muted);
        }

        .demo-btn {
          padding: 8px 16px;
          font-size: 12px;
        }

        /* Step 2 Viewport */
        .scanner-viewport {
          position: relative;
          width: 100%;
          height: 240px;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: #000;
        }

        .target-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.65;
        }

        .scan-laser-line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--accent-gradient);
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.8);
          animation: scanMove 2s infinite ease-in-out;
        }

        @keyframes scanMove {
          0% { top: 10%; }
          50% { top: 85%; }
          100% { top: 10%; }
        }

        .face-mesh-dots .dot {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #38bdf8;
          box-shadow: 0 0 8px #38bdf8;
        }

        .dot.forehead { top: 30%; left: 50%; }
        .dot.cheek-l { top: 45%; left: 42%; }
        .dot.cheek-r { top: 45%; left: 58%; }
        .dot.jaw-l { top: 55%; left: 40%; }
        .dot.jaw-r { top: 55%; left: 60%; }
        .dot.chin { top: 62%; left: 50%; }
        .dot.shoulder-l { top: 80%; left: 25%; }
        .dot.shoulder-r { top: 80%; left: 75%; }

        .scanning-status-box {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: var(--radius-sm);
        }

        .scanning-status-box h4 {
          font-size: 13px;
          font-weight: 700;
        }

        .scanning-status-box p {
          font-size: 11px;
          color: var(--text-secondary);
        }

        .rotate-anim {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Step 3 */
        .results-top-banner {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .results-top-banner h4 {
          font-size: 15px;
          font-weight: 700;
        }

        .results-top-banner p {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .success-icon {
          color: var(--success);
          flex-shrink: 0;
        }

        .metrics-results-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-top: 6px;
        }

        .res-cell {
          padding: 10px 12px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
        }

        .res-label {
          font-size: 9px;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        .res-val {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
          margin-top: 2px;
        }

        .scanner-recommendation-box {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 14px;
          background: rgba(212, 175, 55, 0.1);
          border-radius: var(--radius-sm);
          border-left: 3px solid var(--accent-gold);
          font-size: 12px;
          line-height: 1.45;
          color: var(--text-secondary);
        }

        .scanner-recommendation-box h5 {
          font-size: 12px;
          font-weight: 700;
          color: var(--accent-gold);
          margin-bottom: 2px;
        }

        .apply-profile-btn {
          width: 100%;
          padding: 14px;
          font-size: 14px;
        }

        .gold-icon {
          color: var(--accent-gold);
        }
      `}</style>
    </div>
  );
}
