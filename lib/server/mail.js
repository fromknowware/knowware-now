// Outgoing mail: one sender, one footer, and plain-text and HTML built from the same facts so
// they cannot drift. The site's Resend key is send-only on purpose; nothing here reads a list.
//   - RESEND_API_BASE can point only at api.resend.com or localhost (for the test mock).
//   - Every address in a message was typed by its owner and confirmed by a link; list mail
//     (interest, waitlist) additionally needs that list's own consent. See lib/server/reader.js.

import { CONTACT_EMAIL, POSTAL_ADDRESS, PRIVACY_URL, SITE_URL, WORK } from '../site-facts.mjs';
import { logResend } from './resend.js';

const BASE_RE = /^(https:\/\/api\.resend\.com|http:\/\/(localhost|127\.0\.0\.1)(:\d+)?)$/;

export const resendBase = (env) => (env.RESEND_API_BASE && BASE_RE.test(env.RESEND_API_BASE) ? env.RESEND_API_BASE : 'https://api.resend.com');
export const fromAddress = (env) => env.READER_FROM || env.CLAIM_NOTIFY_FROM || 'Knowware <onboarding@resend.dev>';

export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Footer lines every message carries. The postal address appears only once the author supplies it.
export function footerLines() {
  return [
    `Knowware, from ${WORK.publisher} · ${SITE_URL.replace('https://', '')}`,
    ...(POSTAL_ADDRESS ? [POSTAL_ADDRESS] : []),
    `Questions or removal: reply to this email or write to ${CONTACT_EMAIL}`,
    `Privacy: ${PRIVACY_URL}`,
  ];
}

// The confirmation email: the one message that proves an address belongs to the person typing it.
// `signin` is the same message for an address that already has an account (reading on a new device).
// `interest` adds one line saying the optional update list is switched on by this same click.
export function confirmEmail({ link, signin = false, interest = false, hours = 48 }) {
  const subject = signin ? 'Your Knowware sign-in link' : 'Confirm your email to keep reading Knowware';
  const lead = signin
    ? 'Someone asked to sign in to Knowware with this address. Open the link to read on this device.'
    : 'Someone entered this address on knowware.systems to keep reading. Open the link to confirm it is yours.';
  const extra = interest
    ? 'You also ticked the box for news about new chapters and the print edition. Confirming turns that on. You can turn it off any time.'
    : '';
  const fine = `The link works once and expires in ${hours} hours. If this was not you, ignore this email: nothing happens and we will not write again.`;
  const text = [lead, '', link, '', ...(extra ? [extra, ''] : []), fine, '', '--', ...footerLines()].join('\n');
  const html = [
    '<!doctype html><html lang="en"><body style="margin:0;padding:24px;background:#f6f4ee;color:#1a1a1a;font:16px/1.55 Helvetica,Arial,sans-serif">',
    '<div style="max-width:520px;margin:0 auto">',
    `<p style="margin:0 0 20px">${esc(lead)}</p>`,
    `<p style="margin:0 0 20px"><a href="${esc(link)}" style="display:inline-block;background:#1a1a1a;color:#ffffff;padding:12px 20px;text-decoration:none;font-weight:600">${signin ? 'Sign in and read' : 'Confirm and read'}</a></p>`,
    `<p style="margin:0 0 20px;font-size:14px;color:#444">Or paste this link into your browser:<br><a href="${esc(link)}" style="color:#1a1a1a;word-break:break-all">${esc(link)}</a></p>`,
    ...(extra ? [`<p style="margin:0 0 20px">${esc(extra)}</p>`] : []),
    `<p style="margin:0 0 24px;font-size:14px;color:#444">${esc(fine)}</p>`,
    '<hr style="border:0;border-top:1px solid #cfcab9;margin:0 0 16px">',
    `<p style="margin:0;font-size:13px;color:#555">${footerLines().map((l) => esc(l)).join('<br>')}</p>`,
    '</div></body></html>',
  ].join('');
  return { subject, text, html };
}

// Sends one message. Returns true when Resend accepted it, false otherwise (never throws, never
// logs the address, the link or the key: logResend records only a status and Resend's error name).
export async function sendMail(env, label, { to, subject, text, html, headers }) {
  if (!env.RESEND_API_KEY) return false;
  try {
    const res = await fetch(`${resendBase(env)}/emails`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: fromAddress(env), reply_to: CONTACT_EMAIL, to: [to], subject, text, html, ...(headers ? { headers } : {}) }),
    });
    await logResend(label, res);
    return res.ok;
  } catch (err) {
    await logResend(label, null, err);
    return false;
  }
}
