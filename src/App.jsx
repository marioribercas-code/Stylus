import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';
import { Sun, Shirt, LayoutGrid, Sparkles, User } from 'lucide-react';
import { DataProvider, useData } from './ui';
import Today from './pages/Today';
import Wardrobe from './pages/Wardrobe';
import Outfits from './pages/Outfits';
import Stylist from './pages/Stylist';
import Profile from './pages/Profile';

function Shell() {
  const { ready } = useData();
  if (!ready) return <div className="empty" style={{ paddingTop: '40vh' }}><span className="spin" style={{ display: 'inline-block' }} /></div>;
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Today />} />
        <Route path="/armario" element={<Wardrobe />} />
        <Route path="/outfits" element={<Outfits />} />
        <Route path="/estilista" element={<Stylist />} />
        <Route path="/perfil" element={<Profile />} />
      </Routes>
      <nav className="nav">
        <NavLink to="/" end><Sun size={21} />Hoy</NavLink>
        <NavLink to="/armario"><Shirt size={21} />Armario</NavLink>
        <NavLink to="/outfits"><LayoutGrid size={21} />Outfits</NavLink>
        <NavLink to="/estilista"><Sparkles size={21} />Estilista</NavLink>
        <NavLink to="/perfil"><User size={21} />Perfil</NavLink>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <DataProvider>
        <Shell />
      </DataProvider>
    </HashRouter>
  );
}
