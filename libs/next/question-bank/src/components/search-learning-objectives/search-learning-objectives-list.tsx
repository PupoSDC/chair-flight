"use client";

import { forwardRef } from "react";
import {
  Box,
  Chip,
  Divider,
  Link,
  ListItemContent,
  Typography,
} from "@mui/joy";
import { SearchList } from "@cf/react/ui";
import { LazyMarkdown } from "../../shared/lazy-markdown";
import type { LearningObjectiveSearchResult } from "@cf/core/search";
import type { SearchListProps } from "@cf/react/ui";

export type SearchLearningObjectivesListProps = Omit<
  SearchListProps<LearningObjectiveSearchResult>,
  "renderThead" | "renderTableRow" | "renderListItemContent"
> & {
  currentCourse: string;
};

export const SearchLearningObjectivesList = forwardRef<
  HTMLDivElement,
  SearchLearningObjectivesListProps
>(
  (
    {
      items,
      errorMessage = "Error fetching Learning Objectives",
      noDataMessage = "No Learning Objectives found",
      currentCourse,
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
              <th style={{ width: "8em" }}>LO</th>
              <th>Description</th>
              <th style={{ width: "14em" }}>Source</th>
              <th style={{ width: "14em" }}>Courses</th>
              <th style={{ width: "7em" }}>Questions</th>
            </tr>
          </thead>
        )}
        renderTableRow={(result) => (
          <tr key={result.id}>
            <td>
              <Link href={result.href}>
                <Typography>{result.id}</Typography>
              </Link>
            </td>
            <LazyMarkdown component={"td"} compressed>
              {result.text}
            </LazyMarkdown>
            <LazyMarkdown component={"td"} compressed>
              {result.source}
            </LazyMarkdown>
            <td>
              {result.courses
                .filter((c) => {
                  if (currentCourse === "all") return true;
                  if (c.id === currentCourse) return true;
                  return false;
                })
                .map((c) => (
                  <Chip key={c.id} size="sm" sx={{ m: 0.5 }}>
                    {c.text}
                  </Chip>
                ))}
            </td>
            <Box
              component={"td"}
              children={result.numberOfQuestions}
              sx={{
                textAlign: "right",
                pr: `2em !important`,
              }}
            />
          </tr>
        )}
        renderListItemContent={(result) => (
          <ListItemContent>
            <Link href={`/modules/atpl/learning-objectives/${result.id}`}>
              <Typography>{result.id}</Typography>
            </Link>
            <Typography level="body-xs" sx={{ fontSize: 10 }}>
              {result.courses.map((c) => c.text).join(", ")}
            </Typography>
            <Typography level="body-xs" sx={{ fontSize: 10 }}>
              Number of Questions {result.numberOfQuestions}
            </Typography>
            <Box
              sx={{
                mt: 1,
                fontSize: "sm",
                height: "7em",
                overflow: "hidden",
                maskImage:
                  "linear-gradient(to bottom, black 50%, transparent 100%)",
              }}
            >
              <LazyMarkdown compressed>{result.text}</LazyMarkdown>
              {result.source && (
                <>
                  <Divider sx={{ width: "50%", my: 0.5 }} />
                  <Typography level="body-xs">source: </Typography>
                  <LazyMarkdown
                    compressed
                    sx={{ color: "text.tertiary", fontSize: "xs" }}
                  >
                    {result.source}
                  </LazyMarkdown>
                </>
              )}
            </Box>
          </ListItemContent>
        )}
      />
    );
  },
);

SearchLearningObjectivesList.displayName = "SearchLearningObjectivesList";
