// Cookies and redirects shared by the reader endpoints.

import { ACCESS_TTL_S } from './reader.js';

// kw_reader is the access token (HttpOnly). kw_reader_ui is a harmless flag so the static pages
// can swap the sign-up form for "continue reading" without being able to read the token.
export function accessCookies(token, maxAge = ACCESS_TTL_S) {
  return [
    `kw_reader=${token}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`,
    `kw_reader_ui=1; Path=/; Max-Age=${maxAge}; Secure; SameSite=Lax`,
  ];
}

export const CLEAR_COOKIES = [
  'kw_reader=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax',
  'kw_reader_ui=; Path=/; Max-Age=0; Secure; SameSite=Lax',
];

export function redirect(location, cookies = [], status = 302) {
  const headers = new Headers({ Location: location, 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' });
  cookies.forEach((c) => headers.append('Set-Cookie', c));
  return new Response(null, { status, headers });
}
