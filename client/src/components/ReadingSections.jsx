import LoShuGrid from './LoShuGrid.jsx';

const ROMAN = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI'];

const SUIT_GLYPH = { wands: '🜂', cups: '🜄', swords: '🜁', pentacles: '🜃' };

function suitKey(card) {
  if (card.arcana === 'major') return 'major';
  return card.suit || 'major';
}

function cardNumber(card) {
  if (card.arcana === 'major') return ROMAN[card.rank] || '';
  return card.rank || '';
}

function TarotCard({ card }) {
  return (
    <article className={`tarot-card suit-${suitKey(card)} ${card.reversed ? 'reversed' : ''}`}>
      {card.reversed && <span className="reversal-flag">reversed</span>}
      <div>
        <div className="tarot-pos">{card.position}</div>
        <div className="tarot-num">{cardNumber(card)}{card.suit ? ` · ${card.suit}` : ' · major arcana'}</div>
      </div>
      <div className="tarot-art" aria-hidden="true">{card.arcana === 'major' ? '✦' : SUIT_GLYPH[card.suit] || '✦'}</div>
      <div>
        <div className="tarot-name">{card.name}</div>
        <div className="tarot-orient">{card.orientation}</div>
        <div className="tarot-keys">{card.keywords}</div>
        <p className="tarot-text">{card.text}</p>
      </div>
    </article>
  );
}

function SectionHead({ title, subtitle }) {
  return (
    <div className="r-section-head">
      <h2>{title}</h2>
      <span className="line" />
      {subtitle ? <span className="small" style={{ whiteSpace: 'nowrap' }}>{subtitle}</span> : null}
    </div>
  );
}

