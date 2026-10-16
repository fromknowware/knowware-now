// Shield for the Stripe webhook: error shield and strict headers, but exempt from the
// kill switch so events for payments already in flight are never dropped.
import { shielded } from '../../../lib/server/shield.js';

export const onRequest = (context) => shielded(context, (c) => c.next(), { exemptFromKillSwitch: true });
