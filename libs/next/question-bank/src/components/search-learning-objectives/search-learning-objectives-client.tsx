"use client";

import { useState, type FunctionComponent } from "react";
import { Stack } from "@mui/joy";
import {
  learningObjectiveSearchFilters,
  type LearningObjectiveSearchResult,
} from "@cf/core/search";
import { trpc } from "@cf/next/trpc";
import { SearchHeader, usePersistedState } from "@cf/react/ui";
import { SearchLearningObjectivesList } from "./search-learning-objectives-list";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { SearchHeaderProps, SearchListProps } from "@cf/react/ui";
import type { StackProps } from "@mui/joy";

const searchLearningObjectives = trpc.search.searchLearningObjectives;
const useSearchLosQuery = searchLearningObjectives.useInfiniteQuery;

export type SearchLearningObjectivesClientProps = {
  questionBank: QuestionBankName;
  filterOptions: SearchHeaderProps["filters"];
  component?: StackProps["component"];
  sx?: StackProps["sx"];
  forceMode?: SearchListProps<LearningObjectiveSearchResult>["forceMode"];
};

export const SearchLearningObjectivesClient: FunctionComponent<
  SearchLearningObjectivesClientProps
> = ({ component = "div", sx, questionBank, filterOptions, forceMode }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [{ searchField, ...filters }, setFilterValues] = usePersistedState(
    "annex-search",
    learningObjectiveSearchFilters,
    learningObjectiveSearchFilters.parse({}),
  );

  const los = useSearchLosQuery(
    { q: searchQuery, questionBank, limit: 24, searchField, filters },
    { getNextPageParam: (l) => l.nextCursor, initialCursor: 0 },
  );

  const items = los.data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <Stack component={component} sx={sx}>
      <SearchHeader
        sx={{ mb: { xs: 1, md: 2 } }}
        search={searchQuery}
        searchPlaceholder="Search LearningObjectives..."
        filters={filterOptions}
        filterValues={{ searchField, ...filters }}
        isLoading={los.isLoading}
        isError={los.isError}
        onSearchChange={setSearchQuery}
        onFilterValuesChange={(v) => {
          setFilterValues(learningObjectiveSearchFilters.parse(v));
        }}
      />
      <SearchLearningObjectivesList
        loading={los.isLoading}
        error={los.isError}
        forceMode={forceMode}
        items={items}
        currentCourse={filters.course}
        onFetchNextPage={los.fetchNextPage}
        sx={{ flex: 1, overflow: "hidden" }}
      />
    </Stack>
  );
};
