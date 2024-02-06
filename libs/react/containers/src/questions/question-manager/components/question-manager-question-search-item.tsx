import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { default as DeleteIcon } from "@mui/icons-material/DeleteOutlineOutlined";
import { default as EditIcon } from "@mui/icons-material/EditOutlined";
import {
  Box,
  Button,
  Link,
  ListItemContent,
  Stack,
  Tooltip,
  Typography,
} from "@mui/joy";
import { MarkdownClientCompressed } from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import type { QuestionEditorState } from "../../hooks/use-question-editor";
import type { AppRouterOutput } from "@chair-flight/trpc/client";
import type { FunctionComponent } from "react";

type SearchRouter = AppRouterOutput["common"]["search"];
type SearchResult = SearchRouter["searchQuestions"]["items"][number];

export const QuestionManagerQuestionSearchItem: FunctionComponent<
  SearchResult
> = (result) => {
  const utils = trpc.useUtils();
  const form = useFormContext<QuestionEditorState>();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);

  const isDeleted = !!useWatch({
    control: form.control,
    name: `deletedQuestions.${result.id}`,
  });

  const isEdited = !!useWatch({
    control: form.control,
    name: `editedQuestions.${result.id}`,
  });

  const onQuestionEdit = async () => {
    try {
      setLoadingEdit(true);
      const { questionTemplate } =
        await utils.common.questions.getQuestionTemplate.fetch({
          questionBank: result.questionBank,
          questionId: result.id,
        });
      form.setValue(`editedQuestions.${result.id}`, questionTemplate);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingEdit(false);
    }
  };

  const onQuestionDelete = async () => {
    try {
      setLoadingDelete(true);
      const { questionTemplate } =
        await utils.common.questions.getQuestionTemplate.fetch({
          questionBank: result.questionBank,
          questionId: result.id,
        });
      form.setValue(`deletedQuestions.${result.id}`, questionTemplate);
      setLoadingDelete(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <ListItemContent
      sx={{
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
      <Stack direction="row" justifyContent={"space-between"}>
        <Stack>
          <Link href={result.href} sx={{ pr: 1 }}>
            {result.id}
          </Link>
          <Typography level="body-xs">
            {result.learningObjectives.map((lo) => lo.id).join(", ")}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems={"center"}
          gap={1}
        >
          {!isDeleted && !isEdited && (
            <Tooltip title="Edit">
              <Button
                sx={{ px: 1 }}
                size="sm"
                variant="plain"
                loading={loadingEdit}
                disabled={loadingDelete}
                onClick={onQuestionEdit}
                children={<EditIcon />}
              />
            </Tooltip>
          )}
          {!isDeleted && !isEdited && (
            <Tooltip title="Delete">
              <Button
                sx={{ px: 1 }}
                size="sm"
                variant="plain"
                color="danger"
                loading={loadingDelete}
                disabled={isEdited || loadingEdit}
                onClick={onQuestionDelete}
                children={<DeleteIcon />}
              />
            </Tooltip>
          )}
        </Stack>
      </Stack>

      <Box sx={{ mt: 2, fontSize: "12px" }}>
        <MarkdownClientCompressed>{result.text}</MarkdownClientCompressed>
      </Box>
    </ListItemContent>
  );
};
