import { useEffect, useRef } from "react";
import { default as EditIcon } from "@mui/icons-material/Edit";
import { Box, List, Typography, Grid, FormLabel } from "@mui/joy";
import {
  ReduxProvider,
  actions,
  useAppDispatch,
  useAppSelector,
} from "@chair-flight/core/redux";
import { AppHead, AppHeaderMenu } from "@chair-flight/next/client";
import { ssrHandler } from "@chair-flight/next/server";
import { AppLayout, Header } from "@chair-flight/react/components";
import { EditQuestionBody } from "./components/edit-question-body";
import { EditVariant } from "./components/edit-variant";
import { EditVariantModal } from "./components/edit-variant-modal";
import type { QuestionTemplate } from "@chair-flight/base/types";
import type { NextPage } from "next";

type QuestionPageProps = {
  question: QuestionTemplate;
};

const QuestionPageClient: NextPage<QuestionPageProps> = ({ question }) => {
  const dispatch = useAppDispatch();
  const hasPushedInitialHistory = useRef(false);
  const editedQuestion =
    useAppSelector(
      (state) => state.questionEditor.questions[question.id]?.currentVersion
    ) ?? question;
  const variants = Object.values(editedQuestion.variants);

  useEffect(() => {
    if (hasPushedInitialHistory.current) return;
    dispatch(actions.resetQuestionEditor({ question }));
    hasPushedInitialHistory.current = true;
  });

  return (
    <>
      <AppLayout.Header>
        <Box sx={{ display: "flex", alignItems: "baseline" }}>
          <EditIcon sx={{ mx: 1 }} fontSize="xl2" />
          <Typography level="h4">
            {`Editing Question ${question.id}`}
          </Typography>
        </Box>
      </AppLayout.Header>
      <Grid container sx={{ flex: 1, overflow: "hidden" }}>
        <Grid xs={6} lg={4}>
          <EditQuestionBody questionId={question.id} />
        </Grid>
        <Grid xs={6} lg={8} sx={{ height: "100%" }}>
          <FormLabel sx={{ ml: 1 }}>
            {`Variants (${variants.length})`}
          </FormLabel>
          <List
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              overflow: "scroll",
            }}
            children={variants.map((variant) => (
              <EditVariant
                key={variant.id}
                questionId={question.id}
                variantId={variant.id}
              />
            ))}
          />
        </Grid>
      </Grid>
      <EditVariantModal />
    </>
  );
};

export const QuestionPage: NextPage<QuestionPageProps> = ({ question }) => {
  return (
    <>
      <AppHead title={question.id} />
      <Header>
        <AppHeaderMenu />
      </Header>
      <AppLayout.Main>
        <ReduxProvider loading={"loading..."}>
          <QuestionPageClient question={question} />
        </ReduxProvider>
      </AppLayout.Main>
    </>
  );
};

export const getServerSideProps = ssrHandler<QuestionPageProps>(
  async ({ context, questionBank }) => {
    const questionId = context.params?.["questionId"] as string;
    const question = await questionBank.getQuestionTemplate(questionId);
    return {
      props: {
        question,
      },
    };
  }
);

export default QuestionPage;
