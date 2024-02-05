export interface SearchProvider<
  SearchResult extends { id: string },
  SearchParams extends { q: string },
  SearchFilters,
> {
  search: (params: SearchParams) => Promise<{
    items: SearchResult[];
    totalResults: number;
    nextCursor: number;
  }>;

  retrieve: (ids: string[]) => Promise<SearchResult[]>;

  getFilters: () => Promise<
    Record<keyof SearchFilters, Array<{ id: string; text: string }>>
  >;
}
