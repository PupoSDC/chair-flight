import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { count, eq } from "drizzle-orm";
import { z } from "zod";
import { b737Chapters, b737Questions } from "../../../database";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";

export const fetchB737Chapter = createServerFn({ method: "GET" })
  .validator(z.object({ chapterId: z.string().min(1) }))
  .handler(async ({ data }) => {
    const db = getSupabaseDb();
    const [chapter] = await db
      .select()
      .from(b737Chapters)
      .where(eq(b737Chapters.id, data.chapterId));
    if (!chapter) throw notFound();
    const [questionCount] = await db
      .select({ total: count() })
      .from(b737Questions)
      .where(eq(b737Questions.chapter, chapter.id));
    return { ...chapter, numberOfQuestions: questionCount?.total ?? 0 };
  });
