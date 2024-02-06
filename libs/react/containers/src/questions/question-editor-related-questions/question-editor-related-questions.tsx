import { QuestionBankName } from "@chair-flight/core/question-bank";
import { AppRouterOutput } from "@chair-flight/trpc/server";
import { container } from "../../wraper";

type Props = {
  questionId: string;
  questionBank: QuestionBankName;
};

type Params = Props;

type Data =
  AppRouterOutput["containers"]["questions"]["getQuestionEditorRelatedQuestions"];

export const QuestionEditorRelatedQuestions = container<Props, Params, Data>(
  ({ questionId, questionBank }) => {
    return null;
  },
);

QuestionEditorRelatedQuestions.displayName = "QuestionEditorRelatedQuestions";
QuestionEditorRelatedQuestions.getData = async () => ({});
QuestionEditorRelatedQuestions.useData = () => ({});
