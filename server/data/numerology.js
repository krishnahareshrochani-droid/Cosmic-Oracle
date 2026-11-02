/**
 * Numerology knowledge base for Cosmic Oracle.
 * Sourced from the Cosmic Oracle numeroscope syllabus (Lo Shu grid, Driver–Conductor
 * relationships, Personal Year cycle, missing-number remedies, name numerology).
 */

export const PLANETS = {
  1: { planet: 'Sun', hindi: 'Surya', glyph: '☉', element: 'Fire', colour: 'Royal Gold', day: 'Sunday', direction: 'East' },
  2: { planet: 'Moon', hindi: 'Chandra', glyph: '☾', element: 'Water', colour: 'Pearl White', day: 'Monday', direction: 'North-West' },
  3: { planet: 'Jupiter', hindi: 'Guru', glyph: '♃', element: 'Ether', colour: 'Saffron Yellow', day: 'Thursday', direction: 'North-East' },
  4: { planet: 'Rahu', hindi: 'Rahu', glyph: '☊', element: 'Air', colour: 'Smoky Grey', day: 'Saturday', direction: 'South-West' },
  5: { planet: 'Mercury', hindi: 'Budha', glyph: '☿', element: 'Earth', colour: 'Emerald Green', day: 'Wednesday', direction: 'North' },
  6: { planet: 'Venus', hindi: 'Shukra', glyph: '♀', element: 'Water', colour: 'Rose Pink', day: 'Friday', direction: 'South-East' },
  7: { planet: 'Ketu', hindi: 'Ketu', glyph: '☋', element: 'Fire', colour: 'Silver Grey', day: 'Tuesday', direction: 'South' },
  8: { planet: 'Saturn', hindi: 'Shani', glyph: '♄', element: 'Earth', colour: 'Deep Blue', day: 'Saturday', direction: 'West' },
  9: { planet: 'Mars', hindi: 'Mangal', glyph: '♂', element: 'Fire', colour: 'Coral Red', day: 'Tuesday', direction: 'South' }
};

export const NUMBER_PERSONALITY = {
  1: {
    title: 'The Royal Pioneer',
    traits: 'King-like, authoritative, pioneering, royal, trend-setter, leadership energy with a healthy ego.',
    shadow: 'Dominance, impatience, and a refusal to be led.',
    careers: 'Leadership roles, government, entrepreneurship, politics, administration.',
    mantra: 'I lead with warmth, not with force.'
  },
  2: {
    title: 'The Intuitive Diplomat',
    traits: 'Emotional, gentle, slow, sensitive, attractive, intuitive, with natural mood swings that also make you deeply perceptive.',
    shadow: 'Over-sensitivity and indecision under pressure.',
    careers: 'Counselling, hospitality, water-related work, nursing, teaching, partnerships.',
    mantra: 'My softness is my strength.'
  },
  3: {
    title: 'The Wise Teacher',
    traits: 'Imaginative, healer, preacher, spiritual, religious, counsellor, wise beyond the years of your birth chart.',
    shadow: 'Over-imagination and starting more than you finish.',
    careers: 'Education, occult sciences, healing, writing, law, advisory work.',
    mantra: 'I finish what my imagination begins.'
  },
  4: {
    title: 'The Disciplined Rebel',
    traits: 'Disciplined, organised, logical yet impulsive; short-tempered but fiercely loyal to your systems.',
    shadow: 'Stubbornness and sudden rebellion against your own structure.',
    careers: 'Law, engineering, event management, banking, real estate, printing.',
    mantra: 'Structure gives my fire a direction.'
  },
  5: {
    title: 'The Mercurial Free Spirit',
    traits: 'Happy-go-lucky, communicative, entertaining, a true dark horse, quick with words and quicker with ideas.',
    shadow: 'Laziness and scattering energy in ten directions.',
    careers: 'Communication, sales & marketing, media, trading, travel, anchoring.',
    mantra: 'I move quickly — and I finish gently.'
  },
  6: {
    title: 'The Heart of the Home',
    traits: 'Romantic, diplomatic, family-oriented, shrewd, and the natural centre of attraction in any room.',
    shadow: 'Possessiveness and worry that curdles into control.',
    careers: 'Luxury, glamour, media, hospitality, interior design, family business.',
    mantra: 'I nurture without controlling.'
  },
  7: {
    title: 'The Mystic Researcher',
    traits: 'Inquisitive, introverted, a gifted healer, spiritual and research-minded; often low in self-confidence early in life.',
    shadow: 'Disappointment when the world does not match your inner vision.',
    careers: 'Occult sciences, research, healing, banking, spirituality, analytics.',
    mantra: 'My depth is my direction.'
  },
  8: {
    title: 'The Karmic Builder',
    traits: 'Labour-loving, hardworking, logical, argumentative, financially sharp and built for long battles.',
    shadow: 'Rigidity, over-work, and struggle mistaken for identity.',
    careers: 'Law, finance, real estate, defence, manufacturing, audit.',
    mantra: 'I build steadily, and I rest without guilt.'
  },
  9: {
    title: 'The Warrior Sage',
    traits: 'Unpredictable, brave, rough and tough on the outside, deeply humanitarian on the inside.',
    shadow: 'Ego and criticism that push people away.',
    careers: 'Army, police, administration, medicine, humanitarian work, sports.',
    mantra: 'My strength serves other people.'
  }
};

