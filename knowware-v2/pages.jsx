// Page components — Swiss direction

const { useState, useEffect, useRef } = React;

function Shell({ page, setPage, children }) {
  const nav = [
    ['cover', '01', 'Index'],
    ['table', '02', 'The 81'],
    ['read',  '03', 'Manuscript'],
    ['join',  '04', 'Contribute'],
  ];
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center',
        padding: '14px 32px', borderBottom: '1px solid var(--rule)',
        position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 10,
      }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'baseline' }}>
          <button onClick={() => setPage('cover')} style={{
            background: 'none', border: 'none', padding: 0, cursor: 'pointer',
            fontFamily: 'inherit', fontSize: 15, fontWeight: 600,
            letterSpacing: '-0.015em', color: 'var(--ink)',
          }}>Knowware<span style={{ color: 'var(--sub2)' }}>®</span></button>
          <span className="mono" style={{ fontSize: 11, color: 'var(--sub)' }}>
            systems-of-intelligence · v1.0 · mmxxvi
          </span>
        </div>
        <nav style={{ display: 'flex', gap: 0 }}>
          {nav.map(([k, n, l]) => (
            <button key={k} onClick={() => setPage(k)} style={{
              background: page === k ? 'var(--ink)' : 'transparent',
              color: page === k ? 'var(--paper)' : 'var(--ink)',
              border: 'none', padding: '7px 12px', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 13, letterSpacing: '-0.01em',
              display: 'flex', gap: 8, alignItems: 'baseline',
            }}>
              <span className="mono" style={{ fontSize: 10, opacity: 0.6 }}>{n}</span>
              <span>{l}</span>
            </button>
          ))}
        </nav>
      </header>
      <main style={{ flex: 1 }}>{children}</main>
      <Foot />
    </div>
  );
}

function Foot() {
  return (
    <footer style={{ borderTop: '1px solid var(--rule)', padding: '20px 32px',
      display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16,
      fontSize: 12, color: 'var(--sub)' }}>
      <div style={{ gridColumn: '1 / span 3' }} className="mono">Knowware / Systems of Intelligence</div>
      <div style={{ gridColumn: '4 / span 3' }} className="mono">MMXXVI · Edition 01</div>
      <div style={{ gridColumn: '7 / span 3' }} className="mono">~350 pp · 09 ch · 81 voices</div>
      <div style={{ gridColumn: '10 / span 3', textAlign: 'right' }} className="mono">iamkhayyam.github.io/knowware</div>
    </footer>
  );
}

function Grid({ children, style }) {
  return <div style={{
    display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)',
    gap: 16, padding: '0 32px', ...style,
  }}>{children}</div>;
}

function Label({ children, style }) {
  return <div className="mono" style={{
    fontSize: 11, color: 'var(--sub)', paddingTop: 6,
    letterSpacing: '-0.005em', ...style,
  }}>{children}</div>;
}

