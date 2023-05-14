import { useEffect } from "react";
import { useRouter } from "next/router";
import { Box, Button, Sheet } from "@mui/joy";
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
  TestQuestionNavigation,
} from "@chair-flight/react/components";
import type { GetServerSideProps, NextPage } from "next";
import type { FunctionComponent } from "react";

type ExamPageProps = {
  testId: string;
};

const ExamPageSkeleton: FunctionComponent = () => (
  <>
    <Header removeLogo removeGithubLink />
    <AppLayout.Main>
      <AppLayout.Grid sx={{ maxWidth: 3000, margin: "auto" }}>
        <AppLayout.Column
          xs={12}
          md={8}
          lg={9}
          sx={{ justifyContent: "center" }}
        >
          <Skeleton height={"500px"} />
        </AppLayout.Column>
        <AppLayout.Column
          xs={0}
          md={4}
          lg={3}
          sx={{ justifyContent: "center" }}
        >
          <Skeleton height={"350px"} />
        </AppLayout.Column>
      </AppLayout.Grid>
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

  const navigation = (
    <>
      <TestQuestionNavigation
        data-cy="test-question-navigation"
        sx={{ width: "100%" }}
        status="in-progress"
        currentId={currentQuestion.questionId}
        questions={test.questions.map((q) => ({
          id: q.questionId,
          selectedOption: q.selectedOptionId,
        }))}
        onQuestionClicked={(questionId) =>
          dispatch(
            actions.navigateToTestQuestion({
              testId: test.id,
              questionId,
            })
          )
        }
      />
      <Button
        fullWidth
        sx={{ mt: 2 }}
        children="Finish"
        onClick={() => {
          dispatch(actions.finishTest({ testId: test.id }));
          router.replace(`/tests/${test.id}/review`);
        }}
      />
    </>
  );

  if (test.status === "finished") {
    return <ExamPageSkeleton />;
  }

  return (
    <>
      <Header removeLogo removeGithubLink>
        <Box
          sx={{ display: { xs: "flex", md: "none" }, flexDirection: "column" }}
        >
          {navigation}
        </Box>
      </Header>
      <AppLayout.Main>
        <AppLayout.Grid sx={{ maxWidth: 3000, margin: "auto" }}>
          <AppLayout.Column
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
          </AppLayout.Column>
          <AppLayout.Column
            xs={0}
            md={4}
            lg={3}
            sx={{
              justifyContent: "flex-start",
              display: { xs: "none", md: "flex" },
            }}
          >
            <Sheet variant="outlined" sx={{ p: 2 }}>
              {navigation}
            </Sheet>
          </AppLayout.Column>
        </AppLayout.Grid>
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
