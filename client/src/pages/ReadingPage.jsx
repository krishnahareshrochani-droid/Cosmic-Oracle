import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, shortDate, money } from '../lib/api.js';
import ReadingSections, { readingToText } from '../components/ReadingSections.jsx';
import { useApp } from '../App.jsx';

export default function ReadingPage() {
  const { id } = useParams();
  const { byId, catalog } = useApp();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await api.reading(id);
        if (alive) setData(res);
      } catch (err) {
        if (alive) setError(err.message);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  const reading = data?.reading;
  const type = reading ? byId(reading.typeId) : null;

  const flash = (label) => {
    setCopied(label);
    setTimeout(() => setCopied(null), 1800);
  };

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(readingToText(reading));
      flash('Reading copied');
    } catch {
      flash('Copy failed — try download');
    }
  };

  const download = () => {
    const blob = new Blob([readingToText(reading)], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cosmic-oracle-${reading.typeId}-${id.slice(0, 8)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    flash('Downloaded');
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: `Cosmic Oracle · ${reading.title}`, url });
      else {
        await navigator.clipboard.writeText(url);
        flash('Link copied');
      }
    } catch {
      flash('Share cancelled');
    }
  };

  const remove = async () => {
    if (!window.confirm('Delete this reading from your journal? This cannot be undone.')) return;
    await api.deleteReading(id);
    window.location.href = '/journal';
  };

  if (error) {
    return (
      <div className="wrap">
        <div className="empty">
          <span className="glyph">🌫</span>
          <h2>{error}</h2>
          <Link to="/readings" className="btn btn-primary" style={{ marginTop: '1rem' }}>Find another reading</Link>
        </div>
      </div>
    );
  }

  if (!reading) {
    return <div className="loader"><div className="spinner" /><span className="loader-text">Opening your reading…</span></div>;
  }

  const related = catalog.filter((r) => r.section === type?.section && r.id !== reading.typeId).slice(0, 3);

  return (
    <div className="wrap fade-in">
      <div className="reading-header">
        <div className="row" style={{ fontSize: '0.82rem', color: 'var(--faint)', marginBottom: '1rem' }}>
          <Link to="/readings">Readings</Link><span>/</span>
          <Link to={`/readings/${type?.section || 'tarot'}`}>{type?.section || 'reading'}</Link>
          <span>/</span><span style={{ color: 'var(--soft)' }}>{reading.title}</span>
        </div>
        <div className="reading-title-row">
          <div>
            <div className="eyebrow">{data.price > 0 ? `${money(data.price)} reading` : 'Free reading'} · {shortDate(data.createdAt)}</div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '0.3rem' }}>{reading.title}</h1>
            <p className="muted" style={{ margin: 0 }}>
              {reading.subtitle}
              {reading.subject?.name ? ` · prepared for ${reading.subject.name}` : ''}
            </p>
          </div>
          <div className="reading-actions row">
            <button className="btn btn-quiet btn-sm" onClick={copyText}>📋 Copy</button>
            <button className="btn btn-quiet btn-sm" onClick={download}>⤓ Download</button>
            <button className="btn btn-quiet btn-sm" onClick={share}>↗ Share</button>
            <button className="btn btn-quiet btn-sm" onClick={() => window.print()}>Print</button>
            {data.owner && <button className="btn btn-danger btn-sm" onClick={remove}>Delete</button>}
          </div>
        </div>

        {reading.question && (
          <div className="panel" style={{ marginTop: '1.2rem' }}>
            <span className="orb-label">You asked</span>
            <p style={{ margin: '0.3rem 0 0', fontFamily: 'var(--display)', fontSize: '1.15rem', color: 'var(--white)' }}>“{reading.question}”</p>
          </div>
        )}

        <div className="fact-strip">
          {reading.facts?.map((f) => (
            <div className="fact" key={f.label}>
              <span>{f.label}</span>
              <strong>{f.value}</strong>
            </div>
          ))}
          {reading.subject?.place && <div className="fact"><span>Born</span><strong>{reading.subject.place}</strong></div>}
        </div>
        {copied && <div className="notice notice-info" style={{ marginTop: '0.9rem' }}>{copied}</div>}
      </div>

      <ReadingSections sections={reading.sections} />

      <div className="divider" />

      <section className="r-section">
        <div className="row between" style={{ marginBottom: '1rem' }}>
          <div>
            <h3 style={{ marginBottom: '0.2rem' }}>Keep exploring</h3>
            <p className="small" style={{ margin: 0 }}>Readings are saved automatically to your journal for 12+ months of reflection.</p>
          </div>
          <div className="row">
            {type && <Link to={`/read/${type.id}`} className="btn btn-ghost btn-sm">Read this again</Link>}
            <Link to="/journal" className="btn btn-quiet btn-sm">My journal</Link>
          </div>
        </div>
        <div className="reading-grid">
          {related.map((r) => (
            <Link to={`/read/${r.id}`} key={r.id} className="reading-card">
              <div className="reading-card-top"><h4>{r.name}</h4>{r.free && <span className="tag tag-mint">Free</span>}</div>
              <p>{r.blurb}</p>
              <div className="reading-card-foot">
                <span className="price" style={{ fontSize: '1.15rem' }}>{money(r.price)}</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--cta)' }}>Open →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
