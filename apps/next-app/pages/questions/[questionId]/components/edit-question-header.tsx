import { useFormContext } from "react-hook-form";
import { default as router } from "next/router";
import { NoSsr } from "@mui/base";
import { default as EditIcon } from "@mui/icons-material/Edit";
import { default as GitHubIcon } from "@mui/icons-material/GitHub";
import { default as RestartAltIcon } from "@mui/icons-material/RestartAlt";
import { default as UndoIcon } from "@mui/icons-material/Undo";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/joy";
import { AppLayout, toast } from "@chair-flight/react/components";
import { useFormHistory } from "@chair-flight/react/containers";
import type { QuestionTemplate } from "@chair-flight/base/types";

export const EditQuestionHeader = () => {
  const form = useFormContext<QuestionTemplate>();
  const questionId = form.watch("id");
  const { undo, isUndoAvailable } = useFormHistory(questionId);

  const validate = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      toast.success("Validation successful! 🎉");
    } else {
      toast.error("Validation failed! 😢");
    }
  };

  const navigateToValidation = () => {
    router.push(`/questions/${questionId}/edit?modal=review`, undefined, {
      shallow: true,
    });
  };

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
              children={<UndoIcon />}
            />
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
            color={form.formState.isValid ? "success" : "neutral"}
            disabled={!form.formState.isValid}
            onClick={() => navigateToValidation()}
            endDecorator={<GitHubIcon />}
            children={"Create a Pull Request"}
          />
        </NoSsr>
      </Box>
    </AppLayout.Header>
  );
};
