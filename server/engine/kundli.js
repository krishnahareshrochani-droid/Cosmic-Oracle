import { CITIES } from '../data/cities.js';
import {
  RASHIS, PLANET_INFO, NAKSHATRAS, HOUSES, DASHAS, DASHA_ORDER, GEM_GUIDANCE
} from '../data/astro.js';
import {
  SIGN_PERSONALITY, PLANET_GIFT, PLANET_WATCH, PLANET_ENERGY, TOPIC_PLAYBOOK,
  TRANSIT_NOTES, CLOSINGS, DISCLAIMER
} from '../data/interpretations.js';
import {
  computeChart, toJD, signIndex, nakshatraOf, ashtakoot, sadeSati, siderealLongitudes,
  formatDegrees, navamsaSign, DASHA_YEARS
} from './astro.js';
import { buildNumeroscope, PLANETS } from './numerology.js';

const YEAR_MS = 365.2425 * 24 * 60 * 60 * 1000;

export function resolvePlace(place) {
  if (place && typeof place === 'object' && place.lat != null) return place;
  const found = CITIES.find((c) => c.name.toLowerCase() === String(place || '').toLowerCase());
  return found || CITIES.find((c) => c.name === 'Other / Not listed');
}

export function birthMoment({ dob, tob, place }) {
  if (!dob) throw new Error('Date of birth is required.');
  const [y, m, d] = String(dob).split('-').map(Number);
  const [hh, mm] = String(tob || '12:00').split(':').map(Number);
  const loc = resolvePlace(place);
  const tz = loc.tz ?? 5.5;
  const utc = Date.UTC(y, m - 1, d, hh || 0, mm || 0) - tz * 3600 * 1000;
  return { date: new Date(utc), loc, localLabel: `${String(hh).padStart(2, '0')}:${String(mm || 0).padStart(2, '0')} ${tz >= 0 ? '+' : ''}${tz}` };
}

export function computeKundli(profile) {
  const { date, loc, localLabel } = birthMoment(profile);
  const chart = computeChart({ date, lat: loc.lat, lon: loc.lon });
  return { chart, date, loc, localLabel };
}

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */

const ordinal = (n) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

const signOf = (p) => RASHIS[p.sign].name;
const planet = (chart, name) => chart.planets.find((p) => p.name === name);
const houseLord = (chart, house) => RASHIS[(chart.lagnaSign + house - 1) % 12].lord;
const placement = (chart, name) => {
  const p = planet(chart, name);
  if (!p) return '';
  return `${name} sits in ${signOf(p)} in your ${ordinal(p.house)} house, in ${p.nakshatra.name} nakshatra (pada ${p.nakshatra.pada})${p.retrograde ? ', retrograde' : ''}`;
};
const fmtDate = (d) => d.toISOString().slice(0, 10);
const fmtMonthYear = (d) => d.toLocaleString('en-IN', { month: 'short', year: 'numeric', timeZone: 'UTC' });
const planetTheme = (lord) => DASHAS.find((d) => d.lord === lord)?.theme || '';

function houseReport(chart) {
  return HOUSES.map((h) => {
    const lord = houseLord(chart, h.number);
    const lp = planet(chart, lord);
    return {
      number: h.number,
      name: h.name,
      meaning: h.meaning,
      sign: RASHIS[(chart.lagnaSign + h.number - 1) % 12].name,
      occupants: chart.houses[h.number - 1].occupants,
      lord,
      lordPlacement: lp ? `${signOf(lp)}, house ${lp.house}` : '—'
    };
  });
}

function dashaLine(chart) {
  const { mahadasha, antardasha, pratyantardasha } = chart.dasha.current;
  return `${mahadasha.lord} Mahadasha (${fmtMonthYear(mahadasha.start)} → ${fmtMonthYear(mahadasha.end)}), with ${antardasha.lord} Antardasha (${fmtMonthYear(antardasha.start)} → ${fmtMonthYear(antardasha.end)}) and ${pratyantardasha.lord} Pratyantar running now.`;
}

function transitChartNow() {
  const jd = toJD(new Date());
  return { jd, positions: siderealLongitudes(jd) };
}

function transitTable(chart) {
  const { jd, positions } = transitChartNow();
  const ayan = chart.ayanamsa;
  return Object.entries(positions).map(([name, sid]) => {
    const natalMoonSign = chart.moonSign;
    return {
      planet: name,
      sign: RASHIS[signIndex(sid)].name,
      degree: formatDegrees(sid),
      house: ((signIndex(sid) - chart.lagnaSign + 12) % 12) + 1,
      fromMoon: ((signIndex(sid) - natalMoonSign + 12) % 12) + 1
    };
  });
}

function chartSection(chart, title = 'Your birth chart') {
  return {
    kind: 'chart',
    title,
    data: {
      lagna: { sign: chart.lagna.name, hindi: chart.lagna.hindi, degree: formatDegrees(chart.ascendant), symbol: chart.lagna.symbol, lord: chart.lagna.lord },
      moon: { sign: RASHIS[chart.moonSign].name, nakshatra: chart.moonNakshatra.name, pada: chart.moonNakshatra.pada, lord: chart.moonNakshatra.lord },
      sun: { sign: RASHIS[chart.sunSign].name },
      ayanamsa: chart.ayanamsa.toFixed(3),
      planets: chart.planets.map((p) => ({
        name: p.name,
        glyph: PLANET_INFO[p.name].glyph,
        sign: RASHIS[p.sign].name,
        degree: formatDegrees(p.lon),
        house: p.house,
        nakshatra: `${p.nakshatra.name} ${p.nakshatra.pada}`,
        retrograde: p.retrograde
      })),
      houses: houseReport(chart)
    }
  };
}

function dashaSection(chart) {
  const now = new Date();
  return {
    kind: 'dasha',
    title: 'Vimshottari dasha timeline',
    data: {
      birthNakshatra: chart.moonNakshatra.name,
      startLord: chart.dasha.startLord,
      balance: chart.dasha.balanceYears.toFixed(2),
      current: {
        mahadasha: labelPeriod(chart.dasha.current.mahadasha),
        antardasha: labelPeriod(chart.dasha.current.antardasha),
        pratyantardasha: labelPeriod(chart.dasha.current.pratyantardasha)
      },
      timeline: chart.dasha.mahadashas
        .filter((m) => m.end > new Date(now.getTime() - 40 * YEAR_MS))
        .slice(0, 6)
        .map((m) => ({
          lord: m.lord,
          years: m.years,
          start: fmtMonthYear(m.start),
          end: fmtMonthYear(m.end),
          active: now >= m.start && now < m.end,
          antardashas: m.antardashas.map((a) => ({ lord: a.lord, start: fmtMonthYear(a.start), end: fmtMonthYear(a.end) }))
        }))
    }
  };
}

function labelPeriod(p) {
  return { lord: p.lord, start: fmtMonthYear(p.start), end: fmtMonthYear(p.end), years: Number(p.years.toFixed(2)) };
}

/* ------------------------------------------------------------------ */
/* Topic analysis                                                      */
/* ------------------------------------------------------------------ */

