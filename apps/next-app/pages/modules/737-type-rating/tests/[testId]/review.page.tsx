import { NoSsr } from "@mui/base";
import { Skeleton } from "@mui/joy";
import { Header, AppLayout } from "@chair-flight/react/components";
import { AppHead, TestReview } from "@chair-flight/react/containers";
import type { GetServerSideProps, NextPage } from "next";

export type ReviewPageProps = {
  testId: string;
};

export const ReviewPage: NextPage<ReviewPageProps> = ({ testId }) => {
  return (
    <>
      <AppHead />
      <Header />
      <AppLayout.Main sx={{ p: { xs: 0, md: 0 } }}>
        <NoSsr fallback={<Skeleton height={"500px"} />}>
          <TestReview testId={testId} />
        </NoSsr>
      </AppLayout.Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<ReviewPageProps> = async (
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

export default ReviewPage;
