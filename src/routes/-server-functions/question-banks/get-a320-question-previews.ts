import { createServerFn } from "@tanstack/react-start";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { a320Questions, a320QuestionsToQuestions } from "../../../database";
import { matchSearchWords } from "../../../libs/core/search/match-search-words";
import { rankSearchWords } from "../../../libs/core/search/rank-search-words";
import { searchWithCorrection } from "../../../libs/core/search/search-with-correction";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";

const PAGE_SIZE = 40;

export const getA320QuestionPreviews = createServerFn({ method: "GET" })
  .validator(
    z.object({
      query: z.string().max(200).default(""),
      chapter: z.string().default(""),
      field: z.enum(["all", "id", "text"]).default("all"),
      offset: z.number().int().min(0).default(0),
    }),
  )
  .handler(async ({ data }) => {
    const columns = { id: a320Questions.id, text: a320Questions.preview };
    const run = (query: string) =>
      getSupabaseDb()
        .select({
          id: a320Questions.id,
          chapter: a320Questions.chapter,
          preview: a320Questions.preview,
          relatedQuestions: sql<string[]>`array(
            select ${a320QuestionsToQuestions.relatedQuestionId}
            from ${a320QuestionsToQuestions}
            where ${a320QuestionsToQuestions.questionId} = ${a320Questions.id}
            order by 1
          )`,
        })
        .from(a320Questions)
        .where(
          and(
            data.chapter ? eq(a320Questions.chapter, data.chapter) : undefined,
            matchSearchWords(query, columns, data.field),
          ),
        )
        .orderBy(
          desc(rankSearchWords(query, columns, data.field)),
          asc(a320Questions.id),
        )
        .limit(PAGE_SIZE + 1)
        .offset(data.offset);
    const { rows, correctedQuery } = await searchWithCorrection(
      data.query,
      data.field,
      sql`select regexp_split_to_table(lower(preview), '[^a-z0-9]+') as w
        from ${a320Questions}`,
      run,
      (query) => getSupabaseDb().execute(query),
    );
    return {
      items: rows.slice(0, PAGE_SIZE),
      nextOffset: rows.length > PAGE_SIZE ? data.offset + PAGE_SIZE : null,
      correctedQuery,
    };
  });
