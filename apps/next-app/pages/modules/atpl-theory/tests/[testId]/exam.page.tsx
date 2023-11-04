import { NoSsr } from "@mui/base";
import { Sheet, Skeleton } from "@mui/joy";
import { Header, AppLayout } from "@chair-flight/react/components";
import {
  AppHead,
  TestQuestionExam,
  TestQuestionNavigation,
  useTestHotkeys,
  useTestProgressTime,
} from "@chair-flight/react/containers";
import type { GetServerSideProps, NextPage } from "next";

type ExamPageProps = {
  testId: string;
};

export const ExamPage: NextPage<ExamPageProps> = ({ testId }) => {
  useTestHotkeys({ testId });
  useTestProgressTime({ testId });

  return (
    <>
      <AppHead />
      <Header remove="all" />
      <AppLayout.Main>
        <AppLayout.MainGrid sx={{ maxWidth: 3000, margin: "auto" }}>
          <AppLayout.MainGridFixedColumn
            xs={12}
            md={8}
            lg={9}
            sx={{ justifyContent: "center" }}
          >
            <NoSsr fallback={<Skeleton height={"500px"} />}>
              <TestQuestionExam testId={testId} />
            </NoSsr>
          </AppLayout.MainGridFixedColumn>
          <AppLayout.MainGridFixedColumn
            xs={0}
            md={4}
            lg={3}
            sx={{ justifyContent: "center" }}
          >
            <NoSsr fallback={<Skeleton height={"350px"} />}>
              <Sheet variant="outlined" sx={{ p: 2 }}>
                <TestQuestionNavigation testId={testId} />
              </Sheet>
            </NoSsr>
          </AppLayout.MainGridFixedColumn>
        </AppLayout.MainGrid>
      </AppLayout.Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<ExamPageProps> = async (
  ctx,
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
