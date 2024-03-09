import { SearchQuestionsList } from "@cf/next/question-bank";
import { ModulesMain } from "@cf/next/ui";
import { QuestionBank } from "@cf/providers/question-bank";
import { QuestionSearch } from "@cf/providers/search";
import type {
  LearningObjectiveId,
  QuestionBankName,
} from "@cf/core/question-bank";
import type { FunctionComponent } from "react";

type Props = {
  params: {
    questionBank: QuestionBankName;
    learningObjectiveId: LearningObjectiveId;
  };
};

export const getLearningObjectiveQuestions = async (props: Props) => {
  const questionBank = new QuestionBank(props.params.questionBank);
  const questionSearch = new QuestionSearch();
  const loId = props.params.learningObjectiveId;
  const lo = await questionBank.getOne("learningObjectives", loId);
  return await questionSearch.retrieve(questionBank, lo.nestedQuestions);
};

const Page: FunctionComponent<Props> = async ({ params }) => {
  const { items } = await getLearningObjectiveQuestions({ params });

  return (
    <ModulesMain fixedHeight>
      <SearchQuestionsList items={items} />
    </ModulesMain>
  );
};

export default Page;
