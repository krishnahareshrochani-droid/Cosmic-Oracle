import { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/readings', label: 'Readings' },
  { to: '/numerology', label: 'Numerology' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/journal', label: 'My Journal' },
  { to: '/about', label: 'About' }
];

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="app">
      <div className="stars" aria-hidden="true" />
      <header className="nav">
        <div className="wrap nav-inner">
          <Link to="/" className="logo" onClick={() => setOpen(false)}>
            <span className="logo-mark">✦</span>
            <span>COSMIC ORACLE</span>
          </Link>
          <nav className={`nav-links ${open ? 'open' : ''}`} aria-label="Primary">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) => `nav-link ${isActive || (l.to === '/readings' && location.pathname.startsWith('/read')) ? 'active' : ''}`}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}
            <Link to="/read/tarot-daily" className="btn btn-primary btn-sm" style={{ marginLeft: '0.4rem' }} onClick={() => setOpen(false)}>
              ✨ Free daily card
            </Link>
          </nav>
          <button className="nav-toggle" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu" aria-expanded={open}>
            {open ? '✕' : '☰'}
          </button>
        </div>
      </header>

      <main className="main">{children}</main>

      <footer className="footer">
        <div className="wrap">
          <div className="footer-grid">
            <div>
              <div className="logo" style={{ marginBottom: '0.8rem' }}><span className="logo-mark">✦</span><span>COSMIC ORACLE</span></div>
              <p style={{ fontSize: '0.9rem', color: 'var(--faint)', maxWidth: '34ch' }}>
                Tarot, Lo Shu numerology and Vedic Kundli — read together, warmly and honestly. Made for self-reflection, never for fear.
              </p>
              <p style={{ fontSize: '0.82rem', color: 'var(--faint)' }}>
                Readings from ₹49 · Complete life overview ₹499
              </p>
            </div>
            <div>
              <h4>Explore</h4>
              <Link to="/readings/tarot">Tarot readings</Link>
              <Link to="/readings/kundli">Kundli readings</Link>
              <Link to="/readings/numerology">Numerology</Link>
              <Link to="/readings/combo">Combo readings</Link>
              <Link to="/numerology">Free numeroscope</Link>
            </div>
            <div>
              <h4>Good to know</h4>
              <Link to="/about">How it works</Link>
              <Link to="/pricing">Pricing &amp; payments</Link>
              <Link to="/journal">Your saved readings</Link>
              <a href="upi://pay?pa=krishnahrrochani@okhdfcbank&pn=Krishna%20HR%20Rochani&cu=INR">Pay via UPI</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Cosmic Oracle · Krishna HR Rochani</span>
            <span>Readings are for reflection &amp; guidance only — not medical, legal, financial or fatalistic advice.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
