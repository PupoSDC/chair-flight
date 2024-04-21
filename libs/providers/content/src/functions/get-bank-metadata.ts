import type { BlogPost } from "@cf/core/blog";
import type { ContentDb } from "../../drizzle";
import { contentSchema } from "../../drizzle";
import { makeDocument } from "./make-document";
import { QuestionBankName } from "@cf/core/question-bank";
import { count, eq, sql } from "drizzle-orm";

export const getBankMetadata = async (db: ContentDb, questionBank: QuestionBankName) => {
    const questionsSchema = contentSchema.questionTemplates;
    const [{ numberOfQuestions }] = await db
        .select({
            numberOfQuestions: count(),
        }).from(questionsSchema).where(
            eq(questionsSchema.status, 'current')
        );
    const [{ numberOfFlashcardCollections }] = await db
        .select({
            numberOfFlashcardCollections: count(),
        }).from(contentSchema.flashcardCollections).where(
            eq(contentSchema.flashcardCollections.status, 'current')
        );

    return { numberOfQuestions, numberOfFlashcardCollections };
};
