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
      const questionBank = input.questionBank;
      const bank = questionBanks[input.questionBank];
      const template = await bank.getOne("questions", id);
      const loIds = template.learningObjectives;
      const rawAnnexes = await bank.getSome("annexes", template.annexes);
      const editLink = `/modules/${questionBank}/questions/${id}/edit`;

      const question = createTestQuestion(template, { seed: input.seed });

      const annexes = rawAnnexes.map((a) => ({
        id: a.id,
        href: a.href,
      }));

      const learningObjectives = await getLearningObjectivesSearchResults(
        bank,
        loIds,
      );

      const relatedQuestions = await getQuestionSearchResults(
        bank,
        template.relatedQuestions,
      )

      return {
        question,
        annexes,
        learningObjectives,
        relatedQuestions,
        externalIds: template.externalIds,
        editLink,
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
