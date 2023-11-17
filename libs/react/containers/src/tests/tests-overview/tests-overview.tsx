import React from "react";
import { NoSsr } from "@mui/base";
import { Box, Divider, Grid, Link, Stack, Typography } from "@mui/joy";
import { TestPreview, Ups } from "@chair-flight/react/components";
import { useTestProgress } from "../use-test-progress";
import type { QuestionBank } from "@chair-flight/base/types";
import type { BoxProps } from "@mui/joy";
import type { FunctionComponent } from "react";

export type TestsOverviewProps = {
  questionBank: QuestionBank;
} & BoxProps;

export const TestsOverview: FunctionComponent<TestsOverviewProps> = ({
  questionBank,
  ...props
}) => {
  const tests = useTestProgress((s) => s.tests);
  const testsAsList = Object.values(tests)
    .sort((a, b) => b.createdAtEpochMs - a.createdAtEpochMs)
    .filter((test) => test.questionBank === questionBank);

  const entries = [
    {
      title: "In Progress tests",
      items: testsAsList.filter((test) => test.status !== "finished"),
      noItemsMessage: (
        <Typography>
          No tests in progress. You can{" "}
          <Link href="./tests/create">Create a New Test</Link>!
        </Typography>
      ),
      topRightCorner: <Link href="./tests/create">Create New Test</Link>,
    },
    {
      title: "Completed tests",
      items: testsAsList.filter((test) => test.status === "finished"),
      noItemsMessage: "No tests completed so far",
    },
  ];

  return (
    <Box {...props}>
      {entries.map(({ title, items, noItemsMessage, topRightCorner }) => (
        <React.Fragment key={title}>
          <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
            <Typography level="h3">{title}</Typography>
            {topRightCorner}
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <Grid
            container
            component="ul"
            sx={{ p: 0, listStyleType: "none" }}
            spacing={{ xs: 1, sm: 2 }}
          >
            <NoSsr>
              {items.map((test) => (
                <Grid
                  component="li"
                  sx={{
                    pb: 1,
                    display: "flex",
                    alignItems: "stretch",
                    justifyContent: "stretch",
                  }}
                  key={test.id}
                  xs={12}
                  sm={6}
                  md={4}
                >
                  <TestPreview
                    sx={{ width: "100%" }}
                    data-cy="test-preview"
                    component={Link}
                    href={`./tests/${test.id}/${
                      test.status === "finished" ? "review" : test.mode
                    }`}
                    title={test.title}
                    status={test.status}
                    numberOfQuestions={test.questions.length}
                    epochTimeInMs={test.createdAtEpochMs}
                    timeToCompleteInMs={test.timeSpentInMs}
                    timeLeftInMs={test.durationInMs - test.timeSpentInMs}
                    score={
                      (test.questions.reduce(
                        (s, q) =>
                          s +
                          (q.selectedOptionId === q.correctOptionId ? 1 : 0),
                        0,
                      ) /
                        test.questions.length) *
                      100
                    }
                  />
                </Grid>
              ))}
              {items.length === 0 && (
                <Ups
                  children={noItemsMessage}
                  sx={{ minHeight: "initial", py: 2 }}
                />
              )}
            </NoSsr>
          </Grid>
        </React.Fragment>
      ))}
    </Box>
  );
};
