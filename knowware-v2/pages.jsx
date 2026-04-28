// Page components — Swiss direction

const { useState, useEffect, useRef } = React;
const useBP = () => React.useContext(window.BreakpointContext);

function Shell({ page, setPage, children }) {
  const bp = useBP();
  const mob = bp === 'mobile';
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
        padding: mob ? '12px 16px' : '14px 32px',
        borderBottom: '1px solid var(--rule)',
        position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 10,
      }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'baseline' }}>
          <button onClick={() => setPage('cover')} style={{
            background: 'none', border: 'none', padding: 0, cursor: 'pointer',
            fontFamily: 'inherit', fontSize: 17, fontWeight: 600,
            letterSpacing: '-0.015em', color: 'var(--ink)',
          }}>Knowware<span style={{ color: 'var(--sub2)' }}>®</span></button>
          {!mob && (
            <span className="mono" style={{ fontSize: 12, color: 'var(--sub)' }}>
              systems-of-intelligence · v1.0 · mmxxvi
            </span>
          )}
        </div>
        <nav style={{ display: 'flex', gap: 0 }}>
          {nav.map(([k, n, l]) => (
            <button key={k} onClick={() => setPage(k)} style={{
              background: page === k ? 'var(--ink)' : 'transparent',
              color: page === k ? 'var(--paper)' : 'var(--ink)',
              border: 'none', padding: mob ? '7px 10px' : '7px 12px', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: mob ? 13 : 15, letterSpacing: '-0.01em',
              display: 'flex', gap: mob ? 0 : 8, alignItems: 'baseline',
            }}>
              <span className="mono" style={{ fontSize: mob ? 10 : 11, opacity: 0.6 }}>{n}</span>
              {!mob && <span>{l}</span>}
            </button>
          ))}
        </nav>
      </header>
      <main style={{ flex: 1 }}>{children}</main>
      {!mob && <Foot />}
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
  const mob = useBP() === 'mobile';
  return <div style={{
    display: 'grid', gridTemplateColumns: mob ? '1fr' : 'repeat(12, 1fr)',
    gap: mob ? 12 : 20, padding: mob ? '0 16px' : '0 48px', ...style,
  }}>{children}</div>;
}

function Label({ children, style }) {
  return <div className="mono" style={{
    fontSize: 13, color: 'var(--sub)', paddingTop: 6,
    letterSpacing: '-0.005em', ...style,
  }}>{children}</div>;
}

function MobileSpine({ setPage }) {
  const barPcts = window.SECTIONS.map((_, i) => 45 + ((i * 37) % 55));
  const maxPct  = Math.max(...barPcts);
  const [visible, setVisible] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <div style={{ border: '1px solid var(--rule)', background: 'var(--paper)' }}>
        {window.SECTIONS.map((s, i) => (
          <button key={s.n} onClick={() => setPage('read')} style={{
            width: '100%', background: 'none', border: 'none',
            borderBottom: '1px solid var(--rule)',
            padding: '10px 14px', cursor: 'pointer',
            display: 'grid', gridTemplateColumns: '32px 1fr auto',
            alignItems: 'center', gap: 10, fontFamily: 'inherit', textAlign: 'left',
          }}>
            <span className="mono" style={{ fontSize: 9, color: 'var(--sub)' }}>ch{s.n}</span>
            <span style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontSize: 13, letterSpacing: '-0.01em', color: 'var(--ink)', lineHeight: 1.2 }}>{s.title}</span>
              <span style={{
                display: 'block', height: 2,
                background: 'var(--accent)',
                width: visible ? `${(barPcts[i] / maxPct) * 100}%` : '0%',
                transition: `width 0.55s cubic-bezier(0.4,0,0.2,1) ${i * 55}ms`,
              }} />
            </span>
            <span className="mono" style={{ fontSize: 9, color: 'var(--sub2)' }}>↗</span>
          </button>
        ))}
      </div>
      <div style={{ position: 'relative', marginTop: 8, paddingBottom: 14 }}>
        <div style={{ height: 1, background: 'var(--rule)', width: '100%' }} />
        <div style={{ height: 4, width: 1, background: 'var(--rule)', position: 'absolute', top: 0, left: 0 }} />
        <div style={{ height: 4, width: 1, background: 'var(--rule)', position: 'absolute', top: 0, right: 0 }} />
        <div className="mono" style={{ display: 'flex', justifyContent: 'space-between',
          fontSize: 9, color: 'var(--sub2)', marginTop: 4 }}>
          <span>0 pp</span>
          <span>Fig. 02 — relative page count</span>
          <span>~350 pp</span>
        </div>
      </div>
    </div>
  );
}

