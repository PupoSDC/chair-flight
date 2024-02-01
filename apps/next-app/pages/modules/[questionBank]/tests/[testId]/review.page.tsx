import { MissingPathParameter } from "@chair-flight/base/errors";
import { AppHead } from "@chair-flight/react/components";
import { LayoutModule, TestReview } from "@chair-flight/react/containers";
import { ssrHandler } from "@chair-flight/trpc/server";
import type { QuestionBankName } from "@chair-flight/core/question-bank";
import type { Breadcrumbs } from "@chair-flight/react/containers";
import type { NextPage } from "next";

type Props = {
  testId: string;
  questionBank: QuestionBankName;
};

type Params = {
  testId: string;
  questionBank: QuestionBankName;
};

const Page: NextPage<Props> = ({ testId, questionBank }) => {
  const crumbs = [
    [questionBank.toUpperCase(), `/modules/${questionBank}`],
    ["Tests", `/modules/${questionBank}/tests`],
    testId,
  ] as Breadcrumbs;

  return (
    <LayoutModule questionBank={questionBank} breadcrumbs={crumbs} noPadding>
      <AppHead />
      <TestReview testId={testId} noSsr />
    </LayoutModule>
  );
};

export const getServerSideProps = ssrHandler<Props, Params>(
  async ({ context }) => {
    const testId = context.params?.testId;
    const questionBank = context.params?.questionBank;
    if (!testId) throw new MissingPathParameter("testId");
    if (!questionBank) throw new MissingPathParameter("questionBank");
    return { props: { testId, questionBank } };
  },
);

export default Page;
