import { forwardRef } from "react";
import { default as ArrowBackIcon } from "@mui/icons-material/ArrowBack";
import { default as ArrowForwardIcon } from "@mui/icons-material/ArrowForward";
import {
  Box,
  Sheet,
  Button,
  LinearProgress,
  Typography,
  styled,
} from "@mui/joy";
import { getClockTime } from "../utils/get-clock-time";
import type { SheetProps } from "@mui/joy";

const HeaderBox = styled(Box)``;
HeaderBox.defaultProps = {
  flex: 1,
  justifyContent: "center",
  display: "flex",
};

export type QuestionBoxExamProps = {
  /**
   * Should be an instance of `QuestionMultiple` or other question formats.
   */
  question?: JSX.Element;
  title?: string;
  timeSpentInMs?: number;
  timeTotalInMs?: number;
  questionIndex?: number;
  totalQuestions?: number;
  onNavigationClick?: (nextPage: number) => void;
} & Pick<SheetProps, "sx" | "className" | "style" | "variant" | "component">;

/**
 * Very minimalistic wrapper designed to be used during exams.
 */
export const QuestionBoxExam = forwardRef<HTMLDivElement, QuestionBoxExamProps>(
  (
    {
      question,
      title,
      variant = "outlined",
      timeTotalInMs = 1,
      timeSpentInMs: timeElapsedInMs = 0,
      questionIndex = 0,
      totalQuestions = 0,
      onNavigationClick,
      ...props
    },
    ref,
  ) => {
    const timeLeft = Math.max(timeTotalInMs - timeElapsedInMs, 0);
    const rawPercentage = (timeElapsedInMs / timeTotalInMs) * 100;
    const percentage = Math.max(Math.min(100, rawPercentage), 0);
    const timeClock = getClockTime(timeLeft / 1000);

    return (
      <Sheet
        ref={ref}
        component="section"
        variant={variant}
        sx={{
          display: "flex",
          flexDirection: "column",
          ...props.sx,
        }}
        {...props}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 1,
          }}
        >
          <Button
            variant="plain"
            size="sm"
            disabled={questionIndex <= 0}
            children={<ArrowBackIcon />}
            onClick={() => onNavigationClick?.(questionIndex - 1)}
          />
          <HeaderBox>
            <Typography level="body-sm">{title}</Typography>
          </HeaderBox>
          <HeaderBox>
            <Typography>{timeClock}</Typography>
          </HeaderBox>
          <HeaderBox sx={{ display: { xs: "none", sm: "flex" } }} />
          <Button
            variant="plain"
            size="sm"
            disabled={questionIndex >= totalQuestions - 1}
            children={<ArrowForwardIcon />}
            onClick={() => onNavigationClick?.(questionIndex + 1)}
          />
        </Box>
        <LinearProgress
          determinate
          value={percentage}
          sx={{
            "--LinearProgress-radius": 0,
            width: "100%",
            flex: 0,
          }}
        />
        <Box
          children={question}
          sx={{
            px: { xs: 1, sm: 2 },
            pr: { xs: "18px", sm: 2 },
            mr: { xs: "-8px", sm: 0 },
            overflowY: "auto",
            flex: 1,
            pb: 2,
          }}
        />
      </Sheet>
    );
  },
);

QuestionBoxExam.displayName = "QuestionBoxExam";
