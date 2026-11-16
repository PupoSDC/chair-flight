import { createServerFn } from "@tanstack/react-start";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { prepFlashcards as flashcards } from "../../../database";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";

export const fetchPrepFlashcards = createServerFn({ method: "GET" })
  .validator(
    z.object({
      collectionId: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    return getSupabaseDb()
      .select({
        id: flashcards.id,
        question: flashcards.question,
        answer: flashcards.answer,
      })
      .from(flashcards)
      .where(eq(flashcards.collectionId, data.collectionId))
      .orderBy(asc(flashcards.id));
  });
