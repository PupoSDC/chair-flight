import { createServerFn } from "@tanstack/react-start";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import {
  atplDocs as docs,
  atplLearningObjectives as learningObjectives,
} from "../../../database";
import { matchSearchWords } from "../../../libs/core/search/match-search-words";
import { rankSearchWords } from "../../../libs/core/search/rank-search-words";
import { searchWithCorrection } from "../../../libs/core/search/search-with-correction";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";

const PAGE_SIZE = 40;

export const fetchAtplDocs = createServerFn({ method: "GET" })
  .validator(
    z.object({
      query: z.string().max(200).default(""),
      subject: z.string().default(""),
      field: z.enum(["all", "id", "text"]).default("all"),
      offset: z.number().int().min(0).default(0),
    }),
  )
  .handler(async ({ data }) => {
    const run = (query: string) =>
      getSupabaseDb()
        .select({
          id: docs.id,
          title: docs.title,
          subject: docs.subject,
          empty: docs.empty,
          learningObjectives: sql<string[]>`coalesce((
          select array_agg(lo.id order by lo.id)
          from ${learningObjectives} lo
          where lo.doc_id = ${docs}.id and not lo.removed
        ), '{}')`,
        })
        .from(docs)
        .where(
          and(
            data.subject ? eq(docs.subject, data.subject) : undefined,
            matchSearchWords(
              query,
              { id: docs.id, text: docs.title },
              data.field,
            ),
          ),
        )
        .orderBy(
          desc(
            rankSearchWords(
              query,
              { id: docs.id, text: docs.title },
              data.field,
            ),
          ),
          asc(docs.id),
        )
        .limit(PAGE_SIZE + 1)
        .offset(data.offset);
    const { rows, correctedQuery } = await searchWithCorrection(
      data.query,
      data.field,
      sql`select regexp_split_to_table(lower(title), '[^a-z0-9]+') as w
        from ${docs}`,
      run,
      (query) => getSupabaseDb().execute(query),
    );
    return {
      items: rows.slice(0, PAGE_SIZE),
      nextOffset: rows.length > PAGE_SIZE ? data.offset + PAGE_SIZE : null,
      correctedQuery,
    };
  });
