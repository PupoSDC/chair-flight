import {
  pgTable,
  timestamp,
  text,
  integer,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";

export const questionTemplate = pgTable("question_template", {
  id: text("id").primaryKey().notNull(),

  /**
   * Denormalized data.
   *
   * Question is marked as part of the "last day review" package of questions.
   * These questions are the top 2X number of exam questions we have in the
   * question bank. Designed for last minute reviews
   */
  lastDayReview: boolean("last_day_review").notNull().default(false),

  /**
   * Denormalized data. Questions scored from 0 to 10.
   *
   * 10 being questions seen recently in exams, with poor student performance,
   * and good explanations + variants.
   *
   * 0 are questions rarely (or never) reported as seen, missing explanations,
   * and with good student performance.
   */
  rating: integer("rating").notNull().default(5),

  /**
   * Denormalized data
   */
  timesSeenInExam: integer("times_seen_in_exam").notNull(),
});

export const questionTemplateExamViews = pgTable(
  "question_template_exam_view",
  {
    questionTemplateId: text("question_template_id")
      .notNull()
      .references(() => questionTemplate.id),
    date: timestamp("date").notNull(),
  },
);

export const test = pgTable("test", {
  id: text("id").primaryKey().notNull(),
  questionBank: text("question_bank").notNull(),
  title: text("title").notNull(),
  durationInMs: integer("duration_in_ms").notNull(),
  questions: jsonb("document").notNull(),
});
