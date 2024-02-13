import { forwardRef } from "react";
import {
  Box,
  Chip,
  Divider,
  Link,
  ListItemContent,
  Typography,
} from "@mui/joy";
import { SearchList } from "@cf/react/components";
import { Markdown } from "@cf/react/markdown";
import type { LearningObjectiveSearchResult } from "@cf/core/search";
import type { SearchListProps } from "@cf/react/components";

export type LearningObjectiveListProps = Omit<
  SearchListProps<LearningObjectiveSearchResult>,
  | "renderThead"
  | "renderTableRow"
  | "renderListItemContent"
  | "errorMessage"
  | "noDataMessage"
> & {
  currentCourse?: string;
};

export const LearningObjectiveList = forwardRef<
  HTMLDivElement,
  LearningObjectiveListProps
>(({ items, currentCourse = "all", ...otherProps }, ref) => {
  return (
    <SearchList
      {...otherProps}
      ref={ref}
      items={items}
      errorMessage={"Error fetching Learning Objectives"}
      noDataMessage={"No Learning Objectives found"}
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
          <Markdown component={"td"} compressed>
            {result.text}
          </Markdown>
          <Markdown component={"td"} compressed>
            {result.source}
          </Markdown>
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
            <Markdown compressed>{result.text}</Markdown>
            {result.source && (
              <>
                <Divider sx={{ width: "50%", my: 0.5 }} />
                <Typography level="body-xs">source: </Typography>
                <Markdown
                  compressed
                  sx={{ color: "text.tertiary", fontSize: "xs" }}
                >
                  {result.source}
                </Markdown>
              </>
            )}
          </Box>
        </ListItemContent>
      )}
    />
  );
});

LearningObjectiveList.displayName = "LearningObjectiveList";
