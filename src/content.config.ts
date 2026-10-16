import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { manuscriptLoader } from './loaders/manuscript';

const chapterCollection = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/chapters' }),
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
  loader: glob({ pattern: '*.json', base: './src/content/voices' }),
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

const manuscriptCollection = defineCollection({
  loader: manuscriptLoader(),
  schema: z.object({
    n: z.number().int().min(1).max(9),
    kind: z.enum(['preview', 'full']),
    title: z.string(),
    dek: z.string(),
    words: z.number().int(),
    totalWords: z.number().int(),
    readMinutes: z.number().int(),
  }),
});

export const collections = {
  chapters: chapterCollection,
  voices: voiceCollection,
  manuscript: manuscriptCollection,
};
