// Email sending via Resend. All calls are best-effort — a send failure never
// surfaces to the visitor or blocks order processing.
//
// Log format: label, HTTP status or error name. Never log addresses or keys.

export async function logResend(label, res, err) {
  if (err) return console.warn(`[resend] ${label}: send failed (${err?.name || 'error'})`);
  if (res.ok) return;
  let detail = '';
  try {
    const b = await res.json();
    detail = `${b.name || ''} ${String(b.message || '').slice(0, 160)}`.trim();
  } catch {}
  console.warn(`[resend] ${label}: ${res.status} ${detail}`);
}

// ─── Send ────────────────────────────────────────────────────────────────────

async function send(env, { to, subject, html, text }) {
  if (!env.RESEND_API_KEY) {
    console.warn('[resend] RESEND_API_KEY not set — skipping send');
    return;
  }
  let res, err;
  try {
    res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Knowware <orders@knowware.institute>',
        to: [to],
        subject,
        html,
        text,
      }),
      signal: AbortSignal.timeout(8000),
    });
  } catch (e) {
    err = e;
  }
  await logResend(subject.slice(0, 40), res, err);
}

// ─── Templates ───────────────────────────────────────────────────────────────

function preorderHtml({ name, orderId, orderDate, amountCents }) {
  const dollars = `$${(amountCents / 100).toFixed(2)}`;
  const greeting = name ? `${name}, your` : 'Your';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Pre-order confirmed — Knowware</title>
<style>
  body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
  table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
  body { margin: 0; padding: 0; background-color: #EDEEE4; }
  @media only screen and (max-width: 600px) {
    .outer { width: 100% !important; }
    .pad32 { padding-left: 20px !important; padding-right: 20px !important; }
    .hide-sm { display: none !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:#EDEEE4;">

<!-- Email wrapper -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
  style="background:#EDEEE4;">
<tr><td align="center" style="padding:24px 16px 48px;">

  <!-- Card -->
  <table class="outer" role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
    style="width:600px;background:#EDEEE4;">

    <!-- ── Header: ink bar ── -->
    <tr>
      <td style="background:#191938;padding:0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td class="pad32" style="padding:24px 32px 20px;">
              <p style="margin:0 0 6px;font-family:ui-monospace,'JetBrains Mono',monospace;
                font-size:10px;letter-spacing:0.08em;text-transform:uppercase;
                color:rgba(237,238,228,0.45);">
                The ARC Institute of Knowware
              </p>
              <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
                font-size:30px;font-weight:800;letter-spacing:-0.035em;line-height:1;
                text-transform:uppercase;color:#EDEEE4;">
                Knowware
              </p>
            </td>
            <td class="pad32 hide-sm" align="right"
              style="padding:24px 32px 20px;vertical-align:bottom;white-space:nowrap;">
              <p style="margin:0 0 4px;font-family:ui-monospace,'JetBrains Mono',monospace;
                font-size:10px;letter-spacing:0.02em;color:rgba(237,238,228,0.45);">
                Pre-order confirmed
              </p>
              <p style="margin:0;font-family:ui-monospace,'JetBrains Mono',monospace;
                font-size:12px;letter-spacing:-0.01em;color:#EDEEE4;">
                ${orderId}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- ── Signal stripe ── -->
    <tr>
      <td height="3" style="background:#2F55E0;font-size:0;line-height:0;">&nbsp;</td>
    </tr>

    <!-- ── Greeting ── -->
    <tr>
      <td class="pad32" style="padding:40px 32px 0;">
        <p style="margin:0 0 14px;font-family:ui-monospace,'JetBrains Mono',monospace;
          font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:#9a9a97;">
          ${orderDate}
        </p>
        <h1 style="margin:0 0 20px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
          font-size:34px;font-weight:800;letter-spacing:-0.03em;line-height:1.1;color:#191938;">
          ${greeting} copy is&nbsp;reserved.
        </h1>
        <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
          font-size:16px;line-height:1.65;letter-spacing:-0.01em;color:#191938;">
          Thank you for pre-ordering <em>Knowware: Systems of Intelligence</em>.
          You&#8217;ll be among the first to receive it when it ships on the Winter Solstice.
        </p>
      </td>
    </tr>

    <!-- ── Divider ── -->
    <tr>
      <td class="pad32" style="padding:28px 32px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td height="1" style="background:rgba(25,25,56,.14);font-size:0;line-height:0;"></td></tr>
        </table>
      </td>
    </tr>

    <!-- ── Order summary label ── -->
    <tr>
      <td class="pad32" style="padding:24px 32px 0;">
        <p style="margin:0 0 18px;font-family:ui-monospace,'JetBrains Mono',monospace;
          font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:#9a9a97;">
          Order summary
        </p>

        <!-- Book row -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="vertical-align:top;">
              <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
                font-size:15px;font-weight:600;letter-spacing:-0.01em;color:#191938;">
                Knowware: Systems of Intelligence
              </p>
              <p style="margin:5px 0 0;font-family:ui-monospace,'JetBrains Mono',monospace;
                font-size:11px;letter-spacing:-0.01em;color:#9a9a97;">
                Pre-order &middot; Digital edition &middot; 81 sessions
              </p>
            </td>
            <td align="right" style="vertical-align:top;white-space:nowrap;">
              <p style="margin:0;font-family:ui-monospace,'JetBrains Mono',monospace;
                font-size:15px;letter-spacing:-0.02em;color:#191938;">
                ${dollars}
              </p>
            </td>
          </tr>
        </table>

        <!-- Inner divider -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
          style="margin:16px 0;">
          <tr><td height="1" style="background:rgba(25,25,56,.14);font-size:0;line-height:0;"></td></tr>
        </table>

        <!-- Ship row -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td>
              <p style="margin:0;font-family:ui-monospace,'JetBrains Mono',monospace;
                font-size:11px;letter-spacing:0.01em;color:#9a9a97;">
                Ships
              </p>
            </td>
            <td align="right">
              <p style="margin:0;font-family:ui-monospace,'JetBrains Mono',monospace;
                font-size:11px;letter-spacing:-0.01em;color:#191938;">
                December 21, 2026 &middot; Winter Solstice
              </p>
              <p style="margin:4px 0 0;font-family:ui-monospace,'JetBrains Mono',monospace;
                font-size:10px;letter-spacing:0.01em;color:#9a9a97;text-align:right;">
                The longest night &#8212; the first thing humans ever learned to count.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- ── Divider ── -->
    <tr>
      <td class="pad32" style="padding:24px 32px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td height="1" style="background:rgba(25,25,56,.14);font-size:0;line-height:0;"></td></tr>
        </table>
      </td>
    </tr>

    <!-- ── CTA ── -->
    <tr>
      <td class="pad32" style="padding:28px 32px 44px;">
        <p style="margin:0 0 24px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
          font-size:15px;line-height:1.65;letter-spacing:-0.01em;color:#191938;">
          While you wait, three chapters and the full table of contents are open to read now.
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="background:#191938;">
              <a href="https://knowware.press/#table"
                style="display:inline-block;padding:14px 24px;
                  font-family:ui-monospace,'JetBrains Mono',monospace;
                  font-size:12px;letter-spacing:0.02em;
                  color:#EDEEE4;text-decoration:none;">
                Explore the book &#8594;
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- ── Footer ── -->
    <tr>
      <td class="pad32" style="padding:20px 32px 8px;
        border-top:1px solid rgba(25,25,56,.10);">
        <p style="margin:0 0 6px;font-family:ui-monospace,'JetBrains Mono',monospace;
          font-size:10px;letter-spacing:0.01em;line-height:1.6;color:#9a9a97;">
          You are receiving this because you pre-ordered Knowware at
          <a href="https://knowware.press" style="color:#9a9a97;">knowware.press</a>.
        </p>
        <p style="margin:0;font-family:ui-monospace,'JetBrains Mono',monospace;
          font-size:10px;letter-spacing:0.01em;color:#9a9a97;">
          &#169; 2026 The ARC Institute of Knowware
        </p>
      </td>
    </tr>

  </table>
  <!-- /Card -->

</td></tr>
</table>
<!-- /Email wrapper -->

</body>
</html>`;
}

function preorderText({ name, orderId, orderDate, amountCents }) {
  const dollars = `$${(amountCents / 100).toFixed(2)}`;
  const greeting = name ? `${name}, your` : 'Your';
  return `${greeting} copy of Knowware is reserved.

ORDER: ${orderId}
DATE:  ${orderDate}

Knowware: Systems of Intelligence
Pre-order · Digital edition · 81 sessions — ${dollars}

Ships: December 21, 2026 · Winter Solstice
(The longest night — the first thing humans ever learned to count.)

While you wait, three chapters and the full table of contents are open to read now:
https://knowware.press/#table

—
The ARC Institute of Knowware
knowware.press`;
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function sendPreorderConfirmation(env, order) {
  const email = order?.principal?.email;
  if (!email) return;

  const name = order?.agent?.name || '';
  const orderId = order.id;
  const amountCents = order.amountCents;
  const orderDate = new Date(order.paidAt || order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  await send(env, {
    to: email,
    subject: 'Pre-order confirmed — Knowware',
    html: preorderHtml({ name, orderId, orderDate, amountCents }),
    text: preorderText({ name, orderId, orderDate, amountCents }),
  });
}
