import { and, count, eq } from "drizzle-orm";
import { contentSchema } from "../../drizzle";
import type { ContentDb } from "../../drizzle";

export const getBankMetadata = async (db: ContentDb) => {
  const questionsSchema = contentSchema.questionTemplates;
  const [{ numberOfQuestions }] = await db
    .select({
      numberOfQuestions: count(),
    })
    .from(questionsSchema)
    .where(and(eq(questionsSchema.status, "current")));
  const [{ numberOfFlashcardCollections }] = await db
    .select({
      numberOfFlashcardCollections: count(),
    })
    .from(contentSchema.flashcardCollections)
    .where(eq(contentSchema.flashcardCollections.status, "current"));

  return { numberOfQuestions, numberOfFlashcardCollections };
};
