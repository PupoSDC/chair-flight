import { Box, Link, ListItemContent, Stack, Typography } from "@mui/joy";
import { useTrackEvent } from "@chair-flight/next/analytics";
import {
  ImageWithModal,
  SearchHeader,
  SearchList,
} from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { container, getRequiredParam } from "@chair-flight/trpc/client";
import { useAnnexSearch } from "../../hooks/use-annex-search";
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

type Data = AppRouterOutput["containers"]["annexes"]["getAnnexSearch"];

type FilterKey = keyof Data["filters"];

export const AnnexSearch = container<Props, Params, Data>(
  ({ sx, component = "section", questionBank, forceMode }) => {
    const trackEvent = useTrackEvent();
    const serverData = AnnexSearch.useData({ questionBank });
    const search = useAnnexSearch({ questionBank });

    return (
      <Stack component={component} sx={sx}>
        <SearchHeader
          search={search.searchQuery}
          searchPlaceholder="Search Annexes..."
          filters={serverData.filters}
          filterValues={search.filterForm.watch()}
          isLoading={search.isLoading}
          isError={search.isError}
          mobileBreakpoint="lg"
          onSearchChange={(v) => {
            trackEvent("annexes.search", { query: v, questionBank });
            search.setSearchQuery(v);
          }}
          onFilterValuesChange={(name, value) =>
            search.filterForm.setValue(name as FilterKey, value)
          }
        />
        <SearchList
          forceMode={forceMode}
          loading={search.isLoading}
          error={search.isError}
          items={search.items}
          onFetchNextPage={search.fetchNextPage}
          sx={{ flex: 1, overflow: "hidden" }}
          renderThead={() => (
            <thead>
              <tr>
                <th style={{ width: 300 }}>Image</th>
                <th>Description</th>
                <th style={{ width: 100 }}>Subjects</th>
                <th style={{ width: 200 }}>Learning Objectives</th>
                <th style={{ width: 90 }}>Questions</th>
              </tr>
            </thead>
          )}
          renderTableRow={(result) => (
            <tr>
              <Box component="td" sx={{ height: "200px !important" }}>
                <ImageWithModal
                  href={result.href}
                  alt=""
                  width={250}
                  height={200}
                />
                <Box component="b" sx={{ fontSize: 12 }}>
                  {result.id}
                </Box>
              </Box>
              <td>{result.description}</td>
              <td>{result.subjects.join(", ")}</td>
              <td>
                {result.learningObjectives.map(({ href, id }) => (
                  <Link href={href} key={id} sx={{ display: "block" }}>
                    {id}
                  </Link>
                ))}
              </td>
              <td>
                {result.questions.map(({ href, id }) => (
                  <Link href={href} key={id} sx={{ display: "block" }}>
                    {id}
                  </Link>
                ))}
              </td>
            </tr>
          )}
          renderListItemContent={(result) => (
            <ListItemContent sx={{ display: "flex" }}>
              <ImageWithModal
                href={result.href}
                alt=""
                width={125}
                height={100}
              />
              <Box sx={{ pl: 1 }}>
                <Typography level="h5" sx={{ fontSize: "xs" }}>
                  {result.id}
                </Typography>
                <Typography level="body-xs" sx={{ minHeight: "4em" }}>
                  {result.description}
                </Typography>
                <Typography level="body-xs">
                  <b>Questions</b>:&nbsp;
                  {result.questions.map(({ href, id }) => (
                    <Link href={href} key={id} sx={{ fontSize: "xs", pr: 1 }}>
                      {id}
                    </Link>
                  ))}
                </Typography>
                <Typography level="body-xs">
                  <b>Learning Objectives</b>:&nbsp;
                  {result.learningObjectives.map(({ href, id }) => (
                    <Link href={href} key={id} sx={{ fontSize: "xs", pr: 1 }}>
                      {id}
                    </Link>
                  ))}
                </Typography>
              </Box>
            </ListItemContent>
          )}
        />
      </Stack>
    );
  },
);

AnnexSearch.displayName = "AnnexSearch";

AnnexSearch.getData = async ({ helper, params }) => {
  const router = helper.containers.annexes;
  const questionBank = getRequiredParam(params, "questionBank");
  return await router.getAnnexSearch.fetch({ questionBank });
};

AnnexSearch.useData = (params) => {
  const router = trpc.containers.annexes;
  const questionBank = getRequiredParam(params, "questionBank");
  return router.getAnnexSearch.useSuspenseQuery({ questionBank })[0];
};
