import { SearchDocs } from "@cf/react/containers";
import { ModulesMain } from "../../_client/modules-main";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { FunctionComponent } from "react";

type DocSearchPageProps = {
  params: {
    questionBank: QuestionBankName;
  }
};

const DocSearchPage: FunctionComponent<DocSearchPageProps> = ({ params }) => {
  return (
    <ModulesMain fixedHeight>
      <SearchDocs
        questionBank={params.questionBank}
        sx={{ height: "100%" }}
      />
    </ModulesMain>
  );
};

export default DocSearchPage;
