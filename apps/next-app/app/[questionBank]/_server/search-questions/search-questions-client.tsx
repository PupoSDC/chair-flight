"use client";

import { Stack } from "@mui/joy";
import { QuestionList } from "libs/next/question-bank/src/components/question-list";
import { useTrackEvent } from "@cf/next/analytics";
import { useQuestionSearch } from "@cf/next/question-bank";
import { SearchHeader } from "@cf/react/components";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { QuestionSearchResult } from "@cf/core/search";
import type { SearchListProps } from "@cf/react/components";
import type { StackProps } from "@mui/joy";
import type { SearchHeaderProps } from "libs/react/components/src/search-header/search-header";
import type { FunctionComponent } from "react";

export type SearchQuestionsClientProps = {
  questionBank: QuestionBankName;
  filters: SearchHeaderProps["filters"];
  component?: StackProps["component"];
  sx?: StackProps["sx"];
  forceMode?: SearchListProps<QuestionSearchResult>["forceMode"];
};

export const SearchQuestionsClient: FunctionComponent<
  SearchQuestionsClientProps
> = ({ component = "div", sx, questionBank, filters, forceMode }) => {
  const search = useQuestionSearch({ questionBank });
  const trackEvent = useTrackEvent();

  return (
    <Stack component={component} sx={sx}>
      <SearchHeader
        sx={{ mb: { xs: 1, md: 2 } }}
        search={search.searchQuery}
        searchPlaceholder="Search Questions..."
        filters={filters}
        filterValues={search.filterForm.watch()}
        isLoading={search.isLoading}
        isError={search.isError}
        onSearchChange={(v) => {
          trackEvent("questions.search", { query: v, questionBank });
          search.setSearchQuery(v);
        }}
        onFilterValuesChange={(name, value) =>
          search.filterForm.setValue(name, value)
        }
      />
      <QuestionList
        loading={search.isLoading}
        error={search.isError}
        forceMode={forceMode}
        items={search.items}
        onFetchNextPage={search.fetchNextPage}
        sx={{ flex: 1, overflow: "hidden" }}
      />
    </Stack>
  );
};
