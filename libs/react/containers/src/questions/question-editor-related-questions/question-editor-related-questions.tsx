import { memo, useState } from "react";
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
import {
  getQuestionPreview,
  type QuestionBankName,
  type QuestionId,
} from "@chair-flight/core/question-bank";
import { questionSearchFilters } from "@chair-flight/core/search";
import {
  LoadingButton,
  MarkdownClientCompressed,
  SearchHeader,
  SearchList,
} from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { container, getRequiredParam } from "../../wraper";
import { VerticalDivider } from "../components/vertical-divider";
import { useQuestionEditor } from "../hooks/use-question-editor";
import type { AppRouterOutput } from "@chair-flight/trpc/server";

type Props = {
  questionId: string;
  questionBank: QuestionBankName;
};

type Params = Props;

type Data =
  AppRouterOutput["containers"]["questions"]["getQuestionEditorRelatedQuestions"];

const search = trpc.common.search;
const useSearchQuestions = search.searchQuestions.useInfiniteQuery;
const filterFormDefaultValues = questionSearchFilters.parse({});
const filterFormResolver = zodResolver(questionSearchFilters);
type FilterKeys = keyof Data["filters"];

const SearchListItem = memo<{
  id: QuestionId;
  parentId: QuestionId;
  bank: QuestionBankName;
}>(({ parentId, id, bank }) => {
  const utils = trpc.useUtils();
  const currentState = useQuestionEditor((s) => s[bank].afterState[id]);

  const { connectTwoQuestions, deleteQuestion } = useQuestionEditor((s) => ({
    connectTwoQuestions: s.connectTwoQuestions,
    deleteQuestion: s.markQuestionAsDeleted,
  }));

  const current = currentState
    ? {
        preview: getQuestionPreview(currentState.variant),
        los: currentState.learningObjectives.join(", "),
        annexes: currentState.annexes.join(", ") || "None",
        relatedQs: currentState.relatedQuestions.join(", "),
      }
    : null;

  if (!current) return null;

  return (
    <ListItemContent sx={{ display: "flex" }}>
      <Box sx={{ flex: 1, px: 1 }}>
        <Typography level="h5" sx={{ fontSize: "sm" }}>
          {id}
        </Typography>
        <MarkdownClientCompressed sx={{ fontSize: "xs" }}>
          {current.preview}
        </MarkdownClientCompressed>
      </Box>
      <Box>
        <Tooltip title="Disconnect Question">
          <LoadingButton
            sx={{ px: 1 }}
            size="sm"
            variant="plain"
            children={<DeleteIcon />}
            onClick={() =>
              connectTwoQuestions({ trpc: utils, bank, parentId, id })
            }
          />
        </Tooltip>
        <Tooltip title="Delete Question">
          <LoadingButton
            sx={{ px: 1 }}
            size="sm"
            variant="plain"
            color="danger"
            onClick={() => deleteQuestion(bank, id)}
            children={<DeleteIcon />}
          />
        </Tooltip>
      </Box>
    </ListItemContent>
  );
});

export const QuestionEditorRelatedQuestions = container<Props, Params, Data>(
  ({ sx, component = "div", questionId, questionBank }) => {
    const [search, setSearch] = useState("");

    const relatedQs = useQuestionEditor((s) => {
      return s[questionBank].afterState[questionId]?.learningObjectives ?? [];
    });

    const serverData = QuestionEditorRelatedQuestions.useData({
      questionBank,
      questionId,
    });

    const filterForm = useForm({
      defaultValues: filterFormDefaultValues,
      resolver: filterFormResolver,
    });

    const searchQuestions = useSearchQuestions(
      { q: search, questionBank, filters: filterForm.watch(), limit: 24 },
      { getNextPageParam: (l) => l.nextCursor, initialCursor: 0 },
    );

    const { connectTwoQuestions, deleteQuestion } = useQuestionEditor((s) => ({
      connectTwoQuestions: s.connectTwoQuestions,
      deleteQuestion: s.markQuestionAsDeleted,
    }));

    return (
      <Stack direction="row" component={component} sx={sx}>
        <Stack height="100%" flex={1}>
          <SearchHeader
            search={search}
            searchPlaceholder="Search Annexes..."
            filters={serverData.filters}
            filterValues={filterForm.watch()}
            isLoading={searchQuestions.isLoading}
            isError={searchQuestions.isError}
            onSearchChange={setSearch}
            onFilterValuesChange={(k, v) =>
              filterForm.setValue(k as FilterKeys, v)
            }
          />
          <SearchList
            forceMode={"mobile"}
            loading={searchQuestions.isLoading}
            error={searchQuestions.isError}
            items={(searchQuestions.data?.pages ?? []).flatMap((p) => p.items)}
            onFetchNextPage={searchQuestions.fetchNextPage}
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
                      children={<AddIcon />}
                    />
                  </Tooltip>
                </Box>
              </ListItemContent>
            )}
          />
        </Stack>
        <VerticalDivider />
        <Stack height="100%" flex={1}>
          <SearchList
            forceMode={"mobile"}
            noDataMessage="No Related Questions"
            items={relatedQs.map((id) => ({
              id,
              parentId: questionId,
              bank: questionBank,
            }))}
            sx={{ flex: 1, overflow: "hidden", width: "100%" }}
            renderThead={() => null}
            renderTableRow={() => null}
            renderListItemContent={SearchListItem}
          />
        </Stack>
      </Stack>
    );
  },
);

QuestionEditorRelatedQuestions.displayName = "QuestionEditorRelatedQuestions";

QuestionEditorRelatedQuestions.getData = async ({ helper, params }) => {
  const router = helper.containers.questions;
  const questionBank = getRequiredParam(params, "questionBank");
  return await router.getQuestionEditorRelatedQuestions.fetch({ questionBank });
};

QuestionEditorRelatedQuestions.useData = (params) => {
  const router = trpc.containers.questions;
  const questionBank = getRequiredParam(params, "questionBank");
  return router.getQuestionEditorRelatedQuestions.useSuspenseQuery({
    questionBank,
  })[0];
};