function topicAnalysis(chart, topic) {
  const playbook = TOPIC_PLAYBOOK[topic] || TOPIC_PLAYBOOK.general;
  const primaryHouse = playbook.houses[0];
  const lord = houseLord(chart, primaryHouse);
  const lordPlanet = planet(chart, lord);
  const occupants = chart.houses[primaryHouse - 1].occupants;
  const karakaMap = {
    love: 'Venus', career: 'Saturn', money: 'Jupiter', education: 'Mercury',
    health: 'Sun', family: 'Moon', spiritual: 'Ketu', relationship: 'Venus',
    decision: 'Mercury', general: 'Jupiter'
  };
  const karaka = karakaMap[topic] || 'Jupiter';
  const karakaPlanet = planet(chart, karaka);
  const dasha = chart.dasha.current;
  const dashaLord = dasha.mahadasha.lord;

  return {
    playbook,
    primaryHouse,
    lord,
    lordPlanet,
    occupants,
    karaka,
    karakaPlanet,
    dasha,
    dashaLord,
    summary: `Your ${ordinal(primaryHouse)} house (${HOUSES[primaryHouse - 1].name}) governs ${playbook.label.toLowerCase()}. It falls in ${RASHIS[(chart.lagnaSign + primaryHouse - 1) % 12].name}, ruled by ${lord}, who ${lordPlanet ? `sits in ${RASHIS[lordPlanet.sign].name} in your ${ordinal(lordPlanet.house)} house` : 'is not placed'}. ${karaka} — the natural karaka for this area — ${karakaPlanet ? `is in ${RASHIS[karakaPlanet.sign].name}, house ${karakaPlanet.house}` : 'is not active'}. Right now the ${dashaLord} Mahadasha is the loudest voice in the room.`
  };
}

/* ------------------------------------------------------------------ */
/* Reading builder                                                     */
/* ------------------------------------------------------------------ */

