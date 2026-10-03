import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const experience = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/experience" }),
  schema: z.object({
    title: z.string(),
    company: z.string(),
    location: z.string().optional(),
    start: z.string(),
    end: z.string(),
    description: z.string(),
    highlights: z.array(z.string()).optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string().optional(),
    video: z.string().optional(),
    stack: z.array(z.string()).optional(),
    github: z.string().optional(),
    demo: z.string().optional(),
  }),
});

export const collections = { experience, projects };
