// /stories/gifs/still/<slug>.png: one frame of the GIF, same layout, for reduced-motion readers.
import type { APIRoute } from 'astro';
import { getPublishedStories } from '../../../../lib/stories';
import { renderStoryStill } from '../../../../lib/story-gif';

export async function getStaticPaths() {
  const stories = await getPublishedStories();
  return stories.map((story) => ({ params: { slug: story.id }, props: { story } }));
}

export const GET: APIRoute = async ({ props }) => {
  const png = await renderStoryStill(props.story);
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
