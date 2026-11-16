import { createServerFn } from "@tanstack/react-start";
import { asc, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import {
  b737Annexes,
  b737Questions,
  b737QuestionsToAnnexes,
} from "../../../database";
import { getRandomId } from "../../../libs/base/get-random-id";
import { getRandomShuffler } from "../../../libs/base/get-random-shuffler";
import { createTest } from "../../../libs/core/tests/create-test";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";

export const getB737ClientOnlyTest = createServerFn({ method: "POST" })
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
      .select({ id: b737Questions.id })
      .from(b737Questions)
      .where(inArray(b737Questions.chapter, data.chapterIds));
    const questionIds = getRandomShuffler(seed)(candidates)
      .slice(0, data.numberOfQuestions)
      .map((candidate) => candidate.id);
    if (questionIds.length === 0) {
      throw new Error("No questions match the selected chapters.");
    }
    const templates = await db
      .select({
        id: b737Questions.id,
        template: b737Questions.template,
      })
      .from(b737Questions)
      .where(inArray(b737Questions.id, questionIds));
    const annexRows = await db
      .select({
        questionId: b737QuestionsToAnnexes.questionId,
        href: b737Annexes.href,
      })
      .from(b737QuestionsToAnnexes)
      .innerJoin(
        b737Annexes,
        eq(b737Annexes.id, b737QuestionsToAnnexes.annexId),
      )
      .where(inArray(b737QuestionsToAnnexes.questionId, questionIds))
      .orderBy(asc(b737Annexes.id));
    return createTest({
      questionBank: "b737",
      mode: data.mode,
      title: `B737 ${data.mode}`,
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
