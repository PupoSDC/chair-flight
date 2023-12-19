import { Divider, Link, Typography } from "@mui/joy";
import {
  AppHead,
  LayoutModuleBank,
  ModulesOverview,
} from "@chair-flight/react/containers";
import {
  getTrpcHelper,
  preloadContentForStaticRender,
} from "@chair-flight/trpc/server";
import type { QuestionBankName } from "@chair-flight/base/types";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";

type QuestionBankIndexPageProps = {
  questionBank: QuestionBankName;
};

type QuestionBankIndexPageParams = {
  questionBank: QuestionBankName;
};

const QuestionBankIndexPage: NextPage<QuestionBankIndexPageProps> = ({
  questionBank,
}) => (
  <LayoutModuleBank questionBank={questionBank}>
    <AppHead />
    <Typography level="h2">Question Bank</Typography>
    <Divider />
    <ModulesOverview module={questionBank} sx={{ my: 2 }} />
    <Typography level="h2">Tests</Typography>
    <Divider sx={{ mb: 2 }} />
    <Link href={`/modules/${questionBank}/tests/create`}>Create New Test</Link>
  </LayoutModuleBank>
);

export const getStaticProps: GetStaticProps<
  QuestionBankIndexPageProps,
  QuestionBankIndexPageParams
> = async ({ params }) => {
  if (!params) throw new Error("Params must be defined. Check File name!");
  await preloadContentForStaticRender(await import("fs/promises"));
  const helper = await getTrpcHelper();

  await Promise.all([
    helper.questionBank.getNumberOfQuestions.fetch({ questionBank: "atpl" }),
    helper.questionBank.getNumberOfQuestions.fetch({ questionBank: "a320" }),
    helper.questionBank.getNumberOfQuestions.fetch({ questionBank: "737" }),
  ]);

  return {
    props: {
      questionBank: params.questionBank,
      trpcState: helper.dehydrate(),
    },
  };
};

export const getStaticPaths: GetStaticPaths<
  QuestionBankIndexPageParams
> = async () => {
  const banks: QuestionBankName[] = ["737", "a320", "atpl"];
  const paths = banks.map((questionBank) => ({ params: { questionBank } }));
  return { fallback: false, paths };
};

export default QuestionBankIndexPage;
