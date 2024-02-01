import { z } from "zod";
import {
  getLearningObjectivesSearchFilters,
  loSearchResults,
  populateLearningObjectivesSearchIndex,
  populateQuestionsSearchIndex,
  questionSearchResults,
} from "@chair-flight/core/search";
import { questionBanks } from "@chair-flight/core/question-bank";
import { questionBankNameSchema } from "@chair-flight/core/question-bank";
import { publicProcedure, router } from "../../config/trpc";

export const learningObjectivesContainersRouter = router({
  getLearningObjectiveOverview: publicProcedure
    .input(
      z.object({
        questionBank: questionBankNameSchema,
        learningObjectiveId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const loId = input.learningObjectiveId;
      const qb = questionBanks[input.questionBank];
      const learningObjective = await qb.getOne("learningObjectives", loId);
      const courses = await qb.getAll("courses");
      return { learningObjective, courses };
    }),

  getLearningObjectiveQuestions: publicProcedure
    .input(
      z.object({
        questionBank: questionBankNameSchema,
        learningObjectiveId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const loId = input.learningObjectiveId;
      const bank = questionBanks[input.questionBank];
      await populateQuestionsSearchIndex(bank);

      const results = await bank
        .getOne("learningObjectives", loId)
        .then((lo) => bank.getSome("questions", lo.nestedQuestions))
        .then((qs) => qs
          .map((q) => questionSearchResults.get(q.id))
          .filter(Boolean)
        );

      return { results };
    }),

  getLearningObjectiveTree: publicProcedure
    .input(
      z.object({
        questionBank: questionBankNameSchema,
        learningObjectiveId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const loId = input.learningObjectiveId;
      const bank = questionBanks[input.questionBank];
      await populateLearningObjectivesSearchIndex(bank);

      const mainLo = await bank.getOne("learningObjectives", loId);
      const tree = [mainLo.id];

      // Populate up the tree
      for (let i = tree.length - 1; i < tree.length; i++) {
        try {
          const lo = await bank.getOne("learningObjectives", tree[i]);
          tree.push(lo.parentId);
        } catch (e) {
          break;
        }
      }

      tree.reverse();

      // Populate down the tree
      for (let i = tree.length - 1; i < tree.length; i++) {
        const lo = await bank.getOne("learningObjectives", tree[i]);
        tree.push(...lo.learningObjectives);
      }

      const items = tree
        .sort()
        .map((t) => loSearchResults.get(t))
        .filter(Boolean);

      return { items };
    }),

  getLearningObjectivesSearch: publicProcedure
    .input(
      z.object({
        questionBank: questionBankNameSchema,
      }),
    )
    .query(async ({ input }) => {
      const bank = questionBanks[input.questionBank];
      const questionBank = input.questionBank;
      const filters = await getLearningObjectivesSearchFilters(bank);
      return { filters, questionBank };
    }),
});
