import { useState, type FunctionComponent } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { default as Image } from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, ListItemContent, Stack } from "@mui/joy";
import { QuestionBankName } from "@chair-flight/core/question-bank";
import { annexSearchFilters } from "@chair-flight/core/search";
import { SearchHeader, SearchList } from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { VerticalDivider } from "../../components/vertical-divider";
import { useQuestionEditorData } from "../hooks/use-question-editor-data";
import type { QuestionEditorState } from "../hooks/use-question-editor";

export type QuestionEditorTabAnnexesProps = {
  questionId: string;
  questionBank: QuestionBankName;
};
const searchAnnexes = trpc.common.search.searchQuestions;
const useSearchAnnexes = searchAnnexes.useInfiniteQuery;

export const QuestionEditorTabAnnexes: FunctionComponent<
  QuestionEditorTabAnnexesProps
> = ({ questionId, questionBank }) => {
  const form = useFormContext<QuestionEditorState>();

  const serverData = useQuestionEditorData({ questionBank });
  const [search, setSearch] = useState("");

  const filterForm = useForm({
    defaultValues: annexSearchFilters.parse({}),
    resolver: zodResolver(annexSearchFilters),
  });

  const { data, isLoading, isError, fetchNextPage } = useSearchAnnexes(
    { q: search, questionBank, filters: filterForm.watch(), limit: 24 },
    { getNextPageParam: (l) => l.nextCursor, initialCursor: 0 },
  );

  type FilterKeys = keyof typeof serverData.filters.annexes;

  return (
    <>
      <Stack sx={{ flex: 1 }}>
        <SearchHeader
          search={search}
          searchPlaceholder="Search Annexes..."
          filters={serverData.filters.annexes}
          filterValues={filterForm.watch()}
          isLoading={isLoading}
          isError={isError}
          onSearchChange={setSearch}
          onFilterValuesChange={(k, v) =>
            filterForm.setValue(k as FilterKeys, v)
          }
        />
        <SearchList
          forceMode={"mobile"}
          loading={isLoading}
          error={isError}
          items={(data?.pages ?? []).flatMap((p) => p.items)}
          onFetchNextPage={fetchNextPage}
          sx={{ flex: 1, overflow: "hidden" }}
          renderThead={() => null}
          renderTableRow={() => null}
          renderListItemContent={(result) => (
            <ListItemContent>
              <Image src={result.href} alt="" width={100} height={100} />
            </ListItemContent>
          )}
        />
      </Stack>
      <VerticalDivider />
      <Stack sx={{ flex: 1 }}>
        <SearchList
          forceMode={"mobile"}
          loading={isLoading}
          error={isError}
          items={(data?.pages ?? []).flatMap((p) => p.items)}
          onFetchNextPage={fetchNextPage}
          sx={{ flex: 1, overflow: "hidden" }}
          renderThead={() => null}
          renderTableRow={() => null}
          renderListItemContent={(result) => (
            <ListItemContent>
              <Image src={result.href} alt="" width={100} height={100} />
            </ListItemContent>
          )}
        />
      </Stack>
    </>
  );
};