export function buildKundliReading(type, profile) {
  // Prashna charts are cast for the moment of the question, so no birth date is needed.
  let chart;
  let loc;
  let localLabel;
  let castAt;
  if (type.reading === 'prashna') {
    loc = resolvePlace(profile.place || 'Pune');
    castAt = new Date();
    chart = computeChart({ date: castAt, lat: loc.lat, lon: loc.lon });
    localLabel = castAt.toISOString();
  } else {
    const computed = computeKundli(profile);
    chart = computed.chart;
    loc = computed.loc;
    localLabel = computed.localLabel;
    castAt = computed.date;
  }
  const partner = profile.partner && profile.partner.dob ? computeKundli(profile.partner) : null;
  const numeroscope = profile.dob
    ? buildNumeroscope({ name: profile.name || 'Seeker', dob: profile.dob, gender: profile.gender || 'female' })
    : null;

  const playbook = TOPIC_PLAYBOOK[type.topic] || TOPIC_PLAYBOOK.general;
  const energyBlocks = [];
  const extraSections = [];
  let advice = [];
  let dos = [];
  let donts = [];
  let timeline = null;
  let subtitle = `${chart.lagna.name} Lagna · ${RASHIS[chart.moonSign].name} Moon`;

  const now = new Date();
  const dasha = chart.dasha.current;
  const mahaTheme = planetTheme(dasha.mahadasha.lord);

  const base = () => {
    const first = String(profile.name || 'Seeker').split(' ')[0];
    energyBlocks.push({
      heading: `Namaste, ${first} 🙏`,
      body: `${profile.question ? `You asked: “${profile.question}” ` : ''}Here is the sky you were born under. You rise in ${chart.lagna.name} (${chart.lagna.hindi}) — ${SIGN_PERSONALITY[chart.lagna.name]} Your Moon sits in ${RASHIS[chart.moonSign].name}, in ${chart.moonNakshatra.name} nakshatra (pada ${chart.moonNakshatra.pada}), which is where your mind actually lives. Your Sun is in ${RASHIS[chart.sunSign].name}, the seat of your soul and spine.`
    });
  };

  const dashaBlock = () => {
    energyBlocks.push({
      heading: `Your current sky: ${dasha.mahadasha.lord} Mahadasha, ${dasha.antardasha.lord} Antardasha`,
      body: `${dashaLine(chart)} ${mahaTheme} The sub-period adds ${dasha.antardasha.lord}'s flavour: ${PLANET_ENERGY[dasha.antardasha.lord]}`
    });
  };

  const capitalise = (text) => (text ? text.charAt(0).toUpperCase() + text.slice(1) : text);
  const addAdvice = (items) => { advice = [...advice, ...items.filter(Boolean).map(capitalise)]; };

  const defaultDosDonts = (play) => {
    dos = play.dos;
    donts = play.donts;
  };

  switch (type.reading) {
    /* ----------------------------- basic ----------------------------- */
    case 'janam': {
      base();
      dashaBlock();
      extraSections.push(chartSection(chart), dashaSection(chart));
      energyBlocks.push({
        heading: 'The shape of the chart',
        body: `Planets cluster across your houses in a specific rhythm: ${chart.planets.map((p) => `${p.name} in house ${p.house}`).join(', ')}. Your Atmakaraka — the planet carrying the most degrees, and therefore the soul's chief lesson — is ${chart.atmakaraka.name} in ${RASHIS[chart.atmakaraka.sign].name}. ${PLANET_GIFT[chart.atmakaraka.name]} is your natural gift; ${PLANET_WATCH[chart.atmakaraka.name]} is the shadow to watch.`
      });
      if (chart.yogas.length) {
        energyBlocks.push({
          heading: 'Yogas present',
          body: chart.yogas.map((y) => `${y.name}: ${y.note}`).join(' ')
        });
      }
      energyBlocks.push({
        heading: 'Marriage and Mars',
        body: chart.mangal.present ? chart.mangal.note : 'There is no Mangal Dosha in your chart, which keeps the partnership house comparatively uncomplicated.'
      });
      timeline = {
        past: { title: 'The ground beneath you', body: `The ${chart.lagna.name} ascendant carries a family and karmic inheritance. ${chart.moonNakshatra.name} nakshatra, ruled by ${chart.moonNakshatra.lord}, describes the emotional template you absorbed early: ${chart.moonNakshatra.quality}.` },
        present: { title: 'Where you stand', body: `${dashaLine(chart)} ${mahaTheme}` },
        future: { title: 'Where the chart is walking', body: `The next period in line is ${chart.dasha.mahadashas.find((m) => m.start > now)?.lord || dasha.antardasha.lord}. ${planetTheme(chart.dasha.mahadashas.find((m) => m.start > now)?.lord || dasha.antardasha.lord)} Expect the themes of that planet to become visible roughly three months before the exact change.` }
      };
      addAdvice([
        `Align your daily rhythm with your Lagna lord ${chart.lagna.lord}: ${PLANET_ENERGY[chart.lagna.lord]}`,
        `Your Moon needs ${chart.moonNakshatra.quality.toLowerCase()} — design one weekly ritual that gives it that.`,
        playbook.action.charAt(0).toUpperCase() + playbook.action.slice(1) + '.'
      ]);
      defaultDosDonts(playbook);
      break;
    }

    case 'lagna': {
      base();
      extraSections.push(chartSection(chart, 'Lagna chart — houses and lords'));
      energyBlocks.push({
        heading: `${chart.lagna.name} rising`,
        body: `${SIGN_PERSONALITY[chart.lagna.name]} Because ${chart.lagna.lord} rules your chart, the health and placement of ${chart.lagna.lord} matters more than any other planet: ${placement(chart, chart.lagna.lord)}.`
      });
      energyBlocks.push({
        heading: 'The houses that speak loudest',
        body: houseReport(chart).filter((h) => h.occupants.length).slice(0, 6)
          .map((h) => `${ordinal(h.number)} house (${h.name}): ${h.occupants.join(', ')} — ${h.meaning.split(',').slice(0, 2).join(',')}.`).join(' ')
      });
      dashaBlock();
      timeline = {
        past: { title: 'Early lagna imprint', body: `The strongest house from your lagna sets the tone of your life. Here it is the ${ordinal(strengthHouse(chart))} house.` },
        present: { title: 'Now', body: `${dashaLine(chart)}` },
        future: { title: 'Ahead', body: `As ${chart.lagna.lord} moves through its dasha periods, the lagna themes intensify. Watch the ${fmtMonthYear(dasha.antardasha.end)} window for a visible shift.` }
      };
      addAdvice([`Lead with your lagna's natural gift — ${SIGN_PERSONALITY[chart.lagna.name].split('.')[0]}.`, playbook.action]);
      defaultDosDonts(playbook);
      break;
    }

    case 'navamsa': {
      base();
      const d9 = chart.navamsa;
      const venus = planet(chart, 'Venus');
      const lord7 = houseLord(chart, 7);
      const lord7p = planet(chart, lord7);
      extraSections.push({
        kind: 'chart',
        title: 'Navamsa (D9) placements',
        data: {
          planets: d9.map((d) => ({ name: d.name, sign: d.rashi.name, symbol: d.rashi.symbol }))
        }
      });
      energyBlocks.push({
        heading: 'The D9 chart — your inner marriage',
        body: `The Navamsa shows the soul's maturity in relationships. Your D9 ascendant falls in ${d9[0]?.rashi.name ?? '—'} by planetary mapping, and Venus — the karaka of love — ${placement(chart, 'Venus')}. The 7th lord ${lord7} ${lord7p ? `sits in ${RASHIS[lord7p.sign].name} in the ${ordinal(lord7p.house)} house` : 'needs care in the chart'}.`
      });
      energyBlocks.push({
        heading: 'What this asks of you',
        body: `${venus && ['Taurus', 'Libra', 'Pisces'].includes(signOf(venus)) ? 'Venus is comfortable in your chart, so affection comes naturally once trust is established.' : 'Venus is doing some work in your chart — love may require more conscious effort, honesty and patience than it does for others. That is not a flaw; it is the curriculum.'} The D9 emphasises that partnership matures you rather than merely pleases you.`
      });
      dashaBlock();
      timeline = {
        past: { title: 'Relationship karma', body: `The 7th lord ${lord7} and Venus describe what you learned about love early: ${lord7p ? `a ${RASHIS[lord7p.sign].element.toLowerCase()} pattern, expressed through the ${ordinal(lord7p.house)} house.` : 'a pattern still forming.'}` },
        present: { title: 'Now', body: `${dasha.antardasha.lord} Antardasha activates ${dasha.antardasha.lord === 'Venus' ? 'the relationship axis directly' : 'the house it rules from your lagna'}. Connection themes feel louder than usual.` },
        future: { title: 'Marriage window', body: `Traditional timing looks at Venus, the 7th lord and the 7th house from the Moon. The strongest near window is while ${dasha.mahadasha.lord} / ${dasha.antardasha.lord} runs, especially around ${fmtMonthYear(dasha.antardasha.end)}.` }
      };
      addAdvice(['Speak your needs before resentment speaks for you.', playbook.action]);
      defaultDosDonts(TOPIC_PLAYBOOK.love);
      break;
    }

    case 'dashamamsa': {
      base();
      const d10 = chart.planets.map((p) => ({ name: p.name, sign: RASHIS[Math.floor(p.lon / 3) % 12].name }));
      extraSections.push({ kind: 'chart', title: 'Dashamamsa (D10) placements', data: { planets: d10 } });
      const lord10 = houseLord(chart, 10);
      const lord10p = planet(chart, lord10);
      energyBlocks.push({
        heading: 'Career signature',
        body: `Your 10th house sits in ${RASHIS[(chart.lagnaSign + 9) % 12].name}, ruled by ${lord10}, which ${lord10p ? `is placed in your ${ordinal(lord10p.house)} house in ${RASHIS[lord10p.sign].name}` : 'needs careful handling'}. Saturn, the karma-karaka, ${placement(chart, 'Saturn')}. This combination favours ${careerFlavour(chart)}.`
      });
      dashaBlock();
      timeline = {
        past: { title: 'The skill you built', body: `Your ${ordinal(10)} house lord's placement shows where your professional credit accumulated: ${lord10p ? `${RASHIS[lord10p.sign].name} themes through the ${ordinal(lord10p.house)} house.` : 'a path still declaring itself.'}` },
        present: { title: 'Now', body: `${dasha.mahadasha.lord} Mahadasha is rewriting your professional identity. ${mahaTheme}` },
        future: { title: 'Next rise', body: `Professional expansion is strongest in ${dasha.antardasha.lord === lord10 ? 'this very antardasha' : `the ${dasha.antardasha.lord} sub-period running to ${fmtMonthYear(dasha.antardasha.end)}`}. Put visible work into the world before then.` }
      };
      addAdvice(['Make your work legible to people who control budgets.', playbook.action]);
      defaultDosDonts(TOPIC_PLAYBOOK.career);
      break;
    }

    case 'moon':
    case 'sun': {
      base();
      const isMoon = type.reading === 'moon';
      const p = isMoon ? planet(chart, 'Moon') : planet(chart, 'Sun');
      const sign = RASHIS[isMoon ? chart.moonSign : chart.sunSign];
      extraSections.push(chartSection(chart, isMoon ? 'Moon chart' : 'Sun chart'));
      energyBlocks.push({
        heading: isMoon ? 'Your mind in one paragraph' : 'Your soul in one paragraph',
        body: isMoon
          ? `${sign.name} Moon in ${p.nakshatra.name} nakshatra: ${SIGN_PERSONALITY[sign.name]} The nakshatra adds ${p.nakshatra.quality.toLowerCase()}, and its deity ${p.nakshatra.deity} is a useful image for your inner refuge. The Moon sits in your ${ordinal(p.house)} house, so emotional life expresses itself through ${HOUSES[p.house - 1].meaning.toLowerCase()}.`
          : `${sign.name} Sun in your ${ordinal(p.house)} house: identity, confidence and vitality are expressed through ${HOUSES[p.house - 1].meaning.toLowerCase()}. ${SIGN_PERSONALITY[sign.name]}`
      });
      energyBlocks.push({
        heading: 'How to work with it',
        body: `${PLANET_ENERGY[isMoon ? 'Moon' : 'Sun']} Your gift here is ${PLANET_GIFT[isMoon ? 'Moon' : 'Sun']}; the watch-point is ${PLANET_WATCH[isMoon ? 'Moon' : 'Sun']}.`
      });
      dashaBlock();
      timeline = {
        past: { title: 'Formation', body: `This placement shaped how you learned to ${isMoon ? 'feel safe' : 'claim your place'}.` },
        present: { title: 'Now', body: `${dasha.mahadasha.lord} Mahadasha gives the current emotional and ego weather: ${mahaTheme}` },
        future: { title: 'Ahead', body: `As the dasha shifts toward ${dasha.antardasha.lord}, the way you ${isMoon ? 'regulate feeling' : 'express authority'} will visibly mature.` }
      };
      addAdvice([isMoon ? 'Protect your sleep — your intuition is downstream of it.' : 'Stand in the sun, literally and socially, once a day.', playbook.action]);
      defaultDosDonts(playbook);
      break;
    }

    /* ----------------------------- dasha ----------------------------- */
    case 'mahadasha':
    case 'antardasha':
    case 'pratyantar':
    case 'current':
    case 'prediction': {
      base();
      extraSections.push(dashaSection(chart));
      const subs = chart.dasha.mahadashas.filter((m) => m.end > now).slice(0, 3);
      energyBlocks.push({
        heading: 'The long arc',
        body: `${dashaLine(chart)} ${mahaTheme}`
      });
      energyBlocks.push({
        heading: 'The fine timing',
        body: `Within the ${dasha.mahadasha.lord} Mahadasha you are moving through ${dasha.antardasha.lord} Antardasha (${fmtMonthYear(dasha.antardasha.start)} → ${fmtMonthYear(dasha.antardasha.end)}) and ${dasha.pratyantardasha.lord} Pratyantardasha (${fmtMonthYear(dasha.pratyantardasha.start)} → ${fmtMonthYear(dasha.pratyantardasha.end)}). ${PLANET_ENERGY[dasha.pratyantardasha.lord]}`
      });
      if (type.reading === 'prediction' || type.reading === 'current') {
        energyBlocks.push({
          heading: 'The periods ahead',
          body: subs.map((m) => `${m.lord}: ${fmtMonthYear(m.start)} → ${fmtMonthYear(m.end)} — ${planetTheme(m.lord).split('.')[0]}.`).join(' ')
        });
      }
      const lordInfo = PLANET_INFO[dasha.mahadasha.lord];
      energyBlocks.push({
        heading: `${dasha.mahadasha.lord} as your period lord`,
        body: `${dasha.mahadasha.lord} (${lordInfo.hindi}) governs ${lordInfo.karaka.toLowerCase()}. In your chart it ${placement(chart, dasha.mahadasha.lord)}. Wherever this planet sits is where the period does its work.`
      });
      timeline = {
        past: { title: 'The last period', body: `The previous chapter was governed by ${chart.dasha.mahadashas[Math.max(0, chart.dasha.mahadashas.findIndex((m) => m.lord === dasha.mahadasha.lord) - 1)]?.lord || 'an earlier dasha'}. Its lessons are the foundation you are now standing on.` },
        present: { title: 'This period', body: `${dasha.mahadasha.lord} asks you for ${dasha.mahadasha.lord === 'Saturn' ? 'discipline and patience' : dasha.mahadasha.lord === 'Jupiter' ? 'faith, study and generosity' : dasha.mahadasha.lord === 'Rahu' ? 'ethical ambition' : dasha.mahadasha.lord === 'Ketu' ? 'release and reflection' : dasha.mahadasha.lord === 'Venus' ? 'enjoyment, art and committed love' : dasha.mahadasha.lord === 'Mars' ? 'courage and clean action' : dasha.mahadasha.lord === 'Mercury' ? 'learning, trade and speech' : dasha.mahadasha.lord === 'Moon' ? 'emotional honesty' : 'honest authority'}.` },
        future: { title: 'What follows', body: `${subs[1] ? `${subs[1].lord} from ${fmtMonthYear(subs[1].start)}: ${planetTheme(subs[1].lord)}` : 'The next major shift is beyond this window; use the current period fully.'}` }
      };
      addAdvice([
        `Work with ${dasha.mahadasha.lord}, not against it: ${PLANET_ENERGY[dasha.mahadasha.lord]}`,
        `Note the exact dates of your antardasha changes — they are natural decision windows.`,
        playbook.action
      ]);
      defaultDosDonts(playbook);
      subtitle = `${dasha.mahadasha.lord} Mahadasha · ${dasha.antardasha.lord} Antardasha`;
      break;
    }

    /* ----------------------------- transit ----------------------------- */
    case 'gochar':
    case 'sadesati':
    case 'jupiter':
    case 'rahuketu':
    case 'annual': {
      base();
      const transits = transitTable(chart);
      extraSections.push({
        kind: 'transit',
        title: 'Live transit table',
        data: { rows: transits, asOf: new Date().toISOString().slice(0, 10) }
      });
      const sat = transits.find((t) => t.planet === 'Saturn');
      const jup = transits.find((t) => t.planet === 'Jupiter');
      const rahu = transits.find((t) => t.planet === 'Rahu');
      const ss = sadeSati(chart.moon, chart.planets.length ? siderealLongitudes(toJD(new Date())).Saturn : 0);
      energyBlocks.push({
        heading: 'The sky right now',
        body: `${TRANSIT_NOTES.Saturn} Saturn is currently in ${sat.sign}, the ${ordinal(sat.fromMoon)} house from your natal Moon. ${TRANSIT_NOTES.Jupiter} Jupiter is in ${jup.sign}, ${ordinal(jup.fromMoon)} from your Moon.`
      });
      if (type.reading === 'sadesati' || type.reading === 'gochar' || type.reading === 'annual') {
        energyBlocks.push({
          heading: 'Sade Sati status',
          body: ss.active
            ? `Sade Sati is active — ${ss.phase}. Saturn is in the ${ordinal(ss.offset)} position from your Moon sign. This is a maturing period, not a punishment: ${sadeSatiGuidance(ss.phase)}`
            : `Sade Sati is not active for you right now; Saturn stands ${ordinal(ss.offset)} from your Moon sign. ${ss.offset === 4 || ss.offset === 10 ? 'You are in a supportive Saturn aspect window — good for structure and long commitments.' : 'Use this quieter Saturn window to build systems.'}`
        });
      }
      if (type.reading === 'jupiter') {
        energyBlocks.push({
          heading: 'Guru\'s blessing',
          body: `Jupiter transits ${jup.sign}, your ${ordinal(jup.fromMoon)} from the Moon and ${ordinal(jup.house)} from the lagna. Whatever house Jupiter touches expands — sometimes beyond your comfort, always toward growth. The most fertile window is while it remains in this sign.`
        });
      }
      if (type.reading === 'rahuketu') {
        energyBlocks.push({
          heading: 'The karmic axis',
          body: `Rahu is in ${rahu.sign} and Ketu in ${RASHIS[(signIndex(siderealLongitudes(toJD(new Date())).Ketu))].name}. Rahu shows where you are hungry and learning ambition; Ketu shows where you are quietly done. Both are teachers — one pushes, one releases.`
        });
      }
      if (type.reading === 'annual') {
        energyBlocks.push({
          heading: 'The year as a chapter',
          body: `${numeroscope ? `Numerologically this is your Personal Year ${numeroscope.personalYear.number} — ${numeroscope.personalYear.title}. ` : ''}Astrologically the loudest transits are Saturn in ${sat.sign} and Jupiter in ${jup.sign}. ${type.topic ? playbook.focus : ''}`
        });
      }
      dashaBlock();
      timeline = {
        past: { title: 'What Saturn was teaching', body: `Saturn moves one sign roughly every 2.5 years; the last 2.5 years have been a lesson in ${TRANSIT_NOTES.Saturn.split('.')[0].toLowerCase()}.` },
        present: { title: 'Now', body: `Saturn ${sat.fromMoon} from the Moon, Jupiter ${jup.fromMoon} — the current pressure and the current grace.` },
        future: { title: 'Next shift', body: `Saturn changes sign roughly every 30 months, Jupiter every 12. The next meaningful easing comes when Jupiter moves house from your Moon, usually within a year.` }
      };
      addAdvice([
        ss.active ? 'Sade Sati remedy that actually works: consistency, service and a daily discipline — not fear.' : 'Keep a steady Saturn practice: one promise kept daily.',
        'Journal transit dates so you can see patterns instead of guessing.',
        playbook.action
      ]);
      defaultDosDonts(playbook);
      subtitle = `Saturn in ${sat.sign} · Jupiter in ${jup.sign}`;
      break;
    }

    /* ----------------------------- topics ----------------------------- */
    case 'marriage':
    case 'career':
    case 'education':
    case 'health':
    case 'finance':
    case 'foreign':
    case 'property':
    case 'children':
    case 'spiritual':
    case 'legal': {
      base();
      const topicMap = {
        marriage: 'love', career: 'career', education: 'education', health: 'health',
        finance: 'money', foreign: 'career', property: 'money', children: 'family',
        spiritual: 'spiritual', legal: 'general'
      };
      const analysis = topicAnalysis(chart, topicMap[type.reading] || 'general');
      const play = TOPIC_PLAYBOOK[topicMap[type.reading] || 'general'];
      if (type.reading === 'foreign' || type.reading === 'property' || type.reading === 'legal' || type.reading === 'children') {
        const houseNo = { foreign: 12, property: 4, legal: 6, children: 5 }[type.reading];
        analysis.primaryHouse = houseNo;
        analysis.summary = `Your ${ordinal(houseNo)} house — ${HOUSES[houseNo - 1].name} — governs ${HOUSES[houseNo - 1].meaning.toLowerCase()}. It falls in ${RASHIS[(chart.lagnaSign + houseNo - 1) % 12].name}, ruled by ${houseLord(chart, houseNo)}, who ${(() => { const p = planet(chart, houseLord(chart, houseNo)); return p ? `sits in ${RASHIS[p.sign].name}, house ${p.house}` : 'needs care'; })()}.`;
      }
      energyBlocks.push({
        heading: `${play.label} in your chart`,
        body: analysis.summary
      });
      if (analysis.primaryHouse) {
        const occ = chart.houses[analysis.primaryHouse - 1].occupants;
        energyBlocks.push({
          heading: 'What sits there',
          body: occ.length
            ? `${occ.join(', ')} occupy this house, adding ${occ.map((o) => PLANET_GIFT[o].split(',')[0]).join(', ')}. ${occ.length > 1 ? 'Multiple planets here make this a dominant life theme — for better and for worse.' : 'A single occupant keeps the theme focused rather than overwhelming.'}`
            : `No planets occupy this house directly, which means the lord (${analysis.lord}) does the talking from ${analysis.lordPlanet ? `${RASHIS[analysis.lordPlanet.sign].name}, house ${analysis.lordPlanet.house}` : 'elsewhere'}.`
        });
      }
      energyBlocks.push({
        heading: 'Current timing',
        body: `${dashaLine(chart)} ${mahaTheme} For ${play.label.toLowerCase()}, this means the ${dasha.mahadasha.lord} period is either opening or testing this area — ${dasha.mahadasha.lord === analysis.lord || dasha.antardasha.lord === analysis.lord ? 'and your house lord is directly involved, which turns the volume up.' : 'watch the antardasha of your house lord for the loudest moments.'}`
      });
      const topicAdvice = {
        marriage: 'Do not rush a decision on a stranger\'s timeline. Compatibility is built in months of ordinary days.',
        career: 'Choose the role that compounds your skill, not only the one that raises your title.',
        education: 'One focused hour daily beats a weekend of panic. Protect the hour.',
        health: 'This is symbolic guidance only — please see a doctor for anything physical. Routines are your real remedy.',
        finance: 'Automate saving before you automate spending. Small and boring builds wealth.',
        foreign: 'Keep documents ready and applications moving; opportunity favours the prepared file.',
        property: 'Read every clause twice and verify ownership before you pay anything.',
        children: 'Patience and presence matter more than perfect timing.',
        spiritual: 'One practice, kept daily, will do more than ten practices sampled.',
        legal: 'Get a qualified lawyer. Astrology here is only a lens on your own patience and strategy.'
      }[type.reading];
      addAdvice([topicAdvice, play.action]);
      defaultDosDonts(play);
      timeline = {
        past: { title: 'How this area formed', body: `The ${analysis.lord} placement describes the pattern you inherited in ${play.label.toLowerCase()}: ${analysis.lordPlanet ? `${RASHIS[analysis.lordPlanet.sign].name} through house ${analysis.lordPlanet.house}` : 'an area still clarifying'}.` },
        present: { title: 'Now', body: `${analysis.summary}` },
        future: { title: 'What opens next', body: `The strongest forward window is while ${dasha.antardasha.lord} runs to ${fmtMonthYear(dasha.antardasha.end)}, followed by ${formatNextMaha(chart, now)}. Use the ${analysis.karaka} remedy discussed below in the remedies section if you take one.` }
      };
      subtitle = `${play.label} · ${chart.lagna.name} Lagna · ${dasha.mahadasha.lord} Mahadasha`;
      break;
    }

    /* --------------------------- compatibility --------------------------- */
    case 'milan':
    case 'ashtakoot':
    case 'mangal':
    case 'business':
    case 'friendship':
    case 'parentchild': {
      if (!partner) throw new Error('This reading needs the second person\'s birth details.');
      base();
      const pChart = partner.chart;
      const score = ashtakoot({ moon: chart.moon }, { moon: pChart.moon });
      extraSections.push({
        kind: 'compat',
        title: 'Ashtakoot scorecard',
        data: {
          total: score.total,
          max: score.max,
          verdict: score.verdict,
          parts: score.parts,
          doshas: score.doshas,
          a: { name: profile.name, moon: RASHIS[chart.moonSign].name, nakshatra: chart.moonNakshatra.name },
          b: { name: profile.partner.name || 'Partner', moon: RASHIS[pChart.moonSign].name, nakshatra: pChart.moonNakshatra.name }
        }
      });
      energyBlocks.push({
        heading: 'The headline',
        body: `${profile.name} has a ${RASHIS[chart.moonSign].name} Moon in ${chart.moonNakshatra.name}; ${profile.partner.name || 'your partner'} has a ${RASHIS[pChart.moonSign].name} Moon in ${pChart.moonNakshatra.name}. The Ashtakoot score is ${score.total}/36 — ${score.verdict.toLowerCase()}. ${score.total >= 18 ? 'This is a workable foundation; the traditions consider 18 the threshold of comfort.' : 'A lower score is not a verdict on love — it is a map of where conscious effort is required.'}`
      });
      energyBlocks.push({
        heading: 'Where the chemistry is',
        body: score.parts.map((p) => `${p.label} ${p.score}/${p.max} (${p.about})`).join(' · ')
      });
      if (type.reading === 'mangal' || type.reading === 'milan') {
        energyBlocks.push({
          heading: 'Mangal Dosha',
          body: `Yours: ${chart.mangal.present ? chart.mangal.note : 'no classical Mangal Dosha.'} Theirs: ${pChart.mangal.present ? pChart.mangal.note : 'no classical Mangal Dosha.'} ${chart.mangal.present && pChart.mangal.present ? 'When both charts carry the dosha, the classical texts consider it largely neutralised.' : ''}`
        });
      }
      energyBlocks.push({
        heading: 'Elements & temperament',
        body: `${RASHIS[chart.moonSign].name} is ${RASHIS[chart.moonSign].element} and ${RASHIS[pChart.moonSign].name} is ${RASHIS[pChart.moonSign].element}. ${elementPairing(RASHIS[chart.moonSign].element, RASHIS[pChart.moonSign].element)}`
      });
      const framing = {
        milan: 'The relationship as a whole', ashtakoot: 'Traditional compatibility', mangal: 'Mars influence on partnership',
        business: 'Professional partnership', friendship: 'The friendship bond', parentchild: 'The family dynamic'
      }[type.reading];
      timeline = {
        past: { title: 'What brought you together', body: `The nakshatra pair ${chart.moonNakshatra.name} and ${pChart.moonNakshatra.name} suggests the connection began through ${chart.moonNakshatra.quality.split(',')[0].toLowerCase()} meeting ${pChart.moonNakshatra.quality.split(',')[0].toLowerCase()}.` },
        present: { title: 'Now', body: `${framing} currently scores ${score.total}/36. ${score.doshas.length ? `Watch: ${score.doshas.map((d) => d.name).join(', ')}.` : 'No classical doshas are flagged in the eight-point check.'}` },
        future: { title: 'Where it can go', body: `${score.total >= 24 ? 'With this score, the bond has real staying power when communication stays honest.' : score.total >= 18 ? 'The bond can hold, provided both people treat repair as a shared skill.' : 'This bond asks for mature expectation-setting. That is not a failure — it is simply a different kind of work.'}` }
      };
      addAdvice([
        'Discuss money, family expectations and alone-time before assuming agreement.',
        'Repair fast: the gap between rupture and repair is what damages bonds, not the rupture itself.',
        TOPIC_PLAYBOOK[type.topic]?.action || 'Speak one honest sentence you have been withholding.'
      ]);
      dos = ['State needs as requests, not accusations', 'Keep one shared ritual', 'Give each other room to change', 'Check in weekly, briefly'];
      donts = ['Do not use compatibility as a verdict', 'Do not bring up old fights as evidence', 'Do not triangulate through family or friends'];
      subtitle = `${score.total}/36 gunas · ${score.verdict}`;
      break;
    }

    /* ----------------------------- special ----------------------------- */
    case 'combo': {
      base();
      dashaBlock();
      if (numeroscope) {
        energyBlocks.push({
          heading: 'Planets and numbers together',
          body: `Your Driver is ${numeroscope.driver.number} (${numeroscope.driver.planet}), Conductor ${numeroscope.conductor.number} (${numeroscope.conductor.planet}), Kua ${numeroscope.kua.kua}, and Personal Year ${numeroscope.personalYear.number} — ${numeroscope.personalYear.title}. ${numeroscope.combo?.verdict || ''} Your ${chart.lagna.name} lagna and ${RASHIS[chart.moonSign].name} Moon describe the outer personality and inner weather; the numbers describe the rhythm underneath both.`
        });
        extraSections.push(chartSection(chart));
      }
      timeline = {
        past: { title: 'Your karmic baseline', body: `Moon in ${chart.moonNakshatra.name} and Conductor ${numeroscope?.conductor.number} both point to an inherited pattern: ${numeroscope?.conductor.traits}` },
        present: { title: 'Now', body: `${dashaLine(chart)}` },
        future: { title: 'Where it goes', body: `Personal Year ${numeroscope?.personalYear.number} sets the theme; the dasha sets the timing. ${numeroscope?.personalYear.focus}` }
      };
      addAdvice([numeroscope?.personalYear.focus, playbook.action]);
      defaultDosDonts(playbook);
      break;
    }

    case 'nakshatra': {
      base();
      const nak = chart.moonNakshatra;
      extraSections.push({
        kind: 'chart',
        title: 'Nakshatra detail',
        data: {
          planets: chart.planets.map((p) => ({ name: p.name, sign: RASHIS[p.sign].name, degree: formatDegrees(p.lon), house: p.house, nakshatra: `${p.nakshatra.name} ${p.nakshatra.pada}`, retrograde: p.retrograde }))
        }
      });
      energyBlocks.push({
        heading: `${nak.name} — pada ${nak.pada}`,
        body: `Your Moon resides in ${nak.name}, the ${ordinal(nak.index + 1)} of 27 nakshatras, ruled by ${nak.lord} and presided over by ${nak.deity}. Its symbol is ${nak.symbol}. Gana: ${nak.gana}; Yoni: ${nak.yoni}; Nadi: ${nak.nadi}. The core quality is ${nak.quality.toLowerCase()}.`
      });
      energyBlocks.push({
        heading: 'Your dasha is born here',
        body: `Vimshottari dasha begins from your Moon's nakshatra lord, so ${nak.lord} is where your life timing originates. You began life with ${chart.dasha.balanceYears.toFixed(2)} years of ${chart.dasha.startLord} remaining.`
      });
      dashaBlock();
      timeline = {
        past: { title: 'Early imprint', body: `${nak.name} children are often described as ${nak.quality.toLowerCase()}.` },
        present: { title: 'Now', body: `${dashaLine(chart)}` },
        future: { title: 'Growth', body: `The deity ${nak.deity} points to your inner resource: call on that quality when the period feels heavy.` }
      };
      addAdvice([`Design a weekly ritual around ${nak.deity}.`, playbook.action]);
      defaultDosDonts(playbook);
      subtitle = `${nak.name} nakshatra · pada ${nak.pada}`;
      break;
    }

    case 'arudha': {
      base();
      const ar = chart.arudha;
      energyBlocks.push({
        heading: 'How the world sees you',
        body: `Your Arudha Lagna falls in ${RASHIS[ar.sign].name}. The world experiences you as ${RASHIS[ar.sign].element.toLowerCase()}-leaning — ${SIGN_PERSONALITY[RASHIS[ar.sign].name]} This is the "image chart", and it can differ from who you actually are.`
      });
      energyBlocks.push({
        heading: 'The gap to manage',
        body: `Because your lagna is ${chart.lagna.name} and your image is ${RASHIS[ar.sign].name}, people may expect ${RASHIS[ar.sign].element.toLowerCase()} behaviour from you while your own instinct is ${chart.lagna.element.toLowerCase()}. Naming that gap prevents a lot of misunderstanding.`
      });
      dashaBlock();
      timeline = {
        past: { title: 'The image you built', body: `Your public identity took shape through the ${ordinal((ar.sign - chart.lagnaSign + 12) % 12 + 1)} house from your lagna.` },
        present: { title: 'Now', body: `Reputation is currently shaped by ${dasha.mahadasha.lord} — ${mahaTheme}` },
        future: { title: 'Ahead', body: `As the dasha moves, the world's perception will shift toward ${dasha.antardasha.lord} themes.` }
      };
      addAdvice(['Curate your public presence deliberately; it is a tool, not a lie.', playbook.action]);
      defaultDosDonts(playbook);
      break;
    }

    case 'yogas': {
      base();
      energyBlocks.push({
        heading: chart.yogas.length ? `${chart.yogas.length} yogas found` : 'No major classical yogas flagged',
        body: chart.yogas.length
          ? chart.yogas.map((y) => `${y.name} (${y.strength}): ${y.note}`).join(' ')
          : 'The simplified yoga scan found no Panch Mahapurusha, Gaja Kesari, Budha-Aditya or Raja Yoga combinations in your chart. That is not a deficiency — most charts are built from ordinary placements, and ordinary placements with discipline outperform a famous yoga without it.'
      });
      energyBlocks.push({
        heading: 'Doshas to be aware of',
        body: `${chart.mangal.present ? chart.mangal.note : 'No Mangal Dosha. '} ${chart.yogas.some((y) => y.name === 'Kemadruma Dosha') ? 'Kemadruma Dosha is indicated — build a deliberate support network.' : 'No Kemadruma Dosha is indicated in this scan.'}`
      });
      dashaBlock();
      timeline = {
        past: { title: 'When the yoga activated', body: 'Yogas ripen during the dasha of their participating planets.' },
        present: { title: 'Now', body: `${dasha.mahadasha.lord} is emphasising ${chart.yogas.map((y) => y.name).join(', ') || 'your foundational placements'}.` },
        future: { title: 'Ahead', body: `The next activation comes with ${formatNextMaha(chart, now)}.` }
      };
      addAdvice(['Yogas describe potential — effort is the ignition key.', playbook.action]);
      defaultDosDonts(playbook);
      break;
    }

    case 'atmakaraka': {
      base();
      const ak = chart.atmakaraka;
      energyBlocks.push({
        heading: `Atmakaraka: ${ak.name}`,
        body: `${ak.name} at ${formatDegrees(ak.lon)} in ${RASHIS[ak.sign].name} is your soul significator — the planet with the most degrees in your chart. It shows the lesson your soul came to complete. ${PLANET_INFO[ak.name].karaka} is the territory.`
      });
      energyBlocks.push({
        heading: 'The lesson',
        body: `The Atmakaraka is rarely comfortable; it is the area where life keeps asking you to grow. ${PLANET_GIFT[ak.name]} is your gift here. ${PLANET_WATCH[ak.name]} is the shadow. ${PLANET_ENERGY[ak.name]}`
      });
      dashaBlock();
      timeline = {
        past: { title: 'Where the lesson started', body: `${ak.name} in your ${ordinal(ak.house)} house means the teaching arrives through ${HOUSES[ak.house - 1].meaning.toLowerCase()}.` },
        present: { title: 'Now', body: `${dasha.mahadasha.lord} interacts with your Atmakaraka's agenda directly or by aspect.` },
        future: { title: 'Integration', body: `When you act from ${PLANET_GIFT[ak.name]}, the chart stops feeling like a test and starts feeling like a vocation.` }
      };
      addAdvice([`Do one thing daily that expresses ${ak.name}'s highest quality.`, playbook.action]);
      defaultDosDonts(playbook);
      break;
    }

    case 'pastlife': {
      base();
      const ketu = planet(chart, 'Ketu');
      const rahu = planet(chart, 'Rahu');
      const house12 = houseLord(chart, 12);
      energyBlocks.push({
        heading: 'Ketu: what you already mastered',
        body: `Ketu in your ${ordinal(ketu.house)} house (${signOf(ketu)}) points to an area that feels strangely familiar — even dull, because you have done it before. ${HOUSES[ketu.house - 1].meaning} is your inherited skill.`
      });
      energyBlocks.push({
        heading: 'Rahu: what you came to learn',
        body: `Rahu in your ${ordinal(rahu.house)} house (${signOf(rahu)}) is the hunger of this lifetime. ${HOUSES[rahu.house - 1].meaning} is where you are meant to grow, even if you feel clumsy there.`
      });
      energyBlocks.push({
        heading: 'The 12th house contract',
        body: `The 12th house (liberation and the past) falls in ${RASHIS[(chart.lagnaSign + 11) % 12].name}, ruled by ${house12}, which ${(() => { const p = planet(chart, house12); return p ? `sits in your ${ordinal(p.house)} house` : 'is placed elsewhere'; })()}. This is the release valve of the chart.`
      });
      timeline = {
        past: { title: 'What you carried in', body: `${PLANET_GIFT[ketu.name]} came easily; the debt was in over-identifying with it.` },
        present: { title: 'Now', body: `${dasha.mahadasha.lord} is the vehicle for this life's karmic curriculum.` },
        future: { title: 'The direction of growth', body: `Move toward your Rahu house deliberately — one small, unglamorous step at a time.` }
      };
      addAdvice(['Let the familiar skill serve the unfamiliar growth.', playbook.action]);
      defaultDosDonts(TOPIC_PLAYBOOK.spiritual);
      break;
    }

    case 'remedies': {
      base();
      const weak = chart.planets
        .filter((p) => ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].includes(p.name))
        .filter((p) => {
          const info = PLANET_INFO[p.name];
          return p.sign === info.debil || [6, 8, 12].includes(p.house);
        })
        .slice(0, 3);
      energyBlocks.push({
        heading: 'Planets asking for support',
        body: weak.length
          ? weak.map((p) => `${p.name} (${RASHIS[p.sign].name}, house ${p.house}) — ${PLANET_INFO[p.name].gem} is its traditional gem; mantra: ${PLANET_INFO[p.name].mantra}. Wear or chant only after confirming with a qualified Jyotishi.`).join(' ')
          : 'No planet is in a clearly weak classical position in this scan. That means your remedies are behavioural, not gemmological.'
      });
      if (numeroscope) {
        energyBlocks.push({
          heading: 'Numerological upay',
          body: numeroscope.remedies.picked.length
            ? numeroscope.remedies.picked.map((r) => `For ${r.condition}: ${r.yantra}. ${r.note}`).join(' ')
            : `Your Lo Shu grid has ${numeroscope.grid.missing.length} missing number(s). Wear ${PLANETS[numeroscope.driver.number].colour.toLowerCase()} on ${PLANETS[numeroscope.driver.number].day}s and keep the number ${numeroscope.lucky.numbers.join(', ')} close.`
        });
      }
      energyBlocks.push({
        heading: 'The honest hierarchy',
        body: 'In the classical view, karma (action), discipline (niyama) and service (seva) outrank any object. A gemstone is a support, not a substitute. Chanting, fasting, charity and consistency are cheaper and often more effective.'
      });
      extraSections.push({
        kind: 'remedies',
        title: 'Remedy card',
        data: {
          gems: weak.map((p) => ({ planet: p.name, gem: PLANET_INFO[p.name].gem, metal: PLANET_INFO[p.name].metal, mantra: PLANET_INFO[p.name].mantra, day: PLANET_INFO[p.name].day })),
          caution: GEM_GUIDANCE.caution,
          note: GEM_GUIDANCE.note
        }
      });
      dashaBlock();
      timeline = {
        past: { title: 'What has been repeating', body: 'Remedies are aimed at the loop you have run longest — usually visible in your 6th, 8th and 12th houses.' },
        present: { title: 'Now', body: `${dasha.mahadasha.lord} makes ${PLANET_ENERGY[dasha.mahadasha.lord]} the most useful practice this year.` },
        future: { title: 'What to watch', body: 'Give any remedy 40 days of honest consistency before judging it.' }
      };
      addAdvice(['Pick one remedy, not five.', 'Pair every upay with one act of service.', playbook.action]);
      defaultDosDonts(TOPIC_PLAYBOOK.spiritual);
      break;
    }

    case 'prashna': {
      const prashnaChart = chart;
      base();
      energyBlocks.push({
        heading: 'The chart of the question',
        body: `Cast for this exact moment at ${loc.name}, the rising sign is ${prashnaChart.lagna.name} and the Moon is in ${prashnaChart.moonNakshatra.name} (pada ${prashnaChart.moonNakshatra.pada}), in the ${ordinal(prashnaChart.planets.find((p) => p.name === 'Moon').house)} house of this chart. In Prashna, the Moon's condition is the mind of the querent — ${prashnaChart.moonNakshatra.quality.toLowerCase()}.`
      });
      energyBlocks.push({
        heading: 'Your question',
        body: `You asked: “${profile.question || 'What should I know right now?'}” The lagna lord of this moment is ${prashnaChart.lagna.lord}, which ${(() => { const p = prashnaChart.planets.find((x) => x.name === prashnaChart.lagna.lord); return p ? `sits in the ${ordinal(p.house)} house` : 'is not placed'; })()}. A lagna lord in a kendra (1/4/7/10) suggests the matter is close to resolution; in a dusthana (6/8/12) it asks for patience and cleanup first.`
      });
      dashaBlock();
      timeline = {
        past: { title: 'Background', body: `The 4th house of this chart (${RASHIS[(prashnaChart.lagnaSign + 3) % 12].name}) shows what already happened.` },
        present: { title: 'Now', body: `Moon in ${prashnaChart.moonNakshatra.name} indicates a mind that is ${prashnaChart.moonNakshatra.quality.split(',')[0].toLowerCase()}.` },
        future: { title: 'The answer', body: `Traditional Prashna reads the 11th house for the fulfilment of desire, currently in ${RASHIS[(prashnaChart.lagnaSign + 10) % 12].name}. A reasonable window to act is while the Moon remains in this nakshatra — roughly the next 24 hours — then reassess.` }
      };
      addAdvice(['Ask the question once, cleanly, and then act on what you already know.', playbook.action]);
      defaultDosDonts(TOPIC_PLAYBOOK.decision);
      subtitle = `${prashnaChart.lagna.name} Lagna · ${prashnaChart.moonNakshatra.name} Moon`;
      break;
    }

    default: {
      base();
      dashaBlock();
      timeline = {
        past: { title: 'Foundation', body: `Born under ${chart.lagna.name} with a ${RASHIS[chart.moonSign].name} Moon.` },
        present: { title: 'Now', body: dashaLine(chart) },
        future: { title: 'Ahead', body: `The next major shift is ${formatNextMaha(chart, now)}.` }
      };
      addAdvice([playbook.action]);
      defaultDosDonts(playbook);
    }
  }

  const facts = [
    { label: 'Lagna', value: `${chart.lagna.name} ${formatDegrees(chart.ascendant)}` },
    { label: 'Moon', value: `${RASHIS[chart.moonSign].name} · ${chart.moonNakshatra.name}` },
    { label: 'Sun', value: RASHIS[chart.sunSign].name },
    { label: 'Dasha', value: `${dasha.mahadasha.lord} / ${dasha.antardasha.lord}` }
  ];

  const closing = CLOSINGS[(type.id.length + chart.lagnaSign) % CLOSINGS.length];

  return {
    typeId: type.id,
    title: type.name,
    subtitle,
    subject: {
      name: profile.name,
      dob: profile.dob,
      tob: profile.tob,
      place: loc.name,
      localTime: localLabel,
      question: profile.question || null,
      partner: profile.partner?.name || null
    },
    question: profile.question || null,
    facts,
    sections: [
      { kind: 'planets', title: 'Planetary positions at your birth', data: { rows: chart.planets.map((p) => ({
        name: p.name,
        glyph: PLANET_INFO[p.name].glyph,
        sign: RASHIS[p.sign].name,
        degree: formatDegrees(p.lon),
        house: p.house,
        nakshatra: `${p.nakshatra.name} ${p.nakshatra.pada}`,
        retrograde: p.retrograde
      })), lagna: { sign: chart.lagna.name, degree: formatDegrees(chart.ascendant), symbol: chart.lagna.symbol } } },
      ...extraSections,
      { kind: 'energy', title: 'Energy analysis', data: { blocks: energyBlocks } },
      ...(timeline ? [{ kind: 'timeline', title: 'Past · Present · Future', data: timeline }] : []),
      { kind: 'advice', title: 'Practical advice', data: { items: [...new Set(advice)].slice(0, 6) } },
      { kind: 'dosdonts', title: 'Do\'s & Don\'ts', data: { dos: [...new Set(dos)].slice(0, 5), donts: [...new Set(donts)].slice(0, 5) } },
      ...(numeroscope ? [{ kind: 'numerology', title: 'Your numbers', data: {
        driver: numeroscope.driver.number, driverPlanet: numeroscope.driver.planet,
        conductor: numeroscope.conductor.number, conductorPlanet: numeroscope.conductor.planet,
        kua: numeroscope.kua.kua, personalYear: numeroscope.personalYear.number,
        personalYearTitle: numeroscope.personalYear.title, grid: numeroscope.grid.grid,
        combo: numeroscope.combo, lucky: numeroscope.lucky,
        gift: PLANET_GIFT[numeroscope.driver.planet]
      } }] : []),
      { kind: 'closing', title: 'Closing message', data: { body: closing } },
      { kind: 'disclaimer', title: 'A gentle disclaimer', data: { body: DISCLAIMER } }
    ]
  };
}

