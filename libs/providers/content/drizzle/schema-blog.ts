import { pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const blogPostTagEnum = pgEnum("tag", [
  "Technical",
  "Feature",
  "Content",
]);

export const blogPosts = pgTable("blog_posts", {
  id: varchar("id", { length: 64 }).primaryKey().notNull(),
  hash: varchar("hash", { length: 64 }).notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  author: text("author").notNull(),
  imageUrl: text("imageUrl"),
  content: text("content").notNull(),
  tag: blogPostTagEnum("tag").notNull(),
});
