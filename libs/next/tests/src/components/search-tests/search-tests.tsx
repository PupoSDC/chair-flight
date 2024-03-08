"use client";

import { useState } from "react";
import { Button, Link, Stack } from "@mui/joy";
import { z } from "zod";
import { processTest } from "@cf/core/tests";
import { SearchHeader, usePersistedState } from "@cf/react/ui";
import { useTestProgress } from "../../hooks/use-test-progress";
import { SearchTestsList } from "./search-tests-list";
import type { SearchTestsResult } from "./search-tests-list";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { SearchListProps } from "@cf/react/ui";
import type { StackProps } from "@mui/joy";
import type { FunctionComponent } from "react";

const filterSchema = z.object({
  mode: z.enum(["all", "study", "exam"]).default("all"),
  status: z.enum(["all", "created", "started", "finished"]).default("all"),
});

export type SearchTestsProps = {
  questionBank: QuestionBankName;
  component?: StackProps["component"];
  sx?: StackProps["sx"];
  forceMode?: SearchListProps<SearchTestsResult>["forceMode"];
};

export const SearchTests: FunctionComponent<SearchTestsProps> = ({
  component = "div",
  questionBank,
  sx,
  forceMode,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const tests = useTestProgress((s) => s.tests);
  const deleteTest = useTestProgress((s) => s.deleteTest);
  const [filters, setFilterValues] = usePersistedState(
    "annex-search",
    filterSchema,
    filterSchema.parse({}),
  );

  const testsAsList = Object.values(tests)
    .sort((a, b) => b.createdAtEpochMs - a.createdAtEpochMs)
    .filter((test) => {
      if (test.questionBank !== questionBank) return false;
      if (filters.status !== "all" && filters.status !== test.status)
        return false;
      if (filters.mode !== "all" && filters.mode !== test.mode) return false;
      return true;
    })
    .map((test) => ({
      ...test,
      ...processTest(test),
    }));

  return (
    <Stack component={component} sx={sx}>
      <SearchHeader
        sx={{ mb: { xs: 1, md: 2 } }}
        search={searchQuery}
        searchPlaceholder="Search LearningObjectives..."
        filters={{
          mode: [
            { id: "all", text: "All Modes" },
            { id: "study", text: "Study" },
            { id: "exam", text: "Exam" },
          ],
          status: [
            { id: "all", text: "All States" },
            { id: "started", text: "Started" },
            { id: "finished", text: "Finished" },
          ],
        }}
        isLoading={false}
        isError={false}
        filterValues={filters}
        onSearchChange={setSearchQuery}
        onFilterValuesChange={(v) => {
          setFilterValues(filterSchema.parse(v));
        }}
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
        sx={{ flex: 1, overflow: "hidden" }}
        items={testsAsList}
        deleteTest={deleteTest}
        forceMode={forceMode}
      />
    </Stack>
  );
};
