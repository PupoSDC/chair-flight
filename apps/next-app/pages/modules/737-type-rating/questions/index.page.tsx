import { useState } from "react";
import { useTheme } from "@mui/joy";
import {
  Header,
  AppLayout,
  CtaSearch,
  Ups,
  useMediaQuery,
} from "@chair-flight/react/components";
import {
  AppHead,
  AppHeaderMenu,
  QuestionPreviewList,
} from "@chair-flight/react/containers";
import { trpc } from "@chair-flight/trpc/client";
import { getTrpcHelper } from "@chair-flight/trpc/server";
import type { GetStaticProps, NextPage } from "next";

type QuestionsIndexPageProps = {
  numberOfQuestions: number;
};

const QuestionsIndexPage: NextPage<QuestionsIndexPageProps> = ({
  numberOfQuestions,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [search, setSearch] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const { data, isLoading, isError, fetchNextPage } =
    trpc.questionBank737.searchQuestions.useInfiniteQuery(
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
    return numberOfQuestions;
  })();

  const onScroll = (e: React.UIEvent<HTMLUListElement, UIEvent>) => {
    const target = e.target as HTMLUListElement;
    const { scrollHeight, scrollTop, clientHeight } = target;
    const distance = scrollHeight - scrollTop - clientHeight;
    if (distance < 500 && !isLoading) fetchNextPage();
  };

  return (
    <>
      <AppHead />
      <Header>
        <AppHeaderMenu />
      </Header>
      <AppLayout.Main sx={{ height: "auto", justifyContent: "flex-start" }}>
        <CtaSearch
          value={search}
          loading={hasSearched && isLoading}
          onChange={(value) => {
            setSearch(value);
            setHasSearched(true);
          }}
          sx={{
            margin: (t) => (hasSearched ? t.spacing(3, "auto") : "auto"),
            minHeight: 40,
          }}
          placeholder="search Questions..."
          numberOfResults={numberOfResults}
        />
        {hasResults && (
          <QuestionPreviewList questions={results} onScroll={onScroll} />
        )}
        {isError && <Ups message="Error fetching questions" color="danger" />}
        {hasNoResults && <Ups message="No questions found" />}
      </AppLayout.Main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const helper = await getTrpcHelper();

  const [{ numberOfQuestions }] = await Promise.all([
    helper.questionBank737.getSubject.fetch(),
  ]);

  return {
    props: { numberOfQuestions },
  };
};

export default QuestionsIndexPage;
