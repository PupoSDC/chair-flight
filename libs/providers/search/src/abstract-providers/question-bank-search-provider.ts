import { default as MiniSearch } from "minisearch";
import type { SearchParams } from "@chair-flight/core/search";
import type { QuestionBank } from "@chair-flight/providers/question-bank";
import type { SearchOptions } from "minisearch";

type MandatorySearchDocument = { id: string; questionBank: string };

type ISearchDocument<
  SearchField extends string,
  FilterField extends string,
> = Record<SearchField, string> &
  Record<FilterField, string> &
  MandatorySearchDocument;

type IFilters<SearchField extends string, FilterField extends string> = Record<
  "searchField",
  [{ id: "all"; text: string }, ...Array<{ id: SearchField; text: string }>]
> &
  Record<
    FilterField,
    [{ id: "all"; text: string }, ...Array<{ id: string; text: string }>]
  >;

export abstract class QuestionBankSearchProvider<
  OriginalItem extends { id: string },
  SearchResult extends { id: string },
  SearchField extends string,
  FilterField extends string,
  SearchDocument extends ISearchDocument<
    SearchField,
    FilterField
  > = ISearchDocument<SearchField, FilterField>,
  Filters extends IFilters<SearchField, FilterField> = IFilters<
    SearchField,
    FilterField
  >,
> {
  private originalItems = new Map<string, OriginalItem>();
  private searchIndex: MiniSearch<SearchDocument>;

  private searchDocuments = new Map<string, SearchDocument>();
  private searchResults = new Map<string, SearchResult>();
  private initializationWork = new Map<QuestionBank, Promise<void>>();
  private idSearchFields: SearchField[];
  private searchFields: SearchField[];
  private filterFields: FilterField[];

  constructor({
    idSearchFields,
    searchFields,
    filterFields,
  }: {
    idSearchFields: SearchField[];
    searchFields: SearchField[];
    filterFields: FilterField[];
  }) {
    this.idSearchFields = idSearchFields;
    this.searchFields = searchFields;
    this.filterFields = filterFields;
    this.searchIndex = new MiniSearch<SearchDocument>({
      fields: searchFields as string[],
      storeFields: ["id"],
      tokenize: (text, fieldName) => {
        if (idSearchFields.includes(fieldName as SearchField)) {
          return text.split(", ");
        }
        return MiniSearch.getDefault("tokenize")(text);
      },
    });
  }

  protected async initializeSearchMaps(bank: QuestionBank) {
    const items = await this.getSearchItems(bank);
    const firstItemId = items[0]?.id;
    if (!firstItemId || this.originalItems.has(firstItemId)) return;
    items.forEach((item) => {
      const searchDocument = this.getSearchDocument(item);
      this.originalItems.set(item.id, item);
      this.searchDocuments.set(item.id, searchDocument);
    });
  }

  protected async initializeSearchIndex(bank: QuestionBank) {
    const thisWork = this.initializationWork.get(bank);
    if (thisWork) return await thisWork;

    const newWork = (async () => {
      const searchDocuments = Array.from(this.searchDocuments.values());
      const firstId = searchDocuments[0]?.id;
      if (!firstId || this.searchIndex.has(firstId)) return;
      await this.searchIndex.addAllAsync(searchDocuments);
    })();

    this.initializationWork.set(bank, newWork);
    await newWork;
  }

  protected getOrInitializeSearchResult(id: string) {
    const existingSearchResult = this.searchResults.get(id);
    if (existingSearchResult) return existingSearchResult;
    const originalItem = this.originalItems.get(id);
    if (!originalItem) return;
    const newSearchResult = this.getSearchResult(originalItem);
    this.searchResults.set(id, newSearchResult);
    return newSearchResult;
  }

  public async search(
    bank: QuestionBank,
    params: SearchParams,
  ): Promise<{
    items: SearchResult[];
    totalResults: number;
    nextCursor: number;
  }> {
    const searchDocuments = await (async () => {
      if (!params.q) {
        await this.initializeSearchMaps(bank);
        // Kickstart the indexing processing but don't await it
        void this.initializeSearchIndex(bank);
        return Array.from(this.searchDocuments.values());
      } else {
        await this.initializeSearchMaps(bank);
        await this.initializeSearchIndex(bank);

        const searchField = params.searchField;
        const castSearchField = searchField as SearchField;
        const isValidSearchField =
          this.idSearchFields.includes(castSearchField);
        const isPrefix = this.idSearchFields.includes(castSearchField);

        const opts: SearchOptions = {
          fuzzy: isPrefix ? false : 0.2,
          prefix: isPrefix,
          fields: isValidSearchField ? [searchField] : undefined,
          tokenize: (text) =>
            this.idSearchFields.includes(castSearchField)
              ? text.split(", ")
              : MiniSearch.getDefault("tokenize")(text),
        };

        return this.searchIndex
          .search(params.q, opts)
          .sort((a, b) => (isPrefix && a && b ? a.id.localeCompare(b.id) : 0))
          .map((a) => this.searchDocuments.get(a.id));
      }
    })();

    const filterEntries = Object.entries(params.filters);
    const processedResults = searchDocuments.filter(
      (result: SearchDocument | undefined): result is SearchDocument => {
        if (!result) {
          return false;
        }
        if (result.questionBank !== bank.getName()) {
          return false;
        }
        for (const [key, value] of filterEntries) {
          const castKey = key as FilterField;
          if (!this.filterFields.includes(castKey)) continue;
          if (!value) continue;
          if (value === "all") continue;
          if (!result[castKey].includes(value)) return false;
        }
        return true;
      },
    );

    const finalItems = processedResults
      .slice(params.cursor, params.cursor + params.limit)
      .map((r) => this.getOrInitializeSearchResult(r.id))
      .filter(Boolean);

    return {
      items: finalItems,
      totalResults: processedResults.length,
      nextCursor: params.cursor + finalItems.length,
    };
  }

  public async retrieve(
    bank: QuestionBank,
    ids: string[],
  ): Promise<{
    items: SearchResult[];
  }> {
    await this.initializeSearchMaps(bank);
    const items = ids
      .map((id) => this.getOrInitializeSearchResult(id))
      .filter(Boolean);
    return { items };
  }

  public async initialize(bank: QuestionBank) {
    await this.initializeSearchIndex(bank);
  }

  public abstract getFilters(bank: QuestionBank): Promise<{ filters: Filters }>;

  protected abstract getSearchItems(
    bank: QuestionBank,
  ): Promise<OriginalItem[]>;

  protected abstract getSearchResult(item: OriginalItem): SearchResult;

  protected abstract getSearchDocument(item: OriginalItem): SearchDocument;
}
