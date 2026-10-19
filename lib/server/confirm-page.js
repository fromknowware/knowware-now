// The page behind an emailed confirmation link: one button, no script. Opening it changes
// nothing, so a mail scanner that fetches every link cannot confirm an address on someone's behalf.
// The referrer policy must NOT be "no-referrer": browsers then send "Origin: null" on this page's
// form POST, and the endpoint (rightly) refuses it. "strict-origin" still keeps the token out of
// any Referer header: only the bare origin is ever sent.
// `headers` are the site's page headers (lib/generated/page-headers.js, built with the site).

import { esc } from './mail.js';

export function confirmPage(headers, { heading, lead, action, token, button, actions }) {
  // `actions` renders several buttons that each submit a choice named "what" (the removal page).
  const buttons = actions
    ? actions.map((a) => `<button type="submit" name="what" value="${esc(a.value)}"${a.danger ? ' class="danger"' : ''}>${esc(a.label)}</button>`).join(' ')
    : `<button type="submit">${esc(button)}</button>`;
  const body = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><meta name="referrer" content="strict-origin">
<title>${esc(heading)} — Knowware</title>
<style>
  body{margin:0;background:#f6f4ee;color:#1a1a1a;font:18px/1.55 "Helvetica Neue",Helvetica,Arial,sans-serif}
  main{max-width:34rem;margin:0 auto;padding:12vh 16px 48px}
  h1{font-size:1.6rem;line-height:1.2;margin:0 0 .75rem}
  p{margin:0 0 1.25rem}
  form button{margin:0 .5rem .75rem 0}
  button{font:inherit;font-weight:600;background:#1a1a1a;color:#fff;border:2px solid #1a1a1a;padding:.75rem 1.4rem;min-height:48px;cursor:pointer}
  button:hover{background:#fff;color:#1a1a1a}
  button.danger{background:#fff;color:#8a1c1c;border-color:#8a1c1c}
  button.danger:hover{background:#8a1c1c;color:#fff}
  :focus-visible{outline:3px solid #0b57d0;outline-offset:3px}
  .fine{font-size:.9rem;color:#444}
</style></head><body><main>
<h1>${esc(heading)}</h1>
<p>${lead}</p>
<form method="post" action="${esc(action)}"><input type="hidden" name="t" value="${esc(token)}">${buttons}</form>
<p class="fine" style="margin-top:1.5rem">Not you? Close this page. Nothing happens until you press the button.</p>
</main></body></html>`;
  return new Response(body, {
    headers: {
      ...headers,
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Referrer-Policy': 'strict-origin',
      'X-Robots-Tag': 'noindex',
    },
  });
}
