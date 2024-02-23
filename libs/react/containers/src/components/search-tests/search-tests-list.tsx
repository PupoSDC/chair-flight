"use client";

import { forwardRef } from "react";
import { default as DeleteIcon } from "@mui/icons-material/DeleteOutlineOutlined";
import { default as PlayIcon } from "@mui/icons-material/PlayArrowOutlined";
import { default as EyeIcon } from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  CircularProgress,
  IconButton,
  Link,
  ListItemContent,
  Stack,
  Tooltip,
  Typography,
} from "@mui/joy";
import { SearchList } from "@cf/react/components";
import type { ProcessedTest } from "@cf/core/tests";
import type { SearchListProps } from "@cf/react/components";

export type SearchTestsListProps = Omit<
  SearchListProps<ProcessedTest>,
  "renderThead" | "renderTableRow" | "renderListItemContent"
> & {
  questionBank: string;
  onDeleteTest: (args: { testId: string }) => void;
};

export const SearchTestsList = forwardRef<HTMLDivElement, SearchTestsListProps>(
  (
    {
      items,
      errorMessage = "Error fetching Tests",
      noDataMessage = "No Tests found",
      questionBank,
      onDeleteTest,
      ...otherProps
    },
    ref,
  ) => {
    return (
      <SearchList
        {...otherProps}
        ref={ref}
        items={items}
        errorMessage={errorMessage}
        noDataMessage={noDataMessage}
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
              <th style={{ textAlign: "center", width: "8em" }}>Time Spent</th>
              <th style={{ textAlign: "center", width: "12em" }}>Start Date</th>
              <th style={{ width: "8em" }}></th>
            </tr>
          </thead>
        )}
        renderTableRow={(test) => (
          <tr>
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
                    href={`/${questionBank}/tests/${test.id}/review`}
                  >
                    <EyeIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="Continue">
                  <IconButton
                    component={Link}
                    href={`/${questionBank}/tests/${test.id}/${test.mode}`}
                  >
                    <PlayIcon />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Delete Test" sx={{ ml: 1 }}>
                <IconButton onClick={() => onDeleteTest({ testId: test.id })}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </td>
          </tr>
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
                <IconButton onClick={() => onDeleteTest({ testId: test.id })}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </ListItemContent>
        )}
      />
    );
  },
);

SearchTestsList.displayName = "SearchTestsList";
