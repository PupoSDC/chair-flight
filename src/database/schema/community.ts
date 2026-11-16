import { sql } from "drizzle-orm";
import * as dz from "drizzle-orm/pg-core";
import { schema } from "./base.ts";

export const profiles = schema.table(
  "profiles",
  {
    id: dz.uuid().primaryKey(),
    username: dz.text().notNull(),
    role: dz.text().$type<"user" | "admin">().notNull().default("user"),
    createdAt: dz
      .timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [dz.uniqueIndex().on(sql`lower(${t.username})`)],
);

export const commentVotes = schema.table(
  "comment_votes",
  {
    commentId: dz
      .uuid("comment_id")
      .notNull()
      .references(() => questionComments.id, { onDelete: "cascade" }),
    userId: dz
      .uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    value: dz.smallint().notNull(),
    createdAt: dz
      .timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [dz.primaryKey({ columns: [t.commentId, t.userId] })],
);

export const questionComments = schema.table(
  "question_comments",
  {
    id: dz.uuid().primaryKey().defaultRandom(),
    questionBank: dz.text("question_bank").notNull(),
    questionId: dz.text("question_id").notNull(),
    parentId: dz
      .uuid("parent_id")
      .references((): dz.AnyPgColumn => questionComments.id, {
        onDelete: "cascade",
      }),
    depth: dz.smallint().notNull(),
    authorId: dz
      .uuid("author_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    body: dz.text().notNull(),
    status: dz
      .text()
      .$type<"pending" | "approved" | "rejected">()
      .notNull()
      .default("pending"),
    createdAt: dz
      .timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    reviewedAt: dz.timestamp("reviewed_at", { withTimezone: true }),
    reviewedBy: dz.uuid("reviewed_by").references(() => profiles.id, {
      onDelete: "set null",
    }),
  },
  (t) => [
    dz.index().on(t.questionBank, t.questionId, t.createdAt),
    dz.index().on(t.status, t.createdAt),
    dz.index().on(t.authorId),
  ],
);
