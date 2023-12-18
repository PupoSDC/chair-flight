import { ErrorBoundary } from "react-error-boundary";
import { MissingPathParameter } from "@chair-flight/base/errors";
import type { QuestionBankName } from "@chair-flight/base/types";
import {
  AppHead,
  GlobalColorScheme,
  TestExam,
} from "@chair-flight/react/containers";
import { ssrHandler } from "@chair-flight/trpc/server";
import { ErrorBoundaryFallback } from "./study.page";
import type { NextPage } from "next";

type ExamPageProps = {
  testId: string;
  questionBank: QuestionBankName;
};

type ExamPageParams = {
  testId: string;
  questionBank: QuestionBankName;
};

export const ExamPage: NextPage<ExamPageProps> = ({ testId, questionBank }) => (
  <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
    <AppHead />
    <GlobalColorScheme module={questionBank} />
    <TestExam testId={testId} />
  </ErrorBoundary>
);

export const getServerSideProps = ssrHandler<ExamPageProps, ExamPageParams>(
  async ({ context }) => {
    const testId = context.params?.testId;
    const questionBank = context.params?.questionBank;
    if (!testId) throw new MissingPathParameter("testId");
    if (!questionBank) throw new MissingPathParameter("questionBank");
    return { props: { testId, questionBank } };
  },
);

export default ExamPage;
