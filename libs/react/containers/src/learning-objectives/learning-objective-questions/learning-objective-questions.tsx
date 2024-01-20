import { QuestionList } from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { container } from "../../wraper";
import type {
  LearningObjectiveId,
  QuestionBankName,
} from "@chair-flight/base/types";
import type { QuestionListProps } from "@chair-flight/react/components";

type Props = {
  questionBank: QuestionBankName;
  learningObjectiveId: LearningObjectiveId;
  forceMode?: QuestionListProps["forceMode"];
};

const useSearchQuestions =
  trpc.questionBankQuestionSearch.getQuestionsFromLearningObjective
    .useInfiniteQuery;

export const LearningObjectiveQuestions = container<Props>(
  ({ questionBank, learningObjectiveId, sx, component = "section" }) => {
    const { data, isLoading, isError, fetchNextPage } = useSearchQuestions(
      {
        questionBank,
        learningObjectiveId,
        limit: 20,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialCursor: 0,
      },
    );

    return (
      <QuestionList
        loading={isLoading}
        error={isError}
        questions={(data?.pages ?? []).flatMap((p) => p.items)}
        component={component}
        onFetchNextPage={fetchNextPage}
        sx={sx}
      />
    );
  },
);

LearningObjectiveQuestions.displayName = "LearningObjectiveQuestions";
LearningObjectiveQuestions.getData = async () => ({});
LearningObjectiveQuestions.useData = () => ({});
LearningObjectiveQuestions.LoadingFallback = () => <QuestionList loading />;
LearningObjectiveQuestions.ErrorFallback = () => <QuestionList error />;
