import { z } from "zod";
import { getRandomShuffler } from "@chair-flight/base/utils";
import { questionBanks } from "@chair-flight/core/question-bank";
import { questionBankNameSchema } from "@chair-flight/core/schemas";
import { publicProcedure, router } from "../../config/trpc";

export const flashcardsContainersRouter = router({
  getFlashcardCollectionList: publicProcedure
    .input(
      z.object({
        questionBank: questionBankNameSchema,
      }),
    )
    .query(async ({ input }) => {
      const bank = questionBanks[input.questionBank];
      const rawCollections = await bank.getAll("flashcards");
      const collections = rawCollections.map((collection) => ({
        id: collection.id,
        title: collection.title,
        numberOfFlashcards: collection.flashcards.length,
      }));
      return { collections };
    }),
  getFlashcardList: publicProcedure
    .input(
      z.object({
        questionBank: questionBankNameSchema,
        collectionId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const cId = input.collectionId;
      const bank = questionBanks[input.questionBank];
      const collection = await bank.getOne("flashcards", cId);
      return collection;
    }),
  getFlashcardTest: publicProcedure
    .input(
      z.object({
        questionBank: questionBankNameSchema,
        collectionId: z.string(),
        seed: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const cId = input.collectionId;
      const seed = input.seed;
      const questionBank = input.questionBank;
      const bank = questionBanks[input.questionBank];
      const collection = await bank.getOne("flashcards", cId);
      const rawFlashcards = collection.flashcards;
      const shuffle = getRandomShuffler(input.seed);
      const flashcards = shuffle(rawFlashcards).slice(0, 10);
      const flashcardsHref = `/modules/${questionBank}/flashcards`;
      const href = `${flashcardsHref}/${cId}/${seed}`;
      return { flashcards, href, flashcardsHref };
    }),
});
