import { and, eq } from "drizzle-orm";
import { takeOneOrThrow } from "@cf/base/utils";
import { blogPostSchema } from "@cf/core/content";
import { contentSchema } from "../../drizzle";
import { Content } from "./content";

export class Blog extends Content {
  public async getBlogPosts() {
    const rows = await Content.db
      .select()
      .from(contentSchema.blogPosts)
      .where(eq(contentSchema.blogPosts.status, "current"))
      .execute();
    const posts = rows
      .map((row) => blogPostSchema.parse(row.document))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return { posts };
  }

  public async getBlogPost(id: string) {
    const row = await Content.db
      .select()
      .from(contentSchema.blogPosts)
      .where(
        and(
          eq(contentSchema.blogPosts.id, id),
          eq(contentSchema.blogPosts.status, "current"),
        ),
      )
      .execute()
      .then(takeOneOrThrow);
    const post = blogPostSchema.parse(row.document);
    return { post };
  }
}
