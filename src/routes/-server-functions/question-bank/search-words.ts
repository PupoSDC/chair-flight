import { and, ilike, or, sql } from "drizzle-orm";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";
import type { SQL } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";

type SearchColumns = { id: AnyPgColumn; text: AnyPgColumn };
type SearchField = "all" | "id" | "text";

const escapeLike = (value: string) => value.replace(/[\\%_]/g, "\\$&");

const getWords = (query: string) =>
  query.split(/\s+/).filter(Boolean).slice(0, 8);

const getSearched = (columns: SearchColumns, field: SearchField) =>
  field === "id"
    ? [columns.id]
    : field === "text"
      ? [columns.text]
      : [columns.id, columns.text];

export const matchSearchWords = (
  query: string,
  columns: SearchColumns,
  field: SearchField = "all",
) => {
  const words = getWords(query);
  if (words.length === 0) return undefined;
  const searched = getSearched(columns, field);
  const substrings = and(
    ...words.map((word) =>
      or(...searched.map((column) => ilike(column, `%${escapeLike(word)}%`))),
    ),
  );
  if (field === "id") return substrings;
  return or(
    sql`to_tsvector('english', ${columns.text}) @@ websearch_to_tsquery('english', ${words.join(" ")})`,
    substrings,
  );
};

export const rankSearchWords = (
  query: string,
  columns: SearchColumns,
  field: SearchField = "all",
) => {
  const words = getWords(query);
  if (words.length === 0) return sql`0::float8`;
  const joined = words.join(" ");
  const idScore =
    field === "text"
      ? sql`0`
      : sql`(case
          when lower(${columns.id}) = lower(${joined}) then 100
          when starts_with(lower(${columns.id}), lower(${joined})) then 50
          when ${columns.id} ilike ${`%${escapeLike(joined)}%`} then 25
          else 0 end)`;
  const textScore =
    field === "id"
      ? sql`0`
      : sql`(ts_rank_cd(to_tsvector('english', ${columns.text}), websearch_to_tsquery('english', ${joined})) * 10
          + (case when ${columns.text} ilike ${`%${escapeLike(joined)}%`} then 5 else 0 end))`;
  return sql<number>`(${idScore} + ${textScore})`;
};

const correctSearchQuery = async (query: string, vocabulary: SQL) => {
  const words = getWords(query).map((word) => word.toLowerCase().slice(0, 40));
  if (words.length === 0) return null;
  const list = sql.join(
    words.map((word) => sql`${word}`),
    sql`, `,
  );
  const rows = await getSupabaseDb().execute<{
    word: string;
    known: boolean;
    fix: string | null;
  }>(sql`
    with vocabulary as (
      select w, count(*) as n
      from (${vocabulary}) as source
      where length(w) >= 3
      group by w
    ),
    words as (select unnest(array[${list}]::text[]) as word)
    select
      words.word,
      exists (
        select 1 from vocabulary v where v.w like words.word || '%'
      ) as known,
      (
        select v.w from vocabulary v
        where abs(length(v.w) - length(words.word)) <= 2
          and extensions.levenshtein(v.w, words.word)
            <= case when length(words.word) <= 3 then 1 else 2 end
        order by
          extensions.levenshtein(v.w, words.word),
          (left(v.w, 1) = left(words.word, 1)) desc,
          abs(length(v.w) - length(words.word)),
          v.n desc
        limit 1
      ) as fix
    from words
  `);
  const corrected = words
    .map((word) => {
      const row = rows.find((item) => item.word === word);
      return row && !row.known && row.fix ? row.fix : word;
    })
    .join(" ");
  return corrected === words.join(" ") ? null : corrected;
};

export const searchWithCorrection = async <T>(
  query: string,
  field: SearchField,
  vocabulary: SQL,
  run: (query: string) => Promise<T[]>,
) => {
  const rows = await run(query);
  if (rows.length > 0 || field === "id" || !query.trim())
    return { rows, correctedQuery: null };
  const correctedQuery = await correctSearchQuery(query, vocabulary);
  if (!correctedQuery) return { rows, correctedQuery: null };
  return { rows: await run(correctedQuery), correctedQuery };
};