// ─── Cover (v2) ────────────────────────────────────────
// Hero is a bleed strip. Running metadata masthead up top.
// Marquee of groups. A "spine" TOC. Live clock.
function Cover({ setPage }) {
  const bp = useBP();
  const mob = bp === 'mobile';
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
        padding: mob ? '8px 16px' : '10px 24px',
        display: 'grid',
        gridTemplateColumns: mob ? '1fr 1fr' : 'repeat(6, 1fr)',
        gap: 16, fontSize: 10, color: 'var(--sub)',
        letterSpacing: '-0.005em',
      }}>
        <span>ISSUE / 01</span>
        {!mob && <span>VOL / I OF II</span>}
        {!mob && <span>PRINT / AUTUMN 26</span>}
        {!mob && <span>PAGES / 512</span>}
        {!mob && <span>VOICES / 081</span>}
        <span style={{ textAlign: 'right' }}>{clock}</span>
      </div>

      {/* Hero — left wordmark, right huge numeral "81" */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: mob ? '1fr' : '6fr 6fr',
        alignItems: 'stretch',
        borderBottom: '1px solid var(--ink)',
        minHeight: mob ? 'auto' : '64vh',
      }}>
        <div style={{ padding: '48px 24px 32px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <p style={{
            margin: 0,
            fontSize: mob ? 15 : 17, lineHeight: 1.25,
            letterSpacing: '-0.02em', fontStyle: 'italic',
            color: 'var(--sub)',
          }}>
            You already know this.<br />You just haven't had a name for it.
          </p>
          <div className="mono" style={{ fontSize: 11, color: 'var(--sub)' }}>
            KNOWWARE / SYSTEMS OF INTELLIGENCE
          </div>
          <h1 style={{
            margin: 0,
            fontSize: mob ? 'clamp(56px, 15vw, 100px)' : 'clamp(72px, 13vw, 220px)',
            lineHeight: 0.82, letterSpacing: '-0.05em', fontWeight: 500,
          }}>
            Systems<br/>
            <span style={{ fontWeight: 400 }}>of</span>&nbsp;Intelligence.
          </h1>
          <div className="mono" style={{ fontSize: 11, color: 'var(--sub)',
            display: 'flex', justifyContent: 'space-between' }}>
            <span>BY &nbsp;/&nbsp; KHAYYAM</span>
            <span>MMXXVI · ED. 01</span>
          </div>
        </div>
        <div style={{
          borderLeft: mob ? 'none' : '1px solid var(--ink)',
          borderTop: mob ? '1px solid var(--ink)' : 'none',
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="mono" style={{ fontSize: 10, color: 'var(--sub2)',
              fontStyle: 'italic', letterSpacing: '-0.005em' }}>
              These interviews never happened.
            </div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--sub)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>ACROSS 3 TIERS · 9 CHAPTERS</span>
              <button onClick={() => setPage('table')} style={{
                background: 'var(--ink)', color: 'var(--paper)',
                border: 'none', padding: '6px 10px', fontFamily: 'inherit',
                fontSize: 11, cursor: 'pointer',
              }}>See all →</button>
            </div>
          </div>
        </div>
      </div>

      {/* Domains marquee */}
      {(() => {
        const DOMAINS = [
          { label: 'AI',          code: 'AI',  color: 'oklch(0.88 0.09 20)'  },
          { label: 'Finance',     code: 'FIN', color: 'oklch(0.88 0.09 55)'  },
          { label: 'Logistics',   code: 'LOG', color: 'oklch(0.88 0.09 85)'  },
          { label: 'Biology',     code: 'BIO', color: 'oklch(0.88 0.09 140)' },
          { label: 'Education',   code: 'EDU', color: 'oklch(0.88 0.09 160)' },
          { label: 'Policy',      code: 'POL', color: 'oklch(0.88 0.09 195)' },
          { label: 'Agriculture', code: 'AGR', color: 'oklch(0.88 0.09 215)' },
          { label: 'Cities',      code: 'CIT', color: 'oklch(0.88 0.09 240)' },
          { label: 'Memory',      code: 'MEM', color: 'oklch(0.88 0.09 280)' },
          { label: 'Media',       code: 'MED', color: 'oklch(0.88 0.09 310)' },
          { label: 'Labour',      code: 'LAB', color: 'oklch(0.88 0.09 340)' },
        ];
        const inkOf = c => c.replace('0.88', '0.38');
        return (
          <div style={{
            borderBottom: '1px solid var(--rule)',
            overflow: 'hidden', whiteSpace: 'nowrap',
            padding: '0', background: 'var(--paper)',
          }}>
            <div style={{
              display: 'inline-flex',
              animation: 'kw-marquee 38s linear infinite',
            }} className="mono">
              {Array.from({length: 3}).flatMap((_, k) =>
                DOMAINS.map(d => (
                  <span key={`${k}-${d.code}`} style={{
                    fontSize: 12, letterSpacing: '0.02em',
                    display: 'inline-flex', alignItems: 'center',
                    gap: 10, padding: '11px 22px',
                    borderRight: '1px solid var(--rule)',
                  }}>
                    <span style={{
                      width: 10, height: 10, flexShrink: 0,
                      background: d.color,
                      border: `1px solid ${inkOf(d.color)}`,
                      display: 'inline-block',
                    }} />
                    <span style={{ color: 'var(--ink)' }}>{d.label.toUpperCase()}</span>
                    <span style={{ color: 'var(--sub2)', fontSize: 10 }}>{d.code}</span>
                  </span>
                ))
              )}
            </div>
            <style>{`@keyframes kw-marquee{0%{transform:translateX(0)}100%{transform:translateX(-33.33%)}}`}</style>
          </div>
        );
      })()}

      <div style={{ padding: '0 0 56px' }}>

      {/* Abstract ribbon */}
      {mob ? (
        <div style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Label>Abstract</Label>
          <p style={{ fontSize: 18, lineHeight: 1.4, margin: 0, letterSpacing: '-0.015em' }}>
            A field guide for anyone who must survive what is coming. Built from{' '}
            <strong style={{ fontWeight: 500, color: 'var(--accent)' }}>eighty-one long conversations</strong>{' '}
            with academics, practitioners, and visionaries.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Btn filled onClick={() => setPage('table')}>Open the 81 →</Btn>
            <Btn onClick={() => setPage('read')}>Read the preview →</Btn>
            <Btn onClick={() => setPage('join')}>Contribute to Vol. II →</Btn>
          </div>
        </div>
      ) : (
        <Grid style={{ marginTop: 36 }}>
          <Label style={{ gridColumn: '1 / span 3' }}>Abstract</Label>
          <p style={{ gridColumn: '4 / span 6', fontSize: 26, lineHeight: 1.35,
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
      )}

      {/* The Spine — compact TOC shown as a book spine */}
      <Grid style={{ marginTop: 64 }}>
        <Label style={{ gridColumn: '1 / span 3' }}>01 · The spine</Label>
        <div style={{ gridColumn: mob ? '1' : '4 / span 9' }}>
          <div style={{ display: 'flex', alignItems: mob ? 'flex-start' : 'end',
            flexDirection: mob ? 'column' : 'row',
            justifyContent: 'space-between', gap: mob ? 10 : 0, marginBottom: 14 }}>
            <h2 style={{ fontSize: mob ? 'clamp(22px, 6vw, 32px)' : 40, fontWeight: 500,
              letterSpacing: '-0.03em', margin: 0, lineHeight: 1 }}>
              Nine chapters, one capstone.
            </h2>
            <button onClick={() => setPage('read')} className="mono" style={{
              background: 'none', border: '1px solid var(--ink)',
              padding: '6px 10px', cursor: 'pointer', fontSize: 11, flexShrink: 0,
            }}>Read manuscript ↗</button>
          </div>

          {mob ? <MobileSpine setPage={setPage} /> : (
            /* Desktop: bar chart spine */
            <>
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
            </>
          )}
        </div>
      </Grid>

      {/* Thesis — full bleed band */}
      <div style={{
        marginTop: 64, background: 'var(--ink)', color: 'var(--paper)',
        padding: mob ? '40px 16px' : '64px 24px',
      }}>
        <div style={{ display: 'grid',
          gridTemplateColumns: mob ? '1fr' : 'repeat(12, 1fr)', gap: 16,
          maxWidth: '100%' }}>
          <Label style={{ gridColumn: mob ? '1' : '1 / span 3',
            color: 'var(--accent-soft)' }}>02 · Thesis</Label>
          <div style={{ gridColumn: mob ? '1' : '4 / span 9', fontSize: mob ? 22 : 40,
            lineHeight: 1.2, letterSpacing: '-0.02em' }}>
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
        <Label style={{ gridColumn: mob ? '1' : '1 / span 3' }}>03 · Structure</Label>
        <div style={{ gridColumn: mob ? '1' : '4 / span 9' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: mob ? 'repeat(3, 1fr)' : 'repeat(6, 1fr)',
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
                borderRight: mob ? (i % 3 < 2 ? '1px solid var(--rule)' : 'none') : (i < 5 ? '1px solid var(--rule)' : 'none'),
                borderBottom: mob && i < 3 ? '1px solid var(--rule)' : 'none',
                padding: mob ? '16px 10px 12px' : '24px 14px 18px',
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
        <Label style={{ gridColumn: mob ? '1' : '1 / span 3' }}>04 · Early readers</Label>
        <div style={{ gridColumn: mob ? '1' : '4 / span 9',
          display: 'grid', gridTemplateColumns: mob ? '1fr' : 'repeat(12, 1fr)',
          gap: 16, rowGap: mob ? 24 : 40 }}>
          {[
            ['A book that reads you while you read it.', 'N. Mehta', 'researcher', 1, 6],
            ['The most serious attempt to map the new terrain I have seen.', 'L. Okafor', 'economist', 7, 6],
            ['Essential, and a little frightening.', 'Y. Park', 'editor', 3, 7],
          ].map(([q, a, r, start, span], i) => (
            <blockquote key={a} style={{
              gridColumn: mob ? '1' : `${start} / span ${span}`,
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
      <div style={{ marginTop: 64, padding: mob ? '0 16px' : '0 24px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr auto',
          alignItems: 'center', gap: mob ? 16 : 24,
          border: '1px solid var(--ink)',
          padding: mob ? '20px 16px' : '28px 32px', background: 'var(--accent-soft)',
        }}>
          <div style={{ fontSize: mob ? 20 : 28, letterSpacing: '-0.02em',
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

// ─── Cast / Manifest view ──────────────────────────────
const CAST = [
  {n:1,t:"The Coordination Intelligence Revolution",voices:[
    {i:"01",nm:"Dr. Paul Pangaro",r:"Cybernetician, Conversation Theory",s:"alive",tri:"A",f:"old"},
    {i:"02",nm:"Dr. N. Katherine Hayles",r:"Literary Scholar, Posthuman Cognition",s:"alive",tri:"A",f:"old"},
    {i:"03",nm:"Donella Meadows",r:"Thinking in Systems",s:"passed",tri:"A",tg:"legacy",f:"missing"},
    {i:"04",nm:"Stewart Brand",r:"Whole Earth Catalog",s:"alive",tri:"P",f:"old"},
    {i:"05",nm:"Kevin Kelly",r:"Wired, What Technology Wants",s:"alive",tri:"P",tg:"new",f:"missing"},
    {i:"06",nm:"Yann Minh",r:"Digital Shamanism",s:"alive",tri:"P",f:"old"},
    {i:"07",nm:"Terence McKenna",r:"Ethnobotanist, Philosopher",s:"passed",tri:"V",tg:"legacy",f:"old"},
    {i:"08",nm:"Lakota Elder Phillip Deere",r:"Star Knowledge",s:"passed",tri:"V",tg:"legacy",f:"old"},
    {i:"09",nm:"Daniel Schmachtenberger",r:"Consilience Project",s:"alive",tri:"V",tg:"new",f:"missing"},
  ]},
  {n:2,t:"The Dawn of Systems Intelligence",voices:[
    {i:"10",nm:"Dr. Judea Pearl",r:"Causal Inference",s:"alive",tri:"A",f:"old"},
    {i:"11",nm:"Claude Shannon",r:"Information Theory",s:"passed",tri:"A",tg:"legacy",f:"new"},
    {i:"12",nm:"Alan Turing",r:"Computing Machinery & Intelligence",s:"passed",tri:"A",tg:"legacy",f:"missing"},
    {i:"13",nm:"Dr. Hartmut Neven",r:"Google Quantum AI",s:"alive",tri:"P",f:"old"},
    {i:"14",nm:"Former NSA Tech Director",r:"Signals Intelligence",s:"anon",tri:"P",f:"old"},
    {i:"15",nm:"Palmer Luckey",r:"Oculus, Anduril",s:"alive",tri:"P",f:"old"},
    {i:"16",nm:"Mo Gawdat",r:"Google X — saw AI dawn from inside",s:"alive",tri:"V",tg:"new",f:"new"},
    {i:"17",nm:"Hunbatz Men",r:"Maya Elder",s:"alive",tri:"V",f:"old"},
    {i:"18",nm:"Prof. Ruqian Lu",r:"Named knowware (2005)",s:"alive",tri:"V",tg:"origin",f:"new"},
  ]},
  {n:3,t:"Architecture of Systems Intelligence",voices:[
    {i:"19",nm:"Yann LeCun",r:"Chief AI Scientist, Meta",s:"alive",tri:"A",f:"old"},
    {i:"20",nm:"Richard Feynman",r:"Theoretical Physicist",s:"passed",tri:"A",tg:"legacy",f:"new"},
    {i:"21",nm:"James Gosling",r:"Creator of Java",s:"alive",tri:"A",tg:"new",f:"missing"},
    {i:"22",nm:"Dario Amodei",r:"CEO, Anthropic",s:"alive",tri:"P",f:"old"},
    {i:"23",nm:"Demis Hassabis",r:"CEO, Google DeepMind",s:"alive",tri:"P",f:"old"},
    {i:"24",nm:"Clément Delangue",r:"CEO, Hugging Face",s:"alive",tri:"P",tg:"new",f:"old"},
    {i:"25",nm:"Iain McGilchrist",r:"The Master and His Emissary",s:"alive",tri:"V",tg:"new",f:"missing"},
    {i:"26",nm:"Fritjof Capra",r:"Web of Life, Systems Thinking",s:"alive",tri:"V",tg:"new",f:"missing"},
    {i:"27",nm:"Ray Kurzweil",r:"Singularity, Law of Accelerating Returns",s:"alive",tri:"V",tg:"new",f:"old"},
  ]},
  {n:4,t:"Systems Intelligence in Action",voices:[
    {i:"28",nm:"Dr. Carlo Ratti",r:"MIT Senseable City Lab",s:"alive",tri:"A",f:"old"},
    {i:"29",nm:"Dr. Eric Topol",r:"Digital Medicine",s:"alive",tri:"A",f:"old"},
    {i:"30",nm:"Andrew Lo",r:"Finance Professor, MIT",s:"alive",tri:"A",f:"old"},
    {i:"31",nm:"Dan Doctoroff",r:"Former CEO Sidewalk Labs",s:"alive",tri:"P",f:"old"},
    {i:"32",nm:"Linda Raschke",r:"Professional Trader",s:"alive",tri:"P",f:"old"},
    {i:"33",nm:"Anonymous Quant Trader",r:"Systematic Trading",s:"anon",tri:"P",f:"old"},
    {i:"34",nm:"Sarah Rossbach",r:"Feng Shui Scholar",s:"alive",tri:"V",f:"old"},
    {i:"35",nm:"Caroline Myss",r:"Medical Intuitive",s:"alive",tri:"V",f:"old"},
    {i:"36",nm:"Nassim Taleb",r:"Antifragility — coordination resilience",s:"alive",tri:"V",tg:"new",f:"missing"},
  ]},
  {n:5,t:"Human-Systems Intelligence Interaction",voices:[
    {i:"37",nm:"Dr. Miguel Nicolelis",r:"Neuroscientist, BCI",s:"alive",tri:"A",f:"old"},
    {i:"38",nm:"Dr. Alex Pentland",r:"Social Physics",s:"alive",tri:"A",f:"old"},
    {i:"39",nm:"Dr. Shannon Vallor",r:"AI Ethicist",s:"alive",tri:"A",f:"old"},
    {i:"40",nm:"Dr. Thomas Oxley",r:"CEO, Synchron",s:"alive",tri:"P",f:"old"},
    {i:"41",nm:"Tristan Harris",r:"Center for Humane Tech",s:"alive",tri:"P",f:"old"},
    {i:"42",nm:"Jimmy Wales",r:"Founder, Wikipedia",s:"alive",tri:"P",f:"old"},
    {i:"43",nm:"Anonymous BCI User",r:"Living the Hybrid Reality",s:"anon",tri:"V",f:"old"},
    {i:"44",nm:"Thich Nhat Hanh Foundation",r:"Interbeing",s:"passed",tri:"V",tg:"legacy",f:"old"},
    {i:"45",nm:"Donna Haraway",r:"Cyborg Manifesto",s:"alive",tri:"V",tg:"new",f:"missing"},
  ]},
  {n:6,t:"Consciousness as Pattern Recognition",voices:[
    {i:"46",nm:"Stuart Russell",r:"AI Safety, UC Berkeley",s:"alive",tri:"A",f:"old"},
    {i:"47",nm:"Timnit Gebru",r:"AI Justice, DAIR",s:"alive",tri:"A",f:"old"},
    {i:"48",nm:"Kate Crawford",r:"AI Now Institute",s:"alive",tri:"A",f:"old"},
    {i:"49",nm:"Norbert Wiener",r:"Father of Cybernetics",s:"passed",tri:"P",tg:"legacy",f:"new"},
    {i:"50",nm:"Margaret Mitchell",r:"Hugging Face Ethics",s:"alive",tri:"P",tg:"new",f:"missing"},
    {i:"51",nm:"Anonymous In-Q-Tel PM",r:"Intel community ↔ tech",s:"anon",tri:"P",tg:"new",f:"new"},
    {i:"52",nm:"Roger Penrose",r:"Consciousness & Quantum",s:"alive",tri:"V",tg:"new",f:"missing"},
    {i:"53",nm:"Antonio Damasio",r:"Somatic Markers",s:"alive",tri:"V",tg:"new",f:"missing"},
    {i:"54",nm:"Rupert Sheldrake",r:"Morphic Resonance",s:"alive",tri:"V",tg:"new",f:"missing"},
  ]},
  {n:7,t:"Engineering Reality",voices:[
    {i:"55",nm:"Dr. John Preskill",r:"Quantum Computing",s:"alive",tri:"A",f:"old"},
    {i:"56",nm:"Dr. Seth Lloyd",r:"Quantum Biology",s:"alive",tri:"A",f:"old"},
    {i:"57",nm:"Chip Huyen",r:"Production ML",s:"alive",tri:"A",f:"old"},
    {i:"58",nm:"Jeff Dean",r:"Google Infrastructure",s:"alive",tri:"P",f:"old"},
    {i:"59",nm:"Dr. Lisa Su",r:"Chair & CEO, AMD",s:"alive",tri:"P",tg:"new",f:"new"},
    {i:"60",nm:"Wendell Weeks",r:"CEO, Corning",s:"alive",tri:"P",tg:"new",f:"new"},
    {i:"61",nm:"Neri Oxman",r:"Material Ecology",s:"alive",tri:"V",f:"old"},
    {i:"62",nm:"Anon DARPA Program Manager",r:"Breakthrough tech coordination",s:"anon",tri:"V",tg:"new",f:"new"},
    {i:"63",nm:"Dr. Fei-Fei Li",r:"Stanford, Human-Centered AI",s:"alive",tri:"V",tg:"new",f:"old"},
  ]},
  {n:8,t:"Beyond Human Intelligence",voices:[
    {i:"64",nm:"Dr. Max Tegmark",r:"MIT, Future of Life",s:"alive",tri:"A",f:"old"},
    {i:"65",nm:"Dr. Nick Bostrom",r:"Oxford, FHI",s:"alive",tri:"A",f:"old"},
    {i:"66",nm:"Dr. Jill Tarter",r:"SETI Institute",s:"alive",tri:"A",f:"old"},
    {i:"67",nm:"Dr. Sara Seager",r:"Exoplanet Research",s:"alive",tri:"P",f:"old"},
    {i:"68",nm:"Dr. David Chalmers",r:"Philosophy of Mind",s:"alive",tri:"P",f:"old"},
    {i:"69",nm:"Anil Seth",r:"Being You — consciousness as controlled hallucination",s:"alive",tri:"P",tg:"new",f:"missing"},
    {i:"70",nm:"Liu Cixin",r:"Dark Forest",s:"alive",tri:"V",f:"old"},
    {i:"71",nm:"Dr. Thomas Nagel",r:"What Is It Like To Be",s:"alive",tri:"V",f:"old"},
    {i:"72",nm:"Srinivasa Ramanujan",r:"Mathematician, 1887–1920",s:"passed",tri:"V",tg:"legacy",f:"new"},
  ]},
  {n:9,t:"No Way Know-How",voices:[
    {i:"73",nm:"David Autor",r:"Labor Economics",s:"alive",tri:"A",f:"old"},
    {i:"74",nm:"Kate Raworth",r:"Doughnut Economics",s:"alive",tri:"A",f:"old"},
    {i:"75",nm:"François Chollet",r:"Keras, ARC Prize",s:"alive",tri:"A",f:"old"},
    {i:"76",nm:"Emad Mostaque",r:"Founder, Stability AI",s:"alive",tri:"P",f:"old"},
    {i:"77",nm:"Dr. Fiona Hill",r:"Brookings, Former NSC",s:"alive",tri:"P",tg:"new",f:"new"},
    {i:"78",nm:"Peter Senge",r:"The Fifth Discipline, Systems Learning",s:"alive",tri:"P",tg:"new",f:"missing"},
    {i:"79",nm:"Charles Eisenstein",r:"Sacred Economics",s:"alive",tri:"V",f:"old"},
    {i:"80",nm:"Sherry Turkle",r:"Technology & Connection",s:"alive",tri:"V",f:"old"},
    {i:"81",nm:"Anon CIA/KGB MK-Ultra",r:"Coordination failure from inside",s:"anon",tri:"V",tg:"new",f:"new"},
  ]},
];

function CastView() {
  const mob = useBP() === 'mobile';

  const allVoices = CAST.flatMap(c => c.voices);
  const legacy = allVoices.filter(v => v.tg === 'legacy').length;
  const anon   = allVoices.filter(v => v.s === 'anon').length;
  const origin = allVoices.filter(v => v.tg === 'origin').length;
  const old_   = allVoices.filter(v => v.f === 'old').length;
  const newAll = allVoices.filter(v => v.f !== 'old').length;

  const statusDot = s =>
    s === 'alive'  ? '#1D9E75' :
    s === 'passed' ? 'var(--sub2)' : 'oklch(0.60 0.15 270)';

  const tierBg = t =>
    t === 'A' ? 'var(--tier-a)' : t === 'P' ? 'var(--tier-p)' : 'var(--tier-v)';
  const tierInk = t =>
    t === 'A' ? 'var(--tier-a-ink)' : t === 'P' ? 'var(--tier-p-ink)' : 'var(--tier-v-ink)';

  const fileBadge = f => {
    if (f === 'old')     return { bg: 'var(--tier-v)',   ink: 'var(--tier-v-ink)', label: 'FILED' };
    if (f === 'new')     return { bg: 'var(--tier-a)',   ink: 'var(--tier-a-ink)', label: 'NEW'   };
    if (f === 'missing') return { bg: 'var(--tier-a)',   ink: 'var(--tier-a-ink)', label: 'NEW'   };
    return null;
  };

  const tagBadge = tg => {
    if (tg === 'legacy') return { bg: 'var(--sub2)', ink: 'var(--paper)', label: 'LEGACY' };
    if (tg === 'origin') return { bg: 'var(--accent)', ink: '#fff', label: 'ORIGIN' };
    if (tg === 'new')    return null;
    return null;
  };

  return (
    <div style={{ paddingBottom: 80 }}>

      {/* Explainer header */}
      <div style={{
        padding: mob ? '20px 16px 24px' : '28px 24px 32px',
        background: 'var(--ink)', color: 'var(--paper)',
        borderBottom: '1px solid var(--rule)',
      }}>
        <p style={{
          margin: '0 0 20px',
          fontSize: mob ? 14 : 15, lineHeight: 1.6,
          letterSpacing: '-0.01em', color: 'oklch(0.75 0.04 250)',
          maxWidth: 640,
        }}>
          None of these interviews happened. Every insight is real.
          All 81 voices are synthesised from published work, lectures, papers, and primary sources.
          Nine are legacy guests — historical figures whose ideas outlasted their presence.
          The pattern is real even when the room never existed.
        </p>
        {/* Stats row */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {[
            ['81', 'total voices'],
            [String(old_), 'old'],
            [String(newAll), 'new'],
            [String(legacy), 'legacy guests'],
            [String(anon), 'anonymous'],
            [String(origin), 'named the field'],
          ].map(([v, l]) => (
            <div key={l} style={{
              borderLeft: '2px solid var(--accent)', paddingLeft: 10,
            }}>
              <div className="mono" style={{ fontSize: mob ? 18 : 22, fontWeight: 500, lineHeight: 1 }}>{v}</div>
              <div className="mono" style={{ fontSize: 9, color: 'var(--sub)', marginTop: 3, letterSpacing: '0.04em' }}>{l.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{
        padding: mob ? '10px 16px' : '10px 24px',
        borderBottom: '1px solid var(--rule)',
        display: 'flex', gap: mob ? 12 : 20, flexWrap: 'wrap', alignItems: 'center',
      }}>
        {[
          { el: <span style={{ width:8, height:8, borderRadius:'50%', background:'#1D9E75', display:'inline-block' }} />, label: 'With us' },
          { el: <span style={{ width:8, height:8, borderRadius:'50%', background:'var(--sub2)', display:'inline-block' }} />, label: 'Beyond' },
          { el: <span style={{ width:8, height:8, borderRadius:'50%', background:'oklch(0.60 0.15 270)', display:'inline-block' }} />, label: 'Anonymous' },
          { el: <span style={{ background:'var(--sub2)', color:'var(--paper)', fontSize:8, padding:'1px 5px', fontFamily:'var(--mono)', fontWeight:500 }}>LEGACY</span>, label: 'Channeling frequencies' },
          { el: <span style={{ background:'var(--accent)', color:'#fff', fontSize:8, padding:'1px 5px', fontFamily:'var(--mono)', fontWeight:500 }}>ORIGIN</span>, label: 'Named the field' },
        ].map(({ el, label }) => (
          <div key={label} className="mono" style={{ display:'flex', alignItems:'center', gap:6, fontSize:10, color:'var(--sub)' }}>
            {el} {label}
          </div>
        ))}
      </div>

      {/* Chapter sections */}
      <div style={{ padding: mob ? '0 0 40px' : '0 0 40px' }}>
        {CAST.map(ch => (
          <div key={ch.n} style={{ borderBottom: '1px solid var(--rule)' }}>
            {/* Chapter header */}
            <div className="mono" style={{
              padding: mob ? '8px 16px' : '8px 24px',
              fontSize: 10, color: 'var(--sub)',
              display: 'flex', justifyContent: 'space-between',
              borderBottom: '1px solid var(--rule)',
              background: 'var(--paper)',
              position: 'sticky', top: 48, zIndex: 5,
            }}>
              <span style={{ letterSpacing: '0.04em' }}>CH.{String(ch.n).padStart(2,'0')} — {ch.t.toUpperCase()}</span>
              <span>{ch.voices.length} VOICES</span>
            </div>

            {/* Voice rows */}
            {ch.voices.map(v => {
              const fb = fileBadge(v.f);
              const tb = tagBadge(v.tg);
              return (
                <div key={v.i} style={{
                  display: 'grid',
                  gridTemplateColumns: mob
                    ? '8px 16px 1fr auto auto'
                    : '8px 16px 1fr 1fr auto auto',
                  alignItems: 'center', gap: mob ? 10 : 14,
                  padding: mob ? '9px 16px' : '9px 24px',
                  borderBottom: '1px solid var(--rule)',
                  opacity: v.f === 'missing' ? 0.65 : 1,
                }}>
                  {/* Tier color block */}
                  <span style={{ width:8, alignSelf:'stretch', background: tierBg(v.tri), flexShrink:0 }} />
                  {/* Status dot */}
                  <span style={{ width:8, height:8, borderRadius:'50%', background: statusDot(v.s), display:'inline-block', flexShrink:0 }} />
                  {/* Number + name + legacy badge */}
                  <div style={{ display:'flex', alignItems:'center', gap:8, minWidth:0 }}>
                    <span className="mono" style={{ fontSize:10, color:'var(--sub2)', flexShrink:0 }}>{v.i}</span>
                    <span style={{ fontSize: mob ? 13 : 14, fontWeight:500, letterSpacing:'-0.01em',
                      overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{v.nm}</span>
                    {tb && (
                      <span className="mono" style={{ fontSize:8, padding:'1px 5px', fontWeight:500,
                        background:tb.bg, color:tb.ink, flexShrink:0 }}>{tb.label}</span>
                    )}
                  </div>
                  {/* Role — desktop only */}
                  {!mob && (
                    <span className="mono" style={{ fontSize:11, color:'var(--sub)',
                      overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{v.r}</span>
                  )}
                  {/* File badge */}
                  {fb && (
                    <span className="mono" style={{ fontSize:8, padding:'2px 6px', fontWeight:500,
                      background:fb.bg, color:fb.ink, whiteSpace:'nowrap', flexShrink:0 }}>{fb.label}</span>
                  )}
                  {/* Tier classification */}
                  <span className="mono" style={{
                    fontSize: 9, padding: '3px 7px', fontWeight: 600,
                    background: tierBg(v.tri), color: tierInk(v.tri),
                    whiteSpace: 'nowrap', flexShrink: 0, letterSpacing: '0.04em',
                  }}>
                    {v.tri === 'A' ? 'Academic' : v.tri === 'P' ? 'Practitioner' : 'Visionary'}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── The Table page ────────────────────────────────────
function TablePage({ setPage, onOpenDossier }) {
  const bp = useBP();
  const mob = bp === 'mobile';
  const layout = bp === 'desktop' ? 'w27' : 'sq9';
  const [view, setView] = React.useState('graph'); // 'table' | 'graph' | 'mo'
  const [hover, setHover] = React.useState(null);
  const [selected, setSelected] = React.useState(null);
  const [highlightGroup, setHighlightGroup] = React.useState(null);

  const showN = hover || selected;
  const shown = showN ? window.INTERVIEWS[showN - 1] : null;

  return (
    <div>
      <div style={{ padding: mob ? '12px 16px 32px' : '20px 24px 48px' }}>
        {/* Header: title left, view toggle right */}
        <div style={{ display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', flexDirection: mob ? 'column' : 'row',
          gap: mob ? 12 : 0, marginBottom: 20 }}>
          <div>
            <Label style={{ paddingTop: 0 }}>02 · The 81</Label>
            <h2 style={{ fontSize: 'clamp(36px, 5vw, 72px)', fontWeight: 500,
              letterSpacing: '-0.04em', lineHeight: 0.92, margin: '8px 0 0' }}>
              Eighty-one voices,<br/>three tiers, nine chapters.
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 0, border: '1px solid var(--ink)' }}>
            {[['table','ELEMENTS'],['graph','GRAPH'],['mo','M.O.'],['cast','CAST']].map(([k,l]) => (
              <button key={k} onClick={() => setView(k)} className="mono" style={{
                background: view === k ? 'var(--ink)' : 'var(--paper)',
                color: view === k ? 'var(--paper)' : 'var(--ink)',
                border: 'none',
                borderRight: k !== 'cast' ? '1px solid var(--ink)' : 'none',
                padding: '7px 12px', cursor: 'pointer', fontSize: 11,
              }}>{l}</button>
            ))}
          </div>
        </div>

        {view === 'table' ? (
          <>
            {/* Hover-to-preview strip — below title, above table, sticky on scroll */}
            <div style={{
              position: 'sticky', top: 48, zIndex: 9,
              borderTop: '1px solid var(--rule)',
              borderBottom: '1px solid var(--rule)',
              marginLeft: mob ? -16 : -24, marginRight: mob ? -16 : -24,
              marginBottom: 0,
              minHeight: 88, display: 'flex', alignItems: 'stretch',
              background: shown ? `var(${shown.group.varCSS})` : 'var(--bg)',
              transition: 'background .15s',
              boxShadow: shown ? '0 2px 12px rgba(0,0,0,0.07)' : 'none',
            }}>
              {shown ? <VoiceStrip v={shown} /> : <EmptyStrip />}
            </div>
            <HorizontalLegend active={highlightGroup} setActive={setHighlightGroup} />
            <div style={{ background: 'var(--paper)', border: '1px solid var(--rule)',
              borderTop: 'none', padding: 16 }}>
              <PeriodicTable
                layoutKey={layout}
                hover={hover} onHover={setHover}
                selected={selected}
                onSelect={(n) => {
                  setSelected(selected === n ? null : n);
                  if (n && onOpenDossier) onOpenDossier(n);
                }}
                highlightGroup={highlightGroup}
              />
            </div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--sub)',
              marginTop: 10, display: 'flex', justifyContent: 'space-between' }}>
              <span>Hover a cell for detail · Hover a tier to isolate · Click to pin</span>
              <span>{selected ? `pinned № ${String(selected).padStart(2, '0')}` : '—'}</span>
            </div>
          </>
        ) : view === 'graph' ? (
          <GraphView onOpenDossier={onOpenDossier} />
        ) : view === 'mo' ? (
          <MOTable onOpenDossier={onOpenDossier} />
        ) : (
          <CastView />
        )}
      </div>
    </div>
  );
}

// ─── Graph view ────────────────────────────────────────
// Force-directed canvas graph. Nodes = 81 voices, edges = co-citation in
// the same chapter teaser. Click nodes to build a multi-selection; sidebar
// shows the union of connections. Open profile from sidebar only.
function GraphView({ onOpenDossier }) {
  const mob = useBP() === 'mobile';
  const canvasRef    = React.useRef(null);
  const simRef       = React.useRef(null);
  const rafRef       = React.useRef(null);
  const containerRef = React.useRef(null);
  const frameRef     = React.useRef(0);
  const simReadyRef  = React.useRef(false);

  // Refs read every frame — mutating these does NOT restart the loop
  const pinnedRef  = React.useRef(new Set()); // selected node numbers
  const hoveredRef = React.useRef(null);
  const dimsRef    = React.useRef({ w: 900, h: 560 });

  // React state drives sidebar only
  const [pinnedSet, setPinnedSet] = React.useState(new Set());
  const [hoveredN,  setHoveredN]  = React.useState(null);
  const [dims, setDims] = React.useState({ w: 900, h: 560 });

  // Build edges & adjacency — memoized once
  // Co-citation: voices sharing the same chapter are co-cited.
  // Falls back to teaser cites if present, otherwise uses chapter co-membership.
  const { edges, adjMap } = React.useMemo(() => {
    const list = [];
    // Try TEASERS.cites first
    let hasCites = false;
    if (window.TEASERS) {
      Object.values(window.TEASERS).forEach(t => {
        if (!t.cites) return;
        hasCites = true;
        const ns = t.cites.map(c => c.n).filter(n => n >= 1 && n <= 81);
        for (let i = 0; i < ns.length; i++)
          for (let j = i + 1; j < ns.length; j++)
            list.push([ns[i], ns[j]]);
      });
    }
    // Fallback: co-membership in the same chapter
    if (!hasCites && window.INTERVIEWS) {
      const byChapter = {};
      window.INTERVIEWS.forEach(iv => {
        if (!byChapter[iv.ch]) byChapter[iv.ch] = [];
        byChapter[iv.ch].push(iv.n);
      });
      Object.values(byChapter).forEach(ns => {
        for (let i = 0; i < ns.length; i++)
          for (let j = i + 1; j < ns.length; j++)
            list.push([ns[i], ns[j]]);
      });
    }
    const seen = new Set();
    const edges = list.filter(([a, b]) => {
      const k = `${Math.min(a,b)}-${Math.max(a,b)}`;
      if (seen.has(k)) return false;
      seen.add(k); return true;
    });
    const adjMap = {};
    edges.forEach(([a, b]) => {
      if (!adjMap[a]) adjMap[a] = [];
      if (!adjMap[b]) adjMap[b] = [];
      adjMap[a].push(b); adjMap[b].push(a);
    });
    return { edges, adjMap };
  }, []);

  // Store edges/adj in refs so the loop can read without deps
  const edgesRef  = React.useRef(edges);
  const adjRef    = React.useRef(adjMap);
  React.useEffect(() => { edgesRef.current = edges; adjRef.current = adjMap; }, [edges, adjMap]);

  // Resize observer — on first fire, seeds the sim with real dimensions.
  // Subsequent fires just rescale the canvas without re-seeding.
  React.useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(entries => {
      const { width } = entries[0].contentRect;
      const h = Math.round(width * 0.7);
      dimsRef.current = { w: width, h };
      setDims({ w: width, h });
      if (!simReadyRef.current) {
        simReadyRef.current = true;
        const nodes = window.INTERVIEWS.map((v, i) => ({
          n: v.n, v,
          x: width/2 + (Math.random()-0.5)*width*0.55,
          y: h/2     + (Math.random()-0.5)*h*0.45,
          vx: 0, vy: 0,
          phase: (i / 81) * Math.PI * 2,
        }));
        const posById = {};
        nodes.forEach(n => { posById[n.n] = n; });
        simRef.current = { nodes, posById };
        frameRef.current = 0;
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // ── Main animation loop — runs once, NEVER restarts ──────────────
  React.useEffect(() => {
    let cancelled = false;
    const R = 13;

    const tick = () => {
      if (cancelled) return;
      rafRef.current = requestAnimationFrame(tick);

      const sim = simRef.current;
      const canvas = canvasRef.current;
      if (!sim || !canvas) return;

      const { w, h } = dimsRef.current;
      const { nodes, posById } = sim;
      const frame = ++frameRef.current;

      // ── Physics — original design constants + drift + collision ──────
      const t = frame * 0.0028; // time for drift
      // Alpha: matches design file exactly — strong settle, then very low residual
      const alpha = frame < 300 ? 0.4 : frame < 600 ? 0.1 : 0.02;
      const edges = edgesRef.current;

      // Repulsion + hard collision (never overlap)
      const MIN_DIST = R * 2 + 6;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = b.x - a.x, dy = b.y - a.y;
          const dist2 = dx*dx + dy*dy || 0.01;
          const dist  = Math.sqrt(dist2);
          // Long-range repulsion — design original: 1200/dist²
          const force = (1200 / dist2) * alpha;
          const fx = (dx/dist)*force, fy = (dy/dist)*force;
          a.vx -= fx; a.vy -= fy;
          b.vx += fx; b.vy += fy;
          // Hard collision — positional correction so nodes never overlap
          if (dist < MIN_DIST) {
            const overlap = (MIN_DIST - dist) / 2;
            const nx = dx / dist, ny = dy / dist;
            a.x -= nx * overlap; a.y -= ny * overlap;
            b.x += nx * overlap; b.y += ny * overlap;
            const relVx = b.vx - a.vx, relVy = b.vy - a.vy;
            const dot = relVx*nx + relVy*ny;
            if (dot < 0) {
              a.vx += dot * nx * 0.5; a.vy += dot * ny * 0.5;
              b.vx -= dot * nx * 0.5; b.vy -= dot * ny * 0.5;
            }
          }
        }
      }
      // Spring attraction — design original: ideal 120px, strength 0.04
      edges.forEach(([an, bn]) => {
        const a = posById[an], b = posById[bn];
        if (!a || !b) return;
        const dx = b.x-a.x, dy = b.y-a.y;
        const dist = Math.max(Math.sqrt(dx*dx+dy*dy), 1);
        const force = ((dist - 120) / dist) * 0.04 * alpha;
        a.vx += dx*force; a.vy += dy*force;
        b.vx -= dx*force; b.vy -= dy*force;
      });

      nodes.forEach(n => {
        // Centre gravity — design original: 0.002
        n.vx += (w/2 - n.x) * 0.002 * alpha;
        n.vy += (h/2 - n.y) * 0.002 * alpha;
        // Perpetual lava-lamp drift — unique per node, always alive
        const driftStr = frame > 300 ? 0.15 : 0;
        n.vx += Math.cos(t + n.phase) * driftStr;
        n.vy += Math.sin(t + n.phase * 1.3) * driftStr;
        // Damping — design original: 0.85
        n.vx *= 0.85; n.vy *= 0.85;
        const spd = Math.sqrt(n.vx*n.vx + n.vy*n.vy);
        if (spd > 12) { n.vx *= 12/spd; n.vy *= 12/spd; }
        n.x  = Math.max(R+8, Math.min(w-R-8, n.x + n.vx));
        n.y  = Math.max(R+8, Math.min(h-R-26, n.y + n.vy));
      });

      // ── Draw ──────────────────────────────────────────
      const pinneds = pinnedRef.current;
      const hovered = hoveredRef.current;
      const adj     = adjRef.current;

      const focusNs = new Set([...pinneds, ...(hovered ? [hovered] : [])]);
      const nbrs = new Set();
      focusNs.forEach(fn => { (adj[fn] || []).forEach(n => nbrs.add(n)); });
      focusNs.forEach(fn => nbrs.delete(fn));

      const hasFocus = focusNs.size > 0;

      if (canvas.width !== Math.round(w)) canvas.width = Math.round(w);
      if (canvas.height !== Math.round(h)) canvas.height = Math.round(h);

      const ctx = canvas.getContext('2d');
      const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#fafaf9';
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Edges
      edgesRef.current.forEach(([an, bn]) => {
        const a = posById[an], b = posById[bn];
        if (!a || !b) return;
        const aPinned = pinneds.has(an) || an === hovered;
        const bPinned = pinneds.has(bn) || bn === hovered;
        const isActive = aPinned || bPinned;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = isActive ? 'rgba(210,35,35,0.75)' : 'rgba(0,0,0,0.055)';
        ctx.lineWidth   = isActive ? 1.5 : 0.7;
        ctx.stroke();
      });

      // Nodes
      nodes.forEach(n => {
        const isPinned  = pinneds.has(n.n);
        const isHovered = n.n === hovered;
        const isNbr     = nbrs.has(n.n);
        const isDim     = hasFocus && !isPinned && !isHovered && !isNbr;
        const tier      = n.v.tier;

        const baseA = tier === 'A' ? [100,140,220] : tier === 'P' ? [210,110,70] : [80,170,110];
        const [r,g,b] = baseA;

        const fill = isDim
          ? `rgba(${r},${g},${b},0.12)`
          : (isPinned || isHovered)
          ? `rgb(${Math.round(r*0.6)},${Math.round(g*0.6)},${Math.round(b*0.6)})`
          : isNbr
          ? `rgba(${r},${g},${b},0.88)`
          : `rgba(${r},${g},${b},0.65)`;

        const radius = isPinned ? R+5 : isHovered ? R+3 : isNbr ? R+1 : R-2;

        ctx.beginPath();
        ctx.arc(n.x, n.y, radius, 0, Math.PI*2);
        ctx.fillStyle = fill;
        ctx.fill();

        if (isPinned) {
          ctx.strokeStyle = 'rgba(200,30,30,0.85)';
          ctx.lineWidth = 2;
          ctx.stroke();
        } else if (isHovered) {
          ctx.strokeStyle = 'rgba(0,0,0,0.4)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        const showLabel = isPinned || isHovered || isNbr || !hasFocus;
        if (showLabel && !isDim) {
          const label = n.v.name.split(' ').pop();
          ctx.fillStyle = (isPinned || isHovered) ? 'rgba(180,20,20,0.9)' : 'rgba(0,0,0,0.6)';
          ctx.font = (isPinned || isHovered)
            ? '600 10px "JetBrains Mono", monospace'
            : '9px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText(label, n.x, n.y + radius + 11);
        }
      });
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { cancelled = true; cancelAnimationFrame(rafRef.current); };
  }, []);

  // Mouse hit test
  const handleMouse = React.useCallback((e, click) => {
    const canvas = canvasRef.current;
    if (!canvas || !simRef.current) return;
    const rect = canvas.getBoundingClientRect();
    const { w, h } = dimsRef.current;
    const mx = (e.clientX - rect.left) * (w / rect.width);
    const my = (e.clientY - rect.top)  * (h / rect.height);
    const HIT_R = 20;
    let hit = null;
    simRef.current.nodes.forEach(n => {
      const dx = n.x-mx, dy = n.y-my;
      if (dx*dx+dy*dy < HIT_R*HIT_R) hit = n.n;
    });

    if (click) {
      if (hit !== null) {
        const next = new Set(pinnedRef.current);
        if (next.has(hit)) next.delete(hit); else next.add(hit);
        pinnedRef.current = next;
        setPinnedSet(new Set(next));
      }
    } else {
      hoveredRef.current = hit;
      setHoveredN(hit);
    }
    if (canvas) canvas.style.cursor = hit ? 'pointer' : 'default';
  }, []);

  const handleTouch = React.useCallback((e, type) => {
    const touch = e.touches[0] || e.changedTouches[0];
    if (!touch) return;
    e.preventDefault();
    handleMouse({ clientX: touch.clientX, clientY: touch.clientY }, type === 'end');
  }, [handleMouse]);

  // Sidebar data
  const pinnedVoices = [...pinnedSet].map(n => window.INTERVIEWS[n-1]).filter(Boolean);
  const connectedNs  = new Set();
  pinnedSet.forEach(fn => { (adjMap[fn] || []).forEach(n => { if (!pinnedSet.has(n)) connectedNs.add(n); }); });
  if (hoveredN && !pinnedSet.has(hoveredN)) {
    (adjMap[hoveredN] || []).forEach(n => { if (!pinnedSet.has(n)) connectedNs.add(n); });
  }
  const connectedVoices = [...connectedNs].map(n => window.INTERVIEWS[n-1]).filter(Boolean)
    .sort((a,b) => a.n - b.n);

  const anyFocus = pinnedSet.size > 0 || hoveredN;
  const hoverVoice = hoveredN ? window.INTERVIEWS[hoveredN-1] : null;
  const tierLabel = t => t === 'A' ? 'ACADEMIC' : t === 'P' ? 'PRACTITIONER' : 'VISIONARY';

  return (
    <div>
      {/* Legend + hint */}
      <div className="mono" style={{ fontSize: 10, color: 'var(--sub)',
        marginBottom: 12, display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        {[['A','rgba(100,140,220,0.7)','ACADEMIC'],['P','rgba(210,110,70,0.7)','PRACTITIONER'],['V','rgba(80,170,110,0.7)','VISIONARY']].map(([t,c,l]) => (
          <span key={t} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: c, display: 'inline-block' }} />
            {l}
          </span>
        ))}
        <span style={{ marginLeft: 'auto', color: 'var(--sub2)' }}>
          {pinnedSet.size > 0
            ? `${pinnedSet.size} selected · ${connectedNs.size} connections · click graph to add/remove`
            : 'Click nodes to select · build connections in sidebar'}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 280px', border: '1px solid var(--rule)' }}>
        {/* Canvas */}
        <div ref={containerRef} style={{ background: 'var(--bg)', position: 'relative', borderRight: mob ? 'none' : '1px solid var(--rule)', borderBottom: mob ? '1px solid var(--rule)' : 'none' }}>
          <canvas ref={canvasRef} width={dims.w} height={dims.h}
            style={{ width: '100%', height: 'auto', display: 'block', touchAction: 'none' }}
            onMouseMove={e => handleMouse(e, false)}
            onMouseLeave={() => { hoveredRef.current = null; setHoveredN(null); }}
            onClick={e => handleMouse(e, true)}
            onTouchMove={e => handleTouch(e, 'move')}
            onTouchEnd={e => handleTouch(e, 'end')} />
        </div>

        {/* Right panel */}
        <div style={{ background: 'var(--paper)', display: 'flex', flexDirection: 'column',
          minHeight: mob ? 0 : 400, overflow: 'hidden' }}>

          {/* Selected section */}
          <div style={{ borderBottom: '1px solid var(--rule)', padding: '14px 16px' }}>
            <div className="mono" style={{ fontSize: 9, letterSpacing: '0.06em',
              color: 'var(--sub)', marginBottom: pinnedVoices.length ? 10 : 0 }}>
              SELECTED · {pinnedVoices.length}
            </div>
            {pinnedVoices.length === 0 && (
              <div style={{ fontSize: 12, color: 'var(--sub2)', lineHeight: 1.6, marginTop: 6 }}>
                {hoverVoice
                  ? <><strong style={{ color: 'var(--ink)', fontSize: 13 }}>{hoverVoice.name}</strong><br/>
                      <span className="mono" style={{ fontSize: 9, color: 'var(--sub)' }}>{tierLabel(hoverVoice.tier)} · ch{hoverVoice.ch}</span><br/>
                      <span style={{ color: 'var(--sub2)', fontSize: 11 }}>Click to select</span></>
                  : 'Click any node in the graph to select it.'}
              </div>
            )}
            {pinnedVoices.map(v => (
              <div key={v.n} style={{ display: 'flex', alignItems: 'center', gap: 8,
                marginBottom: 6, justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', minWidth: 0 }}>
                  <span className="mono" style={{ fontSize: 8, color: 'var(--paper)',
                    background: 'rgba(200,30,30,0.85)', padding: '2px 4px', flexShrink: 0 }}>
                    {String(v.n).padStart(2,'0')}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: '-0.01em',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {v.name}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  <button onClick={() => onOpenDossier && onOpenDossier(v.n)}
                    className="mono" style={{ fontSize: 8, padding: '3px 6px',
                      background: 'var(--ink)', color: 'var(--paper)',
                      border: 'none', cursor: 'pointer', letterSpacing: '0.04em' }}>
                    PROFILE
                  </button>
                  <button onClick={() => {
                      const next = new Set(pinnedRef.current);
                      next.delete(v.n);
                      pinnedRef.current = next;
                      setPinnedSet(new Set(next));
                    }}
                    className="mono" style={{ fontSize: 8, padding: '3px 5px',
                      background: 'transparent', color: 'var(--sub)',
                      border: '1px solid var(--rule)', cursor: 'pointer' }}>
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Connections section */}
          <div style={{ flex: 1, overflow: 'auto', padding: '14px 16px' }}>
            <div className="mono" style={{ fontSize: 9, letterSpacing: '0.06em',
              color: 'var(--sub)', marginBottom: 10 }}>
              {anyFocus ? `CONNECTIONS · ${connectedVoices.length}` : 'CONNECTIONS'}
            </div>
            {!anyFocus && (
              <div style={{ fontSize: 11, color: 'var(--sub2)', lineHeight: 1.6 }}>
                Select a node to see who they're co-cited with across the 9 chapters.
              </div>
            )}
            {connectedVoices.map(v => (
              <div key={v.n} style={{ borderTop: '1px solid var(--rule)',
                padding: '8px 0', display: 'flex', alignItems: 'center',
                gap: 8, justifyContent: 'space-between' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 7, alignItems: 'baseline' }}>
                    <span className="mono" style={{ fontSize: 8, color: 'var(--sub)', flexShrink: 0 }}>
                      {String(v.n).padStart(2,'0')}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                      {v.name}
                    </span>
                  </div>
                  <div className="mono" style={{ fontSize: 9, color: 'var(--sub)', marginTop: 2 }}>
                    {tierLabel(v.tier)} · ch{v.ch}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  <button onClick={() => {
                      const next = new Set(pinnedRef.current);
                      next.add(v.n);
                      pinnedRef.current = next;
                      setPinnedSet(new Set(next));
                    }}
                    className="mono" style={{ fontSize: 8, padding: '3px 5px',
                      background: 'transparent', color: 'var(--sub)',
                      border: '1px solid var(--rule)', cursor: 'pointer', letterSpacing: '0.04em' }}>
                    +
                  </button>
                  <button onClick={() => onOpenDossier && onOpenDossier(v.n)}
                    className="mono" style={{ fontSize: 8, padding: '3px 6px',
                      background: 'var(--ink)', color: 'var(--paper)',
                      border: 'none', cursor: 'pointer', letterSpacing: '0.04em' }}>
                    PROFILE
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
// ─── Table of M.O. ────────────────────────────────────
// 26 classifiers × voice slots. Toggle: ALL CLASSIFIERS / PRIME PAIRS.
function MOTable({ onOpenDossier }) {
  const mob = useBP() === 'mobile';
  const [mode, setMode] = React.useState('all');   // 'all' | 'prime'
  const [expandedC, setExpanded] = React.useState(null);

  // Build index once
  const idx = React.useMemo(() => window.buildMOIndex(), []);

  // Sort classifiers by number of voices (descending)
  const classifiers = React.useMemo(() => {
    return Object.entries(idx)
      .map(([name, ns]) => ({ name, ns, count: ns.length }))
      .sort((a, b) => b.count - a.count);
  }, [idx]);

  // Prime pairs: classifiers where exactly 2 voices appear (or expand to show pairs)
  const primePairs = React.useMemo(() => {
    // Find all pairs of voices that share multiple classifiers
    const pairs = {};
    classifiers.forEach(({ name, ns }) => {
      for (let i = 0; i < ns.length; i++) {
        for (let j = i + 1; j < ns.length; j++) {
          const key = `${Math.min(ns[i], ns[j])}-${Math.max(ns[i], ns[j])}`;
          if (!pairs[key]) pairs[key] = { a: ns[i], b: ns[j], shared: [] };
          pairs[key].shared.push(name);
        }
      }
    });
    return Object.values(pairs)
      .filter(p => p.shared.length >= 2)
      .sort((a, b) => b.shared.length - a.shared.length);
  }, [classifiers]);

  const totalSlots = classifiers.reduce((s, c) => s + c.count, 0);

  return (
    <div>
      {/* Header bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: mob ? 'flex-start' : 'center',
        flexDirection: mob ? 'column' : 'row',
        gap: mob ? 10 : 0,
        padding: '14px 0', marginBottom: 16,
        borderBottom: '1px solid var(--ink)',
      }}>
        <div>
          <span className="mono" style={{ fontSize: 11, color: 'var(--ink)',
            letterSpacing: '-0.005em', fontWeight: 500 }}>
            TABLE OF M.O.
          </span>
          <span className="mono" style={{ fontSize: 10, color: 'var(--sub)',
            marginLeft: mob ? 10 : 16 }}>
            {classifiers.length} CL · {totalSlots} SLOTS
          </span>
        </div>
        <div style={{ display: 'flex', gap: 0, border: '1px solid var(--ink)' }}>
          {[['all', mob ? 'ALL' : 'ALL CLASSIFIERS'], ['prime', mob ? 'PRIME' : 'PRIME PAIRS']].map(([k, l]) => (
            <button key={k} onClick={() => setMode(k)} className="mono" style={{
              background: mode === k ? 'var(--ink)' : 'transparent',
              color: mode === k ? 'var(--paper)' : 'var(--ink)',
              border: 'none', borderRight: k === 'all' ? '1px solid var(--ink)' : 'none',
              padding: '8px 14px', cursor: 'pointer', fontSize: 10,
              letterSpacing: '0.02em',
            }}>{l}</button>
          ))}
        </div>
      </div>

      {mode === 'all' ? (
        /* ── All classifiers list ── */
        <div>
          {classifiers.map(({ name, ns, count }) => {
            const isOpen = expandedC === name;
            return (
              <div key={name} style={{ borderBottom: '1px solid var(--rule)' }}>
                <div
                  onClick={() => setExpanded(isOpen ? null : name)}
                  style={{ padding: mob ? '10px 0' : '12px 0', cursor: 'pointer' }}
                >
                  {mob ? (
                    /* Mobile: left col (name + chips), badge vertically centred on right */
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ fontSize: 14, letterSpacing: '-0.01em',
                          fontWeight: isOpen ? 500 : 400, lineHeight: 1.2,
                          display: 'block', marginBottom: 7 }}>{name}</span>
                        <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                          {ns.map(n => {
                            const iv = window.INTERVIEWS[n - 1];
                            return (
                              <button key={n}
                                onClick={e => { e.stopPropagation(); onOpenDossier && onOpenDossier(n); }}
                                className="mono" style={{
                                  background: 'none',
                                  border: `1px solid var(${iv.group.ink})`,
                                  color: `var(${iv.group.ink})`,
                                  padding: '2px 5px', fontSize: 9, cursor: 'pointer',
                                  letterSpacing: '-0.005em', whiteSpace: 'nowrap',
                                }}>
                                {String(n).padStart(2,'0')}·{iv.tier}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <span className="mono" style={{
                        fontSize: 11, color: 'var(--paper)', flexShrink: 0,
                        background: count >= 8 ? 'var(--accent)' : 'var(--sub)',
                        padding: '3px 8px', minWidth: 28, textAlign: 'center',
                      }}>+{count}</span>
                    </div>
                  ) : (
                    <div style={{
                      display: 'grid', gridTemplateColumns: '20px 1fr auto auto',
                      gap: 16, alignItems: 'center',
                    }}>
                      <span className="mono" style={{ fontSize: 9, color: 'var(--sub2)' }}>—</span>
                      <span style={{ fontSize: 14, letterSpacing: '-0.01em',
                        fontWeight: isOpen ? 500 : 400 }}>{name}</span>
                      <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap',
                        justifyContent: 'flex-end', maxWidth: 400 }}>
                        {ns.slice(0, 8).map(n => {
                          const iv = window.INTERVIEWS[n - 1];
                          return (
                            <button key={n}
                              onClick={e => { e.stopPropagation(); onOpenDossier && onOpenDossier(n); }}
                              className="mono" style={{
                                background: 'none',
                                border: `1px solid var(${iv.group.ink})`,
                                color: `var(${iv.group.ink})`,
                                padding: '2px 5px', fontSize: 9, cursor: 'pointer',
                                letterSpacing: '-0.005em', whiteSpace: 'nowrap',
                              }}>
                              {String(n).padStart(2,'0')}·{iv.tier}
                            </button>
                          );
                        })}
                        {ns.length > 8 && (
                          <span className="mono" style={{
                            fontSize: 9, color: 'var(--paper)',
                            background: 'var(--accent)', padding: '2px 6px', fontWeight: 600,
                          }}>+{ns.length - 8}</span>
                        )}
                      </div>
                      <span className="mono" style={{
                        fontSize: 11, color: 'var(--paper)',
                        background: count >= 8 ? 'var(--accent)' : 'var(--sub)',
                        padding: '3px 8px', minWidth: 28, textAlign: 'center',
                      }}>+{count}</span>
                    </div>
                  )}
                </div>
                {/* Expanded: show all voices with names */}
                {isOpen && (
                  <div style={{ padding: '8px 0 20px 36px', borderTop: '1px solid var(--rule)' }}>
                    <div className="mono" style={{ fontSize: 9, color: 'var(--sub)',
                      letterSpacing: '0.04em', marginBottom: 10 }}>
                      {count} VOICES SHARE THIS CLASSIFIER
                    </div>
                    <div style={{ display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                      gap: 6 }}>
                      {ns.map(n => {
                        const iv = window.INTERVIEWS[n - 1];
                        return (
                          <button key={n}
                            onClick={() => onOpenDossier && onOpenDossier(n)}
                            style={{
                              background: `var(${iv.group.varCSS})`,
                              border: `1px solid var(${iv.group.ink})`,
                              padding: '8px 10px', cursor: 'pointer',
                              textAlign: 'left', fontFamily: 'inherit',
                              display: 'flex', gap: 8, alignItems: 'baseline',
                            }}>
                            <span className="mono" style={{ fontSize: 9,
                              color: `var(${iv.group.ink})` }}>
                              {String(n).padStart(2,'0')}
                            </span>
                            <span style={{ fontSize: 12, fontWeight: 500,
                              letterSpacing: '-0.01em' }}>{iv.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          <div className="mono" style={{ fontSize: 10, color: 'var(--sub)',
            padding: '16px 0', textAlign: 'right' }}>
            {classifiers.length} CLASSIFIERS · {totalSlots} OPERATIVE SLOTS
          </div>
        </div>
      ) : (
        /* ── Prime pairs ── */
        <div>
          <div style={{ marginBottom: 20, padding: '14px 16px',
            background: 'var(--ink)', color: 'var(--paper)' }}>
            <div className="mono" style={{ fontSize: 10,
              color: 'oklch(0.65 0.1 250)', marginBottom: 8 }}>
              PRIME PAIRS — THE TWIN PRIMES OF KNOWWARE
            </div>
            <div style={{ fontSize: 17, letterSpacing: '-0.015em',
              lineHeight: 1.4, maxWidth: '72ch' }}>
              None of these interviews happened — but they did. These are the
              digital twins: voices from different fields whose knowledge
              coordinates so precisely they could only have been assembled
              by the same intelligence that assembled the rest.
            </div>
            <div className="mono" style={{ fontSize: 10,
              color: 'oklch(0.65 0.1 250)', marginTop: 10 }}>
              {primePairs.length} PRIME PAIRS IDENTIFIED · SORTED BY SHARED CLASSIFIER COUNT
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {primePairs.slice(0, 40).map((p, i) => {
              const a = window.INTERVIEWS[p.a - 1];
              const b = window.INTERVIEWS[p.b - 1];
              return (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: mob ? '1fr auto 1fr' : '32px 1fr auto 1fr auto',
                  gap: mob ? 8 : 12, padding: '12px 0',
                  borderBottom: '1px solid var(--rule)',
                  alignItems: 'center',
                }}>
                  {!mob && <span className="mono" style={{ fontSize: 10,
                    color: 'var(--sub2)' }}>{String(i + 1).padStart(2,'0')}</span>}
                  <button onClick={() => onOpenDossier && onOpenDossier(p.a)}
                    style={{ background: `var(${a.group.varCSS})`,
                      border: `1px solid var(${a.group.ink})`,
                      padding: mob ? '6px 8px' : '8px 12px', cursor: 'pointer',
                      textAlign: 'left', fontFamily: 'inherit', minWidth: 0 }}>
                    <div className="mono" style={{ fontSize: 9,
                      color: `var(${a.group.ink})` }}>
                      {String(p.a).padStart(2,'0')}·{a.tier}
                    </div>
                    <div style={{ fontSize: mob ? 11 : 13, fontWeight: 500,
                      letterSpacing: '-0.01em', marginTop: 2,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</div>
                    {!mob && <div className="mono" style={{ fontSize: 9,
                      color: 'var(--sub)', marginTop: 2 }}>{a.affiliation}</div>}
                  </button>
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontSize: mob ? 14 : 18, color: 'var(--accent)' }}>⟷</div>
                    <div className="mono" style={{ fontSize: 9,
                      color: 'var(--accent)', marginTop: 2 }}>
                      {p.shared.length}
                    </div>
                  </div>
                  <button onClick={() => onOpenDossier && onOpenDossier(p.b)}
                    style={{ background: `var(${b.group.varCSS})`,
                      border: `1px solid var(${b.group.ink})`,
                      padding: mob ? '6px 8px' : '8px 12px', cursor: 'pointer',
                      textAlign: 'left', fontFamily: 'inherit', minWidth: 0 }}>
                    <div className="mono" style={{ fontSize: 9,
                      color: `var(${b.group.ink})` }}>
                      {String(p.b).padStart(2,'0')}·{b.tier}
                    </div>
                    <div style={{ fontSize: mob ? 11 : 13, fontWeight: 500,
                      letterSpacing: '-0.01em', marginTop: 2,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.name}</div>
                    {!mob && <div className="mono" style={{ fontSize: 9,
                      color: 'var(--sub)', marginTop: 2 }}>{b.affiliation}</div>}
                  </button>
                  {!mob && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4,
                    maxWidth: 200, justifyContent: 'flex-end' }}>
                    {p.shared.slice(0, 3).map((c, ci) => (
                      <span key={ci} className="mono" style={{
                        fontSize: 8, color: 'var(--sub)',
                        border: '1px solid var(--rule)',
                        padding: '2px 6px', lineHeight: 1.4,
                      }}>{c}</span>
                    ))}
                    {p.shared.length > 3 && (
                      <span className="mono" style={{ fontSize: 8,
                        color: 'var(--accent)' }}>+{p.shared.length - 3}</span>
                    )}
                  </div>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyStrip() {
  const mob = useBP() === 'mobile';
  return (
    <div style={{ display: 'grid',
      gridTemplateColumns: mob ? '1fr auto' : '200px 1fr auto', gap: mob ? 12 : 20, alignItems: 'center',
      width: '100%', padding: mob ? '12px 16px' : '16px 20px' }}>
      {!mob && <div className="mono" style={{ fontSize: 10, color: 'var(--sub2)',
        letterSpacing: '-0.005em' }}>HOVER TO PREVIEW</div>}
      <div style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.4 }}>
        {mob ? 'Tap any cell to open a dossier.' : 'Each cell is one of the eighty-one interviews. Colour marks the tier — blue for academics, terracotta for practitioners, sage for visionaries.'}
      </div>
      <div className="mono" style={{ fontSize: 10, color: 'var(--sub2)', flexShrink: 0 }}>
        81 · 09 · 03
      </div>
    </div>
  );
}

function VoiceStrip({ v }) {
  const bp = useBP();
  const mob = bp === 'mobile';
  const ch = window.CHAPTERS.find(c => c.n === v.ch);
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: mob ? '56px 1fr auto' : '96px 220px 1fr auto',
      gap: mob ? 10 : 20, alignItems: 'center', width: '100%',
      padding: mob ? '10px 16px' : '14px 20px',
      color: `var(${v.group.ink})`,
      overflow: 'hidden',
    }}>
      <div style={{ fontSize: mob ? 40 : 68, fontWeight: 500, letterSpacing: '-0.05em',
        lineHeight: 0.9, color: 'var(--ink)' }}>{v.sym}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
        <div className="mono" style={{ fontSize: 10, opacity: 0.85 }}>
          № {String(v.n).padStart(2, '0')} · Tier {v.tier} · {v.minutes}m
        </div>
        <div style={{ fontSize: mob ? 14 : 18, fontWeight: 500, letterSpacing: '-0.015em',
          color: 'var(--ink)', lineHeight: 1.15,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.name}</div>
        {!mob && (
          <div className="mono" style={{ fontSize: 11, opacity: 0.8, lineHeight: 1.3 }}>
            {v.affiliation}
          </div>
        )}
      </div>
      {!mob && (
        <div style={{ fontSize: 15, lineHeight: 1.45, color: 'var(--ink)',
          letterSpacing: '-0.01em', maxWidth: '72ch' }}>
          <span style={{ fontStyle: 'italic' }}>"{v.themes[0]}"</span> as inherited relationship — not a resource but a responsibility.
          <span className="mono" style={{
            fontSize: 10, opacity: 0.7, marginLeft: 8 }}>
            — {v.group.name}
          </span>
        </div>
      )}
      <div className="mono" style={{ fontSize: 10, opacity: 0.8,
        textAlign: 'right', lineHeight: 1.5 }}>
        ch{v.ch}<br/>
        {ch ? ch.title.split(' ').slice(0, 3).join(' ') : ''}
      </div>
    </div>
  );
}

function HorizontalLegend({ active, setActive }) {
  const mob = useBP() === 'mobile';
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
            onClick={() => setActive(isActive ? null : g.id)}
            style={{
              background: isActive ? `var(${g.varCSS})` : 'var(--paper)',
              borderRight: i < window.GROUPS.length - 1 ? '1px solid var(--rule)' : 'none',
              borderTop: `4px solid var(${g.varCSS})`,
              borderBottom: 'none', borderLeft: 'none',
              padding: mob ? '10px 10px 8px' : '14px 18px 12px', cursor: 'pointer', textAlign: 'left',
              fontFamily: 'inherit', display: 'flex', flexDirection: 'column',
              gap: mob ? 4 : 6, transition: 'background .15s', minWidth: 0,
            }}>
            <div className="mono" style={{ fontSize: mob ? 9 : 11,
              color: `var(${g.ink})`, letterSpacing: '-0.005em',
              display: 'flex', justifyContent: 'space-between' }}>
              <span>Tier {g.key}</span>
              <span style={{ color: 'var(--sub)' }}>{String(count).padStart(2, '0')}</span>
            </div>
            <div style={{ fontSize: mob ? 14 : 18, letterSpacing: '-0.015em',
              color: 'var(--ink)', fontWeight: 500 }}>
              {g.name}
            </div>
            {!mob && <div style={{ fontSize: 12, color: 'var(--sub)', lineHeight: 1.4 }}>
              {g.blurb}
            </div>}
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

const CHAPTER_STATS = {
  '01': [
    { label: 'USERS OBSERVED',    value: '689,003' },
    { label: 'INSTITUTIONS',      value: '3'       },
    { label: 'YEAR',              value: '2014'    },
  ],
  '02': [
    { label: 'BODIES COORDINATED', value: '3'      },
    { label: 'MARKET POSITION',    value: '#1'     },
    { label: 'YEAR',               value: '2007'   },
  ],
  '03': [
    { label: 'LIVING BUILDING',   value: '1'       },
    { label: 'SENSOR TYPES',      value: '3'       },
    { label: 'YEAR',              value: '2014'    },
  ],
  '04': [
    { label: 'HOMICIDE REDUCTION', value: '70%'   },
    { label: 'CITY POPULATION',   value: '6M'      },
    { label: 'YEAR',              value: '1998'    },
  ],
  '05': [
    { label: 'RESTORED MOVEMENT', value: '1 HAND' },
    { label: 'SIGNAL LATENCY',    value: '<100ms'  },
    { label: 'YEAR',              value: '2020'    },
  ],
  '06': [
    { label: 'SECONDS DELAYED',   value: '6'       },
    { label: 'CLASSIFICATIONS',   value: '4'       },
    { label: 'YEAR',              value: '2018'    },
  ],
  '07': [
    { label: 'WEIGHT REDUCTION',  value: '45%'     },
    { label: 'DESIGN ITERATIONS', value: '1,000+'  },
    { label: 'YEAR',              value: '2019'    },
  ],
  '08': [
    { label: 'BODIES IN ORBIT',   value: '3'       },
    { label: 'FORECAST HORIZON',  value: '100 yrs' },
    { label: 'SCALE',             value: '∞'       },
  ],
  '09': [
    { label: 'AI ACCURACY',       value: '95%'     },
    { label: 'YEARS TO DESKILL',  value: '2'       },
    { label: 'YEAR',              value: '2016'    },
  ],
  'X': [
    { label: 'VOICES',            value: '81'      },
    { label: 'CHAPTERS',          value: '9'       },
    { label: 'PATTERN',           value: '1'       },
  ],
};

const SCENE_META = {
  '01': { date: 'JUNE 2014',   year: '2014', sources: ['FACEBOOK', 'CORNELL', 'UCSF'] },
  '02': { date: '2007–2015',   year: '2007', sources: ['NETFLIX', 'AMAZON', 'TOYOTA'] },
  '03': { date: '2014',        year: '2014', sources: ['IAAC', 'BARCELONA'] },
  '04': { date: '1998–2007',   year: '1998', sources: ['BOGOTÁ', 'MOCKUS'] },
  '05': { date: '2020',        year: '2020', sources: ['BATTELLE', 'OHIO STATE', 'NIH'] },
  '06': { date: 'OCT 2018',    year: '2018', sources: ['UBER', 'TEMPE AZ', 'NTSB'] },
  '07': { date: '2019',        year: '2019', sources: ['AUTODESK', 'AIRBUS'] },
  '08': { date: 'UNIVERSAL',   year: '∞',    sources: ['NEWTON', 'LAPLACE', 'POINCARÉ'] },
  '09': { date: '2016–2018',   year: '2016', sources: ['STANFORD', 'RADIOLOGY AI'] },
  'X':  { date: 'NOW',         year: 'NOW',  sources: ['KNOWWARE'] },
};

// ─── Read (v2) ─────────────────────────────────────────
// Two-column with live section rail, running page number, inline footnotes,
// marginal citations pulling from the 81.
function Read({ onOpenReader }) {
  const bp = useBP();
  const mob = bp === 'mobile';
  const tab = bp === 'tablet';
  const [active, setActive] = React.useState(1);
  const [openNote, setOpenNote] = React.useState(null);
  const s = window.SECTIONS[active];
  const pageBase = 18 + active * 28;
  // Pull the specifically-cited voices for this chapter from TEASERS.
  const teaser = (window.TEASERS && window.TEASERS[s.n]) || null;
  const citedNums = (teaser && teaser.cites) ? teaser.cites.map(c => c.n) : [];
  const citedAll = citedNums.map(n => window.INTERVIEWS.find(v => v.n === n)).filter(Boolean);
  const cited = citedAll.slice(0, 4);

  const gridCols = mob ? '1fr' : tab ? '220px 1fr' : '260px 1fr auto';

  return (
    <div>
      {/* Reading chrome — page position + running head */}
      <div style={{
        borderBottom: '1px solid var(--rule)',
        padding: mob ? '8px 16px' : '10px 24px',
        display: 'grid',
        gridTemplateColumns: mob ? '1fr 1fr' : '1fr 1fr 1fr',
        alignItems: 'center', gap: 8,
      }}>
        <div className="mono" style={{ fontSize: 10, color: 'var(--sub)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          ch{s.n} · {s.title.toUpperCase()}
        </div>
        {!mob && (
          <div className="mono" style={{ fontSize: 11, color: 'var(--sub)',
            textAlign: 'center' }}>
            {s.part.toUpperCase()}
          </div>
        )}
        <div className="mono" style={{ fontSize: 10, color: 'var(--sub)',
          textAlign: 'right' }}>
          pp. {pageBase}–{pageBase + 27}
        </div>
      </div>

      {/* Manuscript thesis band */}
      <div style={{
        padding: mob ? '28px 16px' : '36px 48px',
        background: 'var(--ink)', color: 'var(--paper)',
        borderBottom: '1px solid var(--rule)',
      }}>
        <p style={{
          margin: 0,
          fontSize: mob ? 'clamp(22px, 6vw, 30px)' : 'clamp(28px, 3vw, 42px)',
          lineHeight: 1.1, letterSpacing: '-0.03em', fontWeight: 500,
        }}>
          The universe runs on three.
          <br />
          <span style={{ fontWeight: 400, color: 'var(--sub)' }}>
            You've been working with two.
          </span>
        </p>
      </div>

      {/* Mobile chapter picker */}
      {mob && (
        <div style={{ borderBottom: '1px solid var(--rule)', padding: '10px 16px' }}>
          <select value={active} onChange={e => setActive(Number(e.target.value))}
            style={{
              width: '100%', padding: '8px 32px 8px 10px',
              border: '1px solid var(--ink)', background: 'var(--paper)',
              fontFamily: 'inherit', fontSize: 13, color: 'var(--ink)',
              cursor: 'pointer', appearance: 'none',
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%230a0a0a' stroke-width='1.5' fill='none'/%3E%3C/svg%3E\")",
              backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
            }}>
            {window.SECTIONS.map((row, i) => (
              <option key={row.n} value={i}>ch{row.n} · {row.title}</option>
            ))}
          </select>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: gridCols,
        minHeight: 'calc(100vh - 240px)',
        borderBottom: '1px solid var(--rule)',
        overflow: 'hidden',
      }}>
        {/* LEFT RAIL — TOC (tablet + desktop) */}
        {!mob && (
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
                      display: 'grid', gridTemplateColumns: tab ? '28px 1fr' : '28px 1fr auto', gap: 6,
                      fontFamily: 'inherit', fontSize: tab ? 12 : 13,
                      letterSpacing: '-0.005em', alignItems: 'baseline',
                    }}>
                      <span className="mono" style={{ fontSize: 10,
                        color: isActive ? 'var(--accent-soft)' : 'var(--sub)' }}>
                        ch{row.n}
                      </span>
                      <span>{row.title}</span>
                      {!tab && (
                        <span className="mono" style={{ fontSize: 9,
                          color: isActive ? 'var(--accent-soft)' : 'var(--sub2)' }}>
                          {18 + i * 28}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ol>
          </aside>
        )}

        {/* CENTER — reading column */}
        <article data-kw-read style={{
          padding: 0,
          maxWidth: 'var(--read-col, 760px)',
          minWidth: 0, position: 'relative', overflow: 'hidden',
        }}>
          <ChapterTeaser
            chapter={s.n}
            section={s}
            cited={cited[0]}
            openNote={openNote}
            setOpenNote={setOpenNote}
            onOpenReader={onOpenReader}
          />
        </article>

        {/* RIGHT RAIL — collapsible drawer */}
        <ReaderDrawer chapter={s.n} cited={cited} />
      </div>

      {/* ── Full-width synthesis band ── */}
      {(() => {
        const SYNTHESIS_QUOTES = {
          '01': "Intelligence doesn't live in humans or machines. It emerges in the coordination between them.",
          '02': "Binary logic was always an approximation. Reality coordinates.",
          '03': "The architecture of intelligence is the architecture of life.",
          '04': "Three-body coordination is not just how systems work, but how they heal.",
          '05': "The boundary between human and machine is already dissolving. The question is how to coordinate the crossing.",
          '06': "Awareness is not a luxury upgrade bolted onto intelligence. It is the coordination layer without which perception and processing cycle in the dark.",
          '07': "Three-body coordination doesn't just improve engineering — it transcends the design space itself.",
          '08': "Scale coordination to the cosmos and new bodies of intelligence appear.",
          '09': "Optimizing capability without coordinating with context is the pattern of civilizational failure.",
          'X':  "Nine chapters. Eighty-one voices. One pattern — now visible.",
        };
        const prev = active > 0 ? window.SECTIONS[active - 1] : null;
        const next = active < window.SECTIONS.length - 1 ? window.SECTIONS[active + 1] : null;
        const interviewCount = window.INTERVIEWS.filter(v => v.ch === s.n).length;
        const diagram = window.TEASERS && window.TEASERS[s.n] && window.TEASERS[s.n].diagram;
        const synthQuote = SYNTHESIS_QUOTES[s.n] || '';
        return (
          <>
            {/* Dark synthesis block — diagram + synthesis share one ink background */}
            <div style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
            {diagram && (
              <CoordinatesSection
                diagram={diagram}
                noBg
                style={{ padding: mob ? '32px 20px 28px' : '48px 64px 40px' }}
              />
            )}
            <div style={{
              padding: mob ? '28px 20px 32px' : '40px 64px 56px',
              borderTop: diagram ? '1px solid oklch(0.22 0.04 250)' : 'none',
            }}>
              <div className="mono" style={{ fontSize: 10, color: 'var(--accent)',
                letterSpacing: '0.08em', marginBottom: 20 }}>
                THE SYNTHESIS
              </div>
              <p style={{
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: mob ? 22 : 30, lineHeight: 1.3,
                letterSpacing: '-0.02em', margin: '0 0 36px',
                fontStyle: 'italic', maxWidth: '32ch',
              }}>
                "{synthQuote}"
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <a href="Contribute.html" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  background: 'var(--accent)', color: '#fff',
                  padding: mob ? '11px 16px' : '13px 20px', textDecoration: 'none',
                  fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                  fontSize: 11, letterSpacing: '0.04em',
                }}>→ READ FULL CHAPTER</a>
                <button onClick={() => onOpenReader && onOpenReader(s.n)} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'none', color: 'var(--paper)',
                  padding: mob ? '11px 14px' : '13px 16px', cursor: 'pointer',
                  fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                  fontSize: 11, border: '1px solid rgba(240,240,234,0.25)',
                  letterSpacing: '0.02em',
                }}>↗ {interviewCount} INTERVIEWS</button>
                <a href="Contribute.html" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'none', color: 'var(--paper)', textDecoration: 'none',
                  padding: mob ? '11px 14px' : '13px 16px',
                  fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                  fontSize: 11, border: '1px solid rgba(240,240,234,0.25)',
                  letterSpacing: '0.02em',
                }}>↗ CONTRIBUTE</a>
              </div>
            </div>
            </div>{/* /outer dark wrapper */}

            {/* Prev / Next chapter navigation */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: prev && next ? '1fr 1fr' : '1fr',
              borderBottom: '1px solid var(--rule)',
            }}>
              {prev && (
                <button onClick={() => { setActive(active - 1); window.scrollTo({ top: 0 }); }}
                  style={{
                    background: 'none', border: 'none',
                    borderRight: next ? '1px solid var(--rule)' : 'none',
                    borderTop: '1px solid var(--rule)',
                    padding: mob ? 20 : 32, cursor: 'pointer',
                    textAlign: 'left', fontFamily: 'inherit',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-soft)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <div className="mono" style={{ fontSize: 9, color: 'var(--sub2)',
                    letterSpacing: '0.06em', marginBottom: 12 }}>← PREVIOUS CHAPTER</div>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--accent)',
                    marginBottom: 8 }}>CH. {prev.n}</div>
                  <div style={{ fontSize: mob ? 18 : 22, fontWeight: 400,
                    letterSpacing: '-0.025em', lineHeight: 1.2,
                    fontStyle: 'italic', color: 'var(--ink)' }}>{prev.title}</div>
                </button>
              )}
              {next && (
                <button onClick={() => { setActive(active + 1); window.scrollTo({ top: 0 }); }}
                  style={{
                    background: 'none', border: 'none',
                    borderTop: '1px solid var(--rule)',
                    padding: mob ? 20 : 32, cursor: 'pointer',
                    textAlign: 'right', fontFamily: 'inherit',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-soft)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <div className="mono" style={{ fontSize: 9, color: 'var(--sub2)',
                    letterSpacing: '0.06em', marginBottom: 12 }}>NEXT CHAPTER →</div>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--accent)',
                    marginBottom: 8 }}>CH. {next.n}</div>
                  <div style={{ fontSize: mob ? 18 : 22, fontWeight: 400,
                    letterSpacing: '-0.025em', lineHeight: 1.2,
                    fontStyle: 'italic', color: 'var(--ink)' }}>{next.title}</div>
                </button>
              )}
            </div>

            {/* Chapter footer */}
            <div style={{
              padding: mob ? '12px 20px' : '14px 32px',
              borderBottom: '1px solid var(--rule)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="mono" style={{ background: 'none', border: 'none',
                cursor: 'pointer', fontSize: 10, color: 'var(--sub2)',
                letterSpacing: '0.04em', padding: 0 }}>← RETURN TO TOP</button>
              <span className="mono" style={{ fontSize: 10, color: 'var(--sub2)',
                letterSpacing: '0.04em' }}>END OF CHAPTER · CH{s.n}</span>
            </div>
          </>
        );
      })()}
    </div>
  );
}

// Chapter teaser — editorial style drawn from the reference designs.
// Ghost chapter number · serif italic pull quote · "coordinates" dark section
// · three-tier voice columns · closing quote · CTA.
function ChapterTeaser({ chapter, section, cited, openNote, setOpenNote, onOpenReader }) {
  const mob = useBP() === 'mobile';
  const tab = useBP() === 'tablet';
  const t = (window.TEASERS && window.TEASERS[chapter]) || null;
  const scene = SCENE_META[chapter] || {};
  const pad = mob ? '28px 20px' : tab ? '32px 32px' : '40px 48px';

  if (!t) {
    return <p style={{ padding: pad, fontSize: 17, lineHeight: 1.65, color: 'var(--sub)' }}>
      Teaser coming soon. This chapter is still being edited.
    </p>;
  }
  const [p1, p2] = t.paras;

  // Use ALL 9 chapter voices, augmented with citation notes where available
  const citeLookup = {};
  (t.cites || []).forEach(c => { citeLookup[c.n] = c.note; });
  const citeList = window.INTERVIEWS
    .filter(v => v.ch === chapter)
    .map(v => ({ ...v, note: citeLookup[v.n] || v.affiliation }));

  const tierA = citeList.filter(v => v.tier === 'A');
  const tierP = citeList.filter(v => v.tier === 'P');
  const tierV = citeList.filter(v => v.tier === 'V');

  return (
    <div>

      {/* ── ZONE 1 — Chapter header ── */}
      <div style={{ padding: pad, borderBottom: '2px solid var(--ink)' }}>
        {section && (
          <div className="mono" style={{ fontSize: 10, color: 'var(--sub)',
            letterSpacing: '0.06em', marginBottom: 16 }}>
            {section.part} · ch{chapter}
          </div>
        )}
        {section && (
          <h2 style={{
            fontSize: mob ? 36 : tab ? 44 : 56, fontWeight: 500,
            letterSpacing: '-0.03em', lineHeight: 1.0, margin: '0 0 14px',
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
          }}>{section.title}</h2>
        )}
        {section && (
          <div className="mono" style={{
            fontSize: 11, color: 'var(--sub)', letterSpacing: '0.06em',
            marginBottom: 32,
          }}>{section.sub.toUpperCase()}</div>
        )}

        {/* Summary blockquote */}
        <blockquote style={{
          margin: '0 0 36px', padding: '0 0 0 20px',
          borderLeft: '3px solid var(--accent)',
        }}>
          <p style={{
            fontStyle: 'italic',
            fontSize: mob ? 17 : 20, lineHeight: 1.5,
            letterSpacing: '-0.01em', margin: 0, color: 'var(--ink)',
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
          }}>{p1}</p>
        </blockquote>

        {/* Stats row — 3 chapter-specific facts + identifier */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: mob ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: 24, paddingTop: 28, borderTop: '1px solid var(--rule)',
        }}>
          {(CHAPTER_STATS[chapter] || []).map(({ label, value }) => (
            <div key={label}>
              <div className="mono" style={{ fontSize: 9, color: 'var(--sub)',
                letterSpacing: '0.07em', marginBottom: 8 }}>{label}</div>
              <div style={{ fontSize: mob ? 20 : 26, fontWeight: 500,
                letterSpacing: '-0.02em', lineHeight: 1,
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              }}>{value}</div>
            </div>
          ))}
          <div>
            <div className="mono" style={{ fontSize: 9, color: 'var(--sub)',
              letterSpacing: '0.07em', marginBottom: 8 }}>CHAPTER</div>
            <div style={{ fontSize: mob ? 20 : 26, fontWeight: 500,
              letterSpacing: '-0.02em', lineHeight: 1,
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              color: 'var(--accent)',
            }}>ch{chapter}</div>
          </div>
        </div>
      </div>

      {/* ── ZONE 2 — Opening Scene ── */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        padding: mob ? '40px 20px' : tab ? '48px 32px' : '52px 48px',
        background: 'var(--bg)', borderBottom: '1px solid var(--rule)',
      }}>
        {/* Ghost year */}
        <div aria-hidden="true" style={{
          position: 'absolute', right: mob ? -10 : -20, top: mob ? -10 : -20,
          fontSize: mob ? 160 : 240, fontWeight: 700, lineHeight: 1,
          letterSpacing: '-0.06em', color: 'var(--rule)',
          pointerEvents: 'none', userSelect: 'none',
          fontVariantNumeric: 'tabular-nums',
        }}>{scene.year || chapter}</div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: mob ? '1fr' : '140px 1fr',
          gap: mob ? 24 : 48,
          position: 'relative', zIndex: 1,
        }}>
          {/* Left — scene label */}
          <div>
            <div className="mono" style={{ fontSize: 9, color: 'var(--accent)',
              letterSpacing: '0.1em', marginBottom: 14 }}>OPENING SCENE —</div>
            <div className="mono" style={{ fontSize: 13, fontWeight: 500,
              letterSpacing: '-0.005em', marginBottom: 12 }}>{scene.date}</div>
            {(scene.sources || []).map(src => (
              <div key={src} className="mono" style={{ fontSize: 10,
                color: 'var(--sub)', marginBottom: 4 }}>{src}</div>
            ))}
          </div>

          {/* Right — scene content */}
          <div>
            <h3 style={{
              fontSize: mob ? 26 : tab ? 32 : 40, fontWeight: 500,
              letterSpacing: '-0.025em', lineHeight: 1.05,
              margin: '0 0 22px', fontStyle: 'italic',
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
            }}>{t.opener}</h3>
            <p style={{ fontSize: 17, lineHeight: 1.68, margin: '0 0 20px',
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
              {p2}{' '}
              <NoteRef n={1} active={openNote === 1}
                onClick={() => setOpenNote(openNote === 1 ? null : 1)} />
            </p>
          </div>
        </div>

        {/* Open note */}
        {openNote && (
          <div style={{ marginTop: 20, position: 'relative', zIndex: 1,
            background: 'var(--paper)', border: '1px solid var(--rule)',
            padding: '12px 16px', fontSize: 13, lineHeight: 1.5,
            color: 'var(--sub)', display: 'flex', gap: 12 }}>
            <span className="mono" style={{ fontSize: 10, color: 'var(--accent)' }}>[{openNote}]</span>
            <span>Opening anecdote for Chapter {chapter}. Source notes and full citations live in the manuscript's back matter.</span>
            <button onClick={() => setOpenNote(null)} className="mono" style={{
              marginLeft: 'auto', background: 'none', border: 'none',
              color: 'var(--sub)', cursor: 'pointer', fontSize: 11 }}>close ✕</button>
          </div>
        )}
      </div>

      {/* ── THREE TRIADS — voice columns ── */}
      {citeList.length > 0 && (
        <section style={{ padding: mob ? '28px 20px 40px' : tab ? '28px 32px 40px' : '28px 48px 40px',
          borderBottom: '1px solid var(--rule)' }}>
          <div className="mono" style={{ fontSize: 10, color: 'var(--sub)',
            letterSpacing: '0.04em', marginBottom: 20 }}>
            THREE TRIADS · THREE PERSPECTIVES
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : 'repeat(3, 1fr)',
            gap: 0, borderTop: '1px solid var(--rule)' }}>
            {[
              { tier: 'A', label: 'ACADEMIC',     items: tierA },
              { tier: 'P', label: 'PRACTITIONER', items: tierP },
              { tier: 'V', label: 'VISIONARY',    items: tierV },
            ].map(({ tier, label, items }, ci) => (
              <div key={tier} style={{
                borderRight: mob ? 'none' : (ci < 2 ? '1px solid var(--rule)' : 'none'),
                borderTop: mob && ci > 0 ? '1px solid var(--rule)' : 'none',
                paddingRight: mob ? 0 : (ci < 2 ? 20 : 0),
                paddingLeft: mob ? 0 : (ci > 0 ? 20 : 0),
                paddingTop: mob && ci > 0 ? 20 : 0,
              }}>
                <div className="mono" style={{ fontSize: 10, color: 'var(--sub)',
                  borderBottom: '1px solid var(--rule)', paddingBottom: 8,
                  marginBottom: 12, letterSpacing: '0.04em' }}>
                  {label}
                </div>
                {items.map((v, i) => (
                  <div key={v.n} style={{
                    padding: '8px 0',
                    borderTop: i > 0 ? '1px solid var(--rule)' : 'none',
                  }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                      <span className="mono" style={{ fontSize: 9,
                        color: `var(${v.group.ink})`,
                        background: `var(${v.group.varCSS})`,
                        padding: '2px 5px', flexShrink: 0 }}>
                        {String(v.n).padStart(2, '0')}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 500,
                        letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                        {v.name}
                      </span>
                    </div>
                    <div className="mono" style={{ fontSize: 10,
                      color: 'var(--sub)', marginTop: 3, lineHeight: 1.3 }}>
                      {v.affiliation}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--sub2)',
                      marginTop: 4, lineHeight: 1.4 }}>
                      {v.note}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}

// ─── What this chapter coordinates ────────────────────
// Dark section: causal nodes as labeled boxes in a row with arrows.
function CoordinatesSection({ diagram, noBg, style: styleProp }) {
  const visible = diagram.nodes.filter(n => !n.latent);
  const latent  = diagram.nodes.filter(n => n.latent);

  return (
    <section style={{
      margin: '36px -48px 36px', padding: '28px 48px',
      background: 'var(--ink)', color: 'var(--paper)',
      ...(noBg ? { background: 'none', margin: 0 } : {}),
      ...styleProp,
    }}>
      <div className="mono" style={{ fontSize: 10, color: 'oklch(0.65 0.1 250)',
        letterSpacing: '0.06em', marginBottom: 20,
        display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <span>WHAT THIS CHAPTER COORDINATES</span>
        <span style={{ color: 'oklch(0.45 0.06 250)' }}>FIG · CAUSAL DIAGRAM</span>
      </div>

      {/* Nodes as horizontal row — scrollable if too wide */}
      <div style={{ display: 'flex', alignItems: 'stretch', gap: 0,
        overflowX: 'auto', paddingBottom: 4 }}>
        {visible.map((node, i) => (
          <React.Fragment key={node.id}>
            <div style={{
              border: '1px solid oklch(0.32 0.05 250)',
              padding: '14px 18px', flexShrink: 0,
              background: 'oklch(0.14 0.04 250)', minWidth: 90,
            }}>
              <div className="mono" style={{ fontSize: 9,
                color: 'oklch(0.55 0.1 250)', letterSpacing: '0.05em',
                marginBottom: 5 }}>{node.id}</div>
              <div style={{ fontSize: 13, fontWeight: 500,
                letterSpacing: '-0.01em', lineHeight: 1.3,
                color: 'var(--paper)', whiteSpace: 'nowrap' }}>
                {node.label.replace('\n', ' ')}
              </div>
            </div>
            {i < visible.length - 1 && (
              <div style={{ display: 'flex', alignItems: 'center',
                padding: '0 8px', color: 'var(--accent)',
                fontSize: 15, flexShrink: 0 }}>→</div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Latent node */}
      {latent.length > 0 && (
        <div style={{ marginTop: 14, paddingTop: 14,
          borderTop: '1px solid oklch(0.25 0.04 250)',
          display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div className="mono" style={{ fontSize: 9,
            color: 'oklch(0.55 0.1 250)', letterSpacing: '0.05em' }}>LATENT /</div>
          {latent.map(n => (
            <div key={n.id} style={{
              border: '1px dashed oklch(0.40 0.05 250)',
              padding: '8px 14px', fontSize: 13,
              color: 'oklch(0.78 0.04 250)', letterSpacing: '-0.01em' }}>
              {n.label.replace('\n', ' ')}
            </div>
          ))}
          <div style={{ fontSize: 11, color: 'oklch(0.50 0.06 250)' }}>
            — the missing third body
          </div>
        </div>
      )}

      <div style={{ marginTop: 14, fontSize: 12, color: 'oklch(0.52 0.06 250)',
        lineHeight: 1.5 }}>
        {diagram.caption}
      </div>

      {/* SVG causal graph — nodes as circles + curved arcs */}
      <CausalDiagramSVG diagram={diagram} />
    </section>
  );
}

function CausalDiagramSVG({ diagram }) {
  const W = 620, H = 300;
  const colX = [70, W / 2, W - 70];
  const rowY = [60, H / 2, H - 60];
  const pos = n => ({ x: colX[n.pos[0]], y: rowY[n.pos[1]] });

  const arcPath = (a, b, i) => {
    const pa = pos(a), pb = pos(b);
    const dx = pb.x - pa.x, dy = pb.y - pa.y;
    const len = Math.max(Math.sqrt(dx*dx+dy*dy), 1);
    const c = 0.14 + (i % 3) * 0.04;
    const nx = -dy/len, ny = dx/len;
    const mx = (pa.x+pb.x)/2 + nx*len*c;
    const my = (pa.y+pb.y)/2 + ny*len*c;
    const R = 36;
    const t1 = R/len, t2 = 1-R/len;
    return {
      d: `M ${pa.x+dx*t1} ${pa.y+dy*t1} Q ${mx} ${my} ${pa.x+dx*t2} ${pa.y+dy*t2}`,
      mid: { x: mx, y: my },
    };
  };

  return (
    <div style={{ marginTop: 18, borderTop: '1px solid oklch(0.25 0.04 250)',
      paddingTop: 18 }}>
      <div className="mono" style={{ fontSize: 9, color: 'oklch(0.50 0.08 250)',
        letterSpacing: '0.04em', marginBottom: 10 }}>
        CAUSAL GRAPH · {diagram.title.toUpperCase()}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%"
        style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <marker id="cd-arr" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,1 L10,5 L0,9 z"
              fill="oklch(0.65 0.15 250)" />
          </marker>
          <marker id="cd-lat" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,1 L10,5 L0,9 z"
              fill="oklch(0.50 0.06 250)" />
          </marker>
          <marker id="cd-bal" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,2 L10,5 L0,8" fill="none"
              stroke="oklch(0.65 0.15 250)" strokeWidth="1.5" />
          </marker>
        </defs>

        {diagram.arcs.map((a, i) => {
          const fn = diagram.nodes.find(n => n.id === a.from);
          const tn = diagram.nodes.find(n => n.id === a.to);
          if (!fn || !tn) return null;
          const p = arcPath(fn, tn, i);
          const isLatent = a.kind === 'latent';
          const isBal    = a.kind === 'balancing';
          return (
            <g key={i}>
              <path d={p.d} fill="none"
                stroke={isLatent ? 'oklch(0.42 0.05 250)' : 'oklch(0.65 0.15 250)'}
                strokeWidth={isLatent ? 1 : 1.4}
                strokeDasharray={isLatent ? '4 4' : '0'}
                markerEnd={`url(#${isLatent ? 'cd-lat' : isBal ? 'cd-bal' : 'cd-arr'})`} />
              {a.label && (
                <text x={p.mid.x} y={p.mid.y - 5} textAnchor="middle"
                  style={{ font: '9px "JetBrains Mono", monospace',
                    fill: isLatent ? 'oklch(0.45 0.04 250)' : 'oklch(0.60 0.12 250)' }}>
                  {a.label}
                </text>
              )}
            </g>
          );
        })}

        {diagram.nodes.map(n => {
          const p = pos(n);
          const lines = n.label.split('\n');
          return (
            <g key={n.id}>
              <circle cx={p.x} cy={p.y} r={36}
                fill="oklch(0.14 0.04 250)"
                stroke={n.latent ? 'oklch(0.40 0.05 250)' : 'oklch(0.60 0.12 250)'}
                strokeWidth={n.latent ? 1.1 : 1.6}
                strokeDasharray={n.latent ? '5 3' : '0'} />
              {lines.map((line, li) => (
                <text key={li} x={p.x}
                  y={p.y + (li - (lines.length - 1) / 2) * 12 + 4}
                  textAnchor="middle"
                  style={{ font: `500 10px inherit`,
                    fill: n.latent ? 'oklch(0.60 0.04 250)' : 'var(--paper)',
                    letterSpacing: '-0.01em' }}>
                  {line}
                </text>
              ))}
              <text x={p.x} y={p.y + 50} textAnchor="middle"
                style={{ font: '8px "JetBrains Mono", monospace',
                  fill: 'oklch(0.48 0.08 250)', letterSpacing: '0.04em' }}>
                {n.id}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mono" style={{ fontSize: 9, color: 'oklch(0.42 0.05 250)',
        marginTop: 6, display: 'flex', gap: 16 }}>
        <span>— solid = causal arc</span>
        <span>- - dashed = latent</span>
        <span>B = balancing</span>
      </div>
    </div>
  );
}

// Keep for legacy references
function CitedList({ chapter, cites }) {
  return null; // Now rendered inline in ChapterTeaser three-column layout
}



// ─── Reader drawer ─────────────────────────────────────
// Collapsible sidebar: closed by default, tab on edge to open.
// Contains: theme switcher (light/warm/dark) + locked contributor tools.
// The cited voices are shown INSIDE the chapter teaser (three-triads),
// so the drawer is kept lean: settings only.
function ReaderDrawer({ chapter, cited }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      {/* Floating tab — fixed to right edge of viewport */}
      <div style={{
        position: 'fixed', right: 0, top: '40vh',
        zIndex: 30,
        display: 'flex', flexDirection: 'row', alignItems: 'flex-start',
      }}>
        {/* Tab button */}
        <button onClick={() => setOpen(o => !o)} className="mono" style={{
          width: 28, height: 64, flexShrink: 0,
          background: open ? 'var(--ink)' : 'var(--paper)',
          color: open ? 'var(--paper)' : 'var(--sub)',
          border: '1px solid var(--rule)', borderRight: 'none',
          cursor: 'pointer', fontSize: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background .2s, color .2s',
        }} title={open ? 'Close' : 'Reader tools'}>
          {open ? '✕' : '⚙'}
        </button>
      </div>

      {/* Sliding panel — absolutely positioned from right, slides in */}
      <div style={{
        position: 'fixed', top: '40vh', right: 28, zIndex: 29,
        width: 260,
        maxHeight: '65vh',
        overflowY: open ? 'auto' : 'hidden',
        overflowX: 'hidden',
        background: 'var(--paper)',
        border: open ? '1px solid var(--rule)' : 'none',
        transition: 'transform 0.32s cubic-bezier(0.19,1,0.22,1), opacity 0.28s',
        transform: open ? 'translateX(0)' : 'translateX(120%)',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
        boxShadow: open ? '-4px 4px 24px rgba(0,0,0,0.12)' : 'none',
      }}>
        <div style={{ width: 260, padding: '24px 18px' }}>
          <Label style={{ paddingTop: 0, marginBottom: 12 }}>Display</Label>
          <ThemeSwitcher />
          <div style={{ height: 1, background: 'var(--rule)', margin: '16px 0' }} />
          <Label style={{ paddingTop: 0, marginBottom: 12 }}>Typography</Label>
          <TypographyControls />
          <div style={{ height: 1, background: 'var(--rule)', margin: '16px 0' }} />
          <Label style={{ paddingTop: 0, marginBottom: 10 }}>Contributor tools</Label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {[['✎', 'Add margin note'], ['⚑', 'Flag for review']].map(([ic, l]) => (
              <div key={l} className="mono" style={{
                display: 'grid', gridTemplateColumns: '18px 1fr auto',
                gap: 6, padding: '7px 10px', fontSize: 11,
                color: 'var(--sub2)', border: '1px solid var(--rule)',
                opacity: 0.45, background: 'var(--bg)',
              }}>
                <span>{ic}</span><span>{l}</span><span style={{ fontSize: 9 }}>🔒</span>
              </div>
            ))}
          </div>
          <div className="mono" style={{ fontSize: 9, color: 'var(--sub2)',
            marginTop: 10, lineHeight: 1.5 }}>
            Unlock after claiming a chapter spot.
            <a href="Contribute.html" style={{ display: 'block', marginTop: 6,
              color: 'var(--accent)', textDecoration: 'none' }}>Claim spot →</a>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Theme switcher ────────────────────────────────────
// Three modes: light (default) · warm · dark.
// Applies data-theme on <html> with a 0.7s transition.
function ThemeSwitcher() {
  const [theme, setTheme] = React.useState('light');

  function apply(t) {
    setTheme(t);
    document.documentElement.setAttribute('data-theme', t === 'light' ? '' : t);
  }

  const themes = [
    { key: 'light', icon: '○', label: 'Light' },
    { key: 'warm',  icon: '◑', label: 'Warm' },
    { key: 'dark',  icon: '●', label: 'Dark' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0,
      border: '1px solid var(--rule)' }}>
      {themes.map(({ key, icon, label }, i) => (
        <button key={key} onClick={() => apply(key)} className="mono" style={{
          background: theme === key ? 'var(--ink)' : 'var(--paper)',
          color: theme === key ? 'var(--bg)' : 'var(--sub)',
          border: 'none',
          borderRight: i < 2 ? '1px solid var(--rule)' : 'none',
          padding: '9px 6px', cursor: 'pointer',
          fontSize: 10, letterSpacing: '0.02em',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 4,
          transition: 'background .2s, color .2s',
        }}>
          <span style={{ fontSize: 16 }}>{icon}</span>
          <span>{label.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Typography controls ───────────────────────────────
function TypographyControls() {
  const root = document.documentElement;
  const [size, setSize] = React.useState(1.15);
  const [lh,   setLh]   = React.useState(1.7);

  const sizes  = [1, 1.15, 1.3, 1.5];
  const lhs    = [1.5, 1.65, 1.8, 2.0];

  function nextSize() {
    const i = sizes.indexOf(size);
    const next = sizes[(i + 1) % sizes.length];
    setSize(next);
    root.style.setProperty('--read-scale', String(next));
  }
  function nextLh() {
    const i = lhs.indexOf(lh);
    const next = lhs[(i + 1) % lhs.length];
    setLh(next);
    root.style.setProperty('--read-lh', String(next));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <button onClick={nextSize} className="mono" style={{
        background: size !== 1 ? 'var(--ink)' : 'var(--paper)',
        color: size !== 1 ? 'var(--bg)' : 'var(--ink)',
        border: '1px solid var(--rule)', padding: '8px 10px',
        cursor: 'pointer', textAlign: 'left', fontSize: 11,
        display: 'grid', gridTemplateColumns: '16px 1fr auto', gap: 8,
        transition: 'background .15s, color .15s',
      }}>
        <span>A</span>
        <span>Text size</span>
        <span style={{ fontWeight: 600 }}>{Math.round(size * 100)}%</span>
      </button>
      <button onClick={nextLh} className="mono" style={{
        background: lh !== 1.65 ? 'var(--ink)' : 'var(--paper)',
        color: lh !== 1.65 ? 'var(--bg)' : 'var(--ink)',
        border: '1px solid var(--rule)', padding: '8px 10px',
        cursor: 'pointer', textAlign: 'left', fontSize: 11,
        display: 'grid', gridTemplateColumns: '16px 1fr auto', gap: 8,
        transition: 'background .15s, color .15s',
      }}>
        <span>↕</span>
        <span>Line height</span>
        <span style={{ fontWeight: 600 }}>{lh.toFixed(1)}</span>
      </button>
    </div>
  );
}

// Keep for legacy
function ReaderTools() { return null; }

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
  const bp = useBP();
  const mob = bp === 'mobile';
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
        <span>VOLUME / I · READING ROOM OPEN</span>
        <span>WINDOW / UNTIL SOLSTICE 26</span>
        <span style={{ textAlign: 'right' }}>REPLY WITHIN / 14d</span>
      </div>

      {/* Hero — split headline/meta */}
      <div style={{
        display: 'grid', gridTemplateColumns: mob ? '1fr' : '8fr 4fr',
        borderBottom: '1px solid var(--ink)',
      }}>
        <div style={{ padding: mob ? '32px 16px 28px' : '56px 24px 48px' }}>
          <Label style={{ paddingTop: 0 }}>04 · Contribute</Label>
          <h2 style={{
            fontSize: 'clamp(64px, 11vw, 180px)', fontWeight: 500,
            letterSpacing: '-0.05em', lineHeight: 0.88, margin: '16px 0 0',
          }}>
            Volume I<br/>
            is <span style={{ color: 'var(--accent)' }}>open</span>.
          </h2>
          <p style={{ fontSize: 20, lineHeight: 1.4, letterSpacing: '-0.015em',
            maxWidth: '58ch', margin: '32px 0 0', color: 'var(--sub)' }}>
            Eighty-one voices. Nine chapters. A small reading room of contributors
            is being opened before the manuscript goes to print. Edit a chapter,
            annotate the margin, or just receive the correspondence.
          </p>
          <a href="Contribute.html" style={{
            marginTop: 32, display: 'inline-flex', alignItems: 'center',
            gap: 12, background: 'var(--ink)', color: 'var(--paper)',
            padding: '16px 24px', fontFamily: '"JetBrains Mono", ui-monospace, monospace',
            fontSize: 13, textDecoration: 'none', border: '1px solid var(--ink)',
          }}>
            <span>Claim your spot in Volume I</span>
            <span style={{ fontSize: 16 }}>→</span>
          </a>
          <div className="mono" style={{ fontSize: 10, color: 'var(--sub)',
            marginTop: 12 }}>
            Opens the contribution landing page · ~4 min · no account required
          </div>
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
        gridTemplateColumns: mob ? '1fr' : '7fr 5fr',
        borderBottom: '1px solid var(--rule)',
      }}>
        {/* FORM */}
        <div style={{ padding: mob ? '24px 16px 32px' : '40px 32px 48px',
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

        {/* TICKET PREVIEW — hidden on mobile */}
        {!mob && <aside style={{ padding: '40px 32px',
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
        </aside>}
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
