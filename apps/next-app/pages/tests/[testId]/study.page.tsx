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
import { AppHead } from "@chair-flight/next/components";
import {
  Header,
  AppLayout,
  QuestionMultipleChoice,
  Skeleton,
  TestQuestionNavigation,
  QuestionBoxReview,
} from "@chair-flight/react/components";
import type { GetServerSideProps, NextPage } from "next";
import type { FunctionComponent } from "react";

type StudyPageProps = {
  testId: string;
};

const StudyPageSkeleton: FunctionComponent = () => (
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

const StudyPageClient: FunctionComponent<StudyPageProps> = ({ testId }) => {
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
        sx={{ width: "100%" }}
        status="in-progress-with-results"
        pageSize={80}
        currentId={currentQuestion.questionId}
        questions={test.questions.map((q) => ({
          id: q.questionId,
          selectedOption: q.selectedOptionId,
          correctOption: q.correctOptionId,
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
          router.push(`/tests/${test.id}/review`);
        }}
      />
    </>
  );

  if (test.status === "finished") {
    return <StudyPageSkeleton />;
  }

  return (
    <>
      <Header>
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
            <QuestionBoxReview
              sx={{ width: "100%", maxHeight: "100%" }}
              title={`Question ${test.currentQuestionIndex + 1} / ${
                test.questions.length
              }`}
              question={
                <QuestionMultipleChoice
                  question={currentQuestion.question}
                  disabled={currentQuestion.selectedOptionId !== undefined}
                  status={
                    currentQuestion.selectedOptionId
                      ? "show-result"
                      : "in-progress"
                  }
                  selectedOptionId={currentQuestion.selectedOptionId}
                  correctOptionId={currentQuestion.correctOptionId}
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

export const StudyPage: NextPage<StudyPageProps> = (props) => (
  <>
    <AppHead />
    <ReduxProvider loading={<StudyPageSkeleton />}>
      <StudyPageClient {...props} />
    </ReduxProvider>
  </>
);

export const getServerSideProps: GetServerSideProps<StudyPageProps> = async (
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

export default StudyPage;
