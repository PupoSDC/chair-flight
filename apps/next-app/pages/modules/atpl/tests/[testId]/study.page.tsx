import { useRef } from "react";
import { NoSsr } from "@mui/base";
import { Grid, Skeleton } from "@mui/joy";
import { NotFoundError } from "@chair-flight/base/errors";
import {
  AppHead,
  LayoutModuleAtpl,
  TestQuestionNavigation,
  TestQuestionStudy,
  useTestHotkeys,
  useTestProgressTime,
} from "@chair-flight/react/containers";
import { ssrHandler } from "@chair-flight/trpc/server";
import type { TestQuestionNavigationRef } from "@chair-flight/react/containers";
import type { NextPage } from "next";

type StudyPageProps = {
  testId: string;
};

export const StudyPage: NextPage<StudyPageProps> = ({ testId }) => {
  const questionNavigationRef = useRef<TestQuestionNavigationRef>(null);

  useTestHotkeys({ testId });
  useTestProgressTime({ testId });

  return (
    <LayoutModuleAtpl>
      <AppHead />
      <Grid container spacing={2} sx={{ maxWidth: 3000, margin: "auto" }}>
        <Grid xs={12} md={8} lg={9}>
          <NoSsr fallback={<Skeleton height={"500px"} />}>
            <TestQuestionStudy testId={testId} />
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
    </LayoutModuleAtpl>
  );
};

export const getServerSideProps = ssrHandler<StudyPageProps>(
  async ({ context }) => {
    const testId = context.params?.["testId"];
    if (typeof testId !== "string") throw new NotFoundError();
    return { props: { testId } };
  },
);

export default StudyPage;
