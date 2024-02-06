import { QuestionBankSearchProvider } from "../abstract-providers/question-bank-search-provider";
import type {
  DocSearchFilters,
  DocSearchParams,
  DocSearchResult,
} from "@chair-flight/core/search";
import type { QuestionBank } from "@chair-flight/providers/question-bank";

type DocSearchField = "id" | "learningObjectiveId" | "content" | "title";
type DocSearchDocument = Record<DocSearchField, string>;

export class DocSearch extends QuestionBankSearchProvider<
  DocSearchDocument,
  DocSearchResult,
  DocSearchFilters,
  DocSearchParams
> {
  constructor() {
    super({
      searchFields: ["id", "learningObjectiveId", "content", "title"],
      idSearchFields: ["id", "learningObjectiveId"],
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
      { id: "learningObjectiveId", text: "Learning Objective" },
      { id: "content", text: "Content" },
      { id: "title", text: "Title" },
    ];

    return {
      filters: { subject, searchField },
    };
  }

  protected override async getResultItems(bank: QuestionBank) {
    const docs = await bank.getAll("docs");
    return docs.map((doc) => ({
      id: doc.id,
      questionBank: bank.getName(),
      title: doc.title,
      empty: doc.empty,
      subject: doc.subjectId,
      href: `/modules/${bank.getName()}/docs/${doc.id}`,
      learningObjective: {
        id: doc.learningObjectiveId,
        href: `/modules/${bank.getName()}/learning-objectives/${doc.learningObjectiveId}`,
      },
    }));
  }

  protected override async getSearchDocuments(bank: QuestionBank) {
    const docs = await bank.getAll("docs");
    return docs.map((doc) => ({
      id: doc.id,
      learningObjectiveId: doc.learningObjectiveId,
      content: doc.content,
      title: doc.title,
    }));
  }

  protected override getSearchResultFilter(params: DocSearchParams) {
    return (r: DocSearchResult | undefined): r is DocSearchResult => {
      if (!r) {
        return false;
      }

      if (r.questionBank !== params.questionBank) {
        return false;
      }

      if (params.filters.subject !== "all") {
        if (r.subject !== params.filters.subject) return false;
      }

      return true;
    };
  }
}
