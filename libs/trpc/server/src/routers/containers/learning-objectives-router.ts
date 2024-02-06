import { z } from "zod";
import { questionBankNameSchema } from "@chair-flight/core/question-bank";
import {
  learningObjectiveSearch,
  questionBanks,
  questionSearch,
} from "../../common/providers";
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

      const resultIds = await bank
        .getOne("learningObjectives", loId)
        .then((lo) => bank.getSome("questions", lo.nestedQuestions))
        .then((qs) => qs.map((q) => Object.keys(q.variants)[0]));

      return await questionSearch.retrieve(bank, resultIds);
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

      return await learningObjectiveSearch.retrieve(bank, tree.sort());
    }),

  getLearningObjectivesSearch: publicProcedure
    .input(
      z.object({
        questionBank: questionBankNameSchema,
      }),
    )
    .query(async ({ input }) => {
      const bank = questionBanks[input.questionBank];
      return await learningObjectiveSearch.getFilters(bank);
    }),
});
