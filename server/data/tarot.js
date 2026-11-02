/** 78-card tarot deck used by the Cosmic Oracle reading engine. */

const card = (id, name, arcana, suit, rank, keywords, element, astrology, upright, reversed, advice) => ({
  id, name, arcana, suit, rank, keywords, element, astrology, upright, reversed, advice
});

const major = [
  ['The Fool', 0, 'new beginnings, faith, a leap', 'Air', 'Uranus', 'A fresh cycle opens. Innocence, curiosity and trust are your strongest assets — the path appears as you walk it.', 'Recklessness, hesitation, or a leap taken without a map. Check the cliff before jumping.', 'Say yes to one small beginning this week.'],
  ['The Magician', 1, 'manifestation, will, skill', 'Air', 'Mercury', 'Every tool you need is already on the table. Focused intention turns thought into form.', 'Scattered focus, manipulation, or talent left unused.', 'Pick one goal and give it your undivided attention for nine days.'],
  ['The High Priestess', 2, 'intuition, mystery, stillness', 'Water', 'Moon', 'The answer is already inside you. Silence, dreams and study reveal what noise cannot.', 'Ignoring your gut, secrets, or disconnection from your inner voice.', 'Journal tonight before you ask anyone else for advice.'],
  ['The Empress', 3, 'abundance, nurture, creation', 'Earth', 'Venus', 'Growth is organic and generous. Care for what you have planted and it will feed you.', 'Creative block, smothering, or neglecting your own body.', 'Nourish your body, home or project with one act of beauty.'],
  ['The Emperor', 4, 'structure, authority, stability', 'Fire', 'Aries', 'Build the frame. Boundaries, routine and clear authority create the freedom you want.', 'Rigidity, control, or a leader who has stopped listening.', 'Write the rule you keep breaking — then design around it.'],
  ['The Hierophant', 5, 'tradition, guidance, learning', 'Earth', 'Taurus', 'A teacher, institution or tried-and-tested path supports you. Learn the rules before rewriting them.', 'Dogma, rebellion for its own sake, or a mentor who no longer fits.', 'Find one person who has already walked your road.'],
  ['The Lovers', 6, 'choice, union, values', 'Air', 'Gemini', 'A meaningful choice or bond asks you to align with your values, not your convenience.', 'Misalignment, avoidance of a decision, or a bond out of balance.', 'Choose what you would choose if nobody were watching.'],
  ['The Chariot', 7, 'momentum, willpower, victory', 'Water', 'Cancer', 'Two opposing forces can pull one cart. Direction, not speed, wins this race.', 'Burnout, force, or losing the reins.', 'Set one destination for the next 30 days and protect it.'],
  ['Strength', 8, 'courage, patience, gentle power', 'Fire', 'Leo', 'Soft control tames the lion. Your calm is a form of strength people can feel.', 'Self-doubt, suppressed anger, or force where tenderness was needed.', 'Respond, don\'t react — count to ten before the reply.'],
  ['The Hermit', 9, 'introspection, solitude, wisdom', 'Earth', 'Virgo', 'Withdraw purposefully. The lantern you carry is enough for the next step only.', 'Isolation, avoidance, or hiding behind "I need space".', 'Take one honest hour alone with no screen.'],
  ['Wheel of Fortune', 10, 'cycles, luck, turning points', 'Fire', 'Jupiter', 'The wheel moves. What stalled begins to turn — meet it with readiness, not fear.', 'Resistance to change, repeating the same loop.', 'List what has ended. Let it end properly.'],
  ['Justice', 11, 'truth, balance, karma', 'Air', 'Libra', 'Cause and effect are visible now. Honesty and fair dealing settle the matter.', 'Bias, avoidance of accountability, an unfair deal.', 'Tell the complete truth, even the inconvenient part.'],
  ['The Hanged Man', 12, 'pause, surrender, new perspective', 'Water', 'Neptune', 'The delay is the teaching. Suspend the struggle and look from a different angle.', 'Stalling, martyrdom, or refusing to see the obvious.', 'Ask: what would this look like in two years?'],
  ['Death', 13, 'endings, transformation, rebirth', 'Water', 'Scorpio', 'A chapter closes so the next can exist. This is release, not punishment.', 'Clinging to the old, fear of change, a slow ending you refuse to sign.', 'Name what is over, and give it a proper goodbye.'],
  ['Temperance', 14, 'balance, patience, alchemy', 'Fire', 'Sagittarius', 'Blend the extremes slowly. Moderation here is not dullness — it is mastery.', 'Excess, impatience, or an unstable mix.', 'Take the middle path in one place you have been extreme.'],
  ['The Devil', 15, 'attachment, desire, shadow', 'Earth', 'Capricorn', 'What holds you is partly chosen. See the chain; the lock is already open.', 'Breaking free, or refusing to see the bargain you made.', 'Name the habit you are loyal to. Loyalty is not love.'],
  ['The Tower', 16, 'disruption, revelation, clearing', 'Fire', 'Mars', 'A false structure cracks so truth can enter. Painful, but clarifying.', 'A crisis narrowly avoided, or the fear that keeps you in a fragile tower.', 'Do not rebuild the same wall. Ask what it was protecting.'],
  ['The Star', 17, 'hope, healing, guidance', 'Air', 'Aquarius', 'You are being guided through the dark. Gentle, steady hope is warranted.', 'Discouragement, faith fatigue, or looking only at the storm clouds.', 'Do one small healing act and let it be enough.'],
  ['The Moon', 18, 'intuition, illusion, dreams', 'Water', 'Pisces', 'Not everything is as it appears. Feel your way through; do not sign in the dark.', 'Clarity returning, anxiety easing, or self-deception ending.', 'Ask one more question before you commit.'],
  ['The Sun', 19, 'joy, clarity, success', 'Fire', 'Sun', 'The fog lifts. Visibility, warmth and open-hearted success are available.', 'Dimmed confidence, delays, or joy postponed for no reason.', 'Let yourself be seen — share the good news.'],
  ['Judgement', 20, 'awakening, calling, reckoning', 'Fire', 'Pluto', 'A call you cannot unhear. Answer it honestly and the past settles.', 'Ignoring the call, self-judgement, or old guilt replayed.', 'Forgive one person today. Start with yourself.'],
  ['The World', 21, 'completion, wholeness, arrival', 'Earth', 'Saturn', 'A cycle completes. Gather the harvest and let yourself enjoy the arrival.', 'Loose ends, fear of finishing, or completion without celebration.', 'Tick the final box, then actually celebrate it.']
].map(([name, number, keywords, element, astrology, upright, reversed, advice]) =>
  card(`major-${number}`, name, 'major', null, number, keywords, element, astrology, upright, reversed, advice));

