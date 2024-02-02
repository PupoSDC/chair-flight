import { z } from "zod";
import { getQuestionFromGit } from "@chair-flight/core/github";
import {
  questionBanks,
  questionBankNameSchema,
  createTestQuestion,
} from "@chair-flight/core/question-bank";
import {
  getLearningObjectivesSearchResults,
  getQuestionSearchResults,
  getQuestionsSearchFilters,
} from "@chair-flight/core/search";
import { publicProcedure, router } from "../../config/trpc";

export const questionsContainersRouter = router({
  getQuestionEditor: publicProcedure
    .input(
      z.object({
        questionBank: questionBankNameSchema,
        questionId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const qb = questionBanks[input.questionBank];
      const question = await qb.getOne("questions", input.questionId);
      const questionTemplate = await getQuestionFromGit({
        questionId: question.id,
        srcLocation: question.srcLocation,
      });
      return { questionTemplate };
    }),
  getQuestionOverview: publicProcedure
    .input(
      z.object({
        questionBank: questionBankNameSchema,
        questionId: z.string(),
        seed: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const id = input.questionId;
      const bankName = input.questionBank;
      const bank = questionBanks[bankName];
      const template = await bank.getOne("questions", id);
      const rawAnnexes = await bank.getSome("annexes", template.annexes);

      const question = createTestQuestion(template, { seed: input.seed });

      const annexes = rawAnnexes.map((a) => ({
        id: a.id,
        href: a.href,
      }));

      const learningObjectives = await getLearningObjectivesSearchResults(
        bank,
        template.learningObjectives,
      );

      const relatedQuestions = await getQuestionSearchResults(
        bank,
        template.relatedQuestions,
      );

      return {
        question,
        annexes,
        learningObjectives,
        relatedQuestions,
        externalIds: template.externalIds,
        editLink: `/modules/${bankName}/questions/${id}/edit`,
      };
    }),
  getQuestionSearch: publicProcedure
    .input(
      z.object({
        questionBank: questionBankNameSchema,
      }),
    )
    .query(async ({ input }) => {
      const bank = questionBanks[input.questionBank];
      const filters = await getQuestionsSearchFilters(bank);
      return { filters };
    }),
});
