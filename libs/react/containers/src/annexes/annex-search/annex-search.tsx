import { useState } from "react";
import { FormProvider } from "react-hook-form";
import { default as Image } from "next/image";
import { Select, Stack, Option, selectClasses, Box } from "@mui/joy";
import {
  SearchQuery,
  HookFormSelect,
  SearchFilters,
  SearchList,
} from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { container, getRequiredParam } from "../../wraper/container";
import { useSearchConfig } from "./annex-search-config-schema";
import type {
  QuestionBankName,
  QuestionBankSubject,
} from "@chair-flight/base/types";

const useAnnexSearch =
  trpc.questionBankAnnexSearch.searchAnnexes.useInfiniteQuery;

type Props = {
  questionBank: QuestionBankName;
};

type Params = {
  questionBank: QuestionBankName;
};

type Data = {
  subjects: QuestionBankSubject[];
};

export const AnnexSearch = container<Props, Params, Data>(
  ({ sx, component = "section", questionBank }) => {
    const [search, setSearch] = useState("");
    const [{ subject }, form] = useSearchConfig(questionBank);
    const { subjects } = AnnexSearch.useData({ questionBank });

    const { data, isLoading, isError, fetchNextPage } = useAnnexSearch(
      {
        questionBank,
        learningObjectives: null,
        subject: subject === "all" ? null : subject,
        limit: 24,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialCursor: 0,
      },
    );

    const numberOfFilters = Number(subject !== "all");

    return (
      <Stack component={component} sx={sx}>
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

          <SearchFilters
            activeFilters={numberOfFilters}
            fallback={
              <>
                <Select size="sm" />
                <Select size="sm" />
              </>
            }
            filters={
              <FormProvider {...form}>
                <HookFormSelect size="sm" {...form.register("subject")}>
                  <Option value={"all"}>All Subjects</Option>
                  {subjects.map(({ id, shortName }) => (
                    <Option value={id} key={id}>
                      {shortName}
                    </Option>
                  ))}
                </HookFormSelect>
              </FormProvider>
            }
          />
        </Stack>

        <SearchList
          loading={isLoading}
          error={isError}
          items={(data?.pages ?? []).flatMap((p) => p.items)}
          onFetchNextPage={fetchNextPage}
          sx={{ flex: 1, overflow: "hidden" }}
          renderThead={() => (
            <thead>
            <tr>
              <th style={{ width: 280 }}>Image</th>
              <th>ID</th>
       
              <th style={{ width: "12em" }}>Subjects</th>
              <th style={{ width: "12em" }}>Learning Objectives</th>

            </tr>
          </thead>
          )}
          renderTableRow={(result) => (
            <tr key={result.id}>
                            <Box component="td" sx={{ height: "200px !important" }}>
                <Image 
                  src={result.src} 
                  alt="" 
                  width={200} 
                  height={200} 
                  style={{ width: 'auto', maxWidth: 270, height: '100%' }}
                />
              </Box>
              <td>
                {result.id}
              </td>

              <td />
              <td />
            </tr>
          )}
          renderListItemContent={() => (<></>)}
        />
      </Stack>
    );
  },
);

AnnexSearch.displayName = "AnnexSearch";

AnnexSearch.getData = async ({ helper, params }) => {
  const questionBank = getRequiredParam(params, "questionBank");

  const [data] = await Promise.all([
    helper.questionBank.getAllSubjects.fetch({ questionBank }),
  ]);

  return {
    subjects: data.subjects,
  };
};

AnnexSearch.useData = (params) => {
  const questionBank = getRequiredParam(params, "questionBank");

  const [data] = trpc.questionBank.getAllSubjects.useSuspenseQuery({
    questionBank,
  });

  return {
    subjects: data.subjects,
  };
};
