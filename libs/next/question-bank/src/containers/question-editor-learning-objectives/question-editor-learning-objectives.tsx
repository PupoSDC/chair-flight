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
import { Markdown } from "@cf/react/markdown";
import { SearchHeader, SearchList } from "@cf/react/ui";
import { trpc } from "@cf/trpc/client";
import { container, getRequiredParam } from "@cf/trpc/client";
import { VerticalDivider } from "../../components/vertical-divider";
import { useLearningObjectiveSearch } from "../../hooks/use-learning-objective-search";
import { useQuestionEditor } from "../../hooks/use-question-editor";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { AppRouterOutput } from "@cf/trpc/server";

type Props = {
  questionId: string;
  questionBank: QuestionBankName;
};

type Params = Props;

type Data =
  AppRouterOutput["containers"]["questions"]["getQuestionEditorLearningObjectives"];

type FilterKey = keyof Data["filters"];

const search = trpc.common.search;
const useRetrieveLos = search.retrieveLearningObjective.useQuery;

export const QuestionEditorLearningObjectives = container<Props, Params, Data>(
  ({ sx, component = "div", questionId, questionBank }) => {
    const serverData = QuestionEditorLearningObjectives.useData({
      questionBank,
      questionId,
    });

    const { los, setLos } = useQuestionEditor((s) => ({
      los: s[questionBank].afterState[questionId]?.learningObjectives ?? [],
      setLos: s.setQuestionLearningObjectives,
    }));

    const search = useLearningObjectiveSearch({
      questionBank,
    });

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
          search={search.searchQuery}
          searchPlaceholder="Search Annexes..."
          mobileBreakpoint="force-mobile"
          filters={serverData.filters}
          filterValues={search.filterForm.watch()}
          isLoading={search.isLoading}
          isError={search.isError}
          onSearchChange={search.setSearchQuery}
          onFilterValuesChange={(k, v) =>
            search.filterForm.setValue(k as FilterKey, v)
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
              <ListItemContent sx={{ display: "flex" }}>
                <Box sx={{ flex: 1, pr: 1 }}>
                  <Typography level="h5" sx={{ fontSize: "sm" }}>
                    {result.id}
                  </Typography>
                  <Markdown compressed sx={{ "& > p": { fontSize: "sm" } }}>
                    {result.text}
                  </Markdown>
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
                  <Markdown compressed sx={{ fontSize: "xs" }}>
                    {result.text}
                  </Markdown>
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
