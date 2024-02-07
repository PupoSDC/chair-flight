import { memo } from "react";
import { default as DeleteIcon } from "@mui/icons-material/DeleteOutlineOutlined";
import { default as EditIcon } from "@mui/icons-material/EditOutlined";
import { default as UndoIcon } from "@mui/icons-material/Undo";
import { Divider, ListItemContent, Stack, Tooltip, Typography } from "@mui/joy";
import {
  getQuestionPreview,
  type QuestionBankName,
} from "@chair-flight/core/question-bank";
import {
  LoadingButton,
  MarkdownClientCompressed,
  SearchList,
} from "@chair-flight/react/components";
import { type AppRouterOutput } from "@chair-flight/trpc/client";
import { container } from "../../wraper/container";
import { VerticalDivider } from "../components/vertical-divider";
import { useQuestionEditor } from "../hooks/use-question-editor";
import type { QuestionId } from "@chair-flight/core/question-bank";

type Props = {
  questionBank: QuestionBankName;
};

type Params = Props;

type Data =
  AppRouterOutput["containers"]["questions"]["getQuestionEditorDiffTool"];

const SearchListItem = memo<{
  questionId: QuestionId;
  questionBank: QuestionBankName;
}>(({ questionId, questionBank }) => {
  const {
    initialState,
    currentState,
    markQuestionAsDeleted,
    undoMarkQuestionAsDeleted,
  } = useQuestionEditor((s) => ({
    initialState: s[questionBank].beforeState[questionId],
    currentState: s[questionBank].afterState[questionId],
    markQuestionAsDeleted: s.markQuestionAsDeleted,
    undoMarkQuestionAsDeleted: s.undoMarkQuestionAsDeleted,
  }));

  const initial = {
    preview: getQuestionPreview(initialState.variant),
    los: initialState.learningObjectives.join(", "),
    annexes: initialState.annexes.join(", ") || "None",
    relatedQs: initialState.relatedQuestions.join(", "),
  };

  const current = currentState
    ? {
        preview: getQuestionPreview(currentState.variant),
        los: currentState.learningObjectives.join(", "),
        annexes: currentState.annexes.join(", ") || "None",
        relatedQs: currentState.relatedQuestions.join(", "),
      }
    : initial;

  const hasPreviewChanged = initial.preview !== current.preview;
  const hasLosChanged = initial.los !== current.los;
  const hasAnnexesChanged = initial.annexes !== current.annexes;
  const hasRelatedQsChanged = initial.relatedQs !== current.relatedQs;
  const isDeleted = currentState === null;
  const isEdited =
    hasPreviewChanged ||
    hasLosChanged ||
    hasAnnexesChanged ||
    hasRelatedQsChanged;

  return (
    <ListItemContent sx={{ display: "flex" }}>
      <Stack flex={1}>
        <Typography level="h5" sx={{ fontSize: "sm" }}>
          {questionId}
        </Typography>
        <MarkdownClientCompressed sx={{ fontSize: "xs" }}>
          {initial.preview}
        </MarkdownClientCompressed>
        <Divider sx={{ my: 1, mx: 2 }} />
        <Typography sx={{ fontSize: "xs" }}>
          <b>Related Questions</b>
          <br />
          {initial.relatedQs}
        </Typography>
        <Typography sx={{ fontSize: "xs" }}>
          <b>Learning Objectives</b>
          <br />
          {initial.los}
        </Typography>
        <Typography sx={{ fontSize: "xs" }}>
          <b>Annexes</b>
          <br />
          {initial.annexes}
        </Typography>
      </Stack>

      <VerticalDivider />

      <Stack
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
        <Typography level="h5" sx={{ fontSize: "sm" }}>
          {questionId}
        </Typography>
        <MarkdownClientCompressed sx={{ fontSize: "xs" }}>
          {current.preview}
        </MarkdownClientCompressed>
        <Divider sx={{ my: 1, mx: 2 }} />
        <Typography
          sx={{
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
      </Stack>
      {/** */}

      <Divider orientation="vertical" sx={{ mx: 1 }} />

      <Stack gap={1}>
        {isEdited && (
          <Tooltip title="Edit Question">
            <LoadingButton
              sx={{ px: 1 }}
              size="sm"
              variant="plain"
              color="success"
              children={<EditIcon />}
            />
          </Tooltip>
        )}
        {isDeleted ? (
          <Tooltip title="Recover Question">
            <LoadingButton
              sx={{ px: 1 }}
              size="sm"
              variant="plain"
              color="success"
              onClick={() =>
                undoMarkQuestionAsDeleted({ questionBank, questionId })
              }
              children={<UndoIcon />}
            />
          </Tooltip>
        ) : (
          <Tooltip title="Delete Question">
            <LoadingButton
              sx={{ px: 1 }}
              size="sm"
              variant="plain"
              color="danger"
              onClick={() =>
                markQuestionAsDeleted({ questionBank, questionId })
              }
              children={<DeleteIcon />}
            />
          </Tooltip>
        )}
      </Stack>
    </ListItemContent>
  );
});

export const QuestionEditorDiffTool = container<Props, Params, Data>(
  ({ sx, component = "div", questionBank }) => {
    const items = useQuestionEditor((s) => {
      return Object.keys(s[questionBank].afterState);
    });

    return (
      <Stack direction="column" component={component} sx={sx}>
        <SearchList
          forceMode="mobile"
          sx={{ flex: 1, overflow: "hidden" }}
          items={items.map((id) => ({ id, questionBank, questionId: id }))}
          noDataMessage={"No changes so far!"}
          renderThead={() => null}
          renderTableRow={() => null}
          renderListItemContent={SearchListItem}
        />
      </Stack>
    );
  },
);

QuestionEditorDiffTool.displayName = "QuestionEditorDiffTool";

QuestionEditorDiffTool.getData = async () => ({});

QuestionEditorDiffTool.useData = () => ({});
