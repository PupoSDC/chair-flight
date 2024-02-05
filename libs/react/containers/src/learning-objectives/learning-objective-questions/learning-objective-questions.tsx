import { QuestionList } from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { container, getRequiredParam } from "../../wraper";
import type {
  LearningObjectiveId,
  QuestionBankName,
} from "@chair-flight/core/question-bank";
import type { QuestionListProps } from "@chair-flight/react/components";
import type { AppRouterOutput } from "@chair-flight/trpc/client";

type Props = {
  questionBank: QuestionBankName;
  learningObjectiveId: LearningObjectiveId;
  forceMode?: QuestionListProps["forceMode"];
};

type Params = {
  questionBank: QuestionBankName;
  learningObjectiveId: LearningObjectiveId;
};

type Data =
  AppRouterOutput["containers"]["learningObjectives"]["getLearningObjectiveQuestions"];

export const LearningObjectiveQuestions = container<Props, Params, Data>(
  ({
    forceMode,
    questionBank,
    learningObjectiveId,
    sx,
    component = "section",
  }) => {
    const serverData = LearningObjectiveQuestions.useData({
      questionBank,
      learningObjectiveId,
    });

    return (
      <QuestionList
        forceMode={forceMode}
        items={serverData.results}
        component={component}
        sx={sx}
      />
    );
  },
);

LearningObjectiveQuestions.displayName = "LearningObjectiveQuestions";
LearningObjectiveQuestions.LoadingFallback = () => <QuestionList loading />;
LearningObjectiveQuestions.ErrorFallback = () => <QuestionList error />;

LearningObjectiveQuestions.getData = async ({ helper, params }) => {
  const router = helper.containers.learningObjectives;
  const questionBank = getRequiredParam(params, "questionBank");
  const learningObjectiveId = getRequiredParam(params, "learningObjectiveId");
  return await router.getLearningObjectiveQuestions.fetch({
    questionBank,
    learningObjectiveId,
  });
};

LearningObjectiveQuestions.useData = (params) => {
  const router = trpc.containers.learningObjectives;
  const questionBank = getRequiredParam(params, "questionBank");
  const learningObjectiveId = getRequiredParam(params, "learningObjectiveId");
  return router.getLearningObjectiveQuestions.useSuspenseQuery({
    questionBank,
    learningObjectiveId,
  })[0];
};
