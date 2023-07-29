import { forwardRef } from "react";
import { Box, Sheet, Typography, CircularProgress } from "@mui/joy";
import { DateTime } from "luxon";
import { getClockTime } from "../utils/get-clock-time";
import type { SheetProps } from "@mui/joy";

export type TestPreviewProps = {
  status?: "finished" | "started" | "created";
  title?: string;
  score?: number;
  epochTimeInMs?: number;
  timeLeftInMs?: number;
  timeToCompleteInMs?: number;
  numberOfQuestions?: number;

  /**
   * this component is used as a link but the component override is not
   * working. This prop has no effect unless you pass `component={Link}`
   */
  href?: string;
} & Pick<SheetProps, "component" | "sx" | "className" | "style">;

export const TestPreview = forwardRef<HTMLDivElement, TestPreviewProps>(
  (
    {
      title,
      status = "finished",
      score = 0,
      epochTimeInMs,
      timeLeftInMs,
      timeToCompleteInMs,
      numberOfQuestions,
      ...props
    },
    ref,
  ) => {
    const color = ((): "warning" | "success" | "danger" | "primary" => {
      if (status === "created") return "primary";
      if (status === "started") return "warning";
      if (score >= 75) return "success";
      return "danger";
    })();

    const boundedScore = Math.round(Math.min(100, Math.max(0, score)));

    return (
      <Sheet
        ref={ref}
        color={color}
        {...props}
        sx={{
          p: { xs: 1, sm: 2 },
          display: "flex",
          alignItems: "center",
          "& span.MuiTypography-root": {
            display: "block",
          },
          "&.MuiLink-root:hover": {
            backgroundColor: `${color}.softHoverBg`,
          },
          ...props.sx,
        }}
      >
        <Box>
          {status === "finished" && (
            <CircularProgress
              determinate
              size="lg"
              color={color}
              value={boundedScore}
              children={`${Math.round(score)}%`}
            />
          )}
          {status === "started" && (
            <CircularProgress
              determinate
              value={75}
              size="lg"
              color={color}
              children={`??%`}
            />
          )}
        </Box>
        <Box sx={{ pl: 2 }}>
          {title && (
            <Typography level="h5" sx={{ lineHeight: 1 }}>
              {title}
            </Typography>
          )}
          {status === "finished" && timeToCompleteInMs && (
            <Typography level="body2">
              {`Completed in ${getClockTime(
                timeToCompleteInMs / 1000,
              )} minutes`}
            </Typography>
          )}
          {status !== "finished" && timeLeftInMs && (
            <Typography level="body2">
              {`Time Left: ${getClockTime(timeLeftInMs / 1000)} minutes`}
            </Typography>
          )}
          <Typography level="body3">
            {[
              epochTimeInMs &&
                DateTime.fromMillis(epochTimeInMs).toFormat("DDD"),
              numberOfQuestions && `${numberOfQuestions} Questions`,
            ]
              .filter(Boolean)
              .join(" | ")}
          </Typography>
        </Box>
      </Sheet>
    );
  },
);

TestPreview.displayName = "TestPreview";
