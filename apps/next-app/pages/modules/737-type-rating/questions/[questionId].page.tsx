import React from "react";
import { useRouter } from "next/router";
import { default as RadioButtonCheckedIcon } from "@mui/icons-material/RadioButtonChecked";
import { default as RadioButtonUncheckedIcon } from "@mui/icons-material/RadioButtonUnchecked";
import { Box, Button, Grid, useTheme } from "@mui/joy";
import {
  getQuestionPreview,
  getRandomId,
  getRandomShuffler,
} from "@chair-flight/core/app";
import { Header, QuestionVariantPreview } from "@chair-flight/react/components";
import {
  AppHead,
  QuestionReview,
  Sidebar737,
} from "@chair-flight/react/containers";
import { trpc } from "@chair-flight/trpc/client";
import { ssrHandler } from "@chair-flight/trpc/server";
import type { NextPage } from "next";

type QuestionPageParams = {
  questionId: string;
};

type QuestionPageProps = {
  initialVariantId: string;
  initialQuestionId: string;
  initialSeed: string;
};

const shuffle = getRandomShuffler("123");

const QuestionPage: NextPage<QuestionPageProps> = ({
  initialVariantId,
  initialQuestionId,
  initialSeed,
}) => {
  const theme = useTheme();
  const router = useRouter();
  const seed = (router.query["seed"] ?? initialSeed) as string;
  const variantId = (router.query["variantId"] ?? initialVariantId) as string;

  const { data } = trpc.questionBank737.getQuestion.useQuery({
    questionId: initialQuestionId,
  });

  const questionTemplate = data?.questionTemplate;
  const allVariantsMap = data?.questionTemplate?.variants ?? {};
  const allVariantsArray = Object.values(allVariantsMap);
  const variant = allVariantsMap[variantId ?? ""] ?? allVariantsArray[0];

  const updateVariantAndSeed = (query: { variantId: string; seed: string }) => {
    router.pathname;
    router.push({ pathname: router.pathname, query }, undefined, {
      shallow: true,
    });
  };

  return (
    <>
      <AppHead
        linkTitle={`Chair Flight: ${variant.id}`}
        linkDescription={variant.question}
      />
      <Header borderStyle="outlined" />
      <main>
        <Sidebar737 />
        <Grid
          component="section"
          container
          spacing={2}
          padding={2}
          marginLeft="auto"
          width={`var(${theme.dimensions.vars.sidebarRemainingWidth})`}
        >
          <Grid xs={12} md={7} lg={8} xl={9}>
            <QuestionReview
              questionBank="questionBank737"
              questionId={initialQuestionId}
              variantId={variantId}
              seed={seed}
              onQuestionChanged={updateVariantAndSeed}
            />
          </Grid>
          <Grid sx={{ display: { xs: "none", md: "block" } }} xs>
            {questionTemplate &&
              allVariantsArray.map((otherVariant) => (
                <Box
                  component="li"
                  key={otherVariant.id}
                  sx={{ pb: 1, "&:first-of-type": { my: 2 } }}
                >
                  <QuestionVariantPreview
                    component={Button}
                    id={otherVariant.id}
                    variantId={otherVariant.id}
                    text={getQuestionPreview(questionTemplate, otherVariant.id)}
                    learningObjectives={questionTemplate.learningObjectives}
                    externalIds={otherVariant.externalIds}
                    onClick={() => {}}
                    topRightCorner={
                      variantId === otherVariant.id ? (
                        <RadioButtonCheckedIcon color="primary" />
                      ) : (
                        <RadioButtonUncheckedIcon color="primary" />
                      )
                    }
                  />
                </Box>
              ))}
          </Grid>
        </Grid>
      </main>
    </>
  );
};

export const getServerSideProps = ssrHandler<
  QuestionPageProps,
  QuestionPageParams
>(async ({ params, helper, context }) => {
  const { questionId } = params;
  const variantIdFromQuery = context.query?.["variantId"] as string;
  const initialSeed = (context.query?.["seed"] ?? getRandomId()) as string;
  const initialQuestionId = questionId;

  const { questionTemplate } = await helper.questionBank737.getQuestion.fetch({
    questionId,
  });

  const initialVariantId = questionTemplate.variants[variantIdFromQuery]
    ? variantIdFromQuery
    : shuffle(Object.values(questionTemplate.variants))[0].id;

  return {
    props: {
      initialVariantId,
      initialQuestionId,
      initialSeed,
      trpcState: helper.dehydrate(),
    },
  };
});

export default QuestionPage;
