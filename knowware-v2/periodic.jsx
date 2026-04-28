// Periodic Table of 81 — the centerpiece

const LAYOUTS = {
  'sq9':   { cols: 9,  rows: 9,  label: '9 × 9',           mode: 'grid' },
  'pt3':   { cols: 3,  rows: 27, label: '3 tiers · table',  mode: 'periodic' },
  'ch9':   { cols: 9,  rows: 9,  label: '9 chapters · table', mode: 'chapter' },
  'w27':   { cols: 27, rows: 3,  label: '27 × 3',          mode: 'grid' },
};

// For 'periodic' mode we lay groups as columns (group → col), with rows
// filled top-down. 11 cols × up to 8 rows. Gaps remain empty.
function periodicCoords() {
  const coords = [];
  window.GROUPS.forEach((g, gi) => {
    const members = window.INTERVIEWS.filter(x => x.groupId === g.id);
    members.forEach((m, i) => {
      coords.push({ n: m.n, col: gi, row: i });
    });
  });
  return coords;
}

function PeriodicTable({ layoutKey, onHover, onSelect, selected, hover, highlightGroup, compact }) {
  const mob = React.useContext(window.BreakpointContext) === 'mobile';
  const L = LAYOUTS[layoutKey];

  // Build cell list
  let cells;
  if (L.mode === 'periodic') {
    const coords = periodicCoords();
    cells = coords.map(c => ({ ...c, v: window.INTERVIEWS[c.n - 1] }));
  } else if (L.mode === 'chapter') {
    cells = [];
    window.CHAPTERS.filter(c => c.n !== 'X').forEach((ch, gi) => {
      const members = window.INTERVIEWS.filter(x => x.ch === ch.n);
      members.forEach((m, i) => {
        cells.push({ v: m, n: m.n, col: gi, row: i });
      });
    });
  } else {
    cells = window.INTERVIEWS.map((v, i) => ({
      v, n: v.n,
      col: i % L.cols,
      row: Math.floor(i / L.cols),
    }));
  }

  const gap     = mob ? 2 : compact ? 2 : 3;
  const pad     = mob ? '4px 3px 5px' : compact ? 4 : 6;

  // Mobile: cells fill viewport naturally; desktop: enforce min widths
  const minCellW = mob ? 0 : L.cols >= 20 ? 36 : L.cols >= 9 ? 68 : 100;
  const cellH    = mob ? 52 : L.cols >= 20 ? 72 : L.cols >= 9 ? 80 : 90;
  const minW     = mob ? 0  : L.cols * minCellW + (L.cols - 1) * gap;

  const colTemplate = mob
    ? `repeat(${L.cols}, 1fr)`
    : `repeat(${L.cols}, minmax(${minCellW}px, 1fr))`;

  return (
    <div style={{ overflowX: mob ? 'hidden' : 'auto', overflowY: 'visible', width: '100%' }}>
    <div style={{
      display: 'grid',
      gridTemplateColumns: colTemplate,
      gridTemplateRows: `repeat(${L.rows}, ${cellH}px)`,
      gap,
      minWidth: minW,
    }}>
      {cells.map(({ v, col, row }) => {
        const isHover = hover === v.n;
        const isSel = selected === v.n;
        const isDim = highlightGroup != null && v.groupId !== highlightGroup;
        return (
          <button
            key={v.n}
            onMouseEnter={() => onHover && onHover(v.n)}
            onMouseLeave={() => onHover && onHover(null)}
            onClick={() => onSelect && onSelect(v.n)}
            style={{
              gridColumn: col + 1, gridRow: row + 1,
              background: `var(${v.group.varCSS})`,
              color: `var(${v.group.ink})`,
              border: isSel ? '2px solid var(--ink)' : `1px solid var(${v.group.ink})`,
              outline: isHover && !mob ? '2px solid var(--ink)' : 'none',
              outlineOffset: isHover ? 1 : 0,
              padding: pad, cursor: 'pointer',
              display: 'flex', flexDirection: 'column',
              justifyContent: mob ? 'center' : 'space-between',
              alignItems: mob ? 'center' : 'stretch',
              textAlign: mob ? 'center' : 'left',
              opacity: isDim ? 0.2 : 1,
              transition: 'opacity .2s, outline-color .1s, transform .1s',
              position: 'relative', minWidth: 0, minHeight: 0,
              transform: isHover && !mob ? 'scale(1.04)' : 'scale(1)',
              zIndex: isHover ? 2 : 1,
              gap: mob ? 2 : 0,
            }}>
            {mob ? (
              <>
                <span className="mono" style={{
                  fontSize: 7, opacity: 0.65, letterSpacing: '0.02em',
                  lineHeight: 1,
                }}>{String(v.n).padStart(2, '0')}</span>
                <span style={{
                  fontSize: 17, fontWeight: 600,
                  letterSpacing: '-0.04em', lineHeight: 1,
                }}>{v.sym}</span>
              </>
            ) : (
              <>
                <span className="mono" style={{
                  fontSize: compact ? 8 : 9,
                  letterSpacing: '-0.01em',
                  display: 'flex', justifyContent: 'space-between',
                  opacity: 0.8,
                }}>
                  <span>{String(v.n).padStart(2, '0')}</span>
                  <span>{v.group.key}</span>
                </span>
                <span style={{
                  fontSize: compact ? 14 : L.cols >= 20 ? 16 : 22, fontWeight: 500,
                  letterSpacing: '-0.03em', lineHeight: 1,
                  alignSelf: 'center',
                }}>{v.sym}</span>
                <span className="mono" style={{
                  fontSize: compact ? 7 : 8,
                  letterSpacing: '-0.005em',
                  opacity: 0.75,
                  textAlign: 'center',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{v.minutes}m</span>
              </>
            )}
          </button>
        );
      })}
    </div>
    </div>
  );
}

function GroupLegend({ active, setActive, vertical }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: vertical ? '1fr' : 'repeat(auto-fit, minmax(140px, 1fr))',
      gap: 1, border: '1px solid var(--rule)',
    }}>
      {window.GROUPS.map((g) => {
        const count = window.INTERVIEWS.filter(x => x.groupId === g.id).length;
        const isActive = active === g.id;
        return (
          <button key={g.id}
            onMouseEnter={() => setActive && setActive(g.id)}
            onMouseLeave={() => setActive && setActive(null)}
            style={{
              background: isActive ? `var(${g.varCSS})` : 'var(--paper)',
              color: `var(${g.ink})`,
              border: 'none',
              padding: '10px 12px', cursor: 'pointer', textAlign: 'left',
              display: 'grid',
              gridTemplateColumns: 'auto 1fr auto', gap: 8, alignItems: 'center',
              fontFamily: 'inherit',
              transition: 'background .15s',
            }}>
            <span style={{
              width: 14, height: 14, background: `var(${g.varCSS})`,
              border: `1px solid var(${g.ink})`,
            }} />
            <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 13, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
                {g.name}
              </span>
              <span className="mono" style={{ fontSize: 10, color: 'var(--sub)' }}>
                {g.key}
              </span>
            </span>
            <span className="mono" style={{ fontSize: 11, color: 'var(--sub)' }}>
              {String(count).padStart(2, '0')}
            </span>
          </button>
        );
      })}
    </div>
  );
}

Object.assign(window, { LAYOUTS, PeriodicTable, GroupLegend });
