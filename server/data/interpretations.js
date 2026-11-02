/** Narrative building blocks shared by the tarot and kundli engines. */

export const SIGN_PERSONALITY = {
  Aries: 'You arrive first. Aries rising or Moon gives a pioneer\'s instinct — quick to act, quick to anger, quick to forgive. Your growth edge is patience, because you often win the sprint and forget the marathon.',
  Taurus: 'You build for permanence. Taurus energy wants beauty, security and a body that feels good to live in. Your growth edge is flexibility — the bull must learn that some doors open only when you stop pushing.',
  Gemini: 'You are a living conversation. Gemini energy learns by talking, travelling and connecting dots. Your growth edge is depth: one subject mastered beats ten subjects sampled.',
  Cancer: 'You feel the room before anyone speaks. Cancer energy protects, nurtures and remembers. Your growth edge is boundaries — caring for others must not become self-erasure.',
  Leo: 'You are here to be seen. Leo energy creates, performs and warms everyone around it. Your growth edge is humility — the sun shines on everyone, not only on its favourites.',
  Virgo: 'You notice the detail nobody else caught. Virgo energy heals, refines and serves. Your growth edge is perfectionism — done and kind beats flawless and late.',
  Libra: 'You are the diplomat of the zodiac. Libra energy seeks fairness, beauty and partnership. Your growth edge is decision — peace bought by silence is not peace.',
  Scorpio: 'You go all the way down. Scorpio energy transforms, investigates and heals what others avoid. Your growth edge is trust — not everyone who comes close is a threat.',
  Sagittarius: 'You are the seeker. Sagittarius energy expands through travel, philosophy and truth-telling. Your growth edge is follow-through — the arrow must land somewhere.',
  Capricorn: 'You are the architect. Capricorn energy climbs, structures and endures. Your growth edge is softness — rest is not a reward for finishing, it is part of the work.',
  Aquarius: 'You see the future in advance. Aquarius energy innovates, networks and refuses stale rules. Your growth edge is feeling — ideas change systems, but warmth changes people.',
  Pisces: 'You are porous to the divine. Pisces energy imagines, empathises and dissolves boundaries. Your growth edge is grounding — a dream needs a calendar to become real.'
};

export const PLANET_GIFT = {
  Sun: 'authority, visibility and a strong spine',
  Moon: 'emotional depth, memory and public warmth',
  Mars: 'courage, stamina and the will to fight for what matters',
  Mercury: 'intelligence, speech and commercial instinct',
  Jupiter: 'wisdom, generosity and the ability to attract teachers',
  Venus: 'charm, artistry and the capacity to enjoy life',
  Saturn: 'discipline, endurance and hard-won credibility',
  Rahu: 'ambition, unconventional thinking and rapid worldly rise',
  Ketu: 'detachment, intuition and spiritual insight'
};

export const PLANET_WATCH = {
  Sun: 'ego flare-ups and the need to always be right',
  Moon: 'mood swings and decisions made in a low tide',
  Mars: 'impulse and unnecessary confrontation',
  Mercury: 'overthinking and scattered focus',
  Jupiter: 'over-promising and comfortable complacency',
  Venus: 'indulgence and avoiding hard conversations',
  Saturn: 'self-doubt, delay and a harsh inner critic',
  Rahu: 'illusions, shortcuts and borrowed ambition',
  Ketu: 'isolation and a quiet habit of disappearing'
};

export const PLANET_ENERGY = {
  Sun: 'The Sun asks you to lead honestly and be seen without armour.',
  Moon: 'The Moon asks you to feel fully and still choose with care.',
  Mars: 'Mars asks you to act cleanly — with force, but without cruelty.',
  Mercury: 'Mercury asks you to speak clearly and to learn out loud.',
  Jupiter: 'Jupiter asks you to expand generously and teach what you know.',
  Venus: 'Venus asks you to enjoy beauty and to value your own worth.',
  Saturn: 'Saturn asks you to keep the promise even when nobody is watching.',
  Rahu: 'Rahu asks you to chase the big thing without losing your ethics.',
  Ketu: 'Ketu asks you to release what you have outgrown, without drama.'
};

