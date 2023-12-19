import { useRouter } from "next/router";
import { MissingPathParameter } from "@chair-flight/base/errors";
import {
  AppHead,
  LayoutModuleBank,
  TestMaker,
} from "@chair-flight/react/containers";
import {
  getTrpcHelper,
  preloadContentForStaticRender,
} from "@chair-flight/trpc/server";
import type { QuestionBankName } from "@chair-flight/base/types";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";

type TestsCreatePageProps = {
  questionBank: QuestionBankName;
};

type TestsCreatePageParams = {
  questionBank: QuestionBankName;
};

const TestsCreatePage: NextPage<TestsCreatePageProps> = ({ questionBank }) => {
  const router = useRouter();

  return (
    <LayoutModuleBank questionBank={questionBank} fixedHeight>
      <AppHead />
      <TestMaker
        component="section"
        questionBank={questionBank}
        sx={{ height: "100%" }}
        onSuccessfulTestCreation={(test) =>
          router.push(`/modules/${questionBank}/tests/${test.id}/${test.mode}`)
        }
      />
    </LayoutModuleBank>
  );
};

export const getStaticProps: GetStaticProps<
  TestsCreatePageProps,
  TestsCreatePageParams
> = async ({ params }) => {
  const questionBank = params?.questionBank;
  if (!questionBank) throw new MissingPathParameter("questionBank");
  await preloadContentForStaticRender(await import("fs/promises"));

  const helper = await getTrpcHelper();
  await helper.questionBank.getAllSubjects.fetch({ questionBank });

  return {
    props: {
      questionBank,
      trpcState: helper.dehydrate(),
    },
  };
};

export const getStaticPaths: GetStaticPaths<
  TestsCreatePageParams
> = async () => {
  const banks: QuestionBankName[] = ["737", "a320", "atpl"];
  const paths = banks.map((questionBank) => ({ params: { questionBank } }));
  return { fallback: false, paths };
};

export default TestsCreatePage;
