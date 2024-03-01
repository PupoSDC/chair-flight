import { SearchQuestions } from "@cf/next/question-bank";
import { ModulesMain } from "@cf/next/ui";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { FunctionComponent } from "react";

type QuestionSearchProps = {
  params: {
    questionBank: QuestionBankName;
  };
};

const QuestionSearchPage: FunctionComponent<QuestionSearchProps> = (props) => {
  return (
    <ModulesMain fixedHeight>
      <SearchQuestions
        questionBank={props.params.questionBank}
        sx={{ height: "100%" }}
      />
    </ModulesMain>
  );
};

export default QuestionSearchPage;
