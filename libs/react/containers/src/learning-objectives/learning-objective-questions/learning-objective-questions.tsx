import type {
  QuestionListProps} from "@chair-flight/react/components";
import {
  QuestionList
} from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { container, getRequiredParam } from "../../wraper";
import type {
  LearningObjectiveId,
  QuestionBankName,
} from "@chair-flight/base/types";

type Props = {
  questionBank: QuestionBankName;
  learningObjectiveId: LearningObjectiveId;
  forceMode: QuestionListProps["forceMode"];
};

type Params = {
  questionBank: QuestionBankName;
  learningObjectiveId: LearningObjectiveId;
};

type Data = {
  questions: QuestionListProps["questions"];
};

export const LearningObjectiveQuestions = container<Props, Params, Data>(
  ({ questionBank, learningObjectiveId, sx, component = "section" }) => {
    const params = { questionBank, learningObjectiveId };
    const { questions } = LearningObjectiveQuestions.useData(params);

    return <QuestionList questions={questions} sx={sx} component={component} />;
  },
);

LearningObjectiveQuestions.displayName = "LearningObjectiveQuestions";

LearningObjectiveQuestions.getData = async ({ helper, params }) => {
  const questionBank = getRequiredParam(params, "questionBank");
  const learningObjectiveId = getRequiredParam(params, "learningObjectiveId");

  return await helper.questionBank.getLearningObjectiveQuestions.fetch({
    questionBank,
    learningObjectiveId,
  });
};

LearningObjectiveQuestions.useData = (params) => {
  const questionBank = getRequiredParam(params, "questionBank");
  const learningObjectiveId = getRequiredParam(params, "learningObjectiveId");

  return trpc.questionBank.getLearningObjectiveQuestions.useSuspenseQuery({
    questionBank,
    learningObjectiveId,
  })[0];
};

LearningObjectiveQuestions.LoadingFallback = () => <QuestionList loading />;

LearningObjectiveQuestions.ErrorFallback = () => <QuestionList error />;
