import { useState } from "react";
import { Button, Typography } from "@mui/joy";
import { container } from "@cf/trpc/client";
import { useTestProgress } from "../../hooks/use-test-progress";
import type { TestId } from "@cf/core/tests";

type Props = {
  testId: TestId;
  noSsr: true;
  onTestDismissed?: () => void;
  onTestFinished?: () => void;
};

export const TestFinisher = container<Props>(
  ({ testId, onTestDismissed, onTestFinished }) => {
    const finishTest = useTestProgress((s) => s.finishTest);
    const [isLoading, setIsLoading] = useState(false);

    return (
      <>
        <Typography level="h4" pt={2}>
          Are you sure you want to finish the test?
        </Typography>
        {onTestDismissed && (
          <Button
            fullWidth
            sx={{ mt: 2 }}
            loading={isLoading}
            variant="outlined"
            children="Exit without finishing"
            color="warning"
            onClick={() => {
              onTestDismissed?.();
              setIsLoading(true);
            }}
          />
        )}
        {onTestFinished && (
          <Button
            fullWidth
            sx={{ mt: 1 }}
            loading={isLoading}
            children="Finish"
            color="danger"
            onClick={() => {
              finishTest({ testId });
              onTestFinished();
              setIsLoading(true);
            }}
          />
        )}
      </>
    );
  },
);

TestFinisher.displayName = "TestFinisher";
TestFinisher.getData = async () => ({});
TestFinisher.useData = () => ({});
