import { useState } from "react";
import { Box, useTheme } from "@mui/joy";
import { CtaSearch, Ups, useMediaQuery } from "@chair-flight/react/components";
import { QuestionPreviewList } from "../question-preview-list/question-preview-list";
import type { trpc } from "@chair-flight/trpc/client";
import type { BoxProps } from "@mui/joy";
import type { FC } from "react";

export type QuestionSearchProps = BoxProps &
  (
    | {
        searchQuestions: typeof trpc.questionBank737.searchQuestions;
        getNumberOfQuestions: typeof trpc.questionBank737.getNumberOfQuestions;
      }
    | {
        searchQuestions: typeof trpc.questionBankAtpl.searchQuestions;
        getNumberOfQuestions: typeof trpc.questionBankAtpl.getNumberOfQuestions;
      }
  );

export const QuestionSearch: FC<QuestionSearchProps> = ({
  searchQuestions: { useInfiniteQuery: useSearchQuestions },
  getNumberOfQuestions: { useSuspenseQuery: useNumberOfQuestions },
  ...otherProps
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [search, setSearch] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [{ count: totalNumberOfQuestions }] = useNumberOfQuestions();

  const { data, isLoading, isError, fetchNextPage } = useSearchQuestions(
    {
      q: search,
      limit: isMobile ? 12 : 24,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialCursor: 0,
      enabled: hasSearched,
    },
  );

  const hasResults = !isLoading && !isError && data?.pages[0].totalResults > 0;
  const hasNoResults = !isLoading && !isError && !hasResults && !!search.length;

  const results = (data?.pages ?? [])
    .flatMap((p) => p.items)
    .map((d) => d.result);

  const numberOfResults = (() => {
    if (hasResults) return data?.pages[0].totalResults;
    if (hasNoResults) return 0;
    return totalNumberOfQuestions;
  })();

  const onScroll = (e: React.UIEvent<HTMLUListElement, UIEvent>) => {
    const target = e.target as HTMLUListElement;
    const { scrollHeight, scrollTop, clientHeight } = target;
    const distance = scrollHeight - scrollTop - clientHeight;
    if (distance < 500 && !isLoading) fetchNextPage();
  };

  return (
    <Box
      {...otherProps}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        ...otherProps.sx,
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
          loading={hasSearched && isLoading}
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
      {isError && <Ups message="Error fetching questions" color="danger" />}
      {hasNoResults && <Ups message="No questions found" />}
    </Box>
  );
};
