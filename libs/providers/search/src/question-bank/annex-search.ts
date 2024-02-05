import { default as MiniSearch } from "minisearch";
import type { SearchProvider } from "../types/search-provider";
import type {
  AnnexSearchResult,
  AnnexSearchParams,
  AnnexSearchFilters,
} from "@chair-flight/core/search";
import type { QuestionBank } from "@chair-flight/providers/question-bank";
import type { SearchOptions } from "minisearch";

type AnnexSearchField = "id" | "description";
type AnnexSearchDocument = Record<AnnexSearchField, string>;

export class AnnexSearch
  implements
    SearchProvider<AnnexSearchResult, AnnexSearchParams, AnnexSearchFilters>
{
  private static initializationWork: Promise<void> | undefined;
  private static searchResults = new Map<string, AnnexSearchResult>();
  private static idSearchFields: AnnexSearchField[] = ["id"];

  private static searchIndex = new MiniSearch({
    fields: ["id", "description"] satisfies AnnexSearchField[],
    storeFields: ["id"] satisfies AnnexSearchField[],
  });

  private bank: QuestionBank;

  constructor(bank: QuestionBank) {
    this.bank = bank;

    (async () => {
      if (AnnexSearch.initializationWork) await AnnexSearch.initializationWork;

      AnnexSearch.initializationWork = (async () => {
        const annexes = await bank.getAll("annexes");
        const hasAnnexes = await bank.has("annexes");
        const firstId = annexes.at(0)?.id;

        if (!hasAnnexes) return;
        if (AnnexSearch.searchIndex.has(firstId)) return;

        const searchItems: AnnexSearchDocument[] = annexes.map((annex) => ({
          id: annex.id,
          description: annex.description,
        }));

        const resultItems: AnnexSearchResult[] = annexes.map((annex) => ({
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

        await AnnexSearch.searchIndex.addAllAsync(searchItems);
        resultItems.forEach((r) => AnnexSearch.searchResults.set(r.id, r));
      })();
    })();
  }

  async search(params: AnnexSearchParams) {
    if (AnnexSearch.initializationWork) await AnnexSearch.initializationWork;

    const isFuzzy = AnnexSearch.idSearchFields.includes(
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
      ? AnnexSearch.searchIndex
          .search(params.q, opts)
          .map(({ id }) => AnnexSearch.searchResults.get(id))
      : Array.from(AnnexSearch.searchResults.values());

    const processedResults = results.filter(
      (result): result is AnnexSearchResult => {
        if (!result) {
          return false;
        }

        if (result.questionBank !== params.questionBank) {
          return false;
        }

        if (params.filters.subject !== "all") {
          if (!result.subjects.includes(params.filters.subject)) return false;
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
    if (AnnexSearch.initializationWork) await AnnexSearch.initializationWork;

    return ids
      .map((id) => AnnexSearch.searchResults.get(id))
      .filter((r): r is AnnexSearchResult => !!r);
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
      { id: "id", text: "ID" },
      { id: "description", text: "Description" },
    ];

    return { subject, searchField };
  }
}
