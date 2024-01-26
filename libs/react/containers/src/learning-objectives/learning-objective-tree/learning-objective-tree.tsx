import type {
  LearningObjectiveId,
  QuestionBankName,
} from "@chair-flight/base/types";
import { makeMap } from "@chair-flight/base/utils";
import type {
  LearningObjectiveListProps} from "@chair-flight/react/components";
import {
  LearningObjectiveList
} from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import type { AppRouterOutput } from "@chair-flight/trpc/server";
import { container, getRequiredParam } from "../../wraper";

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
  AppRouterOutput["questionBankLoSearch"]["getLearningObjectiveTree"] &
    AppRouterOutput["questionBankLoSearch"]["getSearchConfigFilters"];

export const LearningObjectiveTree = container<Props, Params, Data>(
  ({ sx, forceMode, component = "section", ...params }) => {
    const { items, courses } = LearningObjectiveTree.useData(params);
    return (
      <LearningObjectiveList
        forceMode={forceMode}
        component={component}
        sx={sx}
        items={items}
        courseMap={makeMap(
          courses,
          (c) => c.id,
          (t) => t.text,
        )}
      />
    );
  },
);

LearningObjectiveTree.displayName = "LearningObjectiveTree";

LearningObjectiveTree.getData = async ({ helper, params }) => {
  const router = helper.questionBankLoSearch;
  const questionBank = getRequiredParam(params, "questionBank");
  const learningObjectiveId = getRequiredParam(params, "learningObjectiveId");
  const [data1, data2] = await Promise.all([
    router.getLearningObjectiveTree.fetch({
      questionBank,
      learningObjectiveId,
    }),
    router.getSearchConfigFilters.fetch({ questionBank }),
  ]);
  return { ...data1, ...data2 };
};

LearningObjectiveTree.useData = (params) => {
  const router = trpc.questionBankLoSearch;
  const questionBank = getRequiredParam(params, "questionBank");
  const learningObjectiveId = getRequiredParam(params, "learningObjectiveId");
  const data1 = router.getLearningObjectiveTree.useSuspenseQuery({
    questionBank,
    learningObjectiveId,
  })[0];
  const data2 = router.getSearchConfigFilters.useSuspenseQuery({
    questionBank,
  })[0];
  return { ...data1, ...data2 };
};
