import { trpc } from "@chair-flight/trpc/client";
import { getRequiredParam } from "../../../wraper";
import type { QuestionBankName } from "@chair-flight/core/question-bank";

type Params = {
  questionBank: QuestionBankName;
};

export const useQuestionEditorData = (params: Params) => {
  const router = trpc.containers.questions;
  const questionBank = getRequiredParam(params, "questionBank");
  return router.getQuestionManager.useSuspenseQuery({ questionBank })[0];
};
