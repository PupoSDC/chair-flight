import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { annexes, learningObjectives, questions } from "../../../database";
import { QUESTION_BANK_NAMES } from "../../../libs/core/question-bank/question-banks";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";

export const fetchQuestion = createServerFn({ method: "GET" })
  .validator(
    z.object({
      questionBank: z.enum(QUESTION_BANK_NAMES),
      questionId: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    const db = getSupabaseDb();
    const [question] = await db
      .select()
      .from(questions)
      .where(
        and(
          eq(questions.questionBank, data.questionBank),
          eq(questions.id, data.questionId),
        ),
      );
    if (!question) throw notFound();
    const [annexRows, learningObjectiveRows, relatedRows] = await Promise.all([
      db
        .select({
          id: annexes.id,
          href: annexes.href,
          description: annexes.description,
        })
        .from(annexes)
        .where(
          and(
            eq(annexes.questionBank, data.questionBank),
            inArray(annexes.id, ["", ...question.annexes]),
          ),
        ),
      db
        .select({ id: learningObjectives.id, text: learningObjectives.text })
        .from(learningObjectives)
        .where(
          and(
            eq(learningObjectives.questionBank, data.questionBank),
            inArray(learningObjectives.id, [
              "",
              ...question.learningObjectives,
            ]),
          ),
        ),
      db
        .select({ id: questions.id, preview: questions.preview })
        .from(questions)
        .where(
          and(
            eq(questions.questionBank, data.questionBank),
            inArray(questions.id, ["", ...question.relatedQuestions]),
          ),
        ),
    ]);
    return {
      ...question,
      annexes: annexRows,
      learningObjectives: learningObjectiveRows,
      relatedQuestions: relatedRows,
    };
  });
