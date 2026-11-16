import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import {
  b737Annexes,
  b737Chapters,
  b737Questions,
  b737QuestionsToAnnexes,
  b737QuestionsToQuestions,
} from "../../../database";
import { createTestQuestion } from "../../../libs/core/tests/create-test-question";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";

export const getB737QuestionDemo = createServerFn({ method: "GET" })
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
      .from(b737Questions)
      .where(eq(b737Questions.id, data.questionId));
    if (!question) throw notFound();
    const [annexRows, relatedRows, siblingRows, [chapter]] = await Promise.all([
      db
        .select({ href: b737Annexes.href })
        .from(b737QuestionsToAnnexes)
        .innerJoin(
          b737Annexes,
          eq(b737Annexes.id, b737QuestionsToAnnexes.annexId),
        )
        .where(eq(b737QuestionsToAnnexes.questionId, question.id))
        .orderBy(asc(b737Annexes.id)),
      db
        .select({ id: b737Questions.id, preview: b737Questions.preview })
        .from(b737QuestionsToQuestions)
        .innerJoin(
          b737Questions,
          eq(b737Questions.id, b737QuestionsToQuestions.relatedQuestionId),
        )
        .where(eq(b737QuestionsToQuestions.questionId, question.id))
        .orderBy(asc(b737Questions.id)),
      db
        .select({ id: b737Questions.id })
        .from(b737Questions)
        .where(eq(b737Questions.chapter, question.chapter))
        .orderBy(asc(b737Questions.id)),
      db
        .select({ id: b737Chapters.id, title: b737Chapters.title })
        .from(b737Chapters)
        .where(eq(b737Chapters.id, question.chapter)),
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
