import { contentSchema } from "../../drizzle";
import { makeDocument } from "./make-document";
import type { ContentDb } from "../../drizzle";
import type { BlogPost } from "@cf/core/blog";

export const updateBlog = async (db: ContentDb, blogPosts: BlogPost[]) => {
  await db
    .insert(contentSchema.blogPosts)
    .values(await Promise.all(blogPosts.map(makeDocument)))
    .onConflictDoNothing();
};
