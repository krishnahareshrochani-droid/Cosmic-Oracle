import combos from '../data/driver-conductor.json' with { type: 'json' };
import {
  PLANETS,
  NUMBER_PERSONALITY,
  PERSONAL_YEAR,
  MISSING_NUMBER,
  REPEATED_NUMBER,
  REMEDIES,
  LO_SHU_PLANES,
  LO_SHU_GRID,
  KUA_GROUPS,
  PLANET_FRIENDSHIP,
  NAME_LETTER_VALUES,
  AUSPICIOUS_NAME_NUMBERS,
  UNFAVOURABLE_NAME_NUMBERS,
  KARMIC_NUMBERS,
  LO_SHU_MEANING
} from '../data/numerology.js';

/* ------------------------------------------------------------------ */
/* Core arithmetic                                                     */
/* ------------------------------------------------------------------ */

export const digitsOf = (value) => String(value).replace(/\D/g, '').split('').map(Number);

export function reduceNumber(value) {
  let n = Math.abs(Number(value) || 0);
  while (n > 9) {
    n = String(n).split('').reduce((sum, d) => sum + Number(d), 0);
  }
  return n;
}

/** Driver (Mulank) = single digit of the day of birth. */
export const driverNumber = (day) => reduceNumber(day);

/** Conductor (Bhagyank) = single digit of the complete date of birth. */
export const conductorNumber = (dob) => reduceNumber(digitsOf(dob).reduce((a, b) => a + b, 0));

/**
 * Kua number following the Cosmic Oracle methodology (full birth-year method):
 *  - reduce the birth year to one digit
 *  - females: +4  ·  males: 11 − digit
 *  - reduce again to a single digit
 * The alternate "last two digits" method is computed too, for transparency:
 * females +5 (+6 from 2000 onward), males 10 − digit; both routes agree.
 */
export function kuaNumber(year, gender = 'female') {
  const yearDigit = reduceNumber(digitsOf(year).reduce((a, b) => a + b, 0));
  const twoDigit = reduceNumber(Number(String(year).slice(-2)));
  const isFemale = String(gender).toLowerCase().startsWith('f');
  const raw = isFemale ? 4 + yearDigit : 11 - yearDigit;
  const kua = raw < 1 ? reduceNumber(raw + 9) : reduceNumber(raw);
  const altRaw = isFemale
    ? (Number(year) >= 2000 ? 6 : 5) + twoDigit
    : (Number(year) >= 2000 ? 9 : 10) - twoDigit;
  const alternateKua = altRaw < 1 ? reduceNumber(altRaw + 9) : reduceNumber(altRaw);
  return {
    yearDigit,
    raw,
    kua,
    alternateKua,
    method: isFemale
      ? `Year ${year} → ${yearDigit}; female rule ${yearDigit} + 4 = ${raw} → ${kua}`
      : `Year ${year} → ${yearDigit}; male rule 11 − ${yearDigit} = ${raw} → ${kua}`,
    alternateMethod: isFemale
      ? `Last-two-digit method: ${twoDigit} + ${Number(year) >= 2000 ? 6 : 5} = ${altRaw} → ${alternateKua}`
      : `Last-two-digit method: ${Number(year) >= 2000 ? 9 : 10} − ${twoDigit} = ${altRaw} → ${alternateKua}`,
    note:
      kua === 5
        ? 'Kua 5 sits at the centre of the Lo Shu. Classically, Kua 5 males are read through 2 and Kua 5 females through 8 for direction work.'
        : null,
    group: KUA_GROUPS[[1, 3, 4, 9].includes(kua) ? 'east' : 'west']
  };
}

const parseDob = (dob) => {
  if (dob instanceof Date) {
    return { d: dob.getUTCDate(), m: dob.getUTCMonth() + 1, y: dob.getUTCFullYear() };
  }
  const [y, m, d] = String(dob).split('-').map(Number);
  return { d, m, y };
};

/** Personal Year with the 5 February boundary rule. */
export function personalYear(dob, onDate = new Date()) {
  const { d, m } = parseDob(dob);
  const on = onDate instanceof Date ? onDate : new Date(onDate);
  const effectiveYear = on.getUTCMonth() + 1 > 2 || (on.getUTCMonth() + 1 === 2 && on.getUTCDate() >= 5)
    ? on.getUTCFullYear()
    : on.getUTCFullYear() - 1;
  const total = d + m + digitsOf(effectiveYear).reduce((a, b) => a + b, 0);
  return {
    year: effectiveYear,
    number: reduceNumber(total),
    startedOn: `5 February ${effectiveYear}`,
    workings: `${d} + ${m} + ${digitsOf(effectiveYear).join(' + ')} = ${total} → ${reduceNumber(total)}`
  };
}

