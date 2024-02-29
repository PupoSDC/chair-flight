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
import {
  BugReportButton,
  ThemeButton,
  useBugReportDebugData,
} from "@cf/next-old/user";
import { container } from "@cf/trpc/client";
import { useTestProgress } from "../../hooks/use-test-progress";
import { useTestHotkeys } from "../../hooks/use-test-progress-hotkeys";
import { useTestProgressTime } from "../../hooks/use-test-progress-time";
import type { TestId } from "@cf/core/tests";

type Props = {
  noSsr: true;
  testId: TestId;
  timerMode: "timeSpent" | "timeLeft";
  onMetaClicked?: () => void;
  onQuestionsClicked?: () => void;
  onFinishClicked?: () => void;
};

export const TestHeader = container<Props>(
  ({
    testId,
    timerMode,
    onMetaClicked,
    onQuestionsClicked,
    onFinishClicked,
  }) => {
    const test = useTestProgress((state) => state.tests[testId]);
    const goToPreviousQuestion = useTestProgress((s) => s.goToPreviousQuestion);
    const goToNextQuestion = useTestProgress((s) => s.goToNextQuestion);
    const currentQuestion = test.currentQuestionIndex + 1;
    const totalQuestions = test.questions.length;
    const timeLeft = test.durationInMs - test.timeSpentInMs;
    const time = timerMode === "timeSpent" ? test.timeSpentInMs : timeLeft;
    const question = test.questions[test.currentQuestionIndex];

    useBugReportDebugData("test-current-question", () => question);
    useBugReportDebugData("test", () => test);
    useTestHotkeys({ testId });
    useTestProgressTime({ testId });

    return (
      <>
        <Stack
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
            <Box
              component="span"
              sx={{ display: { xs: "none", sm: "initial" } }}
            >
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
          {onMetaClicked && (
            <Tooltip title="Explanation & Meta" variant="soft">
              <IconButton
                children={<FormatListBulletedOutlinedIcon />}
                onClick={() => onMetaClicked()}
              />
            </Tooltip>
          )}
          {onQuestionsClicked && (
            <Tooltip title="Question Navigation" variant="soft">
              <IconButton
                children={<AppsOutlinedIcon />}
                onClick={() => onQuestionsClicked()}
              />
            </Tooltip>
          )}
          {onFinishClicked && (
            <Tooltip title="Finish Test" variant="soft">
              <IconButton
                children={<CloseOutlinedIcon />}
                onClick={() => onFinishClicked()}
              />
            </Tooltip>
          )}
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
  },
);

TestHeader.displayName = "TestHeader";
TestHeader.getData = async () => ({});
TestHeader.useData = () => ({});

TestHeader.ErrorFallback = () => null;

TestHeader.LoadingFallback = () => (
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
