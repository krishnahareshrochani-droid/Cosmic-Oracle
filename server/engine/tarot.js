import { TAROT_DECK } from '../data/tarot.js';
import { SPREADS } from '../data/spreads.js';
import { TOPIC_PLAYBOOK, CLOSINGS, DISCLAIMER, PLANET_ENERGY, PLANET_GIFT } from '../data/interpretations.js';
import { buildNumeroscope } from './numerology.js';

/* ------------------------------------------------------------------ */
/* Deterministic shuffling                                             */
/* ------------------------------------------------------------------ */

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function drawCards(seed, count) {
  const rng = mulberry32(hashString(seed));
  const deck = [...TAROT_DECK];
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck.slice(0, count).map((card, index) => {
    const reversed = rng() < 0.32;
    return { card, reversed, drawIndex: index, pull: Math.floor(rng() * 90) + 1 };
  });
}

/** Pick one archetype by number (for personality / year cards). */
export function cardByNumber(n) {
  const major = TAROT_DECK.filter((c) => c.arcana === 'major');
  return major[((n - 1) % 22 + 22) % 22];
}

/* ------------------------------------------------------------------ */
/* Composition helpers                                                 */
/* ------------------------------------------------------------------ */

const ELEMENT_BLURB = {
  Fire: 'Fire cards bring action, courage, ambition and heat. They ask for movement rather than more analysis.',
  Water: 'Water cards bring emotion, intuition and relationship truth. They ask you to feel before you decide.',
  Air: 'Air cards bring thought, communication and clarity. They ask you to name things precisely.',
  Earth: 'Earth cards bring money, body, craft and patience. They ask for a plan with dates in it.'
};

const SUIT_NOUN = {
  wands: 'work and will',
  cups: 'heart and relationships',
  swords: 'mind and communication',
  pentacles: 'money and material life'
};

function dominantElement(cards) {
  const tally = {};
  cards.forEach(({ card }) => { tally[card.element] = (tally[card.element] || 0) + 1; });
  const sorted = Object.entries(tally).sort((a, b) => b[1] - a[1]);
  return { element: sorted[0][0], count: sorted[0][1], tally };
}

function dominantSuit(cards) {
  const tally = {};
  cards.forEach(({ card }) => {
    if (card.suit) tally[card.suit] = (tally[card.suit] || 0) + 1;
  });
  const sorted = Object.entries(tally).sort((a, b) => b[1] - a[1]);
  return sorted.length ? { suit: sorted[0][0], count: sorted[0][1] } : null;
}

function orientationPhrase(reversed) {
  return reversed ? 'reversed' : 'upright';
}

/* ------------------------------------------------------------------ */
/* Reading builder                                                     */
/* ------------------------------------------------------------------ */

