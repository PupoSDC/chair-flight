import { createServerFn } from "@tanstack/react-start";
import { inArray } from "drizzle-orm";
import { z } from "zod";
import { b737Questions } from "../../../database";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";

export const fetchB737QuestionChapters = createServerFn({ method: "POST" })
  .validator(z.object({ questionIds: z.string().array().min(1).max(500) }))
  .handler(async ({ data }) => {
    const rows = await getSupabaseDb()
      .select({ id: b737Questions.id, chapter: b737Questions.chapter })
      .from(b737Questions)
      .where(inArray(b737Questions.id, data.questionIds));
    return Object.fromEntries(rows.map((row) => [row.id, [row.chapter]]));
  });