export const PERSONAL_YEAR = {
  1: {
    title: 'A Year of New Starts',
    planet: 'Sun',
    summary:
      'A fresh nine-year cycle begins. Enthusiasm and energy are high, and whatever you start now shapes the entire cycle ahead. Do not let this year pass quietly.',
    focus: 'Launch the goal you have been postponing. Plant the seed, sign the paper, take the first public step.',
    caution: 'Starting many things and finishing none. Choose one big beginning.'
  },
  2: {
    title: 'A Slow and Gentle Year',
    planet: 'Moon',
    summary:
      'A year of patience and consolidation. You will feel tempted to push things into happening — but pushing is a waste of energy now. Analyse, deepen, and let relationships mature.',
    focus: 'Partnerships, patience, emotional intelligence, quietly settling unfinished business.',
    caution: 'Forcing results. The Moon waxes on its own schedule.'
  },
  3: {
    title: 'A Year of Knowledge & Spirituality',
    planet: 'Jupiter',
    summary:
      'Jupiter opens the mind. Fun plans may not land the way you expect, but anything connected to education, knowledge, spirituality, religion or occult study brings fantastic results.',
    focus: 'Study, teaching, mentoring, healing, spiritual practice, upskilling.',
    caution: 'Business or job growth may be uneven this year — build skills instead of chasing titles.'
  },
  4: {
    title: 'A Year of Hard Work & Goals Achieved',
    planet: 'Rahu',
    summary:
      'This year demands two things: hard work and focused approach. Set one specific goal at the start and grind quietly — by year end you will have something to show the world.',
    focus: 'Deep work, systems, discipline, one clear goal, proof of concept.',
    caution: 'Without focus the year feels heavy, restricting and serious. Rahu rewards obsession, not drift.'
  },
  5: {
    title: 'A Year of Success & the Unexpected',
    planet: 'Mercury',
    summary:
      'Mercury is comfortable with every planet, so everyone can expect something from good to great. An auspicious year for change, variety, travel, and unexpected gains in your passion projects.',
    focus: 'Change, movement, communication, new experiences, saying yes to the adventure.',
    caution: 'Scattering yourself across too many novelties at once.'
  },
  6: {
    title: 'A Year of Luxury, Home & Family',
    planet: 'Venus',
    summary:
      'Venus brings beauty, comfort and commitment. Marriage, a baby, a new car, a new home, or a full redecoration are all strongly supported. Existing relationships also clarify — some deepen, some dissolve.',
    focus: 'Family, marriage, home, beauty, comfort, reconciliation.',
    caution: 'Over-spending on comfort, or clinging to a relationship that has already spoken.'
  },
  7: {
    title: 'A Year of Wisdom & the Inner World',
    planet: 'Ketu',
    summary:
      'A year for the inner voyage. Thoughts turn to learning, meditation, research and the mystical. Excellent for study, sabbatical and quiet mastery — not for launching outward ventures.',
    focus: 'Study, meditation, analysis, research, spiritual retreat, planning.',
    caution: 'Confusing planning with implementation. This year is for the blueprint, not the building.'
  },
  8: {
    title: 'A Year of Karma, Money & Finance',
    planet: 'Saturn',
    summary:
      'Saturn evaluates the karma of the past decade. Do a little, receive a little; do well, receive well. Money matters move your way and property deals fetch good prices. Work hard — but rest, too.',
    focus: 'Financial consolidation, property, career results, disciplined effort.',
    caution: 'Becoming a workaholic to the point of health strain. Saturn respects rest as much as labour.'
  },
  9: {
    title: 'A Year of Re-evaluation & Audit',
    planet: 'Mars',
    summary:
      'The final year of the epicentre (1→9). It is a year of review and audit, not harvest. Hold new ideas for Personal Year 1, clear out what is complete, and close old loops gracefully.',
    focus: 'Completion, forgiveness, release, audit, decluttering, health check-ins.',
    caution: 'Expecting big business or relationship wins and being misled by false leads. Shelve launches; prepare instead.'
  }
};

