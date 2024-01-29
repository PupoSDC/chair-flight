import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { default as router } from "next/router";
import { NoSsr } from "@mui/base";
import { default as GitHubIcon } from "@mui/icons-material/GitHub";
import { default as RestartAltIcon } from "@mui/icons-material/RestartAlt";
import { default as UndoIcon } from "@mui/icons-material/Undo";
import { Badge, Button, IconButton, Stack, Tooltip } from "@mui/joy";
import { toast } from "@chair-flight/react/components";
import { useFormHistory } from "../../../hooks/use-form-history/use-form-history";
import type { EditQuestionFormValues } from "../types/edit-question-form-values";

export const EditQuestionHeader = () => {
  const form = useFormContext<EditQuestionFormValues>();
  const questionId = form.watch("question.id");
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
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: "background.surface",
        height: (t) => `calc(${t.spacing(5)} + 1px)`,
        boxSizing: "content-box",
        borderBottom: "1px solid",
        borderColor: "divider",
        px: 2,
      }}
    >
      <NoSsr>
        <Tooltip title="undo" variant="soft">
          <IconButton
            size="sm"
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
              sx={{ zIndex: 1000 }}
            >
              <UndoIcon />
            </Badge>
          </IconButton>
        </Tooltip>
        <Tooltip title="re-validate" variant="soft">
          <IconButton
            size="sm"
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
            size="sm"
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
