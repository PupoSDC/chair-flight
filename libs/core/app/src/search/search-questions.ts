import { default as MiniSearch } from "minisearch";
import { getQuestionPreview } from "../questions/get-question-preview";
import { searchQueryValidation } from "./search";
import type { SearchQuery, SearchResult, SearchResults } from "./search";
import type {
  LearningObjectiveId,
  QuestionId,
  QuestionVariantId,
  QuestionBankRepository,
} from "@chair-flight/base/types";

export type QuestionPreview = {
  questionId: QuestionId;
  variantId: QuestionVariantId;
  text: string;
  learningObjectives: LearningObjectiveId[];
  externalIds: string[];
  numberOfVariants: number;
};

export type SearchQuestionsResults = SearchResults<QuestionPreview>;

const fields = [
  "id",
  "questionId",
  "text",
  "learningObjectives",
  "numberOfVariants",
  "externalIds",
];

const searchIndex = new MiniSearch<{
  id: string;
  questionId: string;
  text: string;
  learningObjectives: string;
  externalIds: string;
}>({
  fields: fields.filter((f) => f !== "numberOfVariants"),
  storeFields: fields,
});

let initializationWork: Promise<void> | undefined;

export const searchQuestions = async (
  questionBank: QuestionBankRepository,
  searchArgs: SearchQuery
): Promise<SearchQuestionsResults> => {
  if (initializationWork) await initializationWork;
  if (searchIndex.documentCount === 0) {
    initializationWork = (async () => {
      const questions = await questionBank.getAllQuestionTemplates();
      const itemsToPush = Object.values(questions).flatMap((question) =>
        Object.values(question.variants).map((variant) => ({
          id: variant.id,
          questionId: question.id,
          learningObjectives: question.learningObjectives.join(", "),
          externalIds: variant.externalIds.join(", "),
          numberOfVariants: Object.values(question.variants).length,
          text: getQuestionPreview(question, variant.id),
        }))
      );
      await searchIndex.addAllAsync(itemsToPush);
    })();
    await initializationWork;
  }
  const { q, page, pageSize } = searchQueryValidation.parse(searchArgs);
  const searchResults = q ? searchIndex.search(q, { fuzzy: 0.2 }) : [];
  const seenQuestions: Record<string, number> = {};
  const results = searchResults.reduce<SearchResult<QuestionPreview>[]>(
    (sum, result) => {
      const questionId = result["questionId"];
      if (seenQuestions[questionId]) return sum;
      seenQuestions[questionId] = 1;
      sum.push({
        result: {
          questionId: result["questionId"],
          variantId: result["id"],
          text: result["text"],
          learningObjectives: result["learningObjectives"].split(", "),
          externalIds: result["externalIds"].split(", "),
          numberOfVariants: result["numberOfVariants"],
        },
        score: result.score,
        match: result.match,
        terms: result.terms,
      });
      return sum;
    },
    []
  );
  return {
    results: results.slice(page * pageSize, (page + 1) * pageSize),
    totalResults: results.length,
    page,
  };
};
