import { default as MiniSearch } from "minisearch";
import type { SearchQuery, SearchResults } from "./search";
import type {
  LearningObjective,
  QuestionBankRepository,
} from "@chair-flight/base/types";

const MATCH_LO_ID = /^[0-9]{3}(.[0-9]{2}){0,3}$/;

export type SearchLearningObjectivesResults = SearchResults<LearningObjective>;

export type SearchLearningObjectives = (
  args: SearchQuery
) => Promise<SearchResults<LearningObjective>>;

export const makeSearchLearningObjectives = async (
  questionBank: QuestionBankRepository
): Promise<SearchLearningObjectives> => {
  const searchIndex = new MiniSearch<LearningObjective>({
    fields: ["id", "text"],
    storeFields: ["id"],
  });
  const documents = await questionBank.getAllLearningObjectives();
  searchIndex.addAll(documents);

  return async ({ q, page, pageSize }) => {
    if (!q) {
      return {
        results: documents
          .slice(page * pageSize, (page + 1) * pageSize)
          .map((result) => ({
            result,
            score: 1,
            match: {},
            terms: [],
          })),
        totalResults: documents.length,
        page: 0,
      };
    }

    if (MATCH_LO_ID.test(q)) {
      const results = documents
        .filter((doc) => doc.id.startsWith(q))
        .slice(page * pageSize, (page + 1) * pageSize)
        .map((result) => ({
          result,
          score: 1,
          match: {},
          terms: [],
        }));

      return {
        results,
        totalResults: results.length,
        page,
      };
    }

    const searchResults = searchIndex.search(q, {
      boost: {
        id: 100,
        text: 0,
      },
      weights: {
        fuzzy: 0,
        prefix: 10,
      },
    });

    const totalResults = searchResults.length;

    const results = await Promise.all([
      ...searchResults
        .slice(page * pageSize, (page + 1) * pageSize)
        .map(async (result) => ({
          result: await questionBank.getLearningObjective(result.id as string),
          score: result.score,
          match: result.match,
          terms: result.terms,
        })),
    ]);

    return {
      results,
      totalResults,
      page,
    };
  };
};
