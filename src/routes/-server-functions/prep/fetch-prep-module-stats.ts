import { createServerFn } from "@tanstack/react-start";
import { count } from "drizzle-orm";
import { prepFlashcards } from "../../../database";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";

export const fetchPrepModuleStats = createServerFn({ method: "GET" }).handler(
  async () => {
    const [flashcards] = await getSupabaseDb()
      .select({ total: count() })
      .from(prepFlashcards);
    return { flashcards: flashcards?.total ?? 0 };
  },
);
