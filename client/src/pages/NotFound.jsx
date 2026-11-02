import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="wrap">
      <div className="empty">
        <span className="glyph">🌌</span>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>This constellation isn&apos;t in the catalogue</h1>
        <p className="muted" style={{ maxWidth: '46ch', margin: '0 auto 1.4rem' }}>
          The page you followed doesn&apos;t exist. The stars, however, are still exactly where you left them.
        </p>
        <div className="row" style={{ justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary">Return home</Link>
          <Link to="/readings" className="btn btn-ghost">Browse readings</Link>
        </div>
      </div>
    </div>
  );
}
