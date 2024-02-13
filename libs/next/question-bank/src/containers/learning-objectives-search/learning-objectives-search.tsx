import { Stack } from "@mui/joy";
import { useTrackEvent } from "@cf/next/analytics";
import { SearchHeader } from "@cf/react/components";
import { trpc } from "@cf/trpc/client";
import { container, getRequiredParam } from "@cf/trpc/client";
import { LearningObjectiveList } from "../../components/learning-objectives-list";
import { useLearningObjectiveSearch } from "../../hooks/use-learning-objective-search";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { AppRouterOutput } from "@cf/trpc/client";

type Props = {
  questionBank: QuestionBankName;
};

type Params = {
  questionBank: QuestionBankName;
};

type Data =
  AppRouterOutput["containers"]["learningObjectives"]["getLearningObjectivesSearch"];

type FilterKey = keyof Data["filters"];

export const LearningObjectivesSearch = container<Props, Params, Data>(
  ({ component = "section", questionBank, sx }) => {
    const trackEvent = useTrackEvent();
    const serverData = LearningObjectivesSearch.useData({ questionBank });
    const search = useLearningObjectiveSearch({ questionBank });

    return (
      <Stack component={component} sx={sx}>
        <SearchHeader
          search={search.searchQuery}
          searchPlaceholder="Search Learning Objectives..."
          filters={serverData.filters}
          filterValues={search.filterForm.watch()}
          isLoading={search.isLoading}
          isError={search.isError}
          onSearchChange={(v) => {
            trackEvent("learningObjectives.search", { query: v, questionBank });
            search.setSearchQuery(v);
          }}
          onFilterValuesChange={(name, value) =>
            search.filterForm.setValue(name as FilterKey, value)
          }
        />
        <LearningObjectiveList
          loading={search.isLoading}
          error={search.isError}
          currentCourse={search.course}
          items={search.items}
          onFetchNextPage={search.fetchNextPage}
          sx={{ flex: 1, overflow: "hidden" }}
        />
      </Stack>
    );
  },
);

LearningObjectivesSearch.displayName = "LearningObjectivesSearch";

LearningObjectivesSearch.getData = async ({ helper, params }) => {
  const router = helper.containers.learningObjectives;
  const questionBank = getRequiredParam(params, "questionBank");
  return await router.getLearningObjectivesSearch.fetch({ questionBank });
};

LearningObjectivesSearch.useData = (params) => {
  const router = trpc.containers.learningObjectives;
  const questionBank = getRequiredParam(params, "questionBank");
  return router.getLearningObjectivesSearch.useSuspenseQuery({
    questionBank,
  })[0];
};
