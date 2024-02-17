import { trpc } from "@cf/trpc/client";
import { container, getRequiredParam } from "@cf/trpc/client";
import { QuestionList } from "../../components/question-list";
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

type Data = AppRouterOutput["containers"]["docs"]["getDocQuestions"];

export const DocQuestions: Container<Props, Params, Data> = container<
  Props,
  Params,
  Data
>(({ questionBank, docId, sx, component = "div" }) => {
  const { items } = DocQuestions.useData({ docId, questionBank });

  return (
    <QuestionList
      sx={sx}
      component={component}
      items={items}
      forceMode="mobile"
    />
  );
});

DocQuestions.displayName = "DocContent";

DocQuestions.getData = async ({ helper, params }) => {
  const router = helper.containers.docs;
  const questionBank = getRequiredParam(params, "questionBank");
  const docId = getRequiredParam(params, "docId");
  return await router.getDocQuestions.fetch({ questionBank, docId });
};

DocQuestions.useData = (params) => {
  const router = trpc.containers.docs;
  const questionBank = getRequiredParam(params, "questionBank");
  const docId = getRequiredParam(params, "docId");
  return router.getDocQuestions.useSuspenseQuery({ questionBank, docId })[0];
};
