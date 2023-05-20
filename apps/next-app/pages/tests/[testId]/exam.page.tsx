import { useEffect } from "react";
import { useRouter } from "next/router";
import { Box, Sheet } from "@mui/joy";
import {
  useAppDispatch,
  useAppSelector,
  actions,
  ReduxProvider,
  useTestHotkeys,
} from "@chair-flight/core/redux";
import { AppHead } from "@chair-flight/next/client";
import {
  Header,
  AppLayout,
  QuestionBoxExam,
  QuestionMultipleChoice,
  Skeleton,
} from "@chair-flight/react/components";
import { ExamNavigation } from "./components/exam-navigation";
import type { GetServerSideProps, NextPage } from "next";
import type { FunctionComponent } from "react";

type ExamPageProps = {
  testId: string;
};

const ExamPageSkeleton: FunctionComponent = () => (
  <>
    <Header removeLogo removeGithubLink />
    <AppLayout.Main>
      <AppLayout.MainGrid sx={{ maxWidth: 3000, margin: "auto" }}>
        <AppLayout.MainGridFixedColumn
          xs={12}
          md={8}
          lg={9}
          sx={{ justifyContent: "center" }}
        >
          <Skeleton height={"500px"} />
        </AppLayout.MainGridFixedColumn>
        <AppLayout.MainGridFixedColumn
          xs={0}
          md={4}
          lg={3}
          sx={{ justifyContent: "center" }}
        >
          <Skeleton height={"350px"} />
        </AppLayout.MainGridFixedColumn>
      </AppLayout.MainGrid>
    </AppLayout.Main>
  </>
);

const ExamPageClient: FunctionComponent<ExamPageProps> = ({ testId }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const test = useAppSelector((state) => state.testProgress.tests[testId]);
  const currentQuestion = test.questions[test.currentQuestionIndex];

  useTestHotkeys({ testId });

  useEffect(() => {
    if (test.status === "finished") {
      router.push(`/tests/${test.id}/review`);
    }
    if (test.status === "created") {
      dispatch(actions.startTest({ testId: test.id }));
    }
  }, [router, test, dispatch]);

  useEffect(() => {
    let lastTime = Date.now();
    const interval = setInterval(() => {
      const currentTime = Date.now();
      const timeSpentInMs = currentTime - lastTime;
      lastTime = currentTime;
      dispatch(
        actions.tickTestTime({
          testId: test.id,
          timeSpentInMs,
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [dispatch, test.id]);

  if (test.status === "finished") {
    return <ExamPageSkeleton />;
  }

  return (
    <>
      <Header removeLogo removeGithubLink>
        <Box
          sx={{ display: { xs: "flex", md: "none" }, flexDirection: "column" }}
        >
          <ExamNavigation testId={testId} />
        </Box>
      </Header>
      <AppLayout.Main>
        <AppLayout.MainGrid sx={{ maxWidth: 3000, margin: "auto" }}>
          <AppLayout.MainGridFixedColumn
            xs={12}
            md={8}
            lg={9}
            sx={{ justifyContent: "flex-start" }}
          >
            <QuestionBoxExam
              sx={{ width: "100%", maxHeight: "100%" }}
              title={`Question ${test.currentQuestionIndex + 1} / ${
                test.questions.length
              }`}
              timeSpentInMs={test.timeSpentInMs}
              timeTotalInMs={test.durationInMs}
              questionIndex={test.currentQuestionIndex}
              totalQuestions={test.questions.length}
              onNavigationClick={(p) => {
                const question = test.questions[p];
                if (!question) return;
                dispatch(
                  actions.navigateToTestQuestion({
                    testId: test.id,
                    questionId: question.questionId,
                  })
                );
              }}
              question={
                <QuestionMultipleChoice
                  data-cy="question"
                  question={currentQuestion.question}
                  status="in-progress"
                  selectedOptionId={currentQuestion.selectedOptionId}
                  onOptionClicked={(optionId) =>
                    dispatch(
                      actions.answerTestQuestion({
                        optionId,
                        testId: test.id,
                        questionId: currentQuestion.questionId,
                      })
                    )
                  }
                  options={currentQuestion.options.map((opt) => ({
                    optionId: opt.id,
                    text: opt.text,
                  }))}
                />
              }
            />
          </AppLayout.MainGridFixedColumn>
          <AppLayout.MainGridFixedColumn
            xs={0}
            md={4}
            lg={3}
            sx={{
              justifyContent: "flex-start",
              display: { xs: "none", md: "flex" },
            }}
          >
            <Sheet variant="outlined" sx={{ p: 2 }}>
              <ExamNavigation testId={testId} />
            </Sheet>
          </AppLayout.MainGridFixedColumn>
        </AppLayout.MainGrid>
      </AppLayout.Main>
    </>
  );
};

export const ExamPage: NextPage<ExamPageProps> = (props) => (
  <>
    <AppHead />
    <ReduxProvider loading={<ExamPageSkeleton />}>
      <ExamPageClient {...props} />
    </ReduxProvider>
  </>
);

export const getServerSideProps: GetServerSideProps<ExamPageProps> = async (
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

export default ExamPage;