const suitMeta = {
  wands: { name: 'Wands', element: 'Fire', domain: 'action, work, ambition', glyph: '🜂' },
  cups: { name: 'Cups', element: 'Water', domain: 'emotion, love, intuition', glyph: '🜄' },
  swords: { name: 'Swords', element: 'Air', domain: 'mind, truth, conflict', glyph: '🜁' },
  pentacles: { name: 'Pentacles', element: 'Earth', domain: 'money, body, craft', glyph: '🜃' }
};

const ranks = {
  Ace: { advice: "Start something small and real in this area this week.", key: 'a seed, a spark of pure potential', up: 'A brand-new offer in the realm of', rev: 'A stalled start or a seed planted too fast in the realm of' },
  Two: { advice: "Name the two options out loud, then choose one by a deadline.", key: 'a choice, a balance between two forces', up: 'Two options ask for a decision in the realm of', rev: 'An imbalance or avoided choice in the realm of' },
  Three: { advice: "Share the work — this grows faster with other people.", key: 'growth, collaboration, first results', up: 'Early results and collaboration in the realm of', rev: 'Scattered effort or delayed growth in the realm of' },
  Four: { advice: "Build the structure before you urgently need it.", key: 'stability, structure, consolidation', up: 'Consolidation and a needed pause in the realm of', rev: 'Restlessness or a structure that has become a cage in the realm of' },
  Five: { advice: "Treat the friction as information, not as failure.", key: 'friction, challenge, adjustment', up: 'Friction that demands adjustment in the realm of', rev: 'A conflict easing — or being avoided — in the realm of' },
  Six: { advice: "Give and receive in equal measure this week.", key: 'harmony, exchange, recovery', up: 'Harmony, generosity and rebalancing in the realm of', rev: 'An unequal exchange or nostalgia blocking the present in the realm of' },
  Seven: { advice: "Pause, review honestly, then act once.", key: 'reflection, patience, assessment', up: 'A strategic pause and honest assessment in the realm of', rev: 'Overthinking or impatience in the realm of' },
  Eight: { advice: "Practise deliberately, not frantically.", key: 'movement, mastery, momentum', up: 'Steady mastery and momentum in the realm of', rev: 'Stalling, perfectionism or a loose thread in the realm of' },
  Nine: { advice: "Trust what you have built and finish the last mile.", key: 'culmination, near-completion, self-sufficiency', up: 'A near-complete harvest and earned self-reliance in the realm of', rev: 'Anxiety at the finish line or depletion in the realm of' },
  Ten: { advice: "Hand back what was never yours to carry.", key: 'fullness, responsibility, the end of a cycle', up: 'The full weight and reward of a cycle in the realm of', rev: 'Overburden or misplaced responsibility in the realm of' },
  Page: { advice: "Ask the naive question out loud — it usually opens the door.", key: 'a message, curiosity, a student', up: 'A message or fresh curiosity in the realm of', rev: 'Immaturity or a message left unread in the realm of' },
  Knight: { advice: "Move, but aim before you charge.", key: 'movement, pursuit, a strong push', up: 'A determined push forward in the realm of', rev: 'Scattered momentum or a hasty move in the realm of' },
  Queen: { advice: "Lead with presence rather than performance.", key: 'inner mastery, nurture, magnetism', up: 'Mature, magnetic mastery in the realm of', rev: 'Overwhelm or over-giving in the realm of' },
  King: { advice: "Take responsibility, then delegate.", key: 'outer mastery, authority, command', up: 'Commanding, stable authority in the realm of', rev: 'Control or rigidity in the realm of' }
};

