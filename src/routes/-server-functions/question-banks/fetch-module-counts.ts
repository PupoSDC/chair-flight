import { createServerFn } from "@tanstack/react-start";
import { count, isNull } from "drizzle-orm";
import {
  a320Questions,
  atplQuestions,
  b737Questions,
  prepFlashcards,
} from "../../../database";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";

export const fetchModuleCounts = createServerFn({ method: "GET" }).handler(
  async () => {
    const db = getSupabaseDb();
    const [[atpl], [a320], [b737], [prep]] = await Promise.all([
      db
        .select({ total: count() })
        .from(atplQuestions)
        .where(isNull(atplQuestions.removedAt)),
      db.select({ total: count() }).from(a320Questions),
      db.select({ total: count() }).from(b737Questions),
      db.select({ total: count() }).from(prepFlashcards),
    ]);
    return Object.fromEntries(
      Object.entries({
        atpl: atpl?.total ?? 0,
        a320: a320?.total ?? 0,
        b737: b737?.total ?? 0,
        prep: prep?.total ?? 0,
      }).filter(([, total]) => total > 0),
    );
  },
);
