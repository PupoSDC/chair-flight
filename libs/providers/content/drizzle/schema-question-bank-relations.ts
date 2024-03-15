import { relations } from "drizzle-orm";
import {
  annexes,
  courses,
  docs,
  flashcardCollections,
  flashcards,
  learningObjectives,
  questions,
  questionsToAnnexes,
  subjects,
} from "./schema-question-bank";

export const coursesRelations = relations(courses, () => ({}));

export const annexesRelations = relations(annexes, ({ many }) => ({
  questions: many(questions),
}));

export const questionsRelations = relations(questions, ({ many }) => ({
  annexes: many(annexes),
}));

export const docsRelations = relations(docs, () => ({}));

export const learningObjectivesRelations = relations(
  learningObjectives,
  () => ({}),
);

export const subhjectsRelations = relations(subjects, () => ({}));

export const flashcardsRelations = relations(flashcards, ({ one }) => ({
  collection: one(flashcardCollections, {
    fields: [flashcards.collectionId],
    references: [flashcardCollections.id],
  }),
}));

export const questionsToAnnexesRelations = relations(
  questionsToAnnexes,
  ({ one }) => ({
    question: one(questions, {
      fields: [questionsToAnnexes.questionId],
      references: [questions.id],
    }),
    annex: one(annexes, {
      fields: [questionsToAnnexes.annexId],
      references: [annexes.id],
    }),
  }),
);
