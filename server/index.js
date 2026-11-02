import express from 'express';
import cookieParser from 'cookie-parser';
import crypto from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { CONFIG } from './config.js';
import { CATALOG, SECTIONS, getReading, PRICE_TIERS } from './data/catalog.js';
import { CITIES } from './data/cities.js';
import { db, touchVisitor, nowIso, logEvent, saveProfile } from './db.js';
import { generateReading } from './engine/reading.js';
import { buildNumeroscope } from './engine/numerology.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json({ limit: '200kb' }));
app.use(cookieParser());
app.disable('x-powered-by');

/* ------------------------------ visitor ------------------------------ */

app.use((req, res, next) => {
  let vid = req.cookies?.co_visitor;
  if (!vid || vid.length < 8) {
    vid = crypto.randomUUID();
    res.cookie('co_visitor', vid, {
      maxAge: 1000 * 60 * 60 * 24 * 365,
      httpOnly: true,
      sameSite: 'lax',
      secure: false
    });
  }
  req.visitorId = vid;
  try {
    req.visitor = touchVisitor(vid);
  } catch {
    req.visitor = { id: vid };
  }
  next();
});

const json = (res, status, body) => res.status(status).json(body);

const wrap = (fn) => (req, res, next) => {
  try {
    fn(req, res, next);
  } catch (err) {
    const status = err.status || 500;
    if (status >= 500) console.error(err);
    json(res, status, { error: err.message || 'Something went wrong in the cosmos.', missing: err.missing });
  }
};

const getVisitorReadings = (id) =>
  db.prepare('SELECT id, type_id, type_name, price, payload, created_at FROM readings WHERE visitor_id = ? ORDER BY created_at DESC').all(id);

const summarise = (row) => {
  const payload = JSON.parse(row.payload);
  return {
    id: row.id,
    typeId: row.type_id,
    typeName: row.type_name,
    price: row.price,
    createdAt: row.created_at,
    title: payload.title,
    subtitle: payload.subtitle,
    question: payload.question,
    facts: payload.facts,
    subject: payload.subject
  };
};

/* -------------------------------- meta -------------------------------- */

app.get('/api/health', (req, res) => json(res, 200, { ok: true, mode: CONFIG.paymentMode, time: nowIso() }));

app.get('/api/catalog', (req, res) => json(res, 200, {
  sections: SECTIONS,
  catalog: CATALOG,
  tiers: PRICE_TIERS,
  payment: { ...CONFIG.upi, mode: CONFIG.paymentMode }
}));

app.get('/api/cities', (req, res) => json(res, 200, { cities: CITIES }));

app.get('/api/me', (req, res) => {
  const readings = db.prepare('SELECT COUNT(*) AS c FROM readings WHERE visitor_id = ?').get(req.visitorId).c;
  const orders = db.prepare('SELECT COUNT(*) AS c, COALESCE(SUM(amount),0) AS total FROM orders WHERE visitor_id = ? AND status = ?').get(req.visitorId, 'paid');
  json(res, 200, {
    visitor: { id: req.visitorId, name: req.visitor?.name || null, createdAt: req.visitor?.created_at },
    readings,
    paidOrders: orders.c,
    totalSpent: orders.total,
    paymentMode: CONFIG.paymentMode,
    upi: CONFIG.upi
  });
});

app.post('/api/me/name', wrap((req, res) => {
  const name = String(req.body?.name || '').trim().slice(0, 60);
  if (!name) return json(res, 422, { error: 'A name helps the Oracle address you properly.' });
  touchVisitor(req.visitorId, name);
  json(res, 200, { ok: true, name });
}));

/* ----------------------------- numerology ----------------------------- */

app.post('/api/numerology', wrap((req, res) => {
  const { name, dob, gender } = req.body || {};
  if (!name || !dob) return json(res, 422, { error: 'Name and date of birth are needed for the numeroscope.' });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) return json(res, 422, { error: 'Date of birth must be in YYYY-MM-DD format.' });
  const scope = buildNumeroscope({ name, dob, gender: gender || 'female' });
  saveProfile(req.visitorId, { name, dob, gender, tob: null, place: null });
  logEvent(req.visitorId, 'numerology', { dob });
  json(res, 200, { numeroscope: scope });
}));

