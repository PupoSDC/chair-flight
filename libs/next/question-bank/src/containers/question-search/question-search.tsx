import { Stack } from "@mui/joy";
import { useTrackEvent } from "@cf/next/analytics";
import { SearchHeader } from "@cf/react/web";
import { trpc } from "@cf/trpc/client";
import { container, getRequiredParam } from "@cf/trpc/client";
import { QuestionList } from "../../components/question-list";
import { useQuestionSearch } from "../../hooks/use-question-search";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { SearchListProps } from "@cf/react/web";
import type { AppRouterOutput } from "@cf/trpc/client";

type Props = {
  questionBank: QuestionBankName;
  forceMode?: SearchListProps<{ id: string }>["forceMode"];
};

type Params = {
  questionBank: QuestionBankName;
};

type Data = AppRouterOutput["containers"]["questions"]["getQuestionSearch"];

type FilterKey = keyof Data["filters"];

export const QuestionSearch = container<Props, Params, Data>(
  ({ sx, forceMode, component = "section", questionBank }) => {
    const trackEvent = useTrackEvent();
    const serverData = QuestionSearch.useData({ questionBank });
    const search = useQuestionSearch({ questionBank });

    return (
      <Stack component={component} sx={sx}>
        <SearchHeader
          search={search.searchQuery}
          searchPlaceholder="Search Questions..."
          filters={serverData.filters}
          filterValues={search.filterForm.watch()}
          isLoading={search.isLoading}
          isError={search.isError}
          onSearchChange={(v) => {
            trackEvent("questions.search", { query: v, questionBank });
            search.setSearchQuery(v);
          }}
          onFilterValuesChange={(name, value) =>
            search.filterForm.setValue(name as FilterKey, value)
          }
        />
        <QuestionList
          loading={search.isLoading}
          error={search.isError}
          forceMode={forceMode}
          items={search.items}
          onFetchNextPage={search.fetchNextPage}
          sx={{ flex: 1, overflow: "hidden" }}
        />
      </Stack>
    );
  },
);

QuestionSearch.displayName = "QuestionSearch";

QuestionSearch.getData = async ({ helper, params }) => {
  const router = helper.containers.questions;
  const questionBank = getRequiredParam(params, "questionBank");
  return await router.getQuestionSearch.fetch({ questionBank });
};

QuestionSearch.useData = (params) => {
  const router = trpc.containers.questions;
  const questionBank = getRequiredParam(params, "questionBank");
  return router.getQuestionSearch.useSuspenseQuery({ questionBank })[0];
};
