import { SearchLearningObjectives } from "@cf/next/question-bank";
import { ModulesMain } from "@cf/next/ui";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { FunctionComponent } from "react";

type LearningObjectiveSearchProps = {
  params: {
    questionBank: QuestionBankName;
  };
};

const LearningObjectiveSearchPage: FunctionComponent<
  LearningObjectiveSearchProps
> = (props) => {
  return (
    <ModulesMain fixedHeight>
      <SearchLearningObjectives
        questionBank={props.params.questionBank}
        sx={{ height: "100%" }}
      />
    </ModulesMain>
  );
};

export default LearningObjectiveSearchPage;
