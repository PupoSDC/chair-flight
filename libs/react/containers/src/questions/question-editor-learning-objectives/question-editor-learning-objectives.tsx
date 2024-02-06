import { container } from "../../wraper";
import type { QuestionBankName } from "@chair-flight/core/question-bank";
import type { AppRouterOutput } from "@chair-flight/trpc/server";

type Props = {
  questionId: string;
  questionBank: QuestionBankName;
};

type Params = Props;

type Data =
  AppRouterOutput["containers"]["questions"]["getQuestionEditorLearningObjectives"];

export const QuestionEditorLearningObjectives = container<Props, Params, Data>(
  () => {
    return null;
  },
);

QuestionEditorLearningObjectives.displayName =
  "QuestionEditorLearningObjectives";
QuestionEditorLearningObjectives.getData = async () => ({});
QuestionEditorLearningObjectives.useData = () => ({});
