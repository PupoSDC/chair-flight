import { z } from "zod";
import {
  questionBankResourceSchema,
  questionBanks,
} from "@chair-flight/core/question-bank";
import { publicProcedure, router } from "../../config/trpc";
import type { QuestionBankName } from "@chair-flight/core/question-bank";

export const modulesPagesRouter = router({
  getIndexGenerationPaths: publicProcedure
    .input(
      z.object({
        resource: questionBankResourceSchema,
      }),
    )
    .query(async ({ input }) => {
      const banks: QuestionBankName[] = [];
      for (const bank of Object.values(questionBanks)) {
        if (await bank.has(input.resource)) banks.push(bank.getName());
      }
      return banks.map((questionBank) => ({ params: { questionBank } }));
    }),
  getDocGenerationPaths: publicProcedure.query(async () => {
    type Path = {
      params: {
        questionBank: QuestionBankName;
        docId: string;
      };
    };

    const paths: Path[] = [];
    for (const bank of Object.values(questionBanks)) {
      const docs = await bank.getAll("docs");
      paths.push(
        ...docs.map((doc) => ({
          params: {
            docId: doc.id,
            questionBank: bank.getName(),
          },
        })),
      );
    }
    return { paths };
  }),

  getFlashcardsGenerationPaths: publicProcedure.query(async () => {
    type Path = {
      params: {
        questionBank: QuestionBankName;
        collectionId: string;
      };
    };

    const paths: Path[] = [];
    for (const bank of Object.values(questionBanks)) {
      const cards = await bank.getAll("flashcards");
      paths.push(
        ...cards.map((card) => ({
          params: {
            collectionId: card.id,
            questionBank: bank.getName(),
          },
        })),
      );
    }

    return { paths };
  }),
});
