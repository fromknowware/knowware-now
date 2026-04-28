// Markdown interview reader

const MD_CSS = `
.kw-md { color: var(--ink); }
.kw-md h1 {
  font-size: clamp(28px, 6vw, 52px); font-weight: 500;
  letter-spacing: -0.035em; line-height: 1.05;
  margin: 0 0 32px;
}
.kw-md h2 {
  font-size: clamp(18px, 3vw, 26px); font-weight: 500;
  letter-spacing: -0.02em; line-height: 1.2;
  margin: 56px 0 16px; padding-top: 56px;
  border-top: 1px solid var(--rule);
}
.kw-md h3 {
  font-size: 16px; font-weight: 500;
  letter-spacing: -0.01em; margin: 32px 0 10px;
  color: var(--sub);
}
.kw-md p {
  font-size: 17px; line-height: 1.7;
  letter-spacing: -0.015em; margin: 0 0 22px;
}
.kw-md > p:first-of-type::first-letter {
  font-size: 4.2em; font-weight: 400;
  float: left; line-height: 0.78;
  margin: 6px 10px 0 0;
  letter-spacing: -0.04em;
}
.kw-md blockquote {
  margin: 36px 0; padding: 0 0 0 20px;
  border-left: 3px solid var(--accent);
}
.kw-md blockquote p {
  font-size: 21px; line-height: 1.45;
  letter-spacing: -0.02em; margin: 0;
  color: var(--ink);
}
.kw-md code {
  font-family: "JetBrains Mono", ui-monospace, monospace;
  font-size: 12px; background: var(--accent-soft);
  padding: 2px 6px; border-radius: 2px;
}
.kw-md pre {
  background: var(--accent-soft); padding: 18px 20px;
  margin: 24px 0; overflow-x: auto;
  border: 1px solid var(--rule);
}
.kw-md pre code { background: none; padding: 0; font-size: 13px; }
.kw-md hr {
  border: none; border-top: 1px solid var(--rule); margin: 56px 0;
}
.kw-md strong { font-weight: 600; }
.kw-md em { font-style: italic; }
.kw-md a { color: var(--accent); text-underline-offset: 3px; }
.kw-md ul, .kw-md ol { padding-left: 24px; margin: 0 0 22px; }
.kw-md li { font-size: 17px; line-height: 1.65; margin-bottom: 6px; }
.kw-md table {
  width: 100%; border-collapse: collapse; margin: 32px 0;
  font-size: 14px;
}
.kw-md th {
  font-family: "JetBrains Mono", ui-monospace, monospace;
  font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase;
  text-align: left; padding: 8px 12px;
  border-bottom: 2px solid var(--ink); color: var(--sub);
}
.kw-md td { padding: 10px 12px; border-bottom: 1px solid var(--rule); }
`;

