import { SearchDocs } from "@cf/next/search";
import { ModulesMain } from "@cf/next/ui";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { FunctionComponent } from "react";

type DocSearchProps = {
  params: {
    questionBank: QuestionBankName;
  };
};

const DocSearchPage: FunctionComponent<DocSearchProps> = (props) => {
  return (
    <ModulesMain fixedHeight>
      <SearchDocs
        questionBank={props.params.questionBank}
        sx={{ height: "100%" }}
      />
    </ModulesMain>
  );
};

export default DocSearchPage;
