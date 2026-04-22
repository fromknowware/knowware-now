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
  React.useEffect(() => {
    try { localStorage.setItem('kw.page', page); } catch (e) {}
    window.scrollTo({ top: 0 });
  }, [page]);

  return (
    <BreakpointContext.Provider value={bp}>
      <window.Shell page={page} setPage={setPage}>
        {page === 'cover' && <window.Cover setPage={setPage} />}
        {page === 'table' && <window.TablePage setPage={setPage} />}
        {page === 'read'  && <window.Read />}
        {page === 'join'  && <window.Join />}
      </window.Shell>
      <window.TweaksPanel />
    </BreakpointContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
