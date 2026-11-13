import { createServerFn } from "@tanstack/react-start";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { courses } from "../../../database";
import { QUESTION_BANK_NAMES } from "../../../libs/core/question-bank/question-banks";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";

export const fetchCourses = createServerFn({ method: "GET" })
  .validator(z.object({ questionBank: z.enum(QUESTION_BANK_NAMES) }))
  .handler(({ data }) =>
    getSupabaseDb()
      .select({ id: courses.id, text: courses.text })
      .from(courses)
      .where(eq(courses.questionBank, data.questionBank))
      .orderBy(asc(courses.id)),
  );
