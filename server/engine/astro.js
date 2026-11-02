/**
 * Lightweight but genuine Vedic astronomy layer.
 * Uses JPL approximate Keplerian elements (1800–2050) for the planets,
 * a Meeus low-precision lunar series, Lahiri ayanamsa and whole-sign houses.
 * Accuracy is typically within ~0.5°, which is enough for sign/nakshatra level
 * guidance but not for muhurta. The UI says so plainly.
 */
import { RASHIS, NAKSHATRAS, NAKSHATRA_SPAN, PLANET_ORDER, DASHAS, DASHA_ORDER, DASHA_YEARS } from '../data/astro.js';

const DEG = Math.PI / 180;
export const norm360 = (d) => ((d % 360) + 360) % 360;
const sin = (d) => Math.sin(d * DEG);
const cos = (d) => Math.cos(d * DEG);

export function toJD(date) {
  return date.getTime() / 86400000 + 2440587.5;
}

export function fromJD(jd) {
  return new Date((jd - 2440587.5) * 86400000);
}

/* ------------------------------------------------------------------ */
/* Planetary positions                                                 */
/* ------------------------------------------------------------------ */

// a, e, I, L, longPeri, longNode followed by their per-century rates
const ELEMENTS = {
  Mercury: [0.38709927, 0.20563593, 7.00497902, 252.2503235, 77.45779628, 48.33076593,
    0.00000037, 0.00001906, -0.00594749, 149472.67411175, 0.16047689, -0.12534081],
  Venus: [0.72333566, 0.00677672, 3.39467605, 181.9790995, 131.60246718, 76.67984255,
    0.0000039, -0.00004107, -0.0007889, 58517.81538729, 0.00268329, -0.27769418],
  Earth: [1.00000261, 0.01671123, -0.00001531, 100.46457166, 102.93768193, 0,
    0.00000562, -0.00004392, -0.01294668, 35999.37244981, 0.32327364, 0],
  Mars: [1.52371034, 0.0933941, 1.84969142, -4.55343205, -23.94362959, 49.55953891,
    0.00001847, 0.00007882, -0.00813131, 19140.30268499, 0.44441088, -0.29257343],
  Jupiter: [5.202887, 0.04838624, 1.30439695, 34.39644051, 14.72847983, 100.47390909,
    -0.00011607, -0.00013253, -0.00183714, 3034.74612775, 0.21252668, 0.20469106],
  Saturn: [9.53667594, 0.05386179, 2.48599187, 49.95424423, 92.59887831, 113.66242448,
    -0.001256, -0.00050991, 0.00193609, 1222.49362201, -0.41897216, -0.28867794]
};

function heliocentric(name, T) {
  const e = ELEMENTS[name];
  const a = e[0] + e[6] * T;
  const ecc = e[1] + e[7] * T;
  const inc = e[2] + e[8] * T;
  const L = e[3] + e[9] * T;
  const peri = e[4] + e[10] * T;
  const node = e[5] + e[11] * T;

  const M = norm360(L - peri);
  let E = M;
  for (let i = 0; i < 8; i += 1) {
    E = E - (E - ecc * sin(E) - M) / (1 - ecc * cos(E));
  }
  const xv = a * (cos(E) - ecc);
  const yv = a * Math.sqrt(1 - ecc * ecc) * sin(E);
  const omega = peri - node;

  const x = (cos(omega) * cos(node) - sin(omega) * sin(node) * cos(inc)) * xv
    + (-sin(omega) * cos(node) - cos(omega) * sin(node) * cos(inc)) * yv;
  const y = (cos(omega) * sin(node) + sin(omega) * cos(node) * cos(inc)) * xv
    + (-sin(omega) * sin(node) + cos(omega) * cos(node) * cos(inc)) * yv;
  return { x, y };
}

export function tropicalLongitudes(jd) {
  const T = (jd - 2451545.0) / 36525;
  const earth = heliocentric('Earth', T);
  const out = {};

  out.Sun = norm360(Math.atan2(-earth.y, -earth.x) / DEG);

  const moon = moonLongitude(jd);
  out.Moon = moon;

  for (const planet of ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn']) {
    const helio = heliocentric(planet, T);
    const gx = helio.x - earth.x;
    const gy = helio.y - earth.y;
    out[planet] = norm360(Math.atan2(gy, gx) / DEG);
  }

  // Mean lunar node = Rahu (true node oscillates; mean node is the classical choice)
  out.Rahu = norm360(125.0445479 - 1934.1362891 * T);
  out.Ketu = norm360(out.Rahu + 180);
  return out;
}

