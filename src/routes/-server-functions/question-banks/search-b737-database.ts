import { createServerFn } from "@tanstack/react-start";
import { and, asc, desc, ilike, or } from "drizzle-orm";
import { z } from "zod";
import {
  b737Chapters as chapters,
  b737Questions as questions,
} from "../../../database";
import { getSearchSnippet } from "../../../libs/core/search/get-search-snippet";
import { matchSearchWords } from "../../../libs/core/search/match-search-words";
import { rankSearchWords } from "../../../libs/core/search/rank-search-words";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";

const LIMIT = 8;

export const searchB737Database = createServerFn({ method: "GET" })
  .validator(
    z.object({
      query: z.string().trim().min(1).max(200),
    }),
  )
  .handler(async ({ data }) => {
    const db = getSupabaseDb();
    const columns = { id: questions.id, text: questions.preview };
    const questionQuery = db
      .select({ id: questions.id, preview: questions.preview })
      .from(questions)
      .where(matchSearchWords(data.query, columns, "all"))
      .orderBy(
        desc(rankSearchWords(data.query, columns, "all")),
        asc(questions.id),
      )
      .limit(LIMIT);

    const words = data.query.toLowerCase().split(/\s+/).filter(Boolean);
    const [questionRows, chapterRows] = await Promise.all([
      questionQuery,
      db
        .select({
          id: chapters.id,
          title: chapters.title,
          content: chapters.content,
        })
        .from(chapters)
        .where(
          and(
            ...words.map((word) =>
              or(
                ilike(chapters.title, `%${word}%`),
                ilike(chapters.content, `%${word}%`),
              ),
            ),
          ),
        )
        .orderBy(asc(chapters.id))
        .limit(LIMIT),
    ]);
    return {
      questions: questionRows,
      chapters: chapterRows.map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        snippet: getSearchSnippet(chapter.content, words),
      })),
    };
  });