const specific = {
  'wands-Ace': ['A creative spark that wants to become a fire. Say yes to the idea.', 'Doubt, delay, or an idea with no fuel yet.'],
  'wands-Two': ['A plan has left your head and is waiting at the border. Commit to the expansion.', 'Fear of the unknown keeps you inside the gate.'],
  'wands-Three': ['Your first ships are on the horizon. Expansion is real, though not immediate.', 'Delays, small returns, or a horizon that needs widening.'],
  'wands-Four': ['A celebration and a stable base. Home and work feel aligned.', 'An unstable foundation or a celebration postponed.'],
  'wands-Five': ['Creative friction. Competition is noisy, not fatal.', 'Conflict resolving, or avoided confrontation costing you.'],
  'wands-Six': ['Public recognition and a well-earned win. Accept the applause.', 'Self-doubt or recognition that has not yet arrived.'],
  'wands-Seven': ['You are holding your ground — and it is worth holding.', 'Defensiveness, or giving up a position too early.'],
  'wands-Eight': ['Swift movement. Messages and events accelerate.', 'Delays, crossed wires, or a rush that needs slowing.'],
  'wands-Nine': ['Battered but still standing. Your endurance is the lesson.', 'Paranoia and exhaustion — lower the guard a little.'],
  'wands-Ten': ['A heavy load that is nearly delivered. Delegate before it flattens you.', 'Laying down a burden that was never yours.'],
  'wands-Page': ['An exciting idea, invitation or message about your work.', 'Scattered enthusiasm, or news without substance.'],
  'wands-Knight': ['Bold, fast movement — charge, but aim first.', 'Recklessness, or a fire that burns out quickly.'],
  'wands-Queen': ['Confident warmth. Lead by presence rather than force.', 'Jealousy or insecurity hiding behind loudness.'],
  'wands-King': ['Vision with authority. You are ready to lead the project.', 'Impulsive leadership or arrogance.'],
  'cups-Ace': ['An emotional opening — love, creativity or spiritual refreshment.', 'A blocked heart or a feeling you will not let in.'],
  'cups-Two': ['A true meeting of equals. Mutual recognition.', 'An unbalanced relationship or a rupture needing repair.'],
  'cups-Three': ['Friendship, celebration, community. Let people in.', 'Over-indulgence, gossip, or a third party in the mix.'],
  'cups-Four': ['Boredom and a missed offer. Look at what is being handed to you.', 'New interest awakening after a stale period.'],
  'cups-Five': ['Grief over what spilled. Turn around — two cups still stand.', 'Forgiveness, or finally letting the grief move.'],
  'cups-Six': ['Sweet nostalgia, kindness, a return of something good.', 'Stuck in the past; a rose-tinted memory.'],
  'cups-Seven': ['Many options, some illusions. Choose with your feet, not your fantasies.', 'Clarity returning; options narrowing usefully.'],
  'cups-Eight': ['Walking away from something that no longer satisfies. This is courage.', 'Fear of leaving, or returning to what you already outgrew.'],
  'cups-Nine': ['Contentment, comfort and the wish fulfilled. Enjoy it without guilt.', 'Superficial pleasure, or a wish that has not actually been met.'],
  'cups-Ten': ['Emotional fulfilment and family harmony.', 'A picture-perfect ideal that needs reality-checking.'],
  'cups-Page': ['Tender news, a sweet message, intuitive curiosity.', 'Moodiness, or a message that is emotionally immature.'],
  'cups-Knight': ['A romantic gesture or a following of the heart.', 'Idealisation, jealousy, or promises without roots.'],
  'cups-Queen': ['Deep intuition and emotional safety. Trust your inner knowing.', 'Codependency, or feelings running the whole show.'],
  'cups-King': ['Emotional maturity and calm authority over feeling.', 'Suppression, or a person charming but unavailable.'],
  'swords-Ace': ['A sharp truth cuts through. Clarity and honest speech.', 'Confusion, or a truth used as a weapon.'],
  'swords-Two': ['A stalemate and an avoided decision. The blindfold is a choice.', 'An uncomfortable truth surfacing, or indecision breaking.'],
  'swords-Three': ['Heartbreak and honest pain. Let it move through.', 'Healing beginning, or a hurt kept alive.'],
  'swords-Four': ['Rest, recovery, a deliberate retreat.', 'Restlessness, or burnout refusing to be treated.'],
  'swords-Five': ['A hollow win. Ask whether being right is worth the cost.', 'Reconciliation, or a grudge finally released.'],
  'swords-Six': ['A necessary transition to calmer waters.', 'Carrying the old baggage into the new place.'],
  'swords-Seven': ['Strategy, secrecy, or a quiet exit. Check your integrity.', 'A secret surfacing, or self-deception ending.'],
  'swords-Eight': ['Feeling trapped by your own thinking. The exit is real once you stop pushing.', 'A limiting belief loosening.'],
  'swords-Nine': ['Anxiety and sleepless worry that is worse than the facts.', 'Relief, or shame that must be spoken to be healed.'],
  'swords-Ten': ['A painful ending that is genuinely over. No more cuts.', 'Recovery beginning, or resisting a completed ending.'],
  'swords-Page': ['Curiosity, research, news that needs verification.', 'Gossip, or a half-truth taken as fact.'],
  'swords-Knight': ['Fast, decisive action. Charge with a clear target.', 'Aggression, or rushing without a plan.'],
  'swords-Queen': ['Clear-eyed honesty and healthy boundaries.', 'Coldness, or criticism used as armour.'],
  'swords-King': ['Intellectual authority and fair judgement.', 'Tyranny of logic, or someone who must always be right.'],
  'pentacles-Ace': ['A tangible opportunity: money, work, health, a real seed.', 'A missed opportunity or a blocked material start.'],
  'pentacles-Two': ['Juggling resources and staying adaptable.', 'Overcommitment, or finances out of rhythm.'],
  'pentacles-Three': ['Craft, teamwork and recognition for skill.', 'Sloppy work, or collaboration that needs clarity.'],
  'pentacles-Four': ['Security and holding. Save, protect, stabilise.', 'Greed, or fear of loss that blocks flow.'],
  'pentacles-Five': ['A lean season and a real need for support. Ask for help.', 'Recovery beginning, or isolation lifting.'],
  'pentacles-Six': ['Fair exchange, generosity, receiving what is due.', 'Debt imbalance, or giving with strings attached.'],
  'pentacles-Seven': ['Patient investment. The harvest is not ready yet.', 'Impatience, or effort in the wrong field.'],
  'pentacles-Eight': ['Diligence and skill being built deliberately.', 'Perfectionism, or a craft that needs variety.'],
  'pentacles-Nine': ['Independence and the reward of long labour. Enjoy your garden.', 'Over-reliance on display, or work-life imbalance.'],
  'pentacles-Ten': ['Legacy, family wealth, long-term security.', 'Family disputes over money, or a shaky inheritance.'],
  'pentacles-Page': ['A practical new beginning, a study, a small investment.', 'Procrastination, or a plan without discipline.'],
  'pentacles-Knight': ['Steady, reliable progress. The tortoise wins.', 'Stubbornness, or a routine that has become a rut.'],
  'pentacles-Queen': ['Abundance, nurturance and grounded competence.', 'Neglecting yourself while caring for everyone else.'],
  'pentacles-King': ['Material mastery, generosity and long-term stewardship.', 'Greed, or a success that feels hollow.']
};

const minors = [];
for (const [suitKey, meta] of Object.entries(suitMeta)) {
  for (const [rankName, rankMeta] of Object.entries(ranks)) {
    const id = `${suitKey}-${rankName.toLowerCase()}`;
    const [up2, rev2] = specific[id] || [];
    const upright = up2 || `${rankMeta.up} ${meta.domain}.`;
    const reversed = rev2 || `${rankMeta.rev} ${meta.domain}.`;
    minors.push(card(
      id,
      `${rankName} of ${meta.name}`,
      'minor',
      suitKey,
      rankName,
      rankMeta.key,
      meta.element,
      `${meta.element} · ${meta.domain.split(',')[0]}`,
      upright,
      reversed,
      rankMeta.advice
    ));
  }
}

export const TAROT_DECK = [...major, ...minors];

export const CARD_BACK = {
  name: 'The Cosmic Oracle',
  symbol: '✦',
  glyph: '☾ ✦ ☉'
};
