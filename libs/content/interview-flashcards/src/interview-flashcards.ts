import { API_flashcardS_PATH } from "./constants";
import type { FlashcardContent } from "@chair-flight/base/types";

export const getFlashcards = (() => {
  let flashcards: Record<string, FlashcardContent[]>;
  return async () => {
    if (!flashcards) {
      const response = await fetch(API_flashcardS_PATH);
      flashcards = (await response.json()) as Record<
        string,
        FlashcardContent[]
      >;
    }
    return flashcards;
  };
})();
