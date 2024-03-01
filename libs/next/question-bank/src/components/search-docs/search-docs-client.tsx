"use client";

import { useState, type FunctionComponent } from "react";
import { Stack } from "@mui/joy";
import { docSearchFilters, type DocSearchResult } from "@cf/core/search";
import { trpc } from "@cf/next/trpc";
import { SearchHeader, usePersistedState } from "@cf/react/ui";
import { SearchDocsList } from "./search-docs-list";
import type { QuestionBankName, SubjectId } from "@cf/core/question-bank";
import type { SearchHeaderProps, SearchListProps } from "@cf/react/ui";
import type { StackProps } from "@mui/joy";

const searchDocs = trpc.search.searchDocs;
const useSearchDocsQuery = searchDocs.useInfiniteQuery;

export type SearchDocsClientProps = {
  questionBank: QuestionBankName;
  filterOptions: SearchHeaderProps["filters"];
  subjectMap: Record<SubjectId, string>;
  component?: StackProps["component"];
  sx?: StackProps["sx"];
  forceMode?: SearchListProps<DocSearchResult>["forceMode"];
};

export const SearchDocsClient: FunctionComponent<SearchDocsClientProps> = ({
  questionBank,
  filterOptions,
  subjectMap,
  component = "div",
  sx,
  forceMode,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [{ searchField, ...filters }, setFilterValues] = usePersistedState(
    "doc-search",
    docSearchFilters,
    docSearchFilters.parse({}),
  );

  const docs = useSearchDocsQuery(
    { q: searchQuery, questionBank, limit: 24, searchField, filters },
    { getNextPageParam: (l) => l.nextCursor, initialCursor: 0 },
  );

  const items = docs.data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <Stack component={component} sx={sx}>
      <SearchHeader
        sx={{ mb: { xs: 1, md: 2 } }}
        search={searchQuery}
        searchPlaceholder="Search Docs..."
        filters={filterOptions}
        filterValues={{ searchField, ...filters }}
        isLoading={docs.isLoading}
        isError={docs.isError}
        onSearchChange={setSearchQuery}
        onFilterValuesChange={(v) => {
          setFilterValues(docSearchFilters.parse(v));
        }}
      />
      <SearchDocsList
        loading={docs.isLoading}
        error={docs.isError}
        forceMode={forceMode}
        items={items}
        subjectMap={subjectMap}
        onFetchNextPage={docs.fetchNextPage}
        sx={{ flex: 1, overflow: "hidden" }}
      />
    </Stack>
  );
};
