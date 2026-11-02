/**
 * The Cosmic Oracle reading catalog.
 * Prices follow the Cosmic Oracle pricing sheet (₹49 micro-readings → ₹499 premium).
 */

const t = (id, category, name, cards, price, spread, blurb, extra = {}) => ({
  id, section: 'tarot', category, name, cards, price: extra.free ? 0 : price, free: !!extra.free,
  spread, engine: 'tarot', topic: extra.topic || 'general', blurb,
  requires: extra.requires || ['name', 'dob'],
  badge: extra.badge || null
});

const k = (id, category, name, price, reading, blurb, extra = {}) => ({
  id, section: 'kundli', category, name, cards: null, price: extra.free ? 0 : price, free: !!extra.free,
  engine: 'kundli', reading, topic: extra.topic || 'general', blurb,
  requires: extra.requires || ['name', 'dob', 'tob', 'place'],
  needsPartner: !!extra.needsPartner,
  badge: extra.badge || null
});

export const CATALOG = [
  /* ---------------------------- TAROT ---------------------------- */
  t('tarot-daily', 'By Time', 'Daily Card', 1, 49, 'daily', 'One card for the exact vibration of today.', { free: true, badge: 'Free daily' }),
  t('tarot-ppf', 'By Time', 'Past · Present · Future', 3, 99, 'ppf', 'The classic three-card timeline reading.'),
  t('tarot-monthly', 'By Time', 'Monthly Reading', 4, 129, 'monthly', 'Theme, opportunity, challenge and outcome for the month.'),
  t('tarot-weekly', 'By Time', 'Weekly Reading', 7, 179, 'weekly', 'One card for each day of the coming week.'),
  t('tarot-yearly', 'By Time', 'Yearly Reading', 12, 499, 'yearly', 'Twelve monthly cards mapping your whole year.'),
  t('tarot-year-ahead', 'By Time', 'Year Ahead Spread', 13, 549, 'yearAhead', 'Twelve months plus the grand theme card.'),

  t('tarot-decision', 'By Topic', 'Decision Reading', 3, 99, 'decision', 'Yes-path, no-path and the hidden factor.', { topic: 'decision' }),
  t('tarot-finance', 'By Topic', 'Finance Reading', 4, 149, 'finance', 'Money energy, blocks and the next 90 days.', { topic: 'money' }),
  t('tarot-education', 'By Topic', 'Education Reading', 4, 149, 'education', 'Study standing, learning style and exam energy.', { topic: 'education' }),
  t('tarot-friendship', 'By Topic', 'Friendship Reading', 4, 149, 'friendship', 'The true nature and future of a friendship.', { topic: 'relationship' }),
  t('tarot-situation', 'By Topic', 'Situation Reading', 5, 149, 'situation', 'Clarity on a confusing situation.', { topic: 'general' }),
  t('tarot-career', 'By Topic', 'Career Reading', 5, 179, 'career', 'Professional standing, gift, block and opening.', { topic: 'career' }),
  t('tarot-health', 'By Topic', 'Wellbeing Reading', 5, 179, 'health', 'Body signals, stress and restoration — symbolic only.', { topic: 'health' }),
  t('tarot-love', 'By Topic', 'Love Reading', 7, 199, 'love', 'Heart, other person, block and direction.', { topic: 'love' }),
  t('tarot-family', 'By Topic', 'Family Reading', 6, 199, 'family', 'Household climate, friction and healing.', { topic: 'family' }),
  t('tarot-purpose', 'By Topic', 'Life Purpose Reading', 7, 249, 'purpose', 'Dharma, gift, block and the path forward.', { topic: 'spiritual' }),

  t('tarot-micro', 'By Depth', 'Micro Reading', 1, 49, 'micro', 'One card, one honest pulse check.', { free: true, badge: 'Free' }),
  t('tarot-mini', 'By Depth', 'Mini Reading', 3, 99, 'mini', 'Root, now and next in three cards.'),
  t('tarot-standard', 'By Depth', 'Standard Reading', 5, 179, 'standard', 'Five-card situation analysis.'),
  t('tarot-deep', 'By Depth', 'Deep Reading', 7, 299, 'deep', 'Seven cards for a full analysis.'),
  t('tarot-premium', 'By Depth', 'Premium Reading', 12, 499, 'premium', 'Twelve-card complete life overview.', { badge: 'Most loved' }),

  t('tarot-celtic', 'Specific Spreads', 'Celtic Cross', 10, 399, 'celtic', 'The most famous spread in cartomancy — a complete life reading.'),
  t('tarot-horseshoe', 'Specific Spreads', 'Horseshoe Spread', 7, 199, 'horseshoe', 'Seven-card problem solving spread.'),
  t('tarot-star', 'Specific Spreads', 'Star Spread', 5, 149, 'star', 'Life path, body, mind, emotions and spirit.'),
  t('tarot-relationship', 'Specific Spreads', 'Relationship Spread', 7, 199, 'relationship', 'Two people, their needs, and the direction of the bond.', { topic: 'love' }),
  t('tarot-yesno', 'Specific Spreads', 'Yes or No', 3, 49, 'yesno', 'A straight answer with its conditions.', { topic: 'decision' }),
  t('tarot-mind-body-soul', 'Specific Spreads', 'Mind · Body · Soul', 3, 99, 'mindbodysoul', 'A three-card wellbeing balance check.', { topic: 'health' }),
  t('tarot-shadow', 'Specific Spreads', 'Shadow Work', 5, 199, 'shadow', 'The facade, the shadow and its integration.', { topic: 'spiritual' }),
  t('tarot-chakra', 'Specific Spreads', 'Chakra Spread', 7, 249, 'chakra', 'One card for each energy centre.', { topic: 'spiritual' }),
  t('tarot-new-moon', 'Specific Spreads', 'New Moon Spread', 4, 129, 'newmoon', 'Manifestation, release and growth.'),
  t('tarot-full-moon', 'Specific Spreads', 'Full Moon Spread', 4, 129, 'fullmoon', 'Release, completion and integration.'),
  t('tarot-birthday', 'Specific Spreads', 'Birthday Spread', 5, 179, 'birthday', 'A five-card reading for your new solar year.'),
  t('tarot-career-path', 'Specific Spreads', 'Career Path Spread', 6, 199, 'careerpath', 'Skill, reputation, next move and fulfilment.', { topic: 'career' }),
  t('tarot-love-triangle', 'Specific Spreads', 'Love Triangle Spread', 7, 249, 'lovetriangle', 'A careful, honest look at a complicated situation.', { topic: 'love' }),
  t('tarot-self-love', 'Specific Spreads', 'Self Love Spread', 5, 149, 'selflove', 'Inner healing and the love you withhold.', { topic: 'love' }),
  t('tarot-manifestation', 'Specific Spreads', 'Manifestation Spread', 6, 179, 'manifestation', 'Desire, belief block, action and timing.'),

  t('tarot-birth-card', 'Personality', 'Birth Card Reading', 1, 149, 'birthcard', 'The tarot archetype of your birth date.', { topic: 'spiritual' }),
  t('tarot-soul-card', 'Personality', 'Soul Card Reading', 1, 149, 'soulcard', 'The archetype of your life purpose.', { topic: 'spiritual' }),
  t('tarot-year-card', 'Personality', 'Year Card Reading', 1, 99, 'yearcard', 'The card governing your current personal year.', { topic: 'spiritual' }),
  t('tarot-shadow-card', 'Personality', 'Shadow Card Reading', 1, 129, 'shadowcard', 'The archetype you avoid — and why.', { topic: 'spiritual' }),
  t('tarot-personality', 'Personality', 'Personality Spread', 5, 199, 'personality', 'A full character analysis in five cards.'),

  t('tarot-micro-energy', 'Special', 'Micro Energy Reading', 1, 49, 'micro', 'What the energy around you is doing right now.', { free: true, badge: 'Free' }),
  t('tarot-message', 'Special', 'Message Reading', 1, 99, 'message', 'The energy behind a text, silence or message.', { topic: 'relationship' }),
  t('tarot-dream', 'Special', 'Dream Reading', 3, 129, 'dream', 'Tarot interpretation of a dream you remember.', { topic: 'spiritual' }),
  t('tarot-situation-energy', 'Special', 'Situation Energy', 4, 99, 'situationenergy', 'What is happening in the field around you.'),
  t('tarot-block', 'Special', 'Block Reading', 3, 99, 'block', 'What is stopping you, and the key that releases it.'),
  t('tarot-clarity', 'Special', 'Clarity Reading', 4, 129, 'clarity', 'For when you cannot see the next step.'),
  t('tarot-validation', 'Special', 'Validation Reading', 3, 99, 'validation', 'Am I on the right path? An honest check.'),

  /* ---------------------------- KUNDLI ---------------------------- */
  k('kundli-janam', 'Basic Kundli', 'Janam Kundli', 0, 'janam', 'Your complete birth chart — lagna, planets, nakshatra and houses.', { free: true, badge: 'Free' }),
  k('kundli-lagna', 'Basic Kundli', 'Lagna Chart', 199, 'lagna', 'Ascendant and house-by-house analysis.'),
  k('kundli-navamsa', 'Basic Kundli', 'Navamsa Chart (D9)', 249, 'navamsa', 'Marriage, dharma and the soul purpose chart.', { topic: 'love' }),
  k('kundli-dashamamsa', 'Basic Kundli', 'Dashamamsa Chart (D10)', 249, 'dashamamsa', 'Career and professional direction.', { topic: 'career' }),
  k('kundli-moon', 'Basic Kundli', 'Moon Chart', 149, 'moon', 'Your emotional nature, mind and instincts.'),
  k('kundli-sun', 'Basic Kundli', 'Sun Chart', 149, 'sun', 'Soul, ego, authority and the father line.'),

  k('kundli-mahadasha', 'Dasha System', 'Mahadasha Reading', 249, 'mahadasha', 'Your major planetary period and its lesson.'),
  k('kundli-antardasha', 'Dasha System', 'Antardasha Reading', 199, 'antardasha', 'The sub-period running inside your Mahadasha.'),
  k('kundli-pratyantar', 'Dasha System', 'Pratyantar Dasha', 149, 'pratyantar', 'The fine timing layer — months and weeks.'),
  k('kundli-current-dasha', 'Dasha System', 'Current Dasha', 0, 'current', 'What phase you are in right now.', { free: true, badge: 'Free' }),
  k('kundli-dasha-prediction', 'Dasha System', 'Dasha Prediction', 299, 'prediction', 'The next three periods, mapped against your goals.'),

  k('kundli-gochar', 'Transit', 'Gochar Reading', 199, 'gochar', 'Current planetary transits and their impact.'),
  k('kundli-sade-sati', 'Transit', 'Sade Sati Reading', 249, 'sadesati', 'Saturn\'s 7½-year passage and how to work with it.'),
  k('kundli-jupiter', 'Transit', 'Jupiter Transit', 149, 'jupiter', 'Where Guru\'s blessing is moving next.'),
  k('kundli-rahu-ketu', 'Transit', 'Rahu–Ketu Transit', 199, 'rahuketu', 'The karmic axis shift and what it activates.'),
  k('kundli-annual', 'Transit', 'Annual Horoscope', 299, 'annual', 'A year-ahead Vedic forecast from your chart.'),

  k('kundli-marriage', 'Topic Specific', 'Vivah / Marriage Reading', 299, 'marriage', 'Timing, nature of partnership and compatibility.', { topic: 'love' }),
  k('kundli-career', 'Topic Specific', 'Career & Job Reading', 249, 'career', 'Profession suited to your chart and its timing.', { topic: 'career' }),
  k('kundli-education', 'Topic Specific', 'Education Reading', 199, 'education', 'Fields that suit you and success windows.', { topic: 'education' }),
  k('kundli-health', 'Topic Specific', 'Health Reading', 199, 'health', 'Constitution and vulnerable areas — symbolic guidance only.', { topic: 'health' }),
  k('kundli-finance', 'Topic Specific', 'Finance & Wealth Reading', 249, 'finance', 'Dhana yoga potential and money timing.', { topic: 'money' }),
  k('kundli-foreign', 'Topic Specific', 'Foreign Travel Reading', 249, 'foreign', 'Travel, settlement and abroad timing.', { topic: 'career' }),
  k('kundli-property', 'Topic Specific', 'Property Reading', 249, 'property', 'Land, home and property windows.', { topic: 'money' }),
  k('kundli-children', 'Topic Specific', 'Children Reading', 249, 'children', 'Santaan yoga and family timing.', { topic: 'family' }),
  k('kundli-spiritual', 'Topic Specific', 'Spiritual Reading', 249, 'spiritual', 'Moksha, sadhana and past-life karma.', { topic: 'spiritual' }),
  k('kundli-legal', 'Topic Specific', 'Legal Reading', 249, 'legal', 'Disputes, strength in litigation and timing.', { topic: 'general' }),

  k('kundli-milan', 'Compatibility', 'Kundli Milan (36 Gunas)', 399, 'milan', 'Classical Ashtakoot matching out of 36 gunas.', { topic: 'love', needsPartner: true, requires: ['name', 'dob', 'tob', 'place'] }),
  k('kundli-ashtakoot', 'Compatibility', 'Ashtakoot Matching', 249, 'ashtakoot', 'The eight-point compatibility breakdown.', { topic: 'love', needsPartner: true, requires: ['name', 'dob', 'tob', 'place'] }),
  k('kundli-mangal', 'Compatibility', 'Mangal Dosha Check', 199, 'mangal', 'Mars placement and its marriage influence.', { topic: 'love', needsPartner: true, requires: ['name', 'dob', 'tob', 'place'] }),
  k('kundli-business', 'Compatibility', 'Business Partnership', 299, 'business', 'Professional compatibility between two charts.', { topic: 'career', needsPartner: true, requires: ['name', 'dob', 'tob', 'place'] }),
  k('kundli-friendship', 'Compatibility', 'Friendship Compatibility', 149, 'friendship', 'Bond strength between two people.', { topic: 'relationship', needsPartner: true, requires: ['name', 'dob', 'tob', 'place'] }),
  k('kundli-parent-child', 'Compatibility', 'Parent–Child Compatibility', 199, 'parentchild', 'The family dynamic between two charts.', { topic: 'family', needsPartner: true, requires: ['name', 'dob', 'tob', 'place'] }),

  k('kundli-numerology', 'Special Kundli', 'Numerology + Kundli Combo', 299, 'combo', 'Your numbers and planets read as one story.'),
  k('kundli-nakshatra', 'Special Kundli', 'Nakshatra Reading', 199, 'nakshatra', 'Your 27-star constellation, pada and deity.'),
  k('kundli-arudha', 'Special Kundli', 'Arudha Lagna', 249, 'arudha', 'How the world perceives you.'),
  k('kundli-yogas', 'Special Kundli', 'Yogas in Kundli', 299, 'yogas', 'Raj yogas and special combinations in your chart.'),
  k('kundli-atmakaraka', 'Special Kundli', 'Atmakaraka Reading', 199, 'atmakaraka', 'The soul significator planet.'),
  k('kundli-past-life', 'Special Kundli', 'Past Life Reading', 299, 'pastlife', 'Karmic patterns carried from previous births.', { topic: 'spiritual' }),
  k('kundli-remedies', 'Special Kundli', 'Remedies Reading', 249, 'remedies', 'Gemstone, mantra and upay guidance.'),
  k('kundli-prashna', 'Special Kundli', 'Prashna Kundli', 199, 'prashna', 'A question-based chart — no birth details required.', { requires: ['name', 'question'] }),

  /* --------------------------- NUMEROLOGY --------------------------- */
  {
    id: 'num-life-path', section: 'numerology', category: 'Numerology', name: 'Life Path Number',
    cards: null, price: 0, free: true, engine: 'numerology', reading: 'lifepath', topic: 'spiritual',
    blurb: 'Your core destiny number from your full date of birth.', requires: ['name', 'dob'], badge: 'Free'
  },
  {
    id: 'num-loshu', section: 'numerology', category: 'Numerology', name: 'Lo Shu Grid',
    cards: null, price: 0, free: true, engine: 'numerology', reading: 'loshu', topic: 'spiritual',
    blurb: 'Your 3×3 numeroscope with missing numbers and remedies.', requires: ['name', 'dob'], badge: 'Free'
  },
  {
    id: 'num-personal-year', section: 'numerology', category: 'Numerology', name: 'Personal Year Number',
    cards: null, price: 0, free: true, engine: 'numerology', reading: 'personalyear', topic: 'spiritual',
    blurb: 'The theme of your current year, starting 5 February.', requires: ['name', 'dob'], badge: 'Free'
  },
  {
    id: 'num-name', section: 'numerology', category: 'Numerology', name: 'Name Analysis',
    cards: null, price: 149, free: false, engine: 'numerology', reading: 'name', topic: 'general',
    blurb: 'Name vibration, spelling correction and auspicious totals.', requires: ['name', 'dob']
  },
  {
    id: 'num-mobile', section: 'numerology', category: 'Numerology', name: 'Mobile Number Reading',
    cards: null, price: 99, free: false, engine: 'numerology', reading: 'mobile', topic: 'general',
    blurb: 'The energy of your phone number.', requires: ['name', 'dob', 'mobile']
  },

  /* ----------------------------- COMBOS ----------------------------- */
  {
    id: 'combo-tarot-numerology', section: 'combo', category: 'Combos', name: 'Tarot + Numerology',
    cards: 5, price: 349, free: false, engine: 'combo', reading: 'tarot-numerology', spread: 'standard',
    topic: 'spiritual', blurb: 'Five cards read against your Driver, Conductor and Lo Shu grid.',
    requires: ['name', 'dob', 'question'], badge: 'Signature'
  },
  {
    id: 'combo-kundli-tarot', section: 'combo', category: 'Combos', name: 'Kundli + Tarot',
    cards: 5, price: 449, free: false, engine: 'combo', reading: 'kundli-tarot', spread: 'standard',
    topic: 'spiritual', blurb: 'Your dasha, your lagna and five cards telling one story.',
    requires: ['name', 'dob', 'tob', 'place', 'question']
  },
  {
    id: 'combo-full-life', section: 'combo', category: 'Combos', name: 'Full Life Reading',
    cards: 12, price: 499, free: false, engine: 'combo', reading: 'full', spread: 'premium',
    topic: 'spiritual', blurb: 'The complete overview — chart, numbers, twelve cards, remedies.',
    requires: ['name', 'dob', 'tob', 'place', 'question'], badge: '₹499 · Complete'
  }
];

export const getReading = (id) => CATALOG.find((r) => r.id === id) || null;

export const SECTIONS = [
  { id: 'tarot', name: 'Tarot Readings', tagline: 'Cartomancy for the moment you are in', symbol: '🃏', accent: 'mint' },
  { id: 'kundli', name: 'Kundli Readings', tagline: 'Vedic astrology for the life you are living', symbol: '🌙', accent: 'gold' },
  { id: 'numerology', name: 'Numerology', tagline: 'The arithmetic of your destiny', symbol: '🔢', accent: 'lilac' },
  { id: 'combo', name: 'Combo Readings', tagline: 'Numbers, planets and cards together', symbol: '🔱', accent: 'rose' }
];

export const PRICE_TIERS = [
  { min: 0, max: 49, label: 'Micro', blurb: 'One sharp question, one clear answer.' },
  { min: 50, max: 149, label: 'Focus', blurb: 'A specific topic, read properly.' },
  { min: 150, max: 299, label: 'Deep', blurb: 'Multi-card or full chart analysis.' },
  { min: 300, max: 9999, label: 'Premium', blurb: 'The complete cosmic overview.' }
];
