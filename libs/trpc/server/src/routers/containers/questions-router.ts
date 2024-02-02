import { z } from "zod";
import { compileMdx } from "@chair-flight/core/mdx";
import {
  questionBanks,
  questionBankNameSchema,
  createTestQuestion,
} from "@chair-flight/core/question-bank";
import {
  getAnnexSearchResults,
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
      return { questionTemplate: question };
    }),
  getQuestionStandAlone: publicProcedure
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
      const annexes = rawAnnexes.map((a) => ({ id: a.id, href: a.href }));
      return { question, annexes };
    }),
  getQuestionExplanation: publicProcedure
    .input(
      z.object({
        questionBank: questionBankNameSchema,
        questionId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const id = input.questionId;
      const bankName = input.questionBank;
      const bank = questionBanks[bankName];
      const template = await bank.getOne("questions", id);
      const explanation = template.explanation
        ? await compileMdx(template.explanation)
        : null;
      return { explanation };
    }),
  getQuestionMeta: publicProcedure
    .input(
      z.object({
        questionBank: questionBankNameSchema,
        questionId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const id = input.questionId;
      const bankName = input.questionBank;
      const bank = questionBanks[bankName];
      const template = await bank.getOne("questions", id);

      const annexes = await getAnnexSearchResults(bank, template.annexes);

      const learningObjectives = await getLearningObjectivesSearchResults(
        bank,
        template.learningObjectives,
      );

      const relatedQuestions = await getQuestionSearchResults(
        bank,
        template.relatedQuestions,
      );

      const externalIds = template.externalIds.map((id) => ({
        id: id,
        href: null,
      }));

      return { annexes, learningObjectives, relatedQuestions, externalIds };
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
