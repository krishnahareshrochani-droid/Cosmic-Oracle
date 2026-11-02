/** Vedic astrology reference data: signs, nakshatras, planets, houses, dashas. */

export const RASHIS = [
  { name: 'Aries', hindi: 'Mesha', symbol: '♈', element: 'Fire', lord: 'Mars', quality: 'Cardinal', nature: 'Moveable', body: 'Head' },
  { name: 'Taurus', hindi: 'Vrishabha', symbol: '♉', element: 'Earth', lord: 'Venus', quality: 'Fixed', nature: 'Fixed', body: 'Face' },
  { name: 'Gemini', hindi: 'Mithuna', symbol: '♊', element: 'Air', lord: 'Mercury', quality: 'Mutable', nature: 'Dual', body: 'Shoulders' },
  { name: 'Cancer', hindi: 'Karka', symbol: '♋', element: 'Water', lord: 'Moon', quality: 'Cardinal', nature: 'Moveable', body: 'Chest' },
  { name: 'Leo', hindi: 'Simha', symbol: '♌', element: 'Fire', lord: 'Sun', quality: 'Fixed', nature: 'Fixed', body: 'Heart' },
  { name: 'Virgo', hindi: 'Kanya', symbol: '♍', element: 'Earth', lord: 'Mercury', quality: 'Mutable', nature: 'Dual', body: 'Abdomen' },
  { name: 'Libra', hindi: 'Tula', symbol: '♎', element: 'Air', lord: 'Venus', quality: 'Cardinal', nature: 'Moveable', body: 'Lower back' },
  { name: 'Scorpio', hindi: 'Vrishchika', symbol: '♏', element: 'Water', lord: 'Mars', quality: 'Fixed', nature: 'Fixed', body: 'Reproductive' },
  { name: 'Sagittarius', hindi: 'Dhanu', symbol: '♐', element: 'Fire', lord: 'Jupiter', quality: 'Mutable', nature: 'Dual', body: 'Thighs' },
  { name: 'Capricorn', hindi: 'Makara', symbol: '♑', element: 'Earth', lord: 'Saturn', quality: 'Cardinal', nature: 'Moveable', body: 'Knees' },
  { name: 'Aquarius', hindi: 'Kumbha', symbol: '♒', element: 'Air', lord: 'Saturn', quality: 'Fixed', nature: 'Fixed', body: 'Calves' },
  { name: 'Pisces', hindi: 'Meena', symbol: '♓', element: 'Water', lord: 'Jupiter', quality: 'Mutable', nature: 'Dual', body: 'Feet' }
];

export const PLANET_INFO = {
  Sun: { hindi: 'Surya', glyph: '☉', nature: 'malefic', owns: [4], exalt: 0, debil: 6, gem: 'Ruby', metal: 'Gold', mantra: 'Om Suryaya Namaha', deity: 'Shiva', colour: 'Copper red', day: 'Sunday', karaka: 'Soul, father, authority, vitality' },
  Moon: { hindi: 'Chandra', glyph: '☾', nature: 'benefic', owns: [3], exalt: 1, debil: 7, gem: 'Pearl', metal: 'Silver', mantra: 'Om Chandraya Namaha', deity: 'Parvati', colour: 'White', day: 'Monday', karaka: 'Mind, mother, emotion, nourishment' },
  Mars: { hindi: 'Mangal', glyph: '♂', nature: 'malefic', owns: [0, 7], exalt: 9, debil: 3, gem: 'Red Coral', metal: 'Copper', mantra: 'Om Mangalaya Namaha', deity: 'Kartikeya', colour: 'Red', day: 'Tuesday', karaka: 'Courage, siblings, property, energy' },
  Mercury: { hindi: 'Budha', glyph: '☿', nature: 'neutral', owns: [2, 5], exalt: 5, debil: 11, gem: 'Emerald', metal: 'Bronze', mantra: 'Om Budhaya Namaha', deity: 'Vishnu', colour: 'Green', day: 'Wednesday', karaka: 'Intellect, speech, commerce, skin' },
  Jupiter: { hindi: 'Guru', glyph: '♃', nature: 'benefic', owns: [8, 11], exalt: 3, debil: 9, gem: 'Yellow Sapphire', metal: 'Gold', mantra: 'Om Gurave Namaha', deity: 'Brahma', colour: 'Yellow', day: 'Thursday', karaka: 'Wisdom, children, wealth, dharma' },
  Venus: { hindi: 'Shukra', glyph: '♀', nature: 'benefic', owns: [1, 6], exalt: 11, debil: 5, gem: 'Diamond', metal: 'Silver', mantra: 'Om Shukraya Namaha', deity: 'Lakshmi', colour: 'White', day: 'Friday', karaka: 'Love, beauty, art, comfort' },
  Saturn: { hindi: 'Shani', glyph: '♄', nature: 'malefic', owns: [9, 10], exalt: 6, debil: 0, gem: 'Blue Sapphire', metal: 'Iron', mantra: 'Om Shanaye Namaha', deity: 'Shani', colour: 'Black', day: 'Saturday', karaka: 'Karma, discipline, longevity, labour' },
  Rahu: { hindi: 'Rahu', glyph: '☊', nature: 'malefic', owns: [10], exalt: 1, debil: 7, gem: 'Hessonite', metal: 'Lead', mantra: 'Om Rahave Namaha', deity: 'Durga', colour: 'Smoke', day: 'Saturday', karaka: 'Ambition, foreign, illusion, technology' },
  Ketu: { hindi: 'Ketu', glyph: '☋', nature: 'malefic', owns: [7], exalt: 7, debil: 1, gem: 'Cat\'s Eye', metal: 'Mixed metal', mantra: 'Om Ketave Namaha', deity: 'Ganesha', colour: 'Grey', day: 'Tuesday', karaka: 'Moksha, detachment, occult, past karma' }
};

