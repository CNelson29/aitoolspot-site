import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title:         z.string(),
    date:          z.string(),
    excerpt:       z.string(),
    category:      z.string().default('AI Tools'),
    tags:          z.array(z.string()).default([]),
    type:          z.enum(['review', 'comparison', 'guide', 'article']).default('article'),
    affiliate_link: z.string().optional(),
    rating:        z.number().optional(),
    image:         z.string().optional(),
    draft:         z.boolean().default(false),
  }),
});

export const collections = { posts };
