import { QuestionBankName } from "@chair-flight/core/question-bank";
import { AppRouterOutput } from "@chair-flight/trpc/server";
import { container } from "../../wraper";

type Props = {
  questionId: string;
  questionBank: QuestionBankName;
};

type Params = Props;

type Data =
  AppRouterOutput["containers"]["questions"]["getQuestionEditorLearningObjectives"];

export const QuestionEditorLearningObjectives = container<Props, Params, Data>(
  ({ questionId, questionBank }) => {
    return null;
  },
);

QuestionEditorLearningObjectives.displayName =
  "QuestionEditorLearningObjectives";
QuestionEditorLearningObjectives.getData = async () => ({});
QuestionEditorLearningObjectives.useData = () => ({});
