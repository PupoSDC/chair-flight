import { default as DeleteIcon } from "@mui/icons-material/DeleteOutlineOutlined";
import { default as PlayIcon } from "@mui/icons-material/PlayArrowOutlined";
import { default as EyeIcon } from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Link,
  ListItemContent,
  Stack,
  Tooltip,
  Typography,
} from "@mui/joy";
import { DateTime } from "luxon";
import { SearchList } from "@chair-flight/react/components";
import { container } from "../../wraper/container";
import { useTestProgress } from "../hooks/use-test-progress";
import type { QuestionBankName } from "@chair-flight/base/types";

type Props = {
  questionBank: QuestionBankName;
};

export const getClockTime = (timeInSeconds: number) => {
  const time = Math.round(timeInSeconds);
  return `${Math.floor(time / 60)}:${("0" + (time % 60)).slice(-2, 3)}`;
};

export const TestsOverview = container<Props>(
  ({ questionBank, sx, component = "section" }) => {
    const tests = useTestProgress((s) => s.tests);
    const deleteTest = useTestProgress((s) => s.deleteTest);
    const testsAsList = Object.values(tests)
      .sort((a, b) => b.createdAtEpochMs - a.createdAtEpochMs)
      .filter((test) => test.questionBank === questionBank);

    return (
      <Stack component={component} sx={sx}>
        <Stack sx={{ pb: { xs: 1, md: 2 } }}>
          <Button
            sx={{ ml: "auto" }}
            component={Link}
            href={`/modules/${questionBank}/tests/create`}
          >
            Create Test
          </Button>
        </Stack>
        <SearchList
          sx={{ flex: 1, overflow: "hidden" }}
          items={testsAsList}
          errorMessage={"Error loading tests"}
          noDataMessage={"No tests Found"}
          renderThead={() => (
            <thead>
              <tr>
                <th style={{ width: "4em" }}>Score</th>
                <th>Title</th>
                <th style={{ width: "12em" }}>Type</th>
                <th style={{ textAlign: "center", width: "8em" }}>
                  No. Questions
                </th>
                <th style={{ textAlign: "center", width: "8em" }}>Time Left</th>
                <th style={{ textAlign: "center", width: "8em" }}>
                  Time Spent
                </th>
                <th style={{ textAlign: "center", width: "12em" }}>
                  Start Date
                </th>
                <th style={{ width: "8em" }}></th>
              </tr>
            </thead>
          )}
          renderTableRow={(test) => {
            const correctAnswers = test.questions.reduce(
              (s, q) => s + (q.selectedOptionId === q.correctOptionId ? 1 : 0),
              0,
            );

            const score = (correctAnswers / test.questions.length) * 100;
            const boundedScore = Math.round(Math.min(100, Math.max(0, score)));

            const color = ((): "warning" | "success" | "danger" | "primary" => {
              if (test.status === "created") return "primary";
              if (test.status === "started") return "warning";
              if (score >= 75) return "success";
              return "danger";
            })();

            const timeLeft = (() => {
              if (test.status === "finished") return "-";
              if (test.mode === "study") return "-";
              const tLeft = test.durationInMs - test.timeSpentInMs;
              return getClockTime(tLeft / 1000);
            })();

            const timeSpent = getClockTime(test.timeSpentInMs / 1000);

            const timeStarted =
              test.startedAtEpochMs &&
              DateTime.fromMillis(test.startedAtEpochMs).toFormat("DDD");

            return (
              <Box key={test.id} component={"tr"}>
                <td>
                  {test.status === "finished" && (
                    <CircularProgress
                      determinate
                      size="md"
                      color={color}
                      value={boundedScore}
                      children={`${Math.round(score)}%`}
                    />
                  )}
                  {test.status === "started" && (
                    <CircularProgress
                      determinate
                      value={75}
                      size="md"
                      color={color}
                      children={`??%`}
                    />
                  )}
                </td>
                <Box
                  component="td"
                  sx={{ color: `${color}.500`, fontWeight: 700 }}
                >
                  {test.title}
                </Box>
                <td>{test.mode}</td>
                <Box component="td" sx={{ textAlign: "center" }}>
                  {test.questions.length}
                </Box>
                <Box component="td" sx={{ textAlign: "center" }}>
                  {timeLeft}
                </Box>
                <Box component="td" sx={{ textAlign: "center" }}>
                  {timeSpent}
                </Box>
                <Box component="td" sx={{ textAlign: "center" }}>
                  {timeStarted}
                </Box>
                <td>
                  {test.status === "finished" ? (
                    <Tooltip title="Review">
                      <IconButton
                        component={Link}
                        href={`/modules/${questionBank}/tests/${test.id}/review`}
                      >
                        <EyeIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Continue">
                      <IconButton
                        component={Link}
                        href={`/modules/${questionBank}/tests/${test.id}/${test.mode}`}
                      >
                        <PlayIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Delete Test" sx={{ ml: 1 }}>
                    <IconButton onClick={() => deleteTest({ testId: test.id })}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </td>
              </Box>
            );
          }}
          renderListItemContent={(test) => {
            const correctAnswers = test.questions.reduce(
              (s, q) => s + (q.selectedOptionId === q.correctOptionId ? 1 : 0),
              0,
            );

            const score = (correctAnswers / test.questions.length) * 100;
            const boundedScore = Math.round(Math.min(100, Math.max(0, score)));

            const color = ((): "warning" | "success" | "danger" | "primary" => {
              if (test.status === "created") return "primary";
              if (test.status === "started") return "warning";
              if (score >= 75) return "success";
              return "danger";
            })();

            const timeLeft = (() => {
              if (test.status === "finished") return "-";
              if (test.mode === "study") return "-";
              const tLeft = test.durationInMs - test.timeSpentInMs;
              return getClockTime(tLeft / 1000);
            })();

            const timeSpent = getClockTime(test.timeSpentInMs / 1000);

            const timeStarted =
              test.startedAtEpochMs &&
              DateTime.fromMillis(test.startedAtEpochMs).toFormat("DDD");

            return (
              <ListItemContent sx={{ display: "flex", alignItems: "center" }}>
                {test.status === "finished" && (
                  <CircularProgress
                    determinate
                    size="md"
                    color={color}
                    value={boundedScore}
                    children={`${Math.round(score)}%`}
                  />
                )}
                {test.status === "started" && (
                  <CircularProgress
                    determinate
                    value={75}
                    size="md"
                    color={color}
                    children={`??%`}
                  />
                )}
                <Box sx={{ pl: 2, flex: 1 }}>
                  {test.title && (
                    <Typography level="h5" sx={{ lineHeight: 1 }}>
                      {test.title}
                    </Typography>
                  )}
                  {test.status === "finished" && timeSpent && (
                    <Typography level="body-sm">
                      {`Completed in ${timeSpent} minutes`}
                    </Typography>
                  )}
                  {test.status !== "finished" && (
                    <Typography level="body-sm">
                      {`Time Left: ${timeLeft} minutes`}
                    </Typography>
                  )}
                  <Typography level="body-sm">
                    {[timeStarted, `${test.questions.length} Questions`]
                      .filter(Boolean)
                      .join(" | ")}
                  </Typography>
                </Box>
                <Stack gap={0.5}>
                  {test.status === "finished" ? (
                    <Tooltip title="Review">
                      <IconButton
                        component={Link}
                        href={`/modules/${questionBank}/tests/${test.id}/review`}
                      >
                        <EyeIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Continue">
                      <IconButton
                        component={Link}
                        href={`/modules/${questionBank}/tests/${test.id}/${test.mode}`}
                      >
                        <PlayIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Delete Test">
                    <IconButton onClick={() => deleteTest({ testId: test.id })}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </ListItemContent>
            );
          }}
        />
      </Stack>
    );
  },
);

TestsOverview.displayName = "TestsOverview";
TestsOverview.getData = async () => ({});
TestsOverview.useData = () => ({});
