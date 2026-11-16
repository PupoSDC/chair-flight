import { and, ilike, or, sql } from "drizzle-orm";
import { escapeLikePattern } from "./escape-like-pattern";
import { getSearchWords } from "./get-search-words";
import type { SearchColumns, SearchField } from "./search-types";

const getSearchedColumns = (columns: SearchColumns, field: SearchField) => {
  if (field === "id") return [columns.id];
  if (field === "text") return [columns.text];
  if (field === "source") return columns.source ? [columns.source] : [];
  const base = [columns.id, columns.text];
  return columns.source ? [...base, columns.source] : base;
};

export const matchSearchWords = (
  query: string,
  columns: SearchColumns,
  field: SearchField = "all",
) => {
  const words = getSearchWords(query);
  if (words.length === 0) return undefined;
  const searched = getSearchedColumns(columns, field);
  const substrings = and(
    ...words.map((word) =>
      or(
        ...searched.map((column) =>
          ilike(column, `%${escapeLikePattern(word)}%`),
        ),
      ),
    ),
  );
  if (field === "id" || field === "source") return substrings;
  return or(
    sql`to_tsvector('english', ${columns.text}) @@ websearch_to_tsquery('english', ${words.join(" ")})`,
    substrings,
  );
};
