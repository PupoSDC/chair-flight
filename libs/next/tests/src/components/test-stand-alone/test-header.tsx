"use client";

import { NoSsr } from "@mui/base";
import { default as AccessAlarmsOutlinedIcon } from "@mui/icons-material/AccessAlarmsOutlined";
import { default as AppsOutlinedIcon } from "@mui/icons-material/AppsOutlined";
import { default as ChevronLeftIcon } from "@mui/icons-material/ChevronLeft";
import { default as ChevronRightIcon } from "@mui/icons-material/ChevronRight";
import { default as CloseOutlinedIcon } from "@mui/icons-material/CloseOutlined";
import { default as FormatListBulletedOutlinedIcon } from "@mui/icons-material/FormatListBulletedOutlined";
import {
  Box,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
  iconButtonClasses,
} from "@mui/joy";
import { Duration } from "luxon";
import { BugReportButton, ThemeButton } from "@cf/next/ui";
import { useTestProgress } from "../../hooks/use-test-progress";
import type { QuestionTemplateId } from "@cf/core/question-bank";
import type { TestId } from "@cf/core/tests";
import type { FunctionComponent } from "react";

type TestHeaderProps = {
  testId: TestId;
  onMetaClicked?: (args: { templateId: QuestionTemplateId }) => void;
  onQuestionsClicked?: () => void;
  onFinishClicked?: () => void;
};

const TestHeaderComponent: FunctionComponent<TestHeaderProps> = ({
  testId,
  onMetaClicked,
  onQuestionsClicked,
  onFinishClicked,
}) => {
  const test = useTestProgress((s) => s.getTest({ testId }));
  const goToPreviousQuestion = useTestProgress((s) => s.goToPreviousQuestion);
  const goToNextQuestion = useTestProgress((s) => s.goToNextQuestion);
  const currentQuestion = test.currentQuestionIndex + 1;
  const totalQuestions = test.questions.length;
  const timeLeft = test.durationInMs - test.timeSpentInMs;
  const mode = test.mode;
  const timerMode = mode === "exam" ? "timeLeft" : "timeSpent";
  const time = timerMode === "timeSpent" ? test.timeSpentInMs : timeLeft;
  const question = test.questions[test.currentQuestionIndex];
  const templateId = question.templateId;

  return (
    <>
      <Stack
        component="header"
        sx={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: { xs: "space-around", sm: "center" },
          backgroundColor: "background.surface",
          borderBottom: "1px solid",
          borderColor: "divider",
          position: "fixed",
          right: 0,
          width: "100%",
          boxSizing: "content-box",
          height: (t) => t.spacing(6),

          h4: {
            fontSize: { xs: "0.8rem", md: "1rem" },
            textAlign: "center",
          },

          [`& .${iconButtonClasses.root}`]: {
            p: 0,
            fontSize: { xs: "20px", md: "24px" },
            minWidth: { xs: "24px", md: "32px" },
            minHeight: { xs: "24px", md: "32px" },

            "& svg": {
              fontSize: "inherit",
            },
          },
        }}
      >
        <Tooltip title="Previous Question" variant="soft">
          <IconButton
            disabled={test.currentQuestionIndex === 0}
            children={<ChevronLeftIcon />}
            onClick={() => goToPreviousQuestion({ testId: test.id })}
          />
        </Tooltip>
        <Divider
          orientation="vertical"
          sx={{
            mx: { xs: 0.5, sm: 2 },
            display: { xs: "none", md: "block" },
          }}
        />
        <Typography level="h4" sx={{ display: { xs: "none", md: "block" } }}>
          {test.title}
        </Typography>
        <Divider orientation="vertical" sx={{ mx: { xs: 0.5, sm: 2 } }} />
        <Typography level="h4" sx={{ display: "flex" }}>
          <Box component="span" sx={{ display: { xs: "none", sm: "initial" } }}>
            Question&nbsp;
          </Box>
          <Box component="span">{`${currentQuestion}/${totalQuestions}`}</Box>
        </Typography>
        <Divider orientation="vertical" sx={{ mx: { xs: 0.5, sm: 2 } }} />
        <AccessAlarmsOutlinedIcon sx={{ fontSize: 20, mr: 0 }} />
        <Typography level="h4" sx={{ minWidth: "4.8em" }}>
          {Duration.fromMillis(time).toFormat("hh:mm:ss")}
        </Typography>
        <Divider orientation="vertical" sx={{ mx: { xs: 0.5, sm: 2 } }} />
        <BugReportButton />
        {mode === "study" && (
          <Tooltip title="Explanation & Meta" variant="soft">
            <IconButton
              children={<FormatListBulletedOutlinedIcon />}
              onClick={() => onMetaClicked?.({ templateId })}
            />
          </Tooltip>
        )}

        <Tooltip title="Question Navigation" variant="soft">
          <IconButton
            children={<AppsOutlinedIcon />}
            onClick={() => onQuestionsClicked?.()}
          />
        </Tooltip>

        <Tooltip title="Finish Test" variant="soft">
          <IconButton
            children={<CloseOutlinedIcon />}
            onClick={() => onFinishClicked?.()}
          />
        </Tooltip>

        <ThemeButton />
        <Divider orientation="vertical" sx={{ mx: { xs: 0.5, sm: 2 } }} />
        <Tooltip title="Next Question" variant="soft">
          <IconButton
            disabled={test.currentQuestionIndex === test.questions.length - 1}
            children={<ChevronRightIcon />}
            onClick={() => goToNextQuestion({ testId: test.id })}
          />
        </Tooltip>
      </Stack>
      <Box sx={{ height: (t) => t.spacing(6) }} />
    </>
  );
};

const TestHeaderFallback: FunctionComponent<TestHeaderProps> = () => (
  <Skeleton
    variant="rectangular"
    sx={{
      width: "100%",
      boxSizing: "content-box",
      height: (t) => t.spacing(6),
      mb: 2,
    }}
  />
);

export const TestHeader: FunctionComponent<TestHeaderProps> = (props) => (
  <NoSsr
    fallback={<TestHeaderFallback {...props} />}
    children={<TestHeaderComponent {...props} />}
  />
);
