import { NoSsr } from "@mui/base";
import { Skeleton } from "@mui/joy";
import { NotFoundError } from "@chair-flight/base/errors";
import {
  AppHead,
  LayoutModule737,
  TestReview,
} from "@chair-flight/react/containers";
import { ssrHandler } from "@chair-flight/trpc/server";
import type { NextPage } from "next";

export type ReviewPageProps = {
  testId: string;
};

export const ReviewPage: NextPage<ReviewPageProps> = ({ testId }) => {
  return (
    <LayoutModule737 noPadding>
      <AppHead />
      <NoSsr fallback={<Skeleton height={"500px"} />}>
        <TestReview testId={testId} />
      </NoSsr>
    </LayoutModule737>
  );
};

export const getServerSideProps = ssrHandler<ReviewPageProps>(
  async ({ context }) => {
    const testId = context.params?.["testId"];
    if (typeof testId !== "string") throw new NotFoundError();
    return { props: { testId } };
  },
);

export default ReviewPage;
