"use client";

import { useState, type FunctionComponent } from "react";
import { Stack } from "@mui/joy";
import {
  questionSearchFilters,
  type QuestionSearchResult,
} from "@cf/core/search";
import { trpc } from "@cf/next/trpc";
import { SearchHeader, usePersistedState } from "@cf/react/ui";
import { SearchQuestionsList } from "./search-questions-list";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { SearchHeaderProps, SearchListProps } from "@cf/react/ui";
import type { StackProps } from "@mui/joy";

const searchQuestions = trpc.search.searchQuestions;
const useSearchQuestionsQuery = searchQuestions.useInfiniteQuery;

export type SearchQuestionsClientProps = {
  questionBank: QuestionBankName;
  filterOptions: SearchHeaderProps["filters"];
  component?: StackProps["component"];
  sx?: StackProps["sx"];
  forceMode?: SearchListProps<QuestionSearchResult>["forceMode"];
};

export const SearchQuestionsClient: FunctionComponent<
  SearchQuestionsClientProps
> = ({ component = "div", sx, questionBank, filterOptions, forceMode }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [{ searchField, ...filters }, setFilterValues] = usePersistedState(
    "annex-search",
    questionSearchFilters,
    questionSearchFilters.parse({}),
  );

  const questions = useSearchQuestionsQuery(
    { q: searchQuery, questionBank, limit: 24, searchField, filters },
    { getNextPageParam: (l) => l.nextCursor, initialCursor: 0 },
  );

  const items = questions.data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <Stack component={component} sx={sx}>
      <SearchHeader
        sx={{ mb: { xs: 1, md: 2 } }}
        search={searchQuery}
        searchPlaceholder="Search Questions..."
        filters={filterOptions}
        filterValues={{ searchField, ...filters }}
        isLoading={questions.isLoading}
        isError={questions.isError}
        onSearchChange={setSearchQuery}
        onFilterValuesChange={(v) => {
          setFilterValues(questionSearchFilters.parse(v));
        }}
      />
      <SearchQuestionsList
        loading={questions.isLoading}
        error={questions.isError}
        forceMode={forceMode}
        items={items}
        onFetchNextPage={questions.fetchNextPage}
        sx={{ flex: 1, overflow: "hidden" }}
      />
    </Stack>
  );
};
