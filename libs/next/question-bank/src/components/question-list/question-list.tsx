import { forwardRef } from "react";
import { Box, Link, ListItemContent, Typography } from "@mui/joy";
import { SearchList } from "@cf/react/components";
import { Markdown } from "@cf/react/markdown";
import type { QuestionSearchResult } from "@cf/core/search";
import type { SearchListProps } from "@cf/react/components";

export type QuestionListProps = Omit<
  SearchListProps<QuestionSearchResult>,
  | "renderThead"
  | "renderTableRow"
  | "renderListItemContent"
  | "errorMessage"
  | "noDataMessage"
>;

export const QuestionList = forwardRef<HTMLDivElement, QuestionListProps>(
  ({ items, ...otherProps }, ref) => {
    return (
      <SearchList
        {...otherProps}
        ref={ref}
        items={items}
        errorMessage={"Error fetching questions"}
        noDataMessage={"No questions found"}
        renderThead={() => (
          <thead>
            <tr>
              <th style={{ width: "8em" }}>ID</th>
              <th>Question</th>
              <th style={{ width: "12em" }}>Learning Objectives</th>
              <th style={{ width: "12em" }}>Related Questions</th>
              <th style={{ width: "12em" }}>External IDs</th>
            </tr>
          </thead>
        )}
        renderTableRow={(result) => (
          <tr>
            <td>
              <Link href={result.href} sx={{ display: "block" }}>
                <Typography>{result.id}</Typography>
              </Link>
            </td>
            <Markdown component="td" compressed>
              {result.text}
            </Markdown>
            <td>
              {result.learningObjectives.slice(0, 5).map(({ id, href }) => (
                <Link
                  key={id}
                  href={href}
                  children={id}
                  sx={{ display: "block" }}
                />
              ))}
              {result.learningObjectives.length > 5 && (
                <Typography level="body-xs">
                  {`+ ${result.learningObjectives.length - 5} more`}
                </Typography>
              )}
            </td>
            <td>
              {result.relatedQuestions.slice(0, 5).map(({ id, href }) => (
                <Link
                  key={id}
                  href={href}
                  children={id}
                  sx={{ display: "block" }}
                />
              ))}
              {result.relatedQuestions.length > 5 && (
                <Typography level="body-xs">
                  {`+ ${result.relatedQuestions.length - 5} more`}
                </Typography>
              )}
            </td>
            <td>
              {result.externalIds.slice(0, 5).map((id) => (
                <Typography level="body-xs" key={id}>
                  {id}
                </Typography>
              ))}
              {result.externalIds.length > 5 && (
                <Typography level="body-xs">
                  {`+ ${result.externalIds.length - 5} more`}
                </Typography>
              )}
            </td>
          </tr>
        )}
        renderListItemContent={(result) => (
          <ListItemContent>
            <Link href={result.href} sx={{ pr: 1 }}>
              {result.id}
            </Link>
            <Typography level="body-xs">
              {result.learningObjectives.map((lo) => lo.id).join(", ")}
            </Typography>
            <Box
              sx={{
                mt: 1,
                fontSize: "12px",
                height: "10em",
                overflow: "hidden",
                maskImage:
                  "linear-gradient(to bottom, black 50%, transparent 100%)",
              }}
            >
              <Markdown compressed>{result.text}</Markdown>
            </Box>
          </ListItemContent>
        )}
      />
    );
  },
);

QuestionList.displayName = "QuestionList";
