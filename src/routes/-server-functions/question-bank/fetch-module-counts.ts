import { createServerFn } from "@tanstack/react-start";
import { count } from "drizzle-orm";
import { flashcards, questions } from "../../../database";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";

export const fetchModuleCounts = createServerFn({ method: "GET" }).handler(
  async () => {
    const db = getSupabaseDb();
    const [questionCounts, flashcardCounts] = await Promise.all([
      db
        .select({ questionBank: questions.questionBank, total: count() })
        .from(questions)
        .groupBy(questions.questionBank),
      db
        .select({ questionBank: flashcards.questionBank, total: count() })
        .from(flashcards)
        .groupBy(flashcards.questionBank),
    ]);
    return Object.fromEntries(
      [...questionCounts, ...flashcardCounts].map((row) => [
        row.questionBank,
        row.total,
      ]),
    );
  },
);
