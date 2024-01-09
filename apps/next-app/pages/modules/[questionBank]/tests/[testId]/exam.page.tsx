import { MissingPathParameter } from "@chair-flight/base/errors";
import { ThemeOverrideColorScheme } from "@chair-flight/react/components";
import { AppHead, TestExam } from "@chair-flight/react/containers";
import { ssrHandler } from "@chair-flight/trpc/server";
import type { QuestionBankName } from "@chair-flight/base/types";
import type { NextPage } from "next";

type Props = {
  testId: string;
  questionBank: QuestionBankName;
};

type Params = {
  testId: string;
  questionBank: QuestionBankName;
};

export const Page: NextPage<Props> = ({ testId, questionBank }) => (
  <>
    <AppHead />
    <ThemeOverrideColorScheme questionBank={questionBank} />
    <TestExam testId={testId} />
  </>
);

export const getServerSideProps = ssrHandler<Props, Params>(
  async ({ helper, params }) => {
    const testId = params?.testId;
    const questionBank = params?.questionBank;
    if (!testId) throw new MissingPathParameter("testId");
    if (!questionBank) throw new MissingPathParameter("questionBank");
    await TestExam.getData({ helper, params });
    return { props: { testId, questionBank } };
  },
);

export default Page;
