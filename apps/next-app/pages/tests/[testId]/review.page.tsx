import { Box, CircularProgress, Typography } from "@mui/joy";
import { DateTime } from "luxon";
import { ReduxProvider, useAppSelector } from "@chair-flight/core/redux";
import { AppHead, AppHeaderMenu } from "@chair-flight/next/client";
import {
  Header,
  AppLayout,
  TestQuestionResult,
} from "@chair-flight/react/components";
import type { GetServerSideProps, NextPage } from "next";
import type { FunctionComponent } from "react";

export type ReviewPageProps = {
  testId: string;
};

export type QuestionReviewProps = {
  testId: string;
  questionIndex: number;
};

const QuestionReview: FunctionComponent<QuestionReviewProps> = ({ testId }) => {
  const test = useAppSelector((state) => state.testProgress.tests[testId]);
  const totalQuestions = test.questions.length;
  const correctQuestions = test.questions.reduce(
    (acc, q) => acc + (q.correctOptionId === q.selectedOptionId ? 1 : 0),
    0
  );
  const grade = Math.round((correctQuestions / totalQuestions) * 100);
  const mainColor = grade >= 75 ? "success" : "danger";
  const startTimeInEnglish =
    test.startedAtEpochMs &&
    DateTime.fromMillis(test.startedAtEpochMs).toFormat("DDD");
  const timeSpent =
    test.startedAtEpochMs &&
    DateTime.fromMillis(test.startedAtEpochMs).toFormat("HH:mm:ss");

  return (
    <AppLayout.ScrollableContainer sx={{ p: 0 }}>
      <Box
        sx={{
          height: "200px",
          width: "100%",
          bgcolor: `${mainColor}.softBg`,
        }}
      >
        <Box
          sx={{
            maxWidth: 1300,
            height: "100%",
            p: 2,
            mx: "auto",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              height: "100%",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            <Typography level="h4" component="h1">
              Test results
            </Typography>
            <Typography level="body1" fontWeight={900}>
              {[
                test.id,
                startTimeInEnglish,
                timeSpent && `Time Spent: ${timeSpent}`,
                `${correctQuestions}/${totalQuestions}`,
              ]
                .filter(Boolean)
                .join(" | ")}
            </Typography>
          </Box>
          <CircularProgress
            determinate
            value={grade}
            children={`${grade}%`}
            variant="outlined"
            color={mainColor}
            size="lg"
            sx={{
              "--CircularProgress-size": "120px",
              "--CircularProgress-progressThickness": "12px",
              "--CircularProgress-linecap": "butt",
              m: 2,
            }}
          />
        </Box>
      </Box>
      <Box component={"ul"} sx={{ maxWidth: 1300, px: 2, mx: "auto" }}>
        {test.questions.map((question, i, arr) => (
          <TestQuestionResult
            key={question.questionId}
            questionTemplateId={question.templateId}
            questionVariantId={question.variantId}
            sx={{ my: 1 }}
            title={`${i + 1}/${arr.length}`}
            question={question.question}
            correct={question.selectedOptionId === question.correctOptionId}
            correctOption={
              question.options.find((o) => o.id === question.correctOptionId)
                ?.text
            }
            selectedOption={
              question.options.find((o) => o.id === question.selectedOptionId)
                ?.text
            }
          />
        ))}
      </Box>
    </AppLayout.ScrollableContainer>
  );
};

export const ReviewPage: NextPage<ReviewPageProps> = ({ testId }) => {
  return (
    <>
      <AppHead />
      <Header>
        <AppHeaderMenu />
      </Header>
      <AppLayout.Main sx={{ p: { xs: 0, md: 0 } }}>
        <ReduxProvider loading={"Loading..."}>
          <QuestionReview testId={testId} questionIndex={0} />
        </ReduxProvider>
      </AppLayout.Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<ReviewPageProps> = async (
  ctx
) => {
  const testId = ctx.params?.["testId"];
  if (typeof testId !== "string") return { notFound: true };

  return {
    props: {
      testId,
    },
  };
};

export default ReviewPage;
