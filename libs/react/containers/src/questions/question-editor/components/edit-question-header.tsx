import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { default as router } from "next/router";
import { NoSsr } from "@mui/base";
import { default as EditIcon } from "@mui/icons-material/Edit";
import { default as GitHubIcon } from "@mui/icons-material/GitHub";
import { default as RestartAltIcon } from "@mui/icons-material/RestartAlt";
import { default as UndoIcon } from "@mui/icons-material/Undo";
import {
  Badge,
  Box,
  Button,
  IconButton,
  Link,
  Stack,
  Tooltip,
  Typography,
} from "@mui/joy";
import { toast } from "@chair-flight/react/components";
import { useFormHistory } from "../../../hooks/use-form-history/use-form-history";
import type { EditQuestionFormValues } from "../types/edit-question-form-values";

export const EditQuestionHeader = () => {
  const form = useFormContext<EditQuestionFormValues>();
  const questionId = form.watch("question.id");
  const questionBank = form.watch("questionBank");
  const { undo, isUndoAvailable, historyLength } = useFormHistory(questionId);
  const [isValidated, setIsValidated] = useState(false);

  const validate = async () => {
    const isValid = await form.trigger("question");
    if (isValid) {
      toast({ content: "Validation successful! 🎉", color: "success" });
      setIsValidated(true);
    } else {
      toast({ content: "Validation failed! 😢", color: "danger" });
      setIsValidated(false);
    }
    return isValid;
  };

  const navigateToValidation = async () => {
    const isValid = await form.trigger("question");
    if (isValid) {
      setIsValidated(true);
      const query = { ...router.query, modal: "review" };
      router.replace({ query }, undefined, { shallow: true });
    } else {
      toast({ content: "Validation failed! 😢", color: "danger" });
    }
  };

  return (
    <Stack
      sx={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "background.surface",
        height: (t) => t.spacing(6),
        boxSizing: "content-box",
        borderBottom: "1px solid",
        borderColor: "divider",
        px: 2,
      }}
    >
      <EditIcon sx={{ mx: 1 }} fontSize="xl2" />
      <Typography level="h4" sx={{ fontWeight: 400 }}>
        Editing Question&nbsp;
        <Link href={`/modules/${questionBank}/questions/${questionId}`}>
          {questionId}
        </Link>
      </Typography>
      <Box sx={{ flexGrow: 1 }} />
      <NoSsr>
        <Tooltip title="undo" variant="soft">
          <IconButton
            sx={{ ml: 1 }}
            disabled={!isUndoAvailable}
            color={"primary"}
            variant="plain"
            onClick={() => undo()}
          >
            <Badge
              badgeContent={historyLength - 1}
              size="sm"
              variant="soft"
              max={99}
            >
              <UndoIcon />
            </Badge>
          </IconButton>
        </Tooltip>
        <Tooltip title="re-validate" variant="soft">
          <IconButton
            sx={{ ml: 1 }}
            color={"primary"}
            variant="plain"
            onClick={() => validate()}
            children={<RestartAltIcon />}
          />
        </Tooltip>
        <Tooltip
          title={
            isValidated ? "Create a Pull Request" : "Validate and Create a PR"
          }
          variant="soft"
        >
          <Button
            sx={{ ml: 1 }}
            color={isValidated ? "success" : "neutral"}
            onClick={() => navigateToValidation()}
            endDecorator={<GitHubIcon />}
            children={"Create a Pull Request"}
          />
        </Tooltip>
      </NoSsr>
    </Stack>
  );
};
