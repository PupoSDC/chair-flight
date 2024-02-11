import { getQuestionPreview } from "@chair-flight/core/question-bank";
import { QuestionBankSearchProvider } from "../abstract-providers/question-bank-search-provider";
import type { QuestionTemplate } from "@chair-flight/core/question-bank";
import type {
  QuestionFilterField,
  QuestionSearchField,
  QuestionSearchResult,
} from "@chair-flight/core/search";
import type { QuestionBank } from "@chair-flight/providers/question-bank";

export class QuestionSearch extends QuestionBankSearchProvider<
  QuestionTemplate,
  QuestionSearchResult,
  QuestionSearchField,
  QuestionFilterField
> {
  constructor() {
    super({
      searchFields: ["id", "learningObjective", "externalId", "text"],
      idSearchFields: ["id", "learningObjective", "externalId"],
      filterFields: ["subject"],
    });
  }

  public override async getFilters(bank: QuestionBank) {
    const rawSubjects = await bank.getAll("subjects");

    const searchField = [
      { id: "all", text: "All Fields" },
      { id: "id", text: "Question ID" },
      { id: "learningObjective", text: "Learning Objectives" },
      { id: "text", text: "Text" },
      { id: "externalId", text: "External IDs" },
    ] satisfies [
      { id: "all"; text: string },
      ...Array<{ id: QuestionSearchField; text: string }>,
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
    return await bank.getAll("questions");
  }

  protected override getSearchResult(q: QuestionTemplate) {
    return {
      id: q.id,
      questionBank: q.questionBank,
      text: getQuestionPreview(q.variant),
      subjects: q.learningObjectives.map((l) => l.split(".")[0]),
      href: `/modules/${q.questionBank}/questions/${q.id}`,
      externalIds: q.externalIds,
      learningObjectives: q.learningObjectives.map((id) => ({
        id,
        href: `/modules/${q.questionBank}/learning-objectives/${id}`,
      })),
      relatedQuestions: q.relatedQuestions.map((id) => ({
        id,
        href: `/modules/${q.questionBank}/questions/${id}`,
      })),
    };
  }

  protected override getSearchDocument(q: QuestionTemplate) {
    return {
      id: q.id,
      questionBank: q.questionBank,
      subject: q.learningObjectives.map((l) => l.split(".")[0]).join(", "),
      text: getQuestionPreview(q.variant),
      learningObjective: q.learningObjectives.join(", "),
      externalId: q.externalIds.join(", "),
    };
  }
}
