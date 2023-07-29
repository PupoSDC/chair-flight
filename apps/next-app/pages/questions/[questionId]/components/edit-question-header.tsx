import { useState } from "react";
import { set, useFormContext } from "react-hook-form";
import { default as router } from "next/router";
import { NoSsr } from "@mui/base";
import { default as EditIcon } from "@mui/icons-material/Edit";
import { default as GitHubIcon } from "@mui/icons-material/GitHub";
import { default as RestartAltIcon } from "@mui/icons-material/RestartAlt";
import { default as UndoIcon } from "@mui/icons-material/Undo";
import { Badge, Box, Button, IconButton, Tooltip, Typography } from "@mui/joy";
import { AppLayout, toast } from "@chair-flight/react/components";
import { useFormHistory } from "@chair-flight/react/containers";
import type { EditQuestionFormValues } from "../types/edit-question-form-values";

export const EditQuestionHeader = () => {
  const form = useFormContext<EditQuestionFormValues>();
  const questionId = form.watch("question.id");
  const { undo, isUndoAvailable, historyLength } = useFormHistory(questionId);
  const [isValidated, setIsValidated] = useState(false);

  const validate = async () => {
    const isValid = await form.trigger("question");
    if (isValid) {
      toast.success("Validation successful! 🎉");
      setIsValidated(true);
    } else {
      toast.error("Validation failed! 😢");
      setIsValidated(false);
    }
    return isValid;
  };

  const navigateToValidation = async () => {
    const isValid = await form.trigger("question");
    if (isValid) {
      setIsValidated(true);
      set;
      router.push(`/questions/${questionId}/edit?modal=review`, undefined, {
        shallow: true,
      });
    } else {
      toast.error("Validation failed! 😢");
    }
  };

  //useEffect(() => {
  //  setIsValidated(false);
  //}, [form.formState.isDirty]);

  return (
    <AppLayout.Header>
      <Box sx={{ display: "flex", alignItems: "baseline" }}>
        <EditIcon sx={{ mx: 1 }} fontSize="xl2" />
        <Typography level="h4">{`Editing Question ${questionId}`}</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          "& button": { mr: 1 },
        }}
      >
        <NoSsr>
          <Tooltip title="undo" variant="soft">
            <IconButton
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
              color={"primary"}
              variant="plain"
              onClick={() => validate()}
              children={<RestartAltIcon />}
            />
          </Tooltip>
          <Button
            sx={{ ml: "auto" }}
            color={isValidated ? "success" : "neutral"}
            onClick={() => navigateToValidation()}
            endDecorator={<GitHubIcon />}
            children={"Create a Pull Request"}
          />
        </NoSsr>
      </Box>
    </AppLayout.Header>
  );
};
