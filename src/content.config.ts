import { defineCollection, z } from 'astro:content';

const chapterCollection = defineCollection({
  type: 'content',
  schema: z.object({
    n: z.number().int().min(1).max(9),
    title: z.string(),
    opener: z.string(),
    diagram: z.object({
      title: z.string(),
      caption: z.string(),
      nodes: z.array(z.object({
        id: z.string(),
        label: z.string(),
        pos: z.tuple([z.number(), z.number()]),
        latent: z.boolean().optional(),
      })),
      arcs: z.array(z.object({
        from: z.string(),
        to: z.string(),
        label: z.string().optional(),
        kind: z.enum(['latent']).optional(),
      })),
    }).optional(),
  }),
});

const voiceCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    alias: z.string(),
    chapter: z.number().int().min(1).max(9),
    tier: z.enum(['A', 'P', 'V']),
    status: z.enum(['alive', 'passed', 'anon']),
    tag: z.enum(['legacy', 'new', 'origin']).optional(),
    flag: z.enum(['old', 'new', 'missing']),
    affiliation: z.string().optional(),
    active: z.string().optional(),
    jurisdiction: z.string().optional(),
    role: z.string(),
    awards: z.array(z.string()).optional(),
    works: z.array(z.string()).optional(),
    knownFor: z.array(z.string()).optional(),
    coldOpen: z.string().optional(),
    bio: z.string().optional(),
    whyMatters: z.string().optional(),
  }),
});

export const collections = {
  chapters: chapterCollection,
  voices: voiceCollection,
};
