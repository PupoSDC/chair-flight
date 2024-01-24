import { z } from "zod";

export const blogMetaSchema = z.object({
  title: z.string(),
  filename: z.string(),
  description: z.string(),
  author: z.string(),
  date: z.string(),
  imageUrl: z.string().optional(),
  tag: z.enum(["Technical", "Feature", "Content"]),
});

export type BlogMeta = z.infer<typeof blogMetaSchema>;
