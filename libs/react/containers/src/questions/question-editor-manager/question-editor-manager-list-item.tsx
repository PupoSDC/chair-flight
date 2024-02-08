import { memo } from "react";
import { default as DeleteIcon } from "@mui/icons-material/DeleteOutlineOutlined";
import { default as EditIcon } from "@mui/icons-material/EditOutlined";
import { default as AddInput } from "@mui/icons-material/InputOutlined";
import { default as UnlinkIcon } from "@mui/icons-material/LinkOff";
import { default as UndoIcon } from "@mui/icons-material/Undo";
import {
  Button,
  Link,
  ListItemContent,
  Stack,
  Tooltip,
  Typography,
} from "@mui/joy";
import { type QuestionBankName } from "@chair-flight/core/question-bank";
import {
  LoadingButton,
  MarkdownClientCompressed,
} from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { useQuestionEditor } from "../hooks/use-question-editor";
import type { QuestionId } from "@chair-flight/core/question-bank";

export const QuestionManagerEditorListItem = memo<{
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
    hasPreviewChanged,
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
      <MarkdownClientCompressed
        sx={{
          fontSize: "xs",
          color: hasPreviewChanged ? "warning.plainColor" : undefined,
        }}
      >
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
