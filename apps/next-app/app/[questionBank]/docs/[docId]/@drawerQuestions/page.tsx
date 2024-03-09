import { SearchQuestionsList } from "@cf/next/question-bank";
import { QuestionBank } from "@cf/providers/question-bank";
import { QuestionSearch } from "@cf/providers/search";
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
  const questionSearch = new QuestionSearch();
  const rawDoc = await bank.getOne("docs", params.docId);
  const loIds = rawDoc.learningObjectives;
  const los = await bank.getSome("learningObjectives", loIds);
  const questions = await questionSearch.retrieve(
    bank,
    los.map((lo) => lo.questions).flat(),
  );

  return <SearchQuestionsList items={questions.items} forceMode="mobile" />;
};

export default Page;
