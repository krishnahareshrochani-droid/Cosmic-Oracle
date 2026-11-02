import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="wrap fade-in">
      <section style={{ paddingBottom: '1.5rem' }}>
        <div className="eyebrow">How Cosmic Oracle actually works</div>
        <h1 style={{ fontSize: 'clamp(2.1rem, 4vw, 3.2rem)' }}>Warm, specific, and honest about what it cannot do</h1>
        <p style={{ maxWidth: '66ch' }}>
          Cosmic Oracle blends three traditions that are usually sold separately: card cartomancy (78-card tarot),
          Vedic astrology (Kundli, nakshatras, Vimshottari dasha, transits and gun-milan), and numerology
          (Driver–Conductor, Kua, Lo Shu grid, personal year). Every reading shows its raw material first, then
          interprets it — so you can always see what is being read and judge it for yourself.
        </p>
      </section>

      <div className="grid-2">
        <div className="card">
          <div className="eyebrow">The methodology</div>
          <h3>Kua number</h3>
          <p>
            Reduce the birth year to one digit. Females add 4 (the last-two-digit method adds 5, or 6 from 2000
            onward); males subtract the digit from 11. Reduce the result to one digit again. Both routes are shown
            in the numeroscope so you can verify them.
          </p>
          <div className="panel">
            <strong>Worked example · female born 1978</strong>
            <p className="small" style={{ margin: '0.3rem 0 0' }}>
              1+9+7+8 = 25 → 2+5 = 7 · 7+4 = 11 → 1+1 = 2. Kua = 2.
            </p>
          </div>
          <div className="divider" />
          <h3>Lo Shu grid</h3>
          <p>
            Every non-zero digit of the birth date is placed into the standard 3×3 grid (4-9-2 / 3-5-7 / 8-1-6).
            The Conductor and Kua are then added as extra placements; the Driver is added only when the birth day is
            not already a single digit (so 05, 10, 20 or 30 is never double-counted). Missing numbers, repeats and
            the eight planes are then read.
          </p>
          <div className="divider" />
          <h3>Personal year</h3>
          <p>
            Add your birth day and month digits to the digits of the target year, then reduce. The personal year
            begins on <strong>5 February</strong>, not 1 January — so January and early February still belong to the
            previous year's cycle. Personal month and personal day build on that base.
          </p>
        </div>

        <div className="card">
          <div className="eyebrow">Vedic astronomy</div>
          <h3>What is computed, and how precisely</h3>
          <p>
            Planetary longitudes come from JPL&apos;s approximate Keplerian elements (valid roughly 1800–2050) for
            Mercury through Saturn, a Meeus lunar series for the Moon, and the mean lunar node for Rahu–Ketu.
            Positions are converted to the sidereal zodiac with a Lahiri ayanamsa. The ascendant is derived from
            sidereal time, latitude, longitude and obliquity, then whole-sign houses are applied.
          </p>
          <p>
            Accuracy is typically within about half a degree — enough for signs, nakshatras, pada, dasha periods
            and compatibility, but <strong>not</strong> enough for muhurta, prashna fine timing or cusp-critical
            decisions. For those, consult a professional Jyotishi with full Swiss Ephemeris software.
          </p>
          <div className="notice notice-warn" style={{ marginTop: '1rem' }}>
            <strong>Honest limits.</strong> Astrology and numerology are interpretive traditions, not validated
            science. This platform does not predict events, diagnose illness, determine legal outcomes or decide
            anybody else&apos;s private thoughts.
          </div>
        </div>
      </div>

      <section className="section">
        <div className="section-head">
          <div className="eyebrow">The reading shape</div>
          <h2>What you always receive</h2>
        </div>
        <div className="steps">
          <div className="step"><h4>1 · Cards or planets</h4><p>Drawn cards with positions and orientation, or your computed planetary table with degrees, signs, houses and nakshatras.</p></div>
          <div className="step"><h4>2 · Energy analysis</h4><p>Element balance, reversals, house lords, dasha periods and the numerology overlay, written in plain language.</p></div>
          <div className="step"><h4>3 · Past · Present · Future</h4><p>A timeline anchored to specific cards or planetary periods — not generic filler.</p></div>
          <div className="step"><h4>4 · Advice &amp; guardrails</h4><p>Practical steps, explicit Do&apos;s and Don&apos;ts, an encouraging closing and a clear disclaimer.</p></div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="grid-2">
          <div className="card">
            <div className="eyebrow">Guardrails</div>
            <h3>What the Oracle will never do</h3>
            <ul className="include-list">
              <li>Never claims to know a specific third person&apos;s actual thoughts or feelings.</li>
              <li>Never gives medical, legal or financial instructions disguised as a reading.</li>
              <li>Never uses fear, curses or &ldquo;remedy or else&rdquo; pressure to sell anything.</li>
              <li>Never presents a calculation as certainty. The maths is shown; the interpretation is offered.</li>
              <li>Never asks for card details — UPI only, and only for paid readings.</li>
            </ul>
          </div>
          <div className="card">
            <div className="eyebrow">Who it is for</div>
            <h3>People who want a mirror, not a magician</h3>
            <p>
              Cosmic Oracle is built for self-reflection: to name what you already sense, to find timing windows,
              to notice patterns across a year, and to leave with one next step instead of ten anxieties.
            </p>
            <p className="small muted">
              If you are in crisis or making a health, legal or financial decision, please speak to a qualified
              professional. A reading is a conversation with yourself, held in a beautiful room.
            </p>
            <div className="row" style={{ marginTop: '1rem' }}>
              <Link to="/readings" className="btn btn-primary btn-sm">Browse readings</Link>
              <Link to="/numerology" className="btn btn-ghost btn-sm">Try the numeroscope</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap" style={{ paddingBottom: '1rem' }}>
        <div className="closing-block">
          <p>“You are not being judged by the sky. You are being described by it — and description is always an invitation, never a sentence.”</p>
        </div>
      </section>
    </div>
  );
}
