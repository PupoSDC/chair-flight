import { makeMap } from "@cf/base/utils";
import { compileMarkdown } from "@cf/core/markdown";
import { QuestionBankSearchProvider } from "../abstract-providers/question-bank-search-provider";
import type { LearningObjective } from "@cf/core/content";
import type {
  LearningObjectiveFilterField,
  LearningObjectiveSearchField,
  LearningObjectiveSearchResult,
} from "@cf/core/search";
import type { QuestionBank } from "@cf/providers/question-bank";

export class LearningObjectiveSearch extends QuestionBankSearchProvider<
  LearningObjective,
  LearningObjectiveSearchResult,
  LearningObjectiveSearchField,
  LearningObjectiveFilterField
> {
  private coursesMap: Record<string, { id: string; text: string }> = {};

  constructor() {
    super({
      searchFields: ["id", "text"],
      idSearchFields: ["id"],
      filterFields: ["subject", "course"],
    });
  }

  protected override async initializeSearchMaps(bank: QuestionBank) {
    await super.initializeSearchMaps(bank);
    const allCourses = await bank.getAll("courses");
    this.coursesMap = {
      ...this.coursesMap,
      ...makeMap(allCourses, (c) => c.id),
    };
  }

  public override async getFilters(bank: QuestionBank) {
    const rawSubjects = await bank.getAll("subjects");
    const rawCourses = await bank.getAll("courses");

    const searchField = [
      { id: "all", text: "All Fields" },
      { id: "id", text: "Learning Objective" },
      { id: "text", text: "Title" },
    ] satisfies [
      { id: "all"; text: string },
      ...Array<{ id: LearningObjectiveSearchField; text: string }>,
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

    const course = [
      { id: "all", text: "All Courses" },
      ...rawCourses.map((c) => ({
        id: c.id,
        text: c.text,
      })),
    ] satisfies [
      { id: "all"; text: string },
      ...Array<{ id: string; text: string }>,
    ];

    return {
      filters: { subject, course, searchField },
    };
  }

  protected override async getSearchItems(bank: QuestionBank) {
    return await bank.getAll("learningObjectives");
  }

  protected override getSearchResult(lo: LearningObjective) {
    return {
      id: lo.id,
      href: `/modules/${lo.questionBank}/learning-objectives/${lo.id}`,
      parentId: lo.parentId,
      courses: lo.courses.map((c) => this.coursesMap[c]),
      text: compileMarkdown(lo.text),
      source: compileMarkdown(lo.source),
      questionBank: lo.questionBank,
      subject: lo.subject,
      numberOfQuestions: lo.nestedQuestions.length,
    };
  }

  protected override getSearchDocument(lo: LearningObjective) {
    return {
      id: lo.id,
      text: lo.text,
      subject: lo.subject,
      course: lo.courses.join(","),
      questionBank: lo.questionBank,
    };
  }
}
