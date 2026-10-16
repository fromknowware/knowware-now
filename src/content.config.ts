import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { manuscriptLoader } from './loaders/manuscript';

const chapterCollection = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/chapters' }),
  schema: z.object({
    n: z.number().int().min(1).max(10),
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
    n: z.number().int().min(1).max(10),
    kind: z.enum(['preview', 'full']),
    title: z.string(),
    dek: z.string(),
    words: z.number().int(),
    totalWords: z.number().int(),
    readMinutes: z.number().int(),
  }),
});

// A running, cited log of real stories. Entries are added by committing a file.
// The schema enforces the editorial rules so a bad entry fails the build:
// primary source required, grade C never published, at most two sentences of
// thesis framing, simulations and allegations flagged.
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const PARTIAL_DATE = /^\d{4}(-\d{2}(-\d{2})?)?$/;

const storySource = z.object({
  label: z.string().min(3),
  publisher: z.string().min(2),
  url: z.url().refine((u) => u.startsWith('https://'), 'source links must be https'),
  date: z.string().regex(PARTIAL_DATE).optional(),
  primary: z.boolean().default(false),
});

const storyCollection = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/stories' }),
  schema: z.object({
    headline: z.string().min(10),
    // When the event happened. Partial dates allowed (YYYY, YYYY-MM, YYYY-MM-DD).
    eventDate: z.string().regex(PARTIAL_DATE),
    // Optional wording for the date line when the date is a disclosure, not the event.
    eventDateLabel: z.string().optional(),
    added: z.string().regex(ISO_DATE),
    updated: z.string().regex(ISO_DATE).optional(),
    // One factual paragraph, taken only from the cited sources.
    summary: z.string().min(80),
    missingLayer: z.enum(['knowing', 'context', 'accountability', 'meaning', 'third-party']),
    missingLayerLine: z.string().min(20),
    why: z.string().min(40).refine(
      (s) => (s.match(/[.!?](\s|$)/g) ?? []).length <= 2,
      'why: at most two sentences',
    ),
    grade: z.enum(['A', 'B', 'C']),
    simulation: z.boolean().default(false),
    alleged: z.boolean().default(false),
    // Places where sources disagree, or what the entry deliberately does not claim.
    caveats: z.array(z.string().min(10)).default([]),
    tags: z.array(z.string().regex(/^[a-z0-9-]+$/)).default([]),
    sources: z.array(storySource).min(1),
    draft: z.boolean().default(false),
  }).superRefine((s, ctx) => {
    if (!s.sources.some((x) => x.primary)) {
      ctx.addIssue({ code: 'custom', path: ['sources'], message: 'at least one source must be marked primary' });
    }
    if (s.grade === 'C' && !s.draft) {
      ctx.addIssue({ code: 'custom', path: ['grade'], message: 'grade C leads must stay draft: true until verified' });
    }
    if (s.simulation && !/simulat/i.test(s.summary)) {
      ctx.addIssue({ code: 'custom', path: ['summary'], message: 'simulation: true entries must say "simulation" in the summary' });
    }
    if (s.alleged && !/alleg/i.test(s.summary)) {
      ctx.addIssue({ code: 'custom', path: ['summary'], message: 'alleged: true entries must use "alleged" in the summary' });
    }
  }),
});

export const collections = {
  chapters: chapterCollection,
  voices: voiceCollection,
  manuscript: manuscriptCollection,
  stories: storyCollection,
};
