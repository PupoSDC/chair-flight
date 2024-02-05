import MiniSearch from "minisearch";
import { getQuestionPreview } from "@chair-flight/core/question-bank";
import type { SearchProvider } from "../types/search-provider";
import type {
  QuestionSearchFilters,
  QuestionSearchParams,
  QuestionSearchResult,
} from "@chair-flight/core/search";
import type { QuestionBank } from "@chair-flight/providers/question-bank";
import type { SearchOptions } from "minisearch";

export type QuestionSearchField =
  | "id"
  | "questionId"
  | "questionBank"
  | "subjects"
  | "learningObjectives"
  | "externalIds"
  | "text";

export type QuestionSearchDocument = Record<QuestionSearchField, string>;

export class QuestionSearch
  implements
    SearchProvider<
      QuestionSearchResult,
      QuestionSearchParams,
      QuestionSearchFilters
    >
{
  private static initializationWork: Promise<void> | undefined;
  private static searchResults = new Map<string, QuestionSearchResult>();
  private static idSearchFields: QuestionSearchField[] = [
    "id",
    "questionId",
    "learningObjectives",
  ];

  private static searchIndex = new MiniSearch<QuestionSearchDocument>({
    fields: [
      "id",
      "questionId",
      "questionBank",
      "subjects",
      "learningObjectives",
      "externalIds",
      "text",
    ],
    storeFields: ["id"],
  });

  private bank: QuestionBank;

  constructor(bank: QuestionBank) {
    this.bank = bank;

    (async () => {
      if (QuestionSearch.initializationWork)
        await QuestionSearch.initializationWork;

      QuestionSearch.initializationWork = (async () => {
        const questions = await bank.getAll("questions");
        const hasQuestions = await bank.has("questions");
        const firstId = questions.at(0)?.id;

        if (!hasQuestions) return;
        if (QuestionSearch.searchIndex.has(firstId)) return;

        const searchItems: QuestionSearchDocument[] = questions.flatMap(
          (question) => {
            const subjects = question.learningObjectives.map(
              (l) => l.split(".")[0],
            );
            const los = question.learningObjectives.join(", ");
            const uniqueSubjects = [...new Set(subjects)];
            return Object.values(question.variants).map((variant) => ({
              id: variant.id,
              questionId: question.id,
              questionBank: bank.getName(),
              subjects: uniqueSubjects.join(", "),
              learningObjectives: los,
              externalIds: variant.externalIds.join(", "),
              text: getQuestionPreview(question, variant.id),
            }));
          },
        );

        const resultItems: QuestionSearchResult[] = questions.flatMap((q) => {
          const subjects = q.learningObjectives.map((l) => l.split(".")[0]);
          const uniqueSubjects = [...new Set(subjects)];
          return Object.values(q.variants).map((v) => ({
            questionBank: bank.getName(),
            id: v.id,
            questionId: q.id,
            variantId: v.id,
            text: getQuestionPreview(q, v.id),
            subjects: uniqueSubjects,
            learningObjectives: q.learningObjectives.map((name) => ({
              name,
              href: `/modules/${bank.getName()}/learning-objectives/${name}`,
            })),
            externalIds: v.externalIds,
            href: `/modules/${bank.getName()}/questions/${q.id}?variantId=${v.id}`,
          }));
        });

        await QuestionSearch.searchIndex.addAllAsync(searchItems);
        resultItems.forEach((r) => QuestionSearch.searchResults.set(r.id, r));
      })();
    })();
  }

  async search(params: QuestionSearchParams) {
    if (QuestionSearch.initializationWork)
      await QuestionSearch.initializationWork;

    const isFuzzy = QuestionSearch.idSearchFields.includes(
      params.filters.searchField,
    );

    const opts: SearchOptions = {
      fuzzy: isFuzzy ? false : 0.2,
      prefix: !isFuzzy,
      fields:
        params.filters.searchField === "all"
          ? undefined
          : [params.filters.searchField],
      tokenize: (s) => {
        if (params.filters.searchField === "learningObjectives")
          return s.split(", ");
        return MiniSearch.getDefault("tokenize")(s);
      },
    };

    const results = params.q
      ? QuestionSearch.searchIndex
          .search(params.q, opts)
          .map(({ id }) => QuestionSearch.searchResults.get(id))
      : Array.from(QuestionSearch.searchResults.values());

    const processedResults = results.filter(
      (result): result is QuestionSearchResult => {
        if (!result) {
          return false;
        }

        if (result.questionBank !== params.questionBank) {
          return false;
        }

        if (params.filters.subject !== "all") {
          if (!result.subjects.includes(params.filters.subject)) {
            return false;
          }
        }

        return true;
      },
    );

    const finalItems = processedResults.slice(
      params.cursor,
      params.cursor + params.limit,
    );

    return {
      items: finalItems,
      totalResults: processedResults.length,
      nextCursor: params.cursor + finalItems.length,
    };
  }

  async retrieve(ids: string[]) {
    if (QuestionSearch.initializationWork)
      await QuestionSearch.initializationWork;

    return ids
      .map((id) => QuestionSearch.searchResults.get(id))
      .filter((r): r is QuestionSearchResult => !!r);
  }

  async getFilters() {
    const rawSubjects = await this.bank.getAll("subjects");

    const subject = [
      { id: "all", text: "All Subjects" },
      ...rawSubjects.map((s) => ({
        id: s.id,
        text: `${s.id} - ${s.shortName}`,
      })),
    ];

    const searchField = [
      { id: "all", text: "All Fields" },
      { id: "questionId", text: "Question ID" },
      { id: "learningObjectives", text: "Learning Objectives" },
      { id: "text", text: "Text" },
      { id: "externalIds", text: "External IDs" },
    ];

    return { subject, searchField };
  }
}
