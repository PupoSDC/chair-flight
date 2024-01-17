import { useState } from "react";
import { Box, useTheme } from "@mui/joy";
import { CtaSearch, Ups, useMediaQuery } from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { container, getRequiredParam } from "../../wraper/container";
import { QuestionPreviewList } from "./question-preview-list";
import type { QuestionBankName } from "@chair-flight/base/types";

const useSearchQuestions = trpc.questionBank.searchQuestions.useInfiniteQuery;

type Props = {
  questionBank: QuestionBankName;
};

type Params = {
  questionBank: QuestionBankName;
};

type Data = {
  numberOfQuestions: number;
};

export const QuestionSearch = container<Props, Params, Data>((props) => {
  const { questionBank, sx, component } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [search, setSearch] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const { numberOfQuestions } = QuestionSearch.useData({ questionBank });

  const {
    data: searchQuestionsData,
    isLoading: searchQuestionsLoading,
    isError: searchQuestionsError,
    fetchNextPage,
  } = useSearchQuestions(
    {
      q: search,
      questionBank,
      limit: isMobile ? 12 : 24,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialCursor: 0,
      enabled: hasSearched,
    },
  );

  const hasResults =
    !searchQuestionsLoading &&
    !searchQuestionsError &&
    searchQuestionsData?.pages[0].totalResults > 0;

  const hasNoResults =
    !searchQuestionsLoading &&
    !searchQuestionsError &&
    !hasResults &&
    !!search.length;

  const hasError = searchQuestionsError;

  const results = (searchQuestionsData?.pages ?? [])
    .flatMap((p) => p.items)
    .map((d) => d.result);

  const numberOfResults = (() => {
    if (hasResults) return searchQuestionsData?.pages[0].totalResults;
    if (hasNoResults) return 0;
    return numberOfQuestions;
  })();

  const onScroll = (e: React.UIEvent<HTMLUListElement, UIEvent>) => {
    const target = e.target as HTMLUListElement;
    const { scrollHeight, scrollTop, clientHeight } = target;
    const distance = scrollHeight - scrollTop - clientHeight;
    if (distance < 500 && !searchQuestionsLoading) fetchNextPage();
  };

  return (
    <Box
      component={component}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        ...sx,
      }}
    >
      <Box
        sx={{
          height: 90,
          position: "sticky",
          zIndex: 2,
          bgcolor: "background.body",
          maskImage:
            "linear-gradient(to bottom, black 0%, black 90%, transparent 100%)",
        }}
      >
        <CtaSearch
          value={search}
          loading={hasSearched && searchQuestionsLoading}
          onChange={(value) => {
            setSearch(value);
            setHasSearched(true);
          }}
          sx={{
            mx: "auto",
            minHeight: 40,
          }}
          placeholder="search Questions..."
          numberOfResults={numberOfResults}
        />
      </Box>

      {hasResults && (
        <QuestionPreviewList questions={results} onScroll={onScroll} />
      )}
      {hasError && <Ups message="Error fetching questions" color="danger" />}
      {hasNoResults && <Ups message="No questions found" />}
    </Box>
  );
});

QuestionSearch.displayName = "QuestionSearch";

QuestionSearch.getData = async ({ helper, params }) => {
  const questionBank = getRequiredParam(params, "questionBank");

  const data = await helper.questionBank.getNumberOfQuestions.fetch({
    questionBank,
  });

  return { numberOfQuestions: data.count };
};

QuestionSearch.useData = (params) => {
  const questionBank = getRequiredParam(params, "questionBank");

  const [data] = trpc.questionBank.getNumberOfQuestions.useSuspenseQuery({
    questionBank,
  });

  return { numberOfQuestions: data.count };
};
