import { getReading } from '../data/catalog.js';
import { buildTarotReading } from './tarot.js';
import { buildKundliReading, computeKundli } from './kundli.js';
import { buildNumeroscope, reduceNumber, nameNumber, PLANETS, NUMBER_PERSONALITY, PERSONAL_YEAR, MISSING_NUMBER, LO_SHU_MEANING } from './numerology.js';
import { CLOSINGS, DISCLAIMER, TOPIC_PLAYBOOK, PLANET_ENERGY, PLANET_GIFT } from '../data/interpretations.js';

const REQUIRED_LABELS = {
  name: 'name',
  dob: 'date of birth',
  tob: 'time of birth',
  place: 'place of birth',
  question: 'question',
  mobile: 'mobile number'
};

export function validateInputs(type, profile) {
  const missing = (type.requires || []).filter((field) => {
    if (field === 'tob' && type.engine === 'numerology') return false;
    return !profile?.[field];
  });
  if (type.needsPartner && !profile?.partner?.dob) missing.push('dob2');
  if (missing.length) {
    const err = new Error(`Please share your ${missing.map((m) => REQUIRED_LABELS[m] || m).join(', ')} before I can open this reading.`);
    err.status = 422;
    err.missing = missing;
    throw err;
  }
  return true;
}

/* ------------------------------------------------------------------ */
/* Numerology readings                                                 */
/* ------------------------------------------------------------------ */

