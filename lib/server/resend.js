// The site's email calls are best-effort, so a rejection never reaches the visitor.
// Log it (status and Resend's error name, never addresses or keys) so it shows in Pages logs.
export async function logResend(label, res, err) {
  if (err) return console.warn(`[resend] ${label}: request failed (${String(err && err.name || 'error')})`);
  if (res.ok) return;
  let detail = '';
  try { const b = await res.json(); detail = `${b.name || ''} ${String(b.message || '').slice(0, 160)}`.trim(); } catch {}
  console.warn(`[resend] ${label}: ${res.status} ${detail}`);
}
