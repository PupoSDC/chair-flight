import { z } from "zod";
import { NotFoundError } from "@chair-flight/base/errors";
import { getFlashcards } from "@chair-flight/content/interview-flashcards";
import { publicProcedure, router } from "../config/trpc";

export const interviewPrepRouter = router({
  getNumberOfFlashcards: publicProcedure //
    .query(async () => {
      const flashCards = await getFlashcards();
      const numberOfFlashCards = Object.values(flashCards).flat().length;
      return { numberOfFlashCards };
    }),
  getFlashcardsCollections: publicProcedure //
    .query(async () => {
      const allCards = await getFlashcards();
      const flashCardCollections = Object.entries(allCards).map(
        ([collectionId, flashCards]) => ({
          collectionId,
          name: collectionId
            .split("-")
            .map((s) => s[0].toUpperCase() + s.slice(1))
            .join(" "),
          numberOfCards: flashCards.length,
        }),
      );
      return { flashCardCollections };
    }),
  getFlashcardsCollection: publicProcedure
    .input(z.object({ collectionId: z.string() }))
    .query(async ({ input }) => {
      const { collectionId } = input;
      const allFlashCards = await getFlashcards();
      const flashCards = allFlashCards[collectionId];
      if (!flashCards) {
        throw new NotFoundError(
          `Flashcard Collection "${collectionId}" not found!"`,
        );
      }
      return { flashCards };
    }),
  getFlashcard: publicProcedure
    .input(z.object({ flashCardId: z.string() }))
    .query(async ({ input }) => {
      const { flashCardId } = input;
      const flashCards = await getFlashcards();
      const flashCard = Object.values(flashCards)
        .flat()
        .find((flashCard) => flashCard.id === flashCardId);
      if (!flashCard) {
        throw new NotFoundError(`Flashcard "${flashCardId}" not found!"`);
      }
      return { flashCard };
    }),
});