export const TOPIC_PLAYBOOK = {
  general: {
    label: 'Life overall',
    houses: [1, 10],
    focus: 'the full arc of your life rather than one narrow concern',
    block: 'trying to optimise everything at once',
    action: 'name one priority for the next ninety days and protect it',
    dos: ['Protect your mornings', 'Keep one promise to yourself daily', 'Ask directly instead of assuming'],
    donts: ['Do not make permanent decisions in a temporary mood', 'Do not compare your chapter 3 to someone\'s chapter 20', 'Do not outsource your judgement']
  },
  love: {
    label: 'Love & marriage',
    houses: [7, 2, 11],
    focus: 'the quality of the bond, not just the presence of a person',
    block: 'choosing intensity over intimacy',
    action: 'have the honest conversation you have been rehearsing in the shower',
    dos: ['Say the appreciation out loud', 'Protect weekly time together', 'Listen to the sentence under the sentence'],
    donts: ['Do not test love instead of asking for it', 'Do not confuse anxiety with chemistry', 'Do not make promises you intend to renegotiate']
  },
  career: {
    label: 'Career & profession',
    houses: [10, 6, 2],
    focus: 'the work the world will pay you reliably to do',
    block: 'waiting to feel fully ready before acting',
    action: 'ship one visible piece of work this month',
    dos: ['Track outcomes, not just effort', 'Build one ally who is senior to you', 'Rest properly on your day off'],
    donts: ['Do not resign on a Friday night', 'Do not confuse busyness with progress', 'Do not badmouth your current role in public']
  },
  money: {
    label: 'Money & wealth',
    houses: [2, 11, 8],
    focus: 'the rhythm of earning, saving and holding',
    block: 'spending for emotional relief',
    action: 'write down every outflow for the next thirty days, without judgement',
    dos: ['Automate one small investment', 'Keep an emergency fund', 'Negotiate what you are worth'],
    donts: ['Do not make large purchases in an emotional spike', 'Do not lend money you cannot afford to lose', 'Do not chase quick returns you do not understand']
  },
  education: {
    label: 'Education & study',
    houses: [5, 9, 3],
    focus: 'how you learn and where that learning should take you',
    block: 'comparing your pace to a batchmate\'s pace',
    action: 'build a fixed daily study slot — even fifteen minutes counts',
    dos: ['Study in the same place every day', 'Teach one topic to someone else to prove mastery', 'Revise before learning something new'],
    donts: ['Do not depend on motivation', 'Do not study on the bed', 'Do not skip sleep before an exam']
  },
  health: {
    label: 'Health & wellbeing',
    houses: [6, 1, 12],
    focus: 'energy, routine and the habits that keep you vertical',
    block: 'running on urgency instead of recovery',
    action: 'book the check-up you have been postponing',
    dos: ['Sleep at a consistent time', 'Move your body daily', 'Drink water before your first tea'],
    donts: ['Do not self-medicate or diagnose from a reading', 'Do not skip meals for deadlines', 'Do not treat rest as laziness']
  },
  family: {
    label: 'Family & home',
    houses: [4, 2, 6],
    focus: 'the emotional architecture of your household',
    block: 'managing other people\'s feelings instead of stating your own',
    action: 'have one calm, uninterrupted conversation this week',
    dos: ['Create one shared ritual', 'Speak in "I" statements', 'Give elders their dignity while holding your boundary'],
    donts: ['Do not win the argument and lose the relationship', 'Do not triangulate through a third person', 'Do not bring up old receipts in a new fight']
  },
  spiritual: {
    label: 'Spirit & purpose',
    houses: [9, 5, 12],
    focus: 'what makes your life feel meaningful rather than merely successful',
    block: 'waiting for certainty before beginning the practice',
    action: 'sit in silence for ten minutes daily for seven days',
    dos: ['Choose one practice and repeat it', 'Serve quietly, once a week', 'Keep a dream journal'],
    donts: ['Do not turn spiritual practice into a performance', 'Do not collect gurus', 'Do not bypass real problems with nice ideas']
  },
  relationship: {
    label: 'Relationships',
    houses: [7, 3, 11],
    focus: 'how you show up for other people',
    block: 'assuming the other person already understands',
    action: 'ask one sincere question and let the answer surprise you',
    dos: ['Be curious before being certain', 'Honour your own limits', 'Make the first repair attempt'],
    donts: ['Do not chase energy that is chasing someone else', 'Do not withhold clarity as leverage', 'Do not rewrite your own needs to keep peace']
  },
  decision: {
    label: 'A decision',
    houses: [1, 7, 10],
    focus: 'the actual choice in front of you',
    block: 'wanting a guaranteed outcome before moving',
    action: 'write both paths out as one page each; choose the one you can still defend in a year',
    dos: ['Decide within a stated deadline', 'Check the decision against your values', 'Sleep on it — once'],
    donts: ['Do not decide while hungry, angry or tired', 'Do not let fear speak in the voice of logic', 'Do not keep the decision hostage to someone else\'s mood']
  }
};

export const TRANSIT_NOTES = {
  Sun: 'Sun transits highlight authority, health and the father principle. Around this period, visibility increases and so does the need for clean leadership.',
  Moon: 'The Moon moves daily — it colours mood and appetite rather than destiny. Its transit sets the emotional weather, not the climate.',
  Mars: 'Mars transits add heat, urgency and friction. Excellent for physical work and deadlines; dangerous for impulsive messages.',
  Mercury: 'Mercury transits govern conversation, commerce and paperwork. Read twice, reply once.',
  Jupiter: 'Jupiter transits expand whatever house they touch — generosity, teaching, children and financial openings.',
  Venus: 'Venus transits soften and beautify — good for relationships, design, money flow and creative work.',
  Saturn: 'Saturn transits compress, mature and restructure. What survives this period is genuinely yours.',
  Rahu: 'Rahu transits amplify ambition, foreign matters and the temptation to take shortcuts. Keep your integrity visible.',
  Ketu: 'Ketu transits dissolve attachment in whatever house it occupies — often a quiet relief, sometimes a strange emptiness.'
};

export const CLOSINGS = [
  'The stars describe the weather, never your will. Take what fits, leave what does not, and move with your own two feet. — Jai Guru Dev 🙏',
  'Whatever this reading touched, remember: you are the one holding the pen. The chart is a map, not a sentence. Walk gently, walk well. ✨',
  'Nothing here is fixed. The moment you choose differently, a new line appears in the chart. That is your power, and it is always yours. 💜',
  'Keep your practice small and daily. The universe responds more to consistency than to intensity. Shubh ho. 🌙',
  'May the numbers guide your decisions, the planets hold your patience, and your own sense decide the rest. Radhe Radhe 🙏'
];

export const DISCLAIMER =
  'This reading is offered for self-reflection, spiritual insight and creative guidance — not as fact, medical advice, legal opinion, financial recommendation or a fixed fatalistic prediction. Astrology and numerology are interpretive traditions, not certified science. Planetary positions here are computed with a simplified ephemeris and may differ slightly from professional software. You are always free to choose; for health, legal or financial matters please consult a qualified professional.';

export const SCORE_LABELS = (score) =>
  score >= 4.5 ? 'Exceptional'
    : score >= 3.5 ? 'Strong'
      : score >= 2.5 ? 'Steady'
        : score >= 1.5 ? 'Mixed'
          : 'Demanding';
