import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { default as EditIcon } from "@mui/icons-material/EditOutlined";
import { default as UndoIcon } from "@mui/icons-material/UndoOutlined";
import {
  Box,
  Button,
  ListItemContent,
  Modal,
  Stack,
  Tooltip,
  Typography,
} from "@mui/joy";
import { getQuestionPreview } from "@chair-flight/core/question-bank";
import { MarkdownClientCompressed } from "@chair-flight/react/components";
import { QuestionEditorDialog } from "./question-editor-dialog";
import type { QuestionEditorState } from "../hooks/use-question-editor";
import type { QuestionTemplate } from "@chair-flight/core/question-bank";
import type { FunctionComponent } from "react";

export const QuestionManagerChangesListItem: FunctionComponent<
  QuestionTemplate
> = (result) => {
  const form = useFormContext<QuestionEditorState>();
  const [isEditing, setIsEditing] = useState(false);

  const isDeleted = !!useWatch({
    control: form.control,
    name: `deletedQuestions.${result.id}`,
  });

  const isEdited = !!useWatch({
    control: form.control,
    name: `editedQuestions.${result.id}`,
  });

  const onQuestionUndo = async () => {
    form.setValue(`deletedQuestions.${result.id}`, null);
    form.setValue(`editedQuestions.${result.id}`, null);
  };

  const onQuestionEdit = async () => {
    setIsEditing(true);
  };

  return (
    <ListItemContent
      sx={{
        ...(isDeleted && {
          textDecoration: "line-through",
        }),
      }}
    >
      <Stack direction="row" justifyContent={"space-between"}>
        <Stack>
          <Typography sx={{ pr: 1 }}>{result.id}</Typography>
        </Stack>
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems={"center"}
          gap={1}
        >
          {isEdited && (
            <Tooltip title="Edit">
              <Button
                sx={{ px: 1 }}
                size="sm"
                variant="plain"
                onClick={onQuestionEdit}
                children={<EditIcon />}
              />
            </Tooltip>
          )}
          <Tooltip title="Recover Question">
            <Button
              sx={{ px: 1 }}
              size="sm"
              variant="plain"
              color="success"
              onClick={onQuestionUndo}
              children={<UndoIcon />}
            />
          </Tooltip>
        </Stack>
      </Stack>

      <Box sx={{ mt: 2, fontSize: "12px" }}>
        <MarkdownClientCompressed>
          {getQuestionPreview(result)}
        </MarkdownClientCompressed>
      </Box>

      <Modal open={isEditing} onClose={() => setIsEditing(false)}>
        <QuestionEditorDialog questionId={result.id} />
      </Modal>
    </ListItemContent>
  );
};
