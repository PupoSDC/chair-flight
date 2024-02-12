import { forwardRef } from "react";
import { default as CheckIcon } from "@mui/icons-material/Check";
import { default as CrossIcon } from "@mui/icons-material/Close";
import { Box, Sheet, Stack, Typography } from "@mui/joy";
import {
  MarkdownClient,
  MarkdownClientCompressed,
} from "@chair-flight/react/components";
import type { SheetProps } from "@mui/joy";

export type TestQuestionResultProps = {
  title?: string;
  correct?: boolean;
  question?: string;
  questionTemplateId?: string;
  correctOption?: string;
  selectedOption?: string;
  learningObjectives?: string[];
} & Pick<SheetProps, "component" | "sx" | "className" | "style">;

export const TestQuestionResult = forwardRef<
  HTMLDivElement,
  TestQuestionResultProps
>(
  (
    {
      title,
      correct,
      question,
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
        <Typography level="body-sm" fontWeight={900}>
          {questionTemplateId}
        </Typography>
        <Box sx={{ fontSize: "sm" }}>
          <MarkdownClient>{question ?? ""}</MarkdownClient>
        </Box>
        <Stack direction="row" sx={{ pt: 1, gap: 1, alignItems: "center" }}>
          <Box sx={{ height: 18, width: 18, bgcolor: "success.solidBg" }}>
            {correct && (
              <CheckIcon fontSize={"lg"} sx={{ color: "success.solidColor" }} />
            )}
          </Box>
          <Box sx={{ fontSize: "sm" }}>
            <MarkdownClientCompressed>
              {correctOption ?? ""}
            </MarkdownClientCompressed>
          </Box>
        </Stack>
        {!correct && (
          <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
            <Box sx={{ height: 18, width: 18, bgcolor: "danger.solidBg" }}>
              <CrossIcon fontSize={"lg"} sx={{ color: "danger.solidColor" }} />
            </Box>
            <Box sx={{ fontSize: "sm" }}>
              {selectedOption ? (
                <MarkdownClientCompressed children={selectedOption} />
              ) : (
                <Typography children="No option selected" />
              )}
            </Box>
          </Stack>
        )}
      </Sheet>
    );
  },
);

TestQuestionResult.displayName = "TestQuestionResult";
