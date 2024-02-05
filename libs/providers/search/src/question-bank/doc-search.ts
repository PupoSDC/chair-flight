import { default as MiniSearch } from "minisearch";
import type { SearchProvider } from "../types/search-provider";
import type {
  DocSearchFilters,
  DocSearchParams,
  DocSearchResult,
} from "@chair-flight/core/search";
import type { QuestionBank } from "@chair-flight/providers/question-bank";
import type { SearchOptions } from "minisearch";

export type DocSearchField = "id" | "learningObjectiveId" | "content" | "title";
export type DocSearchDocument = Record<DocSearchField, string>;

export class DocSearch
  implements SearchProvider<DocSearchResult, DocSearchParams, DocSearchFilters>
{
  private static initializationWork: Promise<void> | undefined;
  private static searchResults: Map<string, DocSearchResult> = new Map();
  private static idSearchFields: DocSearchField[] = [
    "id",
    "learningObjectiveId",
  ];

  private static searchIndex = new MiniSearch<DocSearchDocument>({
    fields: [
      "id",
      "learningObjectiveId",
      "content",
      "title",
    ] satisfies DocSearchField[],
    storeFields: ["id"] satisfies DocSearchField[],
  });

  private bank: QuestionBank;

  constructor(bank: QuestionBank) {
    this.bank = bank;

    (async () => {
      if (DocSearch.initializationWork) await DocSearch.initializationWork;

      DocSearch.initializationWork = (async () => {
        const docs = await bank.getAll("docs");
        const hasDocs = await bank.has("docs");
        const firstId = docs.at(0)?.id;

        if (!hasDocs) return;
        if (DocSearch.searchIndex.has(firstId)) return;

        const searchItems: DocSearchDocument[] = docs.flatMap((doc) => ({
          id: doc.id,
          learningObjectiveId: doc.learningObjectiveId,
          content: doc.content,
          title: doc.title,
        }));

        const resultItems: DocSearchResult[] = docs.flatMap((doc) => ({
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

        await DocSearch.searchIndex.addAllAsync(searchItems);
        resultItems.forEach((r) => DocSearch.searchResults.set(r.id, r));
      })();
    })();
  }

  async search(params: DocSearchParams) {
    if (DocSearch.initializationWork) await DocSearch.initializationWork;

    const isFuzzy = DocSearch.idSearchFields.includes(
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
      ? DocSearch.searchIndex
          .search(params.q, opts)
          .map(({ id }) => DocSearch.searchResults.get(id))
      : Array.from(DocSearch.searchResults.values());

    const processedResults = results.filter(
      (result): result is DocSearchResult => {
        if (!result) {
          return false;
        }

        if (result.questionBank !== params.questionBank) {
          return false;
        }

        if (params.filters.subject !== "all") {
          if (result.subject !== params.filters.subject) return false;
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
      .map((id) => DocSearch.searchResults.get(id))
      .filter((r): r is DocSearchResult => !!r);
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
      { id: "learningObjectiveId", text: "Learning Objective" },
      { id: "content", text: "Content" },
      { id: "title", text: "Title" },
    ];

    return { subject, searchField };
  }
}
