import {
  index,
  jsonb,
  pgEnum,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const contentStatusEnum = pgEnum("status", [
  "current",
  "outdated",
  "removed",
]);

const documentTable = (name: string) =>
  pgTable(
    name,
    {
      hash: varchar("hash", { length: 64 }).primaryKey().notNull(),
      id: varchar("id", { length: 12 }).notNull(),
      status: contentStatusEnum("status").notNull(),
      createdAt: timestamp("created_at").notNull(),
      document: jsonb("document").notNull(),
    },
    (table) => ({
      idIdx: index(`${name}_id_idx`).on(table.id),
    }),
  );

export const blogPosts = documentTable("blog_posts");

export const annexes = documentTable("question_bank_annexes");

export const courses = documentTable("question_bank_courses");

export const docs = documentTable("question_bank_docs");

export const subjects = documentTable("question_bank_subjects");

export const questionTemplates = documentTable(
  "question_bank_question_templates",
);

export const learningObjectives = documentTable(
  "question_bank_learning_objectives",
);

export const flashcardCollections = documentTable(
  "question_bank_flashcard_collections",
);
