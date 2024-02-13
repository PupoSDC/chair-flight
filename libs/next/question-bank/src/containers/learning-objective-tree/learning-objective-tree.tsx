import { trpc } from "@cf/trpc/client";
import { container, getRequiredParam } from "@cf/trpc/client";
import { LearningObjectiveList } from "../../components/learning-objectives-list";
import type { LearningObjectiveListProps } from "../../components/learning-objectives-list";
import type {
  LearningObjectiveId,
  QuestionBankName,
} from "@cf/core/question-bank";
import type { AppRouterOutput } from "@cf/trpc/server";

type Props = {
  forceMode?: LearningObjectiveListProps["forceMode"];
  questionBank: QuestionBankName;
  learningObjectiveId: LearningObjectiveId;
};

type Params = {
  questionBank: QuestionBankName;
  learningObjectiveId: LearningObjectiveId;
};

type Data =
  AppRouterOutput["containers"]["learningObjectives"]["getLearningObjectiveTree"];

export const LearningObjectiveTree = container<Props, Params, Data>(
  ({ sx, forceMode, component = "section", ...params }) => {
    const results = LearningObjectiveTree.useData(params);
    return (
      <LearningObjectiveList
        forceMode={forceMode}
        component={component}
        sx={sx}
        items={results.items}
      />
    );
  },
);

LearningObjectiveTree.displayName = "LearningObjectiveTree";

LearningObjectiveTree.getData = async ({ helper, params }) => {
  const router = helper.containers.learningObjectives;
  const questionBank = getRequiredParam(params, "questionBank");
  const learningObjectiveId = getRequiredParam(params, "learningObjectiveId");
  return await router.getLearningObjectiveTree.fetch({
    questionBank,
    learningObjectiveId,
  });
};

LearningObjectiveTree.useData = (params) => {
  const router = trpc.containers.learningObjectives;
  const questionBank = getRequiredParam(params, "questionBank");
  const learningObjectiveId = getRequiredParam(params, "learningObjectiveId");
  return router.getLearningObjectiveTree.useSuspenseQuery({
    questionBank,
    learningObjectiveId,
  })[0];
};
