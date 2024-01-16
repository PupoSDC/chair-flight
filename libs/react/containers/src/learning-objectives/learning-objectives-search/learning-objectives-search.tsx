import { Fragment, useState } from "react";
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
  Stack,
  Table,
  Typography,
  styled,
  useTheme,
} from "@mui/joy";
import { CourseNames } from "@chair-flight/core/app";
import {
  CtaSearch,
  MarkdownClient,
  useMediaQuery,
} from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { container, getRequiredParam } from "../../wraper/container";
import type { CourseName, QuestionBankName } from "@chair-flight/base/types";

const useSearchLos =
  trpc.questionBank.searchLearningObjectives.useInfiniteQuery;

type Props = {
  questionBank: QuestionBankName;
};

type Params = {
  questionBank: QuestionBankName;
};

type Data = {
  numberOfLearningObjectives: number;
};

const TdWithMarkdown = styled("td")`
  margin: ${({ theme }) => theme.spacing(0.5, 0)};

  & p {
    margin: 0;
  }

  & ul {
    margin: 0;
  }
`;

export const LearningObjectivesSearch = container<Props, Params, Data>(
  ({ component = "section", questionBank, sx }) => {
    const params = { questionBank };
    const initialData = LearningObjectivesSearch.useData(params);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [search, setSearch] = useState("");

    const { data, isLoading, fetchNextPage } = useSearchLos(
      {
        q: search,
        limit: 20,
        questionBank: questionBank,
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
      data?.pages[0].totalResults ?? initialData.numberOfLearningObjectives;

    const onScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
      const target = e.target as HTMLDivElement;
      const { scrollHeight, scrollTop, clientHeight } = target;
      const distance = scrollHeight - scrollTop - clientHeight;
      if (distance < 200 && !isLoading) fetchNextPage();
    };

    return (
      <Stack component={component} height="100%" sx={sx}>
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
                          <MarkdownClient>{result.text}</MarkdownClient>
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
      </Stack>
    );
  },
);

LearningObjectivesSearch.displayName = "LearningObjectivesSearch";

LearningObjectivesSearch.getData = async ({ helper, params }) => {
  const questionBank = getRequiredParam(params, "questionBank");

  const data = await helper.questionBank.getNumberOfLearningObjectives.fetch({
    questionBank,
  });

  return { numberOfLearningObjectives: data.count };
};

LearningObjectivesSearch.useData = (params) => {
  const questionBank = getRequiredParam(params, "questionBank");

  const [data] =
    trpc.questionBank.getNumberOfLearningObjectives.useSuspenseQuery({
      questionBank,
    });

  return { numberOfLearningObjectives: data.count };
};
