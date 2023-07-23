import { forwardRef } from "react";
import { default as CheckIcon } from "@mui/icons-material/Check";
import { default as CrossIcon } from "@mui/icons-material/Close";
import { Box, Sheet, Typography } from "@mui/joy";
import { MarkdownClient } from "../markdown-client";
import type { SheetProps } from "@mui/joy";

export type TestQuestionResultProps = {
  title?: string;
  correct?: boolean;
  question?: string;
  questionTemplateId?: string;
  questionVariantId?: string;
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
      questionVariantId,
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
        <Typography level="body2" fontWeight={900}>
          {`${questionTemplateId} (${questionVariantId})`}
        </Typography>
        <Typography level="body2">
          <MarkdownClient>{question ?? ""}</MarkdownClient>
        </Typography>
        <Box sx={{ display: "flex", pt: 1 }}>
          <Box sx={{ height: 18, width: 18, bgcolor: "success.solidBg" }}>
            {correct && (
              <CheckIcon fontSize={"lg"} sx={{ color: "success.solidColor" }} />
            )}
          </Box>
          <Typography level="body2" sx={{ ml: 1 }}>
            {correctOption}
          </Typography>
        </Box>
        {!correct && (
          <Box sx={{ display: "flex" }}>
            <Box sx={{ height: 18, width: 18, bgcolor: "danger.solidBg" }}>
              <CrossIcon fontSize={"lg"} sx={{ color: "danger.solidColor" }} />
            </Box>
            <Typography level="body2" sx={{ ml: 1 }}>
              {selectedOption ?? "No option selected"}
            </Typography>
          </Box>
        )}
      </Sheet>
    );
  },
);
