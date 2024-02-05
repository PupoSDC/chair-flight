import {
  annexSearchParams,
  docSearchParams,
  learningObjectivesSearchParams,
  questionSearchParams,
} from "@chair-flight/core/search";
import {
  annexSearch,
  docSearch,
  learningObjectiveSearch,
  questionBanks,
  questionSearch,
} from "../../common/providers";
import { publicProcedure, router } from "../../config/trpc";

const initialize = async () => {
  for (const bank of Object.values(questionBanks)) {
    await Promise.all([
      learningObjectiveSearch.initialize(bank),
      annexSearch.initialize(bank),
      questionSearch.initialize(bank),
      docSearch.initialize(bank),
    ]);
  }
};

export const searchRouter = router({
  initialize: publicProcedure.query(async () => {
    await initialize();
    return "ok";
  }),
  searchLearningObjectives: publicProcedure
    .input(learningObjectivesSearchParams)
    .query(async ({ input }) => {
      await initialize();
      return await learningObjectiveSearch.search(input);
    }),
  searchAnnexes: publicProcedure
    .input(annexSearchParams)
    .query(async ({ input }) => {
      await initialize();
      return await annexSearch.search(input);
    }),
  searchQuestions: publicProcedure
    .input(questionSearchParams)
    .query(async ({ input }) => {
      await initialize();
      return await questionSearch.search(input);
    }),
  searchDocs: publicProcedure
    .input(docSearchParams)
    .query(async ({ input }) => {
      await initialize();
      return await docSearch.search(input);
    }),
});
