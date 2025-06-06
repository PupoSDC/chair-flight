import { default as CheckIcon } from "@mui/icons-material/Check";
import { default as CrossIcon } from "@mui/icons-material/Close";
import { Box, Link, Sheet, Stack } from "@mui/joy";
import { MarkdownFromServer } from "@cf/next/question-bank";
import type { SheetProps } from "@mui/joy";
import type { FunctionComponent } from "react";

export type TestQuestionResultProps = {
  title?: string;
  correct?: boolean;
  question?: string;
  questionTemplateId?: string;
  questionHref?: string;
  correctOption?: string;
  selectedOption?: string;
  learningObjectives?: string[];
} & Pick<SheetProps, "component" | "sx" | "className" | "style" | "ref">;

export const TestQuestionResult: FunctionComponent<TestQuestionResultProps> = (
  {
    title,
    correct,
    question,
    questionHref,
    correctOption,
    selectedOption,
    questionTemplateId,
    learningObjectives,
    ...props
  },
  ref,
) => {
  return (
    <Sheet
      ref={ref}
      {...props}
      color={correct ? "success" : "danger"}
      sx={{
        p: 1,
        display: "flex",
        borderLeftWidth: "10px",
        flexDirection: "column",
        ...props.sx,
      }}
    >
      <Link level="body-sm" fontWeight={900} href={questionHref}>
        {questionTemplateId}
      </Link>
      <MarkdownFromServer compressed sx={{ fontSize: "sm" }}>
        {question ?? ""}
      </MarkdownFromServer>
      <Stack direction="row" sx={{ pt: 1, gap: 1, alignItems: "center" }}>
        <Box sx={{ height: 18, width: 18, bgcolor: "success.solidBg" }}>
          {correct && (
            <CheckIcon fontSize={"lg"} sx={{ color: "success.solidColor" }} />
          )}
        </Box>
        <Box sx={{ fontSize: "sm" }}>
          <MarkdownFromServer compressed>
            {correctOption ?? ""}
          </MarkdownFromServer>
        </Box>
      </Stack>
      {!correct && (
        <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
          <Box sx={{ height: 18, width: 18, bgcolor: "danger.solidBg" }}>
            <CrossIcon fontSize={"lg"} sx={{ color: "danger.solidColor" }} />
          </Box>
          <MarkdownFromServer compressed sx={{ fontSize: "sm" }}>
            {selectedOption ?? "No option selected"}
          </MarkdownFromServer>
        </Stack>
      )}
    </Sheet>
  );
};
