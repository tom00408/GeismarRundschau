import { Link, useLocation } from 'react-router-dom';
import { colors } from '../styles/colors';
import React, { useEffect, useRef, useState } from 'react';
import keiler from '../assets/keiler.png';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/archive', label: 'Archiv' },
  { to: '/search', label: 'Suchen' },
];

const Header: React.FC = () => {
  const location = useLocation();
  const headerRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (headerRef.current) {
      headerRef.current.animate([
        { transform: 'translateY(-60px)', opacity: 0 },
        { transform: 'translateY(0)', opacity: 1 }
      ], {
        duration: 700,
        easing: 'cubic-bezier(.68,-0.55,.27,1.55)',
        fill: 'forwards'
      });
    }
  }, []);

  // Menü schließt bei Navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Responsives Layout
  return (
    <div
      ref={headerRef}
      style={{
        background: `linear-gradient(90deg, ${colors.red} 0%, ${colors.red2} 100%)`,
        color: colors.white,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        borderRadius: '0 0 18px 18px',
        padding: '0.5rem 0',
        marginBottom: '2rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        transition: 'box-shadow 0.3s',
      }}
    >
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2vw',
        minHeight: 56,
      }}>
        {/* Logo/Name */}
        <div style={{
          fontWeight: 700,
          fontSize: 22,
          letterSpacing: 1,
          color: colors.white,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          textShadow: '0 2px 8px rgba(0,0,0,0.10)'
        }}>
          <img src={keiler} alt="Keiler" style={{ height: 36, width: 36, objectFit: 'contain', marginRight: 6 }} />
          MTV Geismar Rundschau-Portal
        </div>
        {/* Desktop-Navigation */}
        <nav className="desktop-nav" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  position: 'relative',
                  color: colors.white,
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: 17,
                  padding: '0.5rem 0',
                  letterSpacing: 0.5,
                  transition: 'color 0.2s',
                  opacity: isActive ? 1 : 0.85,
                  display: 'inline-block',
                }}
              >
                {link.label}
                <span
                  style={{
                    display: 'block',
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    width: isActive ? '100%' : '0%',
                    height: 3,
                    background: colors.white,
                    borderRadius: 2,
                    transition: 'width 0.35s cubic-bezier(.68,-0.55,.27,1.55)',
                  }}
                  className="nav-underline"
                />
              </Link>
            );
          })}
        </nav>
        {/* Burger-Menü für Mobil */}
        <button
          className="burger"
          aria-label="Menü öffnen"
          onClick={() => setMenuOpen((v) => !v)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 8,
            marginLeft: 10,
            zIndex: 120,
          }}
        >
          <div style={{ width: 28, height: 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{
                display: 'block',
                height: 4,
                width: '100%',
                borderRadius: 2,
                background: colors.white,
                transition: 'all 0.3s',
                transform: menuOpen && i === 1 ? 'scaleX(0)' : 'none',
                ...(menuOpen && i === 0 ? { transform: 'translateY(9px) rotate(45deg)' } : {}),
                ...(menuOpen && i === 2 ? { transform: 'translateY(-9px) rotate(-45deg)' } : {}),
              }} />
            ))}
          </div>
        </button>
      </div>
      {/* Mobile Navigation Overlay */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.55)',
            zIndex: 200,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.3s',
          }}
          onClick={() => setMenuOpen(false)}
        >
          <div
            style={{
              background: `linear-gradient(90deg, ${colors.red} 0%, ${colors.red2} 100%)`,
              borderRadius: 16,
              boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
              padding: '2rem 2.5rem',
              minWidth: 220,
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem',
              alignItems: 'center',
            }}
            onClick={e => e.stopPropagation()}
          >
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    color: colors.white,
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: 22,
                    letterSpacing: 0.5,
                    opacity: isActive ? 1 : 0.85,
                    position: 'relative',
                  }}
                >
                  {link.label}
                  <span
                    style={{
                      display: 'block',
                      position: 'absolute',
                      left: 0,
                      bottom: -4,
                      width: isActive ? '100%' : '0%',
                      height: 3,
                      background: colors.white,
                      borderRadius: 2,
                      transition: 'width 0.35s cubic-bezier(.68,-0.55,.27,1.55)',
                    }}
                    className="nav-underline"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      )}
      {/* Animation für Unterstrich bei Hover */}
      <style>{`
        @media (max-width: 700px) {
          .desktop-nav { display: none !important; }
          .burger { display: block !important; }
        }
        @media (min-width: 701px) {
          .desktop-nav { display: flex !important; }
          .burger { display: none !important; }
        }
        a:hover .nav-underline {
          width: 100% !important;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Header; 