export function buildTarotReading(type, profile, options = {}) {
  const positions = SPREADS[type.spread] || SPREADS.micro;
  const count = type.cards || positions.length;
  // Daily pulls stay stable for the whole day; every other reading is drawn fresh.
  const stamp = type.spread === 'daily'
    ? new Date().toISOString().slice(0, 10)
    : new Date().toISOString();
  const seedBase = `${type.id}|${profile.name}|${profile.dob}|${profile.question || ''}|${profile.seed || stamp}`;
  const draws = drawCards(seedBase, count).map((d, i) => ({
    ...d,
    position: positions[i] || { label: `Card ${i + 1}`, prompt: 'An additional layer of the reading' }
  }));

  const numeroscope = profile.dob
    ? buildNumeroscope({ name: profile.name || 'Seeker', dob: profile.dob, gender: profile.gender || 'female' })
    : null;

  const playbook = TOPIC_PLAYBOOK[type.topic] || TOPIC_PLAYBOOK.general;
  const reversedCount = draws.filter((d) => d.reversed).length;
  const majors = draws.filter((d) => d.card.arcana === 'major');
  const dom = dominantElement(draws);
  const suit = dominantSuit(draws);

  const cards = draws.map(({ card, reversed, position, pull }) => ({
    name: card.name,
    arcana: card.arcana,
    suit: card.suit,
    rank: card.rank,
    element: card.element,
    astrology: card.astrology,
    keywords: card.keywords,
    reversed,
    orientation: orientationPhrase(reversed),
    position: position.label,
    prompt: position.prompt,
    pull,
    text: reversed ? card.reversed : card.upright,
    advice: card.advice
  }));

  const first = String(profile.name || 'Seeker').split(' ')[0];
  const energyBlocks = [
    {
      heading: `Namaste, ${first} 🙏`,
      body: `You came with ${profile.question ? `one clear question — “${String(profile.question).trim().replace(/[?.!]+$/, '')}”` : 'an open prayer rather than a question'}. The deck answered with ${draws.length} card${draws.length > 1 ? 's' : ''}: ${draws.map((d) => d.card.name).join(', ')}. Before the interpretation, notice your body — the card that made you sit up is usually the one that matters most.`
    },
    {
      heading: `The field you are standing in`,
      body: `${dom.count} of your ${draws.length} cards speak the language of ${dom.element.toLowerCase()}. ${ELEMENT_BLURB[dom.element]} ${suit ? `The reading is weighted toward the ${suit.suit} suit — ${SUIT_NOUN[suit.suit]} — which means this question is really about ${SUIT_NOUN[suit.suit]}, even if it arrived wearing another costume.` : 'The balance between major and minor arcana suggests this is a lived, practical chapter rather than a destiny-level turning point.'}`
    },
    {
      heading: majors.length ? 'Destiny is leaning in' : 'This is yours to shape',
      body: majors.length
        ? `${majors.length} Major Arcana card${majors.length > 1 ? 's' : ''} (${majors.map((m) => m.card.name).join(', ')}) appeared. Major Arcana mark chapters, not incidents — this situation carries more weight than it looks like it does, and it is asking for a deliberate response rather than a quick fix.`
        : 'Only minor arcana arrived, which is quietly good news: nothing here is fated. This is a situation built from ordinary choices, and ordinary choices are exactly what you control.'
    },
    {
      heading: reversedCount ? 'What is turned inward' : 'The current is clean',
      body: reversedCount
        ? `${reversedCount} card${reversedCount > 1 ? 's are' : ' is'} reversed. Reversed cards are not "bad" — they show energy that is blocked, internalised, or asking to be worked with consciously rather than expressed outward. ${reversedCount >= Math.ceil(draws.length / 2) ? 'With more than half the spread reversed, the real action of this reading is happening inside you first.' : 'Treat them as the soft spots to hold with attention.'}`
        : 'Every card arrived upright, which means the energy is moving outward and openly. What you see is what is happening — very little is being hidden from you right now.'
    }
  ];

  if (numeroscope) {
    energyBlocks.push({
      heading: `Your numbers, overlaid`,
      body: `Your Driver number is ${numeroscope.driver.number} (${numeroscope.driver.planet}), your Conductor is ${numeroscope.conductor.number} (${numeroscope.conductor.planet}), and you are in a Personal Year ${numeroscope.personalYear.number} — ${numeroscope.personalYear.title.toLowerCase()}. ${PLANET_ENERGY[numeroscope.driver.planet]} Read alongside the cards, the theme amplifies: ${playbook.label.toLowerCase()} is where this year is asking you to grow.`
    });
  }

  // Timeline: map spread positions, falling back to first / middle / last cards.
  const pastCard = draws[draws.findIndex((d) => /past|root|orig|led here|complete/i.test(d.position.label))] || draws[0];
  const futureCard = [...draws].reverse().find((d) => /future|outcome|next|direction|result|growth|blessing/i.test(d.position.label)) || draws[draws.length - 1];
  const presentCard = draws[Math.floor((draws.length - 1) / 2)];

  const timeline = {
    past: {
      title: pastCard.position.label,
      card: pastCard.card.name,
      orientation: orientationPhrase(pastCard.reversed),
      body: `${pastCard.card.name}${pastCard.reversed ? ' (reversed)' : ''} explains the ground you are standing on. ${pastCard.reversed ? pastCard.card.reversed : pastCard.card.upright} Look back at the last six to twelve months: the pattern named here has been rehearsing itself, quietly, for longer than you think.`
    },
    present: {
      title: presentCard.position.label,
      card: presentCard.card.name,
      orientation: orientationPhrase(presentCard.reversed),
      body: `Right now, ${presentCard.card.name}${presentCard.reversed ? ' (reversed)' : ''} is the live current. ${presentCard.reversed ? presentCard.card.reversed : presentCard.card.upright} The honest question to sit with this week is simple: ${playbook.focus} — are you moving toward it, or around it?`
    },
    future: {
      title: futureCard.position.label,
      card: futureCard.card.name,
      orientation: orientationPhrase(futureCard.reversed),
      body: `${futureCard.card.name}${futureCard.reversed ? ' (reversed)' : ''} points to the direction of travel. ${futureCard.reversed ? futureCard.card.reversed : futureCard.card.upright} This is a trajectory, not a verdict — it holds if you keep making the choices you are currently making.`
    }
  };

  const advice = [
    playbook.action.charAt(0).toUpperCase() + playbook.action.slice(1) + '.',
    ...draws.slice(0, 4).map((d) => `${d.card.advice} (${d.position.label}: ${d.card.name})`),
    numeroscope ? `Work with your ${numeroscope.driver.planet} energy this week: ${PLANET_ENERGY[numeroscope.driver.planet]}` : null
  ].filter(Boolean).slice(0, 6);

  const dos = [
    ...playbook.dos,
    ...(draws.filter((d) => d.reversed).slice(0, 1).map((d) => `Make space to feel the blocked ${d.card.name} energy instead of overriding it`))
  ].slice(0, 5);

  const donts = [
    ...playbook.donts,
    ...(majors.length >= 3 ? ['Do not try to rush this chapter to its ending'] : []),
    ...(reversedCount >= 3 ? ['Do not make an irreversible decision while this much is inverted'] : [])
  ].slice(0, 5);

  return {
    typeId: type.id,
    title: type.name,
    subtitle: playbook.label + ' · ' + draws.length + ' card' + (draws.length > 1 ? 's' : ''),
    subject: { name: profile.name, question: profile.question || null, dob: profile.dob || null },
    question: profile.question || null,
    facts: [
      { label: 'Spread', value: type.name },
      { label: 'Cards', value: `${draws.length}` },
      { label: 'Dominant element', value: dom.element },
      { label: 'Reversed', value: `${reversedCount}/${draws.length}` }
    ],
    sections: [
      { kind: 'cards', title: 'The cards that came forward', subtitle: 'Drawn for you at this moment', data: { cards } },
      { kind: 'energy', title: 'Energy analysis', data: { blocks: energyBlocks } },
      { kind: 'timeline', title: 'Past · Present · Future', data: timeline },
      { kind: 'advice', title: 'Practical advice', data: { items: advice } },
      { kind: 'dosdonts', title: 'Do\'s & Don\'ts', data: { dos, donts } },
      { kind: 'numerology', title: 'Your numbers behind the cards', data: numeroscope ? numerologySnapshot(numeroscope) : null },
      { kind: 'closing', title: 'Closing message', data: { body: CLOSINGS[hashString(seedBase) % CLOSINGS.length] } },
      { kind: 'disclaimer', title: 'A gentle disclaimer', data: { body: DISCLAIMER } }
    ].filter((s) => s.data !== null)
  };
}

export function numerologySnapshot(n) {
  return {
    driver: n.driver.number,
    driverPlanet: n.driver.planet,
    conductor: n.conductor.number,
    conductorPlanet: n.conductor.planet,
    kua: n.kua.kua,
    personalYear: n.personalYear.number,
    personalYearTitle: n.personalYear.title,
    grid: n.grid.grid,
    combo: n.combo,
    lucky: n.lucky,
    gift: PLANET_GIFT[n.driver.planet]
  };
}