function PlanetsTable({ rows }) {
  return (
    <div className="table-wrap">
      <table className="data">
        <thead>
          <tr><th>Planet</th><th>Sign</th><th>Degree</th><th>House</th><th>Nakshatra</th><th>Motion</th></tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.name}>
              <td><strong>{p.glyph} {p.name}</strong></td>
              <td>{p.sign}</td>
              <td>{p.degree}</td>
              <td>{p.house}</td>
              <td>{p.nakshatra}</td>
              <td>{p.retrograde ? <span className="retro">retrograde</span> : 'direct'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CompatBlock({ data }) {
  const pct = Math.round((data.total / data.max) * 100);
  return (
    <div className="card">
      <div className="score-wrap">
        <div className="score-ring" style={{ '--pct': pct }}>
          <div>
            <strong>{data.total}</strong>
            <span>out of {data.max}</span>
          </div>
        </div>
        <div>
          <div className="row" style={{ marginBottom: '0.6rem' }}>
            <span className="tag tag-mint">{data.verdict}</span>
            <span className="small">{data.a.name} ({data.a.moon} · {data.a.nakshatra}) × {data.b.name} ({data.b.moon} · {data.b.nakshatra})</span>
          </div>
          <div className="bars">
            {data.parts.map((p) => (
              <div className="bar-row" key={p.key}>
                <span title={p.about}>{p.label}</span>
                <div className="bar-track"><div className="bar-fill" style={{ width: `${(p.score / p.max) * 100}%` }} /></div>
                <span style={{ textAlign: 'right', color: 'var(--faint)' }}>{p.score}/{p.max}</span>
              </div>
            ))}
          </div>
          {data.doshas.map((d) => (
            <div className="dosha" key={d.name}><strong>{d.name}:</strong> {d.note}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ReadingSections({ sections }) {
  return sections.map((section, idx) => {
    switch (section.kind) {
      case 'cards':
        return (
          <section className="r-section" key={idx}>
            <SectionHead title={section.title} subtitle={section.subtitle} />
            <div className="cards-grid">
              {section.data.cards.map((c, i) => <TarotCard card={c} key={`${c.name}-${i}`} />)}
            </div>
          </section>
        );

      case 'planets':
        return (
          <section className="r-section" key={idx}>
            <SectionHead title={section.title} subtitle={`Lagna ${section.data.lagna?.sign} ${section.data.lagna?.degree || ''}`} />
            <PlanetsTable rows={section.data.rows} />
          </section>
        );

      case 'chart':
        return (
          <section className="r-section" key={idx}>
            <SectionHead title={section.title} subtitle={section.data.lagna ? `Ascendant ${section.data.lagna.sign}` : null} />
            {section.data.lagna && (
              <div className="fact-strip" style={{ marginTop: 0, marginBottom: '1rem' }}>
                <div className="fact"><span>Lagna</span><strong>{section.data.lagna.symbol} {section.data.lagna.sign} {section.data.lagna.degree}</strong></div>
                <div className="fact"><span>Lagna lord</span><strong>{section.data.lagna.lord || '—'}</strong></div>
                {section.data.moon && <div className="fact"><span>Moon</span><strong>{section.data.moon.sign} · {section.data.moon.nakshatra} {section.data.moon.pada}</strong></div>}
                {section.data.sun && <div className="fact"><span>Sun</span><strong>{section.data.sun.sign}</strong></div>}
                {section.data.ayanamsa && <div className="fact"><span>Ayanamsa</span><strong>{section.data.ayanamsa}°</strong></div>}
              </div>
            )}
            {section.data.planets && <PlanetsTable rows={section.data.planets} />}
            {section.data.houses && (
              <div className="table-wrap" style={{ marginTop: '1rem' }}>
                <table className="data">
                  <thead>
                    <tr><th>House</th><th>Sign</th><th>Occupants</th><th>Lord</th><th>Lord placed in</th><th>Theme</th></tr>
                  </thead>
                  <tbody>
                    {section.data.houses.map((h) => (
                      <tr key={h.number}>
                        <td><strong>{h.number}</strong> <span className="small">{h.name}</span></td>
                        <td>{h.sign}</td>
                        <td>{h.occupants?.length ? h.occupants.join(', ') : '—'}</td>
                        <td>{h.lord}</td>
                        <td>{h.lordPlacement}</td>
                        <td className="small">{h.meaning.split(',').slice(0, 2).join(',')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {section.data.planets && !section.data.houses && !section.data.lagna && (
              <div className="notice notice-info" style={{ marginTop: '0.8rem' }}>Divisional (varga) placements computed from the same birth moment.</div>
            )}
          </section>
        );

      case 'dasha':
        return (
          <section className="r-section" key={idx}>
            <SectionHead title={section.title} subtitle={`Born in ${section.data.birthNakshatra} · ${section.data.balance} years of ${section.data.startLord} at birth`} />
            <div className="fact-strip" style={{ marginTop: 0, marginBottom: '1rem' }}>
              <div className="fact"><span>Mahadasha</span><strong>{section.data.current.mahadasha.lord}</strong></div>
              <div className="fact"><span>Antardasha</span><strong>{section.data.current.antardasha.lord}</strong></div>
              <div className="fact"><span>Pratyantar</span><strong>{section.data.current.pratyantardasha.lord}</strong></div>
              <div className="fact"><span>Maha window</span><strong>{section.data.current.mahadasha.start} → {section.data.current.mahadasha.end}</strong></div>
            </div>
            <div className="stack">
              {section.data.timeline.map((m) => (
                <div className="panel" key={`${m.lord}-${m.start}`} style={m.active ? { borderColor: 'rgba(127,224,168,0.5)', background: 'rgba(45,138,92,0.18)' } : undefined}>
                  <div className="row between">
                    <strong style={{ color: 'var(--white)' }}>{m.lord} Mahadasha {m.active ? <span className="tag tag-mint" style={{ marginLeft: '0.5rem' }}>running now</span> : null}</strong>
                    <span className="small">{m.start} → {m.end} · {m.years} yrs</span>
                  </div>
                  <div className="small" style={{ marginTop: '0.35rem' }}>
                    {m.antardashas.map((a) => `${a.lord} (${a.start}–${a.end})`).join(' · ')}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'compat':
        return (
          <section className="r-section" key={idx}>
            <SectionHead title={section.title} subtitle={`${section.data.total}/${section.data.max} gunas`} />
            <CompatBlock data={section.data} />
          </section>
        );

      case 'energy':
        return (
          <section className="r-section" key={idx}>
            <SectionHead title={section.title} />
            <div className="block-grid">
              {section.data.blocks.map((b, i) => (
                <div className="card block" key={i}>
                  <h4>{b.heading}</h4>
                  <p>{b.body}</p>
                </div>
              ))}
            </div>
          </section>
        );

      case 'timeline':
        return (
          <section className="r-section" key={idx}>
            <SectionHead title={section.title} />
            <div className="timeline">
              {['past', 'present', 'future'].map((k) => {
                const t = section.data[k];
                if (!t) return null;
                return (
                  <div className="tl-card" key={k}>
                    <span className="tl-tag">{k}</span>
                    <h4>{t.card || t.title}</h4>
                    <p>{t.body}</p>
                    <span className="tl-pos">{t.card ? `${t.title} · ${t.orientation}` : t.title}</span>
                  </div>
                );
              })}
            </div>
          </section>
        );

      case 'advice':
        return (
          <section className="r-section" key={idx}>
            <SectionHead title={section.title} />
            <ol className="advice-list">
              {section.data.items.map((a, i) => <li key={i}>{a}</li>)}
            </ol>
          </section>
        );

      case 'dosdonts':
        return (
          <section className="r-section" key={idx}>
            <SectionHead title={section.title} />
            <div className="dos-donts">
              <div className="dd-card dos">
                <h4>Do</h4>
                <ul>{section.data.dos.map((d, i) => <li key={i}>{d}</li>)}</ul>
              </div>
              <div className="dd-card donts">
                <h4>Don&apos;t</h4>
                <ul>{section.data.donts.map((d, i) => <li key={i}>{d}</li>)}</ul>
              </div>
            </div>
          </section>
        );

      case 'numerology-grid':
        return (
          <section className="r-section" key={idx}>
            <SectionHead title={section.title} subtitle={`Driver ${section.data.driver} · Conductor ${section.data.conductor} · Kua ${section.data.kua}`} />
            <div className="grid-2" style={{ alignItems: 'start' }}>
              <div className="card">
                <LoShuGrid grid={section.data.grid} />
                <p className="small muted" style={{ marginTop: '0.8rem', marginBottom: 0 }}>{section.data.notes?.[0]}</p>
              </div>
              <div className="stack">
                <div className="panel">
                  <strong style={{ color: 'var(--white)' }}>Missing numbers</strong>
                  <p className="small" style={{ margin: '0.3rem 0 0' }}>
                    {section.data.missing.length ? section.data.missing.join(', ') : 'None — all nine numbers are present.'}
                  </p>
                </div>
                <div className="panel">
                  <strong style={{ color: 'var(--white)' }}>Repeated numbers</strong>
                  <ul style={{ margin: '0.4rem 0 0', paddingLeft: '1.1rem' }} className="small">
                    {section.data.repeated.length ? section.data.repeated.map((r) => (
                      <li key={r.number}><strong>{r.number} ×{r.count}</strong> — {r.label}</li>
                    )) : <li>No repeats — a balanced, lightly loaded grid.</li>}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        );

      case 'numerology':
        return (
          <section className="r-section" key={idx}>
            <SectionHead title={section.title} subtitle={section.data.combo ? `${section.data.combo.stars}/5 · ${section.data.combo.theme}` : null} />
            <div className="grid-2" style={{ alignItems: 'start' }}>
              <div className="card">
                <div className="preview-nums">
                  <div className="preview-num"><strong>{section.data.driver}</strong><span>Driver · {section.data.driverPlanet}</span></div>
                  <div className="preview-num"><strong>{section.data.conductor}</strong><span>Conductor · {section.data.conductorPlanet}</span></div>
                  <div className="preview-num"><strong>{section.data.kua}</strong><span>Kua</span></div>
                  <div className="preview-num"><strong>{section.data.personalYear}</strong><span>Personal year</span></div>
                </div>
                <p className="small" style={{ marginTop: '0.9rem' }}>
                  {section.data.personalYearTitle} · Lucky numbers {section.data.lucky?.numbers?.join(', ')} · {section.data.lucky?.colour} on {section.data.lucky?.day}.
                </p>
                {section.data.combo && (
                  <p className="small muted" style={{ marginBottom: 0 }}>
                    Driver–Conductor pairing: {section.data.combo.stars}/5 — {section.data.combo.theme}. {section.data.combo.verdict}
                  </p>
                )}
              </div>
              <div className="card card-tight">
                <LoShuGrid grid={section.data.grid} compact />
                <p className="small muted" style={{ marginTop: '0.6rem', marginBottom: 0 }}>Lo Shu grid from your date of birth.</p>
              </div>
            </div>
          </section>
        );

      case 'remedies':
        return (
          <section className="r-section" key={idx}>
            <SectionHead title={section.title} />
            <div className="card">
              {section.data.items?.length ? (
                <div className="stack">
                  {section.data.items.map((r, i) => (
                    <div className="panel" key={i}>
                      <strong style={{ color: 'var(--white)' }}>{r.yantra || r.gem || r.remedy}</strong>
                      <p className="small" style={{ margin: '0.25rem 0 0' }}>
                        {r.condition ? <><em>{r.condition}</em> · </> : null}
                        {r.note || `${r.metal ? `${r.metal} · ` : ''}${r.mantra || ''}`}
                      </p>
                    </div>
                  ))}
                </div>
              ) : <p className="muted">No specific object remedies are indicated — behavioural upay will serve you better.</p>}
              {section.data.notes?.map((n, i) => <div className="notice notice-warn" style={{ marginTop: '0.7rem' }} key={i}>{n}</div>)}
              {section.data.caution && <p className="small muted" style={{ marginTop: '0.9rem', marginBottom: 0 }}>{section.data.caution}</p>}
            </div>
          </section>
        );

      case 'transit':
        return (
          <section className="r-section" key={idx}>
            <SectionHead title={section.title} subtitle={`as of ${section.data.asOf}`} />
            <div className="table-wrap">
              <table className="data">
                <thead><tr><th>Planet</th><th>Transit sign</th><th>Degree</th><th>From Lagna</th><th>From Moon</th></tr></thead>
                <tbody>
                  {section.data.rows.map((r) => (
                    <tr key={r.planet}>
                      <td><strong>{r.planet}</strong></td>
                      <td>{r.sign}</td>
                      <td>{r.degree}</td>
                      <td>{r.house}</td>
                      <td>{r.fromMoon}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );

      case 'closing':
        return (
          <section className="r-section" key={idx}>
            <div className="closing-block">
              <div className="orb-label" style={{ marginBottom: '0.7rem' }}>{section.title}</div>
              <p>{section.data.body}</p>
            </div>
          </section>
        );

      case 'disclaimer':
        return (
          <section className="r-section disclaimer-block" key={idx}>
            <p><strong style={{ color: 'var(--faint)' }}>{section.title}.</strong> {section.data.body}</p>
          </section>
        );

      default:
        return null;
    }
  });
}

export function readingToText(reading) {
  const lines = [];
  lines.push(`COSMIC ORACLE — ${reading.title}`);
  if (reading.subtitle) lines.push(reading.subtitle);
  if (reading.subject?.name) lines.push(`Prepared for ${reading.subject.name}`);
  lines.push('='.repeat(52), '');
  if (reading.facts?.length) {
    reading.facts.forEach((f) => lines.push(`${f.label}: ${f.value}`));
    lines.push('', '-'.repeat(52), '');
  }
  (reading.sections || []).forEach((s) => {
    lines.push(`## ${s.title || ''}`, '');
    const d = s.data;
    switch (s.kind) {
      case 'cards':
        d.cards.forEach((c) => {
          lines.push(`• ${c.name} (${c.orientation}) — ${c.position}`);
          lines.push(`  ${c.text}`);
          lines.push(`  Keywords: ${c.keywords}`, '');
        });
        break;
      case 'planets':
        d.rows.forEach((p) => lines.push(`${p.name}: ${p.sign} ${p.degree} · house ${p.house} · ${p.nakshatra}${p.retrograde ? ' (R)' : ''}`));
        lines.push('');
        break;
      case 'energy':
        d.blocks.forEach((b) => lines.push(`** ${b.heading} **`, b.body, ''));
        break;
      case 'timeline':
        ['past', 'present', 'future'].forEach((k) => {
          const t = d[k];
          if (t) lines.push(`${k.toUpperCase()} — ${t.title}${t.card ? ` (${t.card}, ${t.orientation})` : ''}`, t.body, '');
        });
        break;
      case 'advice':
        d.items.forEach((a, i) => lines.push(`${i + 1}. ${a}`));
        lines.push('');
        break;
      case 'dosdonts':
        lines.push("DO'S:"); d.dos.forEach((x) => lines.push(`  ✓ ${x}`));
        lines.push("DON'TS:"); d.donts.forEach((x) => lines.push(`  ✕ ${x}`));
        lines.push('');
        break;
      case 'compat':
        lines.push(`Ashtakoot: ${d.total}/${d.max} — ${d.verdict}`);
        d.parts.forEach((p) => lines.push(`  ${p.label}: ${p.score}/${p.max}`));
        d.doshas.forEach((x) => lines.push(`  ! ${x.name}: ${x.note}`));
        lines.push('');
        break;
      case 'dasha':
        lines.push(`Current: ${d.current.mahadasha.lord} / ${d.current.antardasha.lord} / ${d.current.pratyantardasha.lord}`);
        lines.push('');
        break;
      case 'closing':
        lines.push(d.body, '');
        break;
      case 'disclaimer':
        lines.push(d.body, '');
        break;
      default:
        break;
    }
  });
  lines.push('— Read at cosmicoracle.app · for reflection only —');
  return lines.join('\n');
}
