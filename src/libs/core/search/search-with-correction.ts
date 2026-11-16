import { sql } from "drizzle-orm";
import { getSearchWords } from "./get-search-words";
import type { SQL } from "drizzle-orm";
import type { SearchField } from "./search-types";

const correctSearchQuery = async (
  query: string,
  vocabulary: SQL,
  execute: (query: SQL) => Promise<Record<string, unknown>[]>,
) => {
  const words = getSearchWords(query).map((word) =>
    word.toLowerCase().slice(0, 40),
  );
  if (words.length === 0) return null;
  const list = sql.join(
    words.map((word) => sql`${word}`),
    sql`, `,
  );
  const rows = (await execute(sql`
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
  `)) as {
    word: string;
    known: boolean;
    fix: string | null;
  }[];
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
  execute: (query: SQL) => Promise<Record<string, unknown>[]>,
) => {
  const rows = await run(query);
  if (rows.length > 0 || field === "id" || field === "source" || !query.trim())
    return { rows, correctedQuery: null };
  const correctedQuery = await correctSearchQuery(query, vocabulary, execute);
  if (!correctedQuery) return { rows, correctedQuery: null };
  return { rows: await run(correctedQuery), correctedQuery };
};
