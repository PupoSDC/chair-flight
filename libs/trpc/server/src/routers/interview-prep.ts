import { z } from "zod";
import { NotFoundError } from "@chair-flight/base/errors";
import { getFlashcards } from "@chair-flight/content/interview-flashcards";
import { makeCountHandler } from "../common/count";
import { publicProcedure, router } from "../config/trpc";

export const interviewPrepRouter = router({
  getNumberOfFlashcards: makeCountHandler({
    getData: async () => Object.values(await getFlashcards()).flat(),
  }),
  getFlashcardsCollections: publicProcedure //
    .query(async () => {
      const allCards = await getFlashcards();
      const flashcardCollections = Object.entries(allCards).map(
        ([collectionId, flashcards]) => ({
          collectionId,
          name: collectionId
            .split("-")
            .map((s) => s[0].toUpperCase() + s.slice(1))
            .join(" "),
          numberOfCards: flashcards.length,
        }),
      );
      return { flashcardCollections };
    }),
  getFlashcardsCollection: publicProcedure
    .input(z.object({ collectionId: z.string() }))
    .query(async ({ input }) => {
      const { collectionId } = input;
      const allflashcards = await getFlashcards();
      const flashcards = allflashcards[collectionId];
      if (!flashcards) {
        throw new NotFoundError(
          `flashcard Collection "${collectionId}" not found!"`,
        );
      }
      return { flashcards };
    }),
});
