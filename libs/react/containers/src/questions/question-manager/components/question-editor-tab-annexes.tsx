import { useFormContext } from "react-hook-form";
import { Box } from "@mui/joy";
import { VerticalDivider } from "./vertical-divider";
import type { QuestionEditorState } from "../hooks/use-question-editor";
import type { FunctionComponent } from "react";

export type QuestionEditorTabAnnexesProps = {
  questionId: string;
};

export const QuestionEditorTabAnnexes: FunctionComponent<
  QuestionEditorTabAnnexesProps
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