function numerologyReading(type, profile) {
  const n = buildNumeroscope({ name: profile.name, dob: profile.dob, gender: profile.gender || 'female', onDate: new Date() });
  const playbook = TOPIC_PLAYBOOK.general;
  const base = {
    typeId: type.id,
    title: type.name,
    subject: { name: profile.name, dob: profile.dob, gender: profile.gender },
    facts: [
      { label: 'Driver', value: `${n.driver.number} · ${n.driver.planet}` },
      { label: 'Conductor', value: `${n.conductor.number} · ${n.conductor.planet}` },
      { label: 'Kua', value: `${n.kua.kua}` },
      { label: 'Personal Year', value: `${n.personalYear.number}` }
    ]
  };

  const first = String(profile.name || 'Seeker').split(' ')[0];
  const energy = {
    heading: `Namaste, ${first} 🙏`,
    body: `Driver ${n.driver.number} (${n.driver.planet}) is the person you show up as; Conductor ${n.conductor.number} (${n.conductor.planet}) is the destiny you are walking toward. ${n.driver.title}: ${n.driver.traits} ${n.conductor.number !== n.driver.number ? `The ${n.conductor.planet} current adds ${n.conductor.traits.toLowerCase()}` : 'Driver and Conductor are the same number, which makes you unusually single-minded — a gift when channelled, a rut when not.'} ${n.combo ? n.combo.verdict : ''}`
  };

  const blocks = [energy];

  if (type.reading === 'loshu' || type.reading === 'lifepath') {
    blocks.push({
      heading: 'The Lo Shu grid',
      body: `${n.grid.missing.length ? `Missing numbers: ${n.grid.missing.join(', ')}. These are the quiet gaps the tradition watches — ${n.grid.missing.map((m) => MISSING_NUMBER[m].theme.toLowerCase()).join(', ')}.` : 'Every number 1–9 is present in your grid. That is rare and it means no area of life is structurally starved — the work is balance, not repair.'} ${n.grid.repeated.length ? `Repeated: ${n.grid.repeated.map((r) => `${r.number} (${r.count}×)`).join(', ')} — an amplified theme.` : ''}`
    });
    blocks.push({
      heading: 'Strong planes',
      body: `${n.grid.planes.filter((p) => p.present).map((p) => `${p.name}: ${p.gift}`).join(' ') || 'No complete plane yet — each line is one number short. That is common and not a flaw.'}`
    });
    if (n.grid.planes.filter((p) => !p.present).length) {
      blocks.push({
        heading: 'Planes to build',
        body: n.grid.planes.filter((p) => !p.present).slice(0, 4).map((p) => `${p.name} (${p.cells.join(', ')}) — ${p.lacking}`).join(' ')
      });
    }
  }

  if (type.reading === 'personalyear' || type.reading === 'lifepath') {
    blocks.push({
      heading: `Personal Year ${n.personalYear.number}: ${n.personalYear.title}`,
      body: `${n.personalYear.summary} Your personal year began on ${n.personalYear.startedOn} — not on 1 January. This month carries a ${n.personalMonth.number} flavour (${n.personalMonth.title.toLowerCase()}), and today vibrates to ${n.personalDay.number}. Focus: ${n.personalYear.focus} Caution: ${n.personalYear.caution}`
    });
  }

  if (type.reading === 'name') {
    blocks.push({
      heading: 'Name vibration',
      body: `Your first name reduces to ${n.name.first.number}; your full name reduces to ${n.name.full.number}. ${n.name.notes.join(' ')} The tradition prefers name totals in the 1 (Sun), 3 (Jupiter), 5 (Mercury) and 6 (Venus) family, and advises against 4 and 8.`
    });
    blocks.push({
      heading: 'Letter-by-letter',
      body: n.name.full.rows.map((r) => `${r.letter}=${r.value}`).join(' · ')
    });
  }

  if (type.reading === 'mobile') {
    const mobileNum = reduceNumber(String(profile.mobile || '').replace(/\D/g, ''));
    blocks.push({
      heading: `Mobile number ${profile.mobile}`,
      body: `The number reduces to ${mobileNum} (${PLANETS[mobileNum].planet}). ${NUMBER_PERSONALITY[mobileNum].traits} ${PLANET_ENERGY[PLANETS[mobileNum].planet]} If this planet is friendly to your Driver ${n.driver.number}, the number supports you; if it is hostile, consider a second number for business.`
    });
  }

  const gridSection = {
    kind: 'numerology-grid',
    title: 'Your Lo Shu grid',
    data: {
      grid: n.grid.grid,
      driver: n.driver.number,
      conductor: n.conductor.number,
      kua: n.kua.kua,
      missing: n.grid.missing,
      repeated: n.grid.repeated,
      notes: n.grid.notes
    }
  };

  const remediesSection = {
    kind: 'remedies',
    title: 'Remedies & upay',
    data: {
      items: n.remedies.picked.map((r) => ({ condition: r.condition, remedy: r.yantra, note: r.note })),
      notes: n.remedies.notes,
      lucky: n.lucky,
      caution: 'Yantras and stones are traditional supports. None of this replaces medical, legal or financial advice.'
    }
  };

  const timeline = {
    past: { title: 'What your numbers inherited', body: `${n.driver.title} energy has been with you since birth — ${n.driver.traits.split(',')[0].toLowerCase()} is your default setting. Your Kua ${n.kua.kua} places you in the ${n.kua.group.name}, which shapes which directions and environments feel naturally supportive.` },
    present: { title: 'Where you stand', body: `You are in a Personal Year ${n.personalYear.number}: ${n.personalYear.summary} ${n.personalYear.focus}` },
    future: { title: 'The next turn', body: `The next personal year begins on 5 February ${n.personalYear.year + 1}, shifting to a ${reduceNumber(n.personalYear.number + 1)} year — ${PERSONAL_YEAR[reduceNumber(n.personalYear.number + 1)].title}. ${PERSONAL_YEAR[reduceNumber(n.personalYear.number + 1)].focus}` }
  };

  return {
    ...base,
    subtitle: `Driver ${n.driver.number} · Conductor ${n.conductor.number} · Kua ${n.kua.kua}`,
    sections: [
      gridSection,
      { kind: 'energy', title: 'Energy analysis', data: { blocks } },
      { kind: 'timeline', title: 'Past · Present · Future', data: timeline },
      {
        kind: 'advice',
        title: 'Practical advice',
        data: {
          items: [
            n.personalYear.focus,
            `Lead with your Driver planet: ${PLANET_ENERGY[n.driver.planet]}`,
            `Lucky numbers ${n.lucky.numbers.join(', ')}; lucky colour ${n.lucky.colour}; strongest day ${n.lucky.day}.`,
            n.grid.missing.length ? `Build the missing ${n.grid.missing[0]} energy: ${MISSING_NUMBER[n.grid.missing[0]].text}` : 'Balance all nine energies — no single number should run your life.',
            'Recalculate your personal year every 5 February, not on 1 January.'
          ]
        }
      },
      {
        kind: 'dosdonts',
        title: 'Do\'s & Don\'ts',
        data: {
          dos: ['Use your personal year to time big moves', 'Keep your name spelling stable once corrected', 'Track the number patterns for 90 days before judging them'],
          donts: ['Do not change your name repeatedly', 'Do not wear five remedies at once', 'Do not treat numbers as fixed fate']
        }
      },
      remediesSection,
      { kind: 'closing', title: 'Closing message', data: { body: CLOSINGS[n.conductor.number % CLOSINGS.length] } },
      { kind: 'disclaimer', title: 'A gentle disclaimer', data: { body: DISCLAIMER } }
    ].filter((s) => s.data)
  };
}

