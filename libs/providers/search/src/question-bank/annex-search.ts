import { QuestionBankSearchProvider } from "../abstract-providers/question-bank-search-provider";
import type { Annex } from "@cf/core/question-bank";
import type {
  AnnexSearchResult,
  AnnexFilterField,
  AnnexSearchField,
} from "@cf/core/search";
import type { QuestionBank } from "@cf/providers/question-bank";

export class AnnexSearch extends QuestionBankSearchProvider<
  Annex,
  AnnexSearchResult,
  AnnexSearchField,
  AnnexFilterField
> {
  private static instance: AnnexSearch;

  private constructor() {
    super({
      searchFields: ["id", "description"],
      idSearchFields: ["id"],
      filterFields: ["subject"],
    });
  }

  public static get() {
    if (!this.instance) {
      this.instance = new AnnexSearch();
    }
    return this.instance;
  }

  public override async getFilters(bank: QuestionBank) {
    const rawSubjects = await bank.getAll("subjects");

    const searchField = [
      { id: "all", text: "All Fields" },
      { id: "id", text: "ID" },
      { id: "description", text: "Description" },
    ] satisfies [
      { id: "all"; text: string },
      ...Array<{ id: AnnexSearchField; text: string }>,
    ];

    const subject = [
      { id: "all", text: "All Subjects" },
      ...rawSubjects.map((s) => ({
        id: s.id,
        text: `${s.id} - ${s.shortName}`,
      })),
    ] satisfies [
      { id: "all"; text: string },
      ...Array<{ id: string; text: string }>,
    ];

    return {
      filters: { searchField, subject },
    };
  }

  protected override async getSearchItems(bank: QuestionBank) {
    return await bank.getAll("annexes");
  }

  protected override getSearchResult(annex: Annex) {
    return {
      id: annex.id,
      href: annex.href,
      description: annex.description,
      subjects: annex.subjects,
      questionBank: annex.questionBank,
      questions: annex.questions.map((id) => ({
        id,
        href: `/modules/${annex.questionBank}/questions/${id}`,
      })),
      learningObjectives: annex.learningObjectives.map((id) => ({
        id,
        href: `/modules/${annex.questionBank}/learning-objectives/${id}`,
      })),
    };
  }

  protected override getSearchDocument(annex: Annex) {
    return {
      id: annex.id,
      subject: annex.subjects.join(", "),
      description: annex.description,
      questionBank: annex.questionBank,
    };
  }
}
