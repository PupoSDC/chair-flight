import { z } from "zod";

export const blogPostSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  author: z.string(),
  content: z.string(),
  tag: z.enum(["Technical", "Feature", "Content"]),
  imageUrl: z.string().optional(),
  date: z.date(),
});

export type BlogPost = z.infer<typeof blogPostSchema>;
