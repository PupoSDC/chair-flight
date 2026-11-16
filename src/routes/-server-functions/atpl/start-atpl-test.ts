import { createServerFn } from "@tanstack/react-start";
import { and, asc, eq, inArray, isNull, or, sql } from "drizzle-orm";
import { z } from "zod";
import {
  atplAnnexes as annexes,
  atplLearningObjectives as learningObjectives,
  atplQuestionsToAnnexes as questionAnnexes,
  atplQuestionLearningObjectives as questionLearningObjectives,
  atplQuestions as questions,
  atplSubjects as subjects,
} from "../../../database";
import { getRandomId } from "../../../libs/base/get-random-id";
import { getRandomShuffler } from "../../../libs/base/get-random-shuffler";
import { createTest } from "../../../libs/core/tests/create-test";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";

export const startAtplTest = createServerFn({ method: "POST" })
  .validator(
    z.object({
      mode: z.enum(["study", "exam"]),
      subject: z.string().min(1),
      learningObjectiveIds: z.string().array().min(1).max(500),
      numberOfQuestions: z.number().int().min(1).max(200),
    }),
  )
  .handler(async ({ data }) => {
    const db = getSupabaseDb();
    const seed = getRandomId();
    const [[subject], candidates] = await Promise.all([
      db.select().from(subjects).where(eq(subjects.id, data.subject)),
      db
        .selectDistinct({ id: questions.id })
        .from(questionLearningObjectives)
        .innerJoin(
          questions,
          eq(questions.id, questionLearningObjectives.questionId),
        )
        .innerJoin(
          learningObjectives,
          eq(
            learningObjectives.id,
            questionLearningObjectives.learningObjectiveId,
          ),
        )
        .where(
          and(
            isNull(questions.removedAt),
            eq(learningObjectives.subject, data.subject),
            or(
              ...data.learningObjectiveIds.map(
                (id) =>
                  sql`starts_with(${questionLearningObjectives.learningObjectiveId}, ${id})`,
              ),
            ),
          ),
        ),
    ]);
    if (!subject) throw new Error("Subject not found.");
    const questionIds = getRandomShuffler(seed)(candidates)
      .slice(0, data.numberOfQuestions)
      .map((candidate) => candidate.id);
    if (questionIds.length === 0) {
      throw new Error("No questions match the selected chapters.");
    }
    const templates = await db
      .select({
        id: questions.id,
        template: questions.template,
      })
      .from(questions)
      .where(inArray(questions.id, questionIds));
    const annexRows = await db
      .select({ questionId: questionAnnexes.questionId, href: annexes.href })
      .from(questionAnnexes)
      .innerJoin(annexes, eq(annexes.id, questionAnnexes.annexId))
      .where(inArray(questionAnnexes.questionId, questionIds))
      .orderBy(asc(annexes.id));
    return createTest({
      questionBank: "atpl",
      mode: data.mode,
      title: `${subject.shortName} ${data.mode}`,
      seed,
      durationInMinutes: subject.numberOfExamMinutes,
      templates: questionIds.flatMap((id) => {
        const template = templates.find((row) => row.id === id);
        if (!template) return [];
        return {
          ...template,
          annexes: annexRows
            .filter((row) => row.questionId === id)
            .map((row) => row.href),
        };
      }),
    });
  });
