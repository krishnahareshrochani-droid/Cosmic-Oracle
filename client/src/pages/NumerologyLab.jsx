import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../App.jsx';
import { api } from '../lib/api.js';
import LoShuGrid from '../components/LoShuGrid.jsx';

const Stars = ({ value }) => (
  <span aria-label={`${value} out of 5`} style={{ letterSpacing: '0.1em', color: 'var(--gold)' }}>
    {'★'.repeat(Math.floor(value))}{value % 1 ? '½' : ''}{'☆'.repeat(Math.max(0, 5 - Math.ceil(value)))}
  </span>
);

export default function NumerologyLab() {
  const { profile, setProfile } = useApp();
  const [form, setForm] = useState({ name: profile.name || '', dob: profile.dob || '', gender: profile.gender || 'female' });
  const [scope, setScope] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const autoRan = useRef(false);

  const run = async (payload = form) => {
    if (!payload.name.trim() || !payload.dob) {
      setError('Name and date of birth are needed — the Oracle cannot read an empty sky.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await api.numeroscope({ name: payload.name.trim(), dob: payload.dob, gender: payload.gender });
      setScope(res.numeroscope);
      setProfile({ name: payload.name.trim(), dob: payload.dob, gender: payload.gender });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (!autoRan.current && profile.dob && profile.name) {
      autoRan.current = true;
      run({ name: profile.name, dob: profile.dob, gender: profile.gender || 'female' });
    }
  }, [profile]);

  const n = scope;

  return (
    <div className="wrap fade-in">
      <section style={{ paddingBottom: '1.4rem' }}>
        <div className="eyebrow">Free · no payment</div>
        <h1 style={{ fontSize: 'clamp(2.1rem, 4vw, 3.2rem)' }}>Your Numeroscope</h1>
        <p style={{ maxWidth: '60ch' }}>
          Driver (Mulank), Conductor (Bhagyank), Kua, the Lo Shu grid, missing numbers, remedies and your personal
          year cycle — calculated exactly as the tradition prescribes, with the working shown.
        </p>
      </section>

      <form
        className="card"
        onSubmit={(e) => { e.preventDefault(); run(); }}
        style={{ marginBottom: '2rem' }}
      >
        <div className="form-grid">
          <div className="field">
            <label htmlFor="nname">Full name</label>
            <input id="nname" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name as written" autoComplete="name" />
          </div>
          <div className="field">
            <label htmlFor="ndob">Date of birth</label>
            <input id="ndob" type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} max={new Date().toISOString().slice(0, 10)} />
          </div>
          <div className="field">
            <label>Gender</label>
            <div className="radio-row">
              {['female', 'male'].map((g) => (
                <label className="radio-pill" key={g}>
                  <input type="radio" name="ngender" checked={form.gender === g} onChange={() => setForm({ ...form, gender: g })} />
                  <span>{g === 'female' ? 'Female (+4 Kua rule)' : 'Male (11 − rule)'}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="field" style={{ alignSelf: 'end' }}>
            <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? 'Calculating…' : 'Reveal my numeroscope'}</button>
          </div>
        </div>
        {error && <div className="notice notice-error">{error}</div>}
      </form>

      {!n && !busy && (
        <div className="empty">
          <span className="glyph">🔢</span>
          <h3>Nothing hidden, nothing invented</h3>
          <p className="muted" style={{ maxWidth: '52ch', margin: '0 auto' }}>
            Enter your birth details above. You will see exactly how every number was derived — including the Kua
            formula and the 3×3 Lo Shu placement rules.
          </p>
        </div>
      )}

      {busy && <div className="loader"><div className="spinner" /><span className="loader-text">Mapping your grid…</span></div>}

      {n && (
        <div className="fade-in">
          <div className="num-grid">
            <div className="num-tile">
              <div className="cap">Driver number</div>
              <div className="big">{n.driver.number}</div>
              <h4>{n.driver.title} · {n.driver.planet}</h4>
              <p>{n.driver.traits}</p>
            </div>
            <div className="num-tile">
              <div className="cap">Conductor number</div>
              <div className="big">{n.conductor.number}</div>
              <h4>{n.conductor.title} · {n.conductor.planet}</h4>
              <p>{n.conductor.traits}</p>
            </div>
            <div className="num-tile">
              <div className="cap">Kua number</div>
              <div className="big">{n.kua.kua}</div>
              <h4>{n.kua.group.name}</h4>
              <p>{n.kua.method}. Facing directions: {n.kua.group.best}.</p>
            </div>
          </div>

          <div className="grid-2" style={{ marginTop: '1.4rem', alignItems: 'start' }}>
            <div className="card">
              <div className="eyebrow">Lo Shu grid</div>
              <h3 style={{ marginBottom: '1rem' }}>Your numeroscope</h3>
              <LoShuGrid grid={n.grid.grid} />
              <div className="fact-strip" style={{ marginTop: '1rem' }}>
                <div className="fact"><span>Driver</span><strong>{n.grid.driver}</strong></div>
                <div className="fact"><span>Conductor</span><strong>{n.grid.conductor}</strong></div>
                <div className="fact"><span>Kua</span><strong>{n.grid.kua}</strong></div>
                <div className="fact"><span>Missing</span><strong>{n.grid.missing.length ? n.grid.missing.join(', ') : 'none'}</strong></div>
              </div>
              <p className="small muted" style={{ marginTop: '0.8rem', marginBottom: 0 }}>{n.grid.notes.join(' ')}</p>
            </div>

            <div className="card">
              <div className="eyebrow">Personal year</div>
              <div className="row" style={{ alignItems: 'flex-end', gap: '1rem' }}>
                <div className="orb-big" style={{ color: 'var(--cta)' }}>{n.personalYear.number}</div>
                <div>
                  <h3 style={{ marginBottom: '0.2rem' }}>{n.personalYear.title}</h3>
                  <span className="small">Started {n.personalYear.startedOn} · {n.personalYear.planet}</span>
                </div>
              </div>
              <p style={{ marginTop: '0.8rem' }}>{n.personalYear.summary}</p>
              <div className="panel" style={{ marginBottom: '0.6rem' }}><strong style={{ color: 'var(--cta)' }}>Focus:</strong> {n.personalYear.focus}</div>
              <div className="panel"><strong style={{ color: 'var(--gold)' }}>Caution:</strong> {n.personalYear.caution}</div>
              <div className="summary-row" style={{ marginTop: '0.8rem' }}><span>This month</span><span>{n.personalMonth.number} · {n.personalMonth.label || 'Personal month'}</span></div>
              <div className="summary-row"><span>Today</span><span>{n.personalDay.number} · {n.personalDay.title}</span></div>
              <div className="summary-row"><span>Working</span><span>{n.personalYear.workings}</span></div>
            </div>
          </div>

          <div className="grid-2" style={{ marginTop: '1.4rem', alignItems: 'start' }}>
            <div className="card">
              <div className="eyebrow">Driver × Conductor</div>
              <h3 style={{ marginBottom: '0.5rem' }}>
                {n.driver.number}–{n.conductor.number} <Stars value={n.combo.stars} />
              </h3>
              <p style={{ marginBottom: '0.6rem' }}><strong>{n.combo.theme}</strong> — {n.combo.verdict}</p>
              <p className="small muted">
                {n.combo.driverPlanet} (Driver) with {n.combo.conductorPlanet} (Conductor), a {n.combo.relation} planetary relation.
                This is one of the tradition&apos;s 81 Driver–Conductor combinations.
              </p>
              <div className="divider" />
              <div className="summary-row"><span>Friends</span><span>{n.friendship.friends.join(', ') || '—'}</span></div>
              <div className="summary-row"><span>Challenging</span><span>{n.friendship.enemies.join(', ') || '—'}</span></div>
              <div className="summary-row"><span>Lucky numbers</span><span>{n.lucky.numbers.join(', ')}</span></div>
              <div className="summary-row"><span>Lucky colour / day</span><span>{n.lucky.colour} · {n.lucky.day}</span></div>
            </div>

            <div className="card">
              <div className="eyebrow">Impact of repeats</div>
              <h3 style={{ marginBottom: '0.7rem' }}>{n.repeated.length ? 'Amplified numbers' : 'A balanced grid'}</h3>
              {n.repeated.length ? (
                <div className="stack">
                  {n.repeated.map((r) => (
                    <div className="panel" key={r.number}>
                      <strong style={{ color: 'var(--white)' }}>{r.number} appears {r.count}× · {r.label}</strong>
                      <p className="small" style={{ margin: '0.25rem 0 0' }}>{r.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="muted">No number repeats. Each energy appears once — the work is integration rather than moderation.</p>
              )}
            </div>
          </div>

          <div className="card" style={{ marginTop: '1.4rem' }}>
            <div className="eyebrow">Planes of the grid</div>
            <h3 style={{ marginBottom: '0.9rem' }}>Which lines are complete</h3>
            <div className="plane-list">
              {n.planes.map((p) => (
                <div className={`plane ${p.present ? 'on' : 'off'}`} key={p.name}>
                  <div>
                    <strong>{p.name} <span style={{ color: 'var(--faint)', fontWeight: 400 }}>({p.cells.join('-')})</span></strong>
                    <span>{p.present ? p.gift : p.lacking}</span>
                  </div>
                  <span className="status">{p.present ? 'Complete' : `${p.filled}/3 filled`}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid-2" style={{ marginTop: '1.4rem', alignItems: 'start' }}>
            <div className="card">
              <div className="eyebrow">Missing numbers</div>
              <h3 style={{ marginBottom: '0.7rem' }}>{n.missing.length ? `${n.missing.length} gap${n.missing.length > 1 ? 's' : ''} in the grid` : 'No gaps'}</h3>
              {n.missing.length ? (
                <div className="stack">
                  {n.missing.map((m) => (
                    <div className="panel" key={m.number}>
                      <strong style={{ color: 'var(--white)' }}>{m.number} · {m.theme}</strong>
                      <p className="small" style={{ margin: '0.25rem 0 0' }}>{m.text}</p>
                    </div>
                  ))}
                </div>
              ) : <p className="muted">Every number 1–9 is present. Nothing is structurally missing.</p>}
            </div>

            <div className="card">
              <div className="eyebrow">Remedies &amp; upay</div>
              <h3 style={{ marginBottom: '0.7rem' }}>What the tradition suggests</h3>
              {n.remedies.picked.length ? (
                <div className="stack">
                  {n.remedies.picked.map((r) => (
                    <div className="panel" key={r.condition}>
                      <strong style={{ color: 'var(--white)' }}>{r.yantra}</strong>
                      <p className="small" style={{ margin: '0.25rem 0 0' }}><em>{r.condition}</em> — {r.note}</p>
                    </div>
                  ))}
                </div>
              ) : <p className="muted">No object remedies are indicated for your grid. Behavioural upay — routine, service, study — will serve you better.</p>}
              {n.remedies.notes.map((note) => <div className="notice notice-warn" style={{ marginTop: '0.7rem' }} key={note}>{note}</div>)}
            </div>
          </div>

          <div className="card" style={{ marginTop: '1.4rem' }}>
            <div className="eyebrow">Name vibration</div>
            <h3>First name {n.name.first.number} · Full name {n.name.full.number}</h3>
            <p>{n.name.notes.join(' ')}</p>
            <p className="small muted" style={{ marginBottom: 0 }}>
              Letters: {n.name.full.rows.map((r) => `${r.letter}=${r.value}`).join(' · ')}
            </p>
            {n.name.karmic && <div className="notice notice-warn" style={{ marginTop: '0.7rem' }}>{n.name.karmic}</div>}
          </div>

          <div className="card card-plain" style={{ marginTop: '1.4rem' }}>
            <div className="row between">
              <div>
                <h3 style={{ marginBottom: '0.3rem' }}>Go deeper</h3>
                <p className="small" style={{ margin: 0 }}>The numeroscope is the doorway. These readings walk through it.</p>
              </div>
              <div className="row">
                <Link to="/read/num-name" className="btn btn-ghost btn-sm">Name analysis ₹149</Link>
                <Link to="/read/kundli-janam" className="btn btn-quiet btn-sm">Free Janam Kundli</Link>
                <Link to="/read/combo-tarot-numerology" className="btn btn-primary btn-sm">Tarot + Numerology ₹349</Link>
              </div>
            </div>
          </div>

          <p className="small muted" style={{ marginTop: '1.2rem' }}>
            Personal years begin on 5 February, not 1 January. Kua uses the full-birth-year rule (+4 female / 11 − digit male);
            the last-two-digit method gives the same result and is shown for verification. Numbers are interpretive tools,
            not verdicts — please read them as reflection.
          </p>
        </div>
      )}
    </div>
  );
}
