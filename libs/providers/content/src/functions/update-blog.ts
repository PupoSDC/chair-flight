import type { BlogPost } from "@cf/core/blog";
import type { ContentDb} from "../../drizzle";
import { contentSchema } from "../../drizzle";
import { makeDocument } from "./make-document";

export const updateBlog = async (db: ContentDb, blogPosts: BlogPost[]) => {
  await db
    .insert(contentSchema.blogPosts)
    .values(await Promise.all(blogPosts.map(makeDocument)))
    .onConflictDoNothing();
};
