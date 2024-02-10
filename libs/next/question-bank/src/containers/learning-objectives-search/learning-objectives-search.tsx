import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/joy";
import { z } from "zod";
import { useTrackEvent } from "@chair-flight/next/analytics";
import {
  SearchHeader,
  LearningObjectiveList,
} from "@chair-flight/react/components";
import { createUsePersistenceHook } from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { container, getRequiredParam } from "@chair-flight/trpc/client";
import type { QuestionBankName } from "@chair-flight/core/question-bank";
import type { AppRouterOutput } from "@chair-flight/trpc/client";

type Props = {
  questionBank: QuestionBankName;
};

type Params = {
  questionBank: QuestionBankName;
};

type Data =
  AppRouterOutput["containers"]["learningObjectives"]["getLearningObjectivesSearch"];

const filterSchema = z.object({
  subject: z.string().default("all"),
  course: z.string().default("all"),
  searchField: z.string().default("all"),
});

const defaultFilter = filterSchema.parse({});
const resolver = zodResolver(filterSchema);
const searchLos = trpc.common.search.searchLearningObjectives;
const useSearchLos = searchLos.useInfiniteQuery;
const keyPrefix = "cf-learning-objectives-search" as const;

const useSearchPersistence = {
  atpl: createUsePersistenceHook(`${keyPrefix}-atpl`, defaultFilter),
  type: createUsePersistenceHook(`${keyPrefix}-type`, defaultFilter),
  prep: createUsePersistenceHook(`${keyPrefix}-prep`, defaultFilter),
};

export const LearningObjectivesSearch = container<Props, Params, Data>(
  ({ component = "section", questionBank, sx }) => {
    const [search, setSearch] = useState("");
    const persistedData = useSearchPersistence[questionBank]();
    const serverData = LearningObjectivesSearch.useData({ questionBank });
    const trackEvent = useTrackEvent();

    const form = useForm({
      defaultValues: persistedData.getData(),
      resolver,
    });

    const filters = {
      searchField: form.watch("searchField"),
      subject: form.watch("subject"),
      course: form.watch("course"),
    };

    const { data, isLoading, isError, fetchNextPage } = useSearchLos(
      { q: search, questionBank, limit: 20, filters },
      { getNextPageParam: (l) => l.nextCursor, initialCursor: 0 },
    );

    form.watch((data) => persistedData.setData({ ...defaultFilter, ...data }));

    return (
      <Stack component={component} sx={sx}>
        <SearchHeader
          search={search}
          searchPlaceholder="Search Learning Objectives..."
          filters={serverData.filters}
          filterValues={form.watch()}
          isLoading={isLoading}
          isError={isError}
          onSearchChange={(v) => {
            trackEvent("questions.search", { query: v, questionBank });
            setSearch(v);
          }}
          onFilterValuesChange={(name, value) =>
            form.setValue(name as keyof typeof defaultFilter, value)
          }
        />
        <LearningObjectiveList
          loading={isLoading}
          error={isError}
          currentCourse={filters.course}
          items={(data?.pages ?? []).flatMap((p) => p.items)}
          onFetchNextPage={fetchNextPage}
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
