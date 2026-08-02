import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

// output: 'hybrid' → todas las páginas siguen estáticas (prerender por defecto);
// solo las rutas que marcan `export const prerender = false` corren en serverless
// (las del checkout: /api/store/*).
export default defineConfig({
  site: 'https://aitoolspot.net',
  output: 'hybrid',
  adapter: vercel(),
  integrations: [
    tailwind({ applyBaseStyles: false }),
  ],
  markdown: {
    shikiConfig: { theme: 'github-dark' },
  },
});
