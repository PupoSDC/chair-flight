import * as dz from "drizzle-orm/pg-core";
import { schema } from "./base.ts";
import type { QuestionTemplate } from "../../libs/core/question-templates/question-template.ts";

export const a320Chapters = schema.table(
  "a320_chapters",
  {
    id: dz.text().notNull(),
    title: dz.text().notNull(),
  },
  (t) => [dz.primaryKey({ columns: [t.id] })],
);

export const a320Questions = schema.table(
  "a320_questions",
  {
    id: dz.text().notNull(),
    chapter: dz
      .text()
      .notNull()
      .references(() => a320Chapters.id),
    preview: dz.text().notNull(),
    template: dz.jsonb().$type<QuestionTemplate>().notNull(),
  },
  (t) => [dz.primaryKey({ columns: [t.id] }), dz.index().on(t.chapter)],
);

export const a320QuestionsToQuestions = schema.table(
  "a320_questions_to_questions",
  {
    questionId: dz
      .text("question_id")
      .notNull()
      .references(() => a320Questions.id, { onDelete: "cascade" }),
    relatedQuestionId: dz
      .text("related_question_id")
      .notNull()
      .references(() => a320Questions.id, { onDelete: "cascade" }),
  },
  (t) => [dz.primaryKey({ columns: [t.questionId, t.relatedQuestionId] })],
);

export const a320Annexes = schema.table(
  "a320_annexes",
  {
    id: dz.text().notNull(),
    href: dz.text().notNull(),
    format: dz.text().notNull(),
    description: dz.text().notNull(),
    source: dz.text().notNull(),
  },
  (t) => [dz.primaryKey({ columns: [t.id] })],
);

export const a320QuestionsToAnnexes = schema.table(
  "a320_questions_to_annexes",
  {
    questionId: dz
      .text("question_id")
      .notNull()
      .references(() => a320Questions.id, { onDelete: "cascade" }),
    annexId: dz
      .text("annex_id")
      .notNull()
      .references(() => a320Annexes.id, { onDelete: "cascade" }),
  },
  (t) => [dz.primaryKey({ columns: [t.questionId, t.annexId] })],
);
