import type { QuestionBank } from "@chair-flight/providers/question-bank";

type Filter = Array<{ id: string; text: string }>;

export interface QuestionBankSearchProvider<
  SearchResult extends { id: string },
  SearchParams extends { q: string },
  SearchFilters,
> {
  search: (params: SearchParams) => Promise<{
    items: SearchResult[];
    totalResults: number;
    nextCursor: number;
  }>;

  retrieve: (ids: string[]) => Promise<{
    items: SearchResult[];
  }>;

  getFilters: (bank: QuestionBank) => Promise<{
    filters: Record<keyof SearchFilters, Filter>;
  }>;

  initialize: (bank: QuestionBank) => Promise<void>;
}
