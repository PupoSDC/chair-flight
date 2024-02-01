import { questionBanks } from "@chair-flight/core/question-bank";
import { publicProcedure, router } from "../../config/trpc";
import {
  populateAnnexesSearchIndex,
  populateLearningObjectivesSearchIndex,
  populateDocsSearchIndex,
  populateQuestionsSearchIndex,
  searchLearningObjectivesParams,
  searchAnnexesParams,
  searchLearningObjectives,
  searchAnnexes,
  searchDocs,
  searchQuestionsParams,
  searchDocsParams,
  searchQuestions,
} from "@chair-flight/core/search";

export const searchRouter = router({
  initialize: publicProcedure.query(async () => {
    for (const bank of Object.values(questionBanks)) {
      await Promise.all([
        populateLearningObjectivesSearchIndex(bank),
        populateAnnexesSearchIndex(bank),
        populateQuestionsSearchIndex(bank),
        populateDocsSearchIndex(bank),
      ]);
    }
    return "ok";
  }),
  searchLearningObjectives: publicProcedure
    .input(searchLearningObjectivesParams)
    .query(async ({ input }) => {
      const bank = questionBanks[input.questionBank];
      await populateLearningObjectivesSearchIndex(bank);
      return await searchLearningObjectives(input);
    }),
  searchAnnexes: publicProcedure
    .input(searchAnnexesParams)
    .query(async ({ input }) => {
      const bank = questionBanks[input.questionBank];
      await populateAnnexesSearchIndex(bank);
      return await searchAnnexes(input);
    }),
  searchQuestions: publicProcedure
    .input(searchQuestionsParams)
    .query(async ({ input }) => {
      const bank = questionBanks[input.questionBank];
      return  await searchQuestions(input);
    }),
  searchDocs: publicProcedure
    .input(searchDocsParams)
    .query(async ({ input }) => {
      const bank = questionBanks[input.questionBank];
      await populateDocsSearchIndex(bank);
      return await searchDocs(input);
    }),
});
