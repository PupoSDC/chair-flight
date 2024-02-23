import { SearchLearningObjectives } from "@cf/react/containers";
import { ModulesMain } from "../_client/modules-main";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { FunctionComponent } from "react";

type PageParams = {
  questionBank: QuestionBankName;
};

type PageProps = {
  params: PageParams;
};

const Page: FunctionComponent<PageProps> = (props) => {
  return (
    <ModulesMain fixedHeight>
      <SearchLearningObjectives
        questionBank={props.params.questionBank}
        sx={{ height: "100%" }}
      />
    </ModulesMain>
  );
};

export default Page;
