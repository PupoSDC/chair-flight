import { useFormContext } from "react-hook-form";
import { Box, Sheet, textareaClasses } from "@mui/joy";
import {
  HookFormTextArea,
  MarkdownClientCompressed,
  Ups,
} from "@chair-flight/react/components";
import { VerticalDivider } from "./vertical-divider";
import type { QuestionEditorState } from "../hooks/use-question-editor";
import type { FunctionComponent } from "react";

export type QuestionEditorTabExplanationProps = {
  questionId: string;
};

export const QuestionEditorTabExplanation: FunctionComponent<
  QuestionEditorTabExplanationProps
> = ({ questionId }) => {
  const form = useFormContext<QuestionEditorState>();
  const explanation = form.watch(`editedQuestions.${questionId}.explanation`);

  return (
    <>
      <HookFormTextArea
        {...form.register(`editedQuestions.${questionId}.explanation`)}
        sx={{
          flex: 1,
          height: "100%",
          [`& .${textareaClasses.root}`]: { height: "100%" },
        }}
      />
      <VerticalDivider />
      <Sheet sx={{ flex: 1, p: 1 }}>
        {explanation ? (
          <MarkdownClientCompressed>{explanation}</MarkdownClientCompressed>
        ) : (
          <Ups message="No explanation provided" />
        )}
      </Sheet>
    </>
  );
};
