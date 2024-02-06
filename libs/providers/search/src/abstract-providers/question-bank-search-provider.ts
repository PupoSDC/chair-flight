import { default as MiniSearch } from "minisearch";
import type { SearchParams as ISearchParams } from "@chair-flight/core/search";
import type { QuestionBank } from "@chair-flight/providers/question-bank";
import type { SearchOptions } from "minisearch";

type Filter = Array<{ id: string; text: string }>;

export abstract class QuestionBankSearchProvider<
  SearchDocument extends { id: string; [k: string]: string },
  SearchResult extends { id: string },
  SearchFilters extends { searchField: string },
  SearchParams extends ISearchParams & { filters: SearchFilters },
> {
  private searchIndex: MiniSearch<SearchDocument>;
  private searchResults = new Map<string, SearchResult>();
  private initializationWork = new Map<QuestionBank, Promise<void>>();
  private idSearchFields: (keyof SearchDocument)[];

  constructor({
    idSearchFields,
    searchFields,
    storeFields,
  }: {
    idSearchFields: (keyof SearchDocument)[];
    searchFields: (keyof SearchDocument)[];
    storeFields: (keyof SearchDocument)[];
  }) {
    this.idSearchFields = idSearchFields;
    this.searchIndex = new MiniSearch<SearchDocument>({
      fields: searchFields as string[],
      storeFields: storeFields as string[],
      tokenize: (text, fieldName) => {
        if (idSearchFields.includes(fieldName as keyof SearchDocument)) {
          return text.split(", ");
        }
        return MiniSearch.getDefault("tokenize")(text);
      },
    });
  }

  private async initializeSearchResults(bank: QuestionBank) {
    const resultItems = await this.getResultItems(bank);
    const firstId = resultItems[0]?.id;
    if (!firstId || this.searchResults.get(firstId)) return;
    resultItems.forEach((item) => this.searchResults.set(item.id, item));
  }

  private async initializeSearchIndex(bank: QuestionBank) {
    const thisWork = this.initializationWork.get(bank);
    if (thisWork) return await thisWork;

    const newWork = (async () => {
      try {
        const searchDocuments = await this.getSearchDocuments(bank);
        const firstId = searchDocuments[0]?.id;
        if (!firstId || this.searchIndex.has(firstId)) return;
        await this.searchIndex.addAllAsync(searchDocuments);
      } catch (e) {
        console.error("Error indexing the question Bank", e);
        this.initializeSearchIndex(bank);
      }
    })();

    this.initializationWork.set(bank, newWork);
    await newWork;
  }

  public async search(
    bank: QuestionBank,
    params: SearchParams,
  ): Promise<{
    items: SearchResult[];
    totalResults: number;
    nextCursor: number;
  }> {
    const results = await (async () => {
      if (!params.q) {
        // Kickstart the indexing processing but dont await it
        void this.initializeSearchIndex(bank);
        await this.initializeSearchResults(bank);
        return Array.from(this.searchResults.values());
      } else {
        await this.initializeSearchIndex(bank);
        await this.initializeSearchResults(bank);

        const searchField = params.filters.searchField;
        const isFuzzy = this.idSearchFields.includes(
          searchField as keyof SearchDocument,
        );

        const opts: SearchOptions = {
          fuzzy: isFuzzy ? false : 0.2,
          prefix: !isFuzzy,
          fields: searchField === "all" ? undefined : [searchField as string],
          tokenize: (text) => {
            if (
              this.idSearchFields.includes(searchField as keyof SearchDocument)
            ) {
              return text.split(", ");
            }
            return MiniSearch.getDefault("tokenize")(text);
          },
        };

        return this.searchIndex
          .search(params.q, opts)
          .map(({ id }) => this.searchResults.get(id));
      }
    })();

    const processedResults = results.filter(this.getSearchResultFilter(params));
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

  public async retrieve(
    bank: QuestionBank,
    ids: string[],
  ): Promise<{
    items: SearchResult[];
  }> {
    await this.initializeSearchResults(bank);

    const items = ids.map((id) => this.searchResults.get(id)).filter(Boolean);

    return { items };
  }

  public async initialize(bank: QuestionBank) {
    await this.initializeSearchIndex(bank);
    await this.initializeSearchResults(bank);
  }

  public abstract getFilters(bank: QuestionBank): Promise<{
    filters: Record<keyof SearchFilters, Filter>;
  }>;

  protected abstract getResultItems(
    bank: QuestionBank,
  ): Promise<SearchResult[]>;

  protected abstract getSearchDocuments(
    bank: QuestionBank,
  ): Promise<SearchDocument[]>;

  protected abstract getSearchResultFilter(
    params: SearchParams,
  ): (r: SearchResult | undefined) => r is SearchResult;
}
