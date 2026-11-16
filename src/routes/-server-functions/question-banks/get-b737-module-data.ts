import { createServerFn } from "@tanstack/react-start";
import { asc, count, eq } from "drizzle-orm";
import { b737Chapters, b737Questions } from "../../../database";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";

export const getB737ModuleData = createServerFn({ method: "GET" }).handler(
  async () => {
    const chapters = await getSupabaseDb()
      .select({
        id: b737Chapters.id,
        title: b737Chapters.title,
        numberOfQuestions: count(b737Questions.id),
      })
      .from(b737Chapters)
      .leftJoin(b737Questions, eq(b737Questions.chapter, b737Chapters.id))
      .groupBy(b737Chapters.id, b737Chapters.title)
      .orderBy(asc(b737Chapters.id));

    return {
      chapters,
      numberOfQuestions: chapters.reduce(
        (total, chapter) => total + chapter.numberOfQuestions,
        0,
      ),
    };
  },
);
