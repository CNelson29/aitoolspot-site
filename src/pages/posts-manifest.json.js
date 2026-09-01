import { getCollection } from 'astro:content';

// Lightweight manifest used client-side by /my-tools/ to render a signed-in
// user's bookmarked reviews (bookmarks are stored in Clerk unsafeMetadata, not
// a database — this manifest lets the browser resolve slug -> display data).
export async function GET() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  const manifest = posts.map((p) => ({
    slug: p.slug,
    title: p.data.title,
    excerpt: p.data.excerpt,
    rating: p.data.rating ?? null,
    image: p.data.image ?? null,
  }));
  return new Response(JSON.stringify(manifest), {
    headers: { 'Content-Type': 'application/json' },
  });
}
