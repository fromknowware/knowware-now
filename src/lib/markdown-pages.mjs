// Pages that also ship as Markdown (<path>.md), shared by the layout (for
// <link rel="alternate">), the build integration that writes the files, and
// llms.txt. `voices: true` marks pages whose text may include synthesized
// lines attributed to real people; their .md carries the disclosure.
export const MARKDOWN_PAGES = [
  { path: '/',           file: 'index.md',      label: 'Home',                  voices: true  },
  { path: '/definition', file: 'definition.md', label: 'Definition of knowware', voices: false },
  { path: '/method',     file: 'method.md',     label: 'Method',                voices: true  },
  { path: '/rules',      file: 'rules.md',      label: 'Editorial rules',       voices: true  },
  { path: '/colophon',   file: 'colophon.md',   label: 'Colophon',              voices: false },
  { path: '/read',       file: 'read.md',       label: 'Manuscript index',      voices: true  },
  { path: '/agents',     file: 'agents.md',     label: 'For agents',            voices: false },
];

export function markdownHrefFor(pathname) {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  const hit = MARKDOWN_PAGES.find((p) => p.path === clean);
  if (hit) return `/${hit.file}`;
  const chapter = clean.match(/^\/read\/(0[1-9]|x)$/);
  return chapter ? `/read/${chapter[1]}.md` : null;
}
