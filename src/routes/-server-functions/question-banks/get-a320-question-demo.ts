import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import {
  a320Annexes,
  a320Chapters,
  a320Questions,
  a320QuestionsToAnnexes,
  a320QuestionsToQuestions,
} from "../../../database";
import { createTestQuestion } from "../../../libs/core/tests/create-test-question";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";

export const getA320QuestionDemo = createServerFn({ method: "GET" })
  .validator(
    z.object({
      questionId: z.string().min(1),
      seed: z.string().min(1).default("0"),
    }),
  )
  .handler(async ({ data }) => {
    const db = getSupabaseDb();
    const [question] = await db
      .select()
      .from(a320Questions)
      .where(eq(a320Questions.id, data.questionId));
    if (!question) throw notFound();
    const [annexRows, relatedRows, siblingRows, [chapter]] = await Promise.all([
      db
        .select({ href: a320Annexes.href })
        .from(a320QuestionsToAnnexes)
        .innerJoin(
          a320Annexes,
          eq(a320Annexes.id, a320QuestionsToAnnexes.annexId),
        )
        .where(eq(a320QuestionsToAnnexes.questionId, question.id))
        .orderBy(asc(a320Annexes.id)),
      db
        .select({ id: a320Questions.id, preview: a320Questions.preview })
        .from(a320QuestionsToQuestions)
        .innerJoin(
          a320Questions,
          eq(a320Questions.id, a320QuestionsToQuestions.relatedQuestionId),
        )
        .where(eq(a320QuestionsToQuestions.questionId, question.id))
        .orderBy(asc(a320Questions.id)),
      db
        .select({ id: a320Questions.id })
        .from(a320Questions)
        .where(eq(a320Questions.chapter, question.chapter))
        .orderBy(asc(a320Questions.id)),
      db
        .select({ id: a320Chapters.id, title: a320Chapters.title })
        .from(a320Chapters)
        .where(eq(a320Chapters.id, question.chapter)),
    ]);
    const generated = createTestQuestion(
      {
        id: question.id,
        template: question.template,
        annexes: annexRows.map((annex) => annex.href),
      },
      data.seed,
    );

    return {
      id: question.id,
      seed: data.seed,
      shuffleable: question.template.type !== "true-or-false",
      chapter: chapter ?? { id: question.chapter, title: "" },
      question: generated.question,
      options: generated.options,
      annexes: generated.annexes,
      correctOptionId: generated.correctOptionId,
      explanation: generated.explanation,
      relatedQuestions: relatedRows,
      chapterQuestionIds: siblingRows.map((row) => row.id),
    };
  });