/* -------------------------------- orders ------------------------------- */

function upiLink(amount, note) {
  const params = new URLSearchParams({
    pa: CONFIG.upi.upiId,
    pn: CONFIG.upi.payee,
    am: String(amount),
    cu: CONFIG.upi.currency,
    tn: note.slice(0, 50)
  });
  return `upi://pay?${params.toString()}`;
}

app.post('/api/orders', wrap((req, res) => {
  const type = getReading(req.body?.typeId);
  if (!type) return json(res, 404, { error: 'That reading does not exist.' });
  if (type.free) return json(res, 400, { error: 'This reading is free — no payment needed.' });

  const id = crypto.randomUUID();
  const link = upiLink(type.price, `Cosmic Oracle - ${type.name}`);
  db.prepare(`INSERT INTO orders (id, visitor_id, type_id, type_name, amount, currency, status, upi_link, created_at)
              VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?)`)
    .run(id, req.visitorId, type.id, type.name, type.price, CONFIG.upi.currency, link, nowIso());
  logEvent(req.visitorId, 'order_created', { typeId: type.id, amount: type.price });

  json(res, 201, {
    order: {
      id,
      typeId: type.id,
      typeName: type.name,
      amount: type.price,
      currency: CONFIG.upi.currency,
      status: 'pending',
      upiLink: link,
      createdAt: nowIso()
    },
    payment: { ...CONFIG.upi, mode: CONFIG.paymentMode }
  });
}));

app.get('/api/orders/:id', wrap((req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE id = ? AND visitor_id = ?').get(req.params.id, req.visitorId);
  if (!order) return json(res, 404, { error: 'Order not found.' });
  json(res, 200, { order });
}));

/**
 * UTR / reference verification.
 * In demo mode a well-formed reference marks the order paid so the experience can be
 * tested end-to-end. In manual mode the order stays pending until an admin approves it.
 */
app.post('/api/orders/:id/verify', wrap((req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE id = ? AND visitor_id = ?').get(req.params.id, req.visitorId);
  if (!order) return json(res, 404, { error: 'Order not found.' });
  if (order.status === 'paid') return json(res, 200, { order, already: true });

  const utr = String(req.body?.utr || '').replace(/\s/g, '');
  if (CONFIG.paymentMode === 'demo') {
    if (utr.length < 8) return json(res, 422, { error: 'Enter the UPI reference / UTR (at least 8 characters) shown in your payment app.' });
    db.prepare('UPDATE orders SET status = ?, utr = ?, paid_at = ? WHERE id = ?').run('paid', utr, nowIso(), order.id);
    logEvent(req.visitorId, 'order_paid_demo', { orderId: order.id, amount: order.amount });
    const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(order.id);
    return json(res, 200, { order: updated, verified: true, mode: 'demo' });
  }

  db.prepare('UPDATE orders SET utr = ? WHERE id = ?').run(utr || null, order.id);
  json(res, 200, { order: db.prepare('SELECT * FROM orders WHERE id = ?').get(order.id), verified: false, mode: 'manual', message: 'Payment captured for manual verification. Your reading unlocks once confirmed.' });
}));

/* ------------------------------- readings ------------------------------ */

