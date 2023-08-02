import React from "react";
import { Box, Grid, Link, Typography } from "@mui/joy";
import { AppLayout, TestPreview, Ups } from "@chair-flight/react/components";
import { useTestProgress } from "../use-test-progress";
import type { FunctionComponent } from "react";

export const TestsOverview: FunctionComponent = () => {
  const tests = useTestProgress((s) => s.tests);
  const testsAsList = Object.values(tests).sort(
    (a, b) => b.createdAtEpochMs - a.createdAtEpochMs,
  );

  const entries = [
    {
      title: "In Progress tests",
      items: testsAsList.filter((test) => !test.finishedAtEpochMs),
      noItemsMessage: (
        <Typography>
          No tests in progress. You can{" "}
          <Link href="/tests/new">Create a New Test</Link>!
        </Typography>
      ),
      topRightCorner: <Link href="/tests/new">Create New Test</Link>,
    },
    {
      title: "Completed tests",
      items: testsAsList.filter((test) => test.finishedAtEpochMs),
      noItemsMessage: "No tests completed so far",
    },
  ];

  return (
    <Box>
      {entries.map(({ title, items, noItemsMessage, topRightCorner }) => (
        <React.Fragment key={title}>
          <AppLayout.Header>
            <Typography level="h3">{title}</Typography>
            {topRightCorner}
          </AppLayout.Header>
          <Grid
            container
            component="ul"
            sx={{ p: 0, listStyleType: "none" }}
            spacing={{ xs: 1, sm: 2 }}
          >
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
                  href={`/tests/${test.id}/${
                    test.status === "finished" ? "review" : "exam"
                  }`}
                  title={test.title}
                  status={test.status}
                  numberOfQuestions={test.questions.length}
                  epochTimeInMs={test.createdAtEpochMs}
                  timeToCompleteInMs={test.timeSpentInMs}
                  timeLeftInMs={test.durationInMs - test.timeSpentInMs}
                  score={
                    test.questions.reduce(
                      (s, q) =>
                        s + (q.selectedOptionId === q.correctOptionId ? 1 : 0),
                      0,
                    ) / test.questions.length
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
          </Grid>
        </React.Fragment>
      ))}
    </Box>
  );
};
