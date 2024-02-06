import { container } from "../../wraper";
import type { QuestionBankName } from "@chair-flight/core/question-bank";
import type { AppRouterOutput } from "@chair-flight/trpc/server";

type Props = {
  questionId: string;
  questionBank: QuestionBankName;
};

type Params = Props;

type Data =
  AppRouterOutput["containers"]["questions"]["getQuestionEditorRelatedQuestions"];

export const QuestionEditorRelatedQuestions = container<Props, Params, Data>(
  () => {
    return null;
  },
);

QuestionEditorRelatedQuestions.displayName = "QuestionEditorRelatedQuestions";
QuestionEditorRelatedQuestions.getData = async () => ({});
QuestionEditorRelatedQuestions.useData = () => ({});
