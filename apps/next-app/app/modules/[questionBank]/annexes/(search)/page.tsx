import { SearchAnnexes } from "@cf/next/search";
import { ModulesMain } from "@cf/next/ui";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { FunctionComponent } from "react";

type AnnexSearchProps = {
  params: {
    questionBank: QuestionBankName;
  };
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
