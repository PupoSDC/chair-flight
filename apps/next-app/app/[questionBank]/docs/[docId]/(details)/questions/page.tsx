import { ModulesMain } from "../../../../_client/modules-main";
import { DocQuestions } from "./doc-questions";
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
  <ModulesMain>
    <DocQuestions {...params} />
  </ModulesMain>
);

export default Page;
