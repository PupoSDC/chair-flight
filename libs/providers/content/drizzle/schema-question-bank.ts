import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const contentStatusEnum = pgEnum("status", ["current", "removed"]);

export const questionBankEnum = pgEnum("question_bank", [
  "atpl",
  "prep",
  "type",
]);

export const annexFormatEnum = pgEnum("annex_format", ["jpg"]);

export const treeRelationEnum = pgEnum("tree_relation", [
  "parent",
  "child",
  "nested_child",
]);

const common = () => ({
  id: varchar("id", { length: 12 }).primaryKey().notNull(),
  hash: varchar("hash", { length: 64 }).notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  status: contentStatusEnum("status").notNull(),
});

////////////////////////////////////////////////////////////////////////////////
// Primary Tables //////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export const courses = pgTable("question_bank_courses", {
  ...common(),
  text: text("text").notNull(),
});

export const annexes = pgTable("question_bank_annexes", {
  ...common(),
  description: text("description").notNull(),
  questionBank: questionBankEnum("question_bank").notNull(),
  format: annexFormatEnum("format").notNull(),
});

export const questions = pgTable("question_bank_questions", {
  ...common(),
  questionBank: questionBankEnum("question_bank").notNull(),
  externalIds: varchar("external_ids", { length: 20 }).notNull().array(),
  explanation: text("explanation").notNull(),
  srcLocation: text("src_location").notNull(),
  variant: jsonb("variant").notNull(),
});

export const docs = pgTable("question_bank_docs", {
  ...common(),
  title: text("title").notNull(),
  description: text("description"),
  content: text("content"),
  fileName: text("file_name").notNull(),
  questionBank: questionBankEnum("question_bank").notNull(),
});

export const learningObjectives = pgTable("question_bank_learning_objectives", {
  ...common(),
  questionBank: questionBankEnum("question_bank").notNull(),
  text: text("text").notNull(),
  source: text("source").notNull(),
});

export const subjects = pgTable("question_bank_subjects", {
  ...common(),
  longName: varchar("long_name", { length: 128 }).notNull(),
  shortName: varchar("short_name", { length: 10 }).notNull(),
  numberOfExamQuestions: integer("number_of_exam_questions").notNull(),
  numberOfExamMinutes: integer("number_of_exam_minutes").notNull(),
  numberOfQuestions: integer("number_of_questions").notNull(),
});

export const flashcards = pgTable("question_bank_flashcards", {
  ...common(),
  collectionId: varchar("collection_id", { length: 12 })
    .notNull()
    .references(() => flashcardCollections.id),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
});

export const flashcardCollections = pgTable(
  "question_bank_flashcard_collections",
  {
    ...common(),
    title: text("title").notNull(),
  },
);

////////////////////////////////////////////////////////////////////////////////
// Many-2-Many Tables //////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export const questionsToAnnexes = pgTable(
  "question_bank_questions_to_annexes",
  {
    questionId: varchar("question_id", { length: 12 }).references(
      () => questions.id,
    ),
    annexId: varchar("annex_id", { length: 12 }).references(() => annexes.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.annexId, t.questionId] }),
  }),
);

export const relatedQuestions = pgTable(
  "question_bank_related_questions",
  {
    questionId1: varchar("question__id_1", { length: 12 }).references(
      () => questions.id,
    ),
    questionId2: varchar("question__id_2", { length: 12 }).references(
      () => questions.id,
    ),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.questionId1, t.questionId2] }),
  }),
);

export const docsToDocs = pgTable(
  "question_bank_docs_to_docs",
  {
    docId1: varchar("doc_id_1", { length: 12 }).references(() => docs.id),
    docId2: varchar("doc_id_2", { length: 12 }).references(() => docs.id),
    relation: treeRelationEnum("relation").notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.docId1, t.docId2] }),
  }),
);

export const docsToLearningObjectives = pgTable(
  "question_bank_docs_to_learning_objectives",
  {
    docId: varchar("doc_id", { length: 12 }).references(() => docs.id),
    learningObjectiveId: varchar("learning_objective_id", {
      length: 12,
    }).references(() => learningObjectives.id),
    relation: treeRelationEnum("relation").notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.docId, t.learningObjectiveId] }),
  }),
);

export const docsToAnnexes = pgTable(
  "question_bank_docs_to_annexes",
  {
    docId: varchar("doc_id", { length: 12 }).references(() => docs.id),
    annexId: varchar("annex_id", { length: 12 }).references(() => annexes.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.docId, t.annexId] }),
  }),
);

export const learningObjectivesToQuestions = pgTable(
  "question_bank_learning_objectives_to_docs",
  {
    learningObjectiveId: varchar("learning_objective_id", {
      length: 12,
    }).references(() => learningObjectives.id),
    questionId: varchar("question_id", { length: 12 }).references(
      () => questions.id,
    ),
    relation: treeRelationEnum("relation").notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.learningObjectiveId, t.questionId] }),
  }),
);
