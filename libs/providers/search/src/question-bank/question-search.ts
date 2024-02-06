import { getQuestionPreview } from "@chair-flight/core/question-bank";
import { QuestionBankSearchProvider } from "../abstract-providers/question-bank-search-provider";
import type {
  QuestionSearchFilters,
  QuestionSearchParams,
  QuestionSearchResult,
} from "@chair-flight/core/search";
import type { QuestionBank } from "@chair-flight/providers/question-bank";

export type QuestionSearchField =
  | "id"
  | "questionId"
  | "questionBank"
  | "subjects"
  | "learningObjectives"
  | "externalIds"
  | "text";

export type QuestionSearchDocument = Record<QuestionSearchField, string>;

export class QuestionSearch extends QuestionBankSearchProvider<
  QuestionSearchDocument,
  QuestionSearchResult,
  QuestionSearchFilters,
  QuestionSearchParams
> {
  constructor() {
    super({
      searchFields: [
        "id",
        "questionId",
        "questionBank",
        "subjects",
        "learningObjectives",
        "externalIds",
        "text",
      ],
      idSearchFields: ["id", "questionId", "learningObjectives", "externalIds"],
    });
  }

  public override async getFilters(bank: QuestionBank) {
    const rawSubjects = await bank.getAll("subjects");

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

    return {
      filters: { subject, searchField },
    };
  }

  protected override async getResultItems(bank: QuestionBank) {
    const questions = await bank.getAll("questions");
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

    return resultItems;
  }

  protected override async getSearchDocuments(bank: QuestionBank) {
    const questions = await bank.getAll("questions");
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

    return searchItems;
  }

  protected override getSearchResultFilter(params: QuestionSearchParams) {
    return (r: QuestionSearchResult | undefined): r is QuestionSearchResult => {
      if (!r) {
        return false;
      }

      if (r.questionBank !== params.questionBank) {
        return false;
      }

      if (params.filters.subject !== "all") {
        if (!r.subjects.includes(params.filters.subject)) return false;
      }

      return true;
    };
  }
}
