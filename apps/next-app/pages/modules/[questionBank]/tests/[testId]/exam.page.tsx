import {
  AppHead,
  ThemeOverrideColorScheme,
} from "@chair-flight/react/components";
import { TestExam } from "@chair-flight/react/containers";
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
    <TestExam testId={testId} noSsr />
  </>
);

export const getServerSideProps = ssrHandler<Props, Params>(
  async ({ helper, params }) => {
    await TestExam.getData({ helper, params });
    return { props: params };
  },
);

export default Page;
