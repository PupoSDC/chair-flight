import { createServerFn } from "@tanstack/react-start";
import { asc, count } from "drizzle-orm";
import { prepFlashcards as flashcards } from "../../../database";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";

export const fetchPrepFlashcardCollections = createServerFn({
  method: "GET",
}).handler(async () => {
  return getSupabaseDb()
    .select({ id: flashcards.collectionId, numberOfFlashcards: count() })
    .from(flashcards)
    .groupBy(flashcards.collectionId)
    .orderBy(asc(flashcards.collectionId));
});
