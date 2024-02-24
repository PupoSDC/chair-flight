import { SearchQuestions } from "@cf/react/containers";
import { ModulesMain } from "../../_client/modules-main";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { FunctionComponent } from "react";

type Params = {
  questionBank: QuestionBankName;
};

type QuestionSearchProps = {
  params: Params;
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