export const PLANET_ORDER = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

export const NAKSHATRAS = [
  { name: 'Ashwini', lord: 'Ketu', deity: 'Ashwini Kumaras', symbol: 'Horse head', gana: 'Deva', yoni: 'Horse', nadi: 'Adi', quality: 'Swift, healing, pioneering', varnaHint: 'Vaishya' },
  { name: 'Bharani', lord: 'Venus', deity: 'Yama', symbol: 'Yoni', gana: 'Manushya', yoni: 'Elephant', nadi: 'Madhya', quality: 'Creative, intense, bearing burdens', varnaHint: 'Kshatriya' },
  { name: 'Krittika', lord: 'Sun', deity: 'Agni', symbol: 'Razor / flame', gana: 'Rakshasa', yoni: 'Goat', nadi: 'Antya', quality: 'Sharp, purifying, ambitious', varnaHint: 'Brahmin' },
  { name: 'Rohini', lord: 'Moon', deity: 'Brahma', symbol: 'Ox cart', gana: 'Manushya', yoni: 'Serpent', nadi: 'Antya', quality: 'Fertile, charming, abundant', varnaHint: 'Shudra' },
  { name: 'Mrigashira', lord: 'Mars', deity: 'Soma', symbol: 'Deer head', gana: 'Deva', yoni: 'Serpent', nadi: 'Madhya', quality: 'Seeking, gentle, curious', varnaHint: 'Kshatriya' },
  { name: 'Ardra', lord: 'Rahu', deity: 'Rudra', symbol: 'Teardrop', gana: 'Manushya', yoni: 'Dog', nadi: 'Adi', quality: 'Stormy, intellectual, transformative', varnaHint: 'Brahmin' },
  { name: 'Punarvasu', lord: 'Jupiter', deity: 'Aditi', symbol: 'Quiver of arrows', gana: 'Deva', yoni: 'Cat', nadi: 'Adi', quality: 'Renewing, optimistic, returning', varnaHint: 'Vaishya' },
  { name: 'Pushya', lord: 'Saturn', deity: 'Brihaspati', symbol: 'Cow udder', gana: 'Deva', yoni: 'Goat', nadi: 'Madhya', quality: 'Nourishing, dutiful, priestly', varnaHint: 'Kshatriya' },
  { name: 'Ashlesha', lord: 'Mercury', deity: 'Nagas', symbol: 'Coiled serpent', gana: 'Rakshasa', yoni: 'Cat', nadi: 'Antya', quality: 'Hypnotic, strategic, penetrating', varnaHint: 'Shudra' },
  { name: 'Magha', lord: 'Ketu', deity: 'Pitris', symbol: 'Royal throne', gana: 'Rakshasa', yoni: 'Rat', nadi: 'Antya', quality: 'Regal, ancestral, proud', varnaHint: 'Vaishya' },
  { name: 'Purva Phalguni', lord: 'Venus', deity: 'Bhaga', symbol: 'Front legs of bed', gana: 'Manushya', yoni: 'Rat', nadi: 'Madhya', quality: 'Pleasure-loving, artistic, generous', varnaHint: 'Brahmin' },
  { name: 'Uttara Phalguni', lord: 'Sun', deity: 'Aryaman', symbol: 'Back legs of bed', gana: 'Manushya', yoni: 'Cow', nadi: 'Adi', quality: 'Loyal, contractual, warm', varnaHint: 'Kshatriya' },
  { name: 'Hasta', lord: 'Moon', deity: 'Savitar', symbol: 'Open hand', gana: 'Deva', yoni: 'Buffalo', nadi: 'Adi', quality: 'Skilful, witty, quick-handed', varnaHint: 'Vaishya' },
  { name: 'Chitra', lord: 'Mars', deity: 'Vishvakarma', symbol: 'Bright jewel', gana: 'Rakshasa', yoni: 'Tiger', nadi: 'Madhya', quality: 'Artistic, brilliant, restless', varnaHint: 'Shudra' },
  { name: 'Swati', lord: 'Rahu', deity: 'Vayu', symbol: 'Young shoot in wind', gana: 'Deva', yoni: 'Buffalo', nadi: 'Antya', quality: 'Independent, flexible, business-minded', varnaHint: 'Kshatriya' },
  { name: 'Vishakha', lord: 'Jupiter', deity: 'Indragni', symbol: 'Triumphal arch', gana: 'Rakshasa', yoni: 'Tiger', nadi: 'Antya', quality: 'Determined, goal-fixed, ambitious', varnaHint: 'Brahmin' },
  { name: 'Anuradha', lord: 'Saturn', deity: 'Mitra', symbol: 'Lotus', gana: 'Deva', yoni: 'Deer', nadi: 'Madhya', quality: 'Devoted, friendly, enduring', varnaHint: 'Vaishya' },
  { name: 'Jyeshtha', lord: 'Mercury', deity: 'Indra', symbol: 'Circular amulet', gana: 'Rakshasa', yoni: 'Deer', nadi: 'Adi', quality: 'Senior, protective, powerful', varnaHint: 'Kshatriya' },
  { name: 'Mula', lord: 'Ketu', deity: 'Nirriti', symbol: 'Bunch of roots', gana: 'Rakshasa', yoni: 'Dog', nadi: 'Adi', quality: 'Root-seeking, investigative, intense', varnaHint: 'Brahmin' },
  { name: 'Purva Ashadha', lord: 'Venus', deity: 'Apas', symbol: 'Fan / winnowing basket', gana: 'Manushya', yoni: 'Monkey', nadi: 'Madhya', quality: 'Invincible, persuasive, purifying', varnaHint: 'Shudra' },
  { name: 'Uttara Ashadha', lord: 'Sun', deity: 'Vishvadevas', symbol: 'Elephant tusk', gana: 'Manushya', yoni: 'Mongoose', nadi: 'Antya', quality: 'Victor, ethical, lasting', varnaHint: 'Kshatriya' },
  { name: 'Shravana', lord: 'Moon', deity: 'Vishnu', symbol: 'Ear / three footprints', gana: 'Deva', yoni: 'Monkey', nadi: 'Antya', quality: 'Listening, learning, connective', varnaHint: 'Brahmin' },
  { name: 'Dhanishta', lord: 'Mars', deity: 'Vasus', symbol: 'Drum', gana: 'Rakshasa', yoni: 'Lion', nadi: 'Madhya', quality: 'Wealthy, musical, ambitious', varnaHint: 'Vaishya' },
  { name: 'Shatabhisha', lord: 'Rahu', deity: 'Varuna', symbol: 'Empty circle', gana: 'Rakshasa', yoni: 'Horse', nadi: 'Adi', quality: 'Healing, mysterious, solitary', varnaHint: 'Shudra' },
  { name: 'Purva Bhadrapada', lord: 'Jupiter', deity: 'Aja Ekapada', symbol: 'Sword / two front legs', gana: 'Manushya', yoni: 'Lion', nadi: 'Adi', quality: 'Passionate, transformative, idealistic', varnaHint: 'Brahmin' },
  { name: 'Uttara Bhadrapada', lord: 'Saturn', deity: 'Ahirbudhnya', symbol: 'Twins / back legs of bed', gana: 'Manushya', yoni: 'Cow', nadi: 'Madhya', quality: 'Deep, patient, prosperous', varnaHint: 'Kshatriya' },
  { name: 'Revati', lord: 'Mercury', deity: 'Pushan', symbol: 'Fish / drum', gana: 'Deva', yoni: 'Elephant', nadi: 'Antya', quality: 'Protective, nurturing, wealthy', varnaHint: 'Brahmin' }
];

