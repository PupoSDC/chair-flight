import {
  annexSearchParams,
  docSearchParams,
  learningObjectivesSearchParams,
  questionSearchParams,
} from "@chair-flight/core/search";
import {
  AnnexSearch,
  DocSearch,
  LearningObjectiveSearch,
  QuestionSearch,
} from "@chair-flight/providers/search";
import { questionBanks } from "../../common/providers";
import { publicProcedure, router } from "../../config/trpc";

export const searchRouter = router({
  initialize: publicProcedure.query(async () => {
    // TODO MAKE THIS WOOOORK
    /**for (const bank of Object.values(questionBanks)) {
      await Promise.all([
        populateLearningObjectivesSearchIndex({
          bank,
          searchIndex: learningObjectiveSearchIndex,
          searchResults: learningObjectiveSearchResults,
        }),
        populateAnnexesSearchIndex({
          bank,
          searchIndex: annexSearchIndex,
          searchResults: annexSearchResults,
        }),
        populateLearningObjectivesSearchIndex({
          bank,
          searchIndex: learningObjectiveSearchIndex,
          searchResults: learningObjectiveSearchResults,
        }),
      ]);
    }*/
    return "ok";
  }),
  searchLearningObjectives: publicProcedure
    .input(learningObjectivesSearchParams)
    .query(async ({ input }) => {
      const bank = questionBanks[input.questionBank];
      const index = new LearningObjectiveSearch(bank);
      return await index.search(input);
    }),
  searchAnnexes: publicProcedure
    .input(annexSearchParams)
    .query(async ({ input }) => {
      const bank = questionBanks[input.questionBank];
      const index = new AnnexSearch(bank);
      return await index.search(input);
    }),
  searchQuestions: publicProcedure
    .input(questionSearchParams)
    .query(async ({ input }) => {
      const bank = questionBanks[input.questionBank];
      const index = new QuestionSearch(bank);
      return await index.search(input);
    }),
  searchDocs: publicProcedure
    .input(docSearchParams)
    .query(async ({ input }) => {
      const bank = questionBanks[input.questionBank];
      const index = new DocSearch(bank);
      return await index.search(input);
    }),
});
