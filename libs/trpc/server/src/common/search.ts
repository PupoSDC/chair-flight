import MiniSearch from "minisearch";
import { z } from "zod";
import { publicProcedure } from "../config/trpc";
import type { MatchInfo, SearchResult } from "minisearch";

export type SearchResponseItem<T> = {
  result: T;
  score: number;
  match: MatchInfo;
  terms: string[];
};

export const makeSearchHandler = <
  BaseType,
  SearchType extends Record<string, string>,
  ResultType,
>({
  searchFields,
  getData,
  processData,
  processResults,
}: {
  searchFields: (keyof SearchType)[];
  getData: () => Promise<BaseType[]>;
  processData: (data: BaseType[]) => SearchType[];
  processResults: (
    data: BaseType[],
    results: SearchResult[],
  ) => Promise<SearchResponseItem<ResultType>[]>;
}) => {
  let initializationWork: Promise<void> | undefined;
  let data: BaseType[];

  const index = new MiniSearch<SearchType>({
    fields: searchFields as string[],
    storeFields: searchFields as string[],
  });

  const searchValidation = z.object({
    q: z.string().optional(),
    limit: z.number().min(1).max(50),
    cursor: z.number().default(0),
  });

  return publicProcedure.input(searchValidation).query(async ({ input }) => {
    if (initializationWork) await initializationWork;

    if (index.documentCount === 0) {
      data = await getData();
      const processedData = processData(data);
      await index.addAllAsync(processedData);
      await initializationWork;
    }

    const { q, limit, cursor = 0 } = input;
    const results = q ? index.search(q, { fuzzy: 0.2 }) : [];
    const processedResults = await processResults(data, results);
    const items = processedResults.slice(cursor, cursor + limit);

    return {
      items,
      totalResults: results.length,
      nextCursor: cursor + items.length,
    };
  });
};
