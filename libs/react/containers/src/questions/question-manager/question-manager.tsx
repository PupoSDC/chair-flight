import { memo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { default as DeleteIcon } from "@mui/icons-material/DeleteOutlineOutlined";
import { default as EditIcon } from "@mui/icons-material/EditOutlined";
import { default as AddInput } from "@mui/icons-material/InputOutlined";
import { default as UnlinkIcon } from "@mui/icons-material/LinkOff";
import { default as UndoIcon } from "@mui/icons-material/Undo";
import {
  Button,
  Divider,
  Link,
  ListItemContent,
  Stack,
  Tooltip,
  Typography,
} from "@mui/joy";
import { type QuestionBankName } from "@chair-flight/core/question-bank";
import { questionSearchFilters } from "@chair-flight/core/search";
import {
  LoadingButton,
  MarkdownClientCompressed,
  SearchHeader,
  SearchList,
} from "@chair-flight/react/components";
import { trpc, type AppRouterOutput } from "@chair-flight/trpc/client";
import { container, getRequiredParam } from "../../wraper/container";
import { VerticalDivider } from "../components/vertical-divider";
import { useQuestionEditor } from "../hooks/use-question-editor";
import type { QuestionId } from "@chair-flight/core/question-bank";

type Props = {
  questionBank: QuestionBankName;
};

type Params = Props;

type Data = AppRouterOutput["containers"]["questions"]["getQuestionManager"];

const search = trpc.common.search;
const useSearchQuestions = search.searchQuestions.useInfiniteQuery;
const filterFormDefaultValues = questionSearchFilters.parse({});
const filterFormResolver = zodResolver(questionSearchFilters);
type FilterKeys = keyof Data["filters"];

const ListItem = memo<{
  questionId: QuestionId;
  questionBank: QuestionBankName;
}>(({ questionId, questionBank }) => {
  const utils = trpc.useUtils();
  const {
    unlinkQuestion,
    deleteQuestion,
    removeQuestion,
    resetQuestion,
    getDiffStatus,
  } = useQuestionEditor((s) => ({
    unlinkQuestion: s.unlinkQuestion,
    deleteQuestion: s.markQuestionAsDeleted,
    removeQuestion: s.removeQuestion,
    getDiffStatus: s.getDiffStatus,
    resetQuestion: s.resetQuestion,
  }));

  const {
    isEdited,
    isDeleted,
    current,
    hasRelatedQs,
    hasRelatedQsChanged,
    hasLosChanged,
    hasAnnexesChanged,
  } = getDiffStatus({ questionBank, questionId });

  return (
    <ListItemContent
      sx={{
        flex: 1,
        ...(isDeleted && {
          textDecoration: "line-through",
          background: `repeating-linear-gradient(
            45deg,
            rgba(0, 0, 0, 0),
            rgba(0, 0, 0, 0) 10px,
            rgba(196, 28, 28, 0.3) 10px,
            rgba(196, 28, 28, 0.3) 20px
          )`,
        }),
      }}
    >
      <Stack direction={"row"} gap={1} alignItems={"center"}>
        <Typography level="h5" sx={{ fontSize: "sm", mr: "auto" }}>
          {questionId}
        </Typography>
        {!isDeleted && hasRelatedQs && (
          <Tooltip title="Unlink question from related questions">
            <LoadingButton
              sx={{ px: 1 }}
              size="sm"
              variant="plain"
              children={<UnlinkIcon />}
              onClick={() => unlinkQuestion({ questionBank, questionId })}
            />
          </Tooltip>
        )}
        {!isDeleted && (
          <Tooltip title="Edit Question">
            <Button
              component={Link}
              href={`/modules/${questionBank}/questions/editor/${questionId}`}
              sx={{ px: 1 }}
              size="sm"
              variant="plain"
              children={<EditIcon />}
            />
          </Tooltip>
        )}
        {!isDeleted && (
          <Tooltip title="Delete Question">
            <LoadingButton
              sx={{ px: 1 }}
              size="sm"
              variant="plain"
              onClick={() => deleteQuestion({ questionBank, questionId })}
              children={<DeleteIcon />}
            />
          </Tooltip>
        )}
        {!isEdited && !isDeleted && (
          <Tooltip title="Remove Question from editor">
            <LoadingButton
              sx={{ px: 1 }}
              size="sm"
              variant="plain"
              color="danger"
              children={<AddInput sx={{ transform: "rotate(180deg)" }} />}
              onClick={() =>
                removeQuestion({ trpc: utils, questionBank, questionId })
              }
            />
          </Tooltip>
        )}
        {(isDeleted || isEdited) && (
          <Tooltip title="Recover Question">
            <LoadingButton
              sx={{ px: 1 }}
              size="sm"
              variant="plain"
              color="danger"
              onClick={() => resetQuestion({ questionBank, questionId })}
              children={<UndoIcon />}
            />
          </Tooltip>
        )}
      </Stack>
      <MarkdownClientCompressed sx={{ fontSize: "xs" }}>
        {current.preview}
      </MarkdownClientCompressed>
      <Typography
        sx={{
          mt: 1,
          fontSize: "xs",
          color: hasRelatedQsChanged ? "warning.plainColor" : undefined,
        }}
      >
        <b>Related Questions</b>
        <br />
        {current.relatedQs}
      </Typography>
      <Typography
        sx={{
          fontSize: "xs",
          color: hasLosChanged ? "warning.plainColor" : undefined,
        }}
      >
        <b>Learning Objectives</b>
        <br />
        {current.los}
      </Typography>
      <Typography
        sx={{
          fontSize: "xs",
          color: hasAnnexesChanged ? "warning.plainColor" : undefined,
        }}
      >
        <b>Annexes</b>
        <br />
        {current.annexes}
      </Typography>
    </ListItemContent>
  );
});

export const QuestionManager = container<Props, Params, Data>(
  ({ sx, component = "div", questionBank }) => {
    const [search, setSearch] = useState("");
    const utils = trpc.useUtils();
    const serverData = QuestionManager.useData({ questionBank });
    const addQuestionToEditor = useQuestionEditor((s) => s.addQuestion);
    const isQuestionInEditor = useQuestionEditor((s) => s.isQuestionInEditor);

    const items = useQuestionEditor((s) => {
      return Object.keys(s[questionBank].afterState).reverse();
    });

    const filterForm = useForm<Record<FilterKeys, string>>({
      defaultValues: filterFormDefaultValues,
      resolver: filterFormResolver,
    });

    const searchQuestions = useSearchQuestions(
      { q: search, questionBank, filters: filterForm.watch(), limit: 24 },
      { getNextPageParam: (l) => l.nextCursor, initialCursor: 0 },
    );

    const addQuestion = (questionId: QuestionId) => {
      addQuestionToEditor({ trpc: utils, questionBank, questionId });
    };

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
            renderListItemContent={(result) => {
              const questionId = result.id;
              const isEdited = isQuestionInEditor({ questionBank, questionId });

              return (
                <ListItemContent
                  sx={{
                    ...(isEdited && {
                      background: `repeating-linear-gradient(
                            45deg,
                            rgba(0, 0, 0, 0),
                            rgba(0, 0, 0, 0) 10px,
                            rgba(234, 154, 62, 0.3) 10px,
                            rgba(234, 154, 62, 0.3) 20px
                          )`,
                    }),
                  }}
                >
                  <Stack direction={"row"} gap={1} alignItems={"center"}>
                    <Typography level="h5" sx={{ fontSize: "sm", mr: "auto" }}>
                      {result.id}
                    </Typography>
                    {!isEdited && (
                      <Tooltip title={"Add Question, and related questions"}>
                        <LoadingButton
                          sx={{ px: 1 }}
                          size="sm"
                          variant="plain"
                          onClick={() => addQuestion(result.id)}
                          children={<AddInput />}
                        />
                      </Tooltip>
                    )}
                  </Stack>
                  <Typography sx={{ fontSize: "xs", fontWeight: 500 }}>
                    {result.relatedQuestions.map((q) => q.id).join(", ")}
                  </Typography>
                  <MarkdownClientCompressed sx={{ fontSize: "xs" }}>
                    {result.text}
                  </MarkdownClientCompressed>
                  <Divider sx={{ my: 1, mx: 2 }} />
                  <Typography sx={{ fontSize: "xs" }}>
                    <b>Related Questions</b>
                    <br />
                    {result.relatedQuestions.map((q) => q.id).join(", ") ||
                      "None"}
                  </Typography>
                  <Typography sx={{ fontSize: "xs" }}>
                    <b>Learning Objectives</b>
                    <br />
                    {result.learningObjectives.map((q) => q.id).join(", ") ||
                      "None"}
                  </Typography>
                </ListItemContent>
              );
            }}
          />
        </Stack>
        <VerticalDivider />
        <Stack height="100%" flex={1}>
          <SearchList
            forceMode="mobile"
            sx={{ flex: 1, overflow: "hidden" }}
            items={items.map((id) => ({ id, questionBank, questionId: id }))}
            noDataMessage={"No changes so far!"}
            renderThead={() => null}
            renderTableRow={() => null}
            renderListItemContent={ListItem}
          />
        </Stack>
      </Stack>
    );
  },
);

QuestionManager.displayName = "QuestionManager";

QuestionManager.getData = async ({ helper, params }) => {
  const router = helper.containers.questions;
  const questionBank = getRequiredParam(params, "questionBank");
  return await router.getQuestionManager.fetch({ questionBank });
};

QuestionManager.useData = (params: Params) => {
  const router = trpc.containers.questions;
  const questionBank = getRequiredParam(params, "questionBank");
  return router.getQuestionManager.useSuspenseQuery({ questionBank })[0];
};