export const NAKSHATRA_SPAN = 360 / 27; // 13°20'

export const HOUSES = [
  { number: 1, name: 'Tanu Bhava', meaning: 'Self, body, personality, beginnings', topic: 'identity' },
  { number: 2, name: 'Dhana Bhava', meaning: 'Wealth, speech, family, food', topic: 'money' },
  { number: 3, name: 'Sahaja Bhava', meaning: 'Courage, siblings, communication, effort', topic: 'courage' },
  { number: 4, name: 'Sukha Bhava', meaning: 'Home, mother, comfort, inner peace', topic: 'home' },
  { number: 5, name: 'Putra Bhava', meaning: 'Children, creativity, intelligence, romance', topic: 'creativity' },
  { number: 6, name: 'Ripu Bhava', meaning: 'Health, debts, enemies, service, discipline', topic: 'health' },
  { number: 7, name: 'Kalatra Bhava', meaning: 'Marriage, partnership, business, public', topic: 'marriage' },
  { number: 8, name: 'Ayu Bhava', meaning: 'Longevity, transformation, occult, inheritance', topic: 'transformation' },
  { number: 9, name: 'Dharma Bhava', meaning: 'Fortune, dharma, guru, father, travel', topic: 'fortune' },
  { number: 10, name: 'Karma Bhava', meaning: 'Career, status, action, authority', topic: 'career' },
  { number: 11, name: 'Labha Bhava', meaning: 'Gains, network, aspirations, elder siblings', topic: 'gains' },
  { number: 12, name: 'Vyaya Bhava', meaning: 'Loss, liberation, foreign lands, sleep, expenses', topic: 'liberation' }
];

