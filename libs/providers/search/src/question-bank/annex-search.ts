import { QuestionBankSearchProvider } from "../abstract-providers/question-bank-search-provider";
import type {
  AnnexSearchResult,
  AnnexSearchParams,
  AnnexSearchFilters,
} from "@chair-flight/core/search";
import type { QuestionBank } from "@chair-flight/providers/question-bank";

type AnnexSearchField = "id" | "description";
type AnnexSearchDocument = Record<AnnexSearchField, string>;

export class AnnexSearch extends QuestionBankSearchProvider<
  AnnexSearchDocument,
  AnnexSearchResult,
  AnnexSearchFilters,
  AnnexSearchParams
> {
  constructor() {
    super({
      searchFields: ["id", "description"],
      idSearchFields: ["id"],
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
      { id: "id", text: "ID" },
      { id: "description", text: "Description" },
    ];

    return {
      filters: { subject, searchField },
    };
  }

  protected override async getResultItems(bank: QuestionBank) {
    const annexes = await bank.getAll("annexes");
    return annexes.map((annex) => ({
      id: annex.id,
      href: annex.href,
      description: annex.description,
      subjects: annex.subjects,
      questionBank: bank.getName(),
      questions: annex.questions.map((id) => ({
        id,
        href: `/modules/${bank.getName()}/questions/${id}`,
      })),
      learningObjectives: annex.learningObjectives.map((id) => ({
        id,
        href: `/modules/${bank.getName()}/learning-objectives/${id}`,
      })),
    }));
  }

  protected override async getSearchDocuments(bank: QuestionBank) {
    const annexes = await bank.getAll("annexes");
    return annexes.map((annex) => ({
      id: annex.id,
      description: annex.description,
    }));
  }

  protected override getSearchResultFilter(params: AnnexSearchParams) {
    return (r: AnnexSearchResult | undefined): r is AnnexSearchResult => {
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
