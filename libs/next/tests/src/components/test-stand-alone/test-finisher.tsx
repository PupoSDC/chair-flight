"use client";

import { useState } from "react";
import { Button, Typography } from "@mui/joy";
import { useTestProgress } from "../../hooks/use-test-progress";
import type { TestId } from "@cf/core/tests";
import type { FunctionComponent } from "react";

type TestFinisherProps = {
  testId: TestId;
  onTestDismissed?: () => void;
  onTestFinished?: () => void;
};

export const TestFinisher: FunctionComponent<TestFinisherProps> = ({
  testId,
  onTestDismissed,
  onTestFinished,
}) => {
  const finishTest = useTestProgress((s) => s.finishTest);
  const mode = useTestProgress((s) => s.getTest({ testId }).mode);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Typography level="h4" pt={2}>
        Are you sure you want to finish the test?
      </Typography>
      {mode === "study" && (
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
      <Button
        fullWidth
        sx={{ mt: 1 }}
        loading={isLoading}
        children="Finish"
        color="danger"
        onClick={() => {
          finishTest({ testId });
          onTestFinished?.();
          setIsLoading(true);
        }}
      />
    </>
  );
};
