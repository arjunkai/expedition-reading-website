import { defineCollection, z } from "astro:content";
import { file, glob } from "astro/loaders";

const stats = defineCollection({
  loader: file("src/content/stats.json"),
  schema: z.object({
    id: z.string(),
    booksDelivered: z.number().int().positive(),
    schools: z.number().int().positive(),
    volunteerHours: z.number().int().positive(),
    asOf: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  }),
});

// Per-entry schema (Astro's file() loader applies the schema to each entry, not the array).
const values = defineCollection({
  loader: file("src/content/values/values.json"),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    order: z.number().int(),
  }),
});

const programs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/programs" }),
  schema: z.object({
    name: z.string(),
    summary: z.string(),
    accentColor: z.enum(["gold", "teal", "red"]),
    order: z.number().int(),
  }),
});

const team = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/team" }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    bio: z.string(),
    order: z.number().int(),
    photo: z.string().optional(),
  }),
});

const partners = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/partners" }),
  schema: z.object({
    name: z.string(),
    url: z.string().url().optional(),
    blurb: z.string(),
    order: z.number().int(),
  }),
});

export const collections = { stats, values, programs, team, partners };
