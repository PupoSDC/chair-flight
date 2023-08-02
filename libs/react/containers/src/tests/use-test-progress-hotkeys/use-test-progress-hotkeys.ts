import { useHotkeys } from "react-hotkeys-hook";
import { useTestProgress } from "../use-test-progress/use-test-progress";

export const useTestHotkeys = ({ testId }: { testId: string }) => {
  const getTest = useTestProgress((s) => s.getTest);
  const answerQuestion = useTestProgress((s) => s.answerTestQuestion);
  const navigateToQuestion = useTestProgress((s) => s.navigateToTestQuestion);

  const selectOption = (optionIndex: number) => {
    const test = getTest({ testId });
    const currentQuestion = test.questions[test.currentQuestionIndex];
    answerQuestion({
      testId: test.id,
      questionId: currentQuestion.questionId,
      optionId: currentQuestion.options[optionIndex].id,
    });
  };

  const navigateToIndex = (questionIndexDiff: number) => {
    const test = getTest({ testId });
    const questionIndex = test.currentQuestionIndex + questionIndexDiff;
    const questionId = test.questions[questionIndex]?.questionId;
    if (!questionId) return;
    navigateToQuestion({
      testId: test.id,
      questionId,
    });
  };

  useHotkeys("left", () => navigateToIndex(-1));
  useHotkeys("right", () => navigateToIndex(1));
  useHotkeys("up", () => navigateToIndex(-1));
  useHotkeys("down", () => navigateToIndex(1));

  useHotkeys("a", () => selectOption(0));
  useHotkeys("b", () => selectOption(1));
  useHotkeys("c", () => selectOption(2));
  useHotkeys("d", () => selectOption(3));
  useHotkeys("1", () => selectOption(0));
  useHotkeys("2", () => selectOption(1));
  useHotkeys("3", () => selectOption(2));
  useHotkeys("4", () => selectOption(3));
};
