import { z } from "zod";
import type { MatchInfo } from "minisearch";

export const searchQueryValidation = z.object({
  q: z.string().optional(),
  page: z.preprocess(
    (a) => Number(a ?? 0),
    z.number().min(0).optional().default(0),
  ),
  pageSize: z.preprocess(
    (a) => Number(a ?? 25),
    z.number().min(1).max(100).optional().default(25),
  ),
});

export type SearchQuery = z.infer<typeof searchQueryValidation>;

export type SearchResult<T> = {
  result: T;
  score: number;
  match: MatchInfo;
  terms: string[];
};

export type SearchResults<T> = {
  results: SearchResult<T>[];
  totalResults: number;
  page: number;
};
