import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../App.jsx';
import { api, money } from '../lib/api.js';
import PaymentModal from '../components/PaymentModal.jsx';
import LoShuGrid from '../components/LoShuGrid.jsx';

const reduce = (v) => {
  let n = String(v).replace(/\D/g, '').split('').reduce((a, b) => a + Number(b), 0);
  while (n > 9) n = String(n).split('').reduce((a, b) => a + Number(b), 0);
  return n;
};

function quickNumbers(dob, gender) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob || '')) return null;
  const [y, m, d] = dob.split('-').map(Number);
  const driver = reduce(d);
  const conductor = reduce(`${y}${m}${d}`);
  const yearDigit = reduce(y);
  const raw = String(gender).startsWith('f') ? 4 + yearDigit : 11 - yearDigit;
  const kua = raw < 1 ? reduce(raw + 9) : reduce(raw);
  return { driver, conductor, kua };
}

export default function ReadingFlow() {
  const { typeId } = useParams();
  const navigate = useNavigate();
  const { byId, cities, profile, setProfile, loading } = useApp();
  const type = byId(typeId);

  const [form, setForm] = useState(() => ({
    name: profile.name || '',
    gender: profile.gender || 'female',
    dob: profile.dob || '',
    tob: profile.tob || '',
    place: profile.place || 'Pune',
    mobile: '',
    question: '',
    partnerName: '',
    partnerDob: '',
    partnerTob: '',
    partnerPlace: 'Mumbai'
  }));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [paying, setPaying] = useState(false);
  const [paidOrderId, setPaidOrderId] = useState(null);

  const update = (patch) => setForm((f) => ({ ...f, ...patch }));
  const needs = type?.requires || ['name', 'dob'];
  const showBirth = needs.includes('dob');
  const showTime = needs.includes('tob');
  const showPlace = needs.includes('place');
  const showMobile = needs.includes('mobile');
  const questionRequired = needs.includes('question');
  const numbers = useMemo(() => quickNumbers(form.dob, form.gender), [form.dob, form.gender]);

  if (loading) return <div className="loader"><div className="spinner" /><span className="loader-text">Reading the catalogue…</span></div>;
  if (!type) {
    return (
      <div className="wrap">
        <div className="empty">
          <span className="glyph">🌫</span>
          <h2>That reading is not in the catalogue</h2>
          <Link to="/readings" className="btn btn-primary" style={{ marginTop: '1rem' }}>Browse readings</Link>
        </div>
      </div>
    );
  }

  const buildProfile = () => {
    const p = {
      name: form.name.trim(),
      gender: form.gender,
      dob: showBirth ? form.dob : undefined,
      tob: showTime ? form.tob || '12:00' : undefined,
      place: showPlace ? form.place : undefined,
      question: form.question.trim() || undefined
    };
    if (showMobile) p.mobile = form.mobile.replace(/\D/g, '');
    if (type.needsPartner) {
      p.partner = {
        name: form.partnerName.trim() || 'Partner',
        gender: form.gender === 'female' ? 'male' : 'female',
        dob: form.partnerDob,
        tob: form.partnerTob || '12:00',
        place: form.partnerPlace
      };
    }
    return p;
  };

  const validate = () => {
    if (!form.name.trim()) return 'Please tell the Oracle your name.';
    if (showBirth && !/^\d{4}-\d{2}-\d{2}$/.test(form.dob)) return 'Please enter a valid date of birth.';
    if (questionRequired && !form.question.trim()) return 'This reading needs your specific question.';
    if (showMobile && !/^\d{10}$/.test(form.mobile.replace(/\D/g, ''))) return 'Please enter a 10-digit mobile number.';
    if (type.needsPartner && !/^\d{4}-\d{2}-\d{2}$/.test(form.partnerDob)) return 'Please add the second person’s date of birth.';
    return null;
  };

  const generate = async (orderId) => {
    setBusy(true);
    setError(null);
    try {
      const payload = buildProfile();
      const res = await api.createReading(type.id, orderId, payload);
      const draft = { name: payload.name, gender: payload.gender };
      ['dob', 'tob', 'place'].forEach((k) => { if (payload[k]) draft[k] = payload[k]; });
      setProfile(draft);
      navigate(`/reading/${res.id}`);
    } catch (err) {
      setError(err.message);
      setPaying(false);
    } finally {
      setBusy(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const problem = validate();
    if (problem) { setError(problem); return; }
    setError(null);
    if (type.free) {
      await generate(undefined);
      return;
    }
    // A paid order that has not produced a reading yet is reused instead of charging twice.
    if (paidOrderId) {
      await generate(paidOrderId);
      return;
    }
    setPaying(true);
  };

  const placeOptions = cities.map((c) => c.name);

  return (
    <div className="wrap fade-in">
      <div className="row" style={{ marginBottom: '1.2rem', fontSize: '0.85rem', color: 'var(--faint)' }}>
        <Link to="/readings">Readings</Link><span>/</span>
        <Link to={`/readings/${type.section}`}>{type.section}</Link><span>/</span>
        <span style={{ color: 'var(--soft)' }}>{type.name}</span>
      </div>

      <div className="flow-grid">
        <form onSubmit={onSubmit} className="card" noValidate>
          <div className="eyebrow">{type.category} · {type.cards ? `${type.cards} cards` : type.section}</div>
          <h1 style={{ fontSize: 'clamp(1.9rem, 3.4vw, 2.7rem)' }}>{type.name}</h1>
          <p style={{ color: 'var(--soft)', maxWidth: '56ch' }}>{type.blurb}</p>

          {error && <div className="notice notice-error" style={{ marginBottom: '1rem' }}>{error}</div>}

          <div className="divider" />

          <div className="form-grid">
            <div className="field">
              <label htmlFor="name">Your name *</label>
              <input id="name" value={form.name} onChange={(e) => update({ name: e.target.value })} placeholder="How should the Oracle address you?" autoComplete="name" />
            </div>
            <div className="field">
              <label>Gender (for Kua calculation)</label>
              <div className="radio-row">
                {['female', 'male'].map((g) => (
                  <label className="radio-pill" key={g}>
                    <input type="radio" name="gender" value={g} checked={form.gender === g} onChange={() => update({ gender: g })} />
                    <span>{g === 'female' ? 'Female' : 'Male'}</span>
                  </label>
                ))}
              </div>
            </div>

            {showBirth && (
              <div className="field">
                <label htmlFor="dob">Date of birth *</label>
                <input id="dob" type="date" value={form.dob} onChange={(e) => update({ dob: e.target.value })} max={new Date().toISOString().slice(0, 10)} />
                <span className="hint">Used for Driver, Conductor, Kua and your Lo Shu grid.</span>
              </div>
            )}

            {showTime && (
              <div className="field">
                <label htmlFor="tob">Time of birth *</label>
                <input id="tob" type="time" value={form.tob} onChange={(e) => update({ tob: e.target.value })} />
                <span className="hint">Lagna and dasha balance need the exact time.</span>
              </div>
            )}

            {showPlace && (
              <div className="field full">
                <label htmlFor="place">Place of birth *</label>
                <input id="place" list="cities" value={form.place} onChange={(e) => update({ place: e.target.value })} placeholder="City of birth" />
                <datalist id="cities">
                  {placeOptions.map((c) => <option key={c} value={c} />)}
                </datalist>
                <span className="hint">Coordinates and time zone come from this city. If it is not listed, pick the nearest larger city.</span>
              </div>
            )}

            {showMobile && (
              <div className="field full">
                <label htmlFor="mobile">Mobile number *</label>
                <input id="mobile" value={form.mobile} onChange={(e) => update({ mobile: e.target.value })} placeholder="10-digit number" inputMode="numeric" maxLength={13} />
                <span className="hint">Used only for this reading — nothing is sent to it.</span>
              </div>
            )}

            <div className="field full">
              <label htmlFor="question">{questionRequired ? 'Your question *' : 'Your question (optional)'}</label>
              <textarea
                id="question"
                value={form.question}
                onChange={(e) => update({ question: e.target.value })}
                placeholder="What is on your mind? The more specific the question, the more specific the reading."
                maxLength={600}
              />
            </div>
          </div>

          {type.needsPartner && (
            <>
              <div className="divider" />
              <div className="eyebrow">The second chart</div>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="pname">Their name</label>
                  <input id="pname" value={form.partnerName} onChange={(e) => update({ partnerName: e.target.value })} placeholder="Partner / business partner / child" />
                </div>
                <div className="field">
                  <label htmlFor="pdob">Their date of birth *</label>
                  <input id="pdob" type="date" value={form.partnerDob} onChange={(e) => update({ partnerDob: e.target.value })} max={new Date().toISOString().slice(0, 10)} />
                </div>
                <div className="field">
                  <label htmlFor="ptob">Their time of birth</label>
                  <input id="ptob" type="time" value={form.partnerTob} onChange={(e) => update({ partnerTob: e.target.value })} />
                </div>
                <div className="field">
                  <label htmlFor="pplace">Their place of birth</label>
                  <input id="pplace" list="cities" value={form.partnerPlace} onChange={(e) => update({ partnerPlace: e.target.value })} />
                </div>
              </div>
              <p className="small muted">Compatibility is read from both Moons (nakshatra and rashi), not from sun signs. Exact time improves accuracy.</p>
            </>
          )}

          <div className="row between" style={{ marginTop: '1.4rem' }}>
            <div>
              <div className="orb-label">This reading</div>
              <div className="price">{money(type.price)}</div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg" disabled={busy}>
              {busy ? 'The Oracle is reading…' : type.free ? 'Reveal my free reading →' : `Pay ${money(type.price)} & reveal →`}
            </button>
          </div>
          <p className="small muted" style={{ marginTop: '0.8rem', marginBottom: 0 }}>
            Your details are stored only against this browser session so you can revisit the reading. No card details are ever collected.
          </p>
        </form>

        <aside className="flow-side">
          <div className="card card-tight">
            <div className="orb-label">Included</div>
            <ul className="include-list" style={{ marginTop: '0.7rem' }}>
              <li>{type.cards ? `${type.cards} drawn cards with positions` : 'Your computed planetary positions'}</li>
              <li>Energy analysis in plain language</li>
              <li>Past · Present · Future timeline</li>
              <li>Practical advice, Do&apos;s &amp; Don&apos;ts</li>
              <li>Closing message + honest disclaimer</li>
            </ul>
          </div>

          {numbers && (
            <div className="card card-tight">
              <div className="orb-label">Your numbers so far</div>
              <div className="preview-nums" style={{ marginTop: '0.7rem' }}>
                <div className="preview-num"><strong>{numbers.driver}</strong><span>Driver</span></div>
                <div className="preview-num"><strong>{numbers.conductor}</strong><span>Conductor</span></div>
                <div className="preview-num"><strong>{numbers.kua}</strong><span>Kua</span></div>
              </div>
              <div style={{ marginTop: '0.9rem' }}>
                <LoShuGrid dob={form.dob} driver={numbers.driver} conductor={numbers.conductor} kua={numbers.kua} compact />
              </div>
              <p className="small muted" style={{ marginTop: '0.7rem', marginBottom: 0 }}>
                Driver = birth day reduced. Conductor = full date reduced. Kua uses the year with the +4 / 11− rule.
              </p>
            </div>
          )}

          <div className="notice notice-warn">
            <strong>Honesty first.</strong> Readings are interpretive, not predictive fact. Nothing here replaces a doctor,
            lawyer or financial adviser — and nothing here decides your life for you.
          </div>
        </aside>
      </div>

      {paying && (
        <PaymentModal
          type={type}
          onClose={() => setPaying(false)}
          onPaid={async (orderId) => { setPaying(false); setPaidOrderId(orderId); await generate(orderId); }}
        />
      )}
    </div>
  );
}
