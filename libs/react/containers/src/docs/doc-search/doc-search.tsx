import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ConstructionIcon from "@mui/icons-material/Construction";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { Stack, ListItemContent, Link, Tooltip } from "@mui/joy";
import { z } from "zod";
import { SearchHeader, SearchList } from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { createUsePersistenceHook } from "../../hooks/use-persistence";
import { container, getRequiredParam } from "../../wraper/container";
import type { QuestionBankName } from "@chair-flight/core/question-bank";
import type { AppRouterOutput } from "@chair-flight/trpc/client";

type Props = {
  questionBank: QuestionBankName;
};

type Params = Props;

type Data = AppRouterOutput["containers"]["docs"]["getDocSearch"];

const filterSchema = z.object({
  subject: z.string().default("all"),
  searchField: z.string().default("all"),
});

const defaultFilter = filterSchema.parse({});
const resolver = zodResolver(filterSchema);
const searchDocs = trpc.common.search.searchDocs;
const useSearchQuestions = searchDocs.useInfiniteQuery;

const useSearchPersistence = {
  atpl: createUsePersistenceHook("cf-docs-search-atpl", defaultFilter),
  type: createUsePersistenceHook("cf-docs-search-type", defaultFilter),
  prep: createUsePersistenceHook("cf-docs-search-prep", defaultFilter),
};

export const DocSearch = container<Props, Params, Data>(
  ({ sx, component = "section", questionBank }) => {
    const [search, setSearch] = useState("");
    const persistedData = useSearchPersistence[questionBank]();
    const serverData = DocSearch.useData({ questionBank });

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
          searchPlaceholder="Search Docs..."
          filters={serverData.filters}
          filterValues={form.watch()}
          isLoading={isLoading}
          isError={isError}
          onSearchChange={setSearch}
          onFilterValuesChange={(name, value) =>
            form.setValue(name as keyof typeof defaultFilter, value)
          }
        />
        <SearchList
          loading={isLoading}
          error={isError}
          items={(data?.pages ?? []).flatMap((p) => p.items)}
          onFetchNextPage={fetchNextPage}
          sx={{ flex: 1, overflow: "hidden" }}
          renderThead={() => (
            <thead>
              <tr>
                <th style={{ width: 140 }}>Subject</th>
                <th style={{ width: 160 }}>Learning Objective</th>
                <th>Title</th>
                <th style={{ width: 100 }}>Status</th>
              </tr>
            </thead>
          )}
          renderTableRow={(result) => (
            <tr>
              <td>{serverData.subjectMap[result.subject]}</td>
              <td>
                <Link href={result.learningObjective.href}>
                  {result.learningObjective.id}
                </Link>
              </td>
              <td>
                <Link href={result.href}>{result.title}</Link>
              </td>
              <td>
                {result.empty ? (
                  <Tooltip title="This document is just a placeholder. Help Chair Flight grow by contributing!">
                    <HourglassEmptyIcon />
                  </Tooltip>
                ) : (
                  <Tooltip title="This document is a work in progress. Help Chair Flight grow by contributing!">
                    <ConstructionIcon />
                  </Tooltip>
                )}
              </td>
            </tr>
          )}
          renderListItemContent={(result) => (
            <ListItemContent
              sx={{
                flexDirection: "row",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Stack>
                <Link href={result.href}>{result.title}</Link>
                <Link level="body-sm" color="neutral" href={result.href}>
                  {result.learningObjective.id}
                </Link>
              </Stack>
              {result.empty ? (
                <HourglassEmptyIcon size="md" />
              ) : (
                <ConstructionIcon size="md" />
              )}
            </ListItemContent>
          )}
        />
      </Stack>
    );
  },
);

DocSearch.displayName = "DocSearch";

DocSearch.getData = async ({ helper, params }) => {
  const router = helper.containers.docs;
  const questionBank = getRequiredParam(params, "questionBank");
  return await router.getDocSearch.fetch({ questionBank });
};

DocSearch.useData = (params) => {
  const router = trpc.containers.docs;
  const questionBank = getRequiredParam(params, "questionBank");
  return router.getDocSearch.useSuspenseQuery({ questionBank })[0];
};
