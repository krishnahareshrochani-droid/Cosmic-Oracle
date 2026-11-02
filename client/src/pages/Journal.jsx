import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, money, shortDate } from '../lib/api.js';
import { useApp } from '../App.jsx';

export default function Journal() {
  const { me } = useApp();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    try {
      setData(await api.readings());
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!window.confirm('Remove this reading from your journal?')) return;
    setBusyId(id);
    try {
      await api.deleteReading(id);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="wrap fade-in">
      <section style={{ paddingBottom: '1.5rem' }}>
        <div className="eyebrow">Saved on this device</div>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>My Journal</h1>
        <p style={{ maxWidth: '58ch' }}>
          Every reading you open is kept here so you can return to it, compare timelines and watch how the story
          actually moved. Readings are tied to this browser session{me?.visitor?.name ? `, ${me.visitor.name}` : ''}.
        </p>
      </section>

      {error && <div className="notice notice-error" style={{ marginBottom: '1rem' }}>{error}</div>}

      {data && (
        <div className="fact-strip" style={{ marginTop: 0, marginBottom: '1.6rem' }}>
          <div className="fact"><span>Readings</span><strong>{data.readings.length}</strong></div>
          <div className="fact"><span>Free</span><strong>{data.free}</strong></div>
          <div className="fact"><span>Unlocked</span><strong>{data.paid}</strong></div>
          <div className="fact"><span>Spent</span><strong>{money(me?.totalSpent || 0)}</strong></div>
        </div>
      )}

      {!data && !error && <div className="loader"><div className="spinner" /><span className="loader-text">Opening your journal…</span></div>}

      {data && data.readings.length === 0 && (
        <div className="empty">
          <span className="glyph">📖</span>
          <h3>Your journal is empty — for now</h3>
          <p className="muted" style={{ maxWidth: '48ch', margin: '0 auto 1.2rem' }}>
            Start with a free daily card or your Janam Kundli. Every reading you open afterwards will appear here automatically.
          </p>
          <div className="row" style={{ justifyContent: 'center' }}>
            <Link to="/read/tarot-daily" className="btn btn-primary">Free daily card</Link>
            <Link to="/read/kundli-janam" className="btn btn-ghost">Free Janam Kundli</Link>
          </div>
        </div>
      )}

      {data && data.readings.length > 0 && (
        <div className="journal-grid">
          {data.readings.map((r) => (
            <div className="journal-card" key={r.id}>
              <div className="row between">
                <span className={`tag ${r.price > 0 ? 'tag-mint' : ''}`}>{r.price > 0 ? money(r.price) : 'Free'}</span>
                <span className="small">{shortDate(r.createdAt)}</span>
              </div>
              <h4>{r.title}</h4>
              <p className="small muted" style={{ margin: 0 }}>{r.subtitle}</p>
              {r.question && <p className="small" style={{ margin: 0, fontStyle: 'italic' }}>“{r.question}”</p>}
              <div className="chips">
                {r.facts?.slice(0, 3).map((f) => <span className="chip" key={f.label}>{f.label}: {f.value}</span>)}
              </div>
              <div className="row between" style={{ marginTop: '0.6rem' }}>
                <Link to={`/reading/${r.id}`} className="btn btn-ghost btn-sm">Open reading</Link>
                <button className="btn btn-quiet btn-sm" onClick={() => remove(r.id)} disabled={busyId === r.id}>
                  {busyId === r.id ? '…' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
