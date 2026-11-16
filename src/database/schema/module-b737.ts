import * as dz from "drizzle-orm/pg-core";
import { schema } from "./base.ts";
import type { QuestionTemplate } from "../../libs/core/question-templates/question-template.ts";

export const b737Chapters = schema.table(
  "b737_chapters",
  {
    id: dz.text().notNull(),
    title: dz.text().notNull(),
    content: dz.text().notNull(),
  },
  (t) => [dz.primaryKey({ columns: [t.id] })],
);

export const b737Questions = schema.table(
  "b737_questions",
  {
    id: dz.text().notNull(),
    chapter: dz
      .text()
      .notNull()
      .references(() => b737Chapters.id),
    preview: dz.text().notNull(),
    template: dz.jsonb().$type<QuestionTemplate>().notNull(),
  },
  (t) => [dz.primaryKey({ columns: [t.id] }), dz.index().on(t.chapter)],
);

export const b737Annexes = schema.table(
  "b737_annexes",
  {
    id: dz.text().notNull(),
    href: dz.text().notNull(),
    format: dz.text().notNull(),
    description: dz.text().notNull(),
    source: dz.text().notNull(),
  },
  (t) => [dz.primaryKey({ columns: [t.id] })],
);

export const b737QuestionsToQuestions = schema.table(
  "b737_questions_to_questions",
  {
    questionId: dz
      .text("question_id")
      .notNull()
      .references(() => b737Questions.id, { onDelete: "cascade" }),
    relatedQuestionId: dz
      .text("related_question_id")
      .notNull()
      .references(() => b737Questions.id, { onDelete: "cascade" }),
  },
  (t) => [dz.primaryKey({ columns: [t.questionId, t.relatedQuestionId] })],
);

export const b737QuestionsToAnnexes = schema.table(
  "b737_questions_to_annexes",
  {
    questionId: dz
      .text("question_id")
      .notNull()
      .references(() => b737Questions.id, { onDelete: "cascade" }),
    annexId: dz
      .text("annex_id")
      .notNull()
      .references(() => b737Annexes.id, { onDelete: "cascade" }),
  },
  (t) => [dz.primaryKey({ columns: [t.questionId, t.annexId] })],
);
