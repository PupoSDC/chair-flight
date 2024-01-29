import { z } from "zod";
import {
  getLearningObjectivesSearchFilters,
  populateLearningObjectivesSearchIndex,
  populateQuestionsSearchIndex,
} from "@chair-flight/core/app";
import { questionBanks } from "@chair-flight/core/question-bank";
import { questionBankNameSchema } from "@chair-flight/core/schemas";
import {
  learningObjectiveSearchIndex,
  learningObjectiveSearchResults,
  questionSearchIndex,
  questionSearchResults,
} from "../../common/search-indexes";
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
      await populateQuestionsSearchIndex({
        bank,
        searchIndex: questionSearchIndex,
        searchResults: questionSearchResults,
      });

      const resultIds = await bank
        .getOne("learningObjectives", loId)
        .then((lo) => bank.getSome("questions", lo.nestedQuestions))
        .then((qs) => qs.map((q) => Object.keys(q.variants)[0]));

      const results = resultIds
        .map((id) => questionSearchResults.get(id))
        .filter(Boolean);

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

      await populateLearningObjectivesSearchIndex({
        bank,
        searchIndex: learningObjectiveSearchIndex,
        searchResults: learningObjectiveSearchResults,
      });

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
        .map((t) => learningObjectiveSearchResults.get(t))
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
