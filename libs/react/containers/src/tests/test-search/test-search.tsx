import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  Select,
  Option,
  Stack,
  Tooltip,
  Typography,
  selectClasses,
} from "@mui/joy";
import { z } from "zod";
import { processTest } from "@chair-flight/core/tests";
import {
  HookFormSelect,
  SearchFilters,
  SearchList,
} from "@chair-flight/react/components";
import { createUsePersistenceHook } from "../../hooks/use-persistence";
import { container } from "../../wraper/container";
import { useTestProgress } from "../hooks/use-test-progress";
import type { QuestionBankName } from "@chair-flight/core/question-bank";

type Props = {
  questionBank: QuestionBankName;
};

const filterSchema = z.object({
  mode: z.enum(["all", "study", "exam"]).default("all"),
  status: z.enum(["all", "created", "started", "finished"]).default("all"),
});

const defaultFilter = filterSchema.parse({});
const resolver = zodResolver(filterSchema);

const useSearchPersistence = {
  atpl: createUsePersistenceHook("cf-test-search-atpl", defaultFilter),
  type: createUsePersistenceHook("cf-test-search-type", defaultFilter),
  prep: createUsePersistenceHook("cf-test-search-prep", defaultFilter),
};

export const TestSearch = container<Props>(
  ({ questionBank, sx, component = "section" }) => {
    const { getData, setData } = useSearchPersistence[questionBank]();
    const tests = useTestProgress((s) => s.tests);
    const deleteTest = useTestProgress((s) => s.deleteTest);
    const form = useForm({ defaultValues: getData(), resolver });

    const { mode, status } = form.watch();

    const testsAsList = Object.values(tests)
      .sort((a, b) => b.createdAtEpochMs - a.createdAtEpochMs)
      .filter((test) => {
        if (test.questionBank !== questionBank) return false;
        if (status !== "all" && status !== test.status) return false;
        if (mode !== "all" && mode !== test.mode) return false;
        return true;
      })
      .map((test) => ({ ...test, ...processTest(test) }));

    form.watch((data) => setData({ ...defaultFilter, ...data }));

    const numberOfFilters = Number(mode !== "all") + Number(status !== "all");

    return (
      <Stack component={component} sx={sx}>
        <Stack
          direction={"row"}
          sx={{
            gap: 1,
            justifyContent: "flex-end",
            mb: { xs: 1, sm: 2 },
            [`& .${selectClasses.root}`]: {
              width: "13em",
            },
          }}
        >
          <SearchFilters
            activeFilters={numberOfFilters}
            filters={
              <FormProvider {...form}>
                <HookFormSelect size="sm" {...form.register("mode")}>
                  <Option value={"all"}>All Modes</Option>
                  <Option value={"study"}>Study</Option>
                  <Option value={"exam"}>Exam</Option>
                </HookFormSelect>
                <HookFormSelect size="sm" {...form.register("status")}>
                  <Option value={"all"}>All States</Option>
                  <Option value={"started"}>Started</Option>
                  <Option value={"finished"}>Finished</Option>
                </HookFormSelect>
              </FormProvider>
            }
            fallback={
              <>
                <Select size="sm" />
                <Select size="sm" />
              </>
            }
          />

          <Button
            size="sm"
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
                <th style={{ width: "4em" }}>Type</th>
                <th style={{ width: "5em" }}>State</th>
                <th>Title</th>

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
                {test.mode}
              </Box>
              <Box
                component="td"
                sx={{ color: `${test.color}.500`, fontWeight: 700 }}
              >
                {test.status}
              </Box>
              <Box component="td">{test.title}</Box>

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