export const MISSING_NUMBER = {
  1: {
    theme: 'Communication & Self-Expression',
    text: 'Difficulty expressing your inner views. You often need support from others and carry a quiet ego. Some people stammer in early childhood. Practice speaking the unspoken.'
  },
  2: {
    theme: 'Sensitivity & Intuition',
    text: 'Lack of sensitivity towards others\' feelings. You may not admit mistakes and instead justify your actions. Deliberately ask: "How did that land for them?"'
  },
  3: {
    theme: 'Creativity & Imagination',
    text: 'Lack of creativity and imaginative power. You may surrender too quickly to difficult situations. Small creative rituals rebuild this muscle.'
  },
  4: {
    theme: 'Discipline & Organisation',
    text: 'Lack of discipline and organisation, often clumsy hands. Build one tiny repeatable system and protect it fiercely.'
  },
  5: {
    theme: 'Balance & Versatility',
    text: 'Lack of balance in every sphere of life, and sometimes the drive to chase your goals. Movement, travel and flexible routines restore this number.'
  },
  6: {
    theme: 'Home, Family & Relationships',
    text: 'Poor bonding with home and family, a weaker relationship sector, possible marriage friction, and less support from society at crunch time. Consistent small gestures of care rebuild the link.'
  },
  7: {
    theme: 'Spirituality & Inner Knowledge',
    text: 'Lack of spiritual grounding, study or faith; you may not notice other people\'s feelings. Silence, learning and service restore this number.'
  },
  8: {
    theme: 'Money & Financial Management',
    text: 'Poor financial management and a spendthrift streak. Budgeting, delayed gratification and a written money plan are your remedies.'
  },
  9: {
    theme: 'Humanity & Energy',
    text: 'You may overlook the feelings of others and feel a lack of energy or follow-through. Physical training and acts of service restore this number.'
  }
};

