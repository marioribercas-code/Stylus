import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useWardrobeStore } from './store/useWardrobeStore';

import TopBar from './components/layout/TopBar';
import BottomNav from './components/layout/BottomNav';

import Home from './pages/Home';
import Wardrobe from './pages/Wardrobe';
import OutfitBuilder from './pages/OutfitBuilder';
import ShoppingAdvisorView from './pages/ShoppingAdvisorView';
import ProfileStyle from './pages/ProfileStyle';
import VirtualFittingRoom from './pages/VirtualFittingRoom';
import TripPacker from './pages/TripPacker';
import WardrobeAnalytics from './pages/WardrobeAnalytics';

export default function App() {
  const { initStore, isLoading } = useWardrobeStore();

  useEffect(() => {
    initStore();
  }, [initStore]);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner-wrap">
          <div className="brand-logo-large">
            <span>S</span>
          </div>
          <h2 className="loading-title">STYLUS</h2>
          <span className="loading-sub">Cargando Inteligencia Satorial...</span>
        </div>

        <style>{`
          .loading-screen {
            width: 100vw;
            height: 100vh;
            background: #0a0a0c;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .loading-spinner-wrap {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
          }
          .brand-logo-large {
            width: 64px;
            height: 64px;
            border-radius: 18px;
            background: var(--accent-gradient);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 30px rgba(212, 175, 55, 0.4);
            animation: pulse 1.5s infinite ease-in-out;
          }
          .brand-logo-large span {
            font-family: var(--font-heading);
            font-weight: 800;
            font-size: 36px;
            color: #0b0b0e;
          }
          .loading-title {
            font-size: 24px;
            letter-spacing: 0.1em;
            color: #fff;
          }
          .loading-sub {
            font-size: 12px;
            color: var(--accent-gold);
            letter-spacing: 0.05em;
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.85; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="app-container">
        <TopBar />
        <main className="app-main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/armario" element={<Wardrobe />} />
            <Route path="/outfits" element={<OutfitBuilder />} />
            <Route path="/probador" element={<VirtualFittingRoom />} />
            <Route path="/shopping" element={<ShoppingAdvisorView />} />
            <Route path="/estilo" element={<ProfileStyle />} />
            <Route path="/maleta" element={<TripPacker />} />
            <Route path="/analiticas" element={<WardrobeAnalytics />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
