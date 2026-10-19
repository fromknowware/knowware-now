// POST /api/interest {email} — ask for news about new chapters and the print edition.
// Same shape as /api/waitlist, and a separate list: one confirmation link, a member only after it
// is used. The chapter gate has its own unticked box for the same list (see /api/reader).

import { listJoinHandler } from '../../lib/server/list-endpoint.js';
import { guard } from '../../lib/server/shield.js';

const handle = listJoinHandler('interest', { sentPath: '/read/sent/', backPath: '/read/#news' });

export const onRequest = guard(handle, { exemptFromKillSwitch: true });