export function personalMonth(dob, month, year, onDate) {
  const py = personalYear(dob, new Date(Date.UTC(year, month - 1, 15)));
  const pm = reduceNumber(py.number + reduceNumber(month));
  return { month, year, personalYear: py.number, number: pm, workings: `${py.number} + ${month} = ${py.number + month} → ${pm}` };
}

export function personalDay(dob, date) {
  const on = new Date(date);
  const py = personalYear(dob, on);
  const pm = personalMonth(dob, on.getUTCMonth() + 1, on.getUTCFullYear());
  const daySum = reduceNumber(digitsOf(on.getUTCDate()).reduce((a, b) => a + b, 0));
  const day = reduceNumber(py.number + pm.number + daySum);
  return { date: on.toISOString().slice(0, 10), personalYear: py.number, personalMonth: pm.number, number: day };
}

/* ------------------------------------------------------------------ */
/* Name numerology                                                     */
/* ------------------------------------------------------------------ */

export function nameNumber(name) {
  const letters = String(name || '').toUpperCase().replace(/[^A-Z]/g, '').split('');
  const rows = letters.map((l) => ({ letter: l, value: NAME_LETTER_VALUES[l] ?? 0 }));
  const total = rows.reduce((a, r) => a + r.value, 0);
  return { rows, total, number: reduceNumber(total) };
}

/* ------------------------------------------------------------------ */
/* Lo Shu grid                                                         */
/* ------------------------------------------------------------------ */

export function loShuGrid({ dob, day, gender, driver, conductor, kua }) {
  const rawDigits = digitsOf(dob).filter((d) => d !== 0);
  const rawText = String(dob);
  const counts = Object.fromEntries(Array.from({ length: 9 }, (_, i) => [i + 1, 0]));
  rawDigits.forEach((d) => { counts[d] += 1; });

  const d = driver ?? driverNumber(day);
  const c = conductor ?? conductorNumber(dob);
  const k = kua ?? kuaNumber(parseDob(dob).y, gender).kua;

  // Conductor and Kua are always placed as extra digits.
  counts[c] += 1;
  counts[k] += 1;

  // Driver is not placed again if it is already a raw digit (single digit day / 10 / 20 / 30).
  const dayValue = Number(day ?? parseDob(dob).d);
  const driverAlreadyRepresented = dayValue < 10 || [10, 20, 30].includes(dayValue);
  if (!driverAlreadyRepresented) counts[d] += 1;

  const cells = LO_SHU_GRID.flat().map((num) => ({
    number: num,
    count: counts[num],
    ...LO_SHU_MEANING[num]
  }));
  const grid = LO_SHU_GRID.map((row) => row.map((num) => cells.find((c2) => c2.number === num)));

  const missing = Object.keys(counts).map(Number).filter((n) => counts[n] === 0);
  const repeated = Object.keys(counts).map(Number).filter((n) => counts[n] >= 2)
    .map((n) => ({ number: n, count: counts[n], label: REPEATED_NUMBER[n].label, meaning: REPEATED_NUMBER[n].meanings[counts[n]] ?? null }));

  const planes = LO_SHU_PLANES.map((p) => ({
    ...p,
    present: p.cells.every((cell) => counts[cell] > 0),
    filled: p.cells.filter((cell) => counts[cell] > 0).length
  }));

  return {
    grid,
    counts,
    cells,
    rawDigits,
    rawText,
    missing,
    repeated,
    planes,
    driver: d,
    conductor: c,
    kua: k,
    notes: [
      'Zeros are omitted from the Lo Shu grid.',
      'The Conductor and Kua are placed as extra digits; the Driver is only placed again when the birth day is not already a single digit.',
      driverAlreadyRepresented ? 'Your birth day already carries the Driver digit, so it is not repeated.' : 'Your Driver digit is added as an extra placement.'
    ]
  };
}

/* ------------------------------------------------------------------ */
/* Interpretation layers                                               */
/* ------------------------------------------------------------------ */

export function comboReading(driver, conductor) {
  const key = `${driver}${conductor}`;
  const combo = combos[key];
  if (!combo) return null;
  const friendship = PLANET_FRIENDSHIP[driver];
  const relation = friendship.friends.includes(conductor)
    ? 'friend'
    : friendship.enemies.includes(conductor)
      ? 'challenging'
      : 'neutral';
  return {
    key,
    stars: combo.stars,
    theme: combo.theme,
    relation,
    driverPlanet: PLANETS[driver].planet,
    conductorPlanet: PLANETS[conductor].planet,
    verdict:
      combo.stars >= 4.5 ? 'An unusually supportive pairing — you and your destiny number move in the same direction.'
        : combo.stars >= 3.5 ? 'A strong pairing with plenty of lift when you use both planets deliberately.'
          : combo.stars >= 2.5 ? 'A workable pairing — success comes from planned, patient execution rather than luck.'
            : combo.stars >= 1.5 ? 'A mixed pairing: the friction is real, but it is also where your growth lives.'
              : 'A demanding pairing. This is not a curse — it is a chart that asks for maturity, patience and remedial discipline.'
  };
}