// ─── Cover (v2) ────────────────────────────────────────
// Hero is a bleed strip. Running metadata masthead up top.
// Marquee of groups. A "spine" TOC. Live clock.
function Cover({ setPage }) {
  const [hover, setHover] = React.useState(null);
  const [now, setNow] = React.useState(() => new Date());
  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const clock = now.toISOString().replace('T', ' / ').slice(0, 19) + ' UTC';

  return (
    <div>
      {/* Masthead strip — full width, runs metadata as a ledger line */}
      <div className="mono" style={{
        borderBottom: '1px solid var(--rule)',
        padding: '10px 24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: 16, fontSize: 10, color: 'var(--sub)',
        letterSpacing: '-0.005em',
      }}>
        <span>ISSUE / 01</span>
        <span>VOL / I OF II</span>
        <span>PRINT / AUTUMN 26</span>
        <span>PAGES / 512</span>
        <span>VOICES / 081</span>
        <span style={{ textAlign: 'right' }}>{clock}</span>
      </div>

      {/* Hero — left wordmark, right huge numeral "81" */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '6fr 6fr',
        alignItems: 'stretch',
        borderBottom: '1px solid var(--ink)',
        minHeight: '64vh',
      }}>
        <div style={{ padding: '48px 24px 32px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="mono" style={{ fontSize: 11, color: 'var(--sub)' }}>
            KNOWWARE / SYSTEMS OF INTELLIGENCE
          </div>
          <h1 style={{
            margin: 0,
            fontSize: 'clamp(72px, 13vw, 220px)',
            lineHeight: 0.82, letterSpacing: '-0.05em', fontWeight: 500,
          }}>
            Systems<br/>
            <span style={{ fontStyle: 'italic', fontWeight: 400 }}>of</span>&nbsp;Intelligence.
          </h1>
          <div className="mono" style={{ fontSize: 11, color: 'var(--sub)',
            display: 'flex', justifyContent: 'space-between' }}>
            <span>BY &nbsp;/&nbsp; KHAYYAM</span>
            <span>MMXXVI · ED. 01</span>
          </div>
        </div>
        <div style={{
          borderLeft: '1px solid var(--ink)',
          background: 'var(--paper)',
          padding: '24px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          position: 'relative', overflow: 'hidden',
          containerType: 'inline-size',
        }}>
          <div className="mono" style={{ fontSize: 11, color: 'var(--sub)',
            display: 'flex', justifyContent: 'space-between' }}>
            <span>FIG. 01</span><span>INTERVIEWS</span>
          </div>
          <div style={{
            fontSize: 'min(92cqw, 460px)',
            fontWeight: 500, letterSpacing: '-0.08em', lineHeight: 0.82,
            textAlign: 'center', color: 'var(--ink)',
            maxWidth: '100%', overflow: 'hidden',
          }}>
            81
          </div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--sub)',
            display: 'flex', justifyContent: 'space-between' }}>
            <span>ACROSS 3 TIERS · 9 CHAPTERS</span>
            <button onClick={() => setPage('table')} style={{
              background: 'var(--ink)', color: 'var(--paper)',
              border: 'none', padding: '6px 10px', fontFamily: 'inherit',
              fontSize: 11, cursor: 'pointer',
            }}>See all →</button>
          </div>
        </div>
      </div>

      {/* Groups marquee */}
      <div style={{
        borderBottom: '1px solid var(--rule)',
        overflow: 'hidden', whiteSpace: 'nowrap',
        padding: '10px 0', background: 'var(--paper)',
      }}>
        <div style={{
          display: 'inline-flex', gap: 40,
          animation: 'kw-marquee 40s linear infinite',
        }} className="mono">
          {Array.from({length: 2}).flatMap((_, k) =>
            window.GROUPS.map(g => (
              <span key={`${k}-${g.id}`} style={{ fontSize: 13,
                letterSpacing: '-0.005em', display: 'inline-flex',
                gap: 10, alignItems: 'center' }}>
                <span style={{ width: 10, height: 10,
                  background: `var(${g.varCSS})`,
                  border: `1px solid var(${g.ink})`,
                  display: 'inline-block' }} />
                {g.name.toUpperCase()}
                <span style={{ color: 'var(--sub2)' }}>/</span>
                <span style={{ color: 'var(--sub)' }}>{g.key}</span>
              </span>
            ))
          )}
        </div>
        <style>{`@keyframes kw-marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
      </div>

      <div style={{ padding: '0 0 56px' }}>

      {/* Abstract ribbon */}
      <Grid style={{ marginTop: 36 }}>
        <Label style={{ gridColumn: '1 / span 3' }}>Abstract</Label>
        <p style={{ gridColumn: '4 / span 6', fontSize: 24, lineHeight: 1.3,
          margin: 0, letterSpacing: '-0.018em' }}>
          A field guide for anyone who must survive what is coming — and the
          tools, markets, and institutions they'll have to think with. Built
          from <strong style={{ fontWeight: 500, color: 'var(--accent)' }}>
          eighty-one long conversations</strong> with academics, practitioners,
          and visionaries who are quietly redrawing the maps.
        </p>
        <div style={{ gridColumn: '10 / span 3', display: 'flex',
          flexDirection: 'column', gap: 6 }}>
          <Btn filled onClick={() => setPage('table')}>Open the 81 →</Btn>
          <Btn onClick={() => setPage('read')}>Read the preview →</Btn>
          <Btn onClick={() => setPage('join')}>Contribute to Vol. II →</Btn>
        </div>
      </Grid>

      {/* The Spine — compact TOC shown as a book spine */}
      <Grid style={{ marginTop: 64 }}>
        <Label style={{ gridColumn: '1 / span 3' }}>01 · The spine</Label>
        <div style={{ gridColumn: '4 / span 9' }}>
          <div style={{ display: 'flex', alignItems: 'end',
            justifyContent: 'space-between', marginBottom: 14 }}>
            <h2 style={{ fontSize: 40, fontWeight: 500,
              letterSpacing: '-0.03em', margin: 0, lineHeight: 1 }}>
              Nine chapters, one capstone.
            </h2>
            <button onClick={() => setPage('read')} className="mono" style={{
              background: 'none', border: '1px solid var(--ink)',
              padding: '6px 10px', cursor: 'pointer', fontSize: 11,
            }}>Read manuscript ↗</button>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: `repeat(${window.SECTIONS.length}, 1fr)`,
            gap: 2, alignItems: 'end', height: 260,
            background: 'var(--paper)', border: '1px solid var(--rule)',
            padding: 12,
          }}>
            {window.SECTIONS.map((s, i) => {
              const h = 45 + ((i * 37) % 55);
              return (
                <button key={s.n} onClick={() => setPage('read')}
                  style={{
                    background: 'var(--ink)', border: 'none', cursor: 'pointer',
                    height: `${h}%`, display: 'flex', flexDirection: 'column',
                    justifyContent: 'space-between', padding: 8,
                    color: 'var(--paper)', alignItems: 'flex-start',
                    fontFamily: 'inherit', transition: 'background .15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--ink)'}>
                  <span className="mono" style={{ fontSize: 10 }}>ch{s.n}</span>
                  <span style={{ fontSize: 11, writingMode: 'vertical-rl',
                    transform: 'rotate(180deg)', letterSpacing: '-0.005em',
                    whiteSpace: 'nowrap', overflow: 'hidden',
                    textOverflow: 'ellipsis', maxHeight: '100%' }}>
                    {s.title}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--sub)',
            marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
            <span>Fig. 02 — Page-count by section.</span>
            <span>Click any spine to open.</span>
          </div>
        </div>
      </Grid>

      {/* Thesis — full bleed band */}
      <div style={{
        marginTop: 64, background: 'var(--ink)', color: 'var(--paper)',
        padding: '64px 24px',
      }}>
        <div style={{ display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)', gap: 16,
          maxWidth: '100%' }}>
          <Label style={{ gridColumn: '1 / span 3',
            color: 'var(--accent-soft)' }}>02 · Thesis</Label>
          <div style={{ gridColumn: '4 / span 9', fontSize: 36,
            lineHeight: 1.15, letterSpacing: '-0.025em' }}>
            The tools we use to think are no longer{' '}
            <span style={{ color: 'var(--accent-soft)',
              borderBottom: '2px solid var(--accent-soft)' }}>separate</span>{' '}
            from the thinking itself. This book is a field guide for what
            happens when that line dissolves — in labs, in ledgers, in fields,
            in classrooms, in clinics.
          </div>
        </div>
      </div>

      {/* Structure — horizontal stat bar */}
      <Grid style={{ marginTop: 64 }}>
        <Label style={{ gridColumn: '1 / span 3' }}>03 · Structure</Label>
        <div style={{ gridColumn: '4 / span 9' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)',
            borderTop: '2px solid var(--ink)',
            borderBottom: '2px solid var(--ink)',
          }}>
            {[
              ['09', 'Chapters'],
              ['81', 'Interviews'],
              ['03', 'Tiers'],
              ['~60', 'Diagrams'],
              ['~350', 'Pages'],
              ['03', 'Years'],
            ].map(([n, l], i) => (
              <div key={l} style={{
                borderRight: i < 5 ? '1px solid var(--rule)' : 'none',
                padding: '24px 14px 18px',
                display: 'flex', flexDirection: 'column', gap: 10,
                minWidth: 0, overflow: 'hidden',
              }}>
                <span style={{ fontSize: 'clamp(40px, 4.4vw, 64px)', fontWeight: 500,
                  letterSpacing: '-0.045em', lineHeight: 0.9 }}>{n}</span>
                <span className="mono" style={{ fontSize: 10,
                  color: 'var(--sub)', textTransform: 'uppercase',
                  letterSpacing: '0.05em' }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </Grid>

      {/* Early readers — staggered pull quotes */}
      <Grid style={{ marginTop: 64 }}>
        <Label style={{ gridColumn: '1 / span 3' }}>04 · Early readers</Label>
        <div style={{ gridColumn: '4 / span 9',
          display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)',
          gap: 16, rowGap: 40 }}>
          {[
            ['A book that reads you while you read it.', 'N. Mehta', 'researcher', 1, 6],
            ['The most serious attempt to map the new terrain I have seen.', 'L. Okafor', 'economist', 7, 6],
            ['Essential, and a little frightening.', 'Y. Park', 'editor', 3, 7],
          ].map(([q, a, r, start, span], i) => (
            <blockquote key={a} style={{
              gridColumn: `${start} / span ${span}`,
              margin: 0,
              borderTop: '1px solid var(--ink)', paddingTop: 14,
            }}>
              <p style={{ fontSize: 22, lineHeight: 1.3, margin: 0,
                letterSpacing: '-0.018em' }}>
                "{q}"
              </p>
              <div className="mono" style={{ fontSize: 11, color: 'var(--sub)',
                marginTop: 12 }}>— {a} · {r}</div>
            </blockquote>
          ))}
        </div>
      </Grid>

      {/* CTA strip */}
      <div style={{ marginTop: 64, padding: '0 24px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr auto',
          alignItems: 'center', gap: 24,
          border: '1px solid var(--ink)',
          padding: '28px 32px', background: 'var(--accent-soft)',
        }}>
          <div style={{ fontSize: 28, letterSpacing: '-0.02em',
            lineHeight: 1.15, fontWeight: 500 }}>
            Pre-order before Autumn and your name enters the colophon.
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn filled>Pre-order · $34</Btn>
            <Btn>Join the list</Btn>
          </div>
        </div>
      </div>

      </div>
    </div>
  );
}

// ─── The Table page ────────────────────────────────────
function TablePage({ setPage }) {
  const [layout, setLayout] = React.useState('ch9');
  const [hover, setHover] = React.useState(null);
  const [selected, setSelected] = React.useState(null);
  const [highlightGroup, setHighlightGroup] = React.useState(null);

  const showN = hover || selected;
  const shown = showN ? window.INTERVIEWS[showN - 1] : null;

  return (
    <div style={{ padding: '28px 24px 48px' }}>
      {/* Header: label + layout toggles */}
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'baseline', marginBottom: 8 }}>
        <Label style={{ paddingTop: 0 }}>02 · The 81</Label>
        <div style={{ display: 'flex', gap: 4 }}>
          {Object.entries(window.LAYOUTS).map(([k, L]) => (
            <button key={k} onClick={() => setLayout(k)} className="mono" style={{
              background: layout === k ? 'var(--ink)' : 'var(--paper)',
              color: layout === k ? 'var(--paper)' : 'var(--ink)',
              border: '1px solid var(--ink)', padding: '6px 10px',
              cursor: 'pointer', fontSize: 11, letterSpacing: '-0.005em',
            }}>{L.label}</button>
          ))}
        </div>
      </div>

      {/* Detail strip (hover/selected preview) — sits above title */}
      <div style={{
        borderTop: '1px solid var(--rule)',
        borderBottom: '1px solid var(--rule)',
        minHeight: 96, display: 'flex', alignItems: 'stretch',
        background: shown ? `var(${shown.group.varCSS})` : 'var(--paper)',
        transition: 'background .15s',
      }}>
        {shown ? <VoiceStrip v={shown} /> : <EmptyStrip />}
      </div>

      {/* Title */}
      <h2 style={{
        fontSize: 'clamp(48px, 8vw, 112px)', fontWeight: 500,
        letterSpacing: '-0.04em', lineHeight: 0.92, margin: '24px 0 20px',
      }}>
        Eighty-one voices,<br/>three tiers, nine chapters.
      </h2>

      {/* Horizontal legend row — full width, sits above table */}
      <HorizontalLegend active={highlightGroup} setActive={setHighlightGroup} />

      {/* Full-width table */}
      <div style={{
        background: 'var(--paper)', border: '1px solid var(--rule)',
        borderTop: 'none', padding: 16, marginTop: 0,
      }}>
        <PeriodicTable
          layoutKey={layout}
          hover={hover} onHover={setHover}
          selected={selected} onSelect={(n) => setSelected(selected === n ? null : n)}
          highlightGroup={highlightGroup}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between',
        marginTop: 10 }} className="mono">
        <span style={{ fontSize: 11, color: 'var(--sub)' }}>
          Fig. 04 — {window.LAYOUTS[layout].label}. Hover a cell for detail. Hover a tier to isolate. Click a cell to pin.
        </span>
        <span style={{ fontSize: 11, color: 'var(--sub)' }}>
          {selected ? `pinned № ${String(selected).padStart(2, '0')}` : '—'}
        </span>
      </div>
    </div>
  );
}

function EmptyStrip() {
  return (
    <div style={{ display: 'grid',
      gridTemplateColumns: '200px 1fr auto', gap: 20, alignItems: 'center',
      width: '100%', padding: '16px 20px' }}>
      <div className="mono" style={{ fontSize: 10, color: 'var(--sub2)',
        letterSpacing: '-0.005em' }}>HOVER TO PREVIEW</div>
      <div style={{ fontSize: 14, color: 'var(--sub)', lineHeight: 1.4 }}>
        Each cell is one of the eighty-one interviews. Colour marks the
        tier — blue for academics, terracotta for practitioners, sage for
        visionaries. Columns are the nine chapters.
      </div>
      <div className="mono" style={{ fontSize: 10, color: 'var(--sub2)' }}>
        81 · 09 · 03
      </div>
    </div>
  );
}

function VoiceStrip({ v }) {
  const ch = window.CHAPTERS.find(c => c.n === v.ch);
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '96px 220px 1fr auto',
      gap: 20, alignItems: 'center', width: '100%',
      padding: '14px 20px',
      color: `var(${v.group.ink})`,
    }}>
      <div style={{ fontSize: 68, fontWeight: 500, letterSpacing: '-0.05em',
        lineHeight: 0.9, color: 'var(--ink)' }}>{v.sym}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div className="mono" style={{ fontSize: 10, opacity: 0.85 }}>
          № {String(v.n).padStart(2, '0')} · Tier {v.tier} · {v.minutes}m
        </div>
        <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: '-0.015em',
          color: 'var(--ink)', lineHeight: 1.15 }}>{v.name}</div>
        <div className="mono" style={{ fontSize: 11, opacity: 0.8, lineHeight: 1.3 }}>
          {v.affiliation}
        </div>
      </div>
      <div style={{ fontSize: 15, lineHeight: 1.45, color: 'var(--ink)',
        letterSpacing: '-0.01em', maxWidth: '72ch' }}>
        <span style={{ fontStyle: 'italic' }}>“{v.themes[0]}”</span> as inherited relationship — not a resource but a responsibility.
        <span className="mono" style={{
          fontSize: 10, opacity: 0.7, marginLeft: 8 }}>
          — {v.group.name}
        </span>
      </div>
      <div className="mono" style={{ fontSize: 10, opacity: 0.8,
        textAlign: 'right', lineHeight: 1.5 }}>
        ch{v.ch}<br/>
        {ch ? ch.title.split(' ').slice(0, 3).join(' ') : ''}
      </div>
    </div>
  );
}

function HorizontalLegend({ active, setActive }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${window.GROUPS.length}, 1fr)`,
      border: '1px solid var(--rule)',
      background: 'var(--paper)',
    }}>
      {window.GROUPS.map((g, i) => {
        const count = window.INTERVIEWS.filter(x => x.groupId === g.id).length;
        const isActive = active === g.id;
        return (
          <button key={g.id}
            onMouseEnter={() => setActive(g.id)}
            onMouseLeave={() => setActive(null)}
            style={{
              background: isActive ? `var(${g.varCSS})` : 'var(--paper)',
              borderRight: i < window.GROUPS.length - 1 ? '1px solid var(--rule)' : 'none',
              borderTop: `4px solid var(${g.varCSS})`,
              borderBottom: 'none', borderLeft: 'none',
              padding: '14px 18px 12px', cursor: 'pointer', textAlign: 'left',
              fontFamily: 'inherit', display: 'flex', flexDirection: 'column',
              gap: 6, transition: 'background .15s', minWidth: 0,
            }}>
            <div className="mono" style={{ fontSize: 11,
              color: `var(${g.ink})`, letterSpacing: '-0.005em',
              display: 'flex', justifyContent: 'space-between' }}>
              <span>Tier {g.key}</span>
              <span style={{ color: 'var(--sub)' }}>{String(count).padStart(2, '0')} voices</span>
            </div>
            <div style={{ fontSize: 18, letterSpacing: '-0.015em',
              color: 'var(--ink)', fontWeight: 500 }}>
              {g.name}
            </div>
            <div style={{ fontSize: 12, color: 'var(--sub)', lineHeight: 1.4 }}>
              {g.blurb}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function VoiceCard({ v }) {
  return (
    <div style={{ background: `var(${v.group.varCSS})`,
      border: `1px solid var(${v.group.ink})`, padding: 18,
      color: `var(${v.group.ink})`, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="mono" style={{ fontSize: 10, display: 'flex',
        justifyContent: 'space-between', opacity: 0.8 }}>
        <span>№ {String(v.n).padStart(2, '0')}</span>
        <span>{v.group.key} · {v.year}</span>
      </div>
      <div style={{ fontSize: 64, fontWeight: 500, letterSpacing: '-0.05em',
        lineHeight: 0.9, color: 'var(--ink)' }}>{v.sym}</div>
      <div style={{ fontSize: 13, lineHeight: 1.45, color: 'var(--ink)' }}>
        A {v.group.name.toLowerCase().replace(/s$/, '')} based in <strong style={{ fontWeight: 500 }}>{v.city}</strong>.
        Spoke with us for {v.minutes} minutes on {v.themes.join(', ')}.
      </div>
      <div style={{ borderTop: `1px solid var(${v.group.ink})`, paddingTop: 10,
        fontSize: 12, lineHeight: 1.5, color: `var(${v.group.ink})` }}>
        "{v.themes[0]} is not a resource. It is a relationship you inherit —
        and then are responsible for."
      </div>
    </div>
  );
}

// ─── Read (v2) ─────────────────────────────────────────
// Two-column with live section rail, running page number, inline footnotes,
// marginal citations pulling from the 81.
function Read() {
  const [active, setActive] = React.useState(1);
  const [openNote, setOpenNote] = React.useState(null);
  const s = window.SECTIONS[active];
  const pageBase = 18 + active * 28;
  // Pick voices actually from this chapter for the margin
  const chapterVoices = window.INTERVIEWS.filter(v => v.ch === s.n);
  const cited = (chapterVoices.length > 0 ? chapterVoices : window.INTERVIEWS).slice(0, 4);

  return (
    <div>
      {/* Reading chrome — page position + running head */}
      <div style={{
        borderBottom: '1px solid var(--rule)',
        padding: '10px 24px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        alignItems: 'center',
      }}>
        <div className="mono" style={{ fontSize: 11, color: 'var(--sub)' }}>
          ch{s.n} · {s.title.toUpperCase()}
        </div>
        <div className="mono" style={{ fontSize: 11, color: 'var(--sub)',
          textAlign: 'center' }}>
          {s.part.toUpperCase()}
        </div>
        <div className="mono" style={{ fontSize: 11, color: 'var(--sub)',
          textAlign: 'right' }}>
          pp. {pageBase}–{pageBase + 27}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr 280px',
        minHeight: 'calc(100vh - 240px)',
        borderBottom: '1px solid var(--rule)',
      }}>
        {/* LEFT RAIL — TOC */}
        <aside style={{
          borderRight: '1px solid var(--rule)',
          padding: '24px 20px', position: 'sticky', top: 48,
          height: 'fit-content',
        }}>
          <Label style={{ paddingTop: 0, marginBottom: 10 }}>03 · Manuscript</Label>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {window.SECTIONS.map((row, i) => {
              const isActive = active === i;
              return (
                <li key={row.n}>
                  <button onClick={() => setActive(i)} style={{
                    width: '100%', textAlign: 'left',
                    background: isActive ? 'var(--ink)' : 'transparent',
                    color: isActive ? 'var(--paper)' : 'var(--ink)',
                    border: 'none', borderBottom: '1px solid var(--rule)',
                    cursor: 'pointer', padding: '9px 8px',
                    display: 'grid', gridTemplateColumns: '28px 1fr auto', gap: 6,
                    fontFamily: 'inherit', fontSize: 13, letterSpacing: '-0.005em',
                    alignItems: 'baseline',
                  }}>
                    <span className="mono" style={{ fontSize: 10,
                      color: isActive ? 'var(--accent-soft)' : 'var(--sub)' }}>
                      ch{row.n}
                    </span>
                    <span>{row.title}</span>
                    <span className="mono" style={{ fontSize: 9,
                      color: isActive ? 'var(--accent-soft)' : 'var(--sub2)' }}>
                      {18 + i * 28}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </aside>

        {/* CENTER — reading column */}
        <article data-kw-read style={{ padding: '40px 48px', maxWidth: 'var(--read-col, 760px)' }}>
          <div className="mono" style={{ fontSize: 11, color: 'var(--sub)',
            marginBottom: 8 }}>{s.part} · ch{s.n}</div>
          <h2 style={{ fontSize: 60, fontWeight: 500, letterSpacing: '-0.04em',
            lineHeight: 0.95, margin: '0 0 10px' }}>{s.title}</h2>
          <div style={{ fontSize: 20, color: 'var(--sub)',
            letterSpacing: '-0.015em', marginBottom: 24 }}>{s.sub}</div>

          <div style={{ borderTop: '1px solid var(--ink)', paddingTop: 24 }}>
            <ChapterTeaser chapter={s.n} cited={cited[0]}
              openNote={openNote} setOpenNote={setOpenNote} />
          </div>

          {/* Paginator */}
          <div style={{ marginTop: 48, display: 'flex',
            justifyContent: 'space-between', borderTop: '1px solid var(--rule)',
            paddingTop: 16 }}>
            <button onClick={() => setActive(Math.max(0, active - 1))}
              disabled={active === 0}
              className="mono" style={{
              border: '1px solid var(--ink)', background: 'var(--paper)',
              padding: '8px 12px', fontSize: 11,
              cursor: active === 0 ? 'default' : 'pointer',
              opacity: active === 0 ? 0.3 : 1,
            }}>← §{window.SECTIONS[Math.max(0, active - 1)].n} {window.SECTIONS[Math.max(0, active - 1)].title}</button>
            <button onClick={() => setActive(Math.min(window.SECTIONS.length - 1, active + 1))}
              disabled={active === window.SECTIONS.length - 1}
              className="mono" style={{
              border: '1px solid var(--ink)', background: 'var(--ink)',
              color: 'var(--paper)', padding: '8px 12px', fontSize: 11,
              cursor: active === window.SECTIONS.length - 1 ? 'default' : 'pointer',
              opacity: active === window.SECTIONS.length - 1 ? 0.3 : 1,
            }}>§{window.SECTIONS[Math.min(window.SECTIONS.length - 1, active + 1)].n} {window.SECTIONS[Math.min(window.SECTIONS.length - 1, active + 1)].title} →</button>
          </div>
        </article>

        {/* RIGHT RAIL — marginalia: cited voices */}
        <aside style={{
          borderLeft: '1px solid var(--rule)',
          padding: '40px 20px',
          background: 'var(--paper)',
        }}>
          <Label style={{ paddingTop: 0, marginBottom: 12 }}>Cited in ch{s.n}</Label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {cited.map(v => (
              <div key={v.n} style={{
                display: 'grid', gridTemplateColumns: '44px 1fr',
                gap: 10, alignItems: 'start',
                borderTop: '1px solid var(--rule)', paddingTop: 10,
              }}>
                <div style={{
                  background: `var(${v.group.varCSS})`,
                  border: `1px solid var(${v.group.ink})`,
                  aspectRatio: '3/4', padding: 4,
                  display: 'flex', flexDirection: 'column',
                  justifyContent: 'space-between',
                }}>
                  <span className="mono" style={{ fontSize: 8,
                    color: `var(${v.group.ink})` }}>
                    {String(v.n).padStart(2, '0')}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 500,
                    letterSpacing: '-0.03em', color: 'var(--ink)',
                    textAlign: 'center' }}>
                    {v.sym}
                  </span>
                  <span className="mono" style={{ fontSize: 7,
                    color: `var(${v.group.ink})`, textAlign: 'center' }}>
                    {v.tier}
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: 12, letterSpacing: '-0.005em',
                    fontWeight: 500, lineHeight: 1.25 }}>
                    {v.name}
                  </div>
                  <div className="mono" style={{ fontSize: 10,
                    color: 'var(--sub)', marginTop: 2, lineHeight: 1.35 }}>
                    {v.affiliation}
                  </div>
                  <div className="mono" style={{ fontSize: 9,
                    color: 'var(--sub2)', marginTop: 3 }}>
                    {v.minutes}m · {v.group.name}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 28 }}>
            <Label style={{ paddingTop: 0, marginBottom: 10 }}>Reader tools</Label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                ['A', 'Size'],
                ['↕', 'Line height'],
                ['◐', 'Invert'],
                ['✎', 'Add note'],
                ['⇣', 'Export PDF'],
              ].map(([ic, l]) => (
                <button key={l} className="mono" style={{
                  background: 'var(--paper)', border: '1px solid var(--rule)',
                  padding: '7px 10px', cursor: 'pointer', textAlign: 'left',
                  display: 'grid', gridTemplateColumns: '20px 1fr',
                  fontSize: 11, color: 'var(--ink)',
                }}>
                  <span>{ic}</span><span>{l}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// Chapter teaser — pulls 2-paragraph opening from window.TEASERS by chapter key.
function ChapterTeaser({ chapter, cited, openNote, setOpenNote }) {
  const t = (window.TEASERS && window.TEASERS[chapter]) || null;
  if (!t) {
    return <p style={{ fontSize: 17, lineHeight: 1.65, margin: 0, color: 'var(--sub)' }}>
      Teaser coming soon. This chapter is still being edited.
    </p>;
  }
  const [p1, p2] = t.paras;
  // Big first-letter drop cap from first paragraph
  const first = p1.charAt(0);
  const rest  = p1.slice(1);
  return (
    <>
      <div className="mono" style={{ fontSize: 11, color: 'var(--accent)',
        letterSpacing: '0.02em', marginBottom: 14 }}>
        § {t.opener.toUpperCase()}
      </div>
      <p style={{ fontSize: 17, lineHeight: 1.65, margin: 0 }}>
        <span style={{ fontSize: 68, float: 'left', lineHeight: 0.85,
          paddingRight: 10, paddingTop: 4, fontWeight: 500,
          letterSpacing: '-0.05em' }}>{first}</span>
        {rest}{' '}
        <NoteRef n={1} active={openNote === 1}
          onClick={() => setOpenNote(openNote === 1 ? null : 1)} />
      </p>
      <p style={{ fontSize: 17, lineHeight: 1.65, marginTop: 16 }}>
        {p2}{' '}
        <NoteRef n={2} active={openNote === 2}
          onClick={() => setOpenNote(openNote === 2 ? null : 2)} />
      </p>

      {cited && (
        <blockquote style={{
          margin: '32px 0 0', padding: '20px 24px',
          background: 'var(--accent-soft)',
          borderLeft: '3px solid var(--accent)',
        }}>
          <div className="mono" style={{ fontSize: 10, color: 'var(--sub)' }}>
            PULL · INTERVIEW {String(cited.n).padStart(2, '0')} — {cited.name.toUpperCase()} · {cited.affiliation.toUpperCase()}
          </div>
          <p style={{ fontSize: 22, lineHeight: 1.35, margin: '8px 0 0',
            letterSpacing: '-0.015em' }}>
            {t.opener}
          </p>
        </blockquote>
      )}

      <div style={{ marginTop: 32, padding: '14px 18px',
        border: '1px dashed var(--rule)', background: 'var(--paper)',
        display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <span className="mono" style={{ fontSize: 10, color: 'var(--accent)',
          letterSpacing: '0.05em' }}>TEASER ENDS</span>
        <span style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.5 }}>
          The full chapter continues for another {chapter === 'X' ? '~5,000' : '~5,000–8,000'} words.
          To read onward, you can <strong style={{ fontWeight: 500,
            color: 'var(--ink)' }}>volunteer as a manuscript editor</strong> on
          the Contribute page — named in the acknowledgments.
        </span>
      </div>

      {openNote && (
        <div style={{ marginTop: 28,
          background: 'var(--paper)', border: '1px solid var(--rule)',
          padding: '14px 18px', fontSize: 13, lineHeight: 1.5,
          color: 'var(--sub)', display: 'flex', gap: 12 }}>
          <span className="mono" style={{ fontSize: 10,
            color: 'var(--accent)' }}>[{openNote}]</span>
          <span>
            {openNote === 1
              ? `Opening anecdote for Chapter ${chapter}. Source notes and full citations live in the manuscript's back matter; teaser reproduced here with permission of the author.`
              : `Full-chapter draft available to manuscript editors. Sign up on the Contribute page to receive the reading passcode and editing brief.`}
          </span>
          <button onClick={() => setOpenNote(null)} className="mono" style={{
            marginLeft: 'auto', background: 'none', border: 'none',
            color: 'var(--sub)', cursor: 'pointer', fontSize: 11,
          }}>close ✕</button>
        </div>
      )}
    </>
  );
}

function NoteRef({ n, active, onClick }) {
  return (
    <sup>
      <button onClick={onClick} className="mono" style={{
        background: active ? 'var(--accent)' : 'var(--accent-soft)',
        color: active ? 'var(--paper)' : 'var(--accent)',
        border: '1px solid var(--accent)',
        padding: '1px 5px', cursor: 'pointer', fontSize: 9,
        letterSpacing: '-0.005em', verticalAlign: 'super',
        lineHeight: 1,
      }}>{n}</button>
    </sup>
  );
}

function FigurePlaceholder({ height, caption }) {
  return (
    <figure style={{ margin: 0 }}>
      <div style={{
        height, border: '1px solid var(--rule)',
        background: 'repeating-linear-gradient(135deg, var(--paper) 0 8px, #f0f0ef 8px 9px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }} className="mono">
        <span style={{ fontSize: 11, color: 'var(--sub)' }}>[ figure · drop in ]</span>
      </div>
      <figcaption className="mono" style={{ fontSize: 11, color: 'var(--sub)',
        marginTop: 8 }}>{caption}</figcaption>
    </figure>
  );
}

// ─── Join (v2) ─────────────────────────────────────────
// Numbered multi-step form, live "enquiry ticket" preview on right,
// itinerary of what happens next, colophon-style closer.
function Join() {
  const [picked, setPicked] = React.useState('A');
  const [group, setGroup] = React.useState(null);
  const [name, setName] = React.useState('');
  const [reach, setReach] = React.useState('');
  const [work, setWork] = React.useState('');
  const [why, setWhy] = React.useState('');
  const [consent, setConsent] = React.useState({ anon: false, record: true, follow: true });

  const pathMeta = {
    A: ['Sit for an interview', '60 min', 'Recorded conversation, transcribed and edited, with final approval before print.'],
    B: ['Annotate the manuscript', '~30 min', 'Mark up a chapter. Your notes become part of the public margin in the next edition.'],
    C: ['Join the correspondence', 'Monthly', 'One letter a month — no feed, no algorithm. Unsubscribe any time.'],
    D: ['Edit a chapter — unlock full text', '4–6 hrs', 'Volunteer as a manuscript editor. Receive the full draft of one chapter, return line-level notes, and be named in the acknowledgments of Volume I.'],
  };
  const gName = group != null ? window.GROUPS[group - 1].name : '—';
  const gKey  = group != null ? window.GROUPS[group - 1].key : 'XX';

  const completion = [picked, group, name, reach, work].filter(Boolean).length;
  const pct = Math.round((completion / 5) * 100);

  return (
    <div>
      {/* Masthead strip */}
      <div className="mono" style={{
        borderBottom: '1px solid var(--rule)',
        padding: '10px 24px',
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16, fontSize: 10, color: 'var(--sub)',
      }}>
        <span>SECTION / 04 · CONTRIBUTE</span>
        <span>VOLUME / II · OPEN</span>
        <span>WINDOW / UNTIL SOLSTICE 26</span>
        <span style={{ textAlign: 'right' }}>REPLY WITHIN / 14d</span>
      </div>

      {/* Hero — split headline/meta */}
      <div style={{
        display: 'grid', gridTemplateColumns: '8fr 4fr',
        borderBottom: '1px solid var(--ink)',
      }}>
        <div style={{ padding: '56px 24px 48px' }}>
          <Label style={{ paddingTop: 0 }}>04 · Contribute</Label>
          <h2 style={{
            fontSize: 'clamp(64px, 11vw, 180px)', fontWeight: 500,
            letterSpacing: '-0.05em', lineHeight: 0.88, margin: '16px 0 0',
          }}>
            Volume II<br/>
            is <span style={{ color: 'var(--accent)' }}>open</span>.
          </h2>
          <p style={{ fontSize: 20, lineHeight: 1.4, letterSpacing: '-0.015em',
            maxWidth: '58ch', margin: '32px 0 0', color: 'var(--sub)' }}>
            Volume I closes at eighty-one. Volume II is being assembled now. If
            your work touches how intelligence is organised — in a laboratory,
            a ledger, a field, a classroom, a clinic — we'd like to hear from
            you.
          </p>
        </div>
        <div style={{ borderLeft: '1px solid var(--ink)',
          background: 'var(--paper)', padding: '28px 24px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <Label style={{ paddingTop: 0 }}>Open calls</Label>
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column',
              gap: 12 }}>
              {[
                ['AI & computation', '07 / 12'],
                ['Climate adaptation', '04 / 08'],
                ['Healthcare & care work', '03 / 06'],
                ['Finance & markets', '02 / 05'],
              ].map(([n, c]) => (
                <div key={n} style={{ display: 'grid',
                  gridTemplateColumns: '1fr auto', alignItems: 'baseline',
                  borderBottom: '1px dashed var(--rule)', paddingBottom: 6 }}>
                  <span style={{ fontSize: 14, letterSpacing: '-0.01em' }}>{n}</span>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--sub)' }}>{c}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mono" style={{ fontSize: 10, color: 'var(--sub)',
            marginTop: 20 }}>
            Fig. 04 — Volume II, slots remaining by domain.
          </div>
        </div>
      </div>

      {/* MAIN: form on left, live ticket on right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '7fr 5fr',
        borderBottom: '1px solid var(--rule)',
      }}>
        {/* FORM */}
        <div style={{ padding: '40px 32px 48px',
          borderRight: '1px solid var(--rule)' }}>
          {/* Progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14,
            marginBottom: 32 }}>
            <div style={{ flex: 1, height: 2, background: 'var(--rule)',
              position: 'relative' }}>
              <div style={{ width: `${pct}%`, height: '100%',
                background: 'var(--accent)', transition: 'width .25s' }} />
            </div>
            <span className="mono" style={{ fontSize: 11, color: 'var(--sub)' }}>
              {completion}/5 · {pct}%
            </span>
          </div>

          {/* Step 01 — path */}
          <FormStep n="01" title="Pick a path">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 0,
              border: '1px solid var(--rule)' }}>
              {Object.entries(pathMeta).map(([k, [t, d, b]], i, arr) => {
                const active = picked === k;
                return (
                  <button key={k} onClick={() => setPicked(k)} style={{
                    textAlign: 'left', padding: '16px 18px',
                    background: active ? 'var(--ink)' : 'var(--paper)',
                    color: active ? 'var(--paper)' : 'var(--ink)',
                    borderBottom: i < arr.length - 1 ? '1px solid var(--rule)' : 'none',
                    border: 'none', cursor: 'pointer',
                    display: 'grid',
                    gridTemplateColumns: '56px 1fr auto',
                    gap: 16, alignItems: 'center', fontFamily: 'inherit',
                  }}>
                    <span className="mono" style={{ fontSize: 11,
                      color: active ? 'var(--accent-soft)' : 'var(--sub)' }}>
                      Path {k}
                    </span>
                    <div>
                      <div style={{ fontSize: 18, letterSpacing: '-0.015em',
                        fontWeight: 500, lineHeight: 1.2 }}>{t}</div>
                      <div style={{ fontSize: 12, lineHeight: 1.4, marginTop: 4,
                        color: active ? '#d6d6d0' : 'var(--sub)' }}>{b}</div>
                    </div>
                    <span className="mono" style={{ fontSize: 11,
                      color: active ? 'var(--accent-soft)' : 'var(--sub)' }}>
                      {d}
                    </span>
                  </button>
                );
              })}
            </div>
          </FormStep>

          {/* Step 02 — group */}
          <FormStep n="02" title="Which group are you?"
            caption="Which cell on the table do you belong to? Optional — we'll figure it out together if unsure.">
            <div style={{ display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
              {window.GROUPS.map(g => {
                const active = group === g.id;
                return (
                  <button key={g.id} onClick={() => setGroup(active ? null : g.id)}
                    style={{
                      background: active ? `var(${g.varCSS})` : 'var(--paper)',
                      border: `1px solid var(${active ? g.ink : '--rule'})`,
                      padding: '12px', cursor: 'pointer', textAlign: 'left',
                      fontFamily: 'inherit',
                      display: 'flex', flexDirection: 'column', gap: 6,
                      minHeight: 64,
                    }}>
                    <div style={{ display: 'flex',
                      justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span className="mono" style={{ fontSize: 10,
                        color: `var(${g.ink})`, fontWeight: 600 }}>
                        {g.key}
                      </span>
                      <span style={{
                        width: 10, height: 10,
                        background: `var(${g.varCSS})`,
                        border: `1px solid var(${g.ink})`,
                      }} />
                    </div>
                    <span style={{ fontSize: 13, letterSpacing: '-0.01em',
                      fontWeight: 500, color: 'var(--ink)' }}>{g.name}</span>
                  </button>
                );
              })}
            </div>
          </FormStep>

          {/* Step 03 — details */}
          <FormStep n="03" title="Where to write">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 20 }}>
              <Field label="Your name" placeholder="(anonymous is fine)"
                value={name} onChange={setName} />
              <Field label="How to reach you" placeholder="email or letter address"
                value={reach} onChange={setReach} />
              <Field full label="What you work on, in one sentence"
                placeholder="e.g. soil carbon measurement across smallholder farms"
                value={work} onChange={setWork} />
              <Field full rows={3} label="Why this book, why now"
                placeholder="optional — two or three lines is perfect"
                value={why} onChange={setWhy} />
            </div>
          </FormStep>

          {/* Step 04 — consent */}
          <FormStep n="04" title="Permissions">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2,
              border: '1px solid var(--rule)' }}>
              {[
                ['anon', 'Use my real name in print', 'Otherwise we credit you as "Interview № XX".'],
                ['record', 'Record the conversation', 'Audio stored locally. Transcript shared for approval.'],
                ['follow', 'Include me in follow-up conversations', 'Later questions after the first draft is complete.'],
              ].map(([k, t, d], i) => (
                <label key={k} style={{
                  padding: '12px 16px', cursor: 'pointer',
                  borderBottom: i < 2 ? '1px solid var(--rule)' : 'none',
                  display: 'grid', gridTemplateColumns: '20px 1fr',
                  gap: 14, alignItems: 'start',
                }}>
                  <input type="checkbox" checked={consent[k]}
                    onChange={e => setConsent({...consent, [k]: e.target.checked})}
                    style={{ marginTop: 3 }} />
                  <div>
                    <div style={{ fontSize: 14, letterSpacing: '-0.01em' }}>{t}</div>
                    <div className="mono" style={{ fontSize: 11,
                      color: 'var(--sub)', marginTop: 2 }}>{d}</div>
                  </div>
                </label>
              ))}
            </div>
          </FormStep>

          {/* Submit */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center',
            marginTop: 28, paddingTop: 16, borderTop: '1px solid var(--ink)' }}>
            <Btn filled>Submit enquiry →</Btn>
            <Btn>Save draft</Btn>
            <span className="mono" style={{ fontSize: 11, color: 'var(--sub)',
              marginLeft: 'auto' }}>
              We reply within a fortnight · never sold, never indexed.
            </span>
          </div>
        </div>

        {/* TICKET PREVIEW */}
        <aside style={{ padding: '40px 32px',
          background: 'var(--paper)', position: 'sticky', top: 48,
          alignSelf: 'start' }}>
          <Label style={{ paddingTop: 0, marginBottom: 14 }}>Enquiry · live preview</Label>
          <div style={{
            border: '1px solid var(--ink)', background: '#fff',
            position: 'relative',
          }}>
            {/* Ticket header */}
            <div style={{
              background: 'var(--ink)', color: 'var(--paper)',
              padding: '10px 14px',
              display: 'grid', gridTemplateColumns: '1fr auto',
            }}>
              <span className="mono" style={{ fontSize: 10,
                color: 'var(--accent-soft)' }}>
                KNOWWARE · ENQUIRY TICKET
              </span>
              <span className="mono" style={{ fontSize: 10,
                color: 'var(--accent-soft)' }}>
                №&nbsp;{String(Math.floor(Math.random() * 900 + 100))}.{gKey}
              </span>
            </div>
            {/* Ticket body */}
            <div style={{ padding: 18, display: 'flex',
              flexDirection: 'column', gap: 14 }}>
              <TicketRow k="Path" v={`${picked} · ${pathMeta[picked][0]}`} />
              <TicketRow k="Group" v={group != null ? `${gKey} · ${gName}` : '— unassigned'} />
              <TicketRow k="Name"  v={name || <em style={{ color: 'var(--sub2)' }}>unset</em>} />
              <TicketRow k="Reach" v={reach || <em style={{ color: 'var(--sub2)' }}>unset</em>} />
              <TicketRow k="Work"  v={work || <em style={{ color: 'var(--sub2)' }}>unset</em>} />
              {why && <TicketRow k="Why" v={why} />}
            </div>
            {/* Consent strip */}
            <div style={{
              borderTop: '1px dashed var(--rule)', padding: '10px 18px',
              display: 'flex', gap: 12, flexWrap: 'wrap',
            }}>
              {Object.entries(consent).map(([k, v]) => (
                <span key={k} className="mono" style={{
                  fontSize: 10,
                  color: v ? 'var(--accent)' : 'var(--sub2)',
                  textDecoration: v ? 'none' : 'line-through',
                }}>
                  {v ? '●' : '○'} {k}
                </span>
              ))}
            </div>
            {/* Stamp */}
            <div style={{
              position: 'absolute', right: 14, bottom: 44,
              transform: 'rotate(-8deg)',
              border: '2px solid var(--accent)', color: 'var(--accent)',
              padding: '4px 10px', fontFamily: '"JetBrains Mono", monospace',
              fontSize: 10, letterSpacing: '0.1em', opacity: 0.6,
            }}>VOL · II · DRAFT</div>
          </div>

          {/* Itinerary */}
          <div style={{ marginTop: 28 }}>
            <Label style={{ paddingTop: 0, marginBottom: 10 }}>What happens next</Label>
            <ol style={{ listStyle: 'none', padding: 0, margin: 0,
              display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                ['A', 'We read everything — usually within a fortnight.'],
                ['B', 'If it\'s a good fit, we propose a time and a form.'],
                ['C', 'You see every word before it goes to print.'],
                ['D', 'Your contribution is credited in the colophon.'],
              ].map(([k, t]) => (
                <li key={k} style={{
                  display: 'grid', gridTemplateColumns: '28px 1fr',
                  gap: 10, padding: '10px 0',
                  borderTop: '1px solid var(--rule)',
                }}>
                  <span className="mono" style={{ fontSize: 11,
                    color: 'var(--sub)' }}>{k}</span>
                  <span style={{ fontSize: 13, lineHeight: 1.4 }}>{t}</span>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>

      {/* Colophon closer */}
      <div style={{ padding: '48px 24px',
        background: 'var(--ink)', color: 'var(--paper)' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16,
        }}>
          <Label style={{ gridColumn: '1 / span 3', paddingTop: 0,
            color: 'var(--accent-soft)' }}>Or simply —</Label>
          <div style={{ gridColumn: '4 / span 9' }}>
            <div style={{ fontSize: 36, letterSpacing: '-0.025em',
              lineHeight: 1.2, maxWidth: '22ch' }}>
              write us a letter. An email is also a letter.
            </div>
            <div className="mono" style={{ fontSize: 13, marginTop: 16,
              color: 'var(--accent-soft)' }}>
              hello@knowware.press&nbsp;&nbsp;·&nbsp;&nbsp;P.O. Box 81, Brooklyn NY
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormStep({ n, title, caption, children }) {
  return (
    <section style={{ marginTop: 28,
      borderTop: '1px solid var(--ink)', paddingTop: 20 }}>
      <header style={{ display: 'grid',
        gridTemplateColumns: '32px 1fr', gap: 10,
        alignItems: 'baseline', marginBottom: 14 }}>
        <span className="mono" style={{ fontSize: 11, color: 'var(--sub)' }}>
          {n}
        </span>
        <div>
          <h3 style={{ margin: 0, fontSize: 24, letterSpacing: '-0.02em',
            fontWeight: 500, lineHeight: 1.1 }}>{title}</h3>
          {caption && (
            <p className="mono" style={{ fontSize: 11, color: 'var(--sub)',
              margin: '6px 0 0', maxWidth: '60ch', lineHeight: 1.5 }}>
              {caption}
            </p>
          )}
        </div>
      </header>
      {children}
    </section>
  );
}

function TicketRow({ k, v }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr',
      gap: 10, alignItems: 'start' }}>
      <span className="mono" style={{ fontSize: 10, color: 'var(--sub)',
        paddingTop: 2 }}>{k}</span>
      <span style={{ fontSize: 13, lineHeight: 1.4, color: 'var(--ink)' }}>{v}</span>
    </div>
  );
}

function Field({ label, placeholder, full, value, onChange, rows }) {
  const common = {
    value: value || '',
    onChange: e => onChange && onChange(e.target.value),
    placeholder,
    style: {
      border: 'none', borderBottom: '1px solid var(--ink)',
      background: 'transparent', padding: '8px 0', fontSize: 15,
      fontFamily: 'inherit', outline: 'none', resize: 'vertical',
      width: '100%',
    },
  };
  return (
    <label style={{
      gridColumn: full ? '1 / span 2' : undefined,
      display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      <span className="mono" style={{ fontSize: 10, color: 'var(--sub)' }}>{label}</span>
      {rows ? <textarea rows={rows} {...common} /> : <input {...common} />}
    </label>
  );
}

function Btn({ children, filled, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: filled ? 'var(--ink)' : 'var(--paper)',
      color: filled ? 'var(--paper)' : 'var(--ink)',
      border: '1px solid var(--ink)', padding: '10px 14px',
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      fontSize: 12, cursor: 'pointer', letterSpacing: '-0.005em',
      textAlign: 'left',
    }}>{children}</button>
  );
}

Object.assign(window, { Shell, Cover, TablePage, Read, Join });
