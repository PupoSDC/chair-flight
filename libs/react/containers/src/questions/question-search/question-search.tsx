import { useState } from "react";
import { FormProvider } from "react-hook-form";
import { Select, Stack, Option, selectClasses } from "@mui/joy";
import {
  SearchQuery,
  HookFormSelect,
  QuestionList,
  SearchFilters,
} from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { container, getRequiredParam } from "../../wraper/container";
import { useSearchConfig } from "./question-search-config-schema";
import type {
  QuestionBankName,
  QuestionBankSubject,
} from "@chair-flight/base/types";

const useSearchQuestions =
  trpc.questionBankQuestionSearch.searchQuestions.useInfiniteQuery;

type Props = {
  questionBank: QuestionBankName;
};

type Params = {
  questionBank: QuestionBankName;
};

type Data = {
  subjects: QuestionBankSubject[];
};

export const QuestionSearch = container<Props, Params, Data>(
  ({ sx, component = "section", questionBank }) => {
    const [search, setSearch] = useState("");
    const [{ searchField, subject }, form] = useSearchConfig(questionBank);
    const { subjects } = QuestionSearch.useData({ questionBank });

    const { data, isLoading, isError, fetchNextPage } = useSearchQuestions(
      {
        q: search,
        questionBank,
        searchField: searchField === "all" ? null : searchField,
        subject: subject === "all" ? null : subject,
        limit: 24,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialCursor: 0,
      },
    );

    const numberOfFilters =
      Number(searchField !== "all") + Number(subject !== "all");

    return (
      <Stack component={component} height="100%" sx={sx}>
        <Stack
          direction="row"
          sx={{
            mb: { xs: 1, sm: 2 },
            gap: 1,
            [`& .${selectClasses.root}`]: {
              width: "13em",
            },
          }}
        >
          <SearchQuery
            size="sm"
            value={search}
            loading={isLoading}
            onChange={(value) => setSearch(value)}
            sx={{ flex: 1 }}
            placeholder="search Questions..."
          />

          <FormProvider {...form}>
            <SearchFilters
              activeFilters={numberOfFilters}
              fallback={
                <>
                  <Select size="sm" />
                  <Select size="sm" />
                </>
              }
              filters={
                <>
                  <HookFormSelect size="sm" {...form.register("searchField")}>
                    <Option value={"all"}>All Fields</Option>
                    <Option value={"text"}>Question</Option>
                    <Option value={"questionId"}>Id</Option>
                    <Option value={"learningObjectives"}>
                      Learning Objectives
                    </Option>
                    <Option value={"externalIds"}>External Ids</Option>
                  </HookFormSelect>
                  <HookFormSelect size="sm" {...form.register("subject")}>
                    <Option value={"all"}>All Subjects</Option>
                    {subjects.map(({ id, shortName }) => (
                      <Option value={id} key={id}>
                        {shortName}
                      </Option>
                    ))}
                  </HookFormSelect>
                </>
              }
            />
          </FormProvider>
        </Stack>

        <QuestionList
          loading={isLoading}
          error={isError}
          questions={(data?.pages ?? []).flatMap((p) => p.items)}
          onFetchNextPage={fetchNextPage}
          sx={{ flex: 1, overflow: "hidden" }}
        />
      </Stack>
    );
  },
);

QuestionSearch.displayName = "QuestionSearch";

QuestionSearch.getData = async ({ helper, params }) => {
  const questionBank = getRequiredParam(params, "questionBank");

  const [data] = await Promise.all([
    helper.questionBank.getAllSubjects.fetch({ questionBank }),
  ]);

  return {
    subjects: data.subjects,
  };
};

QuestionSearch.useData = (params) => {
  const questionBank = getRequiredParam(params, "questionBank");

  const [data] = trpc.questionBank.getAllSubjects.useSuspenseQuery({
    questionBank,
  });

  return {
    subjects: data.subjects,
  };
};
