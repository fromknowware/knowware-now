// Shared helpers for the /stories log and its Atom feed.
import { getCollection, type CollectionEntry } from 'astro:content';
import { SITE_URL } from '../config';

export type Story = CollectionEntry<'stories'>;

export const FEED_CAP = 100;

export const LAYER_LABEL: Record<Story['data']['missingLayer'], string> = {
  knowing: 'Knowing',
  context: 'Context',
  accountability: 'Accountability',
  meaning: 'Meaning',
  'third-party': 'The affected third party',
};

export const GRADE_LABEL: Record<Story['data']['grade'], string> = {
  A: 'Primary source read for this entry',
  B: 'Reputable reporting; primary source not yet read',
  C: 'Lead; not published until verified',
};

export const SELECTION_NOTE =
  'How entries are chosen and graded: a story is logged only if a system coordinated or acted at speed, nobody held the knowing, and a primary source is cited. Grade A means the primary source was read for the entry; B means reputable reporting with the primary not yet read; C is a lead and is never published. Stories are not synthesized: every claim comes from the linked sources.';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** "2012-08-01" -> "August 1, 2012"; "2026-07" -> "July 2026"; "2025" -> "2025". */
export function formatDate(d: string): string {
  const [y, m, day] = d.split('-');
  if (!m) return y;
  const month = MONTHS[Number(m) - 1];
  return day ? `${month} ${Number(day)}, ${y}` : `${month} ${y}`;
}

/** Atom wants a full timestamp; partial dates are padded to the first of the period. */
export function isoTimestamp(d: string): string {
  const [y, m = '01', day = '01'] = d.split('-');
  return `${y}-${m}-${day}T00:00:00Z`;
}

export function eventLine(s: Story): string {
  return s.data.eventDateLabel ?? formatDate(s.data.eventDate);
}

export function primarySources(s: Story) {
  return s.data.sources.filter((x) => x.primary);
}

export function storyUrl(s: Story): string {
  return `${SITE_URL}/stories/${s.id}`;
}

// X counts any link as 23 characters; every other network allows more.
const SHARE_LIMIT = 280;
const LINK_WEIGHT = 23;

/**
 * The one share text for a story, used by the on-page share block. Shares are where context gets stripped, so the
 * grade and any simulation or allegation flag travel with the headline.
 */
export function shareText(s: Story): string {
  const d = s.data;
  const flags = [d.simulation ? 'Simulation' : '', d.alleged ? 'Alleged' : ''].filter(Boolean);
  const text = [
    d.headline,
    `Missing layer: ${LAYER_LABEL[d.missingLayer]}. Evidence grade ${d.grade}${flags.length ? `, ${flags.join(', ').toLowerCase()}` : ''}.`,
    storyUrl(s),
  ].join('\n\n');
  const weighted = text.length - storyUrl(s).length + LINK_WEIGHT;
  if (weighted > SHARE_LIMIT) {
    throw new Error(`stories: share text for "${s.id}" is ${weighted} characters (limit ${SHARE_LIMIT}). Shorten the headline.`);
  }
  return text;
}

function canonicalUrl(u: string): string {
  const url = new URL(u);
  url.hash = '';
  for (const k of [...url.searchParams.keys()]) {
    if (/^(utm_|fbclid|gclid|ref$)/i.test(k)) url.searchParams.delete(k);
  }
  return (url.hostname.replace(/^www\./, '') + url.pathname.replace(/\/+$/, '') + url.search).toLowerCase();
}

/**
 * The build's "today" (UTC, YYYY-MM-DD). STORIES_TODAY overrides it so a
 * release can be previewed or tested without waiting for the date.
 */
export function releaseDate(): string {
  const override = process.env.STORIES_TODAY;
  if (override) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(override)) throw new Error(`STORIES_TODAY must be YYYY-MM-DD, got "${override}"`);
    return override;
  }
  return new Date().toISOString().slice(0, 10);
}

let announced = false;

/**
 * Published stories, newest first (date added, then event date). A story whose
 * `added` date is still in the future is scheduled: it is validated like any
 * other entry but left out of every page, card, feed entry and sitemap URL
 * until the first build on or after that date (see the scheduled deploy).
 * Fails the build if two entries rest on the same primary source: one
 * canonical story gets one entry, and further outlets are added as sources.
 */
export async function getPublishedStories(): Promise<Story[]> {
  const today = releaseDate();
  const live = (await getCollection('stories')).filter((s) => !s.data.draft);
  const all = live.filter((s) => s.data.added <= today);
  if (!announced) {
    announced = true;
    const held = live.filter((s) => s.data.added > today).map((s) => `${s.id} (${s.data.added})`);
    if (held.length) console.info(`stories: ${held.length} scheduled, not released yet: ${held.join(', ')}`);
  }
  // Checked for every entry, scheduled or not, so a problem surfaces when the
  // file is committed and not on the morning the story is due to go out.
  const seen = new Map<string, string>();
  for (const s of live) {
    shareText(s);
    for (const p of primarySources(s)) {
      const key = canonicalUrl(p.url);
      const other = seen.get(key);
      if (other && other !== s.id) {
        throw new Error(`stories: "${s.id}" and "${other}" share the primary source ${p.url}. Merge them into one entry.`);
      }
      seen.set(key, s.id);
    }
  }
  return all.sort((a, b) =>
    b.data.added.localeCompare(a.data.added) ||
    b.data.eventDate.localeCompare(a.data.eventDate) ||
    a.id.localeCompare(b.id));
}

/**
 * The index order: newest event first, so the page reads as a chronology of
 * what happened. "Added" is shown separately and never changed; the feed keeps
 * its own order (date added) because that is when each entry was published.
 */
export async function getStoriesByEvent(): Promise<Story[]> {
  return (await getPublishedStories()).sort((a, b) =>
    isoTimestamp(b.data.eventDate).localeCompare(isoTimestamp(a.data.eventDate)) ||
    a.id.localeCompare(b.id));
}
