/**
 * Full engine smoke test: every catalogue item must produce a reading that
 * contains the required sections (cards/planets, energy, timeline, advice,
 * do's & don'ts, closing and disclaimer).
 */
import { CATALOG } from '../data/catalog.js';
import { generateReading } from '../engine/reading.js';

const profile = {
  name: 'Krishna HR Rochani',
  dob: '2007-05-24',
  tob: '10:30',
  place: 'Pune',
  gender: 'male',
  mobile: '9876543210',
  question: 'Will my career grow this year?',
  partner: { name: 'Radhika', dob: '2008-02-14', tob: '06:15', place: 'Mumbai', gender: 'female' }
};

const required = ['energy', 'timeline', 'advice', 'dosdonts', 'closing', 'disclaimer'];
let failures = 0;

for (const type of CATALOG) {
  try {
    const reading = generateReading(type.id, profile);
    const kinds = reading.sections.map((s) => s.kind);
    const missing = required.filter((k) => !kinds.includes(k));
    if (!['cards', 'planets', 'numerology-grid'].some((k) => kinds.includes(k))) missing.push('cards|planets|grid');
    if (missing.length) {
      failures += 1;
      console.log(`✗ ${type.id} — missing ${missing.join(', ')}`);
    } else {
      console.log(`✓ ${type.id} (${reading.sections.length} sections)`);
    }
  } catch (err) {
    failures += 1;
    console.log(`✗ ${type.id} — ${err.message}`);
  }
}

console.log(`\n${CATALOG.length - failures}/${CATALOG.length} readings passed.`);
process.exit(failures ? 1 : 0);
