import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, Option, Stack } from "@mui/joy";
import { z } from "zod";
import { makeMap } from "@chair-flight/base/utils";
import {
  SearchQuery,
  HookFormSelect,
  SearchFilters,
  SearchHeader,
  LearningObjectiveList,
} from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { createUsePersistenceHook } from "../../hooks/use-persistence";
import { container, getRequiredParam } from "../../wraper/container";
import type { QuestionBankName } from "@chair-flight/base/types";
import type { AppRouterOutput } from "@chair-flight/trpc/client";

type Props = {
  questionBank: QuestionBankName;
};

type Params = {
  questionBank: QuestionBankName;
};

type Data = AppRouterOutput["questionBankLoSearch"]["getSearchConfigFilters"];

const filterSchema = z.object({
  subject: z.string().default("all"),
  course: z.string().default("all"),
  searchField: z.string().default("all"),
});

const defaultFilter = filterSchema.parse({});
const resolver = zodResolver(filterSchema);
const searchLos = trpc.questionBankLoSearch.searchLearningObjectives;
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
    const { getData, setData } = useSearchPersistence[questionBank]();
    const serverData = LearningObjectivesSearch.useData({ questionBank });
    const form = useForm({ defaultValues: getData(), resolver });

    const { searchFields, subjects, courses } = serverData;
    const { searchField, subject, course } = form.watch();

    const { data, isLoading, isError, fetchNextPage } = useSearchLos(
      { q: search, questionBank, subject, searchField, course, limit: 20 },
      { getNextPageParam: (l) => l.nextCursor, initialCursor: 0 },
    );

    form.watch((data) => setData({ ...defaultFilter, ...data }));

    const numberOfFilters =
      Number(searchField !== "all") +
      Number(subject !== "all") +
      Number(course !== "all");

    return (
      <Stack component={component} sx={sx}>
        <SearchHeader>
          <SearchQuery
            size="sm"
            value={search}
            loading={isLoading}
            onChange={(value) => setSearch(value)}
            sx={{ flex: 1 }}
            placeholder="search Learning Objectives..."
          />

          <SearchFilters
            activeFilters={numberOfFilters}
            mobileBreakpoint="lg"
            fallback={[
              <Select size="sm" key={1} />,
              <Select size="sm" key={2} />,
              <Select size="sm" key={3} />,
            ]}
            filters={
              <FormProvider {...form}>
                <HookFormSelect size="sm" {...form.register("searchField")}>
                  {searchFields.map((s) => (
                    <Option key={s.id} value={s.id}>
                      {s.text}
                    </Option>
                  ))}
                </HookFormSelect>
                <HookFormSelect size="sm" {...form.register("course")}>
                  {courses.map((s) => (
                    <Option key={s.id} value={s.id}>
                      {s.text}
                    </Option>
                  ))}
                </HookFormSelect>
                <HookFormSelect size="sm" {...form.register("subject")}>
                  {subjects.map((s) => (
                    <Option key={s.id} value={s.id}>
                      {s.text}
                    </Option>
                  ))}
                </HookFormSelect>
              </FormProvider>
            }
          />
        </SearchHeader>

        <LearningObjectiveList
          loading={isLoading}
          error={isError}
          currentCourse={course}
          courseMap={makeMap(
            courses,
            (c) => c.id,
            (t) => t.text,
          )}
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
  const router = helper.questionBankLoSearch;
  const questionBank = getRequiredParam(params, "questionBank");
  return await router.getSearchConfigFilters.fetch({ questionBank });
};

LearningObjectivesSearch.useData = (params) => {
  const router = trpc.questionBankLoSearch;
  const questionBank = getRequiredParam(params, "questionBank");
  return router.getSearchConfigFilters.useSuspenseQuery({ questionBank })[0];
};
