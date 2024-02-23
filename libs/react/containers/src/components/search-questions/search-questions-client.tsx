"use client";

import { Stack } from "@mui/joy";
import { SearchHeader } from "@cf/react/components";
import { useSearchQuestions } from "../../hooks/use-search-questions";
import { useTrackEvent } from "../../hooks/use-track-event";
import { SearchQuestionsList } from "./search-questions-list";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { QuestionSearchResult } from "@cf/core/search";
import type { SearchHeaderProps, SearchListProps } from "@cf/react/components";
import type { StackProps } from "@mui/joy";
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
  const search = useSearchQuestions({ questionBank });
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
          search.filterForm.setValue(name as "subject", value as "all")
        }
      />
      <SearchQuestionsList
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
