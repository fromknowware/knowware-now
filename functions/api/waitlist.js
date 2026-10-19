// POST /api/waitlist {email} — ask to join the pre-order list (one email when pre-orders open).
// Typing an address sends ONE confirmation link; the address is on the list only after the link is
// used (/api/list/confirm). The pre-order list and the news list are separate: this never joins
// the other. Browser callers only, small bodies, honeypot, per-connection and per-address limits.

import { listJoinHandler } from '../../lib/server/list-endpoint.js';
import { guard } from '../../lib/server/shield.js';

const handle = listJoinHandler('waitlist', { sentPath: '/order/listed', backPath: '/order#waitlist', bucket: 'waitlist' });

export const onRequest = guard(handle, { exemptFromKillSwitch: true }); // not part of the agent API
