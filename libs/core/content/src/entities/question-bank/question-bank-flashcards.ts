import { z } from "zod";
import {
  flashcardCollectionIdSchema,
  flashcardIdSchema,
} from "./question-bank-ids";

export const flashcardContentSchema = z.object({
  id: flashcardIdSchema,
  question: z.string(),
  answer: z.string(),
});

export const flashcardCollectionSchema = z.object({
  id: flashcardCollectionIdSchema,
  title: z.string(),
  flashcards: z.array(flashcardContentSchema),
});

export type FlashcardContent = z.infer<typeof flashcardContentSchema>;
export type FlashcardCollection = z.infer<typeof flashcardCollectionSchema>;
