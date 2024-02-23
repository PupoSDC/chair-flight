import { ModulesMain } from "../../../../_client/modules-main";
import { DocLearningObjectives } from "./doc-learning-objectives";
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
    <DocLearningObjectives {...params} currentCourse="all" />
  </ModulesMain>
);

export default Page;
