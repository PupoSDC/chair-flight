import { SearchAnnexes } from "@cf/react/containers";
import { ModulesMain } from "../_client/modules-main";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { FunctionComponent } from "react";

type Params = {
  questionBank: QuestionBankName;
};

type AnnexSearchProps = {
  params: Params;
};

const AnnexSearchPage: FunctionComponent<AnnexSearchProps> = (props) => {
  return (
    <ModulesMain fixedHeight>
      <SearchAnnexes
        questionBank={props.params.questionBank}
        sx={{ height: "100%" }}
      />
    </ModulesMain>
  );
};

export default AnnexSearchPage;
