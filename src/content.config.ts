import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Essays — the whole magazine is this one collection.
 *
 * Margin notes live in frontmatter, keyed by id. In the body, `[[id]]`
 * anchors a note to the sentence it annotates; the essay route renders
 * the marker inline and places the note in the outer margin beside
 * that paragraph (or as a tappable footnote on small screens).
 */
const essays = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/essays' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    section: z.enum(['Essay', 'Criticism', 'Reportage', 'Letter']),
    dek: z.string(),
    readingTime: z.number(), // minutes
    order: z.number(), // position in the issue TOC
    opening: z.string(), // first line, shown in the TOC margin preview
    bio: z.string(), // one-line contributor note
    notes: z
      .record(
        z.object({
          kind: z.enum(['author', 'editor']),
          text: z.string(),
        })
      )
      .default({}),
  }),
});

export const collections = { essays };
