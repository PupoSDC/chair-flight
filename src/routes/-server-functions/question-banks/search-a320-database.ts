import { createServerFn } from "@tanstack/react-start";
import { asc, desc } from "drizzle-orm";
import { z } from "zod";
import { a320Questions } from "../../../database";
import { matchSearchWords } from "../../../libs/core/search/match-search-words";
import { rankSearchWords } from "../../../libs/core/search/rank-search-words";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";

export const searchA320Database = createServerFn({ method: "GET" })
  .validator(z.object({ query: z.string().trim().min(1).max(200) }))
  .handler(async ({ data }) => {
    const columns = { id: a320Questions.id, text: a320Questions.preview };
    return getSupabaseDb()
      .select({ id: a320Questions.id, preview: a320Questions.preview })
      .from(a320Questions)
      .where(matchSearchWords(data.query, columns, "all"))
      .orderBy(
        desc(rankSearchWords(data.query, columns, "all")),
        asc(a320Questions.id),
      )
      .limit(8);
  });
