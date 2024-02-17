import { trpc } from "@cf/trpc/client";
import { container, getRequiredParam } from "@cf/trpc/client";
import { LearningObjectiveList } from "../../components/learning-objectives-list";
import type { DocId, QuestionBankName } from "@cf/core/question-bank";
import type { Container } from "@cf/trpc/client";
import type { AppRouterOutput } from "@cf/trpc/client";

type Props = {
  questionBank: QuestionBankName;
  docId: DocId;
};

type Params = {
  questionBank: QuestionBankName;
  docId: DocId;
};

type Data = AppRouterOutput["containers"]["docs"]["getDocLearningObjectives"];

export const DocLearningObjectives: Container<Props, Params, Data> = container<
  Props,
  Params,
  Data
>(({ questionBank, docId, sx, component = "div" }) => {
  const { items } = DocLearningObjectives.useData({ docId, questionBank });

  return (
    <LearningObjectiveList
      sx={sx}
      component={component}
      items={items}
      forceMode="mobile"
    />
  );
});

DocLearningObjectives.displayName = "DocContent";

DocLearningObjectives.getData = async ({ helper, params }) => {
  const router = helper.containers.docs;
  const questionBank = getRequiredParam(params, "questionBank");
  const docId = getRequiredParam(params, "docId");
  return await router.getDocLearningObjectives.fetch({ questionBank, docId });
};

DocLearningObjectives.useData = (params) => {
  const router = trpc.containers.docs;
  const questionBank = getRequiredParam(params, "questionBank");
  const docId = getRequiredParam(params, "docId");
  return router.getDocLearningObjectives.useSuspenseQuery({
    questionBank,
    docId,
  })[0];
};
