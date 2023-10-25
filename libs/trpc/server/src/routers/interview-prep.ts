import { z } from "zod";
import { getEnvVariableOrThrow } from "@chair-flight/base/env";
import { NotFoundError } from "@chair-flight/base/errors";
import { publicProcedure, router } from "../config/trpc";
import type { FlashCardContent } from "@chair-flight/base/types";

const basePath = getEnvVariableOrThrow("NEXT_PUBLIC_BASE_URL");
const FLASH_CARDS_PATH = `${basePath}/content/interview-flash-cards/flash-cards.json`;

let flashCards: Record<string, FlashCardContent[]>;

const getFlashCards = async () => {
  if (!flashCards) {
    const response = await fetch(FLASH_CARDS_PATH);
    flashCards = (await response.json()) as Record<string, FlashCardContent[]>;
  }
  return flashCards;
};

export const interviewPrepRouter = router({
  getNumberOfFlashCards: publicProcedure //
    .query(async () => {
      const cards = await getFlashCards();
      const numberOfFlashCards = Object.values(flashCards).flat().length;
      return { numberOfFlashCards };
    }),
  getFlashCardsCollections: publicProcedure //
    .query(async () => {
      const allCards = await getFlashCards();
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
  getFlashCardsCollection: publicProcedure
    .input(z.object({ collectionId: z.string() }))
    .query(async ({ input }) => {
      const { collectionId } = input;
      const allFlashCards = await getFlashCards();
      const flashCards = allFlashCards[collectionId];
      if (!flashCards) {
        throw new NotFoundError(
          `Flashcard Collection "${collectionId}" not found!"`,
        );
      }
      return { flashCards };
    }),
  getFlashCard: publicProcedure
    .input(z.object({ flashCardId: z.string() }))
    .query(async ({ input }) => {
      const { flashCardId } = input;
      const flashCards = await getFlashCards();
      const flashCard = Object.values(flashCards)
        .flat()
        .find((flashCard) => flashCard.id === flashCardId);
      if (!flashCard) {
        throw new NotFoundError(`Flashcard "${flashCardId}" not found!"`);
      }
      return { flashCard };
    }),
});
