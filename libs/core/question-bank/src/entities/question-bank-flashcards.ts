import type { FlashcardCollectionId, FlashcardId } from "./ids";

export type FlashcardContent = {
  id: FlashcardId;
  question: string;
  answer: string;
};

export type FlashcardCollection = {
  id: FlashcardCollectionId;
  title: string;
  flashcards: FlashcardContent[];
};