export const REPEATED_NUMBER = {
  1: {
    label: 'Communication',
    meanings: {
      1: 'A good communicator once relaxed, though it takes time for your inner self to emerge.',
      2: 'Excellent, articulate and impartial communication.',
      3: 'A chatterbox or an introvert, depending entirely on the room.',
      4: 'Expressive but often misunderstood in society.',
      5: 'A powerful communicator who attracts both fame and controversy. Definitely a big name.'
    }
  },
  2: {
    label: 'Sensitivity & Intuition',
    meanings: {
      1: 'Sensitive with good intuition that you rarely act upon.',
      2: 'Highly intelligent, sensitive and intuitive — and easily hurt.',
      3: 'Over-sensitive, easily hurt, avoids big gatherings.',
      4: 'Impatient and extremely sensitive; depression is a real risk to guard against.'
    }
  },
  3: {
    label: 'Imagination & Creativity',
    meanings: {
      1: 'A good, creative brain.',
      2: 'Vivid imagination and strong communication; eccentric, enjoys breaking conventional rules.',
      3: 'Over-imagination that can disconnect you from society.',
      4: 'Impractical and fearful — beware of living in a fool\'s paradise.'
    }
  },
  4: {
    label: 'Discipline & Organisation',
    meanings: {
      1: 'Practical and hardworking; enjoys hands-on activity.',
      2: 'Excellent organiser who creates order out of chaos; materialistic, disciplined, sometimes penny-wise and pound-foolish.',
      3: 'Struggle to identify your true potential and a tendency to waste time in the wrong field.',
      4: 'Rigid systems become cages — loosen the grip.'
    }
  },
  5: {
    label: 'Balance',
    meanings: {
      1: 'Emotionally well balanced, self-accountable, self-responsible, and yes — a little lazy.',
      2: 'Highly romantic, young at heart, intense, determined, and a natural motivator of others.',
      3: 'Always keeps a resignation letter in the pocket; cannot tolerate interference in your life.',
      4: 'Exaggerates, speaks unwittingly, over-adventurous and accident-prone.'
    }
  },
  6: {
    label: 'Home, Family & Relationships',
    meanings: {
      1: 'Great love for home and loved ones; the centre of attraction in your family.',
      2: 'Worried and slightly obsessed about kids and loved ones; a background sense of insecurity.',
      3: 'Sees the negative side of life and can unknowingly hinder children\'s progress.'
    }
  },
  7: {
    label: 'Disappointment & Depth',
    meanings: {
      1: 'Disappointment in love, health, money or emotional setbacks — and a gift for going inward.',
      2: 'Deeply disappointed in love, health or money and frequently deceived by your own people; simultaneously a powerful spiritual and occult problem-solver.',
      3: 'Marriage may be a challenge, heartbreak in love, and a strong pull toward spirituality and occult.',
      4: 'Depression rooted in the relationship sector; love and marriage issues need conscious care.'
    }
  },
  8: {
    label: 'Money & Finance',
    meanings: {
      1: 'Strong ability to manage money and finance; logical and argumentative.',
      2: 'Do not trust others easily, rely on your own experience, keep money in multiple pockets and accounts.',
      3: 'Struggle, stubbornness, rigidity and fixed ideas.',
      4: 'Extremely restless with a strong need for change.'
    }
  },
  9: {
    label: 'Energy & Humanity',
    meanings: {
      1: 'Intelligent and humanitarian.',
      2: 'Intelligent and convinced you are the best; tries to prove the point.',
      3: 'Intelligent and prone to criticising others; channel that intelligence and you will find reciprocation in love.',
      4: 'Caught in a rut, highly egoistic, prone to unpredictable somersaults.',
      5: 'Convinced of your own supremacy and disconnected from day-to-day social life.'
    }
  }
};

/** Numbers that can replace a missing number via remedies. */
export const REMEDIES = {
  missing: [
    {
      condition: '4 and 3 both missing',
      yantra: 'Panchmukhi Rudraksha / Tulsi Mala / Wooden Bracelet',
      note: 'Wear on a Monday after a small prayer. Wood grounds the thought and discipline planes.'
    },
    {
      condition: '2, 5 and 8 all missing',
      yantra: 'Crystal Bracelet or Sphatik Mala',
      note: 'Crystal restores the emotion, balance and success planes of the grid.'
    },
    {
      condition: '6 missing',
      yantra: 'Golden-coloured metal-strap watch',
      note: 'Venus responds to metal and to beauty — keep it on your left wrist.'
    },
    {
      condition: '7 missing',
      yantra: 'Silver and golden metal-strap watch',
      note: 'Ketu is soothed by mixed metals; wear it consistently rather than occasionally.'
    },
    {
      condition: '1 missing',
      yantra: 'Offer water to the Sun at sunrise',
      note: 'Do not do this if your Driver or Conductor is 8. Otherwise, drink plenty of water.'
    },
    {
      condition: '9 missing',
      yantra: 'Red thread on the right wrist',
      note: 'Mars responds to red — tie it on a Tuesday and keep the intent Mars-positive.'
    }
  ],
  conditional: [
    { condition: '5 missing while 6 is present (Driver/Conductor ≠ 8)', yantra: 'Surya–Budha Yantra' },
    { condition: '5 and 6 both missing (Driver/Conductor ≠ 3)', yantra: 'Budha Pyra' },
    { condition: '6 missing while 5 is present (Driver/Conductor ≠ 8 or 3)', yantra: 'Surya Pyra (also covers other missing numbers)' },
    { condition: '6 missing, 5 present, Driver/Conductor = 8 (not 3)', yantra: 'Pyra Yantra' },
    { condition: 'Driver–Conductor 3-8 or 8-3 and 5 missing', yantra: 'Budha Yantra' },
    { condition: 'Driver–Conductor 3-6 or 6-3 and 5 present', yantra: 'Surya Yantra' },
    { condition: 'For children\'s education (Driver/Conductor ≠ 6)', yantra: 'Saraswati Yantra' },
    { condition: 'For health concerns only', yantra: 'Gayatri Yantra' }
  ]
};

