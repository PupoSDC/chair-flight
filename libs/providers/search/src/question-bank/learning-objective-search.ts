import { default as MiniSearch } from "minisearch";
import { makeMap } from "@chair-flight/base/utils";
import type { SearchProvider } from "../types/search-provider";
import type {
  LearningObjectiveSearchFilters,
  LearningObjectiveSearchParams,
  LearningObjectiveSearchResult,
} from "@chair-flight/core/search";
import type { QuestionBank } from "@chair-flight/providers/question-bank";
import type { SearchOptions } from "minisearch";

type LoSearchField = "id" | "text";
type LoSearchDocument = Record<LoSearchField, string>;

export class LearningObjectiveSearch
  implements
    SearchProvider<
      LearningObjectiveSearchResult,
      LearningObjectiveSearchParams,
      LearningObjectiveSearchFilters
    >
{
  private static initializationWork: Promise<void> | undefined;
  private static searchResults = new Map<
    string,
    LearningObjectiveSearchResult
  >();
  private static idSearchFields: LoSearchField[] = ["id"];

  private static searchIndex = new MiniSearch({
    fields: ["id", "text"] as LoSearchField[],
    storeFields: ["id"] as LoSearchField[],
  });

  private bank: QuestionBank;

  constructor(bank: QuestionBank) {
    this.bank = bank;

    (async () => {
      if (LearningObjectiveSearch.initializationWork)
        await LearningObjectiveSearch.initializationWork;

      LearningObjectiveSearch.initializationWork = (async () => {
        const allCourses = await bank.getAll("courses");
        const learningObjectives = await bank.getAll("learningObjectives");
        const hasLearningObjectives = await bank.has("learningObjectives");
        const firstId = learningObjectives.at(0)?.id;

        if (!hasLearningObjectives) return;
        if (LearningObjectiveSearch.searchIndex.has(firstId)) return;

        const coursesMap = makeMap(allCourses, (c) => c.id);

        const searchItems: LoSearchDocument[] = learningObjectives.map(
          (lo) => ({
            id: lo.id,
            text: lo.text,
          }),
        );

        const resultItems: LearningObjectiveSearchResult[] =
          learningObjectives.map((lo) => ({
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

        await LearningObjectiveSearch.searchIndex.addAllAsync(searchItems);
        resultItems.forEach((item) =>
          LearningObjectiveSearch.searchResults.set(item.id, item),
        );
      })();
    })();
  }

  async search(params: LearningObjectiveSearchParams) {
    if (LearningObjectiveSearch.initializationWork)
      await LearningObjectiveSearch.initializationWork;

    const isFuzzy = LearningObjectiveSearch.idSearchFields.includes(
      params.filters.searchField,
    );

    const opts: SearchOptions = {
      fuzzy: isFuzzy ? false : 0.2,
      prefix: !isFuzzy,
      fields:
        params.filters.searchField === "all"
          ? undefined
          : [params.filters.searchField],
    };

    const results = params.q
      ? LearningObjectiveSearch.searchIndex
          .search(params.q, opts)
          .map(({ id }) => LearningObjectiveSearch.searchResults.get(id))
      : Array.from(LearningObjectiveSearch.searchResults.values());

    const processedResults = results.filter(
      (result): result is LearningObjectiveSearchResult => {
        if (!result) {
          return false;
        }

        if (result.questionBank !== params.questionBank) {
          return false;
        }

        if (params.filters.subject !== "all") {
          if (result.subject !== params.filters.subject) {
            return false;
          }
        }

        if (params.filters.course !== "all") {
          if (result.courses.every((c) => c.id !== params.filters.subject)) {
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
    return ids
      .map((id) => LearningObjectiveSearch.searchResults.get(id))
      .filter((r): r is LearningObjectiveSearchResult => !!r);
  }

  async getFilters() {
    const rawSubjects = await this.bank.getAll("subjects");
    const rawCourses = await this.bank.getAll("courses");

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

    return { subject, course, searchField };
  }
}
