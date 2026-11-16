import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { and, asc, eq, isNull } from "drizzle-orm";
import { z } from "zod";
import {
  atplAnnexes as annexes,
  atplLearningObjectives as learningObjectives,
  atplQuestionsToAnnexes as questionAnnexes,
  atplQuestionsToExternalIds as questionExternalIds,
  atplQuestionLearningObjectives as questionLearningObjectives,
  atplQuestions as questions,
  atplQuestionsToQuestions as relatedQuestions,
} from "../../../database";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";

export const fetchAtplQuestion = createServerFn({ method: "GET" })
  .validator(
    z.object({
      questionId: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    const db = getSupabaseDb();
    const [question] = await db
      .select()
      .from(questions)
      .where(
        and(eq(questions.id, data.questionId), isNull(questions.removedAt)),
      );
    if (!question) throw notFound();
    const [
      annexRows,
      learningObjectiveRows,
      relatedRows,
      externalIdRows,
      chapterRows,
    ] = await Promise.all([
      db
        .select({
          id: annexes.id,
          href: annexes.href,
          description: annexes.description,
        })
        .from(questionAnnexes)
        .innerJoin(annexes, eq(annexes.id, questionAnnexes.annexId))
        .where(eq(questionAnnexes.questionId, question.id))
        .orderBy(asc(annexes.id)),
      db
        .select({
          id: learningObjectives.id,
          text: learningObjectives.text,
        })
        .from(questionLearningObjectives)
        .innerJoin(
          learningObjectives,
          eq(
            learningObjectives.id,
            questionLearningObjectives.learningObjectiveId,
          ),
        )
        .where(eq(questionLearningObjectives.questionId, question.id))
        .orderBy(asc(learningObjectives.id)),
      db
        .select({ id: questions.id, preview: questions.preview })
        .from(relatedQuestions)
        .innerJoin(
          questions,
          eq(questions.id, relatedQuestions.relatedQuestionId),
        )
        .where(
          and(
            eq(relatedQuestions.questionId, question.id),
            isNull(questions.removedAt),
          ),
        )
        .orderBy(asc(questions.id)),
      db
        .select({ id: questionExternalIds.externalId })
        .from(questionExternalIds)
        .where(eq(questionExternalIds.questionId, question.id))
        .orderBy(asc(questionExternalIds.externalId)),
      question.docId
        ? db
            .select({ id: questions.id })
            .from(questions)
            .where(
              and(
                eq(questions.docId, question.docId),
                isNull(questions.removedAt),
              ),
            )
            .orderBy(asc(questions.id))
        : Promise.resolve([]),
    ]);
    return {
      ...question,
      annexes: annexRows,
      learningObjectives: learningObjectiveRows,
      relatedQuestions: relatedRows,
      externalIds: externalIdRows.map((row) => row.id),
      chapterQuestionIds: chapterRows.map((row) => row.id),
    };
  });
