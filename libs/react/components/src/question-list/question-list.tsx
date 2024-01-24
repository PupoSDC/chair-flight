import { forwardRef } from "react";
import { Box, Link, ListItemContent, Typography } from "@mui/joy";
import { MarkdownClientCompressed } from "../markdown-client";
import { SearchList } from "../search-list";
import type { SearchListProps } from "../search-list";

export type QuestionListItem = {
  id: string;
  questionId: string;
  variantId: string;
  href: string;
  text: string;
  learningObjectives: Array<{
    name: string;
    href: string;
  }>;
  externalIds: string[];
};

export type QuestionListProps = Omit<
  SearchListProps<QuestionListItem>,
  | "items"
  | "renderThead"
  | "renderTableRow"
  | "renderListItemContent"
  | "errorMessage"
  | "noDataMessage"
> & {
  items?: SearchListProps<QuestionListItem>["items"];
};

export const QuestionList = forwardRef<HTMLDivElement, QuestionListProps>(
  ({ items = [], ...otherProps }, ref) => {
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
              <th style={{ width: "12em" }}>External IDs</th>
            </tr>
          </thead>
        )}
        renderTableRow={(result) => (
          <tr>
            <td>
              <Link href={result.href} sx={{ display: "block" }}>
                <Typography>{result.questionId}</Typography>
                <br />
                <Typography level="body-xs">{result.variantId}</Typography>
              </Link>
            </td>
            <td>
              <MarkdownClientCompressed>{result.text}</MarkdownClientCompressed>
            </td>
            <td>
              {result.learningObjectives.map(({ name, href }) => (
                <Link
                  key={name}
                  href={href}
                  children={name}
                  sx={{ display: "block" }}
                />
              ))}
            </td>
            <td>
              {result.externalIds.map((id) => (
                <Typography level="body-xs" key={id}>
                  {id}
                </Typography>
              ))}
            </td>
          </tr>
        )}
        renderListItemContent={(result) => (
          <ListItemContent>
            <Link href={result.href} sx={{ pr: 1 }}>
              {result.questionId}
            </Link>
            <Typography level="body-xs" sx={{ display: "inline" }}>
              {result.variantId}
            </Typography>
            <Typography level="body-xs">
              {result.learningObjectives.map((lo) => lo.name).join(", ")}
            </Typography>
            <Box
              sx={{
                mt: 2,
                fontSize: "12px",
                height: "10em",
                overflow: "hidden",
                maskImage:
                  "linear-gradient(to bottom, black 50%, transparent 100%)",
              }}
            >
              <MarkdownClientCompressed>{result.text}</MarkdownClientCompressed>
            </Box>
          </ListItemContent>
        )}
      />
    );
  },
);

QuestionList.displayName = "QuestionList";
