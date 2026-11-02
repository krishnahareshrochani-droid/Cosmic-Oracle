import { Link } from 'react-router-dom';
import { useApp } from '../App.jsx';
import { money } from '../lib/api.js';

const reduce = (n) => String(n).replace(/\D/g, '').split('').reduce((a, b) => a + Number(b), 0) % 9 || 9;

const DATE_MEANING = {
  1: ['Initiation', 'Sun', 'Begin something small and visible.'],
  2: ['Patience', 'Moon', 'Listen more than you speak today.'],
  3: ['Expression', 'Jupiter', 'Teach, write, and share the idea.'],
  4: ['Structure', 'Rahu', 'Build the boring system that holds everything.'],
  5: ['Movement', 'Mercury', 'Change one stuck thing and let it move.'],
  6: ['Belonging', 'Venus', 'Make time for the people who make you human.'],
  7: ['Stillness', 'Ketu', 'Study, meditate, and let the noise settle.'],
  8: ['Karma', 'Saturn', 'Do the hard, honest, unglamorous work.'],
  9: ['Release', 'Mars', 'Finish, forgive, and clear the shelf.']
};

export default function Home() {
  const { catalog, loading } = useApp();
  const today = new Date();
  const dateNumber = reduce(`${today.getDate()}${today.getMonth() + 1}${today.getFullYear()}`);
  const [theme, planet, action] = DATE_MEANING[dateNumber];
  const fee = catalog.filter((c) => c.free).length;
  const total = catalog.length;

  const gateways = [
    { id: 'tarot', glyph: '🃏', title: 'Tarot & Cartomancy', text: '78 cards, 40+ spreads — a mirror for the moment you are standing in.', to: '/readings/tarot' },
    { id: 'kundli', glyph: '🌙', title: 'Vedic Kundli', text: 'Lagna, nakshatra, Vimshottari dasha, transits and 36-guna matching.', to: '/readings/kundli' },
    { id: 'numerology', glyph: '🔢', title: 'Numerology & Lo Shu', text: 'Driver, Conductor, Kua, missing numbers and your personal year cycle.', to: '/numerology' }
  ];

  const featured = ['tarot-love', 'kundli-janam', 'tarot-premium', 'kundli-milan', 'combo-full-life', 'tarot-career']
    .map((id) => catalog.find((c) => c.id === id))
    .filter(Boolean);

  return (
    <>
      <section className="wrap hero">
        <div className="hero-grid">
          <div className="fade-in">
            <div className="eyebrow">Vedic astrology · Numerology · Tarot</div>
            <h1 className="hero-title">Your chart is not a sentence.<br /><em>It is a conversation.</em></h1>
            <p className="hero-sub">
              Cosmic Oracle reads your cards, your Lo Shu grid and your birth chart together — then hands you
              something you can actually use: a clear past, an honest present, a workable next step.
              Warm, grounded, never fear-based.
            </p>
            <div className="hero-actions">
              <Link to="/read/tarot-daily" className="btn btn-primary btn-lg">✨ Free daily card</Link>
              <Link to="/readings" className="btn btn-ghost btn-lg">Browse readings</Link>
            </div>
            <div className="hero-meta">
              <div><strong>78</strong><span>Tarot cards</span></div>
              <div><strong>{total}</strong><span>Reading types</span></div>
              <div><strong>{fee}</strong><span>Free to try</span></div>
              <div><strong>₹49+</strong><span>Deep readings</span></div>
            </div>
          </div>

          <div className="orb-card fade-in">
            <div className="orb-head">
              <div>
                <div className="orb-label">Today · {today.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                <div className="orb-big">{String(dateNumber).padStart(2, '0')}</div>
              </div>
              <span className="tag tag-mint">{planet}</span>
            </div>
            <div style={{ fontFamily: 'var(--display)', fontSize: '1.3rem', color: 'var(--white)', marginTop: '0.4rem' }}>{theme}</div>
            <p style={{ fontSize: '0.92rem', color: 'var(--soft)', marginTop: '0.4rem' }}>{action}</p>
            <div className="orb-rows">
              <div className="orb-row"><span>Date vibration</span><span>{today.toLocaleDateString('en-GB')} → {dateNumber}</span></div>
              <div className="orb-row"><span>Governing planet</span><span>{planet}</span></div>
              <div className="orb-row"><span>Your personal year</span><span>Calculate in the numeroscope →</span></div>
            </div>
            <Link to="/numerology" className="btn btn-quiet btn-sm btn-block" style={{ marginTop: '1.1rem' }}>
              Open my free numeroscope
            </Link>
          </div>
        </div>
      </section>

      <section className="wrap section" style={{ paddingTop: '1rem' }}>
        <div className="gateways">
          {gateways.map((g) => (
            <Link to={g.to} key={g.id} className="gateway">
              <span className="glyph">{g.glyph}</span>
              <h3>{g.title}</h3>
              <p>{g.text}</p>
              <span className="go">Enter →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap section">
        <div className="section-head">
          <div className="eyebrow">Start without paying</div>
          <h2>Four free doors</h2>
          <p>Every first look should cost nothing. Pull a card, open your chart, or read your numbers before you spend a rupee.</p>
        </div>
        <div className="free-strip">
          <Link to="/read/tarot-daily" className="free-card">
            <strong>Daily Card ☀</strong>
            <span>One card for the exact vibration of today.</span>
          </Link>
          <Link to="/read/kundli-janam" className="free-card">
            <strong>Janam Kundli 🗺</strong>
            <span>Your lagna, planets, nakshatra and dasha.</span>
          </Link>
          <Link to="/read/kundli-current-dasha" className="free-card">
            <strong>Current Dasha ⏰</strong>
            <span>Which planetary period is running right now.</span>
          </Link>
          <Link to="/numerology" className="free-card">
            <strong>Lo Shu Numeroscope 🔲</strong>
            <span>Driver, Conductor, Kua, missing numbers, remedies.</span>
          </Link>
        </div>
      </section>

      <section className="wrap section">
        <div className="section-head">
          <div className="eyebrow">How a reading is built</div>
          <h2>Same shape, every single time</h2>
          <p>No vague poetry. Every Cosmic Oracle reading follows the structure you can rely on.</p>
        </div>
        <div className="steps">
          <div className="step"><h4>Cards &amp; planets</h4><p>We draw the cards or compute your planetary positions first — the raw material, visible to you.</p></div>
          <div className="step"><h4>Energy analysis</h4><p>Elements, reversals, houses, dashas and your numbers are read together, not separately.</p></div>
          <div className="step"><h4>Past · Present · Future</h4><p>A timeline you can locate yourself in, with the specific cards or planets named.</p></div>
          <div className="step"><h4>Advice, Do&apos;s &amp; Don&apos;ts</h4><p>Practical next steps, a clear list of what to do and what to avoid, and an honest closing.</p></div>
        </div>
      </section>

      <div className="quote-band">
        <div className="wrap">
          <blockquote>“The stars describe the weather. You are still the one who decides whether to carry an umbrella.”</blockquote>
          <cite>— Cosmic Oracle, house rule</cite>
        </div>
      </div>

      {!loading && (
        <section className="wrap section">
          <div className="section-head">
            <div className="eyebrow">Most consulted</div>
            <h2>Where people usually begin</h2>
          </div>
          <div className="reading-grid">
            {featured.map((r) => (
              <Link to={`/read/${r.id}`} key={r.id} className="reading-card">
                <div className="reading-card-top">
                  <h4>{r.name}</h4>
                  {r.badge ? <span className="tag tag-mint">{r.badge}</span> : null}
                </div>
                <p>{r.blurb}</p>
                <div className="reading-card-foot">
                  <span className="price" style={{ fontSize: '1.25rem' }}>{money(r.price)}</span>
                  <span className="chip">{r.cards ? `${r.cards} cards` : r.section}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="wrap section">
        <div className="grid-2">
          <div className="card">
            <div className="eyebrow">The promise</div>
            <h2 style={{ fontSize: '1.8rem' }}>Honest, warm, and never scary</h2>
            <p>No “you will die alone” theatre. No invented certainty about another person&apos;s private thoughts. If a chart shows friction, you will see it named plainly — and paired with what to actually do about it.</p>
            <ul className="include-list" style={{ marginTop: '1rem' }}>
              <li>The exact cards, positions and planetary degrees are always shown.</li>
              <li>Kundli maths uses real ephemeris calculations, with the limits stated openly.</li>
              <li>Every reading ends with a reminder: this is guidance, not a verdict.</li>
            </ul>
            <Link to="/about" className="btn btn-ghost btn-sm" style={{ marginTop: '1.2rem' }}>How it works</Link>
          </div>
          <div className="card card-plain">
            <div className="eyebrow">Sessions &amp; pricing</div>
            <h2 style={{ fontSize: '1.8rem' }}>From a ₹49 pulse check to a ₹499 life overview</h2>
            <p>Micro-readings start at ₹49. Topic readings sit between ₹99 and ₹299. The complete Full Life Reading is ₹499. Free readings never ask for payment.</p>
            <div className="divider" />
            <div className="summary-row"><span>Daily card</span><span>Free</span></div>
            <div className="summary-row"><span>Past · Present · Future</span><span>₹99</span></div>
            <div className="summary-row"><span>Love or Career deep dive</span><span>₹199</span></div>
            <div className="summary-row"><span>Kundli Milan (36 gunas)</span><span>₹399</span></div>
            <div className="summary-row"><span>Full Life Reading</span><span>₹499</span></div>
            <Link to="/pricing" className="btn btn-primary btn-sm" style={{ marginTop: '1.2rem' }}>See the full price list</Link>
          </div>
        </div>
      </section>
    </>
  );
}
