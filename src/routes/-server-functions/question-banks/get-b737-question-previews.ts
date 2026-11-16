import { createServerFn } from "@tanstack/react-start";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { b737Questions, b737QuestionsToQuestions } from "../../../database";
import { matchSearchWords } from "../../../libs/core/search/match-search-words";
import { rankSearchWords } from "../../../libs/core/search/rank-search-words";
import { searchWithCorrection } from "../../../libs/core/search/search-with-correction";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";

const PAGE_SIZE = 40;

export const getB737QuestionPreviews = createServerFn({ method: "GET" })
  .validator(
    z.object({
      query: z.string().max(200).default(""),
      chapter: z.string().default(""),
      field: z.enum(["all", "id", "text"]).default("all"),
      offset: z.number().int().min(0).default(0),
    }),
  )
  .handler(async ({ data }) => {
    const columns = { id: b737Questions.id, text: b737Questions.preview };
    const run = (query: string) =>
      getSupabaseDb()
        .select({
          id: b737Questions.id,
          chapter: b737Questions.chapter,
          preview: b737Questions.preview,
          relatedQuestions: sql<string[]>`array(
            select ${b737QuestionsToQuestions.relatedQuestionId}
            from ${b737QuestionsToQuestions}
            where ${b737QuestionsToQuestions.questionId} = ${b737Questions.id}
            order by 1
          )`,
        })
        .from(b737Questions)
        .where(
          and(
            data.chapter ? eq(b737Questions.chapter, data.chapter) : undefined,
            matchSearchWords(query, columns, data.field),
          ),
        )
        .orderBy(
          desc(rankSearchWords(query, columns, data.field)),
          asc(b737Questions.id),
        )
        .limit(PAGE_SIZE + 1)
        .offset(data.offset);
    const { rows, correctedQuery } = await searchWithCorrection(
      data.query,
      data.field,
      sql`select regexp_split_to_table(lower(preview), '[^a-z0-9]+') as w
        from ${b737Questions}`,
      run,
      (query) => getSupabaseDb().execute(query),
    );
    return {
      items: rows.slice(0, PAGE_SIZE),
      nextOffset: rows.length > PAGE_SIZE ? data.offset + PAGE_SIZE : null,
      correctedQuery,
    };
  });
