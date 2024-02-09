import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Link, ListItemContent, Stack, Typography } from "@mui/joy";
import { annexSearchFilters } from "@chair-flight/core/search";
import { useTrackEvent } from "@chair-flight/react/analytics";
import {
  ImageWithModal,
  SearchHeader,
  SearchList,
} from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { createUsePersistenceHook } from "../../hooks/use-persistence";
import { container, getRequiredParam } from "../../wraper/container";
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

const defaultFilter = annexSearchFilters.parse({});
const resolver = zodResolver(annexSearchFilters);
const searchQuestions = trpc.common.search.searchAnnexes;
const useSearchAnnexes = searchQuestions.useInfiniteQuery;

const useSearchPersistence = {
  atpl: createUsePersistenceHook("cf-annex-search-atpl", defaultFilter),
  type: createUsePersistenceHook("cf-annex-search-type", defaultFilter),
  prep: createUsePersistenceHook("cf-annex-search-prep", defaultFilter),
};

export const AnnexSearch = container<Props, Params, Data>(
  ({ sx, component = "section", questionBank, forceMode }) => {
    const [search, setSearch] = useState("");
    const persistedData = useSearchPersistence[questionBank]();
    const serverData = AnnexSearch.useData({ questionBank });
    const trackEvent = useTrackEvent();

    const form = useForm({
      defaultValues: persistedData.getData(),
      resolver,
    });

    const filters = {
      subject: form.watch("subject"),
    };

    const { data, isLoading, isError, fetchNextPage } = useSearchAnnexes(
      { q: search, limit: 24, questionBank, filters },
      { getNextPageParam: (l) => l.nextCursor, initialCursor: 0 },
    );

    form.watch((data) => persistedData.setData({ ...defaultFilter, ...data }));

    return (
      <Stack component={component} sx={sx}>
        <SearchHeader
          search={search}
          searchPlaceholder="Search Annexes..."
          filters={serverData.filters}
          filterValues={form.watch()}
          isLoading={isLoading}
          isError={isError}
          mobileBreakpoint="lg"
          onSearchChange={(v) => {
            trackEvent("annexes.search", { query: v, questionBank });
            setSearch(v);
          }}
          onFilterValuesChange={(name, value) =>
            form.setValue(name as keyof typeof defaultFilter, value)
          }
        />
        <SearchList
          forceMode={forceMode}
          loading={isLoading}
          error={isError}
          items={(data?.pages ?? []).flatMap((p) => p.items)}
          onFetchNextPage={fetchNextPage}
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
