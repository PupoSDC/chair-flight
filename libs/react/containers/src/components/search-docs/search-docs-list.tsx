import { forwardRef } from "react";
import { default as ConstructionIcon } from "@mui/icons-material/Construction";
import { default as HourglassEmptyIcon } from "@mui/icons-material/HourglassEmpty";
import { Link, ListItemContent, Stack, Tooltip } from "@mui/joy";
import { SearchList } from "@cf/react/components";
import type { DocSearchResult } from "@cf/core/search";
import type { SearchListProps } from "@cf/react/components";

export type SearchDocsListProps = Omit<
  SearchListProps<DocSearchResult>,
  "renderThead" | "renderTableRow" | "renderListItemContent"
> & {
  subjectMap: Record<string, string>;
};

export const SearchDocsList = forwardRef<HTMLDivElement, SearchDocsListProps>(
  (
    {
      items,
      errorMessage = "Error fetching Docs",
      noDataMessage = "No Docs found",
      subjectMap,
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
              <th style={{ width: 120 }}>Subject</th>
              <th>Title</th>
              <th style={{ width: 160 }}>Learning Objectives</th>
              <th style={{ width: 100 }}>Status</th>
            </tr>
          </thead>
        )}
        renderTableRow={(result) => (
          <tr>
            <td>{result.subject ? subjectMap[result.subject] : "---"}</td>
            <td>
              <Link href={result.href}>{`[${result.id}] ${result.title}`}</Link>
            </td>
            <td>
              {result.learningObjectives.map((lo) => (
                <Link href={lo.href} key={lo.id}>
                  {lo.id}
                </Link>
              ))}
            </td>

            <td>
              {result.empty ? (
                <Tooltip title="This document is just a placeholder. Help Chair Flight grow by contributing!">
                  <HourglassEmptyIcon />
                </Tooltip>
              ) : (
                <Tooltip title="This document is a work in progress. Help Chair Flight grow by contributing!">
                  <ConstructionIcon />
                </Tooltip>
              )}
            </td>
          </tr>
        )}
        renderListItemContent={(result) => (
          <ListItemContent
            sx={{
              flexDirection: "row",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Stack>
              <Link href={result.href}>{result.title}</Link>
            </Stack>
            {result.empty ? (
              <HourglassEmptyIcon size="md" />
            ) : (
              <ConstructionIcon size="md" />
            )}
          </ListItemContent>
        )}
      />
    );
  },
);

SearchDocsList.displayName = "SearchDocsList";
