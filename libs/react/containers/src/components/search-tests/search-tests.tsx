"use client";

import { Button, Link, Stack } from "@mui/joy";
import { SearchHeader } from "@cf/react/components";
import { useSearchTests } from "../../hooks/use-search-tests";
import { useTestProgress } from "../../hooks/use-test-progress";
import { useTrackEvent } from "../../hooks/use-track-event";
import { SearchTestsList } from "./search-tests-list";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { ProcessedTest } from "@cf/core/tests";
import type { SearchListProps } from "@cf/react/components";
import type { StackProps } from "@mui/joy";
import type { FunctionComponent } from "react";

export type SearchTestsProps = {
  questionBank: QuestionBankName;
  component?: StackProps["component"];
  sx?: StackProps["sx"];
  forceMode?: SearchListProps<ProcessedTest>["forceMode"];
};

export const SearchTests: FunctionComponent<SearchTestsProps> = ({
  component = "div",
  sx,
  questionBank,
  forceMode,
}) => {
  const search = useSearchTests({ questionBank });
  const deleteTest = useTestProgress((s) => s.deleteTest);
  const trackEvent = useTrackEvent();

  return (
    <Stack component={component} sx={sx}>
      <SearchHeader
        sx={{ mb: { xs: 1, md: 2 } }}
        search={search.searchQuery}
        searchPlaceholder="Search Questions..."
        filters={{
          mode: [
            { id: "all", text: "All Modes" },
            { id: "study", text: "Study" },
            { id: "exam", text: "Test" },
          ],
          status: [
            { id: "all", text: "All States" },
            { id: "started", text: "Started" },
            { id: "finished", text: "Finished" },
          ],
        }}
        filterValues={search.filterForm.watch()}
        isLoading={search.isLoading}
        isError={search.isError}
        onSearchChange={(v) => {
          trackEvent("questions.search", { query: v, questionBank });
          search.setSearchQuery(v);
        }}
        onFilterValuesChange={(name, value) =>
          search.filterForm.setValue(name as "mode", value as "all")
        }
        children={
          <Button
            size="sm"
            component={Link}
            href={`/modules/${questionBank}/tests/create`}
          >
            Create Test
          </Button>
        }
      />
      <SearchTestsList
        questionBank={questionBank}
        loading={search.isLoading}
        error={search.isError}
        forceMode={forceMode}
        items={search.items}
        sx={{ flex: 1, overflow: "hidden" }}
        onDeleteTest={deleteTest}
      />
    </Stack>
  );
};
