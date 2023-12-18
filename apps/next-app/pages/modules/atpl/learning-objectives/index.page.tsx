import React, { Fragment } from "react";
import { useState } from "react";
import { NoSsr } from "@mui/base";
import { default as CheckIcon } from "@mui/icons-material/Check";
import {
  Box,
  Link,
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
import { CourseNames } from "@chair-flight/core/app";
import {
  CtaSearch,
  useMediaQuery,
  MarkdownClient,
} from "@chair-flight/react/components";
import { AppHead, LayoutModuleAtpl } from "@chair-flight/react/containers";
import { trpc } from "@chair-flight/trpc/client";
import {
  getTrpcHelper,
  preloadContentForStaticRender,
} from "@chair-flight/trpc/server";
import type { CourseName } from "@chair-flight/base/types";
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

type LearningObjectivesIndexPageProps = {
  totalNumberOfLearningObjectives: number;
};

export const LearningObjectivesIndexPage: NextPage<
  LearningObjectivesIndexPageProps
> = ({ totalNumberOfLearningObjectives }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [search, setSearch] = useState("");

  const { data, isLoading, fetchNextPage } =
    trpc.questionBank.searchLearningObjectives.useInfiniteQuery(
      {
        q: search,
        limit: 20,
        questionBank: "atpl",
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialCursor: 0,
      },
    );

  const results = (data?.pages ?? [])
    .flatMap((p) => p.items)
    .map((d) => d.result);

  const numberOfResults =
    data?.pages[0].totalResults ?? totalNumberOfLearningObjectives;

  const onScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const target = e.target as HTMLDivElement;
    const { scrollHeight, scrollTop, clientHeight } = target;
    const distance = scrollHeight - scrollTop - clientHeight;
    if (distance < 200 && !isLoading) fetchNextPage();
  };

  return (
    <LayoutModuleAtpl fixedHeight>
      <AppHead />
      <Box
        component="section"
        height="100%"
        display="flex"
        flexDirection="column"
      >
        <CtaSearch
          value={search}
          loading={isLoading}
          onChange={(value) => setSearch(value)}
          numberOfResults={numberOfResults}
          sx={{ my: 1, mx: "auto" }}
          placeholder="search Learning Objectives..."
        />
        <Sheet sx={{ flex: 1, p: { xs: 0, md: 2 }, overflowY: "scroll" }}>
          <Box sx={{ height: "100%", overflow: "auto" }} onScroll={onScroll}>
            <NoSsr>
              {isMobile ? (
                <List>
                  {results.map((result) => (
                    <Fragment key={result.id}>
                      <ListItem>
                        <ListItemContent>
                          <Link
                            href={`/modules/atpl/learning-objectives/${result.id}`}
                          >
                            <Typography>{result.id}</Typography>
                          </Link>
                          <Typography level="body-sm">{result.text}</Typography>
                          <Typography level="body-sm">
                            source: {result.text}
                          </Typography>
                        </ListItemContent>
                      </ListItem>
                      <ListDivider inset={"gutter"} />
                    </Fragment>
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
                          <Link
                            href={`/modules/atpl/learning-objectives/${result.id}`}
                          >
                            <Typography>{result.contentId}</Typography>
                          </Link>
                        </td>
                        <TdWithMarkdown>
                          <MarkdownClient>{result.text}</MarkdownClient>
                          <Typography level="body-sm">
                            {result.source}
                          </Typography>
                        </TdWithMarkdown>
                        {Object.keys(CourseNames).map((courseName) => (
                          <td key={courseName}>
                            {result.courses.includes(
                              courseName as CourseName,
                            ) && <CheckIcon />}
                          </td>
                        ))}
                        <Box
                          component={"td"}
                          children={result.questions.length}
                          sx={{
                            textAlign: "right",
                            pr: `2em !important`,
                          }}
                        />
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </NoSsr>
          </Box>
        </Sheet>
      </Box>
    </LayoutModuleAtpl>
  );
};

export const getStaticProps: GetStaticProps<
  LearningObjectivesIndexPageProps
> = async () => {
  await preloadContentForStaticRender(await import("fs/promises"));
  const helper = await getTrpcHelper();
  const qb = helper.questionBank;
  const [, { count: totalNumberOfLearningObjectives }] = await Promise.all([
    qb.searchLearningObjectives.prefetchInfinite({
      q: "",
      limit: 20,
      questionBank: "atpl",
    }),
    qb.getNumberOfLearningObjectives.fetch({ questionBank: "atpl" }),
  ]);

  return {
    props: {
      trpcState: helper.dehydrate(),
      totalNumberOfLearningObjectives,
    },
  };
};

export default LearningObjectivesIndexPage;
