"use client";

import { Stack } from "@mui/joy";
import { useTrackEvent } from "@cf/next/analytics";
import { SearchHeader } from "@cf/react/components";
import { useSearchLearningObjectives } from "../../hooks/use-search-learning-objectives";
import { SearchLearningObjectivesList } from "./search-learning-objectives-list";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { LearningObjectiveSearchResult } from "@cf/core/search";
import type { SearchHeaderProps, SearchListProps } from "@cf/react/components";
import type { StackProps } from "@mui/joy";
import type { FunctionComponent } from "react";

export type SearchLearningObjectivesClientProps = {
  questionBank: QuestionBankName;
  filters: SearchHeaderProps["filters"];
  component?: StackProps["component"];
  sx?: StackProps["sx"];
  forceMode?: SearchListProps<LearningObjectiveSearchResult>["forceMode"];
};

export const SearchLearningObjectivesClient: FunctionComponent<
  SearchLearningObjectivesClientProps
> = ({ component = "div", sx, questionBank, filters, forceMode }) => {
  const search = useSearchLearningObjectives({ questionBank });
  const trackEvent = useTrackEvent();

  return (
    <Stack component={component} sx={sx}>
      <SearchHeader
        sx={{ mb: { xs: 1, md: 2 } }}
        search={search.searchQuery}
        searchPlaceholder="Search LearningObjectives..."
        filters={filters}
        filterValues={search.filterForm.watch()}
        isLoading={search.isLoading}
        isError={search.isError}
        onSearchChange={(v) => {
          trackEvent("learningObjectives.search", { query: v, questionBank });
          search.setSearchQuery(v);
        }}
        onFilterValuesChange={(name, value) =>
          search.filterForm.setValue(name, value)
        }
      />
      <SearchLearningObjectivesList
        loading={search.isLoading}
        error={search.isError}
        forceMode={forceMode}
        items={search.items}
        currentCourse={search.course}
        onFetchNextPage={search.fetchNextPage}
        sx={{ flex: 1, overflow: "hidden" }}
      />
    </Stack>
  );
};
