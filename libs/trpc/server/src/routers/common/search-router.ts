import {
  searchLearningObjectivesParams,
  populateLearningObjectivesSearchIndex,
  searchLearningObjectives,
  searchAnnexesParams,
  populateAnnexesSearchIndex,
  searchAnnexes,
  searchDocsParams,
  searchDocs,
  populateDocsSearchIndex,
  searchQuestionsParams,
  searchQuestions,
  populateQuestionsSearchIndex,
} from "@chair-flight/core/app";
import { questionBanks } from "@chair-flight/providers/question-bank";
import {
  annexSearchIndex,
  annexSearchResults,
  learningObjectiveSearchResults,
  learningObjectiveSearchIndex,
  docSearchResults,
  docSearchIndex,
  questionSearchResults,
  questionSearchIndex,
} from "../../common/search-indexes";
import { publicProcedure, router } from "../../config/trpc";

export const searchRouter = router({
  initialize: publicProcedure.query(async () => {
    for (const bank of Object.values(questionBanks)) {
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
    }
    return "ok";
  }),
  searchLearningObjectives: publicProcedure
    .input(searchLearningObjectivesParams)
    .query(async ({ input }) => {
      const bank = questionBanks[input.questionBank];
      await populateLearningObjectivesSearchIndex({
        bank,
        searchIndex: learningObjectiveSearchIndex,
        searchResults: learningObjectiveSearchResults,
      });

      const result = await searchLearningObjectives({
        params: input,
        searchIndex: learningObjectiveSearchIndex,
        searchResults: learningObjectiveSearchResults,
      });

      return result;
    }),
  searchAnnexes: publicProcedure
    .input(searchAnnexesParams)
    .query(async ({ input }) => {
      const bank = questionBanks[input.questionBank];
      await populateAnnexesSearchIndex({
        bank,
        searchIndex: annexSearchIndex,
        searchResults: annexSearchResults,
      });

      const result = await searchAnnexes({
        params: input,
        searchIndex: annexSearchIndex,
        searchResults: annexSearchResults,
      });

      return result;
    }),
  searchQuestions: publicProcedure
    .input(searchQuestionsParams)
    .query(async ({ input }) => {
      const bank = questionBanks[input.questionBank];
      await populateQuestionsSearchIndex({
        bank,
        searchIndex: questionSearchIndex,
        searchResults: questionSearchResults,
      });

      const result = await searchQuestions({
        params: input,
        searchIndex: questionSearchIndex,
        searchResults: questionSearchResults,
      });

      return result;
    }),
  searchDocs: publicProcedure
    .input(searchDocsParams)
    .query(async ({ input }) => {
      const bank = questionBanks[input.questionBank];
      await populateDocsSearchIndex({
        bank,
        searchIndex: docSearchIndex,
        searchResults: docSearchResults,
      });

      const result = await searchDocs({
        params: input,
        searchIndex: docSearchIndex,
        searchResults: docSearchResults,
      });

      return result;
    }),
});
