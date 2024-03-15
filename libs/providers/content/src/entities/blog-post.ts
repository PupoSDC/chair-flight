import { createInsertSchema } from "drizzle-zod";
import { contentSchema } from "../../drizzle";
import type { z } from "zod";

export const blogPostSchema = createInsertSchema(contentSchema.blogPosts);

export type BlogPost = z.infer<typeof blogPostSchema>;
