import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../App.jsx';
import { money } from '../lib/api.js';

export default function Pricing() {
  const { catalog, sections, payment } = useApp();

  const grouped = useMemo(() => sections.map((s) => {
    const items = catalog.filter((r) => r.section === s.id);
    const cats = [...new Set(items.map((r) => r.category))];
    return { ...s, items, cats };
  }), [catalog, sections]);

  return (
    <div className="wrap fade-in">
      <section style={{ paddingBottom: '1.5rem' }}>
        <div className="eyebrow">Transparent, no surprises</div>
        <h1 style={{ fontSize: 'clamp(2.1rem, 4vw, 3.2rem)' }}>Pricing</h1>
        <p style={{ maxWidth: '62ch' }}>
          Micro-readings begin at ₹49. Focused topic readings sit between ₹99 and ₹299, and the complete life
          overview is ₹499. Free readings stay free — no card, no catch.
        </p>
      </section>

      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        {[
          ['Micro', '₹49', 'One card, one honest pulse check.'],
          ['Focus', '₹99–149', 'One topic, read properly.'],
          ['Deep', '₹179–299', 'Multi-card spreads and full chart work.'],
          ['Premium', '₹399–499', 'Complete life overview with remedies.']
        ].map(([label, price, blurb]) => (
          <div className="card card-tight" key={label}>
            <div className="orb-label">{label}</div>
            <div className="price" style={{ fontSize: '1.8rem' }}>{price}</div>
            <p className="small muted" style={{ margin: 0 }}>{blurb}</p>
          </div>
        ))}
      </div>

      <div className="price-groups">
        {grouped.map((s) => (
          <div className="card price-group" key={s.id}>
            <div className="eyebrow">{s.symbol} {s.name}</div>
            {s.cats.map((cat) => (
              <div key={cat} style={{ marginBottom: '1.2rem' }}>
                <h4 style={{ fontFamily: 'var(--body)', fontSize: '0.78rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--faint)' }}>{cat}</h4>
                {s.items.filter((r) => r.category === cat).map((r) => (
                  <div className="price-row" key={r.id}>
                    <Link to={`/read/${r.id}`} style={{ color: 'var(--soft)' }}>
                      {r.name}
                      <span className="small" style={{ display: 'block', color: 'var(--faint)' }}>{r.cards ? `${r.cards} cards · ` : ''}{r.blurb}</span>
                    </Link>
                    <span className={`amt ${r.free ? 'free' : ''}`}>{money(r.price)}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      <section className="section">
        <div className="grid-2">
          <div className="card">
            <div className="eyebrow">Payments</div>
            <h2 style={{ fontSize: '1.8rem' }}>UPI only, and only when you choose</h2>
            <p>
              Every paid reading creates an order first. Scan the QR or use the UPI link, then paste the reference
              number to unlock. One payment unlocks exactly one reading, and the order stays reusable if something
              interrupts you.
            </p>
            <div className="upi-line" style={{ marginBlock: '1rem' }}>
              <span>UPI ID · <code>{payment?.upiId || 'krishnahrrochani@okhdfcbank'}</code></span>
              <a className="btn btn-quiet btn-sm" href={`upi://pay?pa=${payment?.upiId || 'krishnahrrochani@okhdfcbank'}&pn=${encodeURIComponent(payment?.payee || 'Krishna HR Rochani')}&cu=INR`}>Open UPI</a>
            </div>
            <p className="small muted">
              Payee: {payment?.payee || 'Krishna HR Rochani'} · {payment?.bank || 'IDBI Bank 0538'}.
              Payments go directly to the astrologer over UPI; no card data is collected or stored.
              {payment?.mode === 'demo' ? ' This build runs in demo verification mode so the flow can be tested end-to-end.' : ' Orders are verified manually before unlocking.'}
            </p>
          </div>
          <div className="card card-plain">
            <div className="eyebrow">Refunds &amp; fairness</div>
            <h2 style={{ fontSize: '1.8rem' }}>If the reading misses</h2>
            <p>
              If a paid reading fails to generate, the order is not consumed — retry it at any time, or ask for the
              same reading again on the same order. Readings are interpretive services, so once a personalised
              reading has been delivered it cannot be refunded, but a broken delivery is always made good.
            </p>
            <ul className="include-list">
              <li>No subscription, no auto-renewal, no hidden fees.</li>
              <li>Free readings never require payment details.</li>
              <li>Your details stay in this session; nothing is sold or shared.</li>
            </ul>
            <Link to="/readings" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>Choose a reading</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
