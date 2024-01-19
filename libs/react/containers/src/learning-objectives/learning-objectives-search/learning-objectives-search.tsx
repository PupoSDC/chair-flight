import { Fragment, useState } from "react";
import { NoSsr } from "@mui/base";
import { default as CheckIcon } from "@mui/icons-material/Check";
import { default as FilterIcon } from "@mui/icons-material/FilterAltOutlined";
import {
  Badge,
  Box,
  IconButton,
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
  Modal,
  ModalDialog,
  ModalClose,
  Divider,
  Button,
} from "@mui/joy";
import { CourseNames } from "@chair-flight/core/app";
import {
  CtaSearch,
  MarkdownClientCompressed,
  Ups,
  useDisclose,
  useMediaQuery,
} from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { container, getRequiredParam } from "../../wraper/container";
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

type SearchField = "text" | "id";

export const LearningObjectivesSearch = container<Props, Params, Data>(
  ({ component = "section", questionBank, sx }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
    const [search, setSearch] = useState("");
    const [searchField, setSearchField] = useState<SearchField | null>(null);
    const [courseName, setCourseName] = useState<CourseName | null>(null);
    const [subject, setSubject] = useState<string | null>(null);
    const { subjects } = LearningObjectivesSearch.useData({ questionBank });

    const {
      isOpen: isFilterModalOpen,
      open: openFilterModal,
      close: closeFilterModal,
    } = useDisclose();

    const { data, isLoading, isError, fetchNextPage } = useSearchLos(
      {
        q: search,
        limit: 20,
        questionBank: questionBank,
        subject,
        searchField,
        course: courseName,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialCursor: 0,
      },
    );

    const numberOfFilters = Number(!!searchField) + Number(!!subject);
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

    const filters = (
      <>
        <Select
          size="sm"
          value={searchField}
          onChange={(_, v) => setSearchField(v)}
        >
          <Option value={null}>All Fields</Option>
          <Option value={"text"}>Text</Option>
          <Option value={"id"}>Id</Option>
        </Select>

        <Select
          size="sm"
          value={courseName}
          onChange={(_, v) => setCourseName(v)}
        >
          <Option value={null}>All Courses</Option>
          {Object.entries(CourseNames).map(([id, name]) => (
            <Option value={id} key={id}>
              {name}
            </Option>
          ))}
        </Select>

        <Select size="sm" value={subject} onChange={(_, v) => setSubject(v)}>
          <Option value={null}>All Subjects</Option>
          {subjects.map(({ id, shortName }) => (
            <Option value={id} key={id}>
              {id} - {shortName}
            </Option>
          ))}
        </Select>
      </>
    );

    return (
      <Stack component={component} height="100%" sx={sx}>
        <Stack
          direction="row"
          sx={{
            mb: { xs: 1, md: 2 },
            gap: 1,

            [`& .${selectClasses.root}`]: {
              display: { xs: "none", md: "flex" },
              width: "13em",
            },
          }}
        >
          <CtaSearch
            size="sm"
            value={search}
            loading={isLoading}
            onChange={(value) => setSearch(value)}
            sx={{ flex: 1 }}
            placeholder="search Learning Objectives..."
          />

          {filters}

          <IconButton
            size="sm"
            variant="outlined"
            color="neutral"
            onClick={openFilterModal}
            sx={{ display: { md: "none" } }}
          >
            <Badge badgeContent={numberOfFilters} size="sm">
              <FilterIcon />
            </Badge>
          </IconButton>
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
        <Modal open={isFilterModalOpen} onClose={closeFilterModal}>
          <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">
            <ModalClose />
            <Typography id="filter-modal" level="h2">
              Filters
            </Typography>
            <Divider sx={{ my: 2 }} />

            {filters}

            <Button color="primary" onClick={closeFilterModal}>
              Submit
            </Button>
          </ModalDialog>
        </Modal>
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
