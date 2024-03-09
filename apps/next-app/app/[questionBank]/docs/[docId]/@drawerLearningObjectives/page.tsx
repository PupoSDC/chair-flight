import { SearchLearningObjectivesList } from "@cf/next/question-bank";
import { QuestionBank } from "@cf/providers/question-bank";
import { LearningObjectiveSearch } from "@cf/providers/search";
import type { DocId, QuestionBankName } from "@cf/core/question-bank";
import type { FunctionComponent } from "react";

type Props = {
  params: {
    docId: DocId;
    questionBank: QuestionBankName;
  };
};

const Page: FunctionComponent<Props> = async ({ params }) => {
  const bank = new QuestionBank(params.questionBank);
  const loSearch = new LearningObjectiveSearch();
  const rawDoc = await bank.getOne("docs", params.docId);
  const loIds = rawDoc.learningObjectives;
  const learningObjectives = await loSearch.retrieve(bank, loIds);

  return (
    <SearchLearningObjectivesList
      currentCourse="all"
      items={learningObjectives.items}
      forceMode="mobile"
    />
  );
};

export default Page;
