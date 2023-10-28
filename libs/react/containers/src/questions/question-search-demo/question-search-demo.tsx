import { useState } from "react";
import { default as KeyboardArrowRightRoundedIcon } from "@mui/icons-material/KeyboardArrowRightRounded";
import { Box, Button, Link, List } from "@mui/joy";
import {
  CtaSearch,
  QuestionVariantPreview,
} from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import type { FunctionComponent } from "react";

const useSearchQuestions = trpc.questionBankAtpl.searchQuestions.useQuery;

export const QuestionSearchDemo: FunctionComponent = () => {
  const [search, setSearch] = useState("Air Law");
  const [hasSearched, setHasSearched] = useState(false);

  const { data, isLoading, isError } = useSearchQuestions({
    q: search,
    limit: 12,
  });

  const hasResults = !isLoading && !isError && data?.totalResults > 0;
  const hasNoResults = !isLoading && !isError && !hasResults && !!search.length;
  const questions = (data?.items ?? []).map((d) => d.result);

  const numberOfResults = (() => {
    if (hasResults) return data?.totalResults;
    if (hasNoResults) return 0;
    return 25974;
  })();

  return (
    <>
      <CtaSearch
        value={search}
        loading={hasSearched && isLoading}
        onChange={(value) => {
          setSearch(value);
          setHasSearched(true);
        }}
        sx={{
          margin: (t) => t.spacing(3, "auto"),
          minHeight: 40,
        }}
        placeholder="search Questions..."
        numberOfResults={numberOfResults}
      />
      <List
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          flexWrap: "no-wrap",
          overflowX: "auto",
          height: 500,
          pt: 2,
        }}
      >
        {questions.map((result) => (
          <Box
            data-cy="question-preview"
            key={result.variantId}
            component="li"
            sx={{ px: 1, width: "90%", maxWidth: 400 }}
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
              sx={{ height: "100%", overflowY: "scroll" }}
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
    </>
  );
};
