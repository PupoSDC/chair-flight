import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/joy";
import { z } from "zod";
import { QuestionList, SearchHeader } from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { createUsePersistenceHook } from "../../hooks/use-persistence";
import { container, getRequiredParam } from "../../wraper/container";
import type { QuestionBankName } from "@chair-flight/base/types";
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

const filterSchema = z.object({
  subject: z.string().default("all"),
  searchField: z.string().default("all"),
});

const defaultFilter = filterSchema.parse({});
const resolver = zodResolver(filterSchema);
const searchQuestions = trpc.common.search.searchQuestions;
const useSearchQuestions = searchQuestions.useInfiniteQuery;

const useSearchPersistence = {
  atpl: createUsePersistenceHook("cf-question-search-atpl", defaultFilter),
  type: createUsePersistenceHook("cf-question-search-type", defaultFilter),
  prep: createUsePersistenceHook("cf-question-search-prep", defaultFilter),
};

export const QuestionSearch = container<Props, Params, Data>(
  ({ sx, forceMode, component = "section", questionBank }) => {
    const [search, setSearch] = useState("");
    const persistedData = useSearchPersistence[questionBank]();
    const serverData = QuestionSearch.useData({ questionBank });

    const form = useForm({
      defaultValues: persistedData.getData(),
      resolver,
    });

    const subject = form.watch("subject");
    const searchField = form.watch("searchField");

    const { data, isLoading, isError, fetchNextPage } = useSearchQuestions(
      { q: search, questionBank, searchField, subject, limit: 24 },
      { getNextPageParam: (l) => l.nextCursor, initialCursor: 0 },
    );

    form.watch((data) => persistedData.setData({ ...defaultFilter, ...data }));

    return (
      <Stack component={component} sx={sx}>
        <SearchHeader
          search={search}
          searchPlaceholder="Search Questions..."
          filters={serverData.filters}
          filterValues={form.watch()}
          isLoading={isLoading}
          isError={isError}
          onSearchChange={setSearch}
          onFilterValuesChange={(name, value) =>
            form.setValue(name as keyof typeof defaultFilter, value)
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
