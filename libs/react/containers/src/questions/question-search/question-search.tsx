import { Fragment, useState } from "react";
import { default as FilterIcon } from "@mui/icons-material/FilterAltOutlined";
import {
  Box,
  Select,
  Sheet,
  Stack,
  useTheme,
  Option,
  Table,
  Link,
  Typography,
  CircularProgress,
  List,
  ListItemContent,
  ListItem,
  ListDivider,
  IconButton,
  Modal,
  ModalDialog,
  ModalClose,
  Divider,
  Button,
  selectClasses,
  Badge,
} from "@mui/joy";
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
  QuestionBankName,
  QuestionBankSubject,
} from "@chair-flight/base/types";

const useSearchQuestions =
  trpc.questionBankQuestionSearch.searchQuestions.useInfiniteQuery;

type Props = {
  questionBank: QuestionBankName;
};

type Params = {
  questionBank: QuestionBankName;
};

type Data = {
  subjects: QuestionBankSubject[];
};

type SearchField = "questionId" | "learningObjectives" | "text" | "externalIds";

export const QuestionSearch = container<Props, Params, Data>(
  ({ sx, component = "section", questionBank }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const params = { questionBank };
    const [search, setSearch] = useState("");
    const [searchField, setSearchField] = useState<SearchField | null>(null);
    const [subject, setSubject] = useState<string | null>(null);
    const { subjects } = QuestionSearch.useData(params);
    const {
      isOpen: isFilterModalOpen,
      open: openFilterModal,
      close: closeFilterModal,
    } = useDisclose();

    const {
      data: searchQuestionsData,
      isLoading: searchQuestionsLoading,
      isError: searchQuestionsError,
      fetchNextPage,
    } = useSearchQuestions(
      {
        q: search,
        searchField,
        questionBank,
        subject,
        limit: 24,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialCursor: 0,
      },
    );

    const numberOfFilters = Number(!!searchField) + Number(!!subject);

    const hasResults =
      !searchQuestionsLoading &&
      !searchQuestionsError &&
      searchQuestionsData?.pages[0].totalResults > 0;

    const hasNoResults =
      !searchQuestionsLoading && !searchQuestionsError && !hasResults;

    const hasError = searchQuestionsError;

    const results = (searchQuestionsData?.pages ?? []).flatMap((p) => p.items);

    const onScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
      const target = e.target as HTMLUListElement;
      const { scrollHeight, scrollTop, clientHeight } = target;
      const distance = scrollHeight - scrollTop - clientHeight;
      if (distance < 500 && !searchQuestionsLoading) fetchNextPage();
    };

    const filters = (
      <>
        <Select
          size="sm"
          value={searchField}
          onChange={(_, v) => setSearchField(v)}
        >
          <Option value={null}>All Fields</Option>
          <Option value={"text"}>Question</Option>
          <Option value={"questionId"}>Id</Option>
          <Option value={"learningObjectives"}>Learning Objectives</Option>
          <Option value={"externalIds"}>External Ids</Option>
        </Select>

        <Select size="sm" value={subject} onChange={(_, v) => setSubject(v)}>
          <Option value={null}>All Subjects</Option>
          {subjects.map(({ id, shortName }) => (
            <Option value={id} key={id}>
              {shortName}
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
            mb: 2,
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
            loading={searchQuestionsLoading}
            onChange={(value) => setSearch(value)}
            sx={{ flex: 1 }}
            placeholder="search Questions..."
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

        <Sheet sx={{ flex: 1, overflowY: "scroll" }}>
          <Box
            sx={{ height: "100%", overflow: "auto", position: "relative" }}
            onScroll={onScroll}
          >
            {searchQuestionsLoading && (
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
            {hasNoResults && <Ups message="No questions found" />}
            {hasError && (
              <Ups message="Error fetching questions" color="danger" />
            )}
            {hasResults && !isMobile && (
              <Table stickyHeader>
                <thead>
                  <tr>
                    <th style={{ width: "8em" }}>ID</th>
                    <th>Question</th>
                    <th style={{ width: "12em" }}>Learning Objectives</th>
                    <th style={{ width: "12em" }}>External IDs</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result.questionId}>
                      <td>
                        <Link href={result.href} sx={{ display: "block" }}>
                          <Typography>{result.questionId}</Typography>
                          <br />
                          <Typography level="body-xs">
                            {result.variantId}
                          </Typography>
                        </Link>
                      </td>
                      <td>
                        <MarkdownClientCompressed>
                          {result.text}
                        </MarkdownClientCompressed>
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
                        <Link href={result.href} sx={{ pr: 1 }}>
                          {result.questionId}
                        </Link>
                        <Typography level="body-xs" sx={{ display: "inline" }}>
                          {result.variantId}
                        </Typography>

                        {searchField === "externalIds" ? (
                          <Typography level="body-xs">
                            {result.externalIds.join(", ")}
                          </Typography>
                        ) : (
                          <Typography level="body-xs">
                            {result.learningObjectives.join(", ")}
                          </Typography>
                        )}
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

QuestionSearch.displayName = "QuestionSearch";

QuestionSearch.getData = async ({ helper, params }) => {
  const questionBank = getRequiredParam(params, "questionBank");

  const [data] = await Promise.all([
    helper.questionBank.getAllSubjects.fetch({ questionBank }),
  ]);

  return {
    subjects: data.subjects,
  };
};

QuestionSearch.useData = (params) => {
  const questionBank = getRequiredParam(params, "questionBank");

  const [data] = trpc.questionBank.getAllSubjects.useSuspenseQuery({
    questionBank,
  });

  return {
    subjects: data.subjects,
  };
};
