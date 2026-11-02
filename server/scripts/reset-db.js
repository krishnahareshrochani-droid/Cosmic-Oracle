import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'cosmic-oracle.db');
for (const suffix of ['', '-wal', '-shm']) {
  const file = dbPath + suffix;
  if (fs.existsSync(file)) { fs.unlinkSync(file); console.log('removed', file); }
}
await import('../db.js');
console.log('Fresh Cosmic Oracle database initialised at', dbPath);
