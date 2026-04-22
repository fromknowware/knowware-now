// Tweaks panel — readability controls for Knowware v2.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "fontFamily": "sans",
  "readScale": 1.15,
  "readLineHeight": 1.7,
  "readColumn": 780,
  "readTrack": -0.01,
  "contrast": "normal"
}/*EDITMODE-END*/;

const FONT_STACKS = {
  sans:    '"Helvetica Neue", Helvetica, Arial, sans-serif',
  humanist:'"Inter", "Helvetica Neue", Arial, sans-serif',
  serif:   '"Source Serif 4", Georgia, "Times New Roman", serif',
};

function applyTweaks(t) {
  const r = document.documentElement;
  r.style.setProperty('--body-font', FONT_STACKS[t.fontFamily] || FONT_STACKS.sans);
  r.style.setProperty('--read-scale', String(t.readScale));
  r.style.setProperty('--read-lh', String(t.readLineHeight));
  r.style.setProperty('--read-col', `${t.readColumn}px`);
  r.style.setProperty('--read-track', `${t.readTrack}em`);
  r.setAttribute('data-contrast', t.contrast);
}

function TweaksPanel() {
  const [on, setOn] = React.useState(false);
  const [tweaks, setTweaks] = React.useState(TWEAK_DEFAULTS);

  // Apply on every change
  React.useEffect(() => { applyTweaks(tweaks); }, [tweaks]);

  // Announce availability & listen for toggle
  React.useEffect(() => {
    function onMessage(e) {
      const d = e.data || {};
      if (d.type === '__activate_edit_mode')   setOn(true);
      if (d.type === '__deactivate_edit_mode') setOn(false);
    }
    window.addEventListener('message', onMessage);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMessage);
  }, []);

  function patch(edits) {
    const next = { ...tweaks, ...edits };
    setTweaks(next);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*');
  }

  if (!on) return null;

  return (
    <div style={{
      position: 'fixed', right: 20, bottom: 20, zIndex: 1000,
      width: 320, background: 'var(--paper)',
      border: '1px solid var(--ink)',
      boxShadow: '0 10px 40px rgba(0,0,0,0.18)',
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      color: 'var(--ink)',
    }}>
      <header style={{
        padding: '10px 14px', background: 'var(--ink)', color: 'var(--paper)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontSize: 11, letterSpacing: '0.05em' }}>TWEAKS · READABILITY</span>
        <span style={{ fontSize: 10, opacity: 0.6 }}>v2</span>
      </header>

      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Group label="Body typeface">
          <Seg
            value={tweaks.fontFamily}
            onChange={v => patch({ fontFamily: v })}
            options={[['sans','Sans'],['humanist','Humanist'],['serif','Serif']]}
          />
        </Group>

        <Group label={`Reading size · ${Math.round(tweaks.readScale*100)}%`}>
          <input type="range" min="0.9" max="1.6" step="0.05"
            value={tweaks.readScale}
            onChange={e => patch({ readScale: parseFloat(e.target.value) })}
            style={rangeStyle} />
        </Group>

        <Group label={`Line height · ${tweaks.readLineHeight.toFixed(2)}`}>
          <input type="range" min="1.3" max="2.1" step="0.05"
            value={tweaks.readLineHeight}
            onChange={e => patch({ readLineHeight: parseFloat(e.target.value) })}
            style={rangeStyle} />
        </Group>

        <Group label={`Column width · ${tweaks.readColumn}px`}>
          <input type="range" min="560" max="960" step="20"
            value={tweaks.readColumn}
            onChange={e => patch({ readColumn: parseInt(e.target.value, 10) })}
            style={rangeStyle} />
        </Group>

        <Group label={`Letter-spacing · ${tweaks.readTrack.toFixed(3)}em`}>
          <input type="range" min="-0.03" max="0.02" step="0.005"
            value={tweaks.readTrack}
            onChange={e => patch({ readTrack: parseFloat(e.target.value) })}
            style={rangeStyle} />
        </Group>

        <Group label="Contrast">
          <Seg
            value={tweaks.contrast}
            onChange={v => patch({ contrast: v })}
            options={[['normal','Normal'],['high','High']]}
          />
        </Group>

        <button onClick={() => patch(TWEAK_DEFAULTS)} style={{
          marginTop: 4, padding: '8px 10px',
          background: 'var(--paper)', color: 'var(--ink)',
          border: '1px solid var(--ink)', cursor: 'pointer',
          fontFamily: 'inherit', fontSize: 11, letterSpacing: '0.05em',
        }}>RESET TO DEFAULTS</button>

        <div style={{ fontSize: 10, color: 'var(--sub)', lineHeight: 1.5,
          borderTop: '1px solid var(--rule)', paddingTop: 10 }}>
          Reading size, line height, and column width apply on the Manuscript page.
          Typeface and contrast apply globally.
        </div>
      </div>
    </div>
  );
}

const rangeStyle = {
  width: '100%', accentColor: 'var(--accent)',
};

function Group({ label, children }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 10, color: 'var(--sub)',
        letterSpacing: '0.05em' }}>{label.toUpperCase()}</span>
      {children}
    </label>
  );
}

function Seg({ value, onChange, options }) {
  return (
    <div style={{ display: 'grid',
      gridTemplateColumns: `repeat(${options.length}, 1fr)`,
      border: '1px solid var(--rule)' }}>
      {options.map(([v, l], i) => {
        const on = value === v;
        return (
          <button key={v} onClick={() => onChange(v)} style={{
            background: on ? 'var(--ink)' : 'var(--paper)',
            color: on ? 'var(--paper)' : 'var(--ink)',
            border: 'none',
            borderLeft: i === 0 ? 'none' : '1px solid var(--rule)',
            padding: '6px 8px', fontFamily: 'inherit', fontSize: 11,
            cursor: 'pointer', letterSpacing: '0.03em',
          }}>{l}</button>
        );
      })}
    </div>
  );
}

window.TweaksPanel = TweaksPanel;
window.applyTweaks = applyTweaks;
window.TWEAK_DEFAULTS = TWEAK_DEFAULTS;
// Apply defaults on load so initial render already reflects them.
applyTweaks(TWEAK_DEFAULTS);
