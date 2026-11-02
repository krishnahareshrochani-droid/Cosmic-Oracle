import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_DIR = process.env.DB_DIR || path.join(__dirname, 'data');
const DB_PATH = process.env.DB_PATH || path.join(DB_DIR, 'cosmic-oracle.db');

if (DB_PATH !== ':memory:') fs.mkdirSync(DB_DIR, { recursive: true });

export const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS visitors (
  id          TEXT PRIMARY KEY,
  name        TEXT,
  created_at  TEXT NOT NULL,
  last_seen   TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS profiles (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  visitor_id  TEXT NOT NULL REFERENCES visitors(id) ON DELETE CASCADE,
  name        TEXT,
  dob         TEXT,
  gender      TEXT,
  tob         TEXT,
  place       TEXT,
  created_at  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id          TEXT PRIMARY KEY,
  visitor_id  TEXT NOT NULL REFERENCES visitors(id) ON DELETE CASCADE,
  type_id     TEXT NOT NULL,
  type_name   TEXT NOT NULL,
  amount      INTEGER NOT NULL,
  currency    TEXT NOT NULL DEFAULT 'INR',
  status      TEXT NOT NULL DEFAULT 'pending',
  utr         TEXT,
  upi_link    TEXT,
  created_at  TEXT NOT NULL,
  paid_at     TEXT
);

CREATE TABLE IF NOT EXISTS readings (
  id          TEXT PRIMARY KEY,
  visitor_id  TEXT NOT NULL REFERENCES visitors(id) ON DELETE CASCADE,
  order_id    TEXT,
  type_id     TEXT NOT NULL,
  type_name   TEXT NOT NULL,
  price       INTEGER NOT NULL DEFAULT 0,
  payload     TEXT NOT NULL,
  created_at  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS events (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  visitor_id  TEXT,
  name        TEXT NOT NULL,
  meta        TEXT,
  created_at  TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_readings_visitor ON readings(visitor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_visitor ON orders(visitor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_visitor ON profiles(visitor_id, created_at DESC);
`);

export const nowIso = () => new Date().toISOString();

export function touchVisitor(id, name) {
  const now = nowIso();
  const existing = db.prepare('SELECT * FROM visitors WHERE id = ?').get(id);
  if (existing) {
    db.prepare('UPDATE visitors SET last_seen = ?, name = COALESCE(?, name) WHERE id = ?').run(now, name || null, id);
    return db.prepare('SELECT * FROM visitors WHERE id = ?').get(id);
  }
  db.prepare('INSERT INTO visitors (id, name, created_at, last_seen) VALUES (?, ?, ?, ?)').run(id, name || null, now, now);
  return db.prepare('SELECT * FROM visitors WHERE id = ?').get(id);
}

export function logEvent(visitorId, name, meta) {
  try {
    db.prepare('INSERT INTO events (visitor_id, name, meta, created_at) VALUES (?, ?, ?, ?)')
      .run(visitorId || null, name, meta ? JSON.stringify(meta) : null, nowIso());
  } catch {
    /* events are best-effort */
  }
}

export const saveProfile = (visitorId, profile) => {
  if (!profile?.dob) return null;
  const info = db.prepare(`INSERT INTO profiles (visitor_id, name, dob, gender, tob, place, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`)
    .run(visitorId, profile.name || null, profile.dob, profile.gender || 'female', profile.tob || null, profile.place || null, nowIso());
  return info.lastInsertRowid;
};

export const DB_FILE = DB_PATH;