/* ------------------------------------------------------------------ */
/* Misc helpers                                                        */
/* ------------------------------------------------------------------ */

function strengthHouse(chart) {
  const counts = chart.houses.map((h) => h.occupants.length);
  const max = Math.max(...counts);
  return counts.indexOf(max) + 1;
}

function careerFlavour(chart) {
  const lord10 = houseLord(chart, 10);
  const flavour = {
    Sun: 'authority, government, leadership and visibility',
    Moon: 'care that involves people — hospitality, health, public-facing work',
    Mars: 'engineering, defence, surgery, sport, anything competitive',
    Mercury: 'trade, writing, analytics, teaching and commerce',
    Jupiter: 'advisory, education, finance, law and mentoring',
    Venus: 'design, luxury, media, beauty and relationship-led work',
    Saturn: 'systems, infrastructure, long projects and administration',
    Rahu: 'technology, foreign markets and unconventional paths',
    Ketu: 'research, spirituality, healing and behind-the-scenes mastery'
  };
  return flavour[lord10];
}

function sadeSatiGuidance(phase) {
  if (phase?.includes('First')) return 'the first phase clears old structures — simplify rather than expand.';
  if (phase?.includes('Second')) return 'the peak phase compresses your life to essentials. Sleep, duty and honesty get you through with credit.';
  return 'the final phase is integration — the pressure eases but the lessons must be kept.';
}

