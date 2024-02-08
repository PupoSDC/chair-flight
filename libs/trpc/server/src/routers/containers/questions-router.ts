import { z } from "zod";
import {
  createTestQuestion,
  questionBankNameSchema,
} from "@chair-flight/core/question-bank";
import { compileMdx } from "../../common/compile-mdx";
import {
  annexSearch,
  learningObjectiveSearch,
  questionBanks,
  questionSearch,
} from "../../common/providers";
import { publicProcedure, router } from "../../config/trpc";

export const questionsContainersRouter = router({
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
      const [annexes, learningObjectives, relatedQuestions] = await Promise.all(
        [
          annexSearch.retrieve(bank, template.annexes),
          learningObjectiveSearch.retrieve(bank, template.learningObjectives),
          questionSearch.retrieve(bank, template.relatedQuestions),
        ],
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
      return await questionSearch.getFilters(bank);
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

  getQuestionEditorManager: publicProcedure
    .input(
      z.object({
        questionBank: questionBankNameSchema,
      }),
    )
    .query(async ({ input }) => {
      const bank = questionBanks[input.questionBank];
      return await questionSearch.getFilters(bank);
    }),

  getQuestionEditorAnnexes: publicProcedure
    .input(z.object({ questionBank: questionBankNameSchema }))
    .query(({ input }) => {
      const bank = questionBanks[input.questionBank];
      return annexSearch.getFilters(bank);
    }),

  getQuestionEditorLearningObjectives: publicProcedure
    .input(z.object({ questionBank: questionBankNameSchema }))
    .query(({ input }) => {
      const bank = questionBanks[input.questionBank];
      return learningObjectiveSearch.getFilters(bank);
    }),

  getQuestionEditorRelatedQuestions: publicProcedure
    .input(z.object({ questionBank: questionBankNameSchema }))
    .query(({ input }) => {
      const bank = questionBanks[input.questionBank];
      return questionSearch.getFilters(bank);
    }),

  getQuestionEditorSubmitForm: publicProcedure.query(() => ({})),
  getQuestionEditorDiff: publicProcedure.query(() => ({})),
  getQuestionEditorExplanation: publicProcedure.query(() => ({})),
  getQuestionEditorVariant: publicProcedure.query(() => ({})),
  getQuestionEditorPreview: publicProcedure.query(() => ({})),
  getQuestionEditorCode: publicProcedure.query(() => ({})),
});
