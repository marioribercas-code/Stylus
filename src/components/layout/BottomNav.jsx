import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Shirt, Shuffle, ShoppingBag, Sparkles } from 'lucide-react';

export default function BottomNav() {
  const navItems = [
    { to: '/', label: 'Inicio', icon: Home },
    { to: '/armario', label: 'Armario', icon: Shirt },
    { to: '/outfits', label: 'Looks', icon: Shuffle },
    { to: '/shopping', label: 'Shopping', icon: ShoppingBag, badge: 'IA' },
    { to: '/estilo', label: 'Estilo & IA', icon: Sparkles }
  ];

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
            >
              <div className="tab-icon-wrap">
                <Icon size={21} strokeWidth={2.2} />
                {item.badge && <span className="tab-badge">{item.badge}</span>}
              </div>
              <span className="tab-label">{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <style>{`
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 100;
          display: flex;
          justify-content: center;
          padding: 8px 16px 14px;
          background: linear-gradient(to top, rgba(10, 10, 12, 0.98) 70%, rgba(10, 10, 12, 0.85) 100%);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-top: 1px solid var(--border-subtle);
        }

        .bottom-nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-around;
          width: 100%;
          max-width: 520px;
        }

        .nav-tab {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          text-decoration: none;
          color: var(--text-muted);
          transition: all var(--transition-fast);
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          position: relative;
        }

        .tab-icon-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform var(--transition-fast);
        }

        .tab-badge {
          position: absolute;
          top: -6px;
          right: -10px;
          font-size: 8px;
          font-weight: 800;
          padding: 1px 4px;
          border-radius: 4px;
          background: var(--accent-gradient);
          color: #0d0d0f;
          letter-spacing: 0.05em;
        }

        .tab-label {
          font-size: 11px;
          font-weight: 500;
          font-family: var(--font-heading);
          letter-spacing: 0.02em;
        }

        .nav-tab.active {
          color: var(--accent-gold);
        }

        .nav-tab.active .tab-icon-wrap {
          transform: translateY(-2px);
          color: var(--accent-gold);
          filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.4));
        }

        .nav-tab.active .tab-label {
          font-weight: 700;
          color: var(--accent-gold-light);
        }

        @media (min-width: 1024px) {
          .bottom-nav-inner {
            max-width: 800px;
          }
        }
      `}</style>
    </nav>
  );
}
