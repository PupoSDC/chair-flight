import {
  AppHead,
  LayoutModuleAtpl,
  QuestionSearch,
} from "@chair-flight/react/containers";
import {
  getTrpcHelper,
  preloadContentForStaticRender,
} from "@chair-flight/trpc/server";
import type { GetStaticProps, NextPage } from "next";

const QuestionsIndexPage: NextPage = () => (
  <LayoutModuleAtpl>
    <AppHead />
    <QuestionSearch component="section" questionBank="atpl" />
  </LayoutModuleAtpl>
);

export const getStaticProps: GetStaticProps = async () => {
  await preloadContentForStaticRender(await import("fs/promises"));

  const helper = await getTrpcHelper();
  await Promise.all([
    helper.questionBank.getNumberOfQuestions.fetch({
      questionBank: "a320",
    }),
  ]);

  return {
    props: {
      trpcState: helper.dehydrate(),
    },
  };
};

export default QuestionsIndexPage;