/** Meeus low-precision lunar longitude (error < 0.02°). */
export function moonLongitude(jd) {
  const T = (jd - 2451545.0) / 36525;
  const Lp = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T + T * T * T / 538841 - T ** 4 / 65194000;
  const D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T + T ** 3 / 545868 - T ** 4 / 113065000;
  const M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T * T + T ** 3 / 24490000;
  const Mp = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T + T ** 3 / 69699 - T ** 4 / 14712000;
  const F = 93.272095 + 483202.0175233 * T - 0.0036539 * T * T - T ** 3 / 3526000 + T ** 4 / 863310000;

  const lon = Lp
    + 6.289 * sin(Mp)
    + 1.274 * sin(2 * D - Mp)
    + 0.658 * sin(2 * D)
    + 0.214 * sin(2 * Mp)
    - 0.186 * sin(M)
    - 0.114 * sin(2 * F)
    + 0.059 * sin(2 * D - 2 * Mp)
    + 0.057 * sin(2 * D - M - Mp)
    + 0.053 * sin(2 * D + Mp)
    + 0.046 * sin(2 * D - M)
    + 0.041 * sin(M - Mp)
    - 0.035 * sin(D)
    - 0.031 * sin(M + Mp)
    - 0.015 * sin(2 * F - 2 * D)
    + 0.011 * sin(2 * D - 4 * Mp);
  return norm360(lon);
}

/** Lahiri ayanamsa in degrees for a given Julian Day. */
export function ayanamsa(jd) {
  const year = 2000 + (jd - 2451545.0) / 365.2425;
  return 23.8531 + (year - 2000) * 0.0139722;
}

export function siderealLongitudes(jd) {
  const ay = ayanamsa(jd);
  const tropical = tropicalLongitudes(jd);
  const out = {};
  for (const [k, v] of Object.entries(tropical)) out[k] = norm360(v - ay);
  return out;
}

export function obliquity(jd) {
  const T = (jd - 2451545.0) / 36525;
  return 23.4392911 - 0.0130041667 * T - 1.6667e-7 * T * T + 5.0278e-7 * T ** 3;
}

export function ascendant(jd, lat, lon) {
  const T = (jd - 2451545.0) / 36525;
  const gmst = norm360(280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T - (T ** 3) / 38710000);
  const ramc = norm360(gmst + lon);
  const eps = obliquity(jd);
  const phi = lat;
  const y = cos(ramc);
  const x = -(sin(ramc) * cos(eps) + Math.tan(phi * DEG) * sin(eps));
  return norm360(Math.atan2(y, x) / DEG);
}

export function mcLongitude(jd, lon) {
  const T = (jd - 2451545.0) / 36525;
  const gmst = norm360(280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T);
  const ramc = norm360(gmst + lon);
  const eps = obliquity(jd);
  return norm360(Math.atan2(sin(ramc), cos(ramc) * cos(eps)) / DEG);
}

/* ------------------------------------------------------------------ */
/* Sign / nakshatra helpers                                            */
/* ------------------------------------------------------------------ */

export const signIndex = (lon) => Math.floor(norm360(lon) / 30);
export const degreeInSign = (lon) => norm360(lon) % 30;

export function signName(lon) {
  const idx = signIndex(lon);
  return { index: idx, ...RASHIS[idx] };
}

export function nakshatraOf(lon) {
  const l = norm360(lon);
  const idx = Math.floor(l / NAKSHATRA_SPAN);
  const pada = Math.floor((l % NAKSHATRA_SPAN) / (NAKSHATRA_SPAN / 4)) + 1;
  return { index: idx, pada, ...NAKSHATRAS[idx], start: idx * NAKSHATRA_SPAN };
}

export function formatDegrees(lon) {
  const d = degreeInSign(lon);
  const deg = Math.floor(d);
  const min = Math.floor((d - deg) * 60);
  return `${String(deg).padStart(2, '0')}°${String(min).padStart(2, '0')}′`;
}

