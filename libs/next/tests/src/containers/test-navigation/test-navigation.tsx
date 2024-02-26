import { Button, useTheme } from "@mui/joy";
import { QuestionNavigation, useMediaQuery } from "@cf/react/ui";
import { container } from "@cf/trpc/client";
import { useTestProgress } from "../../hooks/use-test-progress";
import type { TestId } from "@cf/core/tests";

type Props = {
  testId: TestId;
  noSsr: true;
  onNavigation: () => void;
  onTestFinished: () => void;
};

export const TestNavigation = container<Props>(
  ({ testId, onNavigation, onTestFinished }) => {
    const theme = useTheme();
    const test = useTestProgress((state) => state.tests[testId]);
    const isSmScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const status = test.mode === "exam" ? "in-progress" : "both";
    const question = test.questions[test.currentQuestionIndex];
    const goToQuestion = useTestProgress((s) => s.goToTestQuestion);
    const finishTest = useTestProgress((s) => s.finishTest);

    return (
      <>
        <QuestionNavigation
          sx={{ width: "100%", height: "100%" }}
          status={status}
          pageSize={isSmScreen ? 40 : 100}
          currentId={question.questionId}
          questions={test.questions.map((q) => ({
            id: q.questionId,
            selectedOption: q.selectedOptionId,
            correctOption: q.correctOptionId,
          }))}
          onQuestionClicked={(questionId) => {
            goToQuestion({ testId: test.id, questionId });
            onNavigation();
          }}
        />
        <Button
          fullWidth
          sx={{ mt: 2 }}
          children="Finish"
          onClick={() => {
            finishTest({ testId: test.id });
            onTestFinished();
          }}
        />
      </>
    );
  },
);

TestNavigation.displayName = "TestNavigation";
TestNavigation.getData = async () => ({});
TestNavigation.useData = () => ({});
