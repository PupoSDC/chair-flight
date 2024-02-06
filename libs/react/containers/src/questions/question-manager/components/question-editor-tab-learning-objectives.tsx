import { useFormContext } from "react-hook-form";
import { Box, textareaClasses } from "@mui/joy";
import {
  HookFormTextArea,
  MarkdownClientCompressed,
} from "@chair-flight/react/components";
import { VerticalDivider } from "./vertical-divider";
import type { QuestionEditorState } from "../hooks/use-question-editor";
import type { FunctionComponent } from "react";

export type QuestionEditorTabLearningObjectivesProps = {
  questionId: string;
};

export const QuestionEditorTabLearningObjectives: FunctionComponent<
  QuestionEditorTabLearningObjectivesProps
> = ({ questionId }) => {
  const form = useFormContext<QuestionEditorState>();

  return (
    <>
      <Box sx={{ flex: 1 }}></Box>
      <VerticalDivider />
      <Box sx={{ flex: 1 }}></Box>
    </>
  );
};
