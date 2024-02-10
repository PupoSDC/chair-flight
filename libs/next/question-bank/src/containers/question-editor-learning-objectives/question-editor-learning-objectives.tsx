import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { default as AddIcon } from "@mui/icons-material/Add";
import { default as DeleteIcon } from "@mui/icons-material/DeleteOutlineOutlined";
import {
  Box,
  Button,
  ListItemContent,
  Stack,
  Tooltip,
  Typography,
} from "@mui/joy";
import { learningObjectiveSearchFilters } from "@chair-flight/core/search";
import {
  MarkdownClientCompressed,
  SearchHeader,
  SearchList,
} from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { container, getRequiredParam } from "@chair-flight/trpc/client";
import { VerticalDivider } from "../../components/vertical-divider";
import { useQuestionEditor } from "../../hooks/use-question-editor";
import type { QuestionBankName } from "@chair-flight/core/question-bank";
import type { AppRouterOutput } from "@chair-flight/trpc/server";

type Props = {
  questionId: string;
  questionBank: QuestionBankName;
};

type Params = Props;

type Data =
  AppRouterOutput["containers"]["questions"]["getQuestionEditorLearningObjectives"];

const search = trpc.common.search;
const useSearchLos = search.searchLearningObjectives.useInfiniteQuery;
const useRetrieveLos = search.retrieveLearningObjective.useQuery;
const filterFormDefaultValues = learningObjectiveSearchFilters.parse({});
const filterFormResolver = zodResolver(learningObjectiveSearchFilters);
type FilterKeys = keyof Data["filters"];

export const QuestionEditorLearningObjectives = container<Props, Params, Data>(
  ({ sx, component = "div", questionId, questionBank }) => {
    const [search, setSearch] = useState("");

    const { los, setLos } = useQuestionEditor((s) => ({
      los: s[questionBank].afterState[questionId]?.learningObjectives ?? [],
      setLos: s.setQuestionLearningObjectives,
    }));

    const serverData = QuestionEditorLearningObjectives.useData({
      questionBank,
      questionId,
    });

    const filterForm = useForm({
      defaultValues: filterFormDefaultValues,
      resolver: filterFormResolver,
    });

    const searchLos = useSearchLos(
      { q: search, questionBank, filters: filterForm.watch(), limit: 24 },
      { getNextPageParam: (l) => l.nextCursor, initialCursor: 0 },
    );

    const retrieveLos = useRetrieveLos(
      { ids: los ?? [], questionBank },
      { keepPreviousData: true },
    );

    const addLo = (id: string) => {
      const learningObjectives = [...new Set([...los, id])];
      setLos({ questionBank, questionId, learningObjectives });
    };

    const removeLo = (id: string) => {
      const learningObjectives = los.filter((i) => i !== id);
      setLos({ questionBank, questionId, learningObjectives });
    };

    return (
      <Stack component={component} sx={sx}>
        <SearchHeader
          search={search}
          searchPlaceholder="Search Annexes..."
          mobileBreakpoint="force-mobile"
          filters={serverData.filters}
          filterValues={filterForm.watch()}
          isLoading={searchLos.isLoading}
          isError={searchLos.isError}
          onSearchChange={setSearch}
          onFilterValuesChange={(k, v) =>
            filterForm.setValue(k as FilterKeys, v)
          }
        />
        <Stack flex={1} flexDirection={"row"} overflow={"hidden"}>
          <SearchList
            forceMode={"mobile"}
            loading={searchLos.isLoading}
            error={searchLos.isError}
            items={(searchLos.data?.pages ?? []).flatMap((p) => p.items)}
            onFetchNextPage={searchLos.fetchNextPage}
            sx={{ flex: 1, overflow: "hidden" }}
            renderThead={() => null}
            renderTableRow={() => null}
            renderListItemContent={(result) => (
              <ListItemContent sx={{ display: "flex" }}>
                <Box sx={{ flex: 1, pr: 1 }}>
                  <Typography level="h5" sx={{ fontSize: "sm" }}>
                    {result.id}
                  </Typography>
                  <MarkdownClientCompressed sx={{ fontSize: "xs" }}>
                    {result.text}
                  </MarkdownClientCompressed>
                </Box>
                <Box>
                  <Tooltip title="Add to Question">
                    <Button
                      sx={{ px: 1 }}
                      size="sm"
                      variant="plain"
                      disabled={los.includes(result.id)}
                      onClick={() => addLo(result.id)}
                      children={<AddIcon />}
                    />
                  </Tooltip>
                </Box>
              </ListItemContent>
            )}
          />
          <VerticalDivider />

          <SearchList
            forceMode={"mobile"}
            noDataMessage="No Annexes selected"
            loading={retrieveLos.isLoading}
            error={retrieveLos.isError}
            items={retrieveLos.data?.items ?? []}
            sx={{ flex: 1, overflow: "hidden", width: "100%" }}
            renderThead={() => null}
            renderTableRow={() => null}
            renderListItemContent={(result) => (
              <ListItemContent sx={{ display: "flex" }}>
                <Box sx={{ flex: 1, px: 1 }}>
                  <Typography level="h5" sx={{ fontSize: "sm" }}>
                    {result.id}
                  </Typography>
                  <MarkdownClientCompressed sx={{ fontSize: "xs" }}>
                    {result.text}
                  </MarkdownClientCompressed>
                </Box>
                <Box>
                  <Tooltip title="Remove from Question">
                    <Button
                      sx={{ px: 1 }}
                      size="sm"
                      variant="plain"
                      onClick={() => removeLo(result.id)}
                      children={<DeleteIcon />}
                    />
                  </Tooltip>
                </Box>
              </ListItemContent>
            )}
          />
        </Stack>
      </Stack>
    );
  },
);

QuestionEditorLearningObjectives.displayName =
  "QuestionEditorLearningObjectives";

QuestionEditorLearningObjectives.getData = async ({ helper, params }) => {
  const router = helper.containers.questions;
  const questionBank = getRequiredParam(params, "questionBank");
  return await router.getQuestionEditorLearningObjectives.fetch({
    questionBank,
  });
};

QuestionEditorLearningObjectives.useData = (params) => {
  const router = trpc.containers.questions;
  const questionBank = getRequiredParam(params, "questionBank");
  return router.getQuestionEditorLearningObjectives.useSuspenseQuery({
    questionBank,
  })[0];
};
