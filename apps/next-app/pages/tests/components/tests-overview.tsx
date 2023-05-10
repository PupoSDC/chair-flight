import { Grid, Link } from "@mui/joy";
import { useAppSelector } from "@chair-flight/core/redux";
import { TestPreview } from "@chair-flight/react/components";
import type { FunctionComponent } from "react";

export const PreviewTests: FunctionComponent = () => {
  const tests = useAppSelector((store) => store.testProgress.tests);
  const testsAsList = Object.values(tests).sort(
    (a, b) => b.createdAtEpochMs - a.createdAtEpochMs
  );

  return (
    <Grid container component="ul" sx={{ py: 0 }} spacing={2}>
      {testsAsList.map((test) => (
        <Grid
          component="li"
          sx={{ pb: 1 }}
          key={test.id}
          xs={12}
          sm={6}
          md={4}
          lg={3}
        >
          <TestPreview
            component={Link}
            href={`/tests/${test.id}/${
              test.status === "finished" ? "review" : "exam"
            }`}
            title={test.title}
            status={test.status}
            numberOfQuestions={test.questions.length}
            epochTimeInMs={test.createdAtEpochMs}
            timeToCompleteInMs={test.timeSpentInMs / 1000}
            timeLeftInMs={(test.durationInMs - test.timeSpentInMs) / 1000}
            score={
              test.questions.reduce(
                (s, q) =>
                  s + (q.selectedOptionId === q.correctOptionId ? 1 : 0),
                0
              ) / test.questions.length
            }
          />
        </Grid>
      ))}
    </Grid>
  );
};
