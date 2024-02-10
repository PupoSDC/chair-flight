import { useState } from "react";
import { Stack } from "@mui/joy";
import { useTrackEvent } from "@chair-flight/next/analytics";
import { QuestionList, SearchHeader } from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { container, getRequiredParam } from "@chair-flight/trpc/client";
import { useQuestionSearchConfig } from "../../hooks/use-question-search-config";
import type { QuestionBankName } from "@chair-flight/core/question-bank";
import type { SearchListProps } from "@chair-flight/react/components";
import type { AppRouterOutput } from "@chair-flight/trpc/client";

type Props = {
  questionBank: QuestionBankName;
  forceMode?: SearchListProps<{ id: string }>["forceMode"];
};

type Params = {
  questionBank: QuestionBankName;
};

type Data = AppRouterOutput["containers"]["questions"]["getQuestionSearch"];

type FilterKey = keyof Data["filters"];

const searchQuestions = trpc.common.search.searchQuestions;
const useSearchQuestions = searchQuestions.useInfiniteQuery;

export const QuestionSearch = container<Props, Params, Data>(
  ({ sx, forceMode, component = "section", questionBank }) => {
    const [search, setSearch] = useState("");
    const serverData = QuestionSearch.useData({ questionBank });
    const filterForm = useQuestionSearchConfig({ questionBank });
    const trackEvent = useTrackEvent();

    const filters = {
      searchField: filterForm.watch("searchField"),
      subject: filterForm.watch("subject"),
    };

    const { data, isLoading, isError, fetchNextPage } = useSearchQuestions(
      { q: search, questionBank, limit: 24, filters },
      { getNextPageParam: (l) => l.nextCursor, initialCursor: 0 },
    );

    return (
      <Stack component={component} sx={sx}>
        <SearchHeader
          search={search}
          searchPlaceholder="Search Questions..."
          filters={serverData.filters}
          filterValues={filterForm.watch()}
          isLoading={isLoading}
          isError={isError}
          onSearchChange={(v) => {
            trackEvent("questions.search", { query: v, questionBank });
            setSearch(v);
          }}
          onFilterValuesChange={(name, value) =>
            filterForm.setValue(name as FilterKey, value)
          }
        />
        <QuestionList
          loading={isLoading}
          error={isError}
          forceMode={forceMode}
          items={(data?.pages ?? []).flatMap((p) => p.items)}
          onFetchNextPage={fetchNextPage}
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
