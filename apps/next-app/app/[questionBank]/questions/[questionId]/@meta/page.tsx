import { QuestionMeta } from "@cf/next/question-bank";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { FunctionComponent } from "react";

export type QuestionPageProps = {
  params: {
    questionBank: QuestionBankName;
    questionId: string;
  };
};

const QuestionPageMeta: FunctionComponent<QuestionPageProps> = ({ params }) => {
  return (
    <QuestionMeta
      questionBank={params.questionBank}
      questionId={params.questionId}
    />
  );
};

export default QuestionPageMeta;
