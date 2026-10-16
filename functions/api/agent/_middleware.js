// Applies the shared shield (kill switch, error shield, strict headers) to every route in this folder.
import { shielded } from '../../../lib/server/shield.js';

export const onRequest = (context) => shielded(context, (c) => c.next());
