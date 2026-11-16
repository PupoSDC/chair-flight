import { createServerFn } from "@tanstack/react-start";
import { asc, count, eq } from "drizzle-orm";
import { a320Chapters, a320Questions } from "../../../database";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";

export const getA320ModuleData = createServerFn({ method: "GET" }).handler(
  async () => {
    const chapters = await getSupabaseDb()
      .select({
        id: a320Chapters.id,
        title: a320Chapters.title,
        numberOfQuestions: count(a320Questions.id),
      })
      .from(a320Chapters)
      .leftJoin(a320Questions, eq(a320Questions.chapter, a320Chapters.id))
      .groupBy(a320Chapters.id, a320Chapters.title)
      .orderBy(asc(a320Chapters.id));

    return {
      chapters,
      numberOfQuestions: chapters.reduce(
        (total, chapter) => total + chapter.numberOfQuestions,
        0,
      ),
    };
  },
);
