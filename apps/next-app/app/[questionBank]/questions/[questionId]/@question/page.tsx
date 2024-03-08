import { QuestionStandAlone } from "@cf/next/question-bank";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { FunctionComponent } from "react";

export type QuestionPageProps = {
  params: {
    questionBank: QuestionBankName;
    questionId: string;
  };
  searchParams: {
    seed?: string;
  };
};

const QuestionPageQuestion: FunctionComponent<QuestionPageProps> = ({
  params,
  searchParams,
}) => {
  return (
    <QuestionStandAlone
      questionBank={params.questionBank}
      questionId={params.questionId}
      seed={searchParams.seed ?? "123"}
      sx={{ width: "100%" }}
    />
  );
};

export default QuestionPageQuestion;
