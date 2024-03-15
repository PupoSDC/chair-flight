import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { getEnvVariableOrThrow } from "@cf/base/env";
import { contentSchema, type ContentDb } from "../drizzle";
import { updateBlogPosts } from "./functions/update-blog-posts";
import type { BlogPost } from "./entities/blog-post";

export class Content {
  private static db: ContentDb;
  private static client: Client;

  constructor() {
    const schema = contentSchema;
    const pgProvider = getEnvVariableOrThrow("PROVIDER_POSTGRES_CONTENT");
    Content.client = new Client({ connectionString: pgProvider });
    Content.db = drizzle(Content.client, { schema });
    Content.client.connect();
  }

  public updateBlogPosts = (blogPosts: BlogPost[]) => {
    updateBlogPosts(Content.db, blogPosts);
  };
}
