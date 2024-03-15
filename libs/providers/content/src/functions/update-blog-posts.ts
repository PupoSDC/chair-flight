import { and, eq, ne } from "drizzle-orm";
import { contentSchema } from "../../drizzle";
import type { ContentDb } from "../../drizzle";
import type { BlogPost } from "../entities/blog-post";

export const updateBlogPosts = async (db: ContentDb, blogPosts: BlogPost[]) => {
  await db
    .insert(contentSchema.blogPosts)
    .values(blogPosts)
    .onConflictDoNothing();

  for (const post of blogPosts) {
    await db
      .update(contentSchema.blogPosts)
      .set(post)
      .where(
        and(
          eq(contentSchema.blogPosts.id, post.id),
          ne(contentSchema.blogPosts.hash, post.hash),
        ),
      );
  }

  return { success: true };
};
