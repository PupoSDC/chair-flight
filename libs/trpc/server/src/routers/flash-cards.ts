import { z } from "zod";
import { NotFoundError } from "@chair-flight/base/errors";
import { router, publicProcedure } from "../config/trpc";

export const flashCardsRouter = router({
  getFlashCardsCollection: publicProcedure
    .input(
      z.object({
        collectionId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { collectionId } = input;
      const { questionBank } = ctx;
      const flashCards = await questionBank.getFlashCards(collectionId);
      return { flashCards };
    }),
  getFlashCardCollections: publicProcedure.query(async ({ ctx }) => {
    const { questionBank } = ctx;
    const allCards = await questionBank.getAllFlashCards();
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
  getAllFlashCards: publicProcedure.query(async ({ ctx }) => {
    const { questionBank } = ctx;
    const flashCards = await questionBank.getAllFlashCards();
    return { flashCards };
  }),
  getNumberOfFlashCards: publicProcedure.query(async ({ ctx }) => {
    const { questionBank } = ctx;
    const flashCards = await questionBank.getAllFlashCards();
    const numberOfFlashCards = Object.values(flashCards).flat().length;
    return { numberOfFlashCards };
  }),
  getFlashCard: publicProcedure
    .input(
      z.object({
        flashCardId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { flashCardId } = input;
      const { questionBank } = ctx;
      const flashCards = await questionBank.getAllFlashCards();
      const flashCard = Object.values(flashCards)
        .flat()
        .find((flashCard) => flashCard.id === flashCardId);
      if (!flashCard) throw new NotFoundError("Missing showcase flash card!");
      return { flashCard };
    }),
});
