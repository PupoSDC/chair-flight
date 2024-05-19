import { z } from "zod";

export const blogPostIdSchema = z.string();

export const blogPostSchema = z.object({
  id: blogPostIdSchema,
  createdAt: z.coerce.date(),
  title: z.string(),
  description: z.string(),
  author: z.string(),
  content: z.string(),
  tag: z.enum(["Technical", "Feature", "Content"]),
  imageUrl: z.string(),
});

export type BlogPostId = z.infer<typeof blogPostIdSchema>;
export type BlogPost = z.infer<typeof blogPostSchema>;