/* ------------------------------------------------------------------ */
/* Combo readings                                                      */
/* ------------------------------------------------------------------ */

function comboReading(type, profile) {
  const tarotType = {
    ...getReading('tarot-standard'),
    id: type.id,
    name: type.name,
    cards: type.cards,
    spread: type.spread,
    topic: type.topic
  };
  const tarot = buildTarotReading(tarotType, profile);
  const kundli = buildKundliReading({ ...getReading('kundli-janam'), id: type.id, name: type.name, topic: type.topic }, profile);
  const chartSection = kundli.sections.find((s) => s.kind === 'chart');
  const dashaSection = kundli.sections.find((s) => s.kind === 'dasha');
  const kundliEnergy = kundli.sections.find((s) => s.kind === 'energy');
  const tarotEnergy = tarot.sections.find((s) => s.kind === 'energy');

  const mergedEnergy = {
    kind: 'energy',
    title: 'Energy analysis',
    data: {
      blocks: [
        ...tarotEnergy.data.blocks,
        ...kundliEnergy.data.blocks,
        {
          heading: 'How the three languages agree',
          body: `The cards describe the moment, the chart describes the life and the numbers describe the rhythm. Where they overlap, take it seriously; where they differ, trust the one that made you feel seen.`
        }
      ]
    }
  };

  const sections = [
    ...tarot.sections.filter((s) => s.kind === 'cards'),
    ...(chartSection ? [chartSection] : []),
    ...(dashaSection ? [dashaSection] : []),
    mergedEnergy,
    tarot.sections.find((s) => s.kind === 'timeline'),
    tarot.sections.find((s) => s.kind === 'advice'),
    tarot.sections.find((s) => s.kind === 'dosdonts'),
    tarot.sections.find((s) => s.kind === 'numerology'),
    tarot.sections.find((s) => s.kind === 'closing'),
    tarot.sections.find((s) => s.kind === 'disclaimer')
  ].filter(Boolean);

  return {
    ...tarot,
    title: type.name,
    subtitle: `${type.name} · ${kundli.subtitle}`,
    sections
  };
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

export function generateReading(typeId, profile) {
  const type = getReading(typeId);
  if (!type) {
    const err = new Error('Unknown reading type.');
    err.status = 404;
    throw err;
  }
  validateInputs(type, profile);
  if (type.engine === 'tarot') return buildTarotReading(type, profile);
  if (type.engine === 'kundli') return buildKundliReading(type, profile);
  if (type.engine === 'numerology') return numerologyReading(type, profile);
  if (type.engine === 'combo') return comboReading(type, profile);
  throw new Error('Unsupported reading engine.');
}
