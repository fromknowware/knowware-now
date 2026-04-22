// App root

function App() {
  const [page, setPage] = React.useState(() => {
    try { return localStorage.getItem('kw.page') || 'cover'; } catch (e) { return 'cover'; }
  });
  React.useEffect(() => {
    try { localStorage.setItem('kw.page', page); } catch (e) {}
    window.scrollTo({ top: 0 });
  }, [page]);

  return (
    <>
      <window.Shell page={page} setPage={setPage}>
        {page === 'cover' && <window.Cover setPage={setPage} />}
        {page === 'table' && <window.TablePage setPage={setPage} />}
        {page === 'read' && <window.Read />}
        {page === 'join' && <window.Join />}
      </window.Shell>
      <window.TweaksPanel />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
