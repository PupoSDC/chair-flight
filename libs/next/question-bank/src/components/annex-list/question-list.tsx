import { forwardRef } from "react";
import { Box, Link, ListItemContent, Typography } from "@mui/joy";
import { SearchList } from "@cf/react/components";
import { Markdown } from "@cf/react/markdown";
import type { QuestionSearchResult } from "@cf/core/search";
import type { SearchListProps } from "@cf/react/components";

export type QuestionListProps = Omit<
  SearchListProps<QuestionSearchResult>,
  "renderThead" | "renderTableRow" | "renderListItemContent"
>;

export const QuestionList = forwardRef<HTMLDivElement, QuestionListProps>(
  (
    {
      items,
      errorMessage = "Error fetching questions",
      noDataMessage = "No questions found",
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
            <Box component="td" sx={{ height: "200px !important" }}>
              <ImageWithModal
                href={result.href}
                alt=""
                width={250}
                height={200}
              />
              <Box component="b" sx={{ fontSize: 12 }}>
                {result.id}
              </Box>
            </Box>
            <td>{result.description}</td>
            <td>{result.subjects.join(", ")}</td>
            <td>
              {result.learningObjectives.map(({ href, id }) => (
                <Link href={href} key={id} sx={{ display: "block" }}>
                  {id}
                </Link>
              ))}
            </td>
            <td>
              {result.questions.map(({ href, id }) => (
                <Link href={href} key={id} sx={{ display: "block" }}>
                  {id}
                </Link>
              ))}
            </td>
          </tr>
        )}
        renderListItemContent={(result) => (
          <ListItemContent sx={{ display: "flex" }}>
            <ImageWithModal
              href={result.href}
              alt=""
              width={125}
              height={100}
            />
            <Box sx={{ pl: 1 }}>
              <Typography level="h5" sx={{ fontSize: "xs" }}>
                {result.id}
              </Typography>
              <Typography level="body-xs" sx={{ minHeight: "4em" }}>
                {result.description}
              </Typography>
              <Typography level="body-xs">
                <b>Questions</b>:&nbsp;
                {result.questions.map(({ href, id }) => (
                  <Link href={href} key={id} sx={{ fontSize: "xs", pr: 1 }}>
                    {id}
                  </Link>
                ))}
              </Typography>
              <Typography level="body-xs">
                <b>Learning Objectives</b>:&nbsp;
                {result.learningObjectives.map(({ href, id }) => (
                  <Link href={href} key={id} sx={{ fontSize: "xs", pr: 1 }}>
                    {id}
                  </Link>
                ))}
              </Typography>
            </Box>
          </ListItemContent>
        )}
      />
    );
  },
);

QuestionList.displayName = "QuestionList";
