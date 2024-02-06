import { makeMap } from "@chair-flight/base/utils";
import { QuestionBankSearchProvider } from "../abstract-providers/question-bank-search-provider";
import type {
  LearningObjectiveSearchFilters,
  LearningObjectiveSearchParams,
  LearningObjectiveSearchResult,
} from "@chair-flight/core/search";
import type { QuestionBank } from "@chair-flight/providers/question-bank";

type LearningObjectiveSearchField = "id" | "text";
type LearningObjectiveSearchDocument = Record<
  LearningObjectiveSearchField,
  string
>;

export class LearningObjectiveSearch extends QuestionBankSearchProvider<
  LearningObjectiveSearchDocument,
  LearningObjectiveSearchResult,
  LearningObjectiveSearchFilters,
  LearningObjectiveSearchParams
> {
  constructor() {
    super({
      idSearchFields: ["id"],
      searchFields: ["id", "text"],
      storeFields: ["id"],
    });
  }

  public override async getFilters(bank: QuestionBank) {
    const rawSubjects = await bank.getAll("subjects");
    const rawCourses = await bank.getAll("courses");

    const subject = [
      { id: "all", text: "All Subjects" },
      ...rawSubjects.map((s) => ({
        id: s.id,
        text: `${s.id} - ${s.shortName}`,
      })),
    ];

    const course = [
      { id: "all", text: "All Courses" },
      ...rawCourses.map((c) => ({
        id: c.id,
        text: c.text,
      })),
    ];

    const searchField = [
      { id: "all", text: "All Fields" },
      { id: "learningObjectiveId", text: "Learning Objective" },
      { id: "content", text: "Content" },
      { id: "title", text: "Title" },
    ];

    return {
      filters: { subject, course, searchField },
    };
  }

  protected override async getResultItems(bank: QuestionBank) {
    const allCourses = await bank.getAll("courses");
    const learningObjectives = await bank.getAll("learningObjectives");
    const coursesMap = makeMap(allCourses, (c) => c.id);

    return learningObjectives.map((lo) => ({
      id: lo.id,
      href: `/modules/${bank.getName()}/learning-objectives/${lo.id}`,
      parentId: lo.parentId,
      courses: lo.courses.map((c) => coursesMap[c]),
      text: lo.text,
      source: lo.source,
      questionBank: bank.getName(),
      subject: lo.id.split(".")[0],
      numberOfQuestions: lo.nestedQuestions.length,
    }));
  }

  protected override async getSearchDocuments(bank: QuestionBank) {
    const learningObjectives = await bank.getAll("learningObjectives");
    return learningObjectives.map((lo) => ({
      id: lo.id,
      text: lo.text,
    }));
  }

  protected override getSearchResultFilter(
    params: LearningObjectiveSearchParams,
  ) {
    return (
      r: LearningObjectiveSearchResult | undefined,
    ): r is LearningObjectiveSearchResult => {
      if (!r) {
        return false;
      }

      if (r.questionBank !== params.questionBank) {
        return false;
      }

      if (params.filters.subject !== "all") {
        if (r.subject !== params.filters.subject) {
          return false;
        }
      }

      if (params.filters.course !== "all") {
        if (r.courses.every((c) => c.id !== params.filters.course)) {
          return false;
        }
      }

      return true;
    };
  }
}
