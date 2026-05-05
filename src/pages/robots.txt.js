export async function GET() {
  const body = `User-agent: *
Allow: /

Sitemap: https://aitoolspot.net/sitemap.xml
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
}
