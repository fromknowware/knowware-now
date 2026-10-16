// Atom 1.0 feed of the stories log, generated at build from the stories
// collection. Shape follows the RAM Index feed (ram-index.com/feed): same
// Atom skeleton, generator line, author, per-entry categories. Fixes its flaws:
// one entry per canonical story, never empty content, both <published> and
// <updated>, stable ids, and a cap on length.
import type { APIRoute } from 'astro';
import { SITE_NAME, SITE_URL, AUTHOR, PUBLISHER } from '../config';
import {
  FEED_CAP, GRADE_LABEL, LAYER_LABEL, SELECTION_NOTE,
  eventLine, formatDate, getPublishedStories, isoTimestamp, type Story,
} from '../lib/stories';

const FEED_URL = `${SITE_URL}/feed.xml`;
const STORIES_URL = `${SITE_URL}/stories`;
const LICENSE_URL = 'https://creativecommons.org/licenses/by/4.0/';

/** XML-escape, and drop characters XML 1.0 cannot carry. */
function esc(value: string): string {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function storyHtml(story: Story): string {
  const d = story.data;
  const flags = [d.simulation ? 'Simulation' : '', d.alleged ? 'Alleged' : ''].filter(Boolean);
  const caveats = d.caveats.length
    ? `<h3>Read with care</h3><ul>${d.caveats.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>`
    : '';
  const sources = d.sources
    .map((s) => `<li>${esc(s.publisher)}, <cite>${esc(s.label)}</cite>${s.date ? `, ${esc(formatDate(s.date))}` : ''}${s.primary ? ' (primary source)' : ''}. <a href="${esc(s.url)}">${esc(s.url)}</a></li>`)
    .join('');
  return [
    `<p><strong>Event:</strong> ${esc(eventLine(story))}. <strong>Added:</strong> ${esc(formatDate(d.added))}. <strong>Evidence grade ${d.grade}:</strong> ${esc(GRADE_LABEL[d.grade])}.${flags.length ? ` <strong>${esc(flags.join(', '))}.</strong>` : ''}</p>`,
    `<p>${esc(d.summary)}</p>`,
    `<p><strong>Missing layer: ${esc(LAYER_LABEL[d.missingLayer])}.</strong> ${esc(d.missingLayerLine)}</p>`,
    `<p><strong>Why it matters to the thesis:</strong> ${esc(d.why)}</p>`,
    caveats,
    `<h3>Sources</h3><ol>${sources}</ol>`,
    `<p><a href="${SITE_URL}/stories/${story.id}">Read the full cited write-up on ${esc(SITE_NAME)}</a></p>`,
    `<p><small>${esc(SELECTION_NOTE)}</small></p>`,
  ].join('');
}

function entryXml(story: Story): string {
  const d = story.data;
  const url = `${SITE_URL}/stories/${story.id}`;
  const content = storyHtml(story);
  if (!d.summary.trim() || !content.trim()) {
    throw new Error(`feed: story "${story.id}" would produce empty content`);
  }
  const published = isoTimestamp(d.added);
  const updated = isoTimestamp(d.updated ?? d.added);
  const categories = [
    `<category term="layer:${esc(d.missingLayer)}" label="Missing layer: ${esc(LAYER_LABEL[d.missingLayer])}" />`,
    `<category term="grade:${d.grade}" label="Evidence grade ${d.grade}" />`,
    ...(d.simulation ? ['<category term="simulation" />'] : []),
    ...(d.alleged ? ['<category term="alleged" />'] : []),
    ...d.tags.map((t) => `<category term="tag:${esc(t)}" />`),
  ];
  const related = d.sources
    .filter((s) => s.primary)
    .map((s) => `<link rel="related" type="text/html" href="${esc(s.url)}" title="${esc(`${s.publisher}: ${s.label}`)}" />`);
  return `  <entry>
    <id>${url}</id>
    <title type="text">${esc(d.headline)}</title>
    <link rel="alternate" type="text/html" href="${url}" />
    ${related.join('\n    ')}
    <published>${published}</published>
    <updated>${updated}</updated>
    <author><name>${esc(AUTHOR)}</name></author>
    <summary type="text">${esc(d.summary)}</summary>
    ${categories.join('\n    ')}
    <content type="html">${esc(content)}</content>
  </entry>`;
}

export const GET: APIRoute = async () => {
  const stories = (await getPublishedStories()).slice(0, FEED_CAP);
  if (stories.length === 0) throw new Error('feed: no published stories');

  // Feed-level <updated> is the newest entry change, so the file is stable
  // between builds unless an entry changes.
  const feedUpdated = stories
    .map((s) => isoTimestamp(s.data.updated ?? s.data.added))
    .sort()
    .at(-1)!;

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en">
  <id>${FEED_URL}</id>
  <title>${esc(SITE_NAME)} Stories</title>
  <subtitle>A running, cited log of real stories where systems coordinated or acted at speed and nobody held the knowing. Newest ${FEED_CAP} entries; each graded by evidence.</subtitle>
  <link rel="self" type="application/atom+xml" href="${FEED_URL}" />
  <link rel="alternate" type="text/html" href="${STORIES_URL}" />
  <updated>${feedUpdated}</updated>
  <generator uri="https://astro.build/" version="1.0">knowware-stories-feed/1.0 (astro)</generator>
  <author><name>${esc(AUTHOR)}</name><uri>${SITE_URL}</uri></author>
  <link rel="license" type="text/html" href="${LICENSE_URL}" />
  <rights>${esc(`© 2026 ${AUTHOR} / ${PUBLISHER}. Licensed CC BY 4.0. Each entry cites its sources; facts belong to those sources.`)}</rights>
${stories.map(entryXml).join('\n')}
</feed>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' },
  });
};
