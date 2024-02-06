import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/joy";
import { SearchHeader, SearchList } from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { useQuestionEditorData } from "../hooks/use-question-editor-data";
import { QuestionManagerQuestionSearchItem } from "./question-manager-question-search-item";
import type { QuestionBankName } from "@chair-flight/core/question-bank";
import type { FunctionComponent } from "react";
import { questionSearchFilters } from "@chair-flight/core/search";

const searchQuestions = trpc.common.search.searchQuestions;
const useSearchQuestions = searchQuestions.useInfiniteQuery;

export const QuestionManagerQuestionSearch: FunctionComponent<{
  questionBank: QuestionBankName;
}> = ({ questionBank }) => {
  const serverData = useQuestionEditorData({ questionBank });
  const [search, setSearch] = useState("");

  const filterForm = useForm({
    defaultValues: questionSearchFilters.parse({}),
    resolver: zodResolver(questionSearchFilters),
  });

  const { data, isLoading, isError, fetchNextPage } = useSearchQuestions(
    { q: search, questionBank, filters: filterForm.watch(), limit: 24 },
    { getNextPageParam: (l) => l.nextCursor, initialCursor: 0 },
  );

  type FilterKeys = keyof typeof serverData.filters.questions;

  return (
    <Stack sx={{ flex: 1 }}>
      <SearchHeader
        search={search}
        onSearchChange={setSearch}
        filters={serverData.filters.questions}
        filterValues={filterForm.watch()}
        onFilterValuesChange={(k, v) => filterForm.setValue(k as FilterKeys, v)}
        isLoading={isLoading}
        isError={isError}
        mobileBreakpoint="xl"
      />
      <SearchList
        loading={isLoading}
        error={isError}
        forceMode="mobile"
        onFetchNextPage={fetchNextPage}
        items={(data?.pages ?? []).flatMap((p) => p.items)}
        errorMessage={"Error fetching questions"}
        noDataMessage={"No questions found"}
        renderThead={() => null}
        renderTableRow={() => null}
        renderListItemContent={QuestionManagerQuestionSearchItem}
        sx={{ flex: 1, overflow: "hidden" }}
      />
    </Stack>
  );
};
