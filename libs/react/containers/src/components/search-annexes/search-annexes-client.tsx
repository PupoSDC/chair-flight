"use client";

import { Stack } from "@mui/joy";
import { useTrackEvent } from "@cf/next/analytics";
import { SearchHeader } from "@cf/react/components";
import { useAnnexSearch } from "../../hooks/use-annex-search";
import { SearchAnnexesList } from "./search-annexes-list";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { AnnexSearchResult } from "@cf/core/search";
import type { SearchHeaderProps, SearchListProps } from "@cf/react/components";
import type { StackProps } from "@mui/joy";
import type { FunctionComponent } from "react";

export type SearchAnnexesClientProps = {
  questionBank: QuestionBankName;
  filters: SearchHeaderProps["filters"];
  component?: StackProps["component"];
  sx?: StackProps["sx"];
  forceMode?: SearchListProps<AnnexSearchResult>["forceMode"];
};

export const SearchAnnexesClient: FunctionComponent<
  SearchAnnexesClientProps
> = ({ component = "div", sx, questionBank, filters, forceMode }) => {
  const search = useAnnexSearch({ questionBank });
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
      <SearchAnnexesList
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
