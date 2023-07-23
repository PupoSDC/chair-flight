import { useEffect, useState } from "react";
import { useTheme } from "@mui/joy";
import { default as useAxios } from "axios-hooks";
import {
  AppHead,
  AppHeaderMenu,
  QuestionPreviewList,
} from "@chair-flight/next/client";
import {
  Header,
  AppLayout,
  CtaSearch,
  Ups,
  useWindowSize,
} from "@chair-flight/react/components";
import type { SearchQuestionsResults } from "@chair-flight/core/app";
import type { GetStaticProps, NextPage } from "next";

const QuestionsIndexPage: NextPage = () => {
  const window = useWindowSize();
  const theme = useTheme();
  const [search, setSearch] = useState<string>("");
  const [hasSearched, setHasSearched] = useState(false);

  const [{ data, loading, error }] = useAxios<SearchQuestionsResults>(
    {
      url: "/api/search/questions",
      params: {
        q: search,
        pageSize: window.width > theme.breakpoints.values.md ? 24 : 12,
        page: 0,
      },
    },
    {
      ssr: false,
      manual: !search,
    },
  );

  const hasResults = hasSearched && (data?.totalResults ?? 0) > 0;
  const hasError = !loading && error;
  const hasNoResults = hasSearched && !loading && !hasResults && !hasError;
  const results = data?.results.map((d) => d.result);

  useEffect(() => {
    if (data?.results) setHasSearched(true);
  }, [search, data]);

  return (
    <>
      <AppHead />
      <Header>
        <AppHeaderMenu />
      </Header>
      <AppLayout.Main sx={{ overflow: "hidden", pb: 0 }}>
        <CtaSearch
          value={search}
          loading={loading}
          style={{ marginTop: hasSearched ? 15 : -75 }}
          onChange={(value) => setSearch(value)}
          sx={{ margin: "auto" }}
          placeholder="search Questions..."
          numberOfResults={data?.totalResults}
        />
        {hasResults && <QuestionPreviewList questions={results ?? []} />}
        {hasError && <Ups message="Error fetching questions" color="danger" />}
        {hasNoResults && <Ups message="No questions found" />}
      </AppLayout.Main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export default QuestionsIndexPage;