function MarkdownReader({ url, onBack, onNext, hasNext }) {
  const bp = React.useContext(window.BreakpointContext);
  const mob = bp === 'mobile';
  const [state, setState] = React.useState('loading'); // loading | ok | error
  const [html,  setHtml]  = React.useState('');
  const [title, setTitle] = React.useState('');

  React.useEffect(() => {
    if (!url) return;
    setState('loading');
    setHtml('');
    fetch(url)
      .then(r => { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(text => {
        // Extract title from first # heading if present
        const titleMatch = text.match(/^#\s+(.+)$/m);
        setTitle(titleMatch ? titleMatch[1] : '');
        setHtml(window.marked.parse(text));
        setState('ok');
      })
      .catch(() => setState('error'));
  }, [url]);

  return (
    <div style={{ paddingBottom: 56 }}>
      <style>{MD_CSS}</style>

      {/* Top bar */}
      <div style={{
        borderBottom: '1px solid var(--rule)',
        padding: mob ? '10px 20px' : '12px 48px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'sticky', top: 48, zIndex: 8,
        background: 'var(--bg)', backdropFilter: 'blur(8px)',
      }}>
        <button onClick={onBack} className="mono" style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 11, color: 'var(--sub)', padding: 0,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>← Back</button>
        {title && (
          <span className="mono" style={{
            fontSize: 10, color: 'var(--sub2)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            maxWidth: mob ? '55%' : '60%', textAlign: 'right',
          }}>{title}</span>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: mob ? '40px 20px 80px' : '64px 48px 120px', maxWidth: 800 }}>
        {state === 'loading' && (
          <p className="mono" style={{ fontSize: 11, color: 'var(--sub2)', marginTop: 40 }}>
            Loading interview…
          </p>
        )}
        {state === 'error' && (
          <div style={{ marginTop: 40 }}>
            <p className="mono" style={{ fontSize: 11, color: 'var(--sub2)' }}>
              Could not load the interview from:
            </p>
            <p className="mono" style={{ fontSize: 10, color: 'var(--sub2)',
              wordBreak: 'break-all', marginTop: 8 }}>{url}</p>
          </div>
        )}
        {state === 'ok' && (
          <article
            className="kw-md"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>

      {/* Fixed nav dock */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 20,
        background: 'var(--bg)', borderTop: '1px solid var(--ink)',
        display: 'grid', gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'stretch',
      }}>
        <button onClick={onBack} className="mono" style={{
          background: 'none', border: 'none', borderRight: '1px solid var(--rule)',
          padding: mob ? '14px 16px' : '14px 24px', cursor: 'pointer',
          fontSize: mob ? 10 : 11, color: 'var(--sub)',
          textAlign: 'left', letterSpacing: '0.04em',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>← {mob ? 'BACK' : 'TO KNOWWARE'}</button>

        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="mono" style={{
          background: 'none', border: 'none', borderRight: '1px solid var(--rule)',
          padding: mob ? '14px 16px' : '14px 24px', cursor: 'pointer',
          fontSize: mob ? 10 : 11, color: 'var(--ink)',
          letterSpacing: '0.04em',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>^ BACK TO TOP</button>

        <button onClick={onNext} disabled={!hasNext} className="mono" style={{
          background: 'none', border: 'none',
          padding: mob ? '14px 16px' : '14px 24px',
          cursor: hasNext ? 'pointer' : 'default',
          fontSize: mob ? 10 : 11,
          color: hasNext ? 'var(--ink)' : 'var(--sub2)',
          textAlign: 'right', letterSpacing: '0.04em',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8,
          opacity: hasNext ? 1 : 0.35,
        }}>{mob ? 'NEXT' : 'NEXT INTERVIEW'} →</button>
      </div>
    </div>
  );
}

// Chapter interviews listing — 9 voice cards, click → individual reader
function ChapterInterviews({ ch, onOpenInterview, onBack }) {
  const bp = React.useContext(window.BreakpointContext);
  const mob = bp === 'mobile';
  const voices = window.INTERVIEWS.filter(v => v.ch === ch);
  const chapter = window.CHAPTERS.find(c => c.n === ch);

  return (
    <div>
      {/* Top bar */}
      <div style={{
        borderBottom: '1px solid var(--rule)',
        padding: mob ? '10px 20px' : '12px 48px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'sticky', top: 48, zIndex: 8,
        background: 'var(--bg)',
      }}>
        <button onClick={onBack} className="mono" style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 11, color: 'var(--sub)', padding: 0,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>← Back</button>
        <span className="mono" style={{ fontSize: 10, color: 'var(--sub2)' }}>
          ch{ch} · 9 interviews
        </span>
      </div>

      {/* Header */}
      <div style={{ padding: mob ? '32px 20px 24px' : '48px 48px 32px', borderBottom: '1px solid var(--rule)' }}>
        <div className="mono" style={{ fontSize: 10, color: 'var(--sub)', marginBottom: 10 }}>
          Chapter {ch} · Interviews
        </div>
        <h1 style={{ fontSize: mob ? 'clamp(24px,7vw,40px)' : 'clamp(28px,4vw,52px)',
          fontWeight: 500, letterSpacing: '-0.035em', lineHeight: 1.05, margin: 0 }}>
          {chapter ? chapter.title : `Chapter ${ch}`}
        </h1>
      </div>

      {/* Voice grid */}
      <div style={{ padding: mob ? '24px 20px 80px' : '32px 48px 80px' }}>
        {['A', 'P', 'V'].map(tier => {
          const tierVoices = voices.filter(v => v.tier === tier);
          const label = tier === 'A' ? 'Academics' : tier === 'P' ? 'Practitioners' : 'Visionaries';
          return (
            <div key={tier} style={{ marginBottom: 40 }}>
              <div className="mono" style={{ fontSize: 10, color: 'var(--sub)',
                letterSpacing: '0.06em', marginBottom: 12,
                paddingBottom: 8, borderBottom: '1px solid var(--rule)' }}>
                {label.toUpperCase()} · {tierVoices.length}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {tierVoices.map(v => {
                  const url = window.interviewUrl(v.n);
                  return (
                    <button key={v.n}
                      onClick={() => url && onOpenInterview(url, v)}
                      style={{
                        background: url ? `var(${v.group.varCSS})` : 'var(--paper)',
                        border: `1px solid var(${v.group.ink})`,
                        padding: '14px 18px', cursor: url ? 'pointer' : 'default',
                        textAlign: 'left', fontFamily: 'inherit',
                        display: 'grid',
                        gridTemplateColumns: '28px 1fr auto',
                        alignItems: 'center', gap: 14,
                        opacity: url ? 1 : 0.5,
                        transition: 'opacity .15s',
                      }}>
                      <span className="mono" style={{ fontSize: 9, color: `var(${v.group.ink})` }}>
                        {String(v.n).padStart(2, '0')}
                      </span>
                      <span style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <span style={{ fontSize: mob ? 15 : 17, fontWeight: 500,
                          letterSpacing: '-0.02em', color: `var(${v.group.ink})` }}>
                          {v.name}
                        </span>
                        <span className="mono" style={{ fontSize: 10, color: `var(${v.group.ink})`,
                          opacity: 0.7 }}>{v.affiliation}</span>
                      </span>
                      <span className="mono" style={{ fontSize: 10, color: `var(${v.group.ink})`,
                        opacity: url ? 0.8 : 0.3 }}>
                        {url ? '↗' : '—'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { MarkdownReader, ChapterInterviews });
