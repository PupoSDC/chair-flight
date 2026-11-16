import { createServerFn } from "@tanstack/react-start";
import { asc, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import {
  a320Annexes,
  a320Questions,
  a320QuestionsToAnnexes,
} from "../../../database";
import { getRandomId } from "../../../libs/base/get-random-id";
import { getRandomShuffler } from "../../../libs/base/get-random-shuffler";
import { createTest } from "../../../libs/core/tests/create-test";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";

export const getA320ClientOnlyTest = createServerFn({ method: "POST" })
  .validator(
    z.object({
      mode: z.enum(["study", "exam"]),
      chapterIds: z.string().array().min(1).max(50),
      numberOfQuestions: z.number().int().min(1).max(200),
    }),
  )
  .handler(async ({ data }) => {
    const db = getSupabaseDb();
    const seed = getRandomId();
    const candidates = await db
      .select({ id: a320Questions.id })
      .from(a320Questions)
      .where(inArray(a320Questions.chapter, data.chapterIds));
    const questionIds = getRandomShuffler(seed)(candidates)
      .slice(0, data.numberOfQuestions)
      .map((candidate) => candidate.id);
    if (questionIds.length === 0) {
      throw new Error("No questions match the selected chapters.");
    }
    const templates = await db
      .select({
        id: a320Questions.id,
        template: a320Questions.template,
      })
      .from(a320Questions)
      .where(inArray(a320Questions.id, questionIds));
    const annexRows = await db
      .select({
        questionId: a320QuestionsToAnnexes.questionId,
        href: a320Annexes.href,
      })
      .from(a320QuestionsToAnnexes)
      .innerJoin(
        a320Annexes,
        eq(a320Annexes.id, a320QuestionsToAnnexes.annexId),
      )
      .where(inArray(a320QuestionsToAnnexes.questionId, questionIds))
      .orderBy(asc(a320Annexes.id));
    return createTest({
      questionBank: "a320",
      mode: data.mode,
      title: `A320 ${data.mode}`,
      seed,
      durationInMinutes: 40,
      templates: questionIds.flatMap((id) => {
        const template = templates.find((row) => row.id === id);
        if (!template) return [];
        return {
          id: template.id,
          template: template.template,
          annexes: annexRows
            .filter((row) => row.questionId === id)
            .map((row) => row.href),
        };
      }),
    });
  });
