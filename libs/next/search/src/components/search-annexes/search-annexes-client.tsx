"use client";

import { useState, type FunctionComponent } from "react";
import { Stack } from "@mui/joy";
import { annexSearchFilters, type AnnexSearchResult } from "@cf/core/search";
import { trpc } from "@cf/next/trpc";
import { SearchHeader, usePersistedState } from "@cf/react/ui";
import { SearchAnnexesList } from "./search-annexes-list";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { SearchHeaderProps, SearchListProps } from "@cf/react/ui";
import type { StackProps } from "@mui/joy";

const searchAnnexes = trpc.search.searchAnnexes;
const useSearchAnnexesQuery = searchAnnexes.useInfiniteQuery;

export type SearchAnnexesClientProps = {
  questionBank: QuestionBankName;
  filterOptions: SearchHeaderProps["filters"];
  component?: StackProps["component"];
  sx?: StackProps["sx"];
  forceMode?: SearchListProps<AnnexSearchResult>["forceMode"];
};

export const SearchAnnexesClient: FunctionComponent<
  SearchAnnexesClientProps
> = ({ component = "div", sx, questionBank, filterOptions, forceMode }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [{ searchField, ...filters }, setFilterValues] = usePersistedState(
    "annex-search",
    annexSearchFilters,
    annexSearchFilters.parse({}),
  );

  const annexes = useSearchAnnexesQuery(
    { q: searchQuery, questionBank, limit: 24, searchField, filters },
    { getNextPageParam: (l) => l.nextCursor, initialCursor: 0 },
  );

  const items = annexes.data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <Stack component={component} sx={sx}>
      <SearchHeader
        sx={{ mb: { xs: 1, md: 2 } }}
        search={searchQuery}
        searchPlaceholder="Search Annexes..."
        filters={filterOptions}
        filterValues={{ searchField, ...filters }}
        isLoading={annexes.isLoading}
        isError={annexes.isError}
        onSearchChange={setSearchQuery}
        onFilterValuesChange={(v) => {
          setFilterValues(annexSearchFilters.parse(v));
        }}
      />
      <SearchAnnexesList
        loading={annexes.isLoading}
        error={annexes.isError}
        forceMode={forceMode}
        items={items}
        onFetchNextPage={annexes.fetchNextPage}
        sx={{ flex: 1, overflow: "hidden" }}
      />
    </Stack>
  );
};
