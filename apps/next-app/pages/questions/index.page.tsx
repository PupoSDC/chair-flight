import { useEffect, useState } from "react";
import { default as KeyboardArrowRightRoundedIcon } from "@mui/icons-material/KeyboardArrowRightRounded";
import { Box, Button, Link, List, useTheme } from "@mui/joy";
import { default as useAxios } from "axios-hooks";
import { AppHead, AppHeaderMenu } from "@chair-flight/next/client";
import { useWindowSize } from "@chair-flight/react/components";
import {
  Header,
  AppLayout,
  CtaSearch,
  QuestionVariantPreview,
  Ups,
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
    }
  );

  const hasResults = hasSearched && (data?.totalResults ?? 0) > 0;
  const hasError = !loading && error;
  const hasNoResults = hasSearched && !loading && !hasResults && !hasError;

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

        {hasResults && data && (
          <List
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              overflow: "scroll",
            }}
          >
            {data.results.map(({ result }) => (
              <Box
                component="li"
                sx={{
                  px: { xs: 0, md: 1 },
                  py: 1,
                  width: { xs: 1, md: 1 / 2, lg: 1 / 3 },
                }}
                key={result.variantId}
              >
                <QuestionVariantPreview
                  showCorrect
                  id={result.questionId}
                  variantId={`${result.variantId} ${
                    result.numberOfVariants > 1
                      ? `(+${+result.numberOfVariants - 1})`
                      : ""
                  }`}
                  text={result.text}
                  learningObjectives={result.learningObjectives}
                  externalIds={result.externalIds}
                  highLightTerms={[]}
                  topRightCorner={
                    <>
                      <Button
                        size="sm"
                        variant="plain"
                        href={`/questions/${result.questionId}`}
                        component={Link}
                        children={"Go To Question"}
                        endDecorator={<KeyboardArrowRightRoundedIcon />}
                        sx={{
                          px: 1,
                          display: { xs: "none", sm: "flex" },
                        }}
                      />
                      <Button
                        size="sm"
                        variant="plain"
                        href={`/questions/${result.questionId}`}
                        component={Link}
                        children={<KeyboardArrowRightRoundedIcon />}
                        sx={{
                          px: 1,
                          display: { xs: "flex", sm: "none" },
                        }}
                      />
                    </>
                  }
                />
              </Box>
            ))}
          </List>
        )}
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
