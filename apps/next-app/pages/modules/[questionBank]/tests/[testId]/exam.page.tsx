import { useRouter } from "next/router";
import { UserBugReport } from "libs/react/containers/src/user/user-bug-report";
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

export const Page: NextPage<Props> = ({ testId, questionBank }) => {
  const router = useRouter();

  return (
    <>
      <AppHead />
      <ThemeOverrideColorScheme questionBank={questionBank} />
      <TestExam
        noSsr
        testId={testId}
        onTestFinished={() => {
          router.push(`/modules/${questionBank}/tests/${testId}/review`);
        }}
      />
      <UserBugReport />
    </>
  );
};

export const getServerSideProps = ssrHandler<Props, Params>(
  async ({ helper, params }) => {
    await TestExam.getData({ helper, params });
    await UserBugReport.getData({ helper, params });
    return { props: params };
  },
);

export default Page;
