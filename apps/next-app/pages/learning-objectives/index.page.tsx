import { useEffect, useRef, useState } from "react";
import React from "react";
import { NoSsr } from "@mui/base";
import { default as CheckIcon } from "@mui/icons-material/Check";
import {
  Box,
  List,
  ListDivider,
  ListItem,
  ListItemContent,
  Sheet,
  Table,
  Typography,
  styled,
  useTheme,
} from "@mui/joy";
import { default as useAxios } from "axios-hooks";
import { CourseNames } from "@chair-flight/core/app";
import { AppHead, AppHeaderMenu } from "@chair-flight/next/client";
import {
  Header,
  AppLayout,
  CtaSearch,
  useMediaQuery,
  MarkdownClient,
} from "@chair-flight/react/components";
import type { CourseName, LearningObjective } from "@chair-flight/base/types";
import type { SearchLearningObjectivesResults } from "@chair-flight/core/app";
import type { GetStaticProps, NextPage } from "next";

const TdWithMarkdown = styled("td")`
  margin: ${({ theme }) => theme.spacing(0.5, 0)};

  & p {
    margin: 0;
  }

  & ul {
    margin: 0;
  }
`;

export const LearningObjectivesIndexPage: NextPage = () => {
  const lastSearch = useRef("");
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [results, setResults] = useState<LearningObjective[]>([]);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [{ data, loading }] = useAxios<SearchLearningObjectivesResults>(
    {
      url: "/api/search/learning-objectives",
      params: {
        q: search,
        pageSize: 20,
        page: page,
      },
    },
    {
      ssr: false,
    }
  );

  const onScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const target = e.target as HTMLDivElement;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 200) {
      setPage((page) => page + 1);
    }
  };

  useEffect(
    function updateResultsAfterEverySearch() {
      const newResults = data?.results.map((result) => result.result) ?? [];
      setResults((results) => [...results, ...newResults]);
    },
    [data]
  );

  useEffect(
    function resetResultsOnNewSearch() {
      if (lastSearch.current === search) return;
      lastSearch.current = search;
      setResults([]);
      setPage(0);
    },
    [search]
  );

  return (
    <>
      <AppHead />
      <Header>
        <AppHeaderMenu />
      </Header>
      <AppLayout.Main sx={{ overflow: "hidden" }}>
        <CtaSearch
          value={search}
          loading={loading}
          onChange={(value) => setSearch(value)}
          sx={{ my: 1, mx: "auto" }}
          placeholder="search Learning Objectives..."
        />
        <Sheet sx={{ flex: 1, p: { xs: 0, md: 2 }, overflowY: "scroll" }}>
          <Box sx={{ height: "100%", overflow: "auto" }} onScroll={onScroll}>
            <NoSsr>
              {isMobile ? (
                <List>
                  {results.map((result) => (
                    <React.Fragment key={result.id}>
                      <ListItem>
                        <ListItemContent>
                          <Typography>{result.id}</Typography>
                          <Typography level="body2">{result.text}</Typography>
                          <Typography level="body3">
                            source: {result.text}
                          </Typography>
                        </ListItemContent>
                      </ListItem>
                      <ListDivider inset={"gutter"} />
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Table stickyHeader>
                  <thead>
                    <tr>
                      <th style={{ width: "8em" }}>LO</th>
                      <th>Description</th>
                      {Object.values(CourseNames).map((courseName) => (
                        <th
                          className="course-name"
                          key={courseName}
                          children={courseName}
                          style={{
                            fontSize: 10,
                            width: 14 + courseName.length * 6,
                          }}
                        />
                      ))}
                      <th style={{ width: "7em", fontSize: 10 }}>Questions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result) => (
                      <tr key={result.id}>
                        <td>
                          <Typography>{result.contentId}</Typography>
                        </td>
                        <TdWithMarkdown>
                          <MarkdownClient>{result.text}</MarkdownClient>
                          <Typography level="body3">{result.source}</Typography>
                        </TdWithMarkdown>
                        {Object.keys(CourseNames).map((courseName) => (
                          <td key={courseName} className="course-name">
                            {result.courses.includes(
                              courseName as CourseName
                            ) && <CheckIcon />}
                          </td>
                        ))}
                        <td>{result.questions.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </NoSsr>
          </Box>
        </Sheet>
      </AppLayout.Main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export default LearningObjectivesIndexPage;