export function buildRemedies({ grid, driver, conductor, gender }) {
  const set = new Set(grid.missing);
  const picked = [];
  for (const item of REMEDIES.missing) {
    const m = item.condition.match(/(\d)\s*(?:and|,)?\s*(\d)?/);
    if (!m) continue;
    const numbers = item.condition.match(/\d/g)?.map(Number) ?? [];
    if (item.condition.includes('and') && numbers.length >= 2 && numbers.every((n) => set.has(n))) picked.push(item);
    else if (numbers.length === 1 && set.has(numbers[0])) picked.push(item);
  }
  const notes = [];
  if (grid.missing.includes(1) && (driver === 8 || conductor === 8)) {
    notes.push('You are missing 1 but carry an 8 — skip the traditional "offer water to the Sun" remedy and use hydration plus sunrise walks instead.');
  }
  if (grid.missing.includes(5) && (driver === 3 || conductor === 3)) {
    notes.push('Budha Pyra is not advised for a 3 Driver/Conductor chart even though 5 is missing.');
  }
  return { picked, notes };
}

export function repeatedReading(grid) {
  return grid.repeated.map((r) => ({
    ...r,
    text: r.meaning || `Number ${r.number} appears ${r.count} times — read it as an amplified theme in your life.`
  }));
}

export function missingReading(grid) {
  return grid.missing.map((n) => ({ number: n, ...MISSING_NUMBER[n], planet: PLANETS[n] }));
}

/* ------------------------------------------------------------------ */
/* Full numeroscope                                                    */
/* ------------------------------------------------------------------ */

export function buildNumeroscope({ name = 'Seeker', dob, gender = 'female', onDate = new Date() }) {
  if (!dob) throw new Error('Date of birth is required for a numeroscope.');
  const { d, m, y } = parseDob(dob);
  const driver = driverNumber(d);
  const conductor = conductorNumber(dob);
  const kua = kuaNumber(y, gender);
  const grid = loShuGrid({ dob, day: d, gender, driver, conductor, kua: kua.kua });
  const py = personalYear(dob, onDate);
  const pMonth = personalMonth(dob, (onDate instanceof Date ? onDate : new Date(onDate)).getUTCMonth() + 1, (onDate instanceof Date ? onDate : new Date(onDate)).getUTCFullYear());
  const pDay = personalDay(dob, onDate);
  const combo = comboReading(driver, conductor);
  const first = nameNumber(name.split(' ')[0]);
  const full = nameNumber(name);
  const nameNotes = [];
  if (UNFAVOURABLE_NAME_NUMBERS.includes(full.number)) nameNotes.push(`Your full-name total reduces to ${full.number}, which the tradition advises against. A subtle spelling adjustment can shift this vibration.`);
  if (UNFAVOURABLE_NAME_NUMBERS.includes(first.number)) nameNotes.push(`Your first-name total reduces to ${first.number} — also best softened through spelling.`);
  if (!AUSPICIOUS_NAME_NUMBERS.includes(full.number) && !UNFAVOURABLE_NAME_NUMBERS.includes(full.number)) nameNotes.push(`Your name vibrates to ${full.number}. The tradition prefers 1, 3, 5 or 6, so keep the spelling stable and let your Driver number lead.`);
  if (nameNotes.length === 0) nameNotes.push('Your name spelling already sits in the auspicious 1 / 3 / 5 / 6 family. Keep it consistent.');

  return {
    input: { name, dob, gender },
    driver: { number: driver, ...PLANETS[driver], ...NUMBER_PERSONALITY[driver] },
    conductor: { number: conductor, ...PLANETS[conductor], ...NUMBER_PERSONALITY[conductor] },
    kua,
    combo,
    grid,
    missing: missingReading(grid),
    repeated: repeatedReading(grid),
    planes: grid.planes,
    remedies: buildRemedies({ grid, driver, conductor, gender }),
    personalYear: { ...py, ...PERSONAL_YEAR[py.number] },
    personalMonth: { ...pMonth, ...PERSONAL_YEAR[pMonth.number], label: 'Personal Month' },
    personalDay: { ...pDay, ...PERSONAL_YEAR[pDay.number], label: 'Personal Day' },
    name: { first, full, notes: nameNotes, karmic: KARMIC_NUMBERS[full.total] || null },
    friendship: PLANET_FRIENDSHIP[driver],
    lucky: {
      numbers: [driver, conductor, ...PLANET_FRIENDSHIP[driver].friends].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4),
      colour: PLANETS[driver].colour,
      day: PLANETS[driver].day,
      direction: PLANETS[driver].direction
    }
  };
}

export { PLANETS, NUMBER_PERSONALITY, PERSONAL_YEAR, MISSING_NUMBER, LO_SHU_MEANING } from '../data/numerology.js';
