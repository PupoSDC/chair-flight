import { DocLearningObjectives } from "../../(details)/learning-objectives/doc-learning-objectives";
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
  <DocLearningObjectives {...params} forceMode="mobile" currentCourse="all" />
);

export default Page;
