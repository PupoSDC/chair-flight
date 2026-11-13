import { createServerFn } from "@tanstack/react-start";
import { and, asc, eq } from "drizzle-orm";
import { z } from "zod";
import { flashcards } from "../../../database";
import { QUESTION_BANK_NAMES } from "../../../libs/core/question-bank/question-banks";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";

export const fetchFlashcards = createServerFn({ method: "GET" })
  .validator(
    z.object({
      questionBank: z.enum(QUESTION_BANK_NAMES),
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
      .where(
        and(
          eq(flashcards.questionBank, data.questionBank),
          eq(flashcards.collectionId, data.collectionId),
        ),
      )
      .orderBy(asc(flashcards.id));
  });
