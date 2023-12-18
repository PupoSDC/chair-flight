import type { FC } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useRouter } from "next/router";
import { NoSsr } from "@mui/base";
import { Link, Skeleton, Typography } from "@mui/joy";
import { MissingPathParameter, NotFoundError } from "@chair-flight/base/errors";
import type { QuestionBankName } from "@chair-flight/base/types";
import { Ups } from "@chair-flight/react/components";
import {
  AppHead,
  LayoutModuleBank,
  TestStudy,
} from "@chair-flight/react/containers";
import { ssrHandler } from "@chair-flight/trpc/server";
import type { NextPage } from "next";

type StudyPageProps = {
  testId: string;
  questionBank: QuestionBankName;
};

type StudyPageParams = {
  testId: string;
  questionBank: QuestionBankName;
};

export const ErrorBoundaryFallback: FC<{ error: Error }> = ({ error }) => {
  const router = useRouter();
  const questionBank = router.query["questionBank"] as QuestionBankName;

  const [errorMessage, color] = (() => {
    if (error instanceof NotFoundError) {
      return ["Test not found", undefined];
    }
    return ["Unexpected Error", "danger" as const];
  })();

  return (
    <Ups
      sx={{ height: "100%" }}
      color={color}
      message={errorMessage}
      children={
        <>
          <Typography>
            <Link href={"."} onClick={() => router.reload()}>
              Refresh
            </Link>
          </Typography>
          <Typography>
            or go to <Link href={`/modules/${questionBank}/tests`}>Tests</Link>
          </Typography>
        </>
      }
    />
  );
};

export const StudyPage: NextPage<StudyPageProps> = ({
  testId,
  questionBank,
}) => (
  <LayoutModuleBank questionBank={questionBank} noPadding fixedHeight>
    <AppHead />
    <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
      <NoSsr fallback={<Skeleton height={"500px"} />}>
        <TestStudy testId={testId} />
      </NoSsr>
    </ErrorBoundary>
  </LayoutModuleBank>
);

export const getServerSideProps = ssrHandler<StudyPageProps, StudyPageParams>(
  async ({ context }) => {
    const testId = context.params?.testId;
    const questionBank = context.params?.questionBank;
    if (!testId) throw new MissingPathParameter("testId");
    if (!questionBank) throw new MissingPathParameter("questionBank");
    return { props: { testId, questionBank } };
  },
);

export default StudyPage;
