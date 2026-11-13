import { createServerFn } from "@tanstack/react-start";
import { asc, count, eq } from "drizzle-orm";
import { z } from "zod";
import { flashcards } from "../../../database";
import { QUESTION_BANK_NAMES } from "../../../libs/core/question-bank/question-banks";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";

export const fetchFlashcardCollections = createServerFn({ method: "GET" })
  .validator(z.object({ questionBank: z.enum(QUESTION_BANK_NAMES) }))
  .handler(async ({ data }) => {
    return getSupabaseDb()
      .select({ id: flashcards.collectionId, numberOfFlashcards: count() })
      .from(flashcards)
      .where(eq(flashcards.questionBank, data.questionBank))
      .groupBy(flashcards.collectionId)
      .orderBy(asc(flashcards.collectionId));
  });