function elementPairing(a, b) {
  if (a === b) return `Two ${a.toLowerCase()} Moons understand each other instinctively — and can also amplify each other's blind spots.`;
  const map = {
    'Fire-Air': 'Fire and Air feed each other: ideas and action move fast together.',
    'Air-Fire': 'Air and Fire feed each other: ideas and action move fast together.',
    'Earth-Water': 'Earth and Water are naturally fertile together — feeling gets structure.',
    'Water-Earth': 'Water and Earth are naturally fertile together — feeling gets structure.',
    'Fire-Water': 'Fire and Water create steam — passionate, sometimes volatile, always alive.',
    'Water-Fire': 'Water and Fire create steam — passionate, sometimes volatile, always alive.',
    'Earth-Air': 'Earth and Air need translation: one wants proof, the other wants possibility.',
    'Air-Earth': 'Earth and Air need translation: one wants proof, the other wants possibility.'
  };
  return map[`${a}-${b}`] || 'The elements ask for conscious translation between you.';
}

function formatNextMaha(chart, now) {
  const next = chart.dasha.mahadashas.find((m) => m.start > now);
  return next ? `${next.lord} Mahadasha beginning ${fmtMonthYear(next.start)} — ${planetTheme(next.lord)}` : 'an already-running period';
}

export { PLANETS };
