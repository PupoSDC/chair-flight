import { useTheme } from "@mui/joy";
import {
  QuestionBoxStudy,
  QuestionMultipleChoice,
  useMediaQuery,
} from "@chair-flight/react/components";
import { useTestProgress } from "../use-test-progress";
import type { FunctionComponent } from "react";

type TestQuestionStudyProps = {
  testId: string;
};

export const TestQuestionStudy: FunctionComponent<TestQuestionStudyProps> = ({
  testId,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const test = useTestProgress((state) => state.tests[testId]);
  const navigateToQuestion = useTestProgress((s) => s.navigateToTestQuestion);
  const answerTestQuestion = useTestProgress((s) => s.answerTestQuestion);

  if (!test) throw new Error(`Test with id ${testId} not found`);

  const title = `Question ${test.currentQuestionIndex + 1} / ${
    test.questions.length
  }`;
  const question = test.questions[test.currentQuestionIndex];

  const questionMultipleChoice = (
    <QuestionMultipleChoice
      data-cy="question"
      question={question.question}
      disabled={question.selectedOptionId !== undefined}
      status={question.selectedOptionId ? "show-result" : "in-progress"}
      selectedOptionId={question.selectedOptionId}
      correctOptionId={question.correctOptionId}
      onOptionClicked={(optionId) =>
        answerTestQuestion({
          optionId,
          testId: test.id,
          questionId: question.questionId,
        })
      }
      options={question.options.map((opt) => ({
        optionId: opt.id,
        text: opt.text,
      }))}
    />
  );

  return (
    <QuestionBoxStudy
      sx={{ width: "100%", maxHeight: "100%" }}
      title={title}
      question={questionMultipleChoice}
    />
  );
};
