import { useState } from "react";
import { default as FilterIcon } from "@mui/icons-material/FilterAltOutlined";
import {
  Select,
  Stack,
  Option,
  Typography,
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
  QuestionList,
  useDisclose,
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
    const [search, setSearch] = useState("");
    const [searchField, setSearchField] = useState<SearchField | null>(null);
    const [subject, setSubject] = useState<string | null>(null);
    const { subjects } = QuestionSearch.useData({ questionBank });
    const filterModal = useDisclose();

    const { data, isLoading, isError, fetchNextPage } = useSearchQuestions(
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
            mb: { xs: 1, sm: 2 },
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
            placeholder="search Questions..."
          />

          {filters}

          <IconButton
            size="sm"
            variant="outlined"
            color="neutral"
            onClick={filterModal.open}
            sx={{ display: { md: "none" } }}
          >
            <Badge badgeContent={numberOfFilters} size="sm">
              <FilterIcon />
            </Badge>
          </IconButton>
        </Stack>

        <QuestionList
          loading={isLoading}
          error={isError}
          questions={(data?.pages ?? []).flatMap((p) => p.items)}
          onFetchNextPage={fetchNextPage}
          sx={{ flex: 1, overflow: "hidden" }}
        />

        <Modal open={filterModal.isOpen} onClose={filterModal.close}>
          <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">
            <ModalClose />
            <Typography id="filter-modal" level="h2">
              Filters
            </Typography>
            <Divider sx={{ my: 2 }} />

            {filters}

            <Button color="primary" onClick={filterModal.close}>
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
