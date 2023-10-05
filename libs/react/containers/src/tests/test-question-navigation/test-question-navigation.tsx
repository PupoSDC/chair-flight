import { useRouter } from "next/router";
import { Button } from "@mui/joy";
import {
  QuestionNavigation,
  useHeaderContext,
} from "@chair-flight/react/components";
import { useTestProgress } from "../use-test-progress";
import type { FunctionComponent } from "react";

export type TestQuestionNavigationProps = {
  testId: string;
};

export const TestQuestionNavigation: FunctionComponent<
  TestQuestionNavigationProps
> = ({ testId }) => {
  const test = useTestProgress((state) => state.tests[testId]);
  const router = useRouter();
  const navigateToQuestion = useTestProgress((s) => s.navigateToTestQuestion);
  const finishTest = useTestProgress((s) => s.finishTest);
  const { closeDrawer } = useHeaderContext();

  if (!test) throw new Error(`Test with id ${testId} not found`);

  const question = test.questions[test.currentQuestionIndex];

  return (
    <>
      <QuestionNavigation
        sx={{ width: "100%" }}
        status={
          test.mode === "exam" ? "in-progress" : "in-progress-with-results"
        }
        pageSize={80}
        currentId={question.questionId}
        questions={test.questions.map((q) => ({
          id: q.questionId,
          selectedOption: q.selectedOptionId,
          correctOption: q.correctOptionId,
        }))}
        onQuestionClicked={(questionId) => {
          navigateToQuestion({ testId: test.id, questionId });
          closeDrawer();
        }}
      />
      <Button
        fullWidth
        sx={{ mt: 2 }}
        children="Finish"
        onClick={() => {
          finishTest({ testId: test.id });
          router.push(`/tests/${test.id}/review`);
        }}
      />
    </>
  );
};
