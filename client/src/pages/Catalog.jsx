import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../App.jsx';
import { money } from '../lib/api.js';

const SECTION_COPY = {
  tarot: {
    title: 'Tarot readings',
    text: 'Cartomancy for the moment you are in. Choose by time, topic, depth, spread, personality or a specific situation — the deck does the rest.',
    glyph: '🃏'
  },
  kundli: {
    title: 'Kundli readings',
    text: 'Vedic astrology from your exact birth moment: lagna, planets, nakshatras, Vimshottari dasha, transits and gun-milan compatibility.',
    glyph: '🌙'
  },
  numerology: {
    title: 'Numerology',
    text: 'The arithmetic underneath the story. Driver, Conductor, Kua, Lo Shu grid, personal year and name vibration.',
    glyph: '🔢'
  },
  combo: {
    title: 'Combo readings',
    text: 'When one language is not enough. Cards, chart and numbers read as a single conversation.',
    glyph: '🔱'
  }
};

export default function Catalog() {
  const { section = 'tarot' } = useParams();
  const navigate = useNavigate();
  const { catalog, sections, loading } = useApp();
  const [query, setQuery] = useState('');
  const [freeOnly, setFreeOnly] = useState(false);

  const active = SECTION_COPY[section] ? section : 'tarot';
  const list = useMemo(() => catalog.filter((r) => r.section === active), [catalog, active]);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = list.filter((r) => (!freeOnly || r.free) && (!q || r.name.toLowerCase().includes(q) || r.blurb.toLowerCase().includes(q)));
    const map = new Map();
    filtered.forEach((r) => {
      if (!map.has(r.category)) map.set(r.category, []);
      map.get(r.category).push(r);
    });
    return [...map.entries()];
  }, [list, query, freeOnly]);

  return (
    <div className="wrap fade-in">
      <section className="catalog-hero">
        <div className="eyebrow">{SECTION_COPY[active].glyph} {sections.find((s) => s.id === active)?.tagline || 'Readings'}</div>
        <h1 style={{ fontSize: 'clamp(2.1rem, 4vw, 3.2rem)' }}>{SECTION_COPY[active].title}</h1>
        <p style={{ maxWidth: '62ch', color: 'var(--soft)' }}>{SECTION_COPY[active].text}</p>
        <div className="tabs" style={{ marginTop: '1.4rem' }}>
          {sections.map((s) => (
            <button key={s.id} className={`tab ${active === s.id ? 'active' : ''}`} onClick={() => navigate(`/readings/${s.id}`)}>
              {s.symbol} {s.name.replace(' Readings', '')} <span style={{ opacity: 0.6, marginLeft: '0.25rem', fontSize: '0.78rem' }}>{catalog.filter((r) => r.section === s.id).length}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="row between" style={{ marginBottom: '1.6rem', gap: '1rem' }}>
        <div style={{ flex: '1 1 260px' }}>
          <input
            type="search"
            placeholder="Search readings — love, career, dasha, Lo Shu…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search readings"
          />
        </div>
        <label className="tag" style={{ cursor: 'pointer', padding: '0.55rem 0.9rem' }}>
          <input type="checkbox" checked={freeOnly} onChange={(e) => setFreeOnly(e.target.checked)} style={{ width: 'auto', marginRight: '0.4rem' }} />
          Free only
        </label>
      </div>

      {loading && <div className="loader"><div className="spinner" /><span className="loader-text">Opening the catalogue…</span></div>}

      {!loading && groups.length === 0 && (
        <div className="empty">
          <span className="glyph">🔍</span>
          <h3>Nothing under that name</h3>
          <p className="muted">Try “love”, “career”, “dasha” or clear the free-only filter.</p>
        </div>
      )}

      {groups.map(([category, items]) => (
        <div className="cat-group" key={category}>
          <div className="cat-group-head">
            <h3>{category}</h3>
            <span>{items.length} reading{items.length > 1 ? 's' : ''}</span>
          </div>
          <div className="reading-grid">
            {items.map((r) => (
              <Link to={`/read/${r.id}`} key={r.id} className="reading-card">
                <div className="reading-card-top">
                  <h4>{r.name}</h4>
                  {r.badge ? <span className="tag tag-mint">{r.badge}</span> : null}
                </div>
                <p>{r.blurb}</p>
                <div className="chips">
                  {r.cards ? <span className="chip">{r.cards} card{r.cards > 1 ? 's' : ''}</span> : null}
                  {r.needsPartner ? <span className="chip">2 people</span> : null}
                  {r.requires?.includes('question') ? <span className="chip">your question</span> : null}
                </div>
                <div className="reading-card-foot">
                  <span className={`price ${r.free ? 'price-free' : ''}`} style={{ fontSize: r.free ? undefined : '1.25rem' }}>{money(r.price)}</span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--cta)' }}>Open →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}

      <div className="card card-plain" style={{ marginTop: '2rem' }}>
        <div className="row between">
          <div>
            <h3 style={{ marginBottom: '0.3rem' }}>Not sure which reading fits?</h3>
            <p style={{ margin: 0, color: 'var(--faint)', fontSize: '0.92rem' }}>
              Start with the free Daily Card for the moment, then pick a topic reading when you know the area of life. Kundli first if you want the full map.
            </p>
          </div>
          <Link to="/read/tarot-decision" className="btn btn-ghost btn-sm">Help me decide →</Link>
        </div>
      </div>
    </div>
  );
}
