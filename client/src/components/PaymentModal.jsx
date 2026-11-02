import { useEffect, useState } from 'react';
import { api, money } from '../lib/api.js';

export default function PaymentModal({ type, onClose, onPaid }) {
  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [utr, setUtr] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await api.createOrder(type.id);
        if (!alive) return;
        setOrder(res.order);
        setPayment(res.payment);
      } catch (err) {
        if (alive) setError(err.message);
      }
    })();
    return () => { alive = false; };
  }, [type.id]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  const copyUpi = async () => {
    try {
      await navigator.clipboard.writeText(payment.upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError('Copy failed — long-press the UPI ID to copy it manually.');
    }
  };

  const verify = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await api.verifyOrder(order.id, utr);
      if (res.order.status === 'paid') onPaid(order.id);
      else setError(res.message || 'Payment recorded. It will be verified shortly.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={`Pay for ${type.name}`} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        <div className="eyebrow" style={{ marginBottom: '0.4rem' }}>Secure UPI checkout</div>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '0.2rem' }}>{type.name}</h2>
        <p style={{ color: 'var(--faint)', fontSize: '0.9rem' }}>{type.blurb}</p>

        <div className="panel" style={{ marginBlock: '1rem', textAlign: 'center' }}>
          <div className="orb-label">Amount to pay</div>
          <div className="price" style={{ fontSize: '2.4rem' }}>{money(type.price)}</div>
        </div>

        {error && <div className="notice notice-error" style={{ marginBottom: '0.9rem' }}>{error}</div>}

        {!payment && !error && (
          <div className="loader"><div className="spinner" /><span className="loader-text">Preparing your order…</span></div>
        )}

        {payment && (
          <>
            <div className="qr-box">
              <img src={payment.qrImage} alt={`UPI QR code for ${payment.payee}`} />
            </div>
            <p className="center muted small" style={{ marginTop: 0 }}>Scan with any UPI app · {payment.bank}</p>

            <div className="upi-line" style={{ marginBottom: '1rem' }}>
              <span>UPI ID · <code>{payment.upiId}</code></span>
              <button className="btn btn-quiet btn-sm" onClick={copyUpi} type="button">{copied ? 'Copied ✓' : 'Copy'}</button>
            </div>

            {order?.upiLink && (
              <a className="btn btn-primary btn-block" href={order.upiLink} style={{ marginBottom: '1rem' }}>
                Open UPI app with ₹{type.price} prefilled
              </a>
            )}

            <ol className="pay-steps">
              <li>Pay {money(type.price)} to the QR or UPI ID above.</li>
              <li>Copy the UTR / reference number from your payment app.</li>
              <li>Paste it below to unlock your reading instantly.</li>
            </ol>

            <div className="field">
              <label htmlFor="utr">UPI reference / UTR</label>
              <input
                id="utr"
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
                placeholder="e.g. 416238901234"
                autoComplete="off"
                inputMode="numeric"
              />
              <span className="hint">Found under the payment details in GPay, PhonePe, Paytm or your bank app.</span>
            </div>

            <button className="btn btn-primary btn-block" onClick={verify} disabled={busy || utr.trim().length < 8}>
              {busy ? 'Verifying…' : `I have paid ${money(type.price)} — unlock reading`}
            </button>

            {payment.mode === 'demo' && (
              <div className="notice notice-info" style={{ marginTop: '0.9rem' }}>
                <strong>Demo checkout.</strong> This build verifies any reference of 8+ characters instantly so the full
                flow can be tested. Set <span className="kbd">PAYMENT_MODE=manual</span> to hold orders for manual approval instead.
              </div>
            )}

            <p className="small muted" style={{ marginTop: '0.9rem', marginBottom: 0 }}>
              Payments go directly to {payment.payee} ({payment.bank}) over UPI. Cosmic Oracle never stores card details.
              One payment unlocks one reading. If anything fails, the same order can be reused — just refresh this page.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