export const DASHAS = [
  { lord: 'Ketu', years: 7, theme: 'Detachment, spiritual churn, endings that clear space. The mind turns inward; outer gains feel hollow unless they carry meaning.' },
  { lord: 'Venus', years: 20, theme: 'The longest and most pleasure-filled period. Relationships, art, comfort, vehicles and refinement expand — and so does the need for balance.' },
  { lord: 'Sun', years: 6, theme: 'Authority, visibility and the father principle. Recognition rises; ego is tested; health of the heart and eyes needs care.' },
  { lord: 'Moon', years: 10, theme: 'The mind rules. Emotional tides, mother, home, public connect and imagination dominate. Great for anything requiring feeling and memory.' },
  { lord: 'Mars', years: 7, theme: 'Courage, competition and property. Energy is high; so is friction. Excellent for land, engineering, defence and decisive action.' },
  { lord: 'Rahu', years: 18, theme: 'Ambition without a map. Foreign lands, technology, sudden elevation and illusion all arrive together. Stay ethical and grounded.' },
  { lord: 'Jupiter', years: 16, theme: 'Wisdom, dharma, children and expansion. Teachers appear, fortune opens, and ethical living pays visible dividends.' },
  { lord: 'Saturn', years: 19, theme: 'The great teacher. Labour becomes structure; delays mature into authority. Health, patience and integrity are the curriculum.' },
  { lord: 'Mercury', years: 17, theme: 'Intellect, commerce and communication. Trade, writing, analysis, study and negotiation flourish — provided focus is protected.' }
];

export const DASHA_YEARS = Object.fromEntries(DASHAS.map((d) => [d.lord, d.years]));
export const DASHA_ORDER = DASHAS.map((d) => d.lord);

export const AVASTHA = ['Bala', 'Kumara', 'Yuva', 'Vriddha', 'Mrita'];

export const YOGA_LIBRARY = {
  'Gaja Kesari Yoga': 'Jupiter in a kendra from the Moon — wisdom, reputation and lasting good fortune.',
  'Budha-Aditya Yoga': 'Sun and Mercury together — sharp intellect, eloquence and administrative skill.',
  'Chandra-Mangal Yoga': 'Moon and Mars together — earning capacity, enterprise and emotional intensity.',
  'Ruchaka Yoga': 'Mars strong in a kendra — courage, command and physical vitality.',
  'Bhadra Yoga': 'Mercury strong in a kendra — intellect, learning and communication mastery.',
  'Hamsa Yoga': 'Jupiter strong in a kendra — dharma, teaching and respected prosperity.',
  'Malavya Yoga': 'Venus strong in a kendra — beauty, comfort, artistic success.',
  'Shasha Yoga': 'Saturn strong in a kendra — discipline, endurance, political or administrative rise.',
  'Dhana Yoga': 'Wealth-forming links between the 2nd, 5th, 9th and 11th lords.',
  'Raja Yoga': 'A kendra lord conjunct or aspected by a trikona lord — authority and rise in status.',
  'Kemadruma Dosha': 'No planet in the 2nd or 12th from the Moon — emotional isolation that must be worked with consciously.',
  'Mangal Dosha': 'Mars in the 1st, 2nd, 4th, 7th, 8th or 12th — intensity in marriage that asks for maturity.'
};

export const GEM_GUIDANCE = {
  caution: 'Gemstones are traditional remedies, not medical treatments. Never wear a stone for a planet that is already strong or hostile without a Jyotishi\'s confirmation.',
  note: 'For all remedies: pair them with discipline, service and honest effort. Upay supports karma; it does not replace it.'
};