export const LO_SHU_PLANES = [
  { name: 'Mental Plane', cells: [4, 9, 2], gift: 'Very sharp memory and high intelligence.', lacking: 'Focus and retention need conscious training.' },
  { name: 'Thought Plane', cells: [4, 3, 8], gift: 'Powerful visualisation and prudence.', lacking: 'Dreaming without a map — practice planning.' },
  { name: 'Will Plane', cells: [9, 5, 1], gift: 'Strong will power, adjusts to any situation.', lacking: 'Follow-through wavers — build micro-commitments.' },
  { name: 'Action Plane', cells: [2, 7, 6], gift: 'A person of action with a quick approach.', lacking: 'Ideas stay ideas — set a 24-hour action rule.' },
  { name: 'Practical Plane', cells: [8, 1, 6], gift: 'Practical approach and depth in anything you touch.', lacking: 'Grounding rituals and checklists help.' },
  { name: 'Emotional Plane', cells: [3, 5, 7], gift: 'Deeply emotional; the heart rules the head.', lacking: 'Feelings are held back — name them out loud.' },
  { name: 'Success Plane I (Raj Yoga)', cells: [4, 5, 6], gift: 'Progress accelerates after the birth of a child.', lacking: 'Success needs patient sequencing, not leaps.' },
  { name: 'Success Plane II (Raj Yoga)', cells: [2, 5, 8], gift: 'Earth element: property, real estate, stability.', lacking: 'Stability grows through one long-term asset.' }
];

export const LO_SHU_GRID = [
  [4, 9, 2],
  [3, 5, 7],
  [8, 1, 6]
];

export const KUA_GROUPS = {
  east: { name: 'East Group', numbers: [1, 3, 4, 9], best: 'East, South-East, South, North', avoid: 'West, North-West, South-West, North-East' },
  west: { name: 'West Group', numbers: [2, 5, 6, 7, 8], best: 'West, North-West, South-West, North-East', avoid: 'East, South-East, South, North' }
};

export const PLANET_FRIENDSHIP = {
  1: { friends: [1, 2, 5, 9], enemies: [3, 6, 8], neutral: [4, 7] },
  2: { friends: [1, 3, 5], enemies: [4, 8, 9], neutral: [6, 7] },
  3: { friends: [1, 2, 3, 5], enemies: [6], neutral: [4, 8, 9] },
  4: { friends: [1, 5, 6, 7], enemies: [9, 2], neutral: [3] },
  5: { friends: [1, 2, 6], enemies: [9, 7, 8, 4], neutral: [3] },
  6: { friends: [1, 5, 6, 7], enemies: [3, 8, 9], neutral: [2, 4] },
  7: { friends: [1, 3, 4, 5, 6], enemies: [8, 9, 2], neutral: [] },
  8: { friends: [3, 5, 6, 7], enemies: [1, 2, 9], neutral: [4] },
  9: { friends: [1, 3, 5], enemies: [4, 2, 6, 8], neutral: [7] }
};

export const NAME_LETTER_VALUES = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 8, G: 3, H: 5, I: 1, J: 1, K: 2, L: 3, M: 4,
  N: 5, O: 7, P: 8, Q: 1, R: 2, S: 3, T: 4, U: 6, V: 6, W: 6, X: 5, Y: 1, Z: 7
};

export const AUSPICIOUS_NAME_NUMBERS = [1, 3, 5, 6];
export const UNFAVOURABLE_NAME_NUMBERS = [4, 8];

export const KARMIC_NUMBERS = {
  13: 'Karmic number 13 — mastery is earned through repeated effort, never inherited.',
  16: 'Karmic number 16 — ego is dissolved through sudden change; stay humble and adaptable.'
};

export const LO_SHU_MEANING = {
  1: { label: 'Communication & Self', keyword: 'Voice' },
  2: { label: 'Sensitivity & Intuition', keyword: 'Feeling' },
  3: { label: 'Imagination & Creativity', keyword: 'Vision' },
  4: { label: 'Discipline & Order', keyword: 'Structure' },
  5: { label: 'Balance & Versatility', keyword: 'Centre' },
  6: { label: 'Home & Relationships', keyword: 'Bonding' },
  7: { label: 'Knowledge & Occult', keyword: 'Depth' },
  8: { label: 'Money & Karma', keyword: 'Wealth' },
  9: { label: 'Energy & Humanity', keyword: 'Power' }
};
