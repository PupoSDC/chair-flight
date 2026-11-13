import * as dz from "drizzle-orm/pg-core";
import { schema } from "./base.ts";
import type { QuestionVariant } from "../../libs/core/question-bank/question-variant.ts";

export const subjects = schema.table(
  "subjects",
  {
    questionBank: dz.text("question_bank").notNull(),
    id: dz.text().notNull(),
    longName: dz.text("long_name").notNull(),
    shortName: dz.text("short_name").notNull(),
    numberOfExamQuestions: dz.integer("number_of_exam_questions").notNull(),
    numberOfExamMinutes: dz.integer("number_of_exam_minutes").notNull(),
    numberOfQuestions: dz.integer("number_of_questions").notNull(),
  },
  (t) => [dz.primaryKey({ columns: [t.questionBank, t.id] })],
);

export const courses = schema.table(
  "courses",
  {
    questionBank: dz.text("question_bank").notNull(),
    id: dz.text().notNull(),
    text: dz.text().notNull(),
  },
  (t) => [dz.primaryKey({ columns: [t.questionBank, t.id] })],
);

export const learningObjectives = schema.table(
  "learning_objectives",
  {
    questionBank: dz.text("question_bank").notNull(),
    id: dz.text().notNull(),
    parentId: dz.text("parent_id"),
    subject: dz.text().notNull(),
    docId: dz.text("doc_id").notNull(),
    courses: dz.text().array().notNull(),
    text: dz.text().notNull(),
    source: dz.text().notNull(),
    numberOfQuestions: dz.integer("number_of_questions").notNull(),
  },
  (t) => [
    dz.primaryKey({ columns: [t.questionBank, t.id] }),
    dz.index().on(t.questionBank, t.parentId),
    dz.index().on(t.questionBank, t.docId),
  ],
);

export const docs = schema.table(
  "docs",
  {
    questionBank: dz.text("question_bank").notNull(),
    id: dz.text().notNull(),
    parentId: dz.text("parent_id"),
    subject: dz.text(),
    title: dz.text().notNull(),
    description: dz.text().notNull(),
    content: dz.text().notNull(),
    empty: dz.boolean().notNull(),
  },
  (t) => [
    dz.primaryKey({ columns: [t.questionBank, t.id] }),
    dz.index().on(t.questionBank, t.parentId),
  ],
);

export const questions = schema.table(
  "questions",
  {
    questionBank: dz.text("question_bank").notNull(),
    id: dz.text().notNull(),
    docId: dz.text("doc_id").notNull(),
    subjects: dz.text().array().notNull(),
    learningObjectives: dz.text("learning_objectives").array().notNull(),
    annexes: dz.text().array().notNull(),
    relatedQuestions: dz.text("related_questions").array().notNull(),
    externalIds: dz.text("external_ids").array().notNull(),
    explanation: dz.text().notNull(),
    preview: dz.text().notNull(),
    variant: dz.jsonb().$type<QuestionVariant>().notNull(),
  },
  (t) => [
    dz.primaryKey({ columns: [t.questionBank, t.id] }),
    dz.index().on(t.questionBank, t.docId),
    dz.index().using("gin", t.learningObjectives),
    dz.index().using("gin", t.subjects),
  ],
);

export const annexes = schema.table(
  "annexes",
  {
    questionBank: dz.text("question_bank").notNull(),
    id: dz.text().notNull(),
    href: dz.text().notNull(),
    format: dz.text().notNull(),
    description: dz.text().notNull(),
    source: dz.text().notNull(),
    subjects: dz.text().array().notNull(),
    learningObjectives: dz.text("learning_objectives").array().notNull(),
    questions: dz.text().array().notNull(),
    docs: dz.text().array().notNull(),
  },
  (t) => [dz.primaryKey({ columns: [t.questionBank, t.id] })],
);

export const flashcards = schema.table(
  "flashcards",
  {
    questionBank: dz.text("question_bank").notNull(),
    collectionId: dz.text("collection_id").notNull(),
    id: dz.text().notNull(),
    question: dz.text().notNull(),
    answer: dz.text().notNull(),
  },
  (t) => [dz.primaryKey({ columns: [t.questionBank, t.collectionId, t.id] })],
);
