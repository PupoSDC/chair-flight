import { useRouter } from "next/router";
import { Button } from "@mui/joy";
import {
  actions,
  useAppDispatch,
  useAppSelector,
} from "@chair-flight/core/redux";
import {
  TestQuestionNavigation,
  useHeaderContext,
} from "@chair-flight/react/components";
import type { FunctionComponent } from "react";

export type ExamNavigationProps = {
  testId: string;
};

export const ExamNavigation: FunctionComponent<ExamNavigationProps> = ({
  testId,
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const test = useAppSelector((state) => state.testProgress.tests[testId]);
  const currentQuestion = test.questions[test.currentQuestionIndex];
  const { closeDrawer } = useHeaderContext();

  return (
    <>
      <TestQuestionNavigation
        data-cy="test-question-navigation"
        sx={{ width: "100%" }}
        status="in-progress"
        currentId={currentQuestion.questionId}
        questions={test.questions.map((q) => ({
          id: q.questionId,
          selectedOption: q.selectedOptionId,
        }))}
        onQuestionClicked={(questionId) => {
          dispatch(
            actions.navigateToTestQuestion({
              testId: test.id,
              questionId,
            }),
          );
          closeDrawer();
        }}
      />
      <Button
        fullWidth
        sx={{ mt: 2 }}
        children="Finish"
        onClick={() => {
          dispatch(actions.finishTest({ testId: test.id }));
          router.replace(`/tests/${test.id}/review`);
        }}
      />
    </>
  );
};
