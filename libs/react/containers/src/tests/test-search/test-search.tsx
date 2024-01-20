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
import { processTest } from "@chair-flight/core/app";
import { SearchList } from "@chair-flight/react/components";
import { container } from "../../wraper/container";
import { useTestProgress } from "../hooks/use-test-progress";
import type { QuestionBankName } from "@chair-flight/base/types";

type Props = {
  questionBank: QuestionBankName;
};

export const TestSearch = container<Props>(
  ({ questionBank, sx, component = "section" }) => {
    const tests = useTestProgress((s) => s.tests);
    const deleteTest = useTestProgress((s) => s.deleteTest);
    const testsAsList = Object.values(tests)
      .sort((a, b) => b.createdAtEpochMs - a.createdAtEpochMs)
      .filter((test) => test.questionBank === questionBank)
      .map((test) => ({ ...test, ...processTest(test) }));

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
          renderTableRow={(test) => (
            <Box key={test.id} component={"tr"}>
              <td>
                {test.status === "finished" && (
                  <CircularProgress
                    determinate
                    size="md"
                    color={test.color}
                    value={test.score}
                    children={`${Math.round(test.score)}%`}
                  />
                )}
                {test.status === "started" && (
                  <CircularProgress
                    determinate
                    value={75}
                    size="md"
                    color={test.color}
                    children={`??%`}
                  />
                )}
              </td>
              <Box
                component="td"
                sx={{ color: `${test.color}.500`, fontWeight: 700 }}
              >
                {test.title}
              </Box>
              <td>{test.mode}</td>
              <Box component="td" sx={{ textAlign: "center" }}>
                {test.questions.length}
              </Box>
              <Box component="td" sx={{ textAlign: "center" }}>
                {test.timeLeft}
              </Box>
              <Box component="td" sx={{ textAlign: "center" }}>
                {test.timeSpent}
              </Box>
              <Box component="td" sx={{ textAlign: "center" }}>
                {test.timeStarted}
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
          )}
          renderListItemContent={(test) => (
            <ListItemContent sx={{ display: "flex", alignItems: "center" }}>
              {test.status === "finished" && (
                <CircularProgress
                  determinate
                  size="md"
                  color={test.color}
                  value={test.score}
                  children={`${Math.round(test.score)}%`}
                />
              )}
              {test.status === "started" && (
                <CircularProgress
                  determinate
                  value={75}
                  size="md"
                  color={test.color}
                  children={`??%`}
                />
              )}
              <Box sx={{ pl: 2, flex: 1 }}>
                {test.title && (
                  <Typography level="h5" sx={{ color: `${test.color}.500` }}>
                    {test.title}
                  </Typography>
                )}
                {test.status === "finished" && (
                  <Typography level="body-sm">
                    {`Completed in ${test.timeSpent} minutes`}
                  </Typography>
                )}
                {test.status !== "finished" && test.mode === "exam" && (
                  <Typography level="body-sm">
                    {`Time Left: ${test.timeLeft} minutes`}
                  </Typography>
                )}
                {test.status !== "finished" && test.mode === "study" && (
                  <Typography level="body-sm">
                    {`Time Spent: ${test.timeSpent} minutes`}
                  </Typography>
                )}
                <Typography level="body-sm">
                  {[test.timeStarted, `${test.questions.length} Questions`]
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
          )}
        />
      </Stack>
    );
  },
);

TestSearch.displayName = "TestSearch";
TestSearch.getData = async () => ({});
TestSearch.useData = () => ({});
