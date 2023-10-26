import { API_FLASHCARDS_PATH } from "./constants";
import type { FlashCardContent } from "@chair-flight/base/types";

export const getFlashcards = (() => {
  let flashCards: Record<string, FlashCardContent[]>;
  return async () => {
    if (!flashCards) {
      const response = await fetch(API_FLASHCARDS_PATH);
      flashCards = (await response.json()) as Record<
        string,
        FlashCardContent[]
      >;
    }
    return flashCards;
  };
})();
