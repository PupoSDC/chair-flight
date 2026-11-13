import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { courses, learningObjectives } from "../../../database";
import { QUESTION_BANK_NAMES } from "../../../libs/core/question-bank/question-banks";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";

export const fetchLearningObjective = createServerFn({ method: "GET" })
  .validator(
    z.object({
      questionBank: z.enum(QUESTION_BANK_NAMES),
      learningObjectiveId: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    const db = getSupabaseDb();
    const [[learningObjective], courseRows] = await Promise.all([
      db
        .select()
        .from(learningObjectives)
        .where(
          and(
            eq(learningObjectives.questionBank, data.questionBank),
            eq(learningObjectives.id, data.learningObjectiveId),
          ),
        ),
      db
        .select({ id: courses.id, text: courses.text })
        .from(courses)
        .where(eq(courses.questionBank, data.questionBank)),
    ]);
    if (!learningObjective) throw notFound();
    return {
      ...learningObjective,
      courses: courseRows.filter((course) =>
        learningObjective.courses.includes(course.id),
      ),
    };
  });
