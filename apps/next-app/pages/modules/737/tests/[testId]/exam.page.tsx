import { NotFoundError } from "@chair-flight/base/errors";
import { AppHead, TestExam } from "@chair-flight/react/containers";
import { ssrHandler } from "@chair-flight/trpc/server";
import type { NextPage } from "next";

type ExamPageProps = {
  testId: string;
};

export const ExamPage: NextPage<ExamPageProps> = ({ testId }) => {
  return (
    <>
      <AppHead />
      <TestExam testId={testId} />
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
