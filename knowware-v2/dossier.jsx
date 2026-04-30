// PersonDossier — individual voice page, styled to Knowware v2.
// Opens as a full-page overlay from the TablePage or GraphView.
// Data comes from VOICES (voices.jsx) cross-referenced with INTERVIEWS (data.jsx).

const { useState, useEffect, useRef } = React;
const useBP = () => React.useContext(window.BreakpointContext);

function PersonDossier({ personN, onClose }) {
  const iv  = window.INTERVIEWS.find(v => v.n === personN);
  // Fuzzy name match: VOICES may have "Dr. Paul Pangaro" while INTERVIEWS has "Paul Pangaro"
  const vd  = window.VOICES && window.VOICES.find(v => {
    if (!iv) return false;
    const vn = v.name.toLowerCase();
    const ivn = iv.name.toLowerCase();
    // exact match, or one contains the other, or last-name match
    return vn === ivn
      || vn.includes(ivn)
      || ivn.includes(vn)
      || vn.split(' ').pop() === ivn.split(' ').pop();
  });

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [personN]);

  const bp = useBP();
  const mob = bp === 'mobile';

  if (!iv) return null;

  // Fallbacks from INTERVIEWS if VOICES entry is sparse
  const name         = iv.name;
  const alias        = vd?.alias || '';
  const affiliation  = vd?.affiliation || iv.affiliation;
  const active       = vd?.active  || `${iv.year} – present`;
  const status       = vd?.status  || 'Living · Active';
  const jurisdiction = vd?.jurisdiction || iv.themes.join(' / ');
  const awards       = vd?.awards  || [];
  const works        = vd?.works   || [];
  const knownFor     = vd?.knownFor || [];
  const coldOpen     = vd?.coldOpen || '';
  const bio          = vd?.bio     || '';
  const whyMatters   = vd?.whyMatters || '';

  const ch   = window.CHAPTERS.find(c => c.n === iv.ch);
  const tierLabel = iv.tier === 'A' ? 'Academic' : iv.tier === 'P' ? 'Practitioner' : 'Visionary';

  // Initials — same logic as data.jsx
  const sym = iv.sym;

  // Prev / next
  const prev = personN > 1  ? personN - 1 : null;
  const next = personN < 81 ? personN + 1 : null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative' }}>

      {/* ── Sticky top bar ───────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 48, zIndex: 20,
        background: 'var(--bg)', borderBottom: '1px solid var(--rule)',
        padding: mob ? '8px 16px' : '10px 24px', display: 'grid',
        gridTemplateColumns: '1fr auto auto', gap: mob ? 8 : 16, alignItems: 'center',
      }}>
        <div className="mono" style={{ fontSize: 10, color: 'var(--sub)',
          letterSpacing: '0.04em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {mob
            ? `№ ${String(personN).padStart(2, '0')} · ${tierLabel.toUpperCase()}`
            : `DOSSIER · № ${String(personN).padStart(2, '0')} OF 81 · ${tierLabel.toUpperCase()} · ch${iv.ch}`}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {prev && (
            <button onClick={() => onClose(prev)} className="mono" style={{
              background: 'none', border: '1px solid var(--rule)',
              padding: '6px 8px', cursor: 'pointer', fontSize: 10, color: 'var(--sub)',
            }}>←</button>
          )}
          {next && (
            <button onClick={() => onClose(next)} className="mono" style={{
              background: 'none', border: '1px solid var(--rule)',
              padding: '6px 8px', cursor: 'pointer', fontSize: 10, color: 'var(--sub)',
            }}>→</button>
          )}
        </div>
        <button onClick={() => onClose(null)} className="mono" style={{
          background: 'var(--ink)', color: 'var(--paper)',
          border: 'none', padding: mob ? '7px 10px' : '7px 12px', cursor: 'pointer',
          fontSize: 10, letterSpacing: '0.04em',
        }}>{mob ? '← 81' : '← BACK TO THE 81'}</button>
      </div>

      {/* ── Identity card ─────────────────────────────────── */}
      <div style={{
        display: 'grid', gridTemplateColumns: mob ? '1fr' : '200px 1fr',
        borderBottom: '1px solid var(--ink)', minHeight: mob ? 0 : 220,
      }}>
        {/* Monogram panel */}
        <div style={{
          borderRight: mob ? 'none' : '1px solid var(--ink)',
          borderBottom: mob ? '1px solid var(--ink)' : 'none',
          background: `var(${iv.group.varCSS})`,
          display: 'flex', flexDirection: mob ? 'row' : 'column',
          justifyContent: 'space-between', alignItems: mob ? 'center' : 'stretch',
          padding: mob ? '14px 16px' : 20,
        }}>
          <div className="mono" style={{ fontSize: 9,
            color: `var(${iv.group.ink})`, letterSpacing: '0.05em' }}>
            {String(personN).padStart(2, '0')} · {iv.tier}
          </div>
          <div style={{
            fontSize: mob ? 52 : 88, fontWeight: 600, letterSpacing: '-0.06em',
            lineHeight: 1, color: 'rgba(0,0,0,0.15)', textAlign: 'center',
            userSelect: 'none',
          }}>{sym}</div>
          <div className="mono" style={{ fontSize: 8,
            color: `var(${iv.group.ink})`, textAlign: mob ? 'right' : 'center',
            letterSpacing: '0.06em' }}>{tierLabel.toUpperCase()}</div>
        </div>

        {/* Name + meta */}
        <div style={{ padding: mob ? '20px 16px' : '32px 40px', display: 'flex',
          flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            {alias && (
              <div className="mono" style={{ fontSize: 11, color: 'var(--accent)',
                letterSpacing: '0.02em', marginBottom: 10 }}>
                "{alias}"
              </div>
            )}
            <h1 style={{
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: mob ? 'clamp(28px, 8vw, 48px)' : 'clamp(32px, 5vw, 64px)',
              fontWeight: 500, letterSpacing: '-0.025em', lineHeight: 1.0,
              margin: 0,
            }}>{name}</h1>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: mob ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
            gap: mob ? 12 : 16, marginTop: mob ? 16 : 24, paddingTop: mob ? 16 : 24,
            borderTop: '1px solid var(--rule)',
          }}>
            {[
              ['CHAPTER',    `ch${iv.ch} · ${ch?.title || ''}`],
              ['TIER',       tierLabel],
              ['STATUS',     status],
              ['ACTIVE',     active],
              ['AFFILIATION', affiliation],
              ['JURISDICTION', jurisdiction],
            ].map(([k, v]) => v && (
              <div key={k}>
                <div className="mono" style={{ fontSize: 9,
                  color: 'var(--sub)', letterSpacing: '0.06em',
                  marginBottom: 3 }}>{k}</div>
                <div style={{ fontSize: 12, lineHeight: 1.4,
                  letterSpacing: '-0.005em' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Cold open quote ───────────────────────────────── */}
      {coldOpen && (
        <div style={{
          borderBottom: '1px solid var(--ink)',
          padding: mob ? '28px 16px' : '48px 40px',
        }}>
          <div className="mono" style={{ fontSize: 9, color: 'var(--sub)',
            letterSpacing: '0.06em', marginBottom: 20 }}>COLD OPEN</div>
          <blockquote style={{
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
            fontSize: 'clamp(20px, 3vw, 32px)', lineHeight: 1.35, letterSpacing: '-0.015em',
            margin: 0, maxWidth: '82ch', color: 'var(--ink)',
            borderLeft: '3px solid var(--accent)',
            paddingLeft: 28,
          }}>
            "{coldOpen}"
          </blockquote>
        </div>
      )}

      {/* ── Bio + right panel ─────────────────────────────── */}
      <div style={{
        display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 320px',
        borderBottom: '1px solid var(--rule)',
      }}>
        <div style={{ padding: mob ? '24px 16px' : '40px', borderRight: mob ? 'none' : '1px solid var(--rule)', borderBottom: mob ? '1px solid var(--rule)' : 'none' }}>
          {/* Overview */}
          {bio && (
            <>
              <div className="mono" style={{ fontSize: 9, color: 'var(--sub)',
                letterSpacing: '0.06em', marginBottom: 16 }}>OVERVIEW</div>
              <p style={{ fontSize: 16, lineHeight: 1.7, margin: '0 0 32px',
                color: 'var(--ink)', maxWidth: '70ch' }}>{bio}</p>
            </>
          )}
          {/* Why it matters */}
          {whyMatters && (
            <>
              <div className="mono" style={{ fontSize: 9, color: 'var(--accent)',
                letterSpacing: '0.06em', marginBottom: 12 }}>WHY THIS VOICE MATTERS TO KNOWWARE</div>
              <div style={{
                background: 'var(--accent-soft)',
                borderLeft: '3px solid var(--accent)',
                padding: '16px 20px', fontSize: 15, lineHeight: 1.6,
                color: 'var(--ink)', maxWidth: '70ch',
              }}>
                {whyMatters}
              </div>
            </>
          )}
        </div>

        {/* Right column */}
        <div style={{ padding: mob ? '20px 16px' : '32px 28px', background: 'var(--paper)',
          display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Awards */}
          {awards.length > 0 && (
            <div>
              <div className="mono" style={{ fontSize: 9, color: 'var(--sub)',
                letterSpacing: '0.06em', marginBottom: 12,
                borderBottom: '1px solid var(--rule)', paddingBottom: 8 }}>
                OUTSTANDING NOTES
              </div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0,
                display: 'flex', flexDirection: 'column', gap: 6 }}>
                {awards.map((a, i) => (
                  <li key={i} style={{ fontSize: 12, lineHeight: 1.4,
                    display: 'flex', gap: 8, color: 'var(--ink)' }}>
                    <span style={{ color: 'var(--accent)', flexShrink: 0 }}>◦</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tier badge */}
          <div>
            <div className="mono" style={{ fontSize: 9, color: 'var(--sub)',
              letterSpacing: '0.06em', marginBottom: 10,
              borderBottom: '1px solid var(--rule)', paddingBottom: 8 }}>
              CLASSIFICATION
            </div>
            <div style={{
              background: `var(${iv.group.varCSS})`,
              border: `1px solid var(${iv.group.ink})`,
              padding: '10px 14px', display: 'inline-flex',
              alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 24, fontWeight: 600,
                color: 'var(--ink)' }}>{sym}</span>
              <div>
                <div className="mono" style={{ fontSize: 9,
                  color: `var(${iv.group.ink})` }}>
                  {tierLabel.toUpperCase()} · TIER {iv.tier}
                </div>
                <div className="mono" style={{ fontSize: 9,
                  color: 'var(--sub)' }}>ch{iv.ch}</div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div style={{ marginTop: 'auto' }}>
            <a href="contribute.html" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'var(--accent)', color: 'var(--paper)',
              padding: '14px 16px', textDecoration: 'none',
              fontFamily: '"JetBrains Mono", ui-monospace, monospace',
              fontSize: 11, letterSpacing: '0.02em', marginBottom: 8,
            }}>
              READ FULL INTERVIEW <span>→</span>
            </a>
            <a href="contribute.html" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'var(--ink)', color: 'var(--paper)',
              padding: '12px 16px', textDecoration: 'none',
              fontFamily: '"JetBrains Mono", ui-monospace, monospace',
              fontSize: 11, letterSpacing: '0.02em',
            }}>
              CLAIM YOUR SPOT IN VOL. I <span>↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── Methods & Frameworks ──────────────────────────── */}
      {knownFor.length > 0 && (
        <div style={{
          padding: mob ? '24px 16px' : '40px', borderBottom: '1px solid var(--rule)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between',
            alignItems: 'baseline', marginBottom: 20 }}>
            <div className="mono" style={{ fontSize: 9, color: 'var(--sub)',
              letterSpacing: '0.06em' }}>METHODS &amp; FRAMEWORKS</div>
            <div className="mono" style={{ fontSize: 9, color: 'var(--sub2)' }}>
              {knownFor.length} CLASSIFIERS
            </div>
          </div>
          <div style={{ display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: 8 }}>
            {knownFor.map((k, i) => (
              <div key={i} style={{
                border: '1px solid var(--rule)', padding: '12px 14px',
                background: 'var(--paper)',
              }}>
                <div className="mono" style={{ fontSize: 9, color: 'var(--sub2)',
                  marginBottom: 4 }}>{String(i + 1).padStart(2, '0')}</div>
                <div style={{ fontSize: 12, lineHeight: 1.4,
                  letterSpacing: '-0.005em' }}>{k}</div>
              </div>
            ))}
          </div>
          <div className="mono" style={{ fontSize: 9, color: 'var(--sub2)',
            marginTop: 12 }}>
            WHO SHARES {iv.name.split(' ').pop().toUpperCase()}'S RED THREAD?
            {' '}→{' '}
            <button onClick={() => onClose(null)} style={{
              background: 'none', border: 'none', color: 'var(--accent)',
              cursor: 'pointer', fontSize: 9, fontFamily: 'inherit',
              textDecoration: 'underline',
            }}>FOLLOW THE RED THREAD IN THE GRAPH</button>
          </div>
        </div>
      )}

      {/* ── Evidence archive — works ──────────────────────── */}
      {works.length > 0 && (
        <div style={{
          padding: mob ? '24px 16px' : '40px', borderBottom: '1px solid var(--rule)',
        }}>
          <div className="mono" style={{ fontSize: 9, color: 'var(--sub)',
            letterSpacing: '0.06em', marginBottom: 6 }}>KNOWWARE SERIES —</div>
          <div style={{ fontSize: 22, letterSpacing: '-0.02em', fontWeight: 500,
            marginBottom: 20 }}>EVIDENCE ARCHIVE</div>
          <div style={{ display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 0 }}>
            {works.map((w, i) => (
              <div key={i} style={{
                borderTop: i < 3 ? '1px solid var(--rule)' : '1px solid var(--rule)',
                borderRight: '1px solid var(--rule)',
                padding: '14px 16px',
                display: 'flex', gap: 10, alignItems: 'baseline',
              }}>
                <span className="mono" style={{ fontSize: 9,
                  color: 'var(--sub2)', flexShrink: 0 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span style={{ fontSize: 13, lineHeight: 1.45,
                  letterSpacing: '-0.005em' }}>{w}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Footer nav ───────────────────────────────────── */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        borderTop: '1px solid var(--ink)',
      }}>
        {prev ? (
          <button onClick={() => onClose(prev)} style={{
            background: 'none', border: 'none', borderRight: '1px solid var(--ink)',
            padding: mob ? '16px' : '24px 32px', cursor: 'pointer', textAlign: 'left',
            fontFamily: 'inherit',
          }}>
            <div className="mono" style={{ fontSize: 9, color: 'var(--sub)',
              marginBottom: 6 }}>← PREVIOUS</div>
            <div style={{ fontSize: mob ? 13 : 15, fontWeight: 500,
              letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {window.INTERVIEWS[prev - 1]?.name}
            </div>
          </button>
        ) : <div style={{ borderRight: '1px solid var(--ink)' }} />}

        {next ? (
          <button onClick={() => onClose(next)} style={{
            background: 'none', border: 'none', padding: mob ? '16px' : '24px 32px',
            cursor: 'pointer', textAlign: 'right', fontFamily: 'inherit',
            width: '100%',
          }}>
            <div className="mono" style={{ fontSize: 9, color: 'var(--sub)',
              marginBottom: 6 }}>NEXT →</div>
            <div style={{ fontSize: mob ? 13 : 15, fontWeight: 500,
              letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {window.INTERVIEWS[next - 1]?.name}
            </div>
          </button>
        ) : <div />}
      </div>
    </div>
  );
}

Object.assign(window, { PersonDossier });
