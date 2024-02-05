import { z } from "zod";
import type { BlogPost } from "@chair-flight/base/types";

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
