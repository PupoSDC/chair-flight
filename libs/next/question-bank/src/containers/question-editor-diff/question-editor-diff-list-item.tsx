import { memo } from "react";
import { Divider, ListItemContent, Stack, Typography } from "@mui/joy";
import { type QuestionBankName } from "@cf/core/question-bank";
import { MarkdownFromServer } from "../../components/markdown-from-server";
import { VerticalDivider } from "../../components/vertical-divider";
import { useQuestionEditor } from "../../hooks/use-question-editor";
import type { QuestionTemplateId } from "@cf/core/question-bank";

export const QuestionEditorDiffListItem = memo<{
  questionId: QuestionTemplateId;
  questionBank: QuestionBankName;
}>(({ questionId, questionBank }) => {
  const {
    isDeleted,
    initial,
    current,
    hasRelatedQsChanged,
    hasLosChanged,
    hasAnnexesChanged,
    hasPreviewChanged,
  } = useQuestionEditor((s) => s.getDiffStatus({ questionBank, questionId }));

  return (
    <ListItemContent sx={{ display: "flex" }}>
      <Stack flex={1}>
        <Typography level="h5" sx={{ fontSize: "sm" }}>
          {questionId}
        </Typography>
        <MarkdownFromServer compressed>{initial.preview}</MarkdownFromServer>
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
        <MarkdownFromServer
          compressed
          sx={{
            fontSize: "xs",
            color: hasPreviewChanged ? "warning.plainColor" : undefined,
          }}
        >
          {current.preview}
        </MarkdownFromServer>
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
    </ListItemContent>
  );
});
