// Share texts for every published story. scripts/zernio-share.mjs reads this
// from the live site, so only stories that have been merged and deployed
// (human-approved) can be sent anywhere.
import type { APIRoute } from 'astro';
import { getPublishedStories, shareText, storyUrl } from '../../lib/stories';

export const GET: APIRoute = async () => {
  const stories = await getPublishedStories();
  const body = stories.map((s) => ({
    slug: s.id,
    url: storyUrl(s),
    headline: s.data.headline,
    grade: s.data.grade,
    text: shareText(s),
  }));
  return new Response(JSON.stringify(body, null, 2) + '\n', {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
