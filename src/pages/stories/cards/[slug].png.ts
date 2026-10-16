// /stories/cards/<slug>.png: the social card shown when a story is shared.
import type { APIRoute } from 'astro';
import { getPublishedStories } from '../../../lib/stories';
import { renderStoryCard } from '../../../lib/story-card';

export async function getStaticPaths() {
  const stories = await getPublishedStories();
  return stories.map((story) => ({ params: { slug: story.id }, props: { story } }));
}

export const GET: APIRoute = async ({ props }) => {
  const png = await renderStoryCard(props.story);
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
