import { SearchTests } from "@cf/react/containers";
import { ModulesMain } from "../../_client/modules-main";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { FunctionComponent } from "react";

type TestSearchPageProps = {
  params: {
    questionBank: QuestionBankName;
  }
};

const TestSearchPage: FunctionComponent<TestSearchPageProps> = ({ params }) => {
  return (
    <ModulesMain fixedHeight>
      <SearchTests
        questionBank={params.questionBank}
        sx={{ height: "100%" }}
      />
    </ModulesMain>
  );
};

export default TestSearchPage;
