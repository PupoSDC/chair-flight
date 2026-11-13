import { createServerFn } from "@tanstack/react-start";
import { and, arrayContains, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { annexes, questions, subjects } from "../../../database";
import { getRandomId } from "../../../libs/base/get-random-id";
import { QUESTION_BANK_NAMES } from "../../../libs/core/question-bank/question-banks";
import { createTest } from "../../../libs/core/tests/create-test";
import { selectTestQuestionIds } from "../../../libs/core/tests/select-test-question-ids";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";

export const startTest = createServerFn({ method: "POST" })
  .validator(
    z.object({
      questionBank: z.enum(QUESTION_BANK_NAMES),
      mode: z.enum(["study", "exam"]),
      subject: z.string().min(1),
      learningObjectiveIds: z.string().array().min(1).max(500),
      numberOfQuestions: z.number().int().min(1).max(200),
    }),
  )
  .handler(async ({ data }) => {
    const db = getSupabaseDb();
    const seed = getRandomId();
    const inBank = eq(questions.questionBank, data.questionBank);
    const [[subject], candidates] = await Promise.all([
      db
        .select()
        .from(subjects)
        .where(
          and(
            eq(subjects.questionBank, data.questionBank),
            eq(subjects.id, data.subject),
          ),
        ),
      db
        .select({
          id: questions.id,
          learningObjectives: questions.learningObjectives,
        })
        .from(questions)
        .where(and(inBank, arrayContains(questions.subjects, [data.subject]))),
    ]);
    if (!subject) throw new Error("Subject not found.");
    const questionIds = selectTestQuestionIds({
      questions: candidates,
      learningObjectiveIds: data.learningObjectiveIds,
      numberOfQuestions: data.numberOfQuestions,
      seed,
    });
    if (questionIds.length === 0) {
      throw new Error("No questions match the selected chapters.");
    }
    const templates = await db
      .select({
        id: questions.id,
        annexes: questions.annexes,
        explanation: questions.explanation,
        variant: questions.variant,
      })
      .from(questions)
      .where(and(inBank, inArray(questions.id, questionIds)));
    const annexIds = templates.flatMap((template) => template.annexes);
    const annexRows = await db
      .select({ id: annexes.id, href: annexes.href })
      .from(annexes)
      .where(
        and(
          eq(annexes.questionBank, data.questionBank),
          inArray(annexes.id, ["", ...annexIds]),
        ),
      );
    const hrefByAnnexId = new Map(annexRows.map((row) => [row.id, row.href]));
    return createTest({
      questionBank: data.questionBank,
      mode: data.mode,
      title: `${subject.shortName} ${data.mode}`,
      seed,
      durationInMinutes: subject.numberOfExamMinutes,
      templates: questionIds.flatMap((id) => {
        const template = templates.find((row) => row.id === id);
        if (!template) return [];
        return {
          ...template,
          annexes: template.annexes.flatMap(
            (annexId) => hrefByAnnexId.get(annexId) ?? [],
          ),
        };
      }),
    });
  });
