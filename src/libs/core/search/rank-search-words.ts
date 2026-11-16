import { sql } from "drizzle-orm";
import { escapeLikePattern } from "./escape-like-pattern";
import { getSearchWords } from "./get-search-words";
import type { SearchColumns, SearchField } from "./search-types";

export const rankSearchWords = (
  query: string,
  columns: SearchColumns,
  field: SearchField = "all",
) => {
  const words = getSearchWords(query);
  if (words.length === 0) return sql`0::float8`;
  const joined = words.join(" ");
  const idScore =
    field === "text" || field === "source"
      ? sql`0`
      : sql`(case
          when lower(${columns.id}) = lower(${joined}) then 100
          when starts_with(lower(${columns.id}), lower(${joined})) then 50
          when ${columns.id} ilike ${`%${escapeLikePattern(joined)}%`} then 25
          else 0 end)`;
  const sourceScore =
    columns.source && (field === "all" || field === "source")
      ? sql`(case when ${columns.source} ilike ${`%${escapeLikePattern(joined)}%`} then 5 else 0 end)`
      : sql`0`;
  const textScore =
    field === "id" || field === "source"
      ? sql`0`
      : sql`(ts_rank_cd(to_tsvector('english', ${columns.text}), websearch_to_tsquery('english', ${joined})) * 10
          + (case when ${columns.text} ilike ${`%${escapeLikePattern(joined)}%`} then 5 else 0 end))`;
  return sql<number>`(${idScore} + ${textScore} + ${sourceScore})`;
};
