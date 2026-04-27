import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  posts.sort((a, b) => a.data.date < b.data.date ? 1 : -1);

  return rss({
    title: 'AIToolSpott — AI Tool Reviews',
    description: 'Honest AI tool reviews, comparisons, and guides. Updated daily.',
    site: context.site ?? 'https://aitoolspot.net',
    items: posts.map(post => {
      const d = new Date(post.data.date);
      return {
        title:       post.data.title,
        description: post.data.excerpt,
        link:        `/${post.slug}/`,
        pubDate:     isNaN(d.getTime()) ? new Date() : d,
      };
    }),
    customData: '<language>en-us</language>',
  });
}
