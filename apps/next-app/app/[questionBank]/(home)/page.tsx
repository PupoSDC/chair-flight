import { QuestionBankName } from "@cf/core/question-bank";
import { FunctionComponent } from "react";

type QuestionBankHomeProps = {
  params: {
    questionBank: QuestionBankName;
  }
};

const QuestionBankHome : FunctionComponent<QuestionBankHomeProps> = ({ 
  params 
}) => {
  return (
    <div>
      <h1>Question Bank Home</h1>
    </div>
  );
}

export default QuestionBankHome;