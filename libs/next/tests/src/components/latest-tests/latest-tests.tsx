"use client";

import { processTest } from "@cf/core/tests";
import { useTestProgress } from "../../hooks/use-test-progress";
import { SearchTestsList } from "../search-tests";
import type { SearchTestsResult } from "../search-tests/search-tests-list";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { SearchListProps } from "@cf/react/ui";
import type { StackProps } from "@mui/joy";
import type { FunctionComponent } from "react";

export type LatestTestsProps = {
  questionBank: QuestionBankName;
  component?: StackProps["component"];
  sx?: StackProps["sx"];
  forceMode?: SearchListProps<SearchTestsResult>["forceMode"];
};

export const LatestTests: FunctionComponent<LatestTestsProps> = ({
  component = "div",
  questionBank,
  sx,
  forceMode,
}) => {
  const tests = useTestProgress((s) => s.tests);
  const deleteTest = useTestProgress((s) => s.deleteTest);

  const testsAsList = Object.values(tests)
    .sort((a, b) => b.createdAtEpochMs - a.createdAtEpochMs)
    .filter((test) => test.questionBank === questionBank)
    .slice(0, 5)
    .map((test) => ({ ...test, ...processTest(test) }));

  return (
    <SearchTestsList
      component={component}
      sx={sx}
      items={testsAsList}
      deleteTest={deleteTest}
      forceMode={forceMode}
    />
  );
};
