# ✦ Cosmic Oracle

A full-stack Tarot, Numerology and Vedic Kundli reading platform. React + Vite on the front, Express + SQLite on the back,
with a deterministic reading engine that actually computes charts, dashas, gun-milan, Lo Shu grids, Driver–Conductor
combinations and card spreads — then writes the reading in a fixed, honest structure.

> Readings: drawn cards / planetary positions → energy analysis → past · present · future → practical advice →
> Do's & Don'ts → closing message → disclaimer.

---

## Quick start

```bash
npm install
npm run dev          # API on :4000, web on :5173 (proxied)
```

Open http://localhost:5173.

Production build:

```bash
npm run build        # builds client/dist
npm start            # Express serves the built app + API on :4000
```

Other scripts:

```bash
npm run smoke        # generate all 96 reading types, assert required sections
npm run db:reset     # wipe and re-create the SQLite database
```

---

## What is inside

```
server/
  index.js                 Express app + REST API
  db.js                    SQLite schema & helpers (better-sqlite3)
  config.js                UPI / payment / limit configuration
  data/
    catalog.js             96 reading types, categories, prices, requirements
    spreads.js             positional definitions for every tarot spread
    tarot.js               78-card deck with upright/reversed meanings
    numerology.js          Driver–Conductor, Lo Shu, personal year, remedies, name table
    driver-conductor.json  all 81 traditional Driver–Conductor combinations
    astro.js               rashis, nakshatras, planets, houses, Vimshottari, gems
    cities.js              120+ birth-place coordinates with UTC offsets
    interpretations.js     sign/planet/topic narrative building blocks
  engine/
    astro.js               Keplerian ephemeris, Lahiri ayanamsa, lagna, dasha, Ashtakoot
    numerology.js          Driver, Conductor, Kua, Lo Shu, personal year/month/day, names
    kundli.js              chart reading per type (janam, dasha, transit, topics, matching)
    tarot.js               seeded shuffle, spread mapping, energy/timeline composition
    reading.js             orchestrator for tarot / kundli / numerology / combo readings
  scripts/                 smoke test + database reset

client/
  src/App.jsx              app context (catalogue, cities, session) + routes
  src/pages/               Home, Catalog, ReadingFlow, ReadingPage, NumerologyLab, Journal, Pricing, About
  src/components/          Layout, PaymentModal, LoShuGrid, ReadingSections (renders every section kind)
  src/styles/theme.css     design system (deep forest greens, mint CTA, serif display)
  public/payment/upi-qr.jpeg  the owner's UPI QR
```

---

## Calculation methodology (implemented exactly, and shown in the UI)

**Driver (Mulank)** — birth day reduced to one digit.

**Conductor (Bhagyank)** — all digits of the full date reduced to one digit.

**Kua**
- Reduce the birth year to a single digit.
- Female: `+4` (last-two-digit method: `+5`, or `+6` from 2000 onward)
- Male: `11 − digit` (last-two-digit method: `10 − digit`, or `9 − digit` from 2000 onward)
- Reduce again to a single digit. Both routes are displayed for verification.

Examples from the source syllabus, asserted in the engine: 2007 male → **2**, 2008 female → **5**, 1992 female → **7**,
1992 male → **8**, 1978 female → **2**.

**Lo Shu grid** — non-zero birth-date digits placed in `4 9 2 / 3 5 7 / 8 1 6`. Conductor and Kua are added as extra
placements; the Driver is only added when the birth day is not already a single digit (so 05 / 10 / 20 / 30 are never
double-counted). Missing numbers, repeats, the eight planes and the traditional remedies are then read.

**Personal year** — birth day + birth month + target-year digits, reduced. The cycle starts on **5 February**, so
1 Jan – 4 Feb still belongs to the previous personal year. Personal month and day build on that base.

