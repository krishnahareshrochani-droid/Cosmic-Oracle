/** Positional definitions for every spread the Oracle can draw. */
const p = (label, prompt) => ({ label, prompt });

export const SPREADS = {
  daily: [p("Today's Energy", 'The single vibration surrounding your day')],
  ppf: [
    p('Past', 'What shaped this situation and still echoes'),
    p('Present', 'Where the energy stands right now'),
    p('Future', 'The direction it is travelling toward')
  ],
  monthly: [
    p('Theme of the Month', 'The dominant lesson of the next four weeks'),
    p('Opportunity', 'Where the door is actually open'),
    p('Challenge', 'What will test your patience'),
    p('Outcome', 'What you carry into the next month')
  ],
  weekly: [
    p('Monday', 'Momentum and mindset'),
    p('Tuesday', 'Courage and conflict'),
    p('Wednesday', 'Communication and trade'),
    p('Thursday', 'Growth and guidance'),
    p('Friday', 'Love, beauty and money'),
    p('Saturday', 'Discipline and delay'),
    p('Sunday', 'Rest, spirit and integration')
  ],
  yearly: Array.from({ length: 12 }, (_, i) =>
    p(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][i], 'The energy of this month in the year ahead')),
  yearAhead: [
    ...Array.from({ length: 12 }, (_, i) =>
      p(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][i], 'Monthly focus for the year ahead')),
    p('Theme of the Year', 'The single thread running through all twelve months')
  ],
  decision: [
    p('Option A', 'What happens if you say yes'),
    p('Option B', 'What happens if you say no or wait'),
    p('Hidden Factor', 'What you have not allowed yourself to see')
  ],
  finance: [
    p('Current Money Energy', 'Your relationship with money right now'),
    p('The Block', 'What is throttling the flow'),
    p('The Opportunity', 'Where the next rupee comes from'),
    p('Next 90 Days', 'The financial trajectory')
  ],
  education: [
    p('Current Standing', 'Where your studies truly stand'),
    p('Learning Style', 'How you absorb best'),
    p('The Obstacle', 'What interrupts focus'),
    p('Result Energy', 'What the exam or admission window holds')
  ],
  friendship: [
    p('The Bond', 'The true nature of this friendship'),
    p('Their Energy', 'What this person brings to you'),
    p('The Friction', 'Where the relationship strains'),
    p('The Future', 'Where it goes from here')
  ],
  situation: [
    p('The Situation', 'What is actually happening'),
    p('Hidden Influence', 'The unseen factor'),
    p('Your Role', 'The part you are playing'),
    p('The Other Side', 'What others are bringing'),
    p('Where It Leads', 'The likely direction')
  ],
  career: [
    p('Where You Are', 'Your current professional standing'),
    p('Your Gift', 'The talent you undervalue'),
    p('The Obstacle', 'The real bottleneck'),
    p('The Opening', 'The opportunity worth chasing'),
    p('Next Step', 'The action for the next 30 days')
  ],
  health: [
    p('Body Signal', 'What your body is asking for'),
    p('Energy Reserves', 'Your current vitality'),
    p('The Stressor', 'What is draining you'),
    p('Restoration', 'The practice that restores you'),
    p('Steady State', 'The wellbeing trajectory')
  ],
  love: [
    p('Your Heart', 'What you are truly feeling'),
    p('Their Energy', 'What the other person is bringing'),
    p('The Bond', 'The nature of the current connection'),
    p('The Block', 'What is keeping you apart'),
    p('The Truth', 'What is real beneath the story'),
    p('The Direction', 'Where this is heading'),
    p('The Lesson', 'What love is teaching you')
  ],
  family: [
    p('Family Climate', 'The mood of the household'),
    p('Your Role', 'Where you stand in the system'),
    p('An Elder', 'The influence of an elder'),
    p('Friction Point', 'Where the tension lives'),
    p('Healing', 'What restores harmony'),
    p('The Future', 'The direction of the family')
  ],
  purpose: [
    p('Your Essence', 'Who you are beneath the roles'),
    p('Your Gift', 'What you are here to give'),
    p('The Block', 'What keeps you from giving it'),
    p('The Calling', 'The work that calls you'),
    p('The Path', 'The practical route toward it'),
    p('The Allies', 'Who helps you on the way'),
    p('The Reward', 'What fulfilment looks like')
  ],
  micro: [p('The Pulse', 'The energy of this exact moment')],
  mini: [
    p('The Root', 'Where the matter began'),
    p('The Now', 'Where it stands'),
    p('The Next', 'What comes next')
  ],
  standard: [
    p('Situation', 'The circumstance'),
    p('Challenge', 'The test'),
    p('Past', 'What brought you here'),
    p('Future', 'Where it is going'),
    p('Your Power', 'What you control')
  ],
  deep: [
    p('The Situation', 'What is happening'),
    p('The Challenge', 'What you are up against'),
    p('The Past', 'What brought you here'),
    p('The Future', 'Where this leads'),
    p('Your Power', 'What you can control'),
    p('The Hidden', 'What is working behind the scenes'),
    p('The Advice', 'The wisest move')
  ],
  premium: [
    p('Life Theme', 'The thread of this life chapter'),
    p('Soul Work', 'What your soul is practising'),
    p('Body', 'The physical dimension'),
    p('Mind', 'The mental dimension'),
    p('Heart', 'The emotional dimension'),
    p('Career', 'The professional dimension'),
    p('Money', 'The financial dimension'),
    p('Love', 'The relational dimension'),
    p('Family', 'The family dimension'),
    p('Karma', 'The karmic lesson'),
    p('Next Year', 'The year ahead'),
    p('Blessing', 'The grace available to you')
  ],
  yesno: [
    p('The Now', 'Where the matter stands'),
    p('The Obstacle', 'What could change the answer'),
    p('The Answer', 'The most likely outcome')
  ],
  mindbodysoul: [
    p('Mind', 'Your mental state'),
    p('Body', 'Your physical state'),
    p('Soul', 'Your spiritual state')
  ],
  newmoon: [
    p('What to Plant', 'The intention to set'),
    p('What to Release', 'What must be cleared first'),
    p('Your Ally', 'The energy supporting you'),
    p('The Growth', 'How it will unfold')
  ],
  fullmoon: [
    p('What Is Complete', 'The cycle now closing'),
    p('What to Release', 'What to surrender'),
    p('The Gift', 'What you gained'),
    p('The Integration', 'What comes forward with you')
  ],
  star: [
    p('The Star', 'Your central theme'),
    p('Body', 'Physical vitality'),
    p('Mind', 'Mental clarity'),
    p('Emotions', 'Emotional truth'),
    p('Spirit', 'Spiritual guidance')
  ],
  selflove: [
    p('How You See Yourself', 'The mirror of self-image'),
    p('What You Withhold', 'The love you deny yourself'),
    p('The Wound', 'Where it began'),
    p('The Healing', 'What restores you'),
    p('The Practice', 'Your daily act of self-love')
  ],
  birthday: [
    p('Year Theme', 'The theme of this new solar year'),
    p('Gift', 'What this year gives you'),
    p('Challenge', 'What it asks of you'),
    p('Growth', 'The evolution available'),
    p('Blessing', 'The grace of the year')
  ],
  manifestation: [
    p('The Desire', 'What you want to call in'),
    p('The Belief Block', 'What contradicts the desire'),
    p('The Action', 'The practical step'),
    p('The Timing', 'When the window opens'),
    p('The Witness', 'Who holds you accountable'),
    p('The Receiving', 'How to let it arrive')
  ],
  horseshoe: [
    p('Present Situation', 'The question you are actually asking'),
    p('Silver Lining', 'The hidden asset'),
    p('Recent Past', 'What led here'),
    p('The Wall', 'The obstacle'),
    p('Others', 'What the people around you add'),
    p('Your Move', 'The action in your control'),
    p('The Outcome', 'Where it resolves')
  ],
  relationship: [
    p('You', 'Your side of the bond'),
    p('Them', 'Their side of the bond'),
    p('The Connection', 'What holds you together'),
    p('The Tension', 'What pulls you apart'),
    p('Their Need', 'What they need from you'),
    p('Your Need', 'What you need from them'),
    p('The Direction', 'Where the bond is heading')
  ],
  shadow: [
    p('The Facade', 'What you show the world'),
    p('The Shadow', 'What you hide'),
    p('The Origin', 'Where the shadow formed'),
    p('The Gift', 'What the shadow protects'),
    p('The Integration', 'How to make it conscious')
  ],
  lovetriangle: [
    p('You', 'Where your heart actually stands'),
    p('Partner A', 'What this person brings'),
    p('Partner B', 'What the other person brings'),
    p('The Illusion', 'What you are not seeing'),
    p('The Real Need', 'What is truly missing'),
    p('The Cost', 'What this situation costs'),
    p('The Honest Path', 'The most honest way forward')
  ],
  chakra: [
    p('Root', 'Safety, stability and money'),
    p('Sacral', 'Desire, creativity and flow'),
    p('Solar Plexus', 'Will, power and confidence'),
    p('Heart', 'Love, grief and forgiveness'),
    p('Throat', 'Truth and expression'),
    p('Third Eye', 'Intuition and insight'),
    p('Crown', 'Connection and purpose')
  ],
  celtic: [
    p('The Present', 'Where you stand now'),
    p('The Challenge', 'What crosses you'),
    p('The Past', 'What is passing away'),
    p('The Future', 'What is approaching'),
    p('Above', 'Your conscious goal'),
    p('Below', 'Your subconscious root'),
    p('Advice', 'Your best move'),
    p('External', 'How others see it'),
    p('Hopes & Fears', 'What you long for and dread'),
    p('Outcome', 'The most likely result')
  ],
  careerpath: [
    p('Current Role', 'Where you stand professionally'),
    p('Natural Skill', 'Your professional gift'),
    p('Reputation', 'How the market sees you'),
    p('Next Move', 'The strategic step'),
    p('Expansion', 'Where growth lives'),
    p('Fulfilment', 'What success actually means to you')
  ],
  birthcard: [p('Your Birth Card', 'The archetype you were born under')],
  soulcard: [p('Your Soul Card', 'The archetype of your life purpose')],
  yearcard: [p('Your Year Card', 'The archetype of this personal year')],
  shadowcard: [p('Your Shadow Card', 'The archetype you avoid')],
  personality: [
    p('Core Self', 'The archetype at your centre'),
    p('Mask', 'What others first see'),
    p('Driver', 'What motivates you'),
    p('Fear', 'What holds you back'),
    p('Evolution', 'What you are becoming')
  ],
  message: [p('The Message', 'The energy behind the communication')],
  dream: [
    p('The Dream', 'What your subconscious dramatised'),
    p('The Symbol', 'The core image to interpret'),
    p('The Message', 'What it asks you to notice')
  ],
  situationenergy: [
    p('The Field', 'The energy around you'),
    p('The Source', 'Where it originates'),
    p('The Ally', 'What supports you'),
    p('The Next 7 Days', 'What the week holds')
  ],
  block: [
    p('The Block', 'What is stopping you'),
    p('The Root', 'Where the block was born'),
    p('The Key', 'What releases it')
  ],
  clarity: [
    p('Where You Are', 'Your real position'),
    p('The Fog', 'What is confusing you'),
    p('The Light', 'The clarifying factor'),
    p('The Step', 'The next clear action')
  ],
  validation: [
    p('Your Path', 'The road you are on'),
    p('The Sign', 'What confirms it'),
    p('The Adjustment', 'What needs correcting')
  ]
};
