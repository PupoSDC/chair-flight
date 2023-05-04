import { useHotkeys } from "react-hotkeys-hook";
import * as actions from "../actions/test-actions";
import { useAppDispatch, useAppSelector } from "../store/store";

export const useTestHotkeys = ({ testId }: { testId: string }) => {
  const dispatch = useAppDispatch();
  const test = useAppSelector((state) => state.testProgress.tests[testId]);
  const currentQuestion = test.questions[test.currentQuestionIndex];
  const selectOption = (optionIndex: number) => {
    dispatch(
      actions.answerTestQuestion({
        testId: test.id,
        questionId: currentQuestion.questionId,
        optionId: currentQuestion.options[optionIndex].id,
      })
    );
  };

  const navigateToIndex = (questionIndex: number) => {
    const questionId = test.questions[questionIndex]?.questionId;
    if (!questionId) return;
    dispatch(
      actions.navigateToTestQuestion({
        testId: test.id,
        questionId,
      })
    );
  };

  useHotkeys("left", () => navigateToIndex(test.currentQuestionIndex - 1));
  useHotkeys("right", () => navigateToIndex(test.currentQuestionIndex + 1));
  useHotkeys("up", () => navigateToIndex(test.currentQuestionIndex - 1));
  useHotkeys("down", () => navigateToIndex(test.currentQuestionIndex + 1));

  useHotkeys("a", () => selectOption(0));
  useHotkeys("b", () => selectOption(1));
  useHotkeys("c", () => selectOption(2));
  useHotkeys("d", () => selectOption(3));
  useHotkeys("1", () => selectOption(0));
  useHotkeys("2", () => selectOption(1));
  useHotkeys("3", () => selectOption(2));
  useHotkeys("4", () => selectOption(3));
};
