export const SITE_NAME = 'Knowware';
export const SITE_TAGLINE = 'Systems of Intelligence';
export const SITE_URL = 'https://knowware.systems';
export const AUTHOR = 'Khayyam Wakil';
export const PUBLISHER = 'The ARC Institute of Knowware';
export const EDITION = 'Ed. 01 · MMXXVI';

export const DEADLINE = '2026-12-21T23:59:59-05:00';
export const DEADLINE_LABEL = 'Solstice';

export const PRICE_PREORDER = '$33';
export const PRICE_PRINT = '$44.95';
export const PRICE_DIGITAL = '$11.95';
export const PRICE_SAVING = '$11.95 off at print';

export const VOICES_COUNT = 81;
export const CHAPTERS_COUNT = 9;

// Stripe payment link — set when live
export const STRIPE_URL = '/order';

// Whether a real checkout exists. While false, no machine-readable offer is
// published (no schema.org Offer, no "available" signal) and the agent
// checkout endpoint stays in test mode. Flip only with live Stripe wired up.
export const CHECKOUT_OPEN = false;

// Agent tokens (and so the full-chapter API for agents) need working confirmation
// emails. Until the author has set AGENT_TOKENS=on and RESEND_API_KEY in Cloudflare,
// the site says "not open yet" everywhere. Flip this with the runtime flag.
export const AGENT_TOKENS_OPEN = false;

// While there is no checkout, every pre-order button leads to the waiting list.
export const ORDER_HREF = CHECKOUT_OPEN ? STRIPE_URL : '/order#waitlist';
export const ORDER_CTA = CHECKOUT_OPEN ? `Pre-order · ${PRICE_PREORDER} →` : 'Pre-order list →';

export const CONTACT_EMAIL = 'hello@knowware.systems';

export const OG_IMAGE = `${SITE_URL}/assets/og-knowware.png`;
export const OG_COVER = `${SITE_URL}/assets/og-knowware-cover.png`;
