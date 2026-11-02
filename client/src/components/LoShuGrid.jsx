const LAYOUT = [[4, 9, 2], [3, 5, 7], [8, 1, 6]];
const LABELS = {
  1: 'Voice', 2: 'Feeling', 3: 'Vision', 4: 'Structure', 5: 'Centre',
  6: 'Bonding', 7: 'Depth', 8: 'Wealth', 9: 'Power'
};

const reduce = (v) => {
  let n = String(v).replace(/\D/g, '').split('').reduce((a, b) => a + Number(b), 0);
  while (n > 9) n = String(n).split('').reduce((a, b) => a + Number(b), 0);
  return n;
};

export function computeCounts(dob, driver, conductor, kua) {
  const digits = String(dob || '').replace(/\D/g, '').split('').map(Number);
  const counts = Object.fromEntries(Array.from({ length: 9 }, (_, i) => [i + 1, 0]));
  digits.filter((d) => d !== 0).forEach((d) => { counts[d] += 1; });
  if (conductor) counts[conductor] += 1;
  if (kua) counts[kua] += 1;
  const day = Number(String(dob || '').slice(8, 10));
  if (driver && day >= 10 && ![10, 20, 30].includes(day)) counts[driver] += 1;
  return counts;
}

/**
 * Renders a Lo Shu grid either from server-provided cells (payload grid)
 * or computed locally from a date of birth.
 */
export default function LoShuGrid({ dob, driver, conductor, kua, grid, compact = false, showLabels = true }) {
  let cells;
  if (grid) {
    // server payload: 3x3 array of {number, count, label, keyword}
    cells = grid.flat().map((c) => ({ number: c.number, count: c.count, label: c.keyword || c.label }));
  } else {
    const counts = computeCounts(dob, driver, conductor, kua);
    cells = Array.from({ length: 9 }, (_, i) => ({
      number: i + 1, count: counts[i + 1], label: LABELS[i + 1]
    }));
  }
  const byNumber = Object.fromEntries(cells.map((c) => [c.number, c]));

  return (
    <div className="loshu" style={compact ? { maxWidth: 240, gap: '0.4rem' } : undefined}>
      {LAYOUT.flat().map((num) => {
        const cell = byNumber[num] || { number: num, count: 0 };
        const strong = cell.count > 0;
        return (
          <div
            key={num}
            className={`loshu-cell ${strong ? 'strong' : 'empty'}`}
            title={`${num} · ${cell.label || LABELS[num]} — appears ${cell.count} time${cell.count === 1 ? '' : 's'}`}
          >
            <span className="num" style={compact ? { fontSize: '1.1rem' } : undefined}>{num}</span>
            {cell.count > 1 && <span className="repeat">×{cell.count}</span>}
            {!compact && showLabels && <span className="lbl">{cell.label || LABELS[num]}</span>}
          </div>
        );
      })}
    </div>
  );
}
