import { Fragment, useState } from "react";
import { FormProvider } from "react-hook-form";
import { NoSsr } from "@mui/base";
import { default as CheckIcon } from "@mui/icons-material/Check";
import {
  Box,
  Link,
  List,
  ListDivider,
  ListItem,
  ListItemContent,
  Select,
  Option,
  Sheet,
  Stack,
  Table,
  Typography,
  selectClasses,
  useTheme,
  CircularProgress,
} from "@mui/joy";
import { CourseNames } from "@chair-flight/core/app";
import {
  SearchQuery,
  HookFormSelect,
  MarkdownClientCompressed,
  SearchFilters,
  Ups,
  useMediaQuery,
} from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { container, getRequiredParam } from "../../wraper/container";
import { useSearchConfig } from "./learning-objective-search-config-schema";
import type {
  CourseName,
  QuestionBankName,
  QuestionBankSubject,
} from "@chair-flight/base/types";

const useSearchLos =
  trpc.questionBankLoSearch.searchLearningObjectives.useInfiniteQuery;

type Props = {
  questionBank: QuestionBankName;
};

type Params = {
  questionBank: QuestionBankName;
};

type Data = {
  subjects: QuestionBankSubject[];
};

export const LearningObjectivesSearch = container<Props, Params, Data>(
  ({ component = "section", questionBank, sx }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
    const [search, setSearch] = useState("");
    const [searchConfig, form] = useSearchConfig(questionBank);
    const { subjects } = LearningObjectivesSearch.useData({ questionBank });

    const { searchField, course, subject } = searchConfig;

    const { data, isLoading, isError, fetchNextPage } = useSearchLos(
      {
        q: search,
        limit: 20,
        questionBank: questionBank,
        subject: subject === "all" ? null : subject,
        searchField: searchField === "all" ? null : searchField,
        course: course === "all" ? null : course,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialCursor: 0,
      },
    );

    const numberOfFilters =
      Number(searchField !== "all") +
      Number(subject !== "all") +
      Number(course !== "all");

    const hasError = isError;
    const hasQueryResults = !!data?.pages[0].totalResults;
    const hasResults = !isLoading && !hasError && hasQueryResults;
    const hasNoResults = !isLoading && !hasError && !hasResults;
    const results = (data?.pages ?? []).flatMap((p) => p.items);

    const onScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
      const target = e.target as HTMLDivElement;
      const { scrollHeight, scrollTop, clientHeight } = target;
      const distance = scrollHeight - scrollTop - clientHeight;
      if (distance < 200 && !isLoading) fetchNextPage();
    };

    return (
      <Stack component={component} height="100%" sx={sx}>
        <Stack
          direction="row"
          sx={{
            gap: 1,
            mb: { xs: 1, md: 2 },
            [`& .${selectClasses.root}`]: { width: "13em" },
          }}
        >
          <SearchQuery
            size="sm"
            value={search}
            loading={isLoading}
            onChange={(value) => setSearch(value)}
            sx={{ flex: 1 }}
            placeholder="search Learning Objectives..."
          />
          <FormProvider {...form}>
            <SearchFilters
              activeFilters={numberOfFilters}
              mobileBreakpoint="lg"
              fallback={
                <>
                  <Select size="sm" />
                  <Select size="sm" />
                  <Select size="sm" />
                </>
              }
              filters={
                <>
                  <HookFormSelect size="sm" {...form.register("searchField")}>
                    <Option value={"all"}>All Fields</Option>
                    <Option value={"text"}>Text</Option>
                    <Option value={"id"}>Id</Option>
                  </HookFormSelect>
                  <HookFormSelect size="sm" {...form.register("course")}>
                    <Option value={"all"}>All Courses</Option>
                    {Object.entries(CourseNames).map(([id, name]) => (
                      <Option value={id} key={id}>
                        {name}
                      </Option>
                    ))}
                  </HookFormSelect>
                  <HookFormSelect size="sm" {...form.register("subject")}>
                    <Option value={"all"}>All Subjects</Option>
                    {subjects.map(({ id, shortName }) => (
                      <Option value={id} key={id}>
                        {id} - {shortName}
                      </Option>
                    ))}
                  </HookFormSelect>
                </>
              }
            />
          </FormProvider>
        </Stack>

        <Sheet sx={{ flex: 1, p: { xs: 0, md: 2 }, overflowY: "scroll" }}>
          <Box sx={{ height: "100%", overflow: "auto" }} onScroll={onScroll}>
            <NoSsr>
              {isLoading && (
                <CircularProgress
                  variant="solid"
                  size="lg"
                  sx={{
                    position: "absolute",
                    transform: "translate(-50%, -50%)",
                    top: "50%",
                    left: "50%",
                  }}
                />
              )}
              {hasNoResults && <Ups message="No Learning Objectives found" />}
              {hasResults && !isMobile && (
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
                            width: 14 + courseName.length * 6.5,
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
                        <td>
                          <MarkdownClientCompressed>
                            {result.text}
                          </MarkdownClientCompressed>
                          <Box sx={{ fontSize: "xs" }}>
                            <MarkdownClientCompressed>
                              {result.source}
                            </MarkdownClientCompressed>
                          </Box>
                        </td>
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
              {hasResults && isMobile && (
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
                          <Typography level="body-xs" sx={{ fontSize: 10 }}>
                            {result.courses
                              .map((c) => CourseNames[c])
                              .join(", ")}
                          </Typography>
                          <Box
                            sx={{
                              mt: 1,
                              fontSize: "12px",
                              height: "7em",
                              overflow: "hidden",
                              maskImage:
                                "linear-gradient(to bottom, black 50%, transparent 100%)",
                            }}
                          >
                            <MarkdownClientCompressed>
                              {result.text}
                            </MarkdownClientCompressed>
                          </Box>
                        </ListItemContent>
                      </ListItem>
                      <ListDivider inset={"gutter"} />
                    </Fragment>
                  ))}
                </List>
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

  const [data] = await Promise.all([
    helper.questionBank.getAllSubjects.fetch({ questionBank }),
  ]);

  return {
    subjects: data.subjects,
  };
};

LearningObjectivesSearch.useData = (params) => {
  const questionBank = getRequiredParam(params, "questionBank");

  const [data] = trpc.questionBank.getAllSubjects.useSuspenseQuery({
    questionBank,
  });

  return {
    subjects: data.subjects,
  };
};
