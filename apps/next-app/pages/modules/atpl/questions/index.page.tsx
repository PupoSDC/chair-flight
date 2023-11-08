import {
  AppHead,
  LayoutModuleAtpl,
  QuestionSearch,
} from "@chair-flight/react/containers";
import { trpc } from "@chair-flight/trpc/client";
import { getTrpcHelper } from "@chair-flight/trpc/server";
import type { GetStaticProps, NextPage } from "next";

const QuestionsIndexPage: NextPage = () => (
  <LayoutModuleAtpl>
    <AppHead />
    <QuestionSearch
      component="section"
      searchQuestions={trpc.questionBankAtpl.searchQuestions}
      getNumberOfQuestions={trpc.questionBankAtpl.getNumberOfQuestions}
    />
  </LayoutModuleAtpl>
);

export const getStaticProps: GetStaticProps = async () => {
  const helper = await getTrpcHelper();
  await Promise.all([helper.questionBankAtpl.getNumberOfQuestions.fetch()]);

  return {
    props: {
      trpcState: helper.dehydrate(),
    },
  };
};

export default QuestionsIndexPage;
