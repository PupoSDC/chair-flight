import { MissingPathParameter } from "@chair-flight/base/errors";
import type { QuestionBankName } from "@chair-flight/base/types";
import {
  AppHead,
  LayoutModuleBank,
  QuestionSearch,
} from "@chair-flight/react/containers";
import {
  getTrpcHelper,
  preloadContentForStaticRender,
} from "@chair-flight/trpc/server";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";

type QuestionsPageProps = {
  questionBank: QuestionBankName;
};

type QuestionsPageParams = {
  questionBank: QuestionBankName;
};

const QuestionsPage: NextPage<QuestionsPageProps> = ({ questionBank }) => (
  <LayoutModuleBank questionBank={questionBank}>
    <AppHead />
    <QuestionSearch component="section" questionBank={questionBank} />
  </LayoutModuleBank>
);

export const getStaticProps: GetStaticProps<
  QuestionsPageProps,
  QuestionsPageParams
> = async ({ params }) => {
  const questionBank = params?.questionBank;
  if (!questionBank) throw new MissingPathParameter("questionId");
  await preloadContentForStaticRender(await import("fs/promises"));

  const helper = await getTrpcHelper();

  await Promise.all([
    helper.questionBank.getNumberOfQuestions.prefetch({ questionBank }),
  ]);

  return {
    props: {
      questionBank,
      trpcState: helper.dehydrate(),
    },
  };
};

export const getStaticPaths: GetStaticPaths<QuestionsPageParams> = async () => {
  const banks: QuestionBankName[] = ["737", "a320", "atpl"];
  const paths = banks.map((questionBank) => ({ params: { questionBank } }));
  return { fallback: false, paths };
};

export default QuestionsPage;
