import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { default as AddIcon } from "@mui/icons-material/Add";
import { default as DeleteIcon } from "@mui/icons-material/DeleteOutlineOutlined";
import { Button, ListItemContent, Stack, Tooltip, Typography } from "@mui/joy";
import { annexSearchFilters } from "@chair-flight/core/search";
import {
  ImageWithModal,
  SearchHeader,
  SearchList,
} from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { container, getRequiredParam } from "../../wraper";
import { VerticalDivider } from "../components/vertical-divider";
import { useQuestionEditor } from "../hooks/use-question-editor";
import type { QuestionBankName } from "@chair-flight/core/question-bank";
import type { AppRouterOutput } from "@chair-flight/trpc/server";

type Props = {
  questionId: string;
  questionBank: QuestionBankName;
};

type Params = Props;

type Data =
  AppRouterOutput["containers"]["questions"]["getQuestionEditorAnnexes"];

const search = trpc.common.search;
const useSearchAnnexes = search.searchAnnexes.useInfiniteQuery;
const useRetrieveAnnexes = search.retrieveAnnexes.useQuery;
const filterFormDefaultValues = annexSearchFilters.parse({});
const filterFormResolver = zodResolver(annexSearchFilters);
type FilterKeys = keyof Data["filters"];

export const QuestionEditorAnnexes = container<Props, Params, Data>(
  ({ sx, component = "div", questionId, questionBank }) => {
    const [search, setSearch] = useState("");

    const { annexes, setAnnexes } = useQuestionEditor((s) => ({
      annexes: s[questionBank].afterState[questionId]?.annexes ?? [],
      setAnnexes: s.setQuestionAnnexes,
    }));

    const serverData = QuestionEditorAnnexes.useData({
      questionBank,
      questionId,
    });

    const filterForm = useForm({
      defaultValues: filterFormDefaultValues,
      resolver: filterFormResolver,
    });

    const searchAnnexes = useSearchAnnexes(
      { q: search, questionBank, filters: filterForm.watch(), limit: 24 },
      { getNextPageParam: (l) => l.nextCursor, initialCursor: 0 },
    );

    const retrieveAnnexes = useRetrieveAnnexes(
      { ids: annexes ?? [], questionBank },
      { keepPreviousData: true },
    );

    const addAnnex = (id: string) => {
      const newAnnexes = [...new Set([...annexes, id])];
      setAnnexes({ questionBank, questionId, annexes: newAnnexes });
    };

    const removeAnnex = (id: string) => {
      const newAnnexes = annexes.filter((a) => a !== id);
      setAnnexes({ questionBank, questionId, annexes: newAnnexes });
    };

    return (
      <Stack component={component} sx={sx}>
        <SearchHeader
          search={search}
          searchPlaceholder="Search Annexes..."
          mobileBreakpoint="force-mobile"
          filters={serverData.filters}
          filterValues={filterForm.watch()}
          isLoading={searchAnnexes.isLoading}
          isError={searchAnnexes.isError}
          onSearchChange={setSearch}
          onFilterValuesChange={(k, v) =>
            filterForm.setValue(k as FilterKeys, v)
          }
        />
        <Stack flex={1} flexDirection={"row"} overflow={"hidden"}>
          <SearchList
            forceMode={"mobile"}
            loading={searchAnnexes.isLoading}
            error={searchAnnexes.isError}
            items={(searchAnnexes.data?.pages ?? []).flatMap((p) => p.items)}
            onFetchNextPage={searchAnnexes.fetchNextPage}
            sx={{ flex: 1, overflow: "hidden" }}
            renderThead={() => null}
            renderTableRow={() => null}
            renderListItemContent={(result) => (
              <ListItemContent>
                <Stack
                  direction={"row"}
                  gap={1}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <Typography level="h5" sx={{ fontSize: "xs" }}>
                    {result.id}
                  </Typography>
                  <Tooltip title="Add to Question">
                    <Button
                      sx={{ px: 1 }}
                      size="sm"
                      variant="plain"
                      disabled={annexes.includes(result.id)}
                      onClick={() => addAnnex(result.id)}
                      children={<AddIcon />}
                    />
                  </Tooltip>
                </Stack>
                <Stack direction={"row"} gap={1}>
                  <ImageWithModal
                    href={result.href}
                    alt=""
                    width={100}
                    height={100}
                  />
                  <Typography level="body-xs" sx={{ minHeight: "4em" }}>
                    {result.description}
                  </Typography>
                </Stack>
              </ListItemContent>
            )}
          />
          <VerticalDivider />
          <SearchList
            forceMode={"mobile"}
            noDataMessage="No Annexes selected"
            loading={retrieveAnnexes.isLoading}
            error={retrieveAnnexes.isError}
            items={retrieveAnnexes.data?.items ?? []}
            sx={{ flex: 1, overflow: "hidden", width: "100%" }}
            renderThead={() => null}
            renderTableRow={() => null}
            renderListItemContent={(result) => (
              <ListItemContent>
                <Stack
                  direction={"row"}
                  gap={1}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <Typography level="h5" sx={{ fontSize: "xs" }}>
                    {result.id}
                  </Typography>
                  <Tooltip title="Remove from Question">
                    <Button
                      sx={{ px: 1 }}
                      size="sm"
                      variant="plain"
                      onClick={() => removeAnnex(result.id)}
                      children={<DeleteIcon />}
                    />
                  </Tooltip>
                </Stack>
                <Stack direction={"row"} gap={1}>
                  <ImageWithModal
                    href={result.href}
                    alt=""
                    width={100}
                    height={100}
                  />
                  <Typography level="body-xs" sx={{ minHeight: "4em" }}>
                    {result.description}
                  </Typography>
                </Stack>
              </ListItemContent>
            )}
          />
        </Stack>
      </Stack>
    );
  },
);

QuestionEditorAnnexes.displayName = "QuestionEditorAnnexes";

QuestionEditorAnnexes.getData = async ({ helper, params }) => {
  const router = helper.containers.questions;
  const questionBank = getRequiredParam(params, "questionBank");
  return await router.getQuestionEditorAnnexes.fetch({ questionBank });
};

QuestionEditorAnnexes.useData = (params) => {
  const router = trpc.containers.questions;
  const questionBank = getRequiredParam(params, "questionBank");
  return router.getQuestionEditorAnnexes.useSuspenseQuery({
    questionBank,
  })[0];
};
