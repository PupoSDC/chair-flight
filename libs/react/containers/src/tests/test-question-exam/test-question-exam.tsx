import {
  QuestionBoxExam,
  QuestionMultipleChoice,
} from "@chair-flight/react/components";
import { useTestProgress } from "../use-test-progress";
import type { FunctionComponent } from "react";

type TestQuestionExamProps = {
  testId: string;
};

export const TestQuestionExam: FunctionComponent<TestQuestionExamProps> = ({
  testId,
}) => {
  const test = useTestProgress((s) => s.tests[testId]);
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
      status="in-progress"
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
    <QuestionBoxExam
      sx={{ width: "100%", maxHeight: "100%" }}
      title={title}
      timeSpentInMs={test.timeSpentInMs}
      timeTotalInMs={test.durationInMs}
      questionIndex={test.currentQuestionIndex}
      totalQuestions={test.questions.length}
      question={questionMultipleChoice}
      onNavigationClick={(p) => {
        const question = test.questions[p];
        if (!question) return;
        navigateToQuestion({
          testId: test.id,
          questionId: question.questionId,
        });
      }}
    />
  );
};