**Kundli** — JPL approximate Keplerian elements (1800–2050) for Mercury–Saturn, a Meeus lunar series for the Moon,
mean node for Rahu/Ketu, Lahiri ayanamsa, sidereal ascendant from GMST + latitude/longitude, whole-sign houses,
Vimshottari dasha (maha/antar/pratyantar) from the Moon's nakshatra, Ashtakoot (36 gunas) from both Moons, Mangal Dosha,
Sade Sati, Arudha Lagna, Atmakaraka and a yoga scan.

Accuracy is typically within ~0.5°: fine for signs, nakshatras, dashas and compatibility — **not** for muhurta or
cusp-critical work. The About page says this plainly.

---

## Readings & prices

| Tier | Range | Examples |
|---|---|---|
| Free | ₹0 | Daily card, Micro reading, Janam Kundli, Current Dasha, Lo Shu numeroscope |
| Micro | ₹49 | Yes/No, Micro energy |
| Focus | ₹99–149 | Past-Present-Future, Decision, Finance, Education |
| Deep | ₹179–299 | Career, Love, Deep Reading, Dasha prediction, Milan add-ons |
| Premium | ₹349–499 | Kundli Milan (₹399), Tarot + Numerology (₹349), Kundli + Tarot (₹449), Full Life Reading (₹499) |

Free readings never ask for payment. Paid readings create an order first (amount locked at order time), and one payment
unlocks exactly one reading.

---

## Payments

UPI only. The checkout shows the owner's QR (`client/public/payment/upi-qr.jpeg`), the UPI ID and a deep link with the
amount pre-filled, then asks for the UTR / reference number.

```bash
PAYMENT_MODE=demo     # default — any 8+ character reference unlocks immediately (testable end-to-end)
PAYMENT_MODE=manual   # order stays pending until approved by an admin
```

Admin endpoints (key defaults to `cosmic-oracle-admin`, override with `ADMIN_KEY`):

```bash
curl "http://localhost:4000/api/admin/stats?key=cosmic-oracle-admin"
curl -X POST "http://localhost:4000/api/admin/orders/<orderId>/approve?key=cosmic-oracle-admin"
```

To use your own UPI details:

```bash
UPI_PAYEE="Your Name" UPI_ID="you@bank" UPI_BANK="Your Bank" npm run dev
```

Replace `client/public/payment/upi-qr.jpeg` with your own QR image.

---

## API

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/health` | health + payment mode |
| GET | `/api/catalog` | sections, 96 reading types, price tiers, payment config |
| GET | `/api/cities` | birth-place coordinates and time zones |
| GET | `/api/me` | session visitor, reading count, spend |
| POST | `/api/me/name` | save a display name |
| POST | `/api/numerology` | full numeroscope (Driver, Conductor, Kua, Lo Shu, personal year, name) |
| POST | `/api/orders` | create a pending order + UPI link |
| GET | `/api/orders/:id` | order status |
| POST | `/api/orders/:id/verify` | submit UTR / verify |
| POST | `/api/readings` | generate & store a reading (free) or unlock with a paid order |
| GET | `/api/readings` | this session's journal |
| GET | `/api/readings/:id` | a single reading (shareable) |
| DELETE | `/api/readings/:id` | remove from journal |
| GET | `/api/admin/stats` | visitor/revenue/type stats |

Sessions are anonymous: an HttpOnly `co_visitor` cookie ties readings and orders to this browser. No accounts, no
passwords, no card data.

---

## Guardrails built into the product

- Every reading ends with an explicit disclaimer: reflection and guidance, not medical, legal, financial or fatalistic advice.
- Readings never claim to know a real third person's private thoughts; third-party spreads are framed as symbolic.
- Health, legal and financial topics carry explicit "see a professional" language.
- Calculations are shown alongside interpretations, including their accuracy limits.
- No fear-based selling, no "remedy or else", no subscriptions, no auto-renewals.

---

## Tech

React 19 · Vite 8 · React Router 7 · Express 4 · better-sqlite3 (SQLite, WAL) · hand-written CSS design system.
No external API keys, no external font/CDN calls — the app runs fully self-contained.