export function navamsaSign(lon) {
  return Math.floor(norm360(lon) / (30 / 9)) % 12;
}

/* ------------------------------------------------------------------ */
/* Vimshottari dasha                                                   */
/* ------------------------------------------------------------------ */

const YEAR_MS = 365.2425 * 24 * 60 * 60 * 1000;

export function vimshottari(moonSidereal, birthDate) {
  const nak = nakshatraOf(moonSidereal);
  const elapsedFraction = (norm360(moonSidereal) % NAKSHATRA_SPAN) / NAKSHATRA_SPAN;
  const startLord = nak.lord;
  const startIdx = DASHA_ORDER.indexOf(startLord);
  const balanceYears = (1 - elapsedFraction) * DASHA_YEARS[startLord];

  const trueStart = new Date(birthDate.getTime() - elapsedFraction * DASHA_YEARS[startLord] * YEAR_MS);

  const mahadashas = [];
  let cursor = new Date(trueStart);
  let idx = startIdx;
  // build a full 120-year cycle plus a lead-in so "current" lookup always resolves
  for (let i = 0; i < 10; i += 1) {
    const lord = DASHA_ORDER[idx % 9];
    const years = DASHA_YEARS[lord];
    const end = new Date(cursor.getTime() + years * YEAR_MS);
    mahadashas.push({ lord, years, start: cursor, end });
    cursor = end;
    idx += 1;
  }

  const withSubs = mahadashas.map((m) => ({ ...m, antardashas: antardashas(m, birthDate) }));

  const now = new Date();
  const currentMaha = withSubs.find((m) => now >= m.start && now < m.end) || withSubs[withSubs.length - 1];
  const currentAntar = currentMaha.antardashas.find((a) => now >= a.start && now < a.end) || currentMaha.antardashas[currentMaha.antardashas.length - 1];
  const currentPratyantar = currentAntar.pratyantardashas.find((p) => now >= p.start && now < p.end)
    || currentAntar.pratyantardashas[currentAntar.pratyantardashas.length - 1];

  return {
    nakshatra: nak,
    startLord,
    balanceYears,
    trueStart,
    mahadashas: withSubs,
    current: {
      mahadasha: currentMaha,
      antardasha: currentAntar,
      pratyantardasha: currentPratyantar
    }
  };
}

function antardashas(maha, birthDate) {
  const startIdx = DASHA_ORDER.indexOf(maha.lord);
  const subs = [];
  let cursor = new Date(maha.start);
  for (let i = 0; i < 9; i += 1) {
    const lord = DASHA_ORDER[(startIdx + i) % 9];
    const years = (DASHA_YEARS[lord] / 120) * maha.years;
    const end = new Date(cursor.getTime() + years * YEAR_MS);
    subs.push({ lord, years, start: cursor, end, pratyantardashas: pratyantardashas({ lord, start: cursor, years }, birthDate) });
    cursor = end;
  }
  return subs;
}

function pratyantardashas(antar, birthDate) {
  const startIdx = DASHA_ORDER.indexOf(antar.lord);
  const subs = [];
  let cursor = new Date(antar.start);
  for (let i = 0; i < 9; i += 1) {
    const lord = DASHA_ORDER[(startIdx + i) % 9];
    const years = (DASHA_YEARS[lord] / 120) * antar.years;
    const end = new Date(cursor.getTime() + years * YEAR_MS);
    subs.push({ lord, years, start: cursor, end });
    cursor = end;
  }
  return subs;
}

/* ------------------------------------------------------------------ */
/* Ashtakoot (36 guna) compatibility                                   */
/* ------------------------------------------------------------------ */

const VARNA_OF_SIGN = ['Kshatriya', 'Vaishya', 'Shudra', 'Brahmin', 'Kshatriya', 'Vaishya', 'Shudra', 'Brahmin', 'Kshatriya', 'Vaishya', 'Shudra', 'Brahmin'];
const VARNA_RANK = { Brahmin: 3, Kshatriya: 2, Vaishya: 1, Shudra: 0 };

