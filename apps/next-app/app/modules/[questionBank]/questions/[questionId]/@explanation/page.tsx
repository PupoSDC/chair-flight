import { QuestionExplanation } from "@cf/next/question-bank";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { FunctionComponent } from "react";

export type QuestionPageProps = {
  params: {
    questionBank: QuestionBankName;
    questionId: string;
  };
};

const QuestionPageExplanation: FunctionComponent<QuestionPageProps> = ({
  params,
}) => {
  return (
    <QuestionExplanation
      questionBank={params.questionBank}
      questionId={params.questionId}
    />
  );
};

export default QuestionPageExplanation;
