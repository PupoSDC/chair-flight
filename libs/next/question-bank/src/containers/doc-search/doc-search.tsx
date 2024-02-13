import { useState } from "react";
import { default as ConstructionIcon } from "@mui/icons-material/Construction";
import { default as HourglassEmptyIcon } from "@mui/icons-material/HourglassEmpty";
import { Stack, ListItemContent, Link, Tooltip } from "@mui/joy";
import { SearchHeader, SearchList } from "@cf/react/components";
import { trpc } from "@cf/trpc/client";
import { container, getRequiredParam } from "@cf/trpc/client";
import { useDocSearchConfig } from "../../hooks/use-doc-search-config";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { AppRouterOutput } from "@cf/trpc/client";

type Props = {
  questionBank: QuestionBankName;
};

type Params = Props;

type Data = AppRouterOutput["containers"]["docs"]["getDocSearch"];

type FilterKey = keyof Data["filters"];

const searchDocs = trpc.common.search.searchDocs;
const useSearchQuestions = searchDocs.useInfiniteQuery;

export const DocSearch = container<Props, Params, Data>(
  ({ sx, component = "section", questionBank }) => {
    const [search, setSearch] = useState("");
    const serverData = DocSearch.useData({ questionBank });
    const filterForm = useDocSearchConfig({ questionBank });
    const searchField = filterForm.watch("searchField");
    const subject = filterForm.watch("subject");
    const filters = { subject };

    const { data, isLoading, isError, fetchNextPage } = useSearchQuestions(
      { q: search, questionBank, limit: 32, searchField, filters },
      { getNextPageParam: (l) => l.nextCursor, initialCursor: 0 },
    );

    return (
      <Stack component={component} sx={sx}>
        <SearchHeader
          search={search}
          searchPlaceholder="Search Docs..."
          filters={serverData.filters}
          filterValues={filterForm.watch()}
          isLoading={isLoading}
          isError={isError}
          onSearchChange={setSearch}
          onFilterValuesChange={(name, value) =>
            filterForm.setValue(name as FilterKey, value)
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
                {result.learningObjectives.map((lo) => (
                  <Link href={lo.href} key={lo.id}>
                    {lo.id}
                  </Link>
                ))}
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
