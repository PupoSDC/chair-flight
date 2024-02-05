import { z } from "zod";

export type BlogPost = {
  title: string;
  filename: string;
  description: string;
  author: string;
  date: string;
  imageUrl: string | null;
  content: string;
  tag: "Technical" | "Feature" | "Content";
};

export const blogPostSchema: z.ZodSchema<BlogPost> = z.object({
  title: z.string(),
  filename: z.string(),
  description: z.string(),
  author: z.string(),
  date: z.string(),
  imageUrl: z.string().nullable(),
  content: z.string(),
  tag: z.enum(["Technical", "Feature", "Content"]),
});
