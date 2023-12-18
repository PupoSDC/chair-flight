import { ErrorBoundary } from "react-error-boundary";
import { NoSsr } from "@mui/base";
import { Skeleton } from "@mui/joy";
import { MissingPathParameter } from "@chair-flight/base/errors";
import {
  AppHead,
  LayoutModuleBank,
  TestReview,
} from "@chair-flight/react/containers";
import { ssrHandler } from "@chair-flight/trpc/server";
import { ErrorBoundaryFallback } from "./study.page";
import type { QuestionBankName } from "@chair-flight/base/types";
import type { NextPage } from "next";

type ReviewPageProps = {
  testId: string;
  questionBank: QuestionBankName;
};

type ReviewPageParams = {
  testId: string;
  questionBank: QuestionBankName;
};

export const ReviewPage: NextPage<ReviewPageProps> = ({
  testId,
  questionBank,
}) => {
  return (
    <LayoutModuleBank questionBank={questionBank} noPadding>
      <AppHead />
      <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
        <NoSsr fallback={<Skeleton height={"500px"} />}>
          <TestReview testId={testId} />
        </NoSsr>
      </ErrorBoundary>
    </LayoutModuleBank>
  );
};

export const getServerSideProps = ssrHandler<ReviewPageProps, ReviewPageParams>(
  async ({ context }) => {
    const testId = context.params?.testId;
    const questionBank = context.params?.questionBank;
    if (!testId) throw new MissingPathParameter("testId");
    if (!questionBank) throw new MissingPathParameter("questionBank");
    return { props: { testId, questionBank } };
  },
);

export default ReviewPage;
