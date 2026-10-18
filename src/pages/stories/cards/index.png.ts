// /stories/cards/index.png: the social card for the /stories index.
import type { APIRoute } from 'astro';
import { getPublishedStories } from '../../../lib/stories';
import { renderIndexCard } from '../../../lib/story-card';

export const GET: APIRoute = async () => {
  const png = await renderIndexCard((await getPublishedStories()).length);
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