app.post('/api/readings', wrap((req, res) => {
  const { typeId, orderId } = req.body || {};
  const profile = req.body?.profile || {};
  const type = getReading(typeId);
  if (!type) return json(res, 404, { error: 'That reading does not exist.' });

  if (!type.free) {
    if (!orderId) return json(res, 402, { error: 'This reading needs a completed payment.', code: 'PAYMENT_REQUIRED' });
    const order = db.prepare('SELECT * FROM orders WHERE id = ? AND visitor_id = ?').get(orderId, req.visitorId);
    if (!order) return json(res, 404, { error: 'Order not found for this session.' });
    if (order.status !== 'paid') return json(res, 402, { error: 'Payment for this order is still pending.', code: 'PAYMENT_PENDING' });
    if (order.type_id !== type.id) return json(res, 400, { error: 'This payment belongs to a different reading.' });
    const used = db.prepare('SELECT id FROM readings WHERE order_id = ?').get(order.id);
    if (used) return json(res, 409, { error: 'This payment has already been used for a reading.', code: 'ORDER_USED' });
  } else {
    const today = db.prepare("SELECT COUNT(*) AS c FROM readings WHERE visitor_id = ? AND price = 0 AND created_at > ?")
      .get(req.visitorId, new Date(Date.now() - 86400000).toISOString()).c;
    if (today >= CONFIG.freeDailyLimit) {
      return json(res, 429, { error: 'You have reached today\'s free-reading limit. The Oracle needs rest too — come back tomorrow, or unlock a deeper paid reading.' });
    }
  }

  const payload = generateReading(typeId, profile);
  const id = crypto.randomUUID();
  db.prepare(`INSERT INTO readings (id, visitor_id, order_id, type_id, type_name, price, payload, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(id, req.visitorId, orderId || null, type.id, type.name, type.price, JSON.stringify(payload), nowIso());
  saveProfile(req.visitorId, profile);
  logEvent(req.visitorId, 'reading_generated', { typeId: type.id, price: type.price });

  json(res, 201, { id, price: type.price, reading: payload, createdAt: nowIso() });
}));

app.get('/api/readings', wrap((req, res) => {
  const rows = getVisitorReadings(req.visitorId);
  json(res, 200, { readings: rows.map(summarise), paid: rows.filter((r) => r.price > 0).length, free: rows.filter((r) => r.price === 0).length });
}));

app.get('/api/readings/:id', wrap((req, res) => {
  const row = db.prepare('SELECT * FROM readings WHERE id = ?').get(req.params.id);
  if (!row) return json(res, 404, { error: 'Reading not found.' });
  json(res, 200, { id: row.id, createdAt: row.created_at, price: row.price, reading: JSON.parse(row.payload), owner: row.visitor_id === req.visitorId });
}));

app.delete('/api/readings/:id', wrap((req, res) => {
  const info = db.prepare('DELETE FROM readings WHERE id = ? AND visitor_id = ?').run(req.params.id, req.visitorId);
  json(res, 200, { deleted: info.changes });
}));

/* -------------------------------- admin -------------------------------- */

app.get('/api/admin/stats', wrap((req, res) => {
  if (req.query.key !== CONFIG.adminKey) return json(res, 401, { error: 'Not authorised.' });
  const stats = {
    visitors: db.prepare('SELECT COUNT(*) c FROM visitors').get().c,
    readings: db.prepare('SELECT COUNT(*) c FROM readings').get().c,
    paidReadings: db.prepare('SELECT COUNT(*) c FROM readings WHERE price > 0').get().c,
    revenue: db.prepare("SELECT COALESCE(SUM(amount),0) c FROM orders WHERE status='paid'").get().c,
    pendingOrders: db.prepare("SELECT COUNT(*) c FROM orders WHERE status='pending'").get().c,
    byType: db.prepare('SELECT type_name, COUNT(*) c, SUM(price) revenue FROM readings GROUP BY type_id ORDER BY c DESC LIMIT 10').all(),
    recentOrders: db.prepare('SELECT id, type_name, amount, status, created_at FROM orders ORDER BY created_at DESC LIMIT 10').all()
  };
  json(res, 200, stats);
}));

app.post('/api/admin/orders/:id/approve', wrap((req, res) => {
  if (req.query.key !== CONFIG.adminKey) return json(res, 401, { error: 'Not authorised.' });
  db.prepare("UPDATE orders SET status='paid', paid_at=? WHERE id=?").run(nowIso(), req.params.id);
  json(res, 200, { ok: true });
}));

/* ------------------------------ static app ----------------------------- */

const dist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(dist, 'index.html'));
  });
}

app.use((req, res) => json(res, 404, { error: 'Path not found.' }));

// Central error handler: always answer JSON for API failures.
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  if (err?.type === 'entity.parse.failed') return json(res, 400, { error: 'Malformed request body.' });
  console.error(err);
  return json(res, err.status || 500, { error: err.status ? err.message : 'The cosmos hiccupped. Please try again in a moment.' });
});

app.listen(CONFIG.port, '0.0.0.0', () => {
  console.log(`🔮 Cosmic Oracle API listening on http://0.0.0.0:${CONFIG.port} (payments: ${CONFIG.paymentMode})`);
});

export default app;
