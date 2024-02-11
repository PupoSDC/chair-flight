import { default as AddIcon } from "@mui/icons-material/Add";
import { default as DeleteIcon } from "@mui/icons-material/DeleteOutlineOutlined";
import { Button, ListItemContent, Stack, Tooltip, Typography } from "@mui/joy";
import {
  ImageWithModal,
  SearchHeader,
  SearchList,
} from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { container, getRequiredParam } from "@chair-flight/trpc/client";
import { VerticalDivider } from "../../components/vertical-divider";
import { useAnnexSearch } from "../../hooks/use-annex-search";
import { useQuestionEditor } from "../../hooks/use-question-editor";
import type { QuestionBankName } from "@chair-flight/core/question-bank";
import type { AppRouterOutput } from "@chair-flight/trpc/server";

type Props = {
  questionId: string;
  questionBank: QuestionBankName;
};

type Params = {
  questionBank: QuestionBankName;
};

type Data =
  AppRouterOutput["containers"]["questions"]["getQuestionEditorAnnexes"];

type FilterKey = keyof Data["filters"];

const search = trpc.common.search;
const useRetrieveAnnexes = search.retrieveAnnexes.useQuery;

export const QuestionEditorAnnexes = container<Props, Params, Data>(
  ({ sx, component = "div", questionId, questionBank }) => {
    const serverData = QuestionEditorAnnexes.useData({ questionBank });
    const search = useAnnexSearch({ questionBank });

    const { annexes, setAnnexes } = useQuestionEditor((s) => ({
      annexes: s[questionBank].afterState[questionId]?.annexes ?? [],
      setAnnexes: s.setQuestionAnnexes,
    }));

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
          search={search.searchQuery}
          searchPlaceholder="Search Annexes..."
          mobileBreakpoint="force-mobile"
          filters={serverData.filters}
          filterValues={search.filterForm.watch()}
          isLoading={search.isLoading}
          isError={search.isError}
          onSearchChange={(v) => search.setSearchQuery(v)}
          onFilterValuesChange={(name, value) =>
            search.filterForm.setValue(name as FilterKey, value)
          }
        />
        <Stack flex={1} flexDirection={"row"} overflow={"hidden"}>
          <SearchList
            forceMode={"mobile"}
            loading={search.isLoading}
            error={search.isError}
            items={search.items}
            onFetchNextPage={search.fetchNextPage}
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