const VASHYA_OF_SIGN = ['Chatushpada', 'Chatushpada', 'Manava', 'Jalachara', 'Vanachara', 'Manava', 'Manava', 'Keeta', 'Manava', 'Jalachara', 'Manava', 'Jalachara'];
const VASHYA_SCORE = {
  'Chatushpada-Chatushpada': 2, 'Chatushpada-Manava': 1, 'Chatushpada-Jalachara': 1, 'Chatushpada-Vanachara': 1, 'Chatushpada-Keeta': 0,
  'Manava-Chatushpada': 1, 'Manava-Manava': 2, 'Manava-Jalachara': 1, 'Manava-Vanachara': 0, 'Manava-Keeta': 0,
  'Jalachara-Chatushpada': 1, 'Jalachara-Manava': 1, 'Jalachara-Jalachara': 2, 'Jalachara-Vanachara': 0, 'Jalachara-Keeta': 1,
  'Vanachara-Chatushpada': 1, 'Vanachara-Manava': 0, 'Vanachara-Jalachara': 0, 'Vanachara-Vanachara': 2, 'Vanachara-Keeta': 0,
  'Keeta-Chatushpada': 0, 'Keeta-Manava': 0, 'Keeta-Jalachara': 1, 'Keeta-Keeta': 2, 'Keeta-Vanachara': 0
};

const YONI_ORDER = ['Horse', 'Elephant', 'Goat', 'Serpent', 'Dog', 'Cat', 'Rat', 'Cow', 'Buffalo', 'Tiger', 'Deer', 'Monkey', 'Mongoose', 'Lion'];
const YONI_ENEMY = {
  Horse: 'Buffalo', Buffalo: 'Horse', Elephant: 'Lion', Lion: 'Elephant', Goat: 'Monkey', Monkey: 'Goat',
  Serpent: 'Mongoose', Mongoose: 'Serpent', Dog: 'Deer', Deer: 'Dog', Cat: 'Rat', Rat: 'Cat', Cow: 'Tiger', Tiger: 'Cow'
};

const GANA_SCORE = {
  'Deva-Deva': 6, 'Deva-Manushya': 6, 'Deva-Rakshasa': 1,
  'Manushya-Deva': 5, 'Manushya-Manushya': 6, 'Manushya-Rakshasa': 0,
  'Rakshasa-Deva': 1, 'Rakshasa-Manushya': 0, 'Rakshasa-Rakshasa': 6
};

const RASHI_LORD = RASHIS.map((r) => r.lord);
const PLANET_FRIENDS = {
  Sun: { friends: ['Moon', 'Mars', 'Jupiter'], enemies: ['Venus', 'Saturn', 'Mercury'] },
  Moon: { friends: ['Sun', 'Mercury'], enemies: ['Venus', 'Saturn', 'Mars'] },
  Mars: { friends: ['Sun', 'Moon', 'Jupiter'], enemies: ['Mercury', 'Venus'] },
  Mercury: { friends: ['Sun', 'Venus'], enemies: ['Moon'] },
  Jupiter: { friends: ['Sun', 'Moon', 'Mars'], enemies: ['Mercury', 'Venus'] },
  Venus: { friends: ['Mercury', 'Saturn'], enemies: ['Sun', 'Moon'] },
  Saturn: { friends: ['Mercury', 'Venus'], enemies: ['Sun', 'Moon', 'Mars'] }
};

function maitriScore(a, b) {
  const fa = PLANET_FRIENDS[a] || { friends: [], enemies: [] };
  const fb = PLANET_FRIENDS[b] || { friends: [], enemies: [] };
  const rel = (x, y) => (x.friends.includes(y) ? 'friend' : x.enemies.includes(y) ? 'enemy' : 'neutral');
  const r1 = rel(fa, b);
  const r2 = rel(fb, a);
  const pair = [r1, r2].sort().join('-');
  if (pair === 'friend-friend') return 5;
  if (pair === 'friend-neutral') return 4;
  if (pair === 'neutral-neutral') return 3;
  if (pair === 'enemy-friend') return 1;
  if (pair === 'enemy-neutral') return 0.5;
  return 0;
}

