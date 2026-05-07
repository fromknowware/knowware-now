// App root
const BreakpointContext = React.createContext('desktop');
// Must be on window before any component renders so useBP() resolves correctly.
window.BreakpointContext = BreakpointContext;

function useBreakpoint() {
  const [bp, setBp] = React.useState(() => {
    const w = window.innerWidth;
    return w < 640 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop';
  });
  React.useEffect(() => {
    function update() {
      const w = window.innerWidth;
      setBp(w < 640 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop');
    }
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return bp;
}

// ─── Hash routing ───────────────────────────────────────
// URL scheme:
//   #cover                  → cover page
//   #table                  → The 81, elements view (default)
//   #table/graph            → The 81, graph view
//   #table/mo               → The 81, M.O. view
//   #profile/N              → person dossier (N = 1–81)
//   #read                   → read page
//   #read/ch/N              → chapter N interview list
//   #read/interview/N       → interview N markdown reader
//   #join                   → join page

const TABLE_VIEWS = ['table', 'graph', 'mo'];

function parseHash() {
  const h = (window.location.hash || '').slice(1) || 'cover';
  const parts = h.split('/');
  const key = parts[0] || 'cover';

  if (key === 'profile' && parts[1]) {
    const n = parseInt(parts[1]);
    if (n >= 1 && n <= 81) return { page: 'table', tableView: 'graph', dossierN: n, reader: null };
  }
  if (key === 'table') {
    // 'elements' and 'cast' are legacy aliases → remap to 'table'
    const raw = parts[1];
    const view = raw === 'elements' || raw === 'cast' ? 'table'
      : TABLE_VIEWS.includes(raw) ? raw : 'table';
    return { page: 'table', tableView: view, dossierN: null, reader: null };
  }
  if (key === 'read') {
    if (parts[1] === 'ch' && parts[2]) {
      const ch = parseInt(parts[2]);
      if (ch >= 1 && ch <= 9) return { page: 'read', tableView: 'graph', dossierN: null, reader: { mode: 'chapter', ch } };
    }
    if (parts[1] === 'interview' && parts[2]) {
      const n = parseInt(parts[2]);
      const voice = window.INTERVIEWS?.find(v => v.n === n);
      const url = voice ? window.interviewUrl(n) : null;
      if (voice && url) return { page: 'read', tableView: 'graph', dossierN: null, reader: { mode: 'interview', url, voice, ch: voice.ch } };
    }
    return { page: 'read', tableView: 'graph', dossierN: null, reader: null };
  }
  if (key === 'join') return { page: 'join', tableView: 'graph', dossierN: null, reader: null };
  return { page: 'cover', tableView: 'graph', dossierN: null, reader: null };
}

function profileSlug(n) {
  const v = window.INTERVIEWS?.find(iv => iv.n === n);
  if (!v) return String(n);
  return `${n}-${v.slug.replace(/_/g, '-')}`;
}

function stateToHash(page, tableView, dossierN, reader) {
  if (reader?.mode === 'interview' && reader.voice?.n) return `#read/interview/${profileSlug(reader.voice.n)}`;
  if (reader?.mode === 'chapter' && reader.ch) return `#read/ch/${reader.ch}`;
  if (dossierN) return `#profile/${profileSlug(dossierN)}`;
  if (page === 'table') return tableView && tableView !== 'table' ? `#table/${tableView}` : '#table';
  if (page === 'read') return '#read';
  if (page === 'join') return '#join';
  return '#cover';
}

function App() {
  const bp = useBreakpoint();
  const init = React.useMemo(parseHash, []);
  const [page,      setPage]      = React.useState(init.page);
  const [tableView, setTableView] = React.useState(init.tableView);
  const [dossierN,  setDossierN]  = React.useState(init.dossierN);
  // reader: null | { mode:'chapter', ch } | { mode:'interview', url, voice, ch }
  const [reader,    setReader]    = React.useState(init.reader);

  const skipHashChange = React.useRef(false);

  // State → hash sync
  React.useEffect(() => {
    const hash = stateToHash(page, tableView, dossierN, reader);
    if (window.location.hash !== hash) {
      skipHashChange.current = true;
      window.location.hash = hash;
    }
    window.scrollTo({ top: 0 });
  }, [page, tableView, dossierN, reader]);

  // Hash → state (browser back/forward)
  React.useEffect(() => {
    function onHashChange() {
      if (skipHashChange.current) { skipHashChange.current = false; return; }
      const s = parseHash();
      setPage(s.page);
      setTableView(s.tableView);
      setDossierN(s.dossierN);
      setReader(s.reader);
    }
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navTo = (p) => {
    setPage(p);
    setDossierN(null);
    setReader(null);
    if (p === 'table') setTableView('table');
  };

  const openDossier = (n) => {
    setDossierN(n);
    if (n) setPage('table');
  };

  const openChapterInterviews = (ch) => setReader({ mode: 'chapter', ch });
  const openInterview = (url, voice, ch) => setReader({ mode: 'interview', url, voice, ch });
  const closeReader = () => setReader(null);
  const backToChapter = () => setReader(r => r?.ch ? { mode: 'chapter', ch: r.ch } : null);

  const nextInterview = React.useCallback(() => {
    if (!reader || reader.mode !== 'interview') return;
    const currentN = reader.voice?.n;
    if (!currentN || currentN >= 81) return;
    const next = window.INTERVIEWS.find(v => v.n === currentN + 1);
    if (!next) return;
    const url = window.interviewUrl(next.n);
    if (url) setReader({ mode: 'interview', url, voice: next, ch: next.ch });
  }, [reader]);

  const hasNext = React.useMemo(() => {
    if (!reader || reader.mode !== 'interview') return false;
    const n = reader.voice?.n;
    return n > 0 && n < 81;
  }, [reader]);

  return (
    <BreakpointContext.Provider value={bp}>
      <window.Shell page={page} setPage={navTo}>
        {reader ? (
          reader.mode === 'chapter' ? (
            <window.ChapterInterviews
              ch={reader.ch}
              onBack={closeReader}
              onOpenInterview={(url, voice) => openInterview(url, voice, reader.ch)}
            />
          ) : (
            <window.MarkdownReader
              url={reader.url}
              onBack={backToChapter}
              onNext={nextInterview}
              hasNext={hasNext}
            />
          )
        ) : dossierN ? (
          <window.PersonDossier
            personN={dossierN}
            onClose={(next) => { if (next) setDossierN(next); else setDossierN(null); }}
          />
        ) : (
          <>
            {page === 'cover' && <window.Cover setPage={setPage} />}
            {page === 'table' && <window.TablePage setPage={setPage} onOpenDossier={openDossier} view={tableView} setView={setTableView} />}
            {page === 'read'  && <window.Read onOpenReader={openChapterInterviews} />}
            {page === 'join'  && <window.Join />}
          </>
        )}
      </window.Shell>
      <window.TweaksPanel />
    </BreakpointContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
