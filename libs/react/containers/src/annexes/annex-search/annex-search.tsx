import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/joy";
import { z } from "zod";
import { SearchHeader, SearchList } from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { createUsePersistenceHook } from "../../hooks/use-persistence";
import { container, getRequiredParam } from "../../wraper/container";
import { AnnexSearchItem } from "./annex-search-item";
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

type Data = AppRouterOutput["containers"]["annexes"]["getAnnexSearch"];

const filterSchema = z.object({
  subject: z.string().default("all"),
});

const defaultFilter = filterSchema.parse({});
const resolver = zodResolver(filterSchema);
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

    const form = useForm({
      defaultValues: persistedData.getData(),
      resolver,
    });

    const subject = form.watch("subject");

    const { data, isLoading, isError, fetchNextPage } = useSearchAnnexes(
      { q: search, questionBank, subject, limit: 24 },
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
          onSearchChange={setSearch}
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
                <th style={{ width: 200 }}>Description</th>
                <th style={{ width: 100 }}>Subjects</th>
                <th style={{}}>Learning Objectives</th>
                <th style={{}}>Questions</th>
              </tr>
            </thead>
          )}
          renderTableRow={(result) => (
            <AnnexSearchItem result={result} mobile={false} />
          )}
          renderListItemContent={(result) => (
            <AnnexSearchItem result={result} mobile={true} />
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
