import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Link,
  ListItemContent,
  Select,
  Option,
  Stack,
  Typography,
  Chip,
  Divider,
} from "@mui/joy";
import { z } from "zod";
import { makeMap } from "@chair-flight/base/utils";
import {
  SearchQuery,
  HookFormSelect,
  MarkdownClientCompressed,
  SearchFilters,
  SearchHeader,
  SearchList,
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

    const coursesMap = makeMap(courses, (c) => c.id);

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

        <SearchList
          loading={isLoading}
          error={isError}
          items={(data?.pages ?? []).flatMap((p) => p.items)}
          onFetchNextPage={fetchNextPage}
          sx={{ flex: 1, overflow: "hidden" }}
          renderThead={() => (
            <thead>
              <tr>
                <th style={{ width: "8em" }}>LO</th>
                <th>Description</th>
                <th style={{ width: "14em" }}>Source</th>
                <th style={{ width: "14em" }}>Courses</th>
                <th style={{ width: "7em" }}>Questions</th>
              </tr>
            </thead>
          )}
          renderTableRow={(result) => (
            <tr key={result.id}>
              <td>
                <Link href={result.href}>
                  <Typography>{result.id}</Typography>
                </Link>
              </td>
              <td>
                <MarkdownClientCompressed>
                  {result.text}
                </MarkdownClientCompressed>
              </td>
              <Box component={"td"} fontSize={"xs"}>
                <MarkdownClientCompressed>
                  {result.source}
                </MarkdownClientCompressed>
              </Box>
              <td>
                {result.courses
                  .filter((c) => {
                    if (course === "all") return true;
                    if (c === course) return true;
                    return false;
                  })
                  .map((course) => (
                    <Chip key={course} size="sm" sx={{ m: 0.5 }}>
                      {coursesMap[course].text}
                    </Chip>
                  ))}
              </td>
              <Box
                component={"td"}
                children={result.numberOfQuestions}
                sx={{
                  textAlign: "right",
                  pr: `2em !important`,
                }}
              />
            </tr>
          )}
          renderListItemContent={(result) => (
            <ListItemContent>
              <Link href={`/modules/atpl/learning-objectives/${result.id}`}>
                <Typography>{result.id}</Typography>
              </Link>
              <Typography level="body-xs" sx={{ fontSize: 10 }}>
                {result.courses.map((c) => coursesMap[c]).join(", ")}
              </Typography>
              <Typography level="body-xs" sx={{ fontSize: 10 }}>
                Number of Questions {result.numberOfQuestions}
              </Typography>
              <Box
                sx={{
                  mt: 1,
                  fontSize: "sm",
                  height: "7em",
                  overflow: "hidden",
                  maskImage:
                    "linear-gradient(to bottom, black 50%, transparent 100%)",
                }}
              >
                <MarkdownClientCompressed>
                  {result.text}
                </MarkdownClientCompressed>
                {result.source && (
                  <>
                    <Divider sx={{ width: "50%", my: 0.5 }} />
                    <Typography level="body-xs">source: </Typography>
                    <Box
                      sx={{
                        color: "text.tertiary",
                        fontSize: "xs",
                      }}
                    >
                      <MarkdownClientCompressed>
                        {result.source}
                      </MarkdownClientCompressed>
                    </Box>
                  </>
                )}
              </Box>
            </ListItemContent>
          )}
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
