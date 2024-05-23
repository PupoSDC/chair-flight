import {
  index,
  jsonb,
  pgEnum,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import type {
  Annex,
  BlogPost,
  Course,
  Doc,
  FlashcardCollection,
  QuestionTemplate,
  Subject,
} from "@cf/core/content";

export const contentStatusEnum = pgEnum("status", [
  "current",
  "outdated",
  "removed",
]);

const documentTable = <T>(name: string) =>
  pgTable(
    name,
    {
      hash: varchar("hash", { length: 64 }).primaryKey().notNull(),
      id: varchar("id", { length: 32 }).notNull(),
      status: contentStatusEnum("status").notNull(),
      source: varchar("source", { length: 8 }).notNull(),
      createdAt: timestamp("created_at").notNull(),
      document: jsonb("document").notNull().$type<T>(),
    },
    (table) => ({
      idIdx: index(`${name}_id_idx`).on(table.id),
    }),
  );

export const blogPosts = documentTable<BlogPost>("blog_posts");

export const annexes = documentTable<Annex>("question_bank_annexes");

export const courses = documentTable<Course>("question_bank_courses");

export const docs = documentTable<Doc>("question_bank_docs");

export const subjects = documentTable<Subject>("question_bank_subjects");

export const questionTemplates = documentTable<QuestionTemplate>(
  "question_bank_question_templates",
);

export const learningObjectives = documentTable<QuestionTemplate>(
  "question_bank_learning_objectives",
);

export const flashcardCollections = documentTable<FlashcardCollection>(
  "question_bank_flashcard_collections",
);
