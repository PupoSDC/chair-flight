import {
  annexSearchParams,
  docSearchParams,
  learningObjectivesSearchParams,
  questionSearchParams,
  retrieveParams,
} from "@chair-flight/core/search";
import {
  annexSearch,
  docSearch,
  learningObjectiveSearch,
  questionBanks,
  questionSearch,
} from "../../common/providers";
import { publicProcedure, router } from "../../config/trpc";

export const searchRouter = router({
  initialize: publicProcedure.query(async () => {
    for (const bank of Object.values(questionBanks)) {
      await Promise.all([
        learningObjectiveSearch.initialize(bank),
        annexSearch.initialize(bank),
        questionSearch.initialize(bank),
        docSearch.initialize(bank),
      ]);
    }
    return "ok";
  }),
  searchLearningObjectives: publicProcedure
    .input(learningObjectivesSearchParams)
    .query(async ({ input }) => {
      const bank = questionBanks[input.questionBank];
      return await learningObjectiveSearch.search(bank, input);
    }),
  searchAnnexes: publicProcedure
    .input(annexSearchParams)
    .query(async ({ input }) => {
      const bank = questionBanks[input.questionBank];
      return await annexSearch.search(bank, input);
    }),
  searchQuestions: publicProcedure
    .input(questionSearchParams)
    .query(async ({ input }) => {
      const bank = questionBanks[input.questionBank];
      return await questionSearch.search(bank, input);
    }),
  searchDocs: publicProcedure
    .input(docSearchParams)
    .query(async ({ input }) => {
      const bank = questionBanks[input.questionBank];
      return await docSearch.search(bank, input);
    }),
  retrieveLearningObjective: publicProcedure
    .input(retrieveParams)
    .query(async ({ input }) => {
      const bank = questionBanks[input.questionBank];
      return await learningObjectiveSearch.retrieve(bank, input.ids);
    }),
  retrieveAnnexes: publicProcedure
    .input(retrieveParams)
    .query(async ({ input }) => {
      const bank = questionBanks[input.questionBank];
      return await annexSearch.retrieve(bank, input.ids);
    }),
  retrieveQuestions: publicProcedure
    .input(retrieveParams)
    .query(async ({ input }) => {
      const bank = questionBanks[input.questionBank];
      return await questionSearch.retrieve(bank, input.ids);
    }),
  retrieveDocs: publicProcedure
    .input(retrieveParams)
    .query(async ({ input }) => {
      const bank = questionBanks[input.questionBank];
      return await docSearch.retrieve(bank, input.ids);
    }),
});
