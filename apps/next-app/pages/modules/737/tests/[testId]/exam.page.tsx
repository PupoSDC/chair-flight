import { useRef } from "react";
import { NoSsr } from "@mui/base";
import { Grid, Skeleton } from "@mui/joy";
import { NotFoundError } from "@chair-flight/base/errors";
import { Header } from "@chair-flight/react/components";
import {
  AppHead,
  TestQuestionExam,
  TestQuestionNavigation,
  useTestHotkeys,
  useTestProgressTime,
} from "@chair-flight/react/containers";
import { ssrHandler } from "@chair-flight/trpc/server";
import type { TestQuestionNavigationRef } from "@chair-flight/react/containers";
import type { NextPage } from "next";

type ExamPageProps = {
  testId: string;
};

export const ExamPage: NextPage<ExamPageProps> = ({ testId }) => {
  const questionNavigationRef = useRef<TestQuestionNavigationRef>(null);

  useTestHotkeys({ testId });
  useTestProgressTime({ testId });

  return (
    <>
      <AppHead />
      <Header
        remove="all"
        hamburgerBreakpoint="md"
        onHamburgerClick={() => questionNavigationRef.current?.open()}
      />
      <Grid container spacing={2} sx={{ maxWidth: 3000, margin: "auto" }}>
        <Grid xs={12} md={8} lg={9}>
          <NoSsr fallback={<Skeleton height={"500px"} />}>
            <TestQuestionExam testId={testId} />
          </NoSsr>
        </Grid>
        <Grid xs={0} md={4} lg={3}>
          <NoSsr fallback={<Skeleton height={"350px"} />}>
            <TestQuestionNavigation
              ref={questionNavigationRef}
              testId={testId}
            />
          </NoSsr>
        </Grid>
      </Grid>
    </>
  );
};

export const getServerSideProps = ssrHandler<ExamPageProps>(
  async ({ context }) => {
    const testId = context.params?.["testId"];
    if (typeof testId !== "string") throw new NotFoundError();
    return { props: { testId } };
  },
);

export default ExamPage;
