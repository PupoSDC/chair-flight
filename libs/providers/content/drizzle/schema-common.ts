import { pgTable, text } from "drizzle-orm/pg-core";

export const comments = pgTable("comments", {
  id: text("id").primaryKey().notNull(),
});
