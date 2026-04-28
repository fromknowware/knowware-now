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

function App() {
  const bp = useBreakpoint();
  const [page, setPage] = React.useState(() => {
    try { return localStorage.getItem('kw.page') || 'cover'; } catch (e) { return 'cover'; }
  });
  const [dossierN,    setDossierN]    = React.useState(null);
  // reader: null | { mode:'chapter', ch } | { mode:'interview', url, voice, ch }
  const [reader, setReader] = React.useState(null);

  React.useEffect(() => {
    try { localStorage.setItem('kw.page', page); } catch (e) {}
    window.scrollTo({ top: 0 });
  }, [page]);

  React.useEffect(() => {
    if (reader) window.scrollTo({ top: 0 });
  }, [reader]);

  const openDossier = (n) => {
    setDossierN(n);
    if (n) setPage('table');
  };

  const openChapterInterviews = (ch) => setReader({ mode: 'chapter', ch });
  const openInterview = (url, voice, ch) => setReader({ mode: 'interview', url, voice, ch });
  const closeReader = () => setReader(null);
  const backToChapter = () => setReader(r => r && r.ch ? { mode: 'chapter', ch: r.ch } : null);

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
      <window.Shell page={page} setPage={(p) => { setPage(p); setDossierN(null); setReader(null); }}>
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
            {page === 'table' && <window.TablePage setPage={setPage} onOpenDossier={openDossier} />}
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
