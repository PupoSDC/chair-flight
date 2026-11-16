import type { AnyPgColumn } from "drizzle-orm/pg-core";

export type SearchColumns = {
  id: AnyPgColumn;
  text: AnyPgColumn;
  source?: AnyPgColumn;
};

export type SearchField = "all" | "id" | "text" | "source";
