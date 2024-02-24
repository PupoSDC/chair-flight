"use client";

import { forwardRef } from "react";
import { Box, Link, ListItemContent, Typography } from "@mui/joy";
import { ImageWithModal, SearchList } from "@cf/react/components";
import type { AnnexSearchResult } from "@cf/core/search";
import type { SearchListProps } from "@cf/react/components";

export type SearchAnnexesListProps = Omit<
  SearchListProps<AnnexSearchResult>,
  "renderThead" | "renderTableRow" | "renderListItemContent"
>;

export const SearchAnnexesList = forwardRef<
  HTMLDivElement,
  SearchAnnexesListProps
>(
  (
    {
      items,
      errorMessage = "Error fetching Annexes",
      noDataMessage = "No Annexes found",
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
              <th style={{ width: 300 }}>Image</th>
              <th>Description</th>
              <th style={{ width: 100 }}>Subjects</th>
              <th style={{ width: 200 }}>Learning Objectives</th>
              <th style={{ width: 110 }}>Questions</th>
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

SearchAnnexesList.displayName = "SearchAnnexesList";
