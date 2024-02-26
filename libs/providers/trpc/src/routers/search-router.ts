import { searchParams, retrieveParams } from "@cf/core/search";
import { QuestionBank } from "@cf/providers/question-bank";
import {
  LearningObjectiveSearch,
  AnnexSearch,
  QuestionSearch,
  DocSearch,
} from "@cf/providers/search";
import { publicProcedure, router } from "../config/trpc";

export const searchRouter = router({
  initialize: publicProcedure.query(async () => {
    /**
    for (const bank of Object.values(questionBanks)) {
      await Promise.all([
        LearningObjectiveSearch.get().initialize(bank),
        AnnexSearch.get().initialize(bank),
        QuestionSearch.get().initialize(bank),
        DocSearch.get().initialize(bank),
      ]);
    } */
    return "ok";
  }),
  searchLearningObjectives: publicProcedure
    .input(searchParams)
    .query(async ({ input }) => {
      const bank = new QuestionBank(input.questionBank);
      return await new LearningObjectiveSearch().search(bank, input);
    }),
  searchAnnexes: publicProcedure
    .input(searchParams)
    .query(async ({ input }) => {
      const bank = new QuestionBank(input.questionBank);
      return await new AnnexSearch().search(bank, input);
    }),
  searchQuestions: publicProcedure
    .input(searchParams)
    .query(async ({ input }) => {
      const bank = new QuestionBank(input.questionBank);
      return await new QuestionSearch().search(bank, input);
    }),
  searchDocs: publicProcedure.input(searchParams).query(async ({ input }) => {
    const bank = new QuestionBank(input.questionBank);
    return await new DocSearch().search(bank, input);
  }),
  retrieveLearningObjective: publicProcedure
    .input(retrieveParams)
    .query(async ({ input }) => {
      const bank = new QuestionBank(input.questionBank);
      return await new LearningObjectiveSearch().retrieve(bank, input.ids);
    }),
  retrieveAnnexes: publicProcedure
    .input(retrieveParams)
    .query(async ({ input }) => {
      const bank = new QuestionBank(input.questionBank);
      return await new AnnexSearch().retrieve(bank, input.ids);
    }),
  retrieveQuestions: publicProcedure
    .input(retrieveParams)
    .query(async ({ input }) => {
      const bank = new QuestionBank(input.questionBank);
      return await new QuestionSearch().retrieve(bank, input.ids);
    }),
  retrieveDocs: publicProcedure
    .input(retrieveParams)
    .query(async ({ input }) => {
      const bank = new QuestionBank(input.questionBank);
      return await new DocSearch().retrieve(bank, input.ids);
    }),
});