export function ashtakoot(a, b) {
  // a = bride, b = groom by convention; scores are symmetric except varna/tara
  const nakA = nakshatraOf(a.moon);
  const nakB = nakshatraOf(b.moon);
  const rashiA = signIndex(a.moon);
  const rashiB = signIndex(b.moon);

  const varnaA = VARNA_OF_SIGN[rashiA];
  const varnaB = VARNA_OF_SIGN[rashiB];
  const varna = VARNA_RANK[varnaB] >= VARNA_RANK[varnaA] ? 1 : 0.5;

  const vashya = VASHYA_SCORE[`${VASHYA_OF_SIGN[rashiA]}-${VASHYA_OF_SIGN[rashiB]}`] ?? 0;

  const taraDiff = (i, j) => ((j - i + 27) % 27) % 9 + 1;
  const badTara = [3, 5, 7];
  const tA = taraDiff(nakA.index, nakB.index);
  const tB = taraDiff(nakB.index, nakA.index);
  const taraGood = [tA, tB].filter((t) => !badTara.includes(t)).length;
  const tara = taraGood === 2 ? 3 : taraGood === 1 ? 1.5 : 0;

  let yoni = 0;
  if (nakA.yoni === nakB.yoni) yoni = 4;
  else if (YONI_ENEMY[nakA.yoni] === nakB.yoni) yoni = 0;
  else {
    const dist = Math.abs(YONI_ORDER.indexOf(nakA.yoni) - YONI_ORDER.indexOf(nakB.yoni));
    yoni = dist === 1 || dist === 12 ? 2 : 3;
  }

  const maitri = maitriScore(RASHI_LORD[rashiA], RASHI_LORD[rashiB]);

  const gana = GANA_SCORE[`${nakA.gana}-${nakB.gana}`] ?? 0;

  const signDistance = ((rashiB - rashiA + 12) % 12) + 1;
  const reverseDistance = ((rashiA - rashiB + 12) % 12) + 1;
  const bhakootDosha = [[6, 8], [5, 9], [2, 12]].some(([x, y]) =>
    (signDistance === x && reverseDistance === y) || (signDistance === y && reverseDistance === x));
  const bhakoot = bhakootDosha ? 0 : 7;

  const nadi = nakA.nadi === nakB.nadi ? 0 : 8;

  const parts = [
    { key: 'varna', label: 'Varna', max: 1, score: varna, about: 'Spiritual compatibility and ego balance' },
    { key: 'vashya', label: 'Vashya', max: 2, score: vashya, about: 'Mutual attraction and influence' },
    { key: 'tara', label: 'Tara', max: 3, score: tara, about: 'Health, destiny and star compatibility' },
    { key: 'yoni', label: 'Yoni', max: 4, score: yoni, about: 'Physical and instinctive affinity' },
    { key: 'maitri', label: 'Graha Maitri', max: 5, score: maitri, about: 'Mental and planetary friendship' },
    { key: 'gana', label: 'Gana', max: 6, score: gana, about: 'Temperament — Deva, Manushya or Rakshasa' },
    { key: 'bhakoot', label: 'Bhakoot', max: 7, score: bhakoot, about: 'Emotional and financial harmony' },
    { key: 'nadi', label: 'Nadi', max: 8, score: nadi, about: 'Constitution, progeny and health' }
  ];

  const total = parts.reduce((s, p) => s + p.score, 0);
  const verdict = total >= 28 ? 'Excellent match' : total >= 21 ? 'Very good match' : total >= 15 ? 'Acceptable match' : total >= 8 ? 'Needs conscious work' : 'Challenging match';

  return {
    parts, total, verdict,
    max: 36,
    nakshatras: { a: nakA, b: nakB },
    doshas: [
      ...(nadi === 0 ? [{ name: 'Nadi Dosha', note: 'Same nadi — traditionally considered a health and progeny concern; often mitigated when other factors are strong.' }] : []),
      ...(bhakootDosha ? [{ name: 'Bhakoot Dosha', note: 'Moon signs in a 2/12, 5/9 or 6/8 relationship — emotional and financial rhythm needs care.' }] : []),
      ...(gana === 0 ? [{ name: 'Gana Dosha', note: 'Rakshasa and Manushya ganas pull in opposite directions on temperament.' }] : [])
    ]
  };
}

/* ------------------------------------------------------------------ */
/* Yogas and doshas                                                    */
/* ------------------------------------------------------------------ */

