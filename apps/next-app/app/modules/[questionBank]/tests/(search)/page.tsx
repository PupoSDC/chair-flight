import { SearchTests } from "@cf/next/search";
import { ModulesMain } from "@cf/next/ui";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { FunctionComponent } from "react";

type TestSearchProps = {
  params: {
    questionBank: QuestionBankName;
  };
};

const TestSearchPage: FunctionComponent<TestSearchProps> = (props) => {
  return (
    <ModulesMain fixedHeight>
      <SearchTests
        questionBank={props.params.questionBank}
        sx={{ height: "100%" }}
      />
    </ModulesMain>
  );
};

export default TestSearchPage;
