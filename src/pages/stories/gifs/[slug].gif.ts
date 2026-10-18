// /stories/gifs/<slug>.gif: the story diagram as a branded looping GIF, for saving and sharing.
import type { APIRoute } from 'astro';
import { getPublishedStories } from '../../../lib/stories';
import { renderStoryGif } from '../../../lib/story-gif';

export async function getStaticPaths() {
  const stories = await getPublishedStories();
  return stories.map((story) => ({ params: { slug: story.id }, props: { story } }));
}

export const GET: APIRoute = async ({ props }) => {
  const gif = await renderStoryGif(props.story);
  return new Response(gif, { headers: { 'Content-Type': 'image/gif' } });
};
