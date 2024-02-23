"use client";

import { Stack } from "@mui/joy";
import { useTrackEvent } from "@cf/next/analytics";
import { SearchHeader } from "@cf/react/components";
import { useSearchDocs } from "../../hooks/use-search-docs";
import { SearchDocsList } from "./search-docs-list";
import type { QuestionBankName, SubjectId } from "@cf/core/question-bank";
import type { DocSearchResult } from "@cf/core/search";
import type { SearchHeaderProps, SearchListProps } from "@cf/react/components";
import type { StackProps } from "@mui/joy";
import type { FunctionComponent } from "react";

export type SearchDocsClientProps = {
  questionBank: QuestionBankName;
  filters: SearchHeaderProps["filters"];
  subjectMap: Record<SubjectId, string>;
  component?: StackProps["component"];
  sx?: StackProps["sx"];
  forceMode?: SearchListProps<DocSearchResult>["forceMode"];
};

export const SearchDocsClient: FunctionComponent<SearchDocsClientProps> = ({
  questionBank,
  filters,
  subjectMap,
  component = "div",
  sx,
  forceMode,
}) => {
  const search = useSearchDocs({ questionBank });
  const trackEvent = useTrackEvent();

  return (
    <Stack component={component} sx={sx}>
      <SearchHeader
        sx={{ mb: { xs: 1, md: 2 } }}
        search={search.searchQuery}
        searchPlaceholder="Search Docs..."
        filters={filters}
        filterValues={search.filterForm.watch()}
        isLoading={search.isLoading}
        isError={search.isError}
        onSearchChange={(v) => {
          trackEvent("docs.search", { query: v, questionBank });
          search.setSearchQuery(v);
        }}
        onFilterValuesChange={(name, value) =>
          search.filterForm.setValue(name, value)
        }
      />
      <SearchDocsList
        loading={search.isLoading}
        error={search.isError}
        forceMode={forceMode}
        items={search.items}
        subjectMap={subjectMap}
        onFetchNextPage={search.fetchNextPage}
        sx={{ flex: 1, overflow: "hidden" }}
      />
    </Stack>
  );
};
