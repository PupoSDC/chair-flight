import * as dz from "drizzle-orm/pg-core";
import { schema } from "./base.ts";
import type { QuestionTemplate } from "../../libs/core/question-templates/question-template.ts";

export const atplSubjects = schema.table(
  "atpl_subjects",
  {
    id: dz.text().notNull(),
    longName: dz.text("long_name").notNull(),
    shortName: dz.text("short_name").notNull(),
    numberOfExamQuestions: dz.integer("number_of_exam_questions").notNull(),
    numberOfExamMinutes: dz.integer("number_of_exam_minutes").notNull(),
  },
  (t) => [dz.primaryKey({ columns: [t.id] })],
);

export const atplCourses = schema.table(
  "atpl_courses",
  {
    id: dz.text().notNull(),
    text: dz.text().notNull(),
  },
  (t) => [dz.primaryKey({ columns: [t.id] })],
);

export const atplDocs = schema.table(
  "atpl_docs",
  {
    id: dz.text().notNull(),
    parentId: dz
      .text("parent_id")
      .references((): dz.AnyPgColumn => atplDocs.id),
    subject: dz.text().references(() => atplSubjects.id),
    title: dz.text().notNull(),
    description: dz.text().notNull(),
    content: dz.text().notNull(),
    empty: dz.boolean().notNull(),
  },
  (t) => [dz.primaryKey({ columns: [t.id] }), dz.index().on(t.parentId)],
);

export const atplLearningObjectives = schema.table(
  "atpl_learning_objectives",
  {
    id: dz.text().notNull(),
    parentId: dz
      .text("parent_id")
      .references((): dz.AnyPgColumn => atplLearningObjectives.id),
    subject: dz
      .text()
      .notNull()
      .references(() => atplSubjects.id),
    docId: dz.text("doc_id").references(() => atplDocs.id),
    text: dz.text().notNull(),
    source: dz.text().notNull(),
    removed: dz.boolean().notNull().default(false),
  },
  (t) => [
    dz.primaryKey({ columns: [t.id] }),
    dz.index().on(t.parentId),
    dz.index().on(t.docId),
    dz.index().on(t.subject),
  ],
);

export const atplLearningObjectiveCourses = schema.table(
  "atpl_learning_objective_courses",
  {
    learningObjectiveId: dz
      .text("learning_objective_id")
      .notNull()
      .references(() => atplLearningObjectives.id, { onDelete: "cascade" }),
    courseId: dz
      .text("course_id")
      .notNull()
      .references(() => atplCourses.id, { onDelete: "cascade" }),
  },
  (t) => [dz.primaryKey({ columns: [t.learningObjectiveId, t.courseId] })],
);

export const atplExternalIds = schema.table(
  "atpl_external_ids",
  {
    id: dz.text().notNull(),
  },
  (t) => [dz.primaryKey({ columns: [t.id] })],
);

export const atplQuestions = schema.table(
  "atpl_questions",
  {
    id: dz.text().notNull(),
    docId: dz
      .text("doc_id")
      .notNull()
      .references(() => atplDocs.id),
    preview: dz.text().notNull(),
    template: dz.jsonb().$type<QuestionTemplate>().notNull(),
    removedAt: dz.timestamp("removed_at", { withTimezone: true }),
  },
  (t) => [dz.primaryKey({ columns: [t.id] }), dz.index().on(t.docId)],
);

export const atplQuestionsToExternalIds = schema.table(
  "atpl_questions_to_external_ids",
  {
    questionId: dz
      .text("question_id")
      .notNull()
      .references(() => atplQuestions.id, { onDelete: "cascade" }),
    externalId: dz
      .text("external_id")
      .notNull()
      .references(() => atplExternalIds.id, { onDelete: "cascade" }),
  },
  (t) => [
    dz.primaryKey({ columns: [t.questionId, t.externalId] }),
    dz.index().on(t.externalId),
  ],
);

export const atplQuestionLearningObjectives = schema.table(
  "atpl_question_learning_objectives",
  {
    questionId: dz
      .text("question_id")
      .notNull()
      .references(() => atplQuestions.id, { onDelete: "cascade" }),
    learningObjectiveId: dz
      .text("learning_objective_id")
      .notNull()
      .references(() => atplLearningObjectives.id, { onDelete: "cascade" }),
  },
  (t) => [
    dz.primaryKey({ columns: [t.questionId, t.learningObjectiveId] }),
    dz.index().on(t.learningObjectiveId),
  ],
);

export const atplQuestionsToQuestions = schema.table(
  "atpl_questions_to_questions",
  {
    questionId: dz
      .text("question_id")
      .notNull()
      .references(() => atplQuestions.id, { onDelete: "cascade" }),
    relatedQuestionId: dz
      .text("related_question_id")
      .notNull()
      .references(() => atplQuestions.id, { onDelete: "cascade" }),
  },
  (t) => [dz.primaryKey({ columns: [t.questionId, t.relatedQuestionId] })],
);

export const atplAnnexes = schema.table(
  "atpl_annexes",
  {
    id: dz.text().notNull(),
    href: dz.text().notNull(),
    format: dz.text().notNull(),
    description: dz.text().notNull(),
    source: dz.text().notNull(),
  },
  (t) => [dz.primaryKey({ columns: [t.id] })],
);

export const atplQuestionsToAnnexes = schema.table(
  "atpl_questions_to_annexes",
  {
    questionId: dz
      .text("question_id")
      .notNull()
      .references(() => atplQuestions.id, { onDelete: "cascade" }),
    annexId: dz
      .text("annex_id")
      .notNull()
      .references(() => atplAnnexes.id, { onDelete: "cascade" }),
  },
  (t) => [dz.primaryKey({ columns: [t.questionId, t.annexId] })],
);

export const atplLearningObjectiveVersions = schema.table(
  "atpl_learning_objective_versions",
  {
    id: dz.text().notNull(),
    position: dz.integer().notNull(),
    name: dz.text().notNull(),
    description: dz.text().notNull(),
    ecqbRelease: dz.text("ecqb_release"),
    sourceFile: dz.text("source_file").notNull(),
    numberOfLearningObjectives: dz
      .integer("number_of_learning_objectives")
      .notNull(),
  },
  (t) => [dz.primaryKey({ columns: [t.id] })],
);

export const atplLearningObjectiveRevisions = schema.table(
  "atpl_learning_objective_revisions",
  {
    version: dz.text().notNull(),
    id: dz.text().notNull(),
    parentId: dz.text("parent_id"),
    subject: dz.text().notNull(),
    level: dz.integer().notNull(),
    text: dz.text().notNull(),
    items: dz.text().array().notNull(),
    originalText: dz.text("original_text").notNull(),
    source: dz.text().notNull(),
    courses: dz.text().array().notNull(),
    previousIds: dz.text("previous_ids").array().notNull(),
    nextIds: dz.text("next_ids").array().notNull(),
    change: dz.text(),
  },
  (t) => [
    dz.primaryKey({ columns: [t.version, t.id] }),
    dz.index().on(t.version, t.parentId),
    dz.index().on(t.version, t.subject),
  ],
);
