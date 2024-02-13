import { useRouter } from "next/router";
import { TestExam } from "@cf/next/tests";
import { UserBugReport } from "@cf/next/user";
import { AppHead } from "@cf/react/components";
import { ThemeOverrideColorScheme } from "@cf/react/theme";
import { ssrHandler } from "@cf/trpc/server";
import type { QuestionBankName } from "@cf/core/question-bank";
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
