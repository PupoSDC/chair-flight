import { DocQuestions } from "../../(details)/questions/doc-questions";
import type { DocId, QuestionBankName } from "@cf/core/question-bank";
import type { FunctionComponent } from "react";

type PageParams = {
  questionBank: QuestionBankName;
  docId: DocId;
};

type PageProps = {
  params: PageParams;
};

const Page: FunctionComponent<PageProps> = async ({ params }) => (
  <DocQuestions {...params} forceMode="mobile" />
);

export default Page;