export function detectYogas(chart) {
  const yogas = [];
  const bySign = {};
  for (const p of chart.planets) {
    const s = signIndex(p.lon);
    bySign[s] = bySign[s] || [];
    bySign[s].push(p);
  }
  const moonSign = signIndex(chart.moon);
  const houseFromMoon = (sign) => ((sign - moonSign + 12) % 12) + 1;
  const jup = chart.planets.find((p) => p.name === 'Jupiter');
  if (jup && [1, 4, 7, 10].includes(houseFromMoon(signIndex(jup.lon)))) {
    yogas.push({ name: 'Gaja Kesari Yoga', strength: 'Strong', note: 'Jupiter in a kendra from the Moon — wisdom, reputation and lasting good fortune.' });
  }
  const sun = chart.planets.find((p) => p.name === 'Sun');
  const mer = chart.planets.find((p) => p.name === 'Mercury');
  if (sun && mer && signIndex(sun.lon) === signIndex(mer.lon)) {
    yogas.push({ name: 'Budha-Aditya Yoga', strength: 'Strong', note: 'Sun and Mercury together — sharp intellect, eloquence and administrative skill.' });
  }
  const mars = chart.planets.find((p) => p.name === 'Mars');
  if (mars && signIndex(mars.lon) === moonSign) {
    yogas.push({ name: 'Chandra-Mangal Yoga', strength: 'Moderate', note: 'Moon and Mars together — earning capacity, enterprise and emotional intensity.' });
  }
  const kendra = [1, 4, 7, 10];
  const panch = [
    ['Mars', 'Ruchaka Yoga'], ['Mercury', 'Bhadra Yoga'], ['Jupiter', 'Hamsa Yoga'],
    ['Venus', 'Malavya Yoga'], ['Saturn', 'Shasha Yoga']
  ];
  for (const [name, yoga] of panch) {
    const p = chart.planets.find((x) => x.name === name);
    if (!p) continue;
    const sign = signIndex(p.lon);
    const own = RASHIS[sign].lord === name;
    const exalted = PLANET_INFO_EXALT[name] === sign;
    if ((own || exalted) && kendra.includes(p.house)) {
      yogas.push({ name: yoga, strength: 'Strong', note: `${name} is ${exalted ? 'exalted' : 'in its own sign'} in a kendra — a Panch Mahapurusha yoga of distinction.` });
    }
  }
  // Raja yoga (simplified): a kendra lord conjunct a trikona lord
  const lordOf = (house) => {
    const sign = (chart.lagnaSign + house - 1) % 12;
    return RASHI_LORD[sign];
  };
  const kendraLords = [1, 4, 7, 10].map(lordOf);
  const trikonaLords = [5, 9].map(lordOf);
  outer: for (const kl of kendraLords) {
    for (const tl of trikonaLords) {
      if (kl === tl) continue;
      const a = chart.planets.find((p) => p.name === kl);
      const b = chart.planets.find((p) => p.name === tl);
      if (a && b && signIndex(a.lon) === signIndex(b.lon)) {
        yogas.push({ name: 'Raja Yoga', strength: 'Strong', note: `The ${kl} (kendra lord) and ${tl} (trikona lord) sit together — authority, rise in status and support from powerful people.` });
        break outer;
      }
    }
  }
  return yogas;
}

const PLANET_INFO_EXALT = { Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6 };

export function mangalDosha(chart) {
  const mars = chart.planets.find((p) => p.name === 'Mars');
  if (!mars) return { present: false, houses: [], note: '' };
  const marsSign = signIndex(mars.lon);
  const fromLagna = ((marsSign - chart.lagnaSign + 12) % 12) + 1;
  const fromMoon = ((marsSign - signIndex(chart.moon) + 12) % 12) + 1;
  const bad = [1, 2, 4, 7, 8, 12];
  const hits = [];
  if (bad.includes(fromLagna)) hits.push(`Mars in house ${fromLagna} from Lagna`);
  if (bad.includes(fromMoon)) hits.push(`Mars in house ${fromMoon} from Moon`);
  return {
    present: hits.length > 0,
    houses: { fromLagna, fromMoon },
    note: hits.length
      ? `${hits.join(' and ')}. Mangal Dosha intensifies passion and conflict in partnership — maturity, communication and (traditionally) matching with a chart that carries the same dosha are the classical mitigations.`
      : 'Mars does not occupy a dosha house from Lagna or Moon. No Mangal Dosha in the classical sense.'
  };
}

