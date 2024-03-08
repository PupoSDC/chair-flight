import { Button, Stack, useTheme } from "@mui/joy";
import { QuestionNavigation, useMediaQuery } from "@cf/react/ui";
import { useTestProgress } from "../../hooks/use-test-progress";
import type { TestId } from "@cf/core/tests";
import type { QuestionNavigationProps } from "@cf/react/ui";
import type { FunctionComponent } from "react";

type TestNavigationProps = {
  testId: TestId;
  sx?: QuestionNavigationProps["sx"];
  component?: QuestionNavigationProps["component"];
  onNavigation?: () => void;
  onTestFinished?: () => void;
};

export const TestNavigation: FunctionComponent<TestNavigationProps> = ({
  sx,
  component = "nav",
  testId,
  onNavigation,
  onTestFinished,
}) => {
  const theme = useTheme();
  const test = useTestProgress((state) => state.tests[testId]);
  const isSmScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const status = test.mode === "exam" ? "in-progress" : "both";
  const question = test.questions[test.currentQuestionIndex];
  const goToQuestion = useTestProgress((s) => s.goToTestQuestion);
  const finishTest = useTestProgress((s) => s.finishTest);

  return (
    <Stack
      sx={{
        justifyContent: "space-between",
        ...sx,
      }}
      component={component}
    >
      <QuestionNavigation
        status={status}
        sx={{ width: "100%" }}
        pageSize={isSmScreen ? 40 : 100}
        currentId={question.questionId}
        questions={test.questions.map((q) => ({
          id: q.questionId,
          selectedOption: q.selectedOptionId,
          correctOption: q.correctOptionId,
        }))}
        onQuestionClicked={(questionId) => {
          goToQuestion({ testId: test.id, questionId });
          onNavigation?.();
        }}
      />
      <Button
        fullWidth
        sx={{ mt: 2 }}
        children="Finish"
        onClick={() => {
          finishTest({ testId: test.id });
          onTestFinished?.();
        }}
      />
    </Stack>
  );
};
