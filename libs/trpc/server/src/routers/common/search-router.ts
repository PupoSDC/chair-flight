import { questionBanks } from "@chair-flight/core/question-bank";
import {
  searchLearningObjectivesParams,
  searchAnnexesParams,
  searchLearningObjectives,
  searchAnnexes,
  searchDocs,
  searchQuestionsParams,
  searchDocsParams,
  searchQuestions,
  getLearningObjectivesSearchResults,
  getQuestionSearchResults,
  getAnnexSearchResults,
  getDocSearchResults,
} from "@chair-flight/core/search";
import { publicProcedure, router } from "../../config/trpc";

export const searchRouter = router({
  initialize: publicProcedure.query(async () => {
    for (const bank of Object.values(questionBanks)) {
      await Promise.all([
        getDocSearchResults(bank, []),
        getAnnexSearchResults(bank, []),
        getQuestionSearchResults(bank, []),
        getLearningObjectivesSearchResults(bank, []),
      ]);
    }
    return "ok";
  }),
  searchLearningObjectives: publicProcedure
    .input(searchLearningObjectivesParams)
    .query(async ({ input }) => {
      const bank = questionBanks[input.questionBank];
      return await searchLearningObjectives(bank, input);
    }),
  searchAnnexes: publicProcedure
    .input(searchAnnexesParams)
    .query(async ({ input }) => {
      const bank = questionBanks[input.questionBank];
      return await searchAnnexes(bank, input);
    }),
  searchQuestions: publicProcedure
    .input(searchQuestionsParams)
    .query(async ({ input }) => {
      const bank = questionBanks[input.questionBank];
      return await searchQuestions(bank, input);
    }),
  searchDocs: publicProcedure
    .input(searchDocsParams)
    .query(async ({ input }) => {
      const bank = questionBanks[input.questionBank];
      return await searchDocs(bank, input);
    }),
});
