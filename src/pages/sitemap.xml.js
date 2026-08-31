import { getCollection } from 'astro:content';

export async function GET() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  const base  = 'https://aitoolspot.net';

  const urls = [
    { loc: base, priority: '1.0', freq: 'daily' },
    { loc: `${base}/finder/`, priority: '0.9', freq: 'weekly' },
    { loc: `${base}/ai-prompts/`, priority: '0.9', freq: 'weekly' },
    { loc: `${base}/prompt-builder/`, priority: '0.8', freq: 'weekly' },
    { loc: `${base}/ai-cost-calculator/`, priority: '0.8', freq: 'weekly' },
    { loc: `${base}/free-ai-models/`, priority: '0.8', freq: 'weekly' },
    { loc: `${base}/ai-or-human/`, priority: '0.8', freq: 'weekly' },
    { loc: `${base}/ai-leaderboard/`, priority: '0.8', freq: 'weekly' },
    { loc: `${base}/ai-stack-builder/`, priority: '0.8', freq: 'weekly' },
    ...posts.map(p => ({
      loc:      `${base}/${p.slug}/`,
      priority: '0.8',
      freq:     'weekly',
      lastmod:  p.data.date,
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.priority}</priority>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
