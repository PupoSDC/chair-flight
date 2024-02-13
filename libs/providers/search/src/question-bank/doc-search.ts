import { QuestionBankSearchProvider } from "../abstract-providers/question-bank-search-provider";
import type { Doc } from "@cf/core/question-bank";
import type {
  DocFilterField,
  DocSearchField,
  DocSearchResult,
} from "@cf/core/search";
import type { QuestionBank } from "@cf/providers/question-bank";

export class DocSearch extends QuestionBankSearchProvider<
  Doc,
  DocSearchResult,
  DocSearchField,
  DocFilterField
> {
  constructor() {
    super({
      searchFields: ["id", "learningObjective", "content", "title"],
      idSearchFields: ["id", "learningObjective"],
      filterFields: ["subject"],
    });
  }

  public override async getFilters(bank: QuestionBank) {
    const rawSubjects = await bank.getAll("subjects");

    const searchField = [
      { id: "all", text: "All Fields" },
      { id: "learningObjective", text: "Learning Objective" },
      { id: "content", text: "Content" },
      { id: "title", text: "Title" },
    ] satisfies [
      { id: "all"; text: string },
      ...Array<{ id: DocSearchField; text: string }>,
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
      filters: { subject, searchField },
    };
  }

  protected override async getSearchItems(bank: QuestionBank) {
    return await bank.getAll("docs");
  }

  protected override getSearchResult(doc: Doc) {
    return {
      id: doc.id,
      questionBank: doc.questionBank,
      title: doc.title,
      empty: doc.empty,
      subject: doc.subject,
      href: `/modules/${doc.questionBank}/docs/${doc.id}`,
      learningObjectives: doc.learningObjectives.map((id) => ({
        id,
        href: `/modules/${doc.questionBank}/learning-objectives/${id}`,
      })),
    };
  }

  protected override getSearchDocument(doc: Doc) {
    return {
      id: doc.id,
      learningObjective: doc.learningObjectives.join(", "),
      content: doc.content,
      title: doc.title,
      questionBank: doc.questionBank,
      subject: doc.subject,
    };
  }
}