export function sadeSati(natalMoonLon, currentSaturnLon) {
  const moonSign = signIndex(natalMoonLon);
  const satSign = signIndex(currentSaturnLon);
  const offset = ((satSign - moonSign + 12) % 12) + 1; // 1 = same sign, 12 = one before
  const phase = offset === 12 ? 'First phase (rising)' : offset === 1 ? 'Second phase (peak)' : offset === 2 ? 'Third phase (setting)' : null;
  return { active: !!phase, phase, offset, moonSign, saturnSign: satSign };
}

export function arudhaLagna(chart) {
  const lagnaSign = chart.lagnaSign;
  const lord = RASHI_LORD[lagnaSign];
  const lordPlanet = chart.planets.find((p) => p.name === lord);
  if (!lordPlanet) return { sign: lagnaSign, lord };
  const lordSign = signIndex(lordPlanet.lon);
  const distance = ((lordSign - lagnaSign + 12) % 12) + 1;
  let arudha = (lordSign + distance - 1) % 12;
  const fromLagna = ((arudha - lagnaSign + 12) % 12) + 1;
  if (fromLagna === 1) arudha = (arudha + 9) % 12;
  if (fromLagna === 7) arudha = (arudha + 3) % 12;
  return { sign: arudha, lord, distance };
}

export function atmakaraka(planets) {
  const eligible = planets.filter((p) => !['Rahu', 'Ketu'].includes(p.name));
  const sorted = [...eligible].sort((a, b) => degreeInSign(b.lon) - degreeInSign(a.lon));
  return sorted[0];
}

/* ------------------------------------------------------------------ */
/* Full chart                                                          */
/* ------------------------------------------------------------------ */

export function computeChart({ date, lat, lon }) {
  const jd = toJD(date);
  const sidereal = siderealLongitudes(jd);
  const asc = norm360(ascendant(jd, lat, lon) - ayanamsa(jd));
  const lagnaSign = signIndex(asc);

  const planets = PLANET_ORDER.map((name) => {
    const lonVal = sidereal[name];
    return {
      name,
      lon: lonVal,
      sign: signIndex(lonVal),
      degree: degreeInSign(lonVal),
      house: ((signIndex(lonVal) - lagnaSign + 12) % 12) + 1,
      nakshatra: nakshatraOf(lonVal),
      retrograde: ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'].includes(name)
        ? isRetrograde(name, jd)
        : name === 'Rahu' || name === 'Ketu'
    };
  });

  const chart = {
    jd,
    ayanamsa: ayanamsa(jd),
    ascendant: asc,
    lagnaSign,
    lagna: RASHIS[lagnaSign],
    moon: sidereal.Moon,
    moonSign: signIndex(sidereal.Moon),
    moonNakshatra: nakshatraOf(sidereal.Moon),
    sunSign: signIndex(sidereal.Sun),
    planets,
    houses: Array.from({ length: 12 }, (_, i) => ({
      number: i + 1,
      sign: (lagnaSign + i) % 12,
      rashi: RASHIS[(lagnaSign + i) % 12],
      occupants: planets.filter((p) => p.house === i + 1).map((p) => p.name)
    }))
  };
  chart.yogas = detectYogas(chart);
  chart.mangal = mangalDosha(chart);
  chart.arudha = arudhaLagna(chart);
  chart.atmakaraka = atmakaraka(planets);
  chart.dasha = vimshottari(sidereal.Moon, date);
  chart.navamsa = planets.map((p) => ({ name: p.name, sign: navamsaSign(p.lon), rashi: RASHIS[navamsaSign(p.lon)] }));
  return chart;
}

// crude retrograde check by finite difference
function isRetrograde(name, jd) {
  const a = siderealLongitudes(jd - 0.5)[name];
  const b = siderealLongitudes(jd + 0.5)[name];
  let diff = b - a;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff < 0;
}

export { DASHAS, DASHA_ORDER, DASHA_YEARS, YEAR_MS };